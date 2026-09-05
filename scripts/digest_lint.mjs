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
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const POINTER = /\[gf:\d+ §[^\]\n]{1,40}(?:, [^\]\n]+)?\]|\[wiki:[a-z0-9.-]+\/[^\]\n]+\]/;
const FACT_H2 = /^## (Mechanics candidates|Minigame candidates|Exploration & upgrade facts|Unverified or contradicted)\b/;
// Only candidate blocks carry `pointers:` / `row:`; the fact sections use ### as plain grouping.
const CAND_H2 = /^## (Mechanics candidates|Minigame candidates)\b/;

export function allPointers(s) {
  return s.match(new RegExp(POINTER.source, "g")) || [];
}

/** The source a pointer names, ignoring section/version: "gf:38095" or "wiki:host/Title". */
export function pointerKey(p) {
  const g = p.match(/^\[gf:(\d+)/);
  if (g) return "gf:" + g[1];
  const w = p.match(/^\[wiki:([^\]]+)\]$/);
  return w ? "wiki:" + w[1] : p;
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
