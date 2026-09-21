#!/usr/bin/env node
/**
 * Harvests the platform catalogue: every RPG Wikidata files under one of the page's
 * CATALOGUE_PLATFORMS consoles and that has an English Wikipedia article, written into the page's
 * `CATALOGUE` array (one row per game, a `plat` list for the consoles it shares) and
 * `CATALOGUE_META` (the harvest date). The Games tab matches each row to the roster by `wd`, the
 * Wikidata item every BASE_GAMES row already carries, so the join is exact and never a title.
 *
 *   node scripts/fetch_catalogue.mjs                                dry run: counts and the diff
 *   node scripts/fetch_catalogue.mjs --write                        write CATALOGUE and CATALOGUE_META
 *   node scripts/fetch_catalogue.mjs --only "PlayStation 2" [--only …]   just these platforms
 *   node scripts/fetch_catalogue.mjs --today YYYY-MM-DD             pin the harvest date
 *
 * Source: Wikidata's own MediaWiki API, www.wikidata.org, and nothing else.
 *  1. The genre subtree: every item reached from CATALOGUE_META.genre (role-playing video game)
 *     by walking `haswbstatement:P279=<id>` in the search index — 42 items, measured 2026-09-21.
 *  2. Membership per console: `list=search` for `haswbstatement:P31=Q7889` (video game),
 *     `P400=<console>` and `P136=<any subtree genre>`, paged 50 a call. PS2 answers 223, the same
 *     count the query service gave for the property path.
 *  3. Each game once: `wbgetentities` (labels, the enwiki sitelink, claims) in batches of 50, read
 *     with deprecated statements skipped — the earliest P577 year, P400 ∩ the consoles, P136 ∩ the
 *     subtree, P178 and P123 — then one more batch pass for the studios' and genres' labels.
 * The query service (query.wikidata.org) was the first draft's source and is deliberately not
 * used: on 2026-09-21 it timed out on the largest console four times running and took 89 seconds
 * to answer a three-item query, while the search index answered in under a second.
 *
 * Nothing here is written from memory. Each console's Wikidata id sits in the page beside the
 * label it was resolved from, and every run re-reads that label from Wikidata (the `en` slot, or
 * `mul` — a label the same in every language now lives there alone) and refuses on a mismatch, so a
 * wrong id can never harvest quietly. Every run also looks the roster up in the answer (the
 * known-positive guard): the roster games on a catalogued console that Wikidata did not return are
 * reported, and an answer holding NONE of them is refused outright, because an empty answer is
 * indistinguishable from a broken query.
 *
 * A game the search lists but whose entity has no English article, no live console claim or no
 * live subtree genre is LEFT OUT and counted, not refused: that is Wikidata's data, not a fault
 * here. A year outside YEAR_MIN–YEAR_MAX, a string over MAX_TEXT (the page's prose cap), a search
 * whose pages do not add up to its hit count, an API error or a body that is not JSON refuse, and
 * one refusal anywhere means nothing is written.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractScript, extractData } from "./validate_codex.mjs";
import { Refusal, refuse, evalCodex } from "./game_rows.mjs";
import { USER_AGENT, RETRY_DELAYS_MS } from "./fetch_covers.mjs";
import { localToday } from "./dates.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CODEX = join(ROOT, "JRPG_Design_Codex.html");

export const WD_API = "https://www.wikidata.org/w/api.php";
export const VIDEO_GAME = "Q7889";
export const MAX_TEXT = 120;
export const MAX_NAMES = 5;
export const YEAR_MIN = 1980;
export const YEAR_MAX = 2035;
/** Hits a search call returns and ids an entity call takes: the API's cap without a bot flag. */
export const PAGE = 50;
export const BATCH = 50;
/** Between calls. The API asks for serial, unhurried requests; the search index answers in well under a second. */
export const PAUSE_MS = 250;
/** A subtree wider or deeper than this is not a genre tree any more. */
export const MAX_SUBTREE = 500;
export const MAX_DEPTH = 12;
export const RETRY_AFTER_CAP_MS = 60000;
/** The keys a catalogue row may carry, in the order they are written. The validator holds the same list. */
export const ROW_KEYS = ["wd", "t", "y", "plat", "genre", "dev", "pub", "wp"];
const WD_ID = /^Q[1-9]\d*$/;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const isText = v => typeof v === "string" && v.trim() !== "";
const uniq = xs => [...new Set(xs)];

