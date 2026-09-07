#!/usr/bin/env node
/**
 * Splices a research digest's `## Codex rows` block into JRPG_Design_Codex.html.
 *
 *   node scripts/splice_rows.mjs docs/research/<slug>.md            dry run (default)
 *   node scripts/splice_rows.mjs docs/research/<slug>.md --write    do it
 *
 * The digest is the staging file; this is the only thing that writes its rows into the
 * arrays. Placeholder ids bind a row to the candidate it came from — `id:"M+1"` is the
 * first `###` under `## Mechanics candidates`, `id:"g+2"` the second under `## Minigame
 * candidates` — so the real ids can be assigned here and written back into the digest's
 * `row:` lines in the same pass.
 *
 * What it does NOT do: sharpen an EXISTING row (the pilot's M117/M118). Editing a row in
 * place stays a hand edit — ids are the join key for the owner's saved ratings, so a
 * script that rewrites existing rows is a script that can silently orphan their notes.
 * (The one exception is the game row's `digest` field, stamped through game_rows.mjs so
 * the game's page can link the digest and the validator's two-way digest check holds.)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractScript, extractData, readRefHosts } from "./validate_codex.mjs";
import { Refusal, refuse, setOwnedFields } from "./game_rows.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CODEX = join(ROOT, "JRPG_Design_Codex.html");

const WANT = new Set(["Yes", "Maybe", "No", ""]);
const MECH_FIELDS = ["game", "name", "cat", "how", "loop"];
const MINI_FIELDS = ["g", "n", "p", "r", "l"];

const isText = v => typeof v === "string" && v.trim() !== "";
const pad = n => String(n).padStart(3, "0");

// ------------------------------------------------------------------ the codex

/** The arrays, the vocabularies they must agree with, and the next free id. */
export function parseCodex(html) {
  const script = extractScript(html);
  let data;
  try {
    data = new Function(extractData(script) + "; return {CATS, BASE_MECHS, BASE_GAMES, MINIGAMES};")();
  } catch (e) {
    refuse(`the codex data region does not evaluate: ${e.message}`);
  }
  const refHosts = readRefHosts(script);
  if (!refHosts) refuse("could not read `const REF_HOSTS` out of the page — refs cannot be checked");

  const nextId = (rows, prefix) => {
    let max = 0;
    for (const r of rows) {
      const m = String(r && r.id).match(new RegExp("^" + prefix + "(\\d+)$"));
      if (m) max = Math.max(max, Number(m[1]));
    }
    if (!max) refuse(`no ${prefix}NNN ids found — refusing to start a sequence at 1`);
    return max + 1;
  };

  return {
    cats: new Set(Object.keys(data.CATS)),
    titles: new Set(data.BASE_GAMES.map(g => g.title)),
    refHosts,
    nextM: nextId(data.BASE_MECHS, "M"),
    nextG: nextId(data.MINIGAMES, "g"),
  };
}

// ----------------------------------------------------------------- the digest

