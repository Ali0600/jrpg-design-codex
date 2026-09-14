#!/usr/bin/env node
/**
 * Lint the research digests in docs/research/.
 *
 * A digest is where facts harvested from guides and wikis land before they become
 * codex rows. The one rule that keeps it honest: every fact points at its source.
 * A bullet with no pointer is a memory, and the codex never records from memory.
 *
 *   node scripts/digest_lint.mjs          lint every digest
 *
 * Pointer grammar:  [gf:<faq id> §<section>, <author> v<version>]   a GameFAQs guide
 *                   [wiki:<host>/<Page Title>]                        a MediaWiki page
 *                   [web:<host>/<path>]                               any other page (never GameFAQs)
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const POINTER = /\[gf:\d+ §[^\]\n]{1,40}(?:, [^\]\n]+)?\]|\[wiki:[a-z0-9.-]+\/[^\]\n]+\]|\[web:[a-z0-9.-]+\/[^\]\n]+\]/;
// A GameFAQs guide is always a gf: pointer, so its Sources, Coverage and Triage bookkeeping cannot be skipped.
const WEB_GAMEFAQS = /\[web:(?:[a-z0-9-]+\.)*gamefaqs\.gamespot\.com\//;
const FACT_H2 = /^## (Mechanics candidates|Minigame candidates|Exploration & upgrade facts|Unverified or contradicted)\b/;
// Only candidate blocks carry `pointers:` / `row:`; the fact sections use ### as plain grouping.
const CAND_H2 = /^## (Mechanics candidates|Minigame candidates)\b/;

export function allPointers(s) {
  return s.match(new RegExp(POINTER.source, "g")) || [];
}

/** The source a pointer names, ignoring section/version: "gf:38095", "wiki:host/Title" or "web:host/path". */
export function pointerKey(p) {
  const g = p.match(/^\[gf:(\d+)/);
  if (g) return "gf:" + g[1];
  const w = p.match(/^\[(wiki|web):([^\]]+)\]$/);
  return w ? w[1] + ":" + w[2] : p;
}

// The bookkeeping between a digest's Sources table, its Coverage lines and its Triage record.
// Coverage lines arrived with `__gf.visited()` on 2026-09-06 and the Triage record on 2026-09-14.
// A digest is held to each rule from its own "digest started" date, so one written before a rule
// existed is never back-filled from memory; a missing or unparseable date (the template's
// "<date>") counts as new.
const COVERAGE_FROM = "2026-09-06";
const TRIAGE_FROM = "2026-09-14";
const GUIDE_HEADINGS = new Set(["Full Game Guides", "In-Depth Guides"]);
const NO_GUIDE = /^No GameFAQs guide used\b/i;
const DECISION = /^(read|grep only|skipped [—–-] \S.*)$/;