// ------------------------------------------------------------------ the page

/** The page's catalogue consts and, when it has one, its platform fold. */
export function readCatalogue(html) {
  let out;
  try {
    out = new Function(extractData(extractScript(html)) +
      "; return {CATALOGUE_PLATFORMS: typeof CATALOGUE_PLATFORMS === 'undefined' ? null : CATALOGUE_PLATFORMS," +
      " CATALOGUE: typeof CATALOGUE === 'undefined' ? null : CATALOGUE," +
      " CATALOGUE_META: typeof CATALOGUE_META === 'undefined' ? null : CATALOGUE_META," +
      " canonFacet: typeof canonFacet === 'undefined' ? null : canonFacet};")();
  } catch (e) {
    refuse(`the codex data region does not evaluate: ${e.message}`);
  }
  if (!Array.isArray(out.CATALOGUE_PLATFORMS) || !out.CATALOGUE_PLATFORMS.length) refuse("the codex defines no CATALOGUE_PLATFORMS — the consoles to harvest live in the page, not here");
  if (!Array.isArray(out.CATALOGUE)) refuse("the codex defines no CATALOGUE array to write into");
  if (!out.CATALOGUE_META || !WD_ID.test(String(out.CATALOGUE_META.genre ?? ""))) refuse("CATALOGUE_META.genre must name the Wikidata item of the genre root");
  for (const p of out.CATALOGUE_PLATFORMS) {
    if (!isText(p.name) || !WD_ID.test(String(p.wd ?? "")) || !isText(p.label)) refuse(`CATALOGUE_PLATFORMS entry ${JSON.stringify(p)} needs name, wd and label`);
  }
  return out;
}

// ------------------------------------------------------------------ the API

/** `Retry-After` in milliseconds, capped; null when the header is absent or unreadable. */
export function retryAfterMs(value, cap = RETRY_AFTER_CAP_MS) {
  if (value == null) return null;
  const s = String(value).trim();
  if (/^\d+$/.test(s)) return Math.min(Number(s) * 1000, cap);
  const at = Date.parse(s);
  return Number.isFinite(at) ? Math.min(Math.max(at - Date.now(), 0), cap) : null;
}

/**
 * One API answer as JSON. A 429 or a 5xx is retried — `Retry-After` when the service says so, else
 * backoff — and each wait is reported; any other failure, an API error and a body that is not JSON
 * refuse. Only www.wikidata.org is ever fetched.
 *
 * No `maxlag`: on Wikidata that parameter also defers to the QUERY SERVICE's update lag ("Waiting
 * for wdqs1013: 91.25 seconds lagged" while every database replica sat under a second, measured
 * 2026-09-21), which would tie this harvest back to the one service it deliberately does not use.
 * A short, human-run read job is what the parameter's own guidance leaves it off for.
 */