/** Candidate names in document order, per section, plus the rows block. */
export function parseDigest(md) {
  const lines = md.split("\n");
  const cands = { M: [], g: [] };
  let section = null;
  lines.forEach((line, i) => {
    const h2 = line.match(/^## (.+?)\s*$/);
    if (h2) section = /^Mechanics candidates$/.test(h2[1]) ? "M"
      : /^Minigame candidates$/.test(h2[1]) ? "g" : null;
    const h3 = line.match(/^### (.+?)\s*$/);
    if (h3 && section) cands[section].push({ name: h3[1], line: i });
  });

  const start = md.indexOf("\n## Codex rows");
  if (start < 0) refuse("the digest has no `## Codex rows` section");
  const fence = md.slice(start).match(/```js\n([\s\S]*?)```/);
  if (!fence) refuse("`## Codex rows` has no ```js block");
  const block = fence[1];
  const blockFrom = start + md.slice(start).indexOf(fence[0]);

  return { cands, block, blockFrom, blockTo: blockFrom + fence[0].length, lines };
}

/** Rows out of the block, still carrying their placeholder ids. */
function parseRows(block) {
  let rows;
  try {
    rows = new Function("return [" + block + "\n]")();
  } catch (e) {
    refuse(`the \`## Codex rows\` block does not parse as row literals: ${e.message}`);
  }
  if (!rows.length) {
    refuse("the `## Codex rows` block holds no rows — already spliced? (a spliced digest keeps a comment map there)");
  }
  return rows;
}

// ------------------------------------------------------------------ assigning

const ARROW = s => (typeof s === "string" ? s.replace(/->/g, "→") : s);

function checkRefs(row, label, refHosts, problems) {
  if (row.refs == null) return;
  if (!Array.isArray(row.refs) || !row.refs.length) {
    problems.push(`${label}: \`refs\` must be a non-empty array`);
    return;
  }
  row.refs.forEach((r, i) => {
    const where = `${label}: refs[${i}]`;
    if (!r || !isText(r.t)) problems.push(`${where} has no label \`t\``);
    let u;
    try { u = new URL(String(r && r.u)); } catch { problems.push(`${where} \`u\` is not a URL`); return; }
    if (u.protocol !== "https:" || !refHosts.test(u.hostname)) {
      problems.push(`${where} ${u.hostname} is not an allowed https host — add it to REF_HOSTS in the page if it belongs there`);
    }
  });
}

/**
 * Bind every row to its candidate, assign ids, and validate against the codex's own
 * vocabularies. Returns { assignments, rows, problems } — the caller decides whether to
 * write. Nothing here touches disk.
 */
export function planSplice(html, md) {
  const codex = parseCodex(html);
  const digest = parseDigest(md);
  const rows = parseRows(digest.block);
  const problems = [];
  const assignments = [];
  const claimed = new Map();
  let nextM = codex.nextM, nextG = codex.nextG;

  for (const [i, raw] of rows.entries()) {
    const ph = String(raw && raw.id || "");
    const m = ph.match(/^(M|g)\+(\d+)$/);
    if (!m) {
      problems.push(`row ${i}: id ${JSON.stringify(ph)} is not a placeholder like "M+1" or "g+2"`);
      continue;
    }
    const [, kind, nth] = m;
    const cand = digest.cands[kind][Number(nth) - 1];
    if (!cand) {
      const have = digest.cands[kind].length;
      problems.push(`row ${i}: ${ph} names ${kind === "M" ? "mechanics" : "minigame"} candidate #${nth}, but the digest has ${have}`);
      continue;
    }
    if (claimed.has(ph)) { problems.push(`row ${i}: ${ph} is claimed twice (also row ${claimed.get(ph)})`); continue; }
    claimed.set(ph, i);

    const row = {};
    for (const [k, v] of Object.entries(raw)) row[k] = Array.isArray(v) ? v.map(ARROW) : ARROW(v);
    const id = kind === "M" ? "M" + pad(nextM++) : "g" + pad(nextG++);
    row.id = id;
    const label = `${id} (${ph} "${cand.name}")`;

    const need = kind === "M" ? MECH_FIELDS : MINI_FIELDS;
    for (const f of need) if (!isText(row[f])) problems.push(`${label}: field \`${f}\` is missing or empty`);

    if (kind === "M") {
      if (row.cat != null && !codex.cats.has(row.cat)) problems.push(`${label}: cat ${JSON.stringify(row.cat)} is not a CATS key`);
      if (row.game != null && !codex.titles.has(row.game)) problems.push(`${label}: game ${JSON.stringify(row.game)} has no BASE_GAMES row`);
      if (row.want != null && !WANT.has(row.want)) problems.push(`${label}: want ${JSON.stringify(row.want)} is not Yes/Maybe/No/""`);
      if (row.rating == null) row.rating = 0;
      if (row.want == null) row.want = "";
    } else {
      if (row.g != null && !codex.titles.has(row.g)) problems.push(`${label}: g ${JSON.stringify(row.g)} has no BASE_GAMES row`);
      if (row.rt != null) {
        if (!Array.isArray(row.rt) || !row.rt.length) problems.push(`${label}: \`rt\` must be a non-empty array`);
        else row.rt.forEach((t, j) => {
          if (!isText(t && t.at) || !isText(t && t.get)) problems.push(`${label}: rt[${j}] needs a non-empty \`at\` and \`get\``);
        });
      }
    }
    checkRefs(row, label, codex.refHosts, problems);

    assignments.push({ kind, id, placeholder: ph, candidate: cand, row });
  }

  return { assignments, problems, digest, codex };
}

// --------------------------------------------------------------- serialising

const s = v => JSON.stringify(v);
const refsText = refs => refs ? `,\nrefs:[${refs.map(r => `{u:${s(r.u)},t:${s(r.t)}}`).join(",")}]` : "";

/** One row, in the file's own shape: grouped fields, long prose on its own line. */
export function serializeRow({ kind, row }) {
  if (kind === "M") {
    const verbs = row.verbs ? `verbs:[${row.verbs.map(s).join(",")}],` : "";
    return `{id:${s(row.id)},${verbs}game:${s(row.game)},name:${s(row.name)},cat:${s(row.cat)},\n`
      + `how:${s(row.how)},\n`
      + `loop:${s(row.loop)},\n`
      + `rating:${row.rating | 0},want:${s(row.want)}`
      + (row.notes ? `,\nnotes:${s(row.notes)}` : "")
      + refsText(row.refs) + "}";
  }
  const rt = row.rt ? `,\nrt:[\n${row.rt.map(t => `{at:${s(t.at)},get:${s(t.get)}}`).join(",\n")}]` : "";
  return `{id:${s(row.id)},g:${s(row.g)},n:${s(row.n)},\n`
    + `p:${s(row.p)},\n`
    + `r:${s(row.r)}${rt},\n`
    + `l:${s(row.l)}`
    + refsText(row.refs) + "}";
}

/**
 * Append rows to one array. The array's last row may end `}` or `},` — the pilot's
 * hand-splice assumed `},` and its own assert refused the file, so handle both.
 */
export function appendToArray(html, arrayName, rowTexts) {
  if (!rowTexts.length) return html;
  const decl = `const ${arrayName} = [`;
  const at = html.indexOf(decl);
  if (at < 0) refuse(`could not find \`${decl}\` in the codex`);
  if (html.indexOf(decl, at + 1) >= 0) refuse(`\`${decl}\` appears more than once — anchor is ambiguous`);
  const end = html.indexOf("\n];", at);
  if (end < 0) refuse(`could not find the end of ${arrayName}`);

  const body = html.slice(at + decl.length, end);
  const tail = body.replace(/\s+$/, "");
  if (!/[}\],]$/.test(tail)) refuse(`${arrayName} does not end in a row — refusing to append to ${JSON.stringify(tail.slice(-40))}`);
  const sep = tail.endsWith(",") ? "\n" : ",\n";
  return html.slice(0, at + decl.length) + tail + sep + rowTexts.join(",\n") + html.slice(end);
}

