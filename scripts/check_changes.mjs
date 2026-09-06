#!/usr/bin/env node
/**
 * Did every rewritten row get logged in CHANGES?
 *
 *   node scripts/check_changes.mjs --base origin/main
 *   node scripts/check_changes.mjs --base HEAD~1
 *
 * `validate_codex.mjs` already proves every row is named in some entry's `added`, so a
 * NEW row cannot go unmarked. The other half is invisible to it: editing M117's notes in
 * place changes nothing it can measure, and the row keeps whatever date it was added on —
 * so the owner's "what's new" review silently misses the edit. This compares the working
 * copy against a base revision and requires each changed row to appear in an `updated`
 * list that the base did not already have.
 *
 * Rows are compared as PARSED OBJECTS with sorted keys, never as text. Appending a row to
 * an array rewrites the previous last row by one character — the comma after its closing
 * brace — so a textual diff would demand an `updated` entry for M243, M261, M265 … on
 * every single splice. Parsing makes that artifact disappear instead of teaching everyone
 * to ignore the gate.
 */

import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractScript, extractData } from "./validate_codex.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CODEX = "JRPG_Design_Codex.html";

/** The rows and changelog of one version of the page. */
export function readVersion(html, which) {
  const src = extractData(extractScript(html));
  const data = new Function(
    src + "; return {BASE_MECHS, MINIGAMES," +
    " CHANGES: typeof CHANGES === 'undefined' ? null : CHANGES," +
    " expandIds: typeof expandIds === 'undefined' ? null : expandIds};"
  )();
  const rows = new Map();
  const canon = row => JSON.stringify(Object.fromEntries(Object.keys(row).sort().map(k => [k, row[k]])));
  for (const r of [...data.BASE_MECHS, ...data.MINIGAMES]) rows.set(r.id, canon(r));

  const updated = new Set();
  if (data.CHANGES && data.expandIds) {
    for (const c of data.CHANGES) {
      // A malformed range is the validator's error to report, not this one's.
      try { data.expandIds(c.updated).forEach(id => updated.add(id)); } catch { /* ignore */ }
    }
  } else if (which === "head") {
    throw new Error("the working copy has no CHANGES / expandIds — the changelog is gone");
  }
  return { rows, updated };
}

/**
 * Every row whose content changed between the two versions must have been newly logged
 * as `updated`. Returns { problems, changed, newlyLogged }.
 */
export function diffChanges(baseHtml, headHtml) {
  const base = readVersion(baseHtml, "base");
  const head = readVersion(headHtml, "head");
  const newlyLogged = new Set([...head.updated].filter(id => !base.updated.has(id)));

  const changed = [];
  for (const [id, text] of head.rows) {
    if (!base.rows.has(id)) continue;             // a new row — `added` covers it
    if (base.rows.get(id) !== text) changed.push(id);
  }
  changed.sort();

  const problems = changed
    .filter(id => !newlyLogged.has(id))
    .map(id =>
      `${id} was rewritten but is not in any NEW CHANGES entry's \`updated\` list — ` +
      `the app would still show it with its original date, so the edit is invisible`);

  for (const id of newlyLogged) {
    if (!head.rows.has(id)) problems.push(`CHANGES logs ${id} as updated, but no such row exists`);
  }
  return { problems, changed, newlyLogged };
}

// ---------------------------------------------------------------------- main

function main(argv) {
  const i = argv.indexOf("--base");
  const rev = i >= 0 ? argv[i + 1] : "";
  if (!rev) {
    console.error("usage: node scripts/check_changes.mjs --base <rev>");
    process.exit(2);
  }
  let baseHtml;
  try {
    baseHtml = execFileSync("git", ["show", `${rev}:${CODEX}`], { cwd: ROOT, encoding: "utf8", maxBuffer: 64 << 20 });
  } catch {
    // The genuine first-commit case. Loud, so a broken base ref cannot masquerade as a pass.
    console.log(`SKIPPED: could not read ${CODEX} at ${JSON.stringify(rev)} — no base to compare against.`);
    return;
  }
  const headHtml = readFileSync(join(ROOT, CODEX), "utf8");
  const { problems, changed, newlyLogged } = diffChanges(baseHtml, headHtml);

  console.log(`${changed.length} row${changed.length === 1 ? "" : "s"} rewritten since ${rev}` +
              (changed.length ? `: ${changed.join(", ")}` : "") +
              ` · ${newlyLogged.size} newly logged as updated`);
  if (problems.length) {
    console.error(`\n${problems.length} problem${problems.length === 1 ? "" : "s"}:`);
    for (const p of problems) console.error(`  - ${p}`);
    console.error(`\nAdd the id(s) to the \`updated\` list of the newest CHANGES entry in ${CODEX}.`);
    process.exit(1);
  }
  console.log("every rewritten row is logged");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) main(process.argv.slice(2));