export async function apiJson(params, what, { fetchImpl = fetch, sleepImpl = sleep, delays = RETRY_DELAYS_MS, onWait = () => {} } = {}) {
  const url = WD_API + "?" + new URLSearchParams({ format: "json", ...params });
  const u = new URL(url);
  if (u.protocol !== "https:" || u.hostname !== "www.wikidata.org") refuse(`refusing to fetch ${what} from ${u.hostname}`);
  let res;
  for (let attempt = 0; ; attempt++) {
    res = await fetchImpl(url, { headers: { "User-Agent": USER_AGENT, Accept: "application/json" } });
    const transient = res.status === 429 || res.status >= 500;
    if (!transient || attempt >= delays.length) break;
    const after = retryAfterMs(res.headers && typeof res.headers.get === "function" ? res.headers.get("retry-after") : null);
    const wait = after ?? delays[attempt];
    onWait({ what, status: res.status, ms: wait, attempt: attempt + 1 });
    await sleepImpl(wait);
  }
  if (!res.ok) refuse(`Wikidata answered HTTP ${res.status} for ${what}`);
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { refuse(`Wikidata answered ${what} with something other than JSON: ${text.slice(0, 120).replace(/\s+/g, " ")}`); }
  if (body && body.error) refuse(`Wikidata refused ${what}: ${body.error.code} — ${body.error.info}`);
  return body;
}

/**
 * The mismatches between the page's platform labels and Wikidata's, from one `wbgetentities`
 * answer. A label the same in every language now lives in the `mul` slot with no `en` copy
 * (six of the thirteen consoles, measured 2026-09-21), so either slot may carry it.
 */
export function labelProblems(platforms, body) {
  const ents = body && body.entities;
  if (!ents || typeof ents !== "object") return ["the label check answered without an entities map"];
  const problems = [];
  for (const p of platforms) {
    const got = labelOf(ents[p.wd]);
    if (ents[p.wd] && ents[p.wd].missing !== undefined) problems.push(`${p.wd} (${p.name}): no such Wikidata item`);
    else if (got !== p.label) problems.push(`${p.wd} (${p.name}): Wikidata labels it ${JSON.stringify(got ?? null)}, the page says ${JSON.stringify(p.label)} — the id or the label is wrong`);
  }
  return problems;
}

/** An entity's English label, or its multilingual one. */
export function labelOf(entity) {
  const ls = (entity && entity.labels) || {};
  return (ls.en && ls.en.value) ?? (ls.mul && ls.mul.value) ?? null;
}

/** Wikidata's labels for the platform ids, checked against the page's. */
export async function verifyPlatforms(platforms, net) {
  const body = await apiJson({ action: "wbgetentities", ids: platforms.map(p => p.wd).join("|"), props: "labels", languages: "en|mul" }, "the platform labels", net);
  const problems = labelProblems(platforms, body);
  if (problems.length) refuse(`platform ids do not match their labels:\n  ${problems.join("\n  ")}`);
}

/**
 * Every hit of a search, paged to the end. Every hit of a statement-only search scores the same,
 * so relevance order shifts between pages (Nintendo DS came back 186 distinct over 187 hits,
 * measured 2026-09-21); the pages are taken in creation order instead, which is stable. The
 * distinct ids must still add up to the reported hit count: the index moving under the paging
 * would otherwise drop or double a game unseen.
 */
export async function search(srsearch, net, { pauseMs = PAUSE_MS } = {}) {
  const what = `search ${JSON.stringify(srsearch.length > 70 ? srsearch.slice(0, 70) + "…" : srsearch)}`;
  const ids = [];
  let offset = 0, total = null;
  for (let page = 0; ; page++) {
    if (page) await (net.sleepImpl ?? sleep)(pauseMs);
    const body = await apiJson({ action: "query", list: "search", srsearch, srsort: "create_timestamp_asc", srlimit: String(PAGE), sroffset: String(offset), srinfo: "totalhits", srprop: "" }, what, net);
    const q = body && body.query;
    if (!q || !Array.isArray(q.search)) refuse(`${what} answered without a search list`);
    if (total == null) total = q.searchinfo && Number.isInteger(q.searchinfo.totalhits) ? q.searchinfo.totalhits : null;
    for (const h of q.search) ids.push(h.title);
    const next = body.continue && body.continue.sroffset;
    if (next == null) break;
    if (!q.search.length) refuse(`${what}: a page came back empty with more promised`);
    offset = Number(next);
  }
  const distinct = uniq(ids);
  if (total != null && distinct.length !== total) refuse(`${what}: ${distinct.length} distinct ids over the pages, ${total} hits reported — the index moved under the paging; re-run`);
  return distinct;
}

