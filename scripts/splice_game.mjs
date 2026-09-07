#!/usr/bin/env node
/**
 * Turns a saved `__gf.game()` result into a BASE_GAMES row's `gf` field.
 *
 *   node scripts/splice_game.mjs --game "<codex title>" <file.json>             dry run
 *   node scripts/splice_game.mjs --game "<codex title>" <file.json> --write
 *       [--allow-year-mismatch "<reason>"] [--allow-title-mismatch] [--note "<text>"] [--today YYYY-MM-DD]
 *
 * The probe returns the Game Detail box as the page prints it; this is the strict side.
 * A label it has not seen is a REFUSAL that names the label — LABELS is extended by hand,
 * never guessed, so a new box row cannot slide in under a key that means something else.
 * Two more refusals guard the two ways a harvest goes wrong: the page's title must match
 * the codex row's (a search is fuzzy), and the Release year must sit within two years of
 * the row's — GameFAQs shows the platform page's NA date, which the window absorbs, but a
 * port or remake page is years off and needs `--allow-year-mismatch "<reason>"`, which is
 * written into `gf.note` so the page can say so. Nothing here stores prose: every string
 * over MAX_TEXT chars is a refusal, and the related-game blurbs never arrive at all.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Refusal, refuse, evalCodex, setOwnedFields, canonGf, lit } from "./game_rows.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CODEX = join(ROOT, "JRPG_Design_Codex.html");

/** Game Detail label -> gf key(s). `null` = known and deliberately not stored. */
export const LABELS = {
  Platform: "plat",
  Genre: "genre",
  Developer: "dev",
  Publisher: "pub",
  "Developer/Publisher": ["dev", "pub"],
  Release: "rel",
  Franchises: "fr",
  "Also Known As": "aka",
  "Also on": "also",
  Expansions: null,   // a DLC count ("8 available", The Witcher 3) — not a design fact
};
/** List-valued keys and what separates their items on the page. */
const SPLIT = { genre: /\s*»\s*/, fr: /,\s*/, aka: /\s*•\s*/, also: /,\s*/ };
const RATINGS = { rate: "rating", difficulty: "diff", length: "len" };

export const GF_ORIGIN = "https://gamefaqs.gamespot.com";
export const GF_PATH = /^\/[a-z0-9]+\/\d+-[a-z0-9-]+$/;
export const MAX_TEXT = 120;
export const YEAR_WINDOW = 2;
export const normTitle = s => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "");

const isText = v => typeof v === "string" && v.trim() !== "";
const twoDp = v => typeof v === "number" && Number.isFinite(v) && Math.abs(v * 100 - Math.round(v * 100)) < 1e-9;

/**
 * The gf field for one row, or the list of reasons there is none. Pure: nothing here reads
 * or writes disk, so the tests drive it with the probe's own fixture output.
 */