/**
 * Log the splice in the page's CHANGES list, so the new rows show as NEW in the app.
 * Without this the validator would reject the file outright (every id must appear in an
 * `added` list), which is deliberate: a row that reaches the arrays unlogged is a row the
 * owner's review will never surface.
 *
 * Re-running for a second game on the same day MERGES into that day's entry rather than
 * writing a second one — two entries with the same date would break the strictly
 * decreasing order the changelog is validated for.
 */
export function logChange(html, { date, title, ids }) {
  const anchor = "const CHANGES = [";
  const at = html.indexOf(anchor);
  if (at < 0) refuse("could not find `const CHANGES = [` in the codex — the changelog the app reads is missing");
  if (html.indexOf(anchor, at + 1) >= 0) refuse("`const CHANGES = [` appears more than once — anchor is ambiguous");

  const added = ranges(ids).map(s => JSON.stringify(s)).join(",");
  const head = html.slice(0, at + anchor.length);
  const rest = html.slice(at + anchor.length);

  // Same-day re-run: widen today's entry instead of adding a second one.
  const today = rest.match(/^\s*\{date:"(\d{4}-\d{2}-\d{2})",[\s\S]*?added:\[([^\]]*)\]/);
  if (today && today[1] === date) {
    const merged = ranges(mergeIds(today[2], ids)).map(s => JSON.stringify(s)).join(",");
    return head + rest.replace(`added:[${today[2]}]`, `added:[${merged}]`);
  }
  return head + `\n  {date:${JSON.stringify(date)}, title:${JSON.stringify(title)},\n` +
         `   added:[${added}], updated:[]},` + rest;
}