/** The root and everything below it by P279, walked breadth-first through the search index. Sorted. */
export async function subtree(root, net, opts) {
  const seen = new Set([root]);
  let frontier = [root];
  for (let depth = 0; frontier.length; depth++) {
    if (depth >= MAX_DEPTH) refuse(`the genre subtree under ${root} is deeper than ${MAX_DEPTH} — not a genre tree`);
    const next = [];
    for (const q of frontier) {
      for (const child of await search(`haswbstatement:P279=${q}`, net, opts)) {
        if (!WD_ID.test(child) || seen.has(child)) continue;
        seen.add(child);
        next.push(child);
      }
      if (seen.size > MAX_SUBTREE) refuse(`the genre subtree under ${root} passed ${MAX_SUBTREE} items — not a genre tree`);
    }
    frontier = next;
  }
  return [...seen].sort();
}

/** The search for one console's games in the genre subtree. */
export function membershipQuery(platWd, genreIds) {
  return `haswbstatement:P31=${VIDEO_GAME} haswbstatement:P400=${platWd} haswbstatement:${genreIds.map(g => `P136=${g}`).join("|")}`;
}

/** Entities by id, in batches, as one map. A missing id is a refusal: the search just listed it. */
export async function entities(ids, props, net, { pauseMs = PAUSE_MS, extra = {} } = {}) {
  const out = new Map();
  const all = uniq(ids);
  for (let i = 0; i < all.length; i += BATCH) {
    if (i) await (net.sleepImpl ?? sleep)(pauseMs);
    const slice = all.slice(i, i + BATCH);
    const body = await apiJson({ action: "wbgetentities", ids: slice.join("|"), props, ...extra }, `entities ${slice[0]}…${slice.at(-1)} (${slice.length})`, net);
    const ents = body && body.entities;
    if (!ents || typeof ents !== "object") refuse(`the entity call for ${slice[0]}… answered without an entities map`);
    for (const id of slice) {
      if (!ents[id] || ents[id].missing !== undefined) refuse(`Wikidata has no item ${id}, which its own search just listed`);
      out.set(id, ents[id]);
    }
  }
  return out;
}

// ------------------------------------------------------------------ reading entities

/** The main values of a property's statements, deprecated ones skipped. */
export function claimValues(entity, prop) {
  const out = [];
  for (const st of (entity && entity.claims && entity.claims[prop]) || []) {
    if (st.rank === "deprecated") continue;
    const dv = st.mainsnak && st.mainsnak.datavalue && st.mainsnak.datavalue.value;
    if (dv != null) out.push(dv);
  }
  return out;
}

const itemIds = vs => uniq(vs.map(x => x && x.id).filter(id => WD_ID.test(String(id ?? ""))));

/** The years among a time property's values, precision year or finer. */
export function yearsOf(values) {
  const out = [];
  for (const t of values) {
    if (!t || typeof t.time !== "string" || !(t.precision >= 9)) continue;
    const m = t.time.match(/^\+?(-?\d{1,16})-/);
    if (m) out.push(Number(m[1]));
  }
  return out;
}

/**
 * One entity -> what a row needs, or `{skip}` with why it is left out (no English article, no
 * live console or genre claim). Ids only; the labels come in a second pass.
 */
export function recordOf(wd, entity, platformIds, genreIds) {
  const wp = entity && entity.sitelinks && entity.sitelinks.enwiki && entity.sitelinks.enwiki.title;
  if (!isText(wp)) return { wd, skip: "no English Wikipedia article" };
  const plat = itemIds(claimValues(entity, "P400")).filter(id => platformIds.has(id));
  if (!plat.length) return { wd, skip: "no live claim for a catalogued console" };
  const genre = itemIds(claimValues(entity, "P136")).filter(id => genreIds.has(id));
  if (!genre.length) return { wd, skip: "no live claim for a genre in the subtree" };
  const years = yearsOf(claimValues(entity, "P577"));
  return { wd, t: labelOf(entity) ?? wp.trim(), wp: wp.trim(), y: years.length ? Math.min(...years) : null, plat, genre, dev: itemIds(claimValues(entity, "P178")), pub: itemIds(claimValues(entity, "P123")) };
}