/** One `## <name>` section: its lines and its table rows as [{line, cells}], header and separator skipped. */
function section(L, name) {
  const at = L.indexOf(`## ${name}`);
  if (at < 0) return null;
  const lines = [], rows = [];
  let fence = false, header = false;
  for (let i = at + 1; i < L.length && !/^## /.test(L[i]); i++) {
    const l = L[i];
    lines.push(l);
    if (/^```/.test(l)) { fence = !fence; continue; }
    if (fence || !/^\|/.test(l) || /^\|\s*:?-/.test(l)) continue;
    if (!header) { header = true; continue; }
    rows.push({ line: i + 1, cells: l.split("|").slice(1, -1).map(c => c.trim()) });
  }
  return { line: at + 1, lines, rows };
}

export function bookkeepingProblems(md) {
  const L = md.split("\n"), out = [];
  const started = (md.match(/digest started (\d{4}-\d{2}-\d{2})\b/) || [])[1] || null;
  const since = from => !started || started >= from;
  const sourceRows = (section(L, "Sources") || { rows: [] }).rows;
  const gfSources = sourceRows.filter(r => /^\d+$/.test(r.cells[0] || ""));
  const described = new Set(gfSources.map(r => r.cells[0]));

  // Every guide a pointer cites is described in the Sources table.
  const cited = new Map();
  let fence = false;
  L.forEach((l, i) => {
    if (/^```/.test(l)) { fence = !fence; return; }
    if (fence) return;
    for (const m of l.matchAll(/\[gf:(\d+)/g)) if (!cited.has(m[1])) cited.set(m[1], i + 1);
  });
  for (const [id, line] of cited) if (!described.has(id)) out.push(`${line}: cites gf:${id}, which is not a row of ## Sources`);

  // Every GameFAQs source says what this pass read of it. A wiki source has no Coverage line.
  if (since(COVERAGE_FROM)) {
    const covered = new Set([...md.matchAll(/^Coverage (\d+):/gm)].map(m => m[1]));
    for (const r of gfSources) if (!covered.has(r.cells[0])) out.push(`${r.line}: source ${r.cells[0]} has no "Coverage ${r.cells[0]}:" line saying what was read`);
  }

  // The Triage record: which Full Game Guides and In-Depth Guides were read, grepped or skipped.
  if (since(TRIAGE_FROM)) {
    const tri = section(L, "Triage");
    if (!tri || (!tri.rows.length && !tri.lines.some(l => NO_GUIDE.test(l.trim())))) {
      out.push(`${tri ? tri.line : 1}: digest started ${started || "<no date>"} needs a ## Triage table of the guides listed under Full Game Guides and In-Depth Guides (or a "No GameFAQs guide used" line)`);
    } else {
      const listed = new Set();
      for (const r of tri.rows) {
        const [id = "", , , cat = "", , , decision = ""] = r.cells;
        listed.add(id);
        if (!GUIDE_HEADINGS.has(cat)) out.push(`${r.line}: triage row ${id}: category must be Full Game Guides or In-Depth Guides (other headings go in the summary line)`);
        if (!DECISION.test(decision)) out.push(`${r.line}: triage row ${id}: decision must be read, grep only, or "skipped — <why>"`);
        else if (/^(read|grep only)$/.test(decision) && !described.has(id)) out.push(`${r.line}: triage marks ${id} as ingested, but ## Sources has no row for it`);
      }
      for (const r of gfSources) if (!listed.has(r.cells[0])) out.push(`${r.line}: source ${r.cells[0]} is not in the ## Triage table`);
    }
  }
  return out;
}

export function lintDigest(md, name = "digest") {
  const out = [];
  const L = md.split("\n");
  let fence = false, h2 = "", block = null;
  const flush = () => {
    if (!block) return;
    if (!block.pointers) out.push(`${block.line}: ### ${block.name} has no pointers: line`);
    else if (block.row && new Set(allPointers(block.pointers).map(pointerKey)).size < 2) {
      out.push(`${block.line}: ### ${block.name} became row ${block.row} on fewer than two distinct sources`);
    }
    block = null;
  };
  L.forEach((line, idx) => {
    const n = idx + 1;
    if (/^```/.test(line)) { fence = !fence; return; }
    if (fence) return;
    if (WEB_GAMEFAQS.test(line)) out.push(`${n}: GameFAQs is cited as [gf:<id> §<section>, <author> v<ver>], never as a web pointer`);
    if (/^## /.test(line)) { flush(); h2 = line; return; }
    if (!FACT_H2.test(h2)) return;
    if (/^### /.test(line)) {
      flush();
      if (CAND_H2.test(h2)) block = { name: line.slice(4).trim(), line: n, pointers: "", row: "" };
      return;
    }
    if (block && /^pointers:/i.test(line)) {
      block.pointers = line;
      if (!POINTER.test(line)) out.push(`${n}: pointers line carries no pointer`);
      return;
    }
    if (block && /^row:/i.test(line)) { block.row = line.replace(/^row:\s*/i, "").trim(); return; }
    if (/^\s*[-*] /.test(line) && !POINTER.test(line)) out.push(`${n}: fact bullet without a source pointer`);
    if (/^\|/.test(line)) {
      const next = L[idx + 1] || "";
      const isSep = /^\|\s*:?-+/.test(line);
      const isHeader = /^\|\s*:?-+/.test(next);
      if (!isSep && !isHeader && !POINTER.test(line)) out.push(`${n}: table row without a source pointer`);
    }
  });
  flush();
  out.push(...bookkeepingProblems(md));
  return out.map(m => `${name}:${m}`);
}

export function lintDir(dir) {
  let files;
  try { files = readdirSync(dir); } catch { return { files: [], problems: [] }; }
  const digests = files.filter(f => f.endsWith(".md") && f !== "README.md").sort();
  const problems = [];
  for (const f of digests) problems.push(...lintDigest(readFileSync(join(dir, f), "utf8"), f));
  return { files: digests, problems };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "docs", "research");
  const { files, problems } = lintDir(dir);
  console.log(`digest lint: ${files.length} digest${files.length === 1 ? "" : "s"}`);
  for (const p of problems) console.error(`  - ${p}`);
  if (problems.length) process.exit(1);
}
