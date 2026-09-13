#!/usr/bin/env node
/**
 * Harvests each roster game's Wikipedia infobox into `infobox` on its BASE_GAMES row: every
 * platform, genre, developer, publisher and series, the credits (directors, producers, designers,
 * programmers, artists, writers, composers) and the engine.
 *
 *   node scripts/fetch_infobox.mjs                               dry run over every row
 *   node scripts/fetch_infobox.mjs --write                       write the rows, log them in CHANGES
 *   node scripts/fetch_infobox.mjs --only "<title>" [--only …]   just these rows
 *   node scripts/fetch_infobox.mjs --only "<title>" --note "<text>" --write
 *                                                                a word on an article broader than the row
 *
 * Source: the MediaWiki API's `action=parse` on the row's `wp` article (section 0), as RENDERED
 * HTML. An infobox's wikitext spells one list half a dozen ways — {{Plainlist}}, {{Video game
 * release}}, <br>-joined, comma-joined — and the rendered `infobox-label` / `infobox-data` table
 * is one shape. Measured on all 72 rows, 2026-09-13.
 *
 * A data cell yields its list items (`<li>`, `<br>` and block boundaries), with footnotes and
 * inline styles dropped, a region prefix ("JP:", "JP/NA:") stripped when every code is a known
 * region and refused otherwise, and every BOLD run dropped: in an infobox data cell bold is a
 * group header for a re-release ("The Ivalice Chronicles", "Second Story R", "Original"), which
 * a naive reading files as a platform. Platform and genre items are also split on commas outside
 * parentheses. Strings are stored as written — "Chunsoft (SFC)" keeps its qualifier, which the
 * page's fold drops — and capped at 120 characters like `gf`, because no prose is stored.
 *
 * Every refusal is printed before anything is written: a label it has not seen (extend LABELS
 * deliberately), an unknown region code, a platform or genre the page's FACET_VOCAB does not list
 * (the validator would refuse the page anyway; add the entry by hand), a string over 120
 * characters, an article with no infobox or no platforms, and a resolved title that is not the
 * row's `wp`. A failed fetch is recorded against its row and the run carries on.
 *
 * A second call per row (`action=query` for categories and page properties) records `wd`, the
 * article's Wikidata item, and `wpcats`, every visible category as Wikipedia names it: the
 * "Category:" prefix dropped, underscores read as spaces, sorted and deduped. Which categories
 * become filters is the page's CATEGORY_FACETS, so re-curating never needs a re-harvest. It
 * refuses a truncated list (`continue` in the answer), an article with no Wikidata item or no
 * categories, a category over 120 characters, and a resolved title that is not `wp`.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractScript, extractData } from "./validate_codex.mjs";
import { Refusal, refuse, evalCodex, setOwnedFields, canonInfobox } from "./game_rows.mjs";
import { API, USER_AGENT, RETRY_DELAYS_MS } from "./fetch_covers.mjs";
import { localToday } from "./dates.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CODEX = join(ROOT, "JRPG_Design_Codex.html");

export const MAX_TEXT = 120;
const PAUSE_MS = 1000;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const isText = v => typeof v === "string" && v.trim() !== "";

/** Infobox label -> infobox key. `null` = known and deliberately not stored. */
export const LABELS = {
  Platform: "plat", Platforms: "plat", Genre: "genre", Genres: "genre",
  Developer: "dev", Developers: "dev", Publisher: "pub", Publishers: "pub", Series: "series",
  Director: "dir", Directors: "dir", Producer: "prod", Producers: "prod",
  Designer: "des", Designers: "des", Programmer: "prog", Programmers: "prog",
  Artist: "art", Artists: "art", Writer: "wri", Writers: "wri",
  Composer: "comp", Composers: "comp", Engine: "engine",
  // The row's `year` and `gf.rel` already carry the release; single-player is not a design fact.
  Release: null, Releases: null, Mode: null, Modes: null,
};
/** The region codes the roster's infoboxes prefix a publisher with (measured 2026-09-13). */
export const REGIONS = new Set(["JP", "WW", "NA", "EU", "AU", "PAL", "US", "UK", "KR", "CHN"]);
const SPLIT_KEYS = new Set(["plat", "genre"]);
const FACET_KIND = { plat: "platform", genre: "genre" };

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—" };
export function decodeEntities(s) {
  return String(s).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] !== "#") return ENTITIES[e.toLowerCase()] ?? m;
    const n = /^#x/i.test(e) ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return Number.isFinite(n) ? String.fromCodePoint(n) : m;
  });
}