export function normalizeGame(probe, row, { today, allowYearMismatch = "", allowTitleMismatch = false, note = "" } = {}) {
  const problems = [];
  const bad = msg => problems.push(msg);
  if (!probe || typeof probe !== "object" || !probe.detail || typeof probe.detail !== "object" || !probe.url) {
    return { gf: null, problems: ["not a game() result — no `detail` and `url` (a search() result saved by mistake?)"] };
  }
  const gf = {};

  let u = null;
  try { u = new URL(String(probe.url)); } catch { u = null; }
  if (!u || u.origin !== GF_ORIGIN) bad(`url ${JSON.stringify(probe.url)} is not on ${GF_ORIGIN}`);
  else if (!GF_PATH.test(u.pathname)) bad(`url path ${JSON.stringify(u.pathname)} is not a game page (/<platform>/<id>-<slug>)`);
  else gf.u = u.pathname;

  if (!allowTitleMismatch && normTitle(probe.title) !== normTitle(row.title)) {
    bad(`the page is titled ${JSON.stringify(probe.title)} but the codex row is ${JSON.stringify(row.title)} — the right page? re-run with --allow-title-mismatch if so`);
  }

  for (const [label, text] of Object.entries(probe.detail)) {
    if (!(label in LABELS)) {
      bad(`unknown Game Detail label ${JSON.stringify(label)} (${JSON.stringify(String(text).slice(0, 40))}) — extend LABELS in scripts/splice_game.mjs deliberately`);
      continue;
    }
    const map = LABELS[label];
    if (map === null) continue;
    for (const k of Array.isArray(map) ? map : [map]) {
      // Lists are deduped: Legend of Mana's page lists one alias twice (2026-09-07).
      const value = SPLIT[k]
        ? [...new Set(String(text).split(SPLIT[k]).map(s => s.trim()).filter(Boolean))]
        : String(text).trim();
      if (!value.length) { bad(`Game Detail ${label} is empty`); continue; }
      gf[k] = value;
    }
  }
  if (!gf.plat && isText(probe.platform)) gf.plat = probe.platform.trim();

  for (const [m, key] of Object.entries(RATINGS)) {
    const r = probe.ratings && probe.ratings[m];
    if (!r || typeof r !== "object") continue;
    const out = {};
    let v = r.v;
    if (key === "len") {
      // The site's length "average" is a 1-5 bucket; the hours live in the word ("31 Hours",
      // "Over 80 Hours"). Store the hours, keep the word.
      const hm = String(r.w || "").match(/(\d+)\s*hours?/i);
      v = hm ? Number(hm[1]) : undefined;
    }
    if (v !== undefined) {
      const max = key === "len" ? 10000 : 5;
      if (twoDp(v) && v >= 0 && v <= max) out.v = v;
      else bad(`${m}: value ${JSON.stringify(v)} is out of range (0-${max}, two decimals)`);
    }
    if (r.n !== undefined) {
      if (Number.isInteger(r.n) && r.n > 0) out.n = r.n;
      else bad(`${m}: count ${JSON.stringify(r.n)} is not a positive integer`);
    }
    if (r.w !== undefined) {
      if (isText(r.w)) out.w = r.w.trim();
      else bad(`${m}: word ${JSON.stringify(r.w)} is not text`);
    }
    if (Object.keys(out).length) gf[key] = out;
  }

  const like = [], seen = new Set();
  (Array.isArray(probe.like) ? probe.like : []).forEach((l, i) => {
    const t = l && l.t, lu = l && l.u;
    if (!isText(t)) { bad(`like[${i}]: no title`); return; }
    if (!GF_PATH.test(String(lu || ""))) { bad(`like[${i}] ${JSON.stringify(t)}: path ${JSON.stringify(lu)} is not a game page`); return; }
    if (lu === gf.u || seen.has(lu)) return;
    seen.add(lu);
    like.push({ t: t.trim(), u: lu });
  });
  if (like.length) gf.like = like;

  const ym = String(gf.rel || "").match(/\b(19|20)\d{2}\b/);
  if (!gf.rel) bad("no Release line — every game page has one");
  else if (!ym) bad(`Release ${JSON.stringify(gf.rel)} carries no year`);
  else if (Number.isInteger(row.year) && Math.abs(Number(ym[0]) - row.year) > YEAR_WINDOW) {
    if (isText(allowYearMismatch)) gf.note = allowYearMismatch.trim();
    else bad(`Release ${JSON.stringify(gf.rel)} is ${ym[0]}, the row's year is ${row.year} — a port or remake page? re-run with --allow-year-mismatch "<reason>" if this is the right page`);
  }

  // A note the operator writes for the page (GameFAQs has no Persona 5 Royal page, so the
  // row carries Persona 5's) — the same field the year override fills.
  if (isText(note)) gf.note = note.trim();

  const walk = (v, path) => {
    if (typeof v === "string") { if (v.length > MAX_TEXT) bad(`${path} is ${v.length} chars — longer than ${MAX_TEXT}, and prose is not stored`); }
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
    else if (v && typeof v === "object") for (const k of Object.keys(v)) walk(v[k], `${path}.${k}`);
  };
  walk(gf, "gf");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(today))) bad(`today ${JSON.stringify(today)} is not YYYY-MM-DD`);
  gf.at = today;
  return { gf: problems.length ? null : canonGf(gf), problems };
}

// ---------------------------------------------------------------------- main

const VALUED = new Set(["--game", "--allow-year-mismatch", "--today", "--codex", "--note"]);

function main(argv) {
  const write = argv.includes("--write");
  const arg = (flag, dflt) => (argv.includes(flag) ? argv[argv.indexOf(flag) + 1] : dflt);
  const title = arg("--game");
  const file = argv.find((a, i) => !a.startsWith("--") && !VALUED.has(argv[i - 1]));
  if (!title || !file) {
    console.error('usage: node scripts/splice_game.mjs --game "<codex title>" <game.json> [--write] [--allow-year-mismatch "<reason>"] [--allow-title-mismatch] [--today YYYY-MM-DD]');
    process.exit(2);
  }
  const codexPath = resolve(ROOT, arg("--codex", CODEX));
  const html = readFileSync(codexPath, "utf8");
  const { BASE_GAMES } = evalCodex(html);
  const row = BASE_GAMES.find(g => g.title === title);
  if (!row) refuse(`no BASE_GAMES row titled ${JSON.stringify(title)}`);
  let probe;
  try { probe = JSON.parse(readFileSync(resolve(file), "utf8")); } catch (e) { refuse(`${file}: not JSON — ${e.message}`); }

  const { gf, problems } = normalizeGame(probe, row, {
    today: arg("--today", new Date().toISOString().slice(0, 10)),
    allowYearMismatch: arg("--allow-year-mismatch", ""),
    allowTitleMismatch: argv.includes("--allow-title-mismatch"),
    note: arg("--note", ""),
  });
  if (problems.length) {
    console.error(`\n${problems.length} problem${problems.length === 1 ? "" : "s"} — nothing written:`);
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  const next = setOwnedFields(html, title, { gf });
  console.log(`${title}\n  gf:${lit(gf)}`);
  if (!write) { console.log(`\ndry run: ${next.length - html.length} chars would change. Re-run with --write to apply.`); return; }
  writeFileSync(codexPath, next);
  console.log(`\nwrote gf for ${JSON.stringify(title)}: ${(gf.like || []).length} related games, harvested ${gf.at}.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    main(process.argv.slice(2));
  } catch (e) {
    if (!(e instanceof Refusal)) throw e;
    console.error(`refused: ${e.message}`);
    process.exit(1);
  }
}