/**
 * A record with its ids named -> a row, or a problem. `names` maps an id to its label; a studio
 * or genre with no label is left off the row (and counted by the caller), never written as an id.
 */
export function toRow(rec, names, platforms) {
  const order = new Map(platforms.map((p, i) => [p.wd, i]));
  const nameOf = id => names.get(id) ?? null;
  const named = ids => uniq(ids.map(nameOf).filter(isText)).sort();
  const row = {
    wd: rec.wd, t: rec.t, y: rec.y,
    plat: [...rec.plat].sort((a, b) => order.get(a) - order.get(b)).map(id => platforms[order.get(id)].name),
    genre: named(rec.genre), dev: named(rec.dev).slice(0, MAX_NAMES), pub: named(rec.pub).slice(0, MAX_NAMES), wp: rec.wp,
  };
  const label = `${row.t} (${row.wd})`;
  if (row.y != null && (row.y < YEAR_MIN || row.y > YEAR_MAX)) return { problem: `${label}: year ${row.y} is outside ${YEAR_MIN}–${YEAR_MAX}` };
  if (!row.genre.length) return { problem: `${label}: none of its genres has a label` };
  const long = [row.t, row.wp, ...row.genre, ...row.dev, ...row.pub].find(s => s.length > MAX_TEXT);
  if (long) return { problem: `${label}: ${JSON.stringify(long.slice(0, 50))}… is ${long.length} chars — longer than ${MAX_TEXT}, and prose is not stored` };
  return { row, unnamed: [...rec.genre, ...rec.dev, ...rec.pub].filter(id => !isText(nameOf(id))) };
}

// ------------------------------------------------------------------ rows

/** By title, then by id, in code-point order — the order the validator holds the block to. */
export function sortRows(rows) {
  return [...rows].sort((p, q) => (p.t < q.t ? -1 : p.t > q.t ? 1 : p.wd < q.wd ? -1 : p.wd > q.wd ? 1 : 0));
}

/**
 * Rows from a harvest and rows kept from the page folded to one per game: `plat` in
 * CATALOGUE_PLATFORMS order, the earliest year, the union of labels. Sorted.
 */
export function mergeRows(rowLists, platformNames) {
  const order = new Map(platformNames.map((n, i) => [n, i]));
  const byWd = new Map();
  for (const rows of rowLists) for (const r of rows) {
    const have = byWd.get(r.wd);
    if (!have) { byWd.set(r.wd, { ...r, plat: [...r.plat], genre: [...r.genre], dev: [...(r.dev ?? [])], pub: [...(r.pub ?? [])] }); continue; }
    have.plat = uniq([...have.plat, ...r.plat]);
    have.y = have.y == null ? r.y : r.y == null ? have.y : Math.min(have.y, r.y);
    have.genre = uniq([...have.genre, ...r.genre]).sort();
    have.dev = uniq([...have.dev, ...(r.dev ?? [])]).sort().slice(0, MAX_NAMES);
    have.pub = uniq([...have.pub, ...(r.pub ?? [])]).sort().slice(0, MAX_NAMES);
  }
  for (const r of byWd.values()) r.plat.sort((a, b) => (order.get(a) ?? 1e9) - (order.get(b) ?? 1e9));
  return sortRows([...byWd.values()]);
}

/** The rows with these platforms taken off them; a row left with no platform goes. */
export function withoutPlatforms(rows, names) {
  const drop = new Set(names);
  return rows.map(r => ({ ...r, plat: (r.plat ?? []).filter(p => !drop.has(p)) })).filter(r => r.plat.length);
}