/**
 * Point every game the splice touched at its digest (`digest:"<slug>"` on the BASE_GAMES
 * row), so the digest file is claimed the moment its rows land. A digest that yields no
 * rows at all is stamped by hand: `node scripts/game_rows.mjs --game "<title>" --set digest=<slug> --write`.
 */
export function stampDigest(html, titles, slug) {
  let next = html;
  for (const t of new Set(titles)) next = setOwnedFields(next, t, { digest: slug });
  return next;
}

/** ["M266","M267","M269"] -> ["M266-M267","M269"] — the compact form the file uses. */
export function ranges(ids) {
  // Mechanics before minigames, deliberately: localeCompare puts "g" before "M" (it
  // folds case), which would silently invert the order the file has always used.
  const rank = p => (p === "M" ? 0 : 1);
  const sorted = [...new Set(ids)].sort((a, b) =>
    a[0] === b[0] ? Number(a.slice(1)) - Number(b.slice(1)) : rank(a[0]) - rank(b[0]));
  const out = [];
  for (const id of sorted) {
    const p = id[0], n = Number(id.slice(1)), w = id.length - 1;
    const last = out[out.length - 1];
    if (last && last.p === p && last.b + 1 === n) last.b = n;
    else out.push({ p, a: n, b: n, w });
  }
  return out.map(r => r.a === r.b ? r.p + String(r.a).padStart(r.w, "0")
    : `${r.p}${String(r.a).padStart(r.w, "0")}-${r.p}${String(r.b).padStart(r.w, "0")}`);
}

function mergeIds(existing, ids) {
  const have = (existing.match(/"([^"]+)"/g) || []).map(s => s.slice(1, -1));
  const flat = [];
  for (const e of have) {
    const r = e.match(/^([Mg])(\d+)-[Mg](\d+)$/);
    if (r) { const w = r[2].length; for (let i = +r[2]; i <= +r[3]; i++) flat.push(r[1] + String(i).padStart(w, "0")); }
    else flat.push(e);
  }
  return flat.concat(ids);
}

/** Point each candidate's `row:` line at its new id, and retire the ```js block. */
export function updateDigest(md, assignments, digest) {
  const lines = digest.lines.slice();
  for (const a of assignments) {
    let i = a.candidate.line + 1;
    while (i < lines.length && !/^#{2,3} /.test(lines[i]) && !/^```/.test(lines[i])) {
      if (/^row:\s*/.test(lines[i])) break;
      i++;
    }
    if (i < lines.length && /^row:\s*/.test(lines[i])) lines[i] = `row: ${a.id}`;
    else {
      // No `row:` line yet — put one after the candidate's pointers line, or its heading.
      let j = a.candidate.line + 1, at = a.candidate.line;
      while (j < lines.length && !/^#{2,3} /.test(lines[j]) && !/^```/.test(lines[j])) {
        if (/^pointers:\s*/.test(lines[j])) { at = j; break; }
        j++;
      }
      lines.splice(at + 1, 0, `row: ${a.id}`);
      for (const b of assignments) if (b.candidate.line > at) b.candidate.line++;
    }
  }
  const out = lines.join("\n");

  const width = Math.max(...assignments.map(a => a.candidate.name.length), 10);
  const map = assignments.map(a =>
    `// ${a.id}  ${a.candidate.name.padEnd(width)}  ${a.kind === "M" ? a.row.cat : (a.row.rt ? `rt: ${a.row.rt.length} rows` : "no reward table")}`
  );
  const block = "```js\n"
    + `// Spliced into JRPG_Design_Codex.html on ${new Date().toISOString().slice(0, 10)} by\n`
    + "// scripts/splice_rows.mjs (the rows there are the source of truth; this is the map).\n"
    + map.join("\n") + "\n```";

  // The block moved if a `row:` line was inserted above it — re-find it by content.
  const fence = out.slice(out.indexOf("\n## Codex rows")).match(/```js\n[\s\S]*?```/);
  const from = out.indexOf("\n## Codex rows") + out.slice(out.indexOf("\n## Codex rows")).indexOf(fence[0]);
  return out.slice(0, from) + block + out.slice(from + fence[0].length);
}

