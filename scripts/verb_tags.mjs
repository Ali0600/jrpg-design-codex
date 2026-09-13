#!/usr/bin/env node
/**
 * Writes discovery-verb tags into BASE_MECHS from the evidence ledger, docs/verbs.md.
 *
 *   node scripts/verb_tags.mjs            dry run: lists the rows that would change
 *   node scripts/verb_tags.mjs --write    apply
 *
 * The ledger is the only source of a tag. Every tag in it quotes a span of its row's own
 * text, checked by the same parser the validator uses, and this script refuses to write
 * anything while that check fails. It copies verbs across and nothing else.
 *
 * The one line it rewrites is a row's first — `{id:"M123",game:…,name:…,cat:"…",` — which is
 * where every row keeps `verbs`. The key is always written straight after the id; the two
 * rows that carried it after `cat` are normalised the first time they are touched. Every
 * other line of the file is copied byte for byte.
 *
 * Rows are located POSITIONALLY, the game_rows.mjs posture: the array is split at every line
 * starting `{id:"M` and paired with the evaluated BASE_MECHS, and a count that differs is a
 * refusal. A row the ledger does not name is left alone — unless it carries tags, which is
 * also a refusal: stripping tags nobody reviewed (a freshly spliced digest row, say) would be
 * silent data loss.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractScript, extractData, parseVerbLedger, ledgerProblems } from "./validate_codex.mjs";
import { Refusal, refuse } from "./game_rows.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CODEX = join(ROOT, "JRPG_Design_Codex.html");
const LEDGER = join(ROOT, "docs", "verbs.md");

const STR = String.raw`"(?:[^"\\]|\\.)*"`;
const VERBS_KEY = String.raw`verbs:\[[^\]\n]*\],`;
/** A row's first line as every row is written: `verbs` sits after the id or after `cat`. */
export const FIRST_LINE = new RegExp(
  String.raw`^\{id:"M\d{3}",(?:${VERBS_KEY})?(game:(?:FF|ER|${STR}),name:${STR},cat:${STR},)(?:${VERBS_KEY})?$`);

function evalMechs(html) {
  try {
    return new Function(extractData(extractScript(html))
      + "; return {BASE_MECHS, VERBS: typeof VERBS === 'undefined' ? null : VERBS};")();
  } catch (e) {
    refuse(`the codex data region does not evaluate: ${e.message}`);
  }
}

/** Every BASE_MECHS row's first line as a text span, paired with its evaluated row. */
export function mechFirstLines(html) {
  const decl = "const BASE_MECHS = [";
  const at = html.indexOf(decl);
  if (at < 0) refuse(`could not find \`${decl}\` in the codex`);
  if (html.indexOf(decl, at + 1) >= 0) refuse(`\`${decl}\` appears more than once — anchor is ambiguous`);
  const end = html.indexOf("\n];", at);
  if (end < 0) refuse("could not find the end of BASE_MECHS");

  const starts = [];
  const re = /^\{id:"M/gm;
  re.lastIndex = at;
  let m;
  while ((m = re.exec(html)) && m.index < end) starts.push(m.index);

  const { BASE_MECHS, VERBS } = evalMechs(html);
  if (BASE_MECHS.length !== starts.length) {
    refuse(`BASE_MECHS evaluates to ${BASE_MECHS.length} rows but ${starts.length} lines start \`{id:"M\` — a row not at column 0? Refusing to pair rows positionally`);
  }
  const lines = starts.map((start, i) => {
    const row = BASE_MECHS[i];
    const stop = html.indexOf("\n", start);
    const text = html.slice(start, stop);
    const f = text.match(FIRST_LINE);
    if (!f) {
      refuse(`${row.id}: first line does not have the shape \`{id:"M…",game:…,name:…,cat:"…",\` — refusing to rewrite a row it cannot read: ${JSON.stringify(text.slice(0, 80))}`);
    }
    return { start, stop, text, rest: f[1], row };
  });
  return { lines, BASE_MECHS, VERBS };
}

/** The file with every ledger-named row's verbs set to the ledger's. Returns { html, changed }. */
export function syncVerbs(html, ledgerMd) {
  const ledger = parseVerbLedger(ledgerMd);
  const { lines, BASE_MECHS, VERBS } = mechFirstLines(html);

  const problems = [...ledger.problems, ...ledgerProblems(ledger, BASE_MECHS)];
  if (!VERBS) problems.push("the codex defines no VERBS — there is nothing to check a verb against");
  else {
    for (const e of ledger.entries.values()) {
      for (const t of e.tags) {
        if (!Object.hasOwn(VERBS, t.verb)) problems.push(`docs/verbs.md:${t.line}: ${e.id}: ${JSON.stringify(t.verb)} is not a VERBS key`);
      }
    }
  }
  for (const { row } of lines) {
    if ((row.verbs ?? []).length && !ledger.entries.has(row.id)) {
      problems.push(`${row.id} carries ${JSON.stringify(row.verbs)} but has no docs/verbs.md entry — refusing to strip tags nobody reviewed`);
    }
  }
  if (problems.length) refuse(`docs/verbs.md does not check out:\n  - ${problems.join("\n  - ")}`);

  let out = "", pos = 0;
  const changed = [];
  for (const l of lines) {
    const e = ledger.entries.get(l.row.id);
    if (!e) continue;
    const verbs = e.tags.map(t => t.verb);
    const next = `{id:"${l.row.id}",` + (verbs.length ? `verbs:${JSON.stringify(verbs)},` : "") + l.rest;
    if (next === l.text) continue;
    out += html.slice(pos, l.start) + next;
    pos = l.stop;
    changed.push(l.row.id);
  }
  return { html: out + html.slice(pos), changed };
}

// ---------------------------------------------------------------------- main

function main(argv) {
  const write = argv.includes("--write");
  const arg = (flag, dflt) => (argv.includes(flag) ? argv[argv.indexOf(flag) + 1] : dflt);
  const codexPath = resolve(ROOT, arg("--codex", CODEX));
  const ledgerPath = resolve(ROOT, arg("--ledger", LEDGER));

  const html = readFileSync(codexPath, "utf8");
  const { html: next, changed } = syncVerbs(html, readFileSync(ledgerPath, "utf8"));
  if (!changed.length) { console.log("every row already matches docs/verbs.md"); return; }
  console.log(`${changed.length} row${changed.length === 1 ? "" : "s"} ${write ? "rewritten" : "would change"}: ${changed.join(", ")}`);
  if (!write) { console.log("dry run. Re-run with --write to apply."); return; }
  writeFileSync(codexPath, next);
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