/**
 * The known-positive guard. `canon` folds a roster platform string to the page's spelling (the
 * page's canonFacet), so "Super Famicom" and "PlayStation Portable" find their consoles.
 * `expected` are the roster games on the consoles harvested; `folded` those on ANY catalogued
 * console, which is how a broken fold shows: a roster with consoles on it and nothing folding.
 */
export function rosterReport(rows, games, platformNames, canon = s => s, allNames = platformNames) {
  const names = new Set(platformNames), every = new Set(allNames);
  const byWd = new Set(rows.map(r => r.wd));
  const platsOf = g => [...(g.gf && g.gf.plat ? [g.gf.plat] : []), ...((g.gf && g.gf.also) || []), ...((g.infobox && g.infobox.plat) || [])].map(p => canon(p));
  const withId = games.filter(g => WD_ID.test(String(g.wd ?? "")));
  const folded = withId.filter(g => platsOf(g).some(p => every.has(p)));
  const expected = withId.filter(g => platsOf(g).some(p => names.has(p)));
  const found = expected.filter(g => byWd.has(g.wd));
  const missing = expected.filter(g => !byWd.has(g.wd));
  return { expected, found, missing, folded };
}

// ------------------------------------------------------------------ writing

const lit = r => "{" + ROW_KEYS
  .filter(k => r[k] !== undefined && !(Array.isArray(r[k]) && !r[k].length && (k === "dev" || k === "pub")))
  .map(k => `${k}:${JSON.stringify(r[k])}`).join(",") + "}";

/** The rows as the page stores them: one per line, sorted, empty dev/pub omitted. */
export function renderRows(rows) {
  return sortRows(rows).map(lit).join(",\n");
}

/* The block is the lines from `const CATALOGUE = [` to the first line that is exactly `];`,
   which an empty block (`[` then `];`) satisfies too. */
const BLOCK = /\nconst CATALOGUE = \[\n([\s\S]*?)^\];/m;
const META = /\nconst CATALOGUE_META = \{[^\n]*\};/;

/** The page with CATALOGUE and CATALOGUE_META replaced. Refuses a missing or ambiguous block, or a result that does not evaluate. */
export function writeCatalogue(html, rows, meta) {
  const blocks = html.match(new RegExp(BLOCK.source, BLOCK.flags + "g")) || [];
  if (blocks.length !== 1) refuse(`expected exactly one \`const CATALOGUE = [\` block, found ${blocks.length}`);
  if ((html.match(new RegExp(META.source, META.flags + "g")) || []).length !== 1) refuse("expected exactly one `const CATALOGUE_META = {…};` line");
  const body = renderRows(rows);
  const next = html
    .replace(BLOCK, () => `\nconst CATALOGUE = [\n${body}${body ? "\n" : ""}];`)
    .replace(META, () => `\nconst CATALOGUE_META = {source:${JSON.stringify(meta.source)}, genre:${JSON.stringify(meta.genre)}, at:${JSON.stringify(meta.at)}};`);
  const back = readCatalogue(next);
  if (back.CATALOGUE.length !== rows.length) refuse(`the rewritten page evaluates to ${back.CATALOGUE.length} rows, not ${rows.length} — nothing written`);
  return next;
}

/** Added, removed and changed rows between two catalogues, by wd. */
export function diffRows(before, after) {
  const a = new Map(before.map(r => [r.wd, lit(r)])), b = new Map(after.map(r => [r.wd, lit(r)]));
  return {
    added: after.filter(r => !a.has(r.wd)),
    removed: before.filter(r => !b.has(r.wd)),
    changed: after.filter(r => a.has(r.wd) && a.get(r.wd) !== b.get(r.wd)),
  };
}

// ------------------------------------------------------------------ harvest

