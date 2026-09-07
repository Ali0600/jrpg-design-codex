#!/usr/bin/env node
/**
 * Sets the script-owned fields on a BASE_GAMES row: `gf` (the GameFAQs game-page data),
 * `cover` (the thumbnail path), `wp` (the Wikipedia article) and `digest` (the
 * docs/research slug).
 *
 *   node scripts/game_rows.mjs --game "<title>" --set wp="Parasite Eve (video game)"
 *   node scripts/game_rows.mjs --game "<title>" --set digest=parasite-eve --unset cover --write
 *
 * The invariant that makes this safe: each owned field sits on ITS OWN LINE, LAST in the
 * row, in the fixed order gf, cover, wp, digest. The writer replaces those lines and copies
 * every other line of the row byte for byte, so a hand-written field (`why`, the score
 * fields) cannot be damaged by it. The one runtime check is that the rewritten row still
 * evaluates: broken JavaScript is refused, never written. (An earlier draft also compared
 * every non-owned key before and after; nothing could ever make it fire, so it went.)
 *
 * Rows are located POSITIONALLY: the array is split at every line that starts `{title:`
 * and the chunks are paired with the evaluated BASE_GAMES. Two real rows use consts
 * (`title:FF`, `title:ER`), so a textual title search would miss them; a chunk count that
 * differs from the roster is a refusal, never a guess.
 *
 * This is the deliberate exception to splice_rows.mjs's rule that existing rows are hand
 * edits: game rows have no id and no user overrides keyed to them, and these four fields
 * are written by scripts (splice_game.mjs, fetch_covers.mjs, splice_rows.mjs), not by hand.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractScript, extractData } from "./validate_codex.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CODEX = join(ROOT, "JRPG_Design_Codex.html");

export class Refusal extends Error {}
export const refuse = msg => { throw new Refusal(msg); };

export const OWNED = ["gf", "cover", "wp", "digest"];
/** The keys `gf` may carry, in the order they are written. The validator holds the same list. */
export const GF_KEYS = ["u", "plat", "genre", "dev", "pub", "rel", "fr", "aka", "also", "rating", "diff", "len", "like", "note", "at"];

const IDENT = /^[A-Za-z_$][\w$]*$/;

// ------------------------------------------------------------------ reading

/** The evaluated roster, plus the two title consts, so a row literal can be evaluated alone. */
export function evalCodex(html) {
  const script = extractScript(html);
  try {
    return new Function(extractData(script)
      + "; return {BASE_GAMES, consts:{FF:(typeof FF==='undefined'?undefined:FF), ER:(typeof ER==='undefined'?undefined:ER)}};")();
  } catch (e) {
    refuse(`the codex data region does not evaluate: ${e.message}`);
  }
}

function evalLiteral(literal, consts, what) {
  try {
    return new Function("FF", "ER", "return (" + literal + ");")(consts.FF, consts.ER);
  } catch (e) {
    refuse(`${what} does not evaluate as a row literal: ${e.message}`);
  }
}

/**
 * Every row of BASE_GAMES as a text span: `start` is its `{title:`, `end` is where the next
 * row's `{title:` (or the array's `\n];`) begins, so the span carries the row's own tail —
 * `,\n`, the lone-comma seam `\n,\n`, or nothing for the last row — byte for byte.
 */
export function gameRowChunks(html) {
  const decl = "const BASE_GAMES = [";
  const at = html.indexOf(decl);
  if (at < 0) refuse(`could not find \`${decl}\` in the codex`);
  if (html.indexOf(decl, at + 1) >= 0) refuse(`\`${decl}\` appears more than once — anchor is ambiguous`);
  const end = html.indexOf("\n];", at);
  if (end < 0) refuse("could not find the end of BASE_GAMES");

  const bodyStart = at + decl.length;
  const body = html.slice(bodyStart, end);
  const starts = [];
  const re = /^\{title:/gm;
  let m;
  while ((m = re.exec(body))) starts.push(bodyStart + m.index);
  if (!starts.length) refuse("BASE_GAMES has no row starting `{title:` at column 0");

  const { BASE_GAMES, consts } = evalCodex(html);
  if (BASE_GAMES.length !== starts.length) {
    refuse(`BASE_GAMES evaluates to ${BASE_GAMES.length} rows but ${starts.length} lines start \`{title:\` — a row not at column 0? Refusing to pair rows positionally`);
  }
  const chunks = starts.map((s, i) => ({
    start: s,
    end: i + 1 < starts.length ? starts[i + 1] : end,
    title: BASE_GAMES[i].title,
    row: BASE_GAMES[i],
  }));
  return { start: at, end, chunks, consts };
}

export function findGameRow(chunks, title) {
  const hits = chunks.filter(c => c.title === title);
  if (!hits.length) refuse(`no BASE_GAMES row titled ${JSON.stringify(title)}`);
  if (hits.length > 1) refuse(`${hits.length} BASE_GAMES rows titled ${JSON.stringify(title)} — ambiguous`);
  return hits[0];
}

// ------------------------------------------------------------------ writing

/** A value in the file's own literal style, on one line: bare keys where legal, JSON strings. */
export function lit(v) {
  if (Array.isArray(v)) return "[" + v.map(lit).join(",") + "]";
  if (v && typeof v === "object") {
    return "{" + Object.keys(v).filter(k => v[k] !== undefined)
      .map(k => (IDENT.test(k) ? k : JSON.stringify(k)) + ":" + lit(v[k])).join(",") + "}";
  }
  if (typeof v === "number" && !Number.isFinite(v)) refuse(`cannot write ${v} into the codex`);
  return JSON.stringify(v);
}

/** `gf` in the canonical key order; a key outside GF_KEYS is a refusal, never written. */
export function canonGf(gf) {
  if (!gf || typeof gf !== "object" || Array.isArray(gf)) refuse("gf must be an object");
  for (const k of Object.keys(gf)) if (!GF_KEYS.includes(k)) refuse(`${JSON.stringify(k)} is not a gf key (${GF_KEYS.join(", ")})`);
  const out = {};
  for (const k of GF_KEYS) if (gf[k] !== undefined) out[k] = gf[k];
  return out;
}

const OWNED_LINE = /^\s*(gf|cover|wp|digest):/;
const stripStrings = line => line.replace(/"(?:[^"\\]|\\.)*"/g, '""');