// ---------------------------------------------------------------------- main

function main(argv) {
  const write = argv.includes("--write");
  const path = argv.find(a => !a.startsWith("--"));
  if (!path) {
    console.error("usage: node scripts/splice_rows.mjs docs/research/<slug>.md [--write]");
    process.exit(2);
  }
  const digestPath = resolve(ROOT, path);
  const html = readFileSync(CODEX, "utf8");
  const md = readFileSync(digestPath, "utf8");

  const { assignments, problems, digest } = planSplice(html, md);
  if (problems.length) {
    console.error(`\n${problems.length} problem${problems.length === 1 ? "" : "s"} — nothing written:`);
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }

  const mechs = assignments.filter(a => a.kind === "M");
  const minis = assignments.filter(a => a.kind === "g");
  console.log(`${path}: ${mechs.length} mechanics, ${minis.length} minigames`);
  for (const a of assignments) console.log(`  ${a.placeholder} → ${a.id}  ${a.candidate.name}`);

  let next = appendToArray(html, "BASE_MECHS", mechs.map(serializeRow));
  next = appendToArray(next, "MINIGAMES", minis.map(serializeRow));
  const title = (md.match(/^#\s+(.+?)\s*$/m) || [, "Research"])[1].replace(/\s+—\s+research digest$/i, "");
  next = logChange(next, {
    date: new Date().toISOString().slice(0, 10),
    title,
    ids: assignments.map(a => a.id),
  });
  const slug = basename(digestPath, ".md");
  const touched = assignments.map(a => (a.kind === "M" ? a.row.game : a.row.g));
  next = stampDigest(next, touched, slug);

  if (!write) {
    console.log(`\n--- dry run: ${next.length - html.length} chars would be added to the codex ---`);
    for (const a of assignments) console.log(serializeRow(a).split("\n")[0].slice(0, 120) + " …");
    console.log(`changelog: would log ${ranges(assignments.map(a => a.id)).join(", ")} under today's date`);
    console.log(`digest: would stamp digest:${JSON.stringify(slug)} on ${[...new Set(touched)].map(t => JSON.stringify(t)).join(", ")}`);
    console.log("\nnothing written. Re-run with --write to apply.");
    return;
  }

  writeFileSync(CODEX, next);
  writeFileSync(digestPath, updateDigest(md, assignments, digest));
  console.log(`\nwrote ${assignments.length} rows into JRPG_Design_Codex.html and updated ${path}.`);
  console.log(`Logged in CHANGES as ${ranges(assignments.map(a => a.id)).join(", ")}; stamped digest:${JSON.stringify(slug)} on the game row(s).`);
  console.log("If you also SHARPENED an existing row, add its id to that entry's `updated` list —");
  console.log("scripts/check_changes.mjs fails the build otherwise.");
  console.log("Now update the counts in CLAUDE.md and README.md, copy CLAUDE.md to AGENTS.md,");
  console.log("then run: node scripts/validate_codex.mjs --selftest");
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