/**
 * Verify the console ids, walk the genre subtree, search each selected console, read every game
 * once, name its studios and genres, merge with the rows kept from the page (the consoles not
 * selected), run the roster guard and, when nothing refused, rewrite the page. Returns
 * {html, rows, counts, report, leftOut, unnamed, changed}; `html` is the input untouched when
 * `changed` is false.
 */
export async function harvest(html, { only = [], today, fetchImpl = fetch, sleepImpl = sleep, pauseMs = PAUSE_MS, canon = null, onLog = () => {}, onWait = () => {} } = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(today))) refuse("today must be YYYY-MM-DD");
  const page = readCatalogue(html);
  const platforms = page.CATALOGUE_PLATFORMS;
  const names = platforms.map(p => p.name);
  for (const n of only) if (!names.includes(n)) refuse(`--only ${JSON.stringify(n)}: CATALOGUE_PLATFORMS lists no such platform (${names.join(", ")})`);
  const chosen = platforms.filter(p => !only.length || only.includes(p.name));
  const fold = canon || (typeof page.canonFacet === "function" ? s => page.canonFacet("platform", s) : s => s);
  const net = { fetchImpl, sleepImpl, onWait };
  const pace = { pauseMs };
  const wait = () => sleepImpl(pauseMs);

  await verifyPlatforms(platforms, net);
  onLog(`platform ids verified against their Wikidata labels (${platforms.length})`);
  await wait();
  const genres = await subtree(page.CATALOGUE_META.genre, net, pace);
  onLog(`genre subtree: ${genres.length} items under ${page.CATALOGUE_META.genre}`);
  const genreSet = new Set(genres), platformIds = new Set(platforms.map(p => p.wd));

  const hits = new Map();
  for (const p of chosen) {
    await wait();
    const ids = await search(membershipQuery(p.wd, genres), net, pace);
    onLog(`${p.name}: ${ids.length} search hit(s)`);
    for (const id of ids) hits.set(id, p.name);
  }
  await wait();
  const ents = await entities([...hits.keys()], "labels|sitelinks|claims", net, { ...pace, extra: { languages: "en|mul", sitefilter: "enwiki" } });
  const records = [], leftOut = {};
  for (const [wd, e] of ents) {
    const rec = recordOf(wd, e, platformIds, genreSet);
    if (rec.skip) leftOut[rec.skip] = (leftOut[rec.skip] ?? 0) + 1;
    else records.push(rec);
  }
  for (const [why, n] of Object.entries(leftOut)) onLog(`left out: ${n} with ${why}`);

  const nameIds = uniq(records.flatMap(r => [...r.genre, ...r.dev, ...r.pub]));
  await wait();
  const names2 = new Map();
  for (const [id, e] of await entities(nameIds, "labels", net, { ...pace, extra: { languages: "en|mul" } })) names2.set(id, labelOf(e));
  const fresh = [], problems = [], unnamed = new Set();
  for (const rec of records) {
    const r = toRow(rec, names2, platforms);
    if (r.problem) problems.push(r.problem);
    else { fresh.push(r.row); r.unnamed.forEach(id => unnamed.add(id)); }
  }
  if (problems.length) refuse(`${problems.length} game(s) refused; nothing written:\n  ${problems.slice(0, 20).join("\n  ")}${problems.length > 20 ? `\n  … and ${problems.length - 20} more` : ""}`);
  if (unnamed.size) onLog(`${unnamed.size} studio or genre id(s) with no English label were left off their rows: ${[...unnamed].slice(0, 8).join(", ")}${unnamed.size > 8 ? "…" : ""}`);

  const kept = only.length ? withoutPlatforms(page.CATALOGUE, only) : [];
  // A row only ever carries the consoles it was harvested for: a game found through PSP whose
  // claims also name PS2 keeps PS2 only when PS2 was harvested (or kept from the page).
  const scope = new Set(chosen.map(p => p.name));
  const scoped = fresh.map(r => ({ ...r, plat: r.plat.filter(p => scope.has(p)) })).filter(r => r.plat.length);
  const rows = mergeRows([kept, scoped], names);
  const { BASE_GAMES } = evalCodex(html);
  const report = rosterReport(rows, BASE_GAMES, chosen.map(p => p.name), fold, names);
  // Two ways the guard can be blind, both refused: nothing folds (the fold is broken, so nothing
  // was ever expected), and something was expected but nothing came back.
  const withConsoles = BASE_GAMES.some(g => WD_ID.test(String(g.wd ?? "")) && ((g.gf && g.gf.plat) || (g.infobox && g.infobox.plat && g.infobox.plat.length)));
  if (withConsoles && !report.folded.length) refuse("no roster game folds onto any catalogued console — the platform fold is broken, so the known-positive guard would pass empty");
  if (report.expected.length && !report.found.length) {
    refuse(`none of the ${report.expected.length} roster games on these consoles came back — an answer with no known positive in it is not an answer`);
  }
  const foundWd = new Set(report.found.map(g => g.wd));
  const counts = {};
  for (const p of chosen) {
    const on = rows.filter(r => r.plat.includes(p.name));
    counts[p.name] = { all: on.length, in: on.filter(r => foundWd.has(r.wd)).length };
  }

  const changed = renderRows(page.CATALOGUE) !== renderRows(rows);
  const meta = { source: "wikidata", genre: page.CATALOGUE_META.genre, at: today };
  return { html: changed ? writeCatalogue(html, rows, meta) : html, rows, counts, report, leftOut, unnamed: [...unnamed], changed };
}