/** Every label/data row of the article's infobox, in order, or null when it has none. */
export function parseInfobox(html) {
  const s = String(html ?? "");
  const start = s.search(/<table\b[^>]*class="[^"]*\binfobox\b/);
  if (start < 0) return null;
  const row = /<th\b[^>]*class="[^"]*\binfobox-label\b[^"]*"[^>]*>([\s\S]*?)<\/th>\s*<td\b[^>]*class="[^"]*\binfobox-data\b[^"]*"[^>]*>([\s\S]*?)<\/td>/g;
  return [...s.slice(start).matchAll(row)].map(m => ({
    label: decodeEntities(m[1].replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim(),
    cell: m[2],
  }));
}

/** A data cell's items, in order, with duplicates and punctuation-only fragments dropped. */
export function cellItems(cellHtml) {
  const text = String(cellHtml)
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/<sup\b[\s\S]*?<\/sup>/gi, "")
    .replace(/<b\b[^>]*>[\s\S]*?<\/b>/gi, "\n")
    .replace(/<\/?(li|ul|ol|div|p|br|table|tbody|tr|td)\b[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "");
  const out = [];
  for (const line of decodeEntities(text).split("\n")) {
    const v = line.replace(/\s+/g, " ").trim();
    if (/[\p{L}\p{N}]/u.test(v) && !out.includes(v)) out.push(v);
  }
  return out;
}

/** "JP: Square" -> "Square". A prefix naming a code outside REGIONS is a problem, not a guess. */
export function stripRegion(item) {
  const m = String(item).match(/^([A-Z]{2,4}(?:\/[A-Z]{2,4})*):\s*(.*)$/);
  if (!m) return { value: item };
  const unknown = m[1].split("/").filter(c => !REGIONS.has(c));
  if (unknown.length) return { value: item, problem: `unknown region code ${unknown.map(c => JSON.stringify(c)).join(", ")} in ${JSON.stringify(item)}` };
  return { value: m[2].trim() };
}

/** "PlayStation 2 (Remake, HD), Android" -> ["PlayStation 2 (Remake, HD)", "Android"]. */
export function splitOutsideParens(s) {
  const out = [];
  let depth = 0, cur = "";
  for (const ch of String(s)) {
    if (ch === "(") depth++;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    if (ch === "," && depth === 0) { out.push(cur); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map(x => x.trim()).filter(Boolean);
}

/**
 * The rows -> {infobox, problems}. `lookup(kind, raw)` is the page's facetLookup: a platform or
 * genre it cannot place (`via` null) is a problem, because the validator holds both tables closed.
 */
export function infoboxOf(rows, { lookup } = {}) {
  if (!rows || !rows.length) return { infobox: null, problems: ["the article has no infobox"] };
  const ib = {}, problems = [], from = new Map();
  for (const { label, cell } of rows) {
    if (!Object.hasOwn(LABELS, label)) { problems.push(`unknown infobox label ${JSON.stringify(label)} — extend LABELS in scripts/fetch_infobox.mjs deliberately`); continue; }
    const key = LABELS[label];
    if (key === null) continue;
    if (from.has(key)) { problems.push(`infobox labels ${JSON.stringify(from.get(key))} and ${JSON.stringify(label)} both map to ${key}`); continue; }
    from.set(key, label);
    const items = [];
    for (const raw of cellItems(cell)) {
      const { value, problem } = stripRegion(raw);
      if (problem) { problems.push(`${label}: ${problem}`); continue; }
      for (const v of SPLIT_KEYS.has(key) ? splitOutsideParens(value) : [value]) if (v && !items.includes(v)) items.push(v);
    }
    if (items.length) ib[key] = items;
  }
  for (const [key, items] of Object.entries(ib)) {
    for (const v of items) {
      if (v.length > MAX_TEXT) problems.push(`${key}: ${JSON.stringify(v.slice(0, 50))}… is ${v.length} chars — longer than ${MAX_TEXT}, and prose is not stored`);
      if (lookup && FACET_KIND[key]) {
        const hit = lookup(FACET_KIND[key], v);
        if (!hit || hit.via == null) problems.push(`${FACET_KIND[key]} ${JSON.stringify(v)} is not in the page's FACET_VOCAB.${FACET_KIND[key]} — add it, or file it as a spelling of one, then re-run`);
      }
    }
  }
  if (!ib.plat) problems.push("the infobox lists no platform");
  return { infobox: ib, problems };
}

/** One MediaWiki API call's JSON. A 429 or a 5xx is retried with backoff; any other failure refuses. */
async function apiJson(params, wp, { fetchImpl = fetch, delays = RETRY_DELAYS_MS, sleepImpl = sleep } = {}) {
  const url = API + "?" + new URLSearchParams(params);
  let res;
  for (let attempt = 0; ; attempt++) {
    res = await fetchImpl(url, { headers: { "User-Agent": USER_AGENT, Accept: "application/json" } });
    const transient = res.status === 429 || res.status >= 500;
    if (!transient || attempt >= delays.length) break;
    await sleepImpl(delays[attempt]);
  }
  if (!res.ok) refuse(`Wikipedia API answered HTTP ${res.status} for ${JSON.stringify(wp)}`);
  return res.json();
}

/** One article's rendered section 0. */
export async function fetchArticle(wp, opts) {
  const body = await apiJson({ action: "parse", page: wp, prop: "text", section: "0", redirects: "1", format: "json", formatversion: "2", disabletoc: "1" }, wp, opts);
  if (!body || !body.parse || typeof body.parse.text !== "string") refuse(`Wikipedia API answered without a parse for ${JSON.stringify(wp)}: ${JSON.stringify(body).slice(0, 160)}`);
  return { title: body.parse.title, text: body.parse.text };
}

/**
 * The article's Wikidata item and visible categories, from one `action=query` answer. Pure, so
 * the tests drive it with a synthetic body. Returns {wd, wpcats, problems}.
 */
export function metaOf(body, wp) {
  if (!body || !body.query || !Array.isArray(body.query.pages)) {
    return { problems: [`the Wikipedia API answered the category query for ${JSON.stringify(wp)} without a pages list`] };
  }
  const problems = [];
  if (body.continue) problems.push("the category list came back truncated (the answer carries `continue`) — refusing to store part of it");
  const p = body.query.pages[0] || {};
  if (p.missing || p.invalid) return { problems: [...problems, `no Wikipedia page titled ${JSON.stringify(wp)}`] };
  if (p.title !== wp) problems.push(`the category query resolved ${JSON.stringify(wp)} to ${JSON.stringify(p.title)} — set wp to the article itself`);
  const wd = p.pageprops && p.pageprops.wikibase_item;
  if (!/^Q[1-9]\d*$/.test(String(wd ?? ""))) problems.push(`the article carries no Wikidata item (wikibase_item ${JSON.stringify(wd ?? null)})`);
  const wpcats = [...new Set((Array.isArray(p.categories) ? p.categories : [])
    .map(c => String((c && c.title) || "").replace(/^Category:/, "").replace(/_/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean))].sort();
  if (!wpcats.length) problems.push("the article has no visible categories");
  for (const c of wpcats) if (c.length > MAX_TEXT) problems.push(`category ${JSON.stringify(c.slice(0, 50))}… is ${c.length} chars — longer than ${MAX_TEXT}`);
  return { wd, wpcats, problems };
}

/** The article's categories (hidden ones excluded) and its Wikidata item. */
export async function fetchMeta(wp, opts) {
  const body = await apiJson({ action: "query", titles: wp, prop: "categories|pageprops", clshow: "!hidden", cllimit: "max",
    ppprop: "wikibase_item", redirects: "1", format: "json", formatversion: "2" }, wp, opts);
  return metaOf(body, wp);
}

/** The page's own facetLookup, so this script refuses exactly what the validator would. */
export function pageLookup(html) {
  const { facetLookup } = new Function(extractData(extractScript(html)) + "; return {facetLookup: typeof facetLookup === 'undefined' ? null : facetLookup};")();
  if (typeof facetLookup !== "function") refuse("the codex defines no facetLookup — the facet vocabulary this harvest is checked against is missing");
  return facetLookup;
}

/**
 * Log the harvest in CHANGES as a game-level entry. A second run on the same day widens that
 * day's `games` list; a same-day entry with no `games` list is a refusal (merge it by hand) —
 * two entries sharing a date would break the strictly decreasing order the validator holds.
 */
export function logGames(html, { date, title, note, games }) {
  const anchor = "const CHANGES = [";
  const at = html.indexOf(anchor);
  if (at < 0) refuse("could not find `const CHANGES = [` in the codex");
  if (html.indexOf(anchor, at + 1) >= 0) refuse("`const CHANGES = [` appears more than once — anchor is ambiguous");
  const head = html.slice(0, at + anchor.length), rest = html.slice(at + anchor.length);
  const first = rest.match(/^\s*\{date:"(\d{4}-\d{2}-\d{2})"[\s\S]*?\},\n/);
  if (first && first[1] === date) {
    const m = first[0].match(/games:\[([^\]]*)\]/);
    if (!m) refuse(`CHANGES already has an entry dated ${date} with no games list — add these games to it by hand`);
    const merged = [...new Set([...JSON.parse("[" + m[1] + "]"), ...games])];
    return head + rest.replace(m[0], () => `games:${JSON.stringify(merged)}`);
  }
  return head + `\n  {date:${JSON.stringify(date)}, title:${JSON.stringify(title)},\n   note:${JSON.stringify(note)},\n   added:[], updated:[],\n   games:${JSON.stringify(games)}},` + rest;
}

export const CHANGE_TITLE = "Every platform, credit, theme and award, from Wikipedia";
export const CHANGE_NOTE = "Each game's page now lists every platform it came out on, its developers, publishers and series, its credits and engine, and its themes, features and awards, from the Wikipedia article its cover came from. Every one is a filter.";

const withoutAt = ib => { const { at, ...rest } = canonInfobox(ib); return JSON.stringify(rest); };

/**
 * Fetch, parse and check every selected row; when NOTHING refused, write the changed rows and
 * log them. Returns {html, results, changed}; `html` is the input untouched when anything refused.
 */
export async function harvest(html, { only = [], note = null, today, fetchImpl = fetch, sleepImpl = sleep, pauseMs = PAUSE_MS, lookup = null, onRow = () => {} } = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(today))) refuse("today must be YYYY-MM-DD");
  const { BASE_GAMES } = evalCodex(html);
  for (const t of only) if (!BASE_GAMES.some(g => g.title === t)) refuse(`--only ${JSON.stringify(t)}: no BASE_GAMES row has that title`);
  if (note != null && only.length !== 1) refuse("--note describes one article: pass it with exactly one --only");
  if (note != null && !(isText(note) && note.length <= MAX_TEXT)) refuse(`--note must be text of at most ${MAX_TEXT} characters`);
  const look = lookup || pageLookup(html);

  const results = [];
  let fetched = 0;
  for (const g of BASE_GAMES.filter(x => !only.length || only.includes(x.title))) {
    const r = { title: g.title, problems: [] };
    results.push(r);
    if (!isText(g.wp)) { r.problems.push("the row has no wp — set it (fetch_covers.mjs resolves it) before harvesting"); onRow(r); continue; }
    if (fetched++) await sleepImpl(pauseMs);
    try {
      const { title, text } = await fetchArticle(g.wp, { fetchImpl, sleepImpl });
      if (title !== g.wp) r.problems.push(`the API resolved ${JSON.stringify(g.wp)} to ${JSON.stringify(title)} — set wp to the article itself`);
      else {
        const { infobox, problems } = infoboxOf(parseInfobox(text), { lookup: look });
        r.problems.push(...problems);
        const meta = await fetchMeta(g.wp, { fetchImpl, sleepImpl });
        r.problems.push(...meta.problems);
        const keptNote = note ?? g.infobox?.note;
        r.infobox = canonInfobox({ ...infobox, ...(keptNote ? { note: keptNote } : {}), at: today });
        r.wd = meta.wd;
        r.wpcats = meta.wpcats;
        r.changed = !g.infobox || withoutAt(g.infobox) !== withoutAt(r.infobox)
          || g.wd !== r.wd || JSON.stringify(g.wpcats ?? null) !== JSON.stringify(r.wpcats ?? null);
      }
    } catch (e) {
      r.problems.push(e instanceof Refusal ? e.message : `fetch failed: ${e.message}`);
    }
    onRow(r);
  }

  const changed = results.filter(r => !r.problems.length && r.changed).map(r => r.title);
  if (results.some(r => r.problems.length) || !changed.length) return { html, results, changed };
  let next = html;
  for (const t of changed) {
    const r = results.find(x => x.title === t);
    next = setOwnedFields(next, t, { infobox: r.infobox, wd: r.wd, wpcats: r.wpcats });
  }
  next = logGames(next, { date: today, title: CHANGE_TITLE, note: CHANGE_NOTE, games: changed });
  return { html: next, results, changed };
}

// ---------------------------------------------------------------------- main

async function main(argv) {
  const write = argv.includes("--write");
  const arg = (flag, dflt) => (argv.includes(flag) ? argv[argv.indexOf(flag) + 1] : dflt);
  const only = argv.flatMap((a, i) => (a === "--only" ? [argv[i + 1]] : []));
  const codexPath = resolve(ROOT, arg("--codex", CODEX));
  const html = readFileSync(codexPath, "utf8");
  const { html: next, results, changed } = await harvest(html, {
    only, note: arg("--note", null), today: arg("--today", localToday()),
    onRow: r => console.log(`${r.problems.length ? "REFUSED" : r.changed ? "changed" : "same   "}  ${r.title}${r.infobox ? ` — ${(r.infobox.plat || []).length} platform(s)` : ""}${r.wpcats ? `, ${r.wpcats.length} categories` : ""}${r.problems.map(p => `\n           ${p}`).join("")}`),
  });
  const refused = results.filter(r => r.problems.length).length;
  if (refused) { console.error(`\n${refused} of ${results.length} row(s) refused; nothing written.`); process.exit(1); }
  if (!changed.length) { console.log("\nevery row already matches its infobox"); return; }
  if (!write) { console.log(`\ndry run: ${changed.length} row(s) would change. Re-run with --write to apply.`); return; }
  writeFileSync(codexPath, next);
  console.log(`\nwrote ${changed.length} row(s) and logged them in CHANGES`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main(process.argv.slice(2)).catch(e => {
    if (!(e instanceof Refusal)) throw e;
    console.error(`refused: ${e.message}`);
    process.exit(1);
  });
}