/**
 * Replace (or add, or remove) the owned fields on one row. Returns the new html; the row's
 * other keys are proven untouched by evaluating the literal before and after.
 */
export function setOwnedFields(html, title, patch, { unset = [] } = {}) {
  for (const k of Object.keys(patch)) if (!OWNED.includes(k)) refuse(`${JSON.stringify(k)} is not a script-owned field (${OWNED.join(", ")})`);
  for (const k of unset) if (!OWNED.includes(k)) refuse(`${JSON.stringify(k)} is not a script-owned field (${OWNED.join(", ")})`);

  const { chunks, consts } = gameRowChunks(html);
  const c = findGameRow(chunks, title);
  const text = html.slice(c.start, c.end);
  const close = text.lastIndexOf("}");
  if (close < 0) refuse(`row ${JSON.stringify(title)}: no closing brace`);
  const literal = text.slice(0, close + 1), tail = text.slice(close + 1);
  if (!/^[\s,]*$/.test(tail)) refuse(`row ${JSON.stringify(title)}: unexpected text after its closing brace: ${JSON.stringify(tail.slice(0, 40))}`);
  const what = `row ${JSON.stringify(title)}`;
  evalLiteral(literal, consts, what);

  const existing = {};
  const kept = [];
  literal.slice(0, -1).split("\n").forEach((line, i) => {
    const m = line.match(OWNED_LINE);
    if (m) {
      const one = evalLiteral("{" + line.replace(/,\s*$/, "") + "}", consts, `${what} line ${i + 1}`);
      if (Object.keys(one).length !== 1) {
        refuse(`${what}: line ${i + 1} carries \`${m[1]}\` together with another key — the invariant is one owned field per line, last in the row`);
      }
      existing[m[1]] = one[m[1]];
      return;
    }
    if (/[,{]\s*(gf|cover|wp|digest)\s*:/.test(stripStrings(line))) {
      refuse(`${what}: line ${i + 1} carries an owned field after another key — the invariant is one owned field per line, last in the row`);
    }
    kept.push(line);
  });

  const merged = { ...existing, ...patch };
  for (const k of unset) delete merged[k];
  if (merged.gf !== undefined) merged.gf = canonGf(merged.gf);
  const ownedLines = OWNED.filter(k => merged[k] !== undefined).map(k => `${k}:${lit(merged[k])}`);
  const body = kept.join("\n").replace(/,\s*$/, "");
  const next = body + (ownedLines.length ? ",\n" + ownedLines.join(",\n") : "") + "}";

  evalLiteral(next, consts, `${what} (after the edit)`);
  return html.slice(0, c.start) + next + tail + html.slice(c.end);
}

// ---------------------------------------------------------------------- main

function parseValue(raw) {
  const t = raw.trim();
  if (/^[\[{"]/.test(t)) {
    try { return JSON.parse(t); } catch (e) { refuse(`--set value is not JSON: ${e.message}`); }
  }
  return t;
}

function main(argv) {
  const write = argv.includes("--write");
  const arg = (flag, dflt) => (argv.includes(flag) ? argv[argv.indexOf(flag) + 1] : dflt);
  const title = arg("--game");
  const codexPath = resolve(ROOT, arg("--codex", CODEX));
  const patch = {}, unset = [];
  argv.forEach((a, i) => {
    if (a === "--set") {
      const kv = String(argv[i + 1] || "");
      const eq = kv.indexOf("=");
      if (eq < 1) refuse(`--set expects key=value, got ${JSON.stringify(kv)}`);
      patch[kv.slice(0, eq)] = parseValue(kv.slice(eq + 1));
    }
    if (a === "--unset") unset.push(String(argv[i + 1] || ""));
  });
  if (!title || (!Object.keys(patch).length && !unset.length)) {
    console.error('usage: node scripts/game_rows.mjs --game "<title>" [--set key=value]… [--unset key]… [--write] [--codex <path>]');
    process.exit(2);
  }
  const html = readFileSync(codexPath, "utf8");
  const next = setOwnedFields(html, title, patch, { unset });
  const { chunks } = gameRowChunks(next);
  const c = findGameRow(chunks, title);
  const rowText = next.slice(c.start, c.end);
  console.log(rowText.split("\n").filter(l => OWNED_LINE.test(l)).map(l => "  " + l.slice(0, 140)).join("\n") || "  (no owned fields left on the row)");
  if (!write) { console.log(`\ndry run: ${next.length - html.length} chars would change. Re-run with --write to apply.`); return; }
  writeFileSync(codexPath, next);
  console.log(`\nwrote ${JSON.stringify(title)}.`);
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