// ---------------------------------------------------------------------- main

async function main(argv) {
  const write = argv.includes("--write");
  const arg = (flag, dflt) => (argv.includes(flag) ? argv[argv.indexOf(flag) + 1] : dflt);
  const only = argv.flatMap((a, i) => (a === "--only" ? [argv[i + 1]] : []));
  const codexPath = resolve(ROOT, arg("--codex", CODEX));
  const html = readFileSync(codexPath, "utf8");
  const before = readCatalogue(html).CATALOGUE;
  const { html: next, rows, counts, report, changed } = await harvest(html, {
    only, today: arg("--today", localToday()),
    onLog: line => console.log(line),
    onWait: w => console.log(`  HTTP ${w.status} on ${w.what}: waiting ${(w.ms / 1000).toFixed(0)}s (retry ${w.attempt})`),
  });
  console.log("");
  for (const [name, c] of Object.entries(counts)) console.log(`  ${name.padEnd(18)} ${String(c.all).padStart(4)} game(s), ${c.in} in the codex`);
  console.log(`  ${"total".padEnd(18)} ${String(rows.length).padStart(4)} game(s), ${report.found.length} of the ${report.expected.length} roster games on these consoles found`);
  if (report.missing.length) {
    console.log("\nroster games Wikidata did not return (a gap in its platform or genre claims, or a wd on the wrong article):");
    for (const g of report.missing) console.log(`  ${g.title} (${g.wd})`);
  }
  const d = diffRows(before, rows);
  console.log(`\n${d.added.length} added, ${d.removed.length} removed, ${d.changed.length} changed against the page's ${before.length} row(s)`);
  for (const r of d.removed.slice(0, 10)) console.log(`  - ${r.t} (${r.wd})`);
  for (const r of d.changed.slice(0, 10)) console.log(`  ~ ${r.t} (${r.wd})`);
  if (!changed) { console.log("\nthe page already holds this catalogue; nothing to write"); return; }
  if (!write) { console.log("\ndry run: nothing written. Re-run with --write to apply."); return; }
  writeFileSync(codexPath, next);
  console.log(`\nwrote ${rows.length} row(s) to CATALOGUE`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main(process.argv.slice(2)).catch(e => {
    if (!(e instanceof Refusal)) throw e;
    console.error(`refused: ${e.message}`);
    process.exit(1);
  });
}
