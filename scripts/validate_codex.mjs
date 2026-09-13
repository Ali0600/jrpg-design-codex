#!/usr/bin/env node
/**
 * Structural validator for JRPG_Design_Codex.html.
 *
 * The single HTML file IS the database, so a bad edit is data loss rather than a
 * build error. This runs in CI on every push and PR.
 *
 *   node scripts/validate_codex.mjs            validate the real file
 *   node scripts/validate_codex.mjs --selftest prove each check can go RED
 *
 * The --selftest pass matters as much as the real one: a gate that has only ever
 * passed cannot distinguish "the data is sound" from "the check does nothing".
 */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CODEX = join(ROOT, "JRPG_Design_Codex.html");

/**
 * Minigames survey the whole Final Fantasy series, but BASE_GAMES only holds games
 * researched for mechanics — so these titles are referenced without a roster row on
 * purpose. Anything OUTSIDE this list is treated as a typo.
 */
const KNOWN_UNROSTERED = new Set([
  "Final Fantasy I",
  "Final Fantasy IV",
  "Final Fantasy V",
  "Final Fantasy VII Remake",
  "Final Fantasy X-2",
  "Final Fantasy XIII-2",
  "Final Fantasy XIV",
  "Final Fantasy XV",
]);

/**
 * The categories a discovery verb can describe. Every mechanic in them needs a docs/verbs.md
 * entry — tags, or a reasoned `none` — so "reviewed" is a checkable claim rather than a
 * sweep someone once did. A policy list like KNOWN_UNROSTERED, checked against CATS so a
 * rename cannot quietly empty it.
 */
const DISCOVERY_CATS = new Set(["Exploration & Rewards", "Traversal", "Side Content & Minigames"]);

const WANT = new Set(["Yes", "Maybe", "No", ""]);
const STATUS = new Set(["Researched", "Researching", "To Research"]);

/**
 * The script-owned game-row fields (written by game_rows.mjs, never by hand). `gf` is the
 * GameFAQs game-page harvest; its key list is the one game_rows.mjs writes in this order.
 * Every string in it is capped: a Game Detail label or a related game's title fits in 120
 * chars, and a publisher's blurb does not — that cap is the machine-checkable form of
 * "GameFAQs prose is never stored".
 */
const GF_KEYS = new Set(["u", "plat", "genre", "dev", "pub", "rel", "fr", "aka", "also", "rating", "diff", "len", "like", "note", "at"]);
const GF_PATH = /^\/[a-z0-9-]+\/\d+-[a-z0-9-]+$/;
const GF_MAX_TEXT = 120;
const GF_YEAR_WINDOW = 2;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const twoDp = v => typeof v === "number" && Number.isFinite(v) && Math.abs(v * 100 - Math.round(v * 100)) < 1e-9;

function checkGf(g, label, errors, seenU) {
  const gf = g.gf;
  if (!gf || typeof gf !== "object" || Array.isArray(gf)) { errors.push(`${label}: gf must be an object`); return; }
  for (const k of Object.keys(gf)) if (!GF_KEYS.has(k)) errors.push(`${label}: gf: unknown key ${JSON.stringify(k)}`);
  if (!GF_PATH.test(gf.u ?? "")) errors.push(`${label}: gf.u must be a site-relative path /<platform>/<id>-<slug>, got ${JSON.stringify(gf.u)}`);
  else if (seenU.has(gf.u)) errors.push(`${label}: gf.u ${gf.u} already used by ${JSON.stringify(seenU.get(gf.u))}`);
  else seenU.set(gf.u, g.title);
  for (const k of ["plat", "rel"]) if (!isText(gf[k])) errors.push(`${label}: gf.${k} is required`);
  for (const k of ["dev", "pub", "note"]) if (gf[k] != null && !isText(gf[k])) errors.push(`${label}: gf.${k} must be non-empty text`);
  if (!ISO_DATE.test(gf.at ?? "")) errors.push(`${label}: gf.at must be the ISO harvest date, got ${JSON.stringify(gf.at)}`);
  for (const k of ["genre", "fr", "aka", "also"]) {
    if (gf[k] != null && !(Array.isArray(gf[k]) && gf[k].length && gf[k].every(isText))) errors.push(`${label}: gf.${k} must be a non-empty array of text`);
  }
  for (const k of ["rating", "diff", "len"]) {
    const r = gf[k];
    if (r == null) continue;
    if (!r || typeof r !== "object" || Array.isArray(r)) { errors.push(`${label}: gf.${k} must be an object`); continue; }
    for (const kk of Object.keys(r)) if (!["v", "n", "w"].includes(kk)) errors.push(`${label}: gf.${k}: unknown key ${JSON.stringify(kk)}`);
    const max = k === "len" ? 10000 : 5;
    if (r.v != null && !(twoDp(r.v) && r.v >= 0 && r.v <= max)) errors.push(`${label}: gf.${k}.v out of range (0-${max}, two decimals): ${r.v}`);
    if (r.n != null && !(Number.isInteger(r.n) && r.n > 0)) errors.push(`${label}: gf.${k}.n must be a positive integer, got ${r.n}`);
    if (r.w != null && !isText(r.w)) errors.push(`${label}: gf.${k}.w must be text`);
  }
  if (gf.like != null) {
    if (!Array.isArray(gf.like)) errors.push(`${label}: gf.like must be an array`);
    else {
      const seen = new Set();
      gf.like.forEach((l, i) => {
        const where = `${label}: gf.like[${i}]`;
        if (!l || typeof l !== "object") { errors.push(`${where} must be {t,u}`); return; }
        for (const kk of Object.keys(l)) if (!["t", "u"].includes(kk)) errors.push(`${where}: unknown key ${JSON.stringify(kk)} — only t and u are stored`);
        if (!isText(l.t)) errors.push(`${where}: t must be text`);
        if (!GF_PATH.test(l.u ?? "")) errors.push(`${where}: u must be a site-relative game path, got ${JSON.stringify(l.u)}`);
        if (seen.has(l.u)) errors.push(`${where}: ${l.u} listed twice`);
        seen.add(l.u);
      });
    }
  }
  const walk = (v, path) => {
    if (typeof v === "string") { if (v.length > GF_MAX_TEXT) errors.push(`${label}: gf${path} is ${v.length} chars — longer than ${GF_MAX_TEXT}, and prose is not stored`); }
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
    else if (v && typeof v === "object") for (const k of Object.keys(v)) walk(v[k], `${path}.${k}`);
  };
  walk(gf, "");
  const ym = String(gf.rel ?? "").match(/\b(19|20)\d{2}\b/);
  if (ym && Number.isInteger(g.year) && Math.abs(Number(ym[0]) - g.year) > GF_YEAR_WINDOW && !isText(gf.note)) {
    errors.push(`${label}: gf.rel release year ${ym[0]} is more than ${GF_YEAR_WINDOW} years from year ${g.year} and gf.note does not explain it — a port or remake page?`);
  }
}

// ---------------------------------------------------------------- extraction

export function extractScript(html) {
  const m = html.match(/<script>([\s\S]*)<\/script>/);
  if (!m) throw new Error("no <script> block found");
  return m[1];
}

/**
 * The data arrays sit in one contiguous prefix ending at the STATE banner. They must
 * be evaluated together, not one array at a time: some game rows reference shared
 * consts (title:FF) declared alongside them.
 */
export function extractData(script) {
  const start = script.indexOf("const CATS");
  const end = script.indexOf("/* ============================= STATE");
  if (start < 0) throw new Error("could not locate `const CATS` — data region moved");
  if (end < 0) throw new Error("could not locate the STATE banner — data region moved");
  if (end <= start) throw new Error("STATE banner precedes the data region");
  return script.slice(start, end);
}

// ------------------------------------------------------------------- helpers

const isText = v => typeof v === "string" && v.trim() !== "";

/** The page's own source-host allowlist — `const REF_HOSTS = /.../i;` — read, not restated. */
export function readRefHosts(script) {
  const m = script.match(/const REF_HOSTS\s*=\s*(\/(?:\\\/|[^\/\n])+\/[a-z]*);/);
  if (!m) return null;
  try { return new Function("return " + m[1])(); } catch { return null; }
}

function checkSequence(rows, prefix, width, errors) {
  const seen = new Map();
  rows.forEach((row, i) => {
    const id = row.id;
    if (typeof id !== "string" || !id.startsWith(prefix)) {
      errors.push(`${prefix}: row ${i} has malformed id ${JSON.stringify(id)}`);
      return;
    }
    if (seen.has(id)) errors.push(`${prefix}: duplicate id ${id} (rows ${seen.get(id)} and ${i})`);
    else seen.set(id, i);

    const expected = prefix + String(i + 1).padStart(width, "0");
    if (id !== expected) {
      errors.push(`${prefix}: id sequence break at row ${i} — expected ${expected}, found ${id}`);
    }
  });
}

function checkFields(row, label, required, errors) {
  for (const f of required) {
    if (!isText(row[f])) errors.push(`${label}: field \`${f}\` is missing or empty`);
  }
}

/**
 * The restore contract. `let store = {...}` IS the schema, and `normalizeStore` must fill
 * every slot in it — a backup written before a field existed restores that field as
 * undefined, which is the failure the page's own comment names: "a restored v1 backup must
 * never leave store.myGame.assign undefined".
 *
 * Both lists are READ out of the page, never restated here: the literal is evaluated, the
 * handled slots come off the assignment left-hand sides. They are compared WHOLE and both
 * ways, so a rename landing on one side only is caught from either direction.
 *
 * The walk goes one level into plain objects deliberately. `myGame.assign` is the exact
 * path the comment warns about, and a top-level-only check skips it — it would read as
 * covering that bug while a forgotten `s.myGame.<new>` sailed through.
 *
 * Fails closed: an extraction that quietly returned nothing would satisfy every set
 * comparison below and gate nothing at all.
 */
function checkStoreSchema(script, errors) {
  const lit = script.match(/\nlet store\s*=\s*(\{[\s\S]*?\});/);
  const body = script.match(/\nfunction normalizeStore\(s\)\s*\{([\s\S]*?)\n\}/);
  if (!lit) errors.push("could not find the `let store = {...}` literal — the STATE block moved");
  if (!body) errors.push("could not find `function normalizeStore(s)` — the STATE block moved");
  if (!lit || !body) return;

  const declared = [];
  try {
    const walk = (o, prefix) => {
      for (const k of Object.keys(o)) {
        const path = prefix ? `${prefix}.${k}` : k;
        declared.push(path);
        const v = o[k];
        if (v && typeof v === "object" && !Array.isArray(v)) walk(v, path);
      }
    };
    walk(new Function("return " + lit[1])(), "");
  } catch (e) {
    errors.push(`the \`store\` literal does not evaluate: ${e.message}`);
    return;
  }

  const handled = [...body[1].matchAll(/^\s*s((?:\.\w+)+)\s*=/gm)].map(m => m[1].slice(1));
  if (!declared.length) {
    errors.push("the `store` literal declares no slots — the extraction is broken, not the data");
    return;
  }
  if (!handled.length) {
    errors.push("normalizeStore assigns no `s.<slot>` — the extraction is broken, not the data");
    return;
  }

  const H = new Set(handled), D = new Set(declared);
  for (const p of declared) {
    if (!H.has(p)) {
      errors.push(`store.${p} is declared in the \`store\` literal but normalizeStore never defaults it — a restored backup would leave it undefined`);
    }
  }
  for (const p of H) {
    if (!D.has(p)) {
      errors.push(`normalizeStore defaults store.${p}, which the \`store\` literal does not declare — a half-finished rename resurrects a dead slot on every load`);
    }
  }
}

// ------------------------------------------------------------ evidence ledgers

/**
 * An evidence ledger is where a claim about a row is justified by quoting the row itself,
 * so "defensible from the row's own text, or not written" is something a build can check
 * rather than a sentence it trusts. Two use one grammar: `docs/verbs.md` (the tag slot holds
 * a discovery verb) and `docs/lineages.md` (it holds the name of a lineage the row sits in).
 *
 * Grammar, one entry per row:
 *   ### M021 — <the row's exact name>
 *   - <Tag> · <how|loop|notes> · `<quote>`         one line per tag, or
 *   - none · <why nothing applies>                  exactly one line
 *
 * Text before the first `###`, and under any `#`/`##` heading, is free prose. Inside an
 * entry every non-blank line must parse: a typo that silently dropped a tag would leave
 * the row looking reviewed.
 *
 * The parser lives in this file, not beside the writer, because this file must import
 * nothing local (see sabotageCount) and the gate and the writer must read one grammar.
 */
export const LEDGER_FIELDS = ["how", "loop", "notes"];
export const MIN_QUOTE = 25;

export function parseLedger(md, file = "docs/verbs.md") {
  const entries = new Map(), problems = [];
  let cur = null;
  const at = n => `${file}:${n}`;
  const finish = () => {
    if (cur && !cur.none && !cur.tags.length) problems.push(`${at(cur.line)}: ### ${cur.id} has no tag line and no \`- none\` line`);
    cur = null;
  };
  String(md).split("\n").forEach((raw, i) => {
    const n = i + 1, line = raw.replace(/\s+$/, "");
    if (/^#{1,2} /.test(line)) { finish(); return; }
    if (/^###/.test(line)) {
      finish();
      const h = line.match(/^### (M\d{3}) — (.+)$/);
      if (!h) { problems.push(`${at(n)}: a ### header must read \`### M123 — <row name>\`, got ${JSON.stringify(line)}`); return; }
      cur = { id: h[1], name: h[2], tags: [], none: null, line: n };
      if (entries.has(h[1])) problems.push(`${at(n)}: ${h[1]} has a second entry (the first is at line ${entries.get(h[1]).line})`);
      else entries.set(h[1], cur);
      return;
    }
    if (!cur || line === "") return;
    const none = line.match(/^- none · (\S.*)$/);
    const tag = none ? null : line.match(/^- (\S.*?) · ([a-z]+) · `([^`]+)`$/);
    if (!none && !tag) {
      problems.push(`${at(n)}: ${cur.id}: cannot read ${JSON.stringify(line)} — a tag line is "- <Verb> · <how|loop|notes> · \`quote\`", or "- none · <reason>"`);
      return;
    }
    if (none ? cur.none || cur.tags.length : cur.none) {
      problems.push(`${at(n)}: ${cur.id} mixes \`- none\` with other lines — an entry is either tags or one none`);
      return;
    }
    if (none) { cur.none = none[1]; return; }
    const [, verb, field, quote] = tag;
    if (!LEDGER_FIELDS.includes(field)) { problems.push(`${at(n)}: ${cur.id}: field ${JSON.stringify(field)} is not one of ${LEDGER_FIELDS.join(", ")}`); return; }
    if (cur.tags.some(t => t.verb === verb)) { problems.push(`${at(n)}: ${cur.id} tags ${JSON.stringify(verb)} twice`); return; }
    cur.tags.push({ verb, field, quote, line: n });
  });
  finish();
  return { entries, problems, file };
}

/**
 * Checks a parsed ledger against the rows it describes: the header names the row it claims
 * to (a `none` entry has no quote, so this is its only guard against a typo'd id), and every
 * quote is a real span of the named field — compared with the EVALUATED string, never the
 * source text, so an escape in the file cannot make a quote match or miss.
 */
export function ledgerProblems({ entries, file = "docs/verbs.md" }, mechs) {
  const byId = new Map(mechs.map(m => [m.id, m]));
  const out = [];
  for (const e of entries.values()) {
    const row = byId.get(e.id);
    if (!row) { out.push(`${file}:${e.line}: ### ${e.id} names no mechanic in the codex`); continue; }
    if (row.name !== e.name) out.push(`${file}:${e.line}: ### ${e.id} names ${JSON.stringify(e.name)}, the row is named ${JSON.stringify(row.name)}`);
    for (const t of e.tags) {
      if (t.quote.length < MIN_QUOTE) {
        out.push(`${file}:${t.line}: ${e.id} · ${t.verb}: quote is ${t.quote.length} chars — evidence needs at least ${MIN_QUOTE}`);
      } else if (!(typeof row[t.field] === "string" && row[t.field].includes(t.quote))) {
        out.push(`${file}:${t.line}: ${e.id} · ${t.verb}: quote is not in the row's ${t.field} — ${JSON.stringify(t.quote.slice(0, 60))}`);
      }
    }
  }
  return out;
}

/** Parse a ledger and check it against its rows: grammar problems and row problems, one list. */
export function readLedger(md, file, mechs) {
  const parsed = parseLedger(md, file);
  return { ...parsed, problems: [...parsed.problems, ...ledgerProblems(parsed, mechs)] };
}

// -------------------------------------------------------------------- checks

export function validate(html, docs = {}) {
  const errors = [];
  const script = extractScript(html);

  // Parse-only. Never call it: this is page code that expects a DOM.
  try {
    new Function(script);
  } catch (e) {
    errors.push(`script does not parse: ${e.message}`);
    return { errors, stats: null }; // nothing downstream is trustworthy
  }

  let data;
  try {
    const src = extractData(script);
    data = new Function(
      src +
        "; return {CATS, BASE_MECHS, BASE_GAMES, PILLARS, MINIGAMES," +
        " LINEAGES: typeof LINEAGES === 'undefined' ? null : LINEAGES," +
        " VERBS: typeof VERBS === 'undefined' ? null : VERBS," +
        " SHOTS: typeof SHOTS === 'undefined' ? null : SHOTS," +
        " SHOT_TYPES: typeof SHOT_TYPES === 'undefined' ? null : SHOT_TYPES," +
        " CHANGES: typeof CHANGES === 'undefined' ? null : CHANGES," +
        " expandIds: typeof expandIds === 'undefined' ? null : expandIds};"
    )();
  } catch (e) {
    errors.push(`data region does not evaluate: ${e.message}`);
    return { errors, stats: null };
  }

  const { CATS, BASE_MECHS, BASE_GAMES, PILLARS, MINIGAMES, LINEAGES, VERBS, SHOTS, SHOT_TYPES,
          CHANGES, expandIds } = data;
  for (const [name, arr] of [
    ["BASE_MECHS", BASE_MECHS], ["BASE_GAMES", BASE_GAMES],
    ["MINIGAMES", MINIGAMES], ["PILLARS", PILLARS],
  ]) {
    if (!Array.isArray(arr)) errors.push(`${name} is not an array`);
  }
  if (errors.length) return { errors, stats: null };

  const cats = new Set(Object.keys(CATS));
  const titles = new Set(BASE_GAMES.map(g => g.title));

  // --- games
  const seenTitle = new Set();
  const seenU = new Map(), coverRefs = new Set(), digestRefs = new Map();
  for (const g of BASE_GAMES) {
    const label = `game ${JSON.stringify(g.title ?? "(untitled)")}`;
    checkFields(g, label, ["title", "dev", "status"], errors);
    if (seenTitle.has(g.title)) errors.push(`${label}: duplicate title`);
    seenTitle.add(g.title);
    if (!STATUS.has(g.status)) errors.push(`${label}: status ${JSON.stringify(g.status)} not one of ${[...STATUS].join(" | ")}`);
    if (g.year != null && !(Number.isInteger(g.year) && g.year >= 1980 && g.year <= 2100)) {
      errors.push(`${label}: implausible year ${g.year}`);
    }
    // Score guards mirror scripts/fetch_scores.py, re-asserted at rest: a flattened
    // index pointer scraped as a score (2769, 3830) must never survive in the file.
    if (g.mc != null && !(Number.isInteger(g.mc) && g.mc >= 1 && g.mc <= 100)) {
      errors.push(`${label}: Metascore out of range: ${g.mc}`);
    }
    if (g.us != null && !(typeof g.us === "number" && g.us >= 0.1 && g.us <= 10 && Math.round(g.us * 10) === g.us * 10)) {
      errors.push(`${label}: user score out of range or over one decimal: ${g.us}`);
    }
    for (const f of ["mcN", "usN"]) {
      if (g[f] != null && !(Number.isInteger(g[f]) && g[f] > 0)) errors.push(`${label}: ${f} must be a positive integer, got ${g[f]}`);
    }
    if (g.mcUrl != null && !/^https:\/\/www\.metacritic\.com\//.test(g.mcUrl)) {
      errors.push(`${label}: mcUrl is not a metacritic.com https URL`);
    }
    if (g.status === "To Research" && !isText(g.why)) {
      errors.push(`${label}: queued games need a \`why\` research brief`);
    }
    // --- the script-owned fields
    if (g.gf != null) checkGf(g, label, errors, seenU);
    if (g.cover != null) {
      if (!/^covers\/[a-z0-9-]+\.(jpg|png|webp)$/.test(g.cover)) errors.push(`${label}: cover must match covers/<slug>.(jpg|png|webp), got ${JSON.stringify(g.cover)}`);
      else if (coverRefs.has(g.cover)) errors.push(`${label}: cover ${g.cover} is also used by another row`);
      else coverRefs.add(g.cover);
      if (!isText(g.wp)) errors.push(`${label}: has a cover but no wp — the cover's provenance is its Wikipedia article`);
    }
    if (g.wp != null && !isText(g.wp)) errors.push(`${label}: wp must be a non-empty Wikipedia article title`);
    if (g.digest != null) {
      if (!/^[a-z0-9-]+$/.test(g.digest)) errors.push(`${label}: digest must be a docs/research slug, got ${JSON.stringify(g.digest)}`);
      else if (digestRefs.has(g.digest)) errors.push(`${label}: digest ${JSON.stringify(g.digest)} is also claimed by ${JSON.stringify(digestRefs.get(g.digest))}`);
      else digestRefs.set(g.digest, g.title);
    }
  }
  // Two-way set equality against the real folders, the same posture as SHOTS below: a row
  // naming a file that is not there is a broken link, and a file no row names is an orphan
  // nobody will ever audit. Fail closed when the folder cannot be listed.
  if (docs.digestFiles == null && digestRefs.size) errors.push("game rows claim digests but docs/research could not be listed");
  if (docs.digestFiles != null) {
    for (const [slug, t] of digestRefs) if (!docs.digestFiles.has(slug)) errors.push(`game ${JSON.stringify(t)}: digest ${JSON.stringify(slug)} has no docs/research/${slug}.md`);
    for (const f of docs.digestFiles) if (!digestRefs.has(f)) errors.push(`docs/research/${f}.md is not claimed by any game row's \`digest\` — stamp it (game_rows.mjs --set digest=${f})`);
  }
  if (docs.coverFiles == null && coverRefs.size) errors.push("game rows carry covers but the covers/ folder could not be listed — every cover would 404");
  if (docs.coverFiles != null) {
    for (const c of coverRefs) if (!docs.coverFiles.has(c)) errors.push(`cover ${JSON.stringify(c)}: file missing from the covers/ folder`);
    for (const f of docs.coverFiles) if (!coverRefs.has(f)) errors.push(`covers folder: ${JSON.stringify(f)} is not referenced by any game row — delete it or set the row's cover`);
  }

  // --- mechanics
  checkSequence(BASE_MECHS, "M", 3, errors);
  for (const m of BASE_MECHS) {
    const label = `mechanic ${m.id ?? "(no id)"}`;
    checkFields(m, label, ["id", "game", "name", "cat", "how", "loop"], errors);
    if (!cats.has(m.cat)) errors.push(`${label}: category ${JSON.stringify(m.cat)} is not a key of CATS`);
    if (!WANT.has(m.want ?? "")) errors.push(`${label}: want ${JSON.stringify(m.want)} not one of Yes | Maybe | No | ""`);
    if (m.rating != null && !(Number.isInteger(m.rating) && m.rating >= 0 && m.rating <= 5)) {
      errors.push(`${label}: rating must be 0-5, got ${m.rating}`);
    }
    // A mechanic pointing at a game with no roster row is unreachable from the Games tab.
    if (isText(m.game) && !titles.has(m.game)) {
      errors.push(`${label}: unknown game ${JSON.stringify(m.game)} — no BASE_GAMES row`);
    }
  }

  // --- minigames
  checkSequence(MINIGAMES, "g", 3, errors);
  for (const mg of MINIGAMES) {
    const label = `minigame ${mg.id ?? "(no id)"}`;
    checkFields(mg, label, ["id", "g", "n", "p", "r", "l"], errors);
    if (isText(mg.g) && !titles.has(mg.g) && !KNOWN_UNROSTERED.has(mg.g)) {
      errors.push(`${label}: unknown game ${JSON.stringify(mg.g)} — not on the roster and not a known unrostered FF title`);
    }
    if (mg.rt != null) {
      if (!Array.isArray(mg.rt) || mg.rt.length === 0) {
        errors.push(`${label}: rt must be a non-empty array when present`);
      } else {
        mg.rt.forEach((r, i) => {
          if (!isText(r.at)) errors.push(`${label}: rt row ${i} has an empty \`at\` threshold`);
          if (!isText(r.get)) errors.push(`${label}: rt row ${i} has an empty \`get\` reward`);
        });
      }
    }
  }

  // --- pillars
  PILLARS.forEach((p, i) => checkFields(p, `pillar ${p.n ?? i}`, ["t", "m", "q"], errors));
  if (PILLARS.length === 0) errors.push("PILLARS is empty");

  // --- optional structures (present once the power-features work lands)
  if (LINEAGES) {
    const mechById = new Map(BASE_MECHS.map(m => [m.id, m]));
    const yearOf = new Map(BASE_GAMES.map(g => [g.title, g.year]));
    const chainsOf = new Map();                     // mechanic id -> the chain names listing it
    for (const l of LINEAGES) {
      const label = `lineage ${JSON.stringify(l.name ?? "(unnamed)")}`;
      checkFields(l, label, ["name", "note"], errors);
      const ids = l.ids ?? [];
      const seen = new Set();
      for (const id of ids) {
        if (!mechById.has(id)) errors.push(`${label}: references missing mechanic ${id}`);
        if (seen.has(id)) errors.push(`${label}: lists ${id} twice`);
        seen.add(id);
        if (!chainsOf.has(id)) chainsOf.set(id, new Set());
        chainsOf.get(id).add(l.name);
      }
      // A counter-example must be a node of its own chain, or it renders as nothing — and the
      // LAST one, because the renderer draws it after a ✕ and the note says it ends the chain.
      if (l.counter != null && !ids.includes(l.counter)) {
        errors.push(`${label}: counter ${l.counter} is not in its own ids list`);
      } else if (l.counter != null && ids[ids.length - 1] !== l.counter) {
        errors.push(`${label}: counter ${l.counter} must be the last node`);
      }
      const nodes = ids.filter(id => id !== l.counter);
      if (nodes.length < 3) errors.push(`${label}: has ${nodes.length} nodes besides its counter — a lineage needs at least 3`);
      // Emphasis is never positional: the green node is named, and it must be a real node.
      if (!nodes.includes(l.best)) errors.push(`${label}: best ${JSON.stringify(l.best)} must name a node of its own chain that is not the counter`);
      // "In release order" is the page's claim, so it is the rule. Ties are fine.
      let prev = null;
      for (const id of nodes) {
        const year = yearOf.get(mechById.get(id)?.game);
        if (prev && year < prev.year) errors.push(`${label}: ${id} (${year}) follows ${prev.id} (${prev.year}) — nodes run in release order`);
        prev = { id, year };
      }
    }
    // --- the lineage ledger: every node quoted from its own row, compared both ways.
    if (docs.lineageLedger == null) {
      errors.push("docs/lineages.md could not be read — every lineage node must be quoted there");
    } else {
      const ledger = readLedger(docs.lineageLedger, "docs/lineages.md", BASE_MECHS);
      errors.push(...ledger.problems);
      for (const [id, names] of chainsOf) {
        const quoted = new Set((ledger.entries.get(id)?.tags ?? []).map(t => t.verb));
        for (const n of names) {
          if (!quoted.has(n)) errors.push(`lineage ${JSON.stringify(n)} lists ${id}, but docs/lineages.md quotes no evidence for it`);
        }
      }
      for (const e of ledger.entries.values()) {
        for (const t of e.tags) {
          if (!chainsOf.get(e.id)?.has(t.verb)) errors.push(`docs/lineages.md quotes ${e.id} for ${JSON.stringify(t.verb)}, but that lineage does not list it`);
        }
      }
    }
  }
  if (VERBS) {
    const verbSet = new Set(Array.isArray(VERBS) ? VERBS : Object.keys(VERBS));
    for (const m of BASE_MECHS) {
      const seen = new Set();
      for (const v of m.verbs ?? []) {
        if (!verbSet.has(v)) errors.push(`mechanic ${m.id}: unknown discovery verb ${JSON.stringify(v)}`);
        if (seen.has(v)) errors.push(`mechanic ${m.id} carries ${JSON.stringify(v)} twice`);
        seen.add(v);
      }
    }
    // --- the evidence ledger. Tags are compared as SETS both ways, so a tag added to the page
    // without a quote and a quote whose tag never reached the page are each caught — and a
    // missing entry justifies nothing, which is what stops a hand-added tag from passing.
    if (docs.verbLedger == null) {
      errors.push("docs/verbs.md could not be read — every discovery-verb tag must be justified there");
    } else {
      const ledger = readLedger(docs.verbLedger, "docs/verbs.md", BASE_MECHS);
      errors.push(...ledger.problems);
      for (const m of BASE_MECHS) {
        const carried = new Set(m.verbs ?? []);
        const justified = new Set((ledger.entries.get(m.id)?.tags ?? []).map(t => t.verb));
        for (const v of carried) {
          if (!justified.has(v)) errors.push(`${m.id} carries ${JSON.stringify(v)}, which docs/verbs.md does not justify — quote the row in its entry, or drop the tag there and run scripts/verb_tags.mjs --write`);
        }
        for (const v of justified) {
          if (!carried.has(v)) errors.push(`docs/verbs.md justifies ${JSON.stringify(v)} on ${m.id}, which the codex does not carry — run scripts/verb_tags.mjs --write`);
        }
      }
      // Review coverage. Named categories must exist, or a CATS rename would leave this rule
      // checking an empty set and passing forever.
      for (const c of DISCOVERY_CATS) {
        if (!cats.has(c)) errors.push(`DISCOVERY_CATS names ${JSON.stringify(c)}, which is not a CATS key — the review-coverage rule would cover nothing`);
      }
      for (const m of BASE_MECHS) {
        if (DISCOVERY_CATS.has(m.cat) && !ledger.entries.has(m.id)) {
          errors.push(`${m.id} (${m.cat}) has no docs/verbs.md entry — quote the verbs that apply, or write \`- none · <reason>\``);
        }
      }
    }
  }
  // --- provenance: optional refs:[{u,t}] on mechanic and minigame rows. The host
  // allowlist is read from the page itself (REF_HOSTS beside refOk()), so the gate and
  // the renderer cannot drift: what the page refuses to link, this refuses to ship.
  const refHosts = readRefHosts(script);
  const checkRefs = (row, label) => {
    if (row.refs == null) return;
    if (!refHosts) { errors.push(`${label}: has refs but the page defines no REF_HOSTS allowlist`); return; }
    if (!Array.isArray(row.refs) || row.refs.length === 0) { errors.push(`${label}: refs must be a non-empty array of {u,t}`); return; }
    for (const r of row.refs) {
      if (!isText(r?.t)) errors.push(`${label}: refs entry has an empty label`);
      let u = null;
      try { u = new URL(String(r?.u ?? "")); } catch { /* not a URL at all */ }
      if (!u || u.protocol !== "https:" || !refHosts.test(u.hostname)) {
        errors.push(`${label}: refs entry ${JSON.stringify(r?.u ?? "")} is not an allowed https host`);
      }
    }
  };
  BASE_MECHS.forEach(m => checkRefs(m, `mechanic ${m.id}`));
  MINIGAMES.forEach(g => checkRefs(g, `minigame ${g.id}`));

  if (SHOTS) {
    const typeSet = new Set(SHOT_TYPES ?? []);
    const referenced = new Set();
    for (const s of SHOTS) {
      const label = `shot ${JSON.stringify(s.src ?? "(no src)")}`;
      if (!titles.has(s.game)) errors.push(`${label}: unknown game ${JSON.stringify(s.game)}`);
      if (!typeSet.has(s.type)) errors.push(`${label}: type ${JSON.stringify(s.type)} not in SHOT_TYPES`);
      if (!isText(s.cap)) errors.push(`${label}: caption is required — an uncaptioned screenshot teaches nothing`);
      if (!isText(s.from)) errors.push(`${label}: missing \`from\` source host`);
      if (!/^shots\/[a-z0-9-]+\/[a-z0-9.-]+\.(jpg|png|webp)$/.test(s.src ?? "")) {
        errors.push(`${label}: src must match shots/<game-slug>/<name>.(jpg|png|webp)`);
      }
      if (referenced.has(s.src)) errors.push(`${label}: duplicate src`);
      referenced.add(s.src);
    }
    // Set equality BOTH ways against the real folder: a ref without a file is a broken
    // image; a file without a ref is an invisible orphan nobody will ever audit.
    if (docs.shotFiles == null && SHOTS.length) {
      errors.push("SHOTS rows exist but the shots/ folder could not be listed — every image would 404");
    }
    if (docs.shotFiles != null) {
      for (const src of referenced) {
        if (!docs.shotFiles.has(src)) errors.push(`shot ${JSON.stringify(src)}: file missing from the shots/ folder`);
      }
      for (const f of docs.shotFiles) {
        if (!referenced.has(f)) errors.push(`shots folder: ${JSON.stringify(f)} is not referenced by any SHOTS row — delete it or add the row`);
      }
    }
  }

  const allIds = new Set([...BASE_MECHS.map(m => m.id), ...MINIGAMES.map(m => m.id)]);

  // --- the changelog: what the app calls new. The page's OWN expandIds does the
  // parsing, so a range the UI would render is the range this validates — no second
  // implementation to drift. The load-bearing check is MEMBERSHIP: every id in the
  // arrays must appear in exactly one `added`, and nothing else may. A per-entry
  // property check would pass happily while a freshly spliced row sat unlisted and
  // therefore permanently unmarked, which is the one failure this feature exists to
  // prevent.
  if (CHANGES) {
    if (!expandIds) {
      errors.push("CHANGES exists but the page defines no expandIds() — the ranges cannot be read");
    } else if (!Array.isArray(CHANGES) || CHANGES.length === 0) {
      errors.push("CHANGES must be a non-empty array");
    } else {
      const ISO = /^\d{4}-\d{2}-\d{2}$/;
      const claimed = new Map();          // id -> the entry that first added it
      let prevDate = null;
      CHANGES.forEach((c, i) => {
        const label = `CHANGES[${i}] ${JSON.stringify(c?.title ?? "(untitled)")}`;
        if (!ISO.test(c?.date ?? "")) errors.push(`${label}: date ${JSON.stringify(c?.date ?? "")} is not YYYY-MM-DD`);
        else if (prevDate !== null && !(c.date < prevDate)) {
          errors.push(`${label}: dates must run newest-first and strictly decrease — ${c.date} follows ${prevDate}`);
        } else prevDate = c.date;
        if (!isText(c?.title)) errors.push(`${label}: needs a title`);
        // Game-level changes (details, covers) name roster titles, not ids.
        if (c?.games != null) {
          if (!Array.isArray(c.games)) errors.push(`${label}: \`games\` must be an array of roster titles`);
          else {
            const seenG = new Set();
            for (const t of c.games) {
              if (!titles.has(t)) errors.push(`${label}: games[] names no roster game ${JSON.stringify(t)}`);
              if (seenG.has(t)) errors.push(`${label}: games[] lists ${JSON.stringify(t)} twice`);
              seenG.add(t);
            }
          }
        }
        // An entry that names nothing would still move the first-visit baseline (the app
        // treats the second-newest entry's date as "already seen"), hiding the real batch.
        if (Array.isArray(c?.added) && Array.isArray(c?.updated) && !c.added.length && !c.updated.length && !(Array.isArray(c?.games) && c.games.length)) {
          errors.push(`${label}: names no row and no game — an empty entry silently moves the first-visit baseline`);
        }
        for (const field of ["added", "updated"]) {
          if (!Array.isArray(c?.[field])) { errors.push(`${label}: \`${field}\` must be an array`); continue; }
          let ids;
          try { ids = expandIds(c[field]); }
          catch (e) { errors.push(`${label}: ${field} — ${e.message}`); continue; }
          for (const id of ids) {
            if (!allIds.has(id)) errors.push(`${label}: ${field} names ${id}, which is not a row in this file`);
            if (field === "added") {
              if (claimed.has(id)) errors.push(`${label}: ${id} was already added by ${JSON.stringify(claimed.get(id))}`);
              else claimed.set(id, c.title);
            }
          }
        }
      });
      for (const id of allIds) {
        if (!claimed.has(id)) {
          errors.push(`${id} appears in no CHANGES entry's \`added\` — it would show in the app with no date, and never as new`);
        }
      }
    }
  }

  // --- the restore contract: every slot the schema declares is defaulted on load
  checkStoreSchema(script, errors);

  // --- docs that restate the counts (two sources of truth always drift)
  const stats = {
    mechanics: BASE_MECHS.length,
    games: BASE_GAMES.length,
    gf: BASE_GAMES.filter(g => g.gf != null).length,
    covers: BASE_GAMES.filter(g => g.cover != null).length,
    minigames: MINIGAMES.length,
    researched: BASE_GAMES.filter(g => g.status === "Researched").length,
    queued: BASE_GAMES.filter(g => g.status !== "Researched").length,
    want: BASE_MECHS.filter(m => m.want === "Yes").length,
    rewardTables: MINIGAMES.filter(m => m.rt).length,
    tagged: BASE_MECHS.filter(m => (m.verbs ?? []).length).length,
    tags: BASE_MECHS.reduce((n, m) => n + (m.verbs ?? []).length, 0),
    lineages: (LINEAGES ?? []).length,
    lineageMechs: new Set((LINEAGES ?? []).flatMap(l => l.ids ?? [])).size,
  };

  if (docs.claude != null) {
    const claim = (re, what) => {
      const m = docs.claude.match(re);
      if (!m) errors.push(`CLAUDE.md: could not find the ${what} count — update the validator or the doc`);
      return m ? Number(m[1]) : null;
    };
    const dm = claim(/\*\*(\d+) mechanics\*\*/, "mechanics");
    const dg = claim(/\*\*(\d+) minigames\*\*/, "minigames");
    const dr = docs.claude.match(/\*\*(\d+) researched \+ (\d+) queued\*\* \((\d+) total\)/);
    if (dm != null && dm !== stats.mechanics) errors.push(`CLAUDE.md says ${dm} mechanics, file has ${stats.mechanics}`);
    if (dg != null && dg !== stats.minigames) errors.push(`CLAUDE.md says ${dg} minigames, file has ${stats.minigames}`);
    if (!dr) errors.push("CLAUDE.md: could not find the `**N researched + N queued** (N total)` line");
    else {
      if (Number(dr[1]) !== stats.researched) errors.push(`CLAUDE.md says ${dr[1]} researched games, file has ${stats.researched}`);
      if (Number(dr[2]) !== stats.queued) errors.push(`CLAUDE.md says ${dr[2]} queued games, file has ${stats.queued}`);
      if (Number(dr[3]) !== stats.games) errors.push(`CLAUDE.md says ${dr[3]} games total, file has ${stats.games}`);
    }
    // `\s*`: the sentence wraps between the bold count and the tag total.
    const dv = docs.claude.match(/\*\*(\d+) of (\d+) rows are tagged\*\*\s*\((\d+) tags\)/);
    if (!dv) errors.push("CLAUDE.md: could not find the `**N of M rows are tagged** (T tags)` line");
    else if (Number(dv[1]) !== stats.tagged || Number(dv[2]) !== stats.mechanics || Number(dv[3]) !== stats.tags) {
      errors.push(`CLAUDE.md says ${dv[1]} of ${dv[2]} rows are tagged (${dv[3]} tags), file has ${stats.tagged} of ${stats.mechanics} (${stats.tags} tags)`);
    }
    const dl = docs.claude.match(/\*\*(\d+) lineages\*\*\s+covering\s+(\d+) mechanics/);
    if (!dl) errors.push("CLAUDE.md: could not find the `**N lineages** covering M mechanics` line");
    else if (Number(dl[1]) !== stats.lineages || Number(dl[2]) !== stats.lineageMechs) {
      errors.push(`CLAUDE.md says ${dl[1]} lineages covering ${dl[2]} mechanics, file has ${stats.lineages} covering ${stats.lineageMechs}`);
    }
    const dsab = claim(/requires all \*\*(\d+)\*\* sabotages to fire/, "sabotage");
    if (dsab != null && dsab !== sabotageCount()) {
      errors.push(`CLAUDE.md says ${dsab} sabotages, the selftest suite has ${sabotageCount()}`);
    }
  }
  if (docs.readme != null) {
    const cell = (re, what) => {
      const m = docs.readme.match(re);
      if (!m) errors.push(`README.md: could not find the ${what} cell — update the validator or the doc`);
      return m ? Number(m[1]) : null;
    };
    const rm = cell(/\*\*(\d+) mechanics\*\*/, "**N mechanics**");
    const rg = cell(/\*\*(\d+) minigames\*\*/, "**N minigames**");
    const rt = cell(/\*\*(\d+) games\*\*/, "**N games**");
    const rr = cell(/(\d+) carry concrete reward tables/, "`N carry concrete reward tables`");
    // `\s+` on both sides: this sentence wraps, and the number can land at a line end.
    const rsab = cell(/injects\s+(\d+)\s+sabotages/, "`injects N sabotages`");
    if (rsab != null && rsab !== sabotageCount()) {
      errors.push(`README.md says ${rsab} sabotages, the selftest suite has ${sabotageCount()}`);
    }
    if (rm != null && rm !== stats.mechanics) errors.push(`README.md says ${rm} mechanics, file has ${stats.mechanics}`);
    if (rg != null && rg !== stats.minigames) errors.push(`README.md says ${rg} minigames, file has ${stats.minigames}`);
    if (rt != null && rt !== stats.games) errors.push(`README.md says ${rt} games, file has ${stats.games}`);
    if (rr != null && rr !== stats.rewardTables) errors.push(`README.md says ${rr} reward tables, file has ${stats.rewardTables}`);
    const intro = docs.readme.match(/(\d+) mechanics across (\d+) games, (\d+) minigames/);
    if (!intro) errors.push("README.md: could not find the intro sentence `N mechanics across N games, N minigames`");
    else if (Number(intro[1]) !== stats.mechanics || Number(intro[2]) !== stats.games || Number(intro[3]) !== stats.minigames) {
      errors.push(`README.md intro says ${intro[1]} mechanics / ${intro[2]} games / ${intro[3]} minigames, file has ${stats.mechanics} / ${stats.games} / ${stats.minigames}`);
    }
  }
  if (docs.agents != null && docs.claude != null && docs.agents !== docs.claude) {
    errors.push("AGENTS.md has drifted from CLAUDE.md — it is a byte-for-byte mirror; re-copy it");
  }

  return { errors, stats };
}

// ------------------------------------------------------------------ selftest

const STATE_BANNER = "/* ============================= STATE";

/** The data region: every const the app's rows live in, up to the STATE banner. */
function dataRegion(src) {
  return { start: src.indexOf("const CATS"), end: src.indexOf(STATE_BANNER), name: "data region" };
}

/**
 * The STATE block: the banner to the NEXT banner, which is the store literal, its
 * normaliser and the restore path — about 2KB.
 *
 * Bounded at both ends on purpose. "Anywhere after STATE" would be barely a guard at all:
 * the runtime half of the script is far denser in generic idioms than the data is, with
 * dozens of `{}` and `|| {}` occurrences a loose fixture could silently land on.
 */
function stateBlock(src) {
  const start = src.indexOf(STATE_BANNER);
  return {
    start,
    end: start < 0 ? -1 : src.indexOf("/* =============================", start + 1),
    name: "STATE block",
  };
}

/**
 * Replace the first match, insisting the edit lands inside the named region.
 *
 * That last part is not paranoia: an early draft's `/us:\d+/` fixture matched
 * `border-radius:4px` in the CSS. It mutated the file, changed the bytes, threw
 * nothing — and tested absolutely nothing.
 */
function replaceWithin(src, needle, repl, label, region) {
  const at = typeof needle === "string" ? src.indexOf(needle) : src.search(needle);
  if (at < 0) throw new Error(`sabotage "${label}": pattern not found — the validator's own fixtures are stale`);

  const { start: regionStart, end: regionEnd, name } = region(src);
  if (regionStart < 0 || regionEnd < 0) {
    throw new Error(`sabotage "${label}": could not bound the ${name} — the page's section banners moved`);
  }
  if (at < regionStart || at > regionEnd) {
    throw new Error(`sabotage "${label}": matched at ${at}, outside the ${name} (${regionStart}-${regionEnd}) — the pattern needs more context`);
  }

  const out = typeof needle === "string"
    ? src.slice(0, at) + repl + src.slice(at + needle.length)
    : src.slice(0, at) + src.slice(at).replace(needle, repl);
  if (out === src) throw new Error(`sabotage "${label}": source unchanged — the mutation did not apply`);
  return out;
}

/** Sabotage the data. */
function replaceFirst(src, needle, repl, label) {
  return replaceWithin(src, needle, repl, label, dataRegion);
}

/** Sabotage the state schema, which lives past the banner the data region stops at. */
function replaceAfterState(src, needle, repl, label) {
  return replaceWithin(src, needle, repl, label, stateBlock);
}

/**
 * Each case must (a) actually change the source and (b) trip the check it targets.
 * Matching the message, not just "some error", stops a sabotage from being caught by
 * an unrelated rule and reading as coverage it doesn't have.
 */
const SABOTAGES = [
  { name: "changelog leaves a row unlisted", expect: /appears in no CHANGES entry/,
    apply: s => replaceFirst(s, '"M001-M243"', '"M001-M242"', "changelog leaves a row unlisted") },
  { name: "changelog names a row that does not exist", expect: /names M999, which is not a row/,
    apply: s => replaceFirst(s, '"M117","M118"', '"M117","M999"', "changelog names a missing row") },
  { name: "changelog dates out of order", expect: /must run newest-first/,
    apply: s => replaceFirst(s, 'date:"2026-08-29"', 'date:"2026-09-29"', "changelog dates out of order") },
  { name: "changelog adds a row twice", expect: /was already added by/,
    apply: s => replaceFirst(s, '"M244-M261"', '"M243-M261"', "changelog adds a row twice") },
  { name: "duplicate mechanic id", expect: /duplicate id M001/,
    apply: s => replaceFirst(s, 'id:"M002"', 'id:"M001"', "duplicate mechanic id") },
  { name: "mechanic id sequence gap", expect: /sequence break/,
    apply: s => replaceFirst(s, 'id:"M100"', 'id:"M900"', "mechanic id sequence gap") },
  { name: "duplicate minigame id", expect: /duplicate id g002/,
    apply: s => replaceFirst(s, 'id:"g003"', 'id:"g002"', "duplicate minigame id") },
  { name: "unknown category", expect: /is not a key of CATS/,
    apply: s => replaceFirst(s, 'cat:"Exploration & Rewards"', 'cat:"Nonsense"', "unknown category") },
  { name: "invalid want value", expect: /want "Perhaps"/,
    apply: s => replaceFirst(s, 'want:"Yes"', 'want:"Perhaps"', "invalid want value") },
  { name: "orphaned mechanic game ref", expect: /unknown game/,
    apply: s => replaceFirst(s, 'title:"Chrono Trigger"', 'title:"Chrono Triggerr"', "orphaned mechanic game ref") },
  { name: "unrostered minigame game ref", expect: /not a known unrostered FF title/,
    apply: s => replaceFirst(s, 'g:"Final Fantasy IX"', 'g:"Final Fantasy IXX"', "unrostered minigame game ref") },
  { name: "user score as index pointer (the 2769 bug)", expect: /user score out of range/,
    apply: s => replaceFirst(s, /,us:\d+(\.\d+)?,usN:/, ",us:2769,usN:", "user score as index pointer") },
  { name: "Metascore out of range", expect: /Metascore out of range/,
    apply: s => replaceFirst(s, /\bmc:\d+,mcN:/, "mc:999,mcN:", "Metascore out of range") },
  { name: "empty reward in an rt table", expect: /empty `get` reward/,
    apply: s => replaceFirst(s, /get:"[^"]+"/, 'get:""', "empty reward in an rt table") },
  // Builds the failing shape itself -- queued AND brief-less -- instead of relying on
  // a queued row being present. It broke once because the first `why:"BRIEF:` in the
  // file belongs to an already-RESEARCHED game, and again when clearing the research
  // queue left no queued row at all. A fixture for a CONDITIONAL rule has to establish
  // the condition, not hope the data still happens to satisfy it.
  { name: "queued game with no research brief", expect: /need a `why` research brief/,
    apply: s => replaceFirst(
      s,
      /title:"Live A Live",([\s\S]{0,900}?)why:"[^"]*"/,
      (_, inner) => 'title:"Live A Live",' + inner.replace(/status:"[^"]*"/, 'status:"To Research"') + 'why:""',
      "queued game with no research brief") },
  { name: "unknown discovery verb", expect: /unknown discovery verb/,
    apply: s => replaceFirst(s, /verbs:\["([^"]+)"/, 'verbs:["Not A Real Verb"', "unknown discovery verb") },
  { name: "lineage pointing at a missing mechanic", expect: /references missing mechanic/,
    apply: s => replaceFirst(s, /ids:\["M\d+"/, 'ids:["M999"', "lineage pointing at a missing mechanic") },
  { name: "counter-example outside its own chain", expect: /is not in its own ids list/,
    apply: s => replaceFirst(s, /counter:"M\d+"/, 'counter:"M001"', "counter-example outside its own chain") },
  { name: "shot referencing an unknown game", expect: /shot .*unknown game/,
    apply: s => replaceFirst(s, '{game:"Kingdom Hearts II",src:"shots/kingdom-hearts-ii/battle-reaction-command.jpg"',
                             '{game:"Kingdom Hearts III",src:"shots/kingdom-hearts-ii/battle-reaction-command.jpg"', "shot referencing an unknown game") },
  { name: "shot with a type outside SHOT_TYPES", expect: /not in SHOT_TYPES/,
    apply: s => replaceFirst(s, /type:"Battle"/, 'type:"BoxArt"', "shot with a type outside SHOT_TYPES") },
  { name: "shot with an empty caption", expect: /caption is required/,
    apply: s => replaceFirst(s, /cap:"[^"]+"/, 'cap:""', "shot with an empty caption") },
  // Both CONSTRUCT a refs field on M001 rather than editing one that may not exist. It
  // lands as the row's last key; if M001 ever gains a real refs (nested braces), this
  // pattern stops at the inner `}` and the sabotage fails LOUDLY as a parse error.
  { name: "ref with a non-https or unlisted host", expect: /refs .*not an allowed https host/,
    apply: s => replaceFirst(s, /(\{id:"M001",[^}]*)\}/, '$1,refs:[{u:"javascript:alert(1)",t:"x"}]}', "ref with an unlisted host") },
  { name: "ref with an empty label", expect: /refs .*empty label/,
    apply: s => replaceFirst(s, /(\{id:"M001",[^}]*)\}/, '$1,refs:[{u:"https://gamefaqs.gamespot.com/ps/1-x/faqs/1",t:""}]}', "ref with an empty label") },
  // The script-owned game fields. Anchors are the literal forms game_rows.mjs writes
  // (bare keys, no spaces), so each lands on the first harvested row in the file.
  { name: "gf with a key outside the whitelist", expect: /gf: unknown key "blurb"/,
    apply: s => replaceFirst(s, 'gf:{u:"', 'gf:{blurb:"x",u:"', "gf with a key outside the whitelist") },
  { name: "gf.u as an absolute URL", expect: /gf\.u must be a site-relative path/,
    apply: s => replaceFirst(s, 'gf:{u:"/', 'gf:{u:"https://gamefaqs.gamespot.com/', "gf.u as an absolute URL") },
  { name: "gf rating out of range", expect: /gf\.rating\.v out of range/,
    apply: s => replaceFirst(s, /rating:\{v:[\d.]+,/, "rating:{v:9.5,", "gf rating out of range") },
  { name: "prose stored in gf (a related game's blurb)", expect: /longer than 120, and prose is not stored/,
    apply: s => replaceFirst(s, 'like:[{t:"', 'like:[{t:"' + "x".repeat(130), "prose stored in gf") },
  { name: "gf release year from a port or remake page", expect: /release year 2090 is more than 2 years/,
    apply: s => replaceFirst(s, /rel:"[^"]*?(19|20)\d\d[^"]*"/, m => m.replace(/(19|20)\d\d/, "2090"), "gf release year from a port or remake page") },
  { name: "two rows sharing one gf.u", expect: /gf\.u \S+ already used by/,
    apply: s => {
      const first = s.match(/gf:\{u:"([^"]+)"/);
      if (!first) throw new Error('sabotage "two rows sharing one gf.u": no gf row to copy');
      return replaceFirst(s, /(gf:\{u:"[^"]+"[\s\S]*?gf:\{u:")[^"]+"/, `$1${first[1]}"`, "two rows sharing one gf.u");
    } },
  { name: "cover outside the covers folder", expect: /cover must match covers\//,
    apply: s => replaceFirst(s, 'cover:"covers/', 'cover:"shots/', "cover outside the covers folder") },
  // Drops the wp line that follows the first cover line: a cover with no article to
  // point at has no provenance.
  { name: "cover without its Wikipedia article", expect: /has a cover but no wp/,
    apply: s => replaceFirst(s, /(cover:"covers\/[^"]+")(,\nwp:"[^"]*")/, "$1", "cover without its Wikipedia article") },
  { name: "digest naming no docs/research file", expect: /digest "parasite-eve-x" has no docs\/research/,
    apply: s => replaceFirst(s, 'digest:"parasite-eve"', 'digest:"parasite-eve-x"', "digest naming no docs/research file") },
  { name: "changelog games[] naming a non-roster game", expect: /games\[\] names no roster game ".* \(not on the roster\)"/,
    apply: s => replaceFirst(s, /games:\["([^"]+)"/, 'games:["$1 (not on the roster)"', "changelog games[] naming a non-roster game") },
  { name: "changelog entry that names nothing", expect: /names no row and no game/,
    apply: s => replaceFirst(s, /added:\[\], updated:\["[^\]]+\]/, "added:[], updated:[]", "changelog entry that names nothing") },
  { name: "broken javascript", expect: /does not parse/,
    apply: s => replaceFirst(s, "const CATS", "const = ;\nconst CATS", "broken javascript") },

  // The state schema, both arms. A two-way check needs two fixtures: the pair one reaches
  // for first — add a slot, or delete a handler — exercise the SAME arm, so shipping one
  // would send the other to production having never once been red.
  // The anchors are the declarations, not the last key: `seen:""};` would break loudly the
  // day a slot is appended after `seen`, for no reason.
  { name: "store gains a slot normalizeStore never defaults (the undefined-slot bug)",
    expect: /is declared in the `store` literal but normalizeStore never defaults it/,
    apply: s => replaceAfterState(s, "let store = {", "let store = {ghost:{}, ", "store gains an undefaulted slot") },
  { name: "normalizeStore defaults a slot the store literal does not declare",
    expect: /which the `store` literal does not declare/,
    apply: s => replaceAfterState(s, "\n  return s;\n}", "\n  s.ghost = s.ghost || {};\n  return s;\n}", "normalizeStore defaults an undeclared slot") },

  // The discovery-verb ledger, page side. The two-way tag comparison gets a fixture per
  // direction: this one is the page carrying a tag nobody quoted (the ledger-side arm is a
  // DOC sabotage below). Both M001 fixtures rely on M001 (Materia System) being a
  // Progression row with no verbs and no ledger entry — re-check that if either goes BROKEN.
  { name: "a tag docs/verbs.md does not justify", expect: /M001 carries "Guarded", which docs\/verbs\.md does not justify/,
    apply: s => replaceFirst(s, '{id:"M001",', '{id:"M001",verbs:["Guarded"],', "a tag docs/verbs.md does not justify") },
  { name: "a discovery-category row with no ledger entry", expect: /M001 \(Traversal\) has no docs\/verbs\.md entry/,
    apply: s => replaceFirst(s, /(\{id:"M001",[^\n]*?)cat:"Progression & Upgrades"/, '$1cat:"Traversal"', "a discovery-category row with no ledger entry") },
  { name: "DISCOVERY_CATS naming a category CATS no longer has", expect: /DISCOVERY_CATS names "Traversal", which is not a CATS key/,
    apply: s => replaceFirst(s, '"Traversal":"#', '"Travel":"#', "DISCOVERY_CATS naming a category CATS no longer has") },
  // Sets on both sides would call ["X","X"] equal to a ledger saying X, so the repeat has
  // its own rule and its own fixture.
  { name: "the same verb twice on one row", expect: /carries "[^"]+" twice/,
    apply: s => replaceFirst(s, /verbs:\["([^"]+)"/, 'verbs:["$1","$1"', "the same verb twice on one row") },

  // Lineages. Each anchor is a literal of the chain data, and each mutation keeps every other
  // lineage rule satisfied so the rule it aims at is the one that must fire.
  { name: "a lineage out of release order", expect: /M198 \(1996\) follows M133 \(1999\) — nodes run in release order/,
    apply: s => replaceFirst(s, 'ids:["M198","M133"', 'ids:["M133","M198"', "a lineage out of release order") },
  { name: "a counter-example that is not the last node", expect: /counter M131 must be the last node/,
    apply: s => replaceFirst(s, 'ids:["M214","M146","M158","M212","M235","M160","M131"]', 'ids:["M131","M214","M146","M158","M212","M235","M160"]', "a counter-example that is not the last node") },
  { name: "a lineage listing a mechanic twice", expect: /lineage "The timing lineage": lists M161 twice/,
    apply: s => replaceFirst(s, '"M080","M161"]', '"M080","M161","M161"]', "a lineage listing a mechanic twice") },
  { name: "a lineage too short to be a lineage", expect: /lineage "Abilities that outlive the class": has 2 nodes besides its counter/,
    apply: s => replaceFirst(s, 'ids:["M154","M086","M225","M160"]', 'ids:["M154","M160"]', "a lineage too short to be a lineage") },
  { name: "a best node outside its own chain", expect: /lineage "The timing lineage": best "M131" must name a node/,
    apply: s => replaceFirst(s, 'best:"M161"', 'best:"M131"', "a best node outside its own chain") },
  // Page side of the lineage ledger: a node nobody quoted. M160 is 2025, like the chain's last
  // node, so release order still holds; it is quoted for three OTHER chains.
  { name: "a lineage node docs/lineages.md does not quote", expect: /lineage "The timing lineage" lists M160, but docs\/lineages\.md quotes no evidence for it/,
    apply: s => replaceFirst(s, '"M080","M161"], best:"M161"', '"M080","M161","M160"], best:"M161"', "a lineage node docs/lineages.md does not quote") },
];

/** Markdown has no data region, so these skip that guard — but still must apply. */
function replaceInDoc(text, needle, repl, label) {
  const out = text.replace(needle, repl);
  if (out === text) throw new Error(`sabotage "${label}": doc unchanged — the mutation did not apply`);
  return out;
}

const DOC_SABOTAGES = [
  { name: "CLAUDE.md count drift", expect: /CLAUDE\.md says \d+ mechanics/,
    apply: d => ({ ...d, claude: replaceInDoc(d.claude, /\*\*\d+ mechanics\*\*/, "**999 mechanics**", "CLAUDE.md count drift") }) },
  { name: "README.md count drift", expect: /README\.md says \d+ mechanics/,
    apply: d => ({ ...d, readme: replaceInDoc(d.readme, /\*\*\d+ mechanics\*\*/, "**999 mechanics**", "README.md count drift") }) },
  { name: "shot file missing from disk", expect: /file missing from the shots\/ folder/,
    apply: d => {
      if (!d.shotFiles?.size) throw new Error('sabotage "shot file missing": no shotFiles to remove');
      return { ...d, shotFiles: new Set([...d.shotFiles].slice(1)) };
    } },
  { name: "orphan file in the shots folder", expect: /not referenced by any SHOTS row/,
    apply: d => {
      if (d.shotFiles == null) throw new Error('sabotage "orphan file": shotFiles listing absent');
      return { ...d, shotFiles: new Set([...d.shotFiles, "shots/some-game/orphan.jpg"]) };
    } },
  { name: "AGENTS.md mirror drift", expect: /AGENTS\.md has drifted/,
    apply: d => ({ ...d, agents: d.agents + "\ndrifted\n" }) },
  { name: "cover file missing from disk", expect: /file missing from the covers\/ folder/,
    apply: d => {
      if (!d.coverFiles?.size) throw new Error('sabotage "cover file missing": no coverFiles to remove');
      return { ...d, coverFiles: new Set([...d.coverFiles].slice(1)) };
    } },
  { name: "orphan file in the covers folder", expect: /covers folder: .*not referenced by any game row/,
    apply: d => {
      if (d.coverFiles == null) throw new Error('sabotage "orphan cover": coverFiles listing absent');
      return { ...d, coverFiles: new Set([...d.coverFiles, "covers/ghost.jpg"]) };
    } },
  { name: "orphan digest file no game row claims", expect: /docs\/research\/ghost\.md is not claimed/,
    apply: d => {
      if (d.digestFiles == null) throw new Error('sabotage "orphan digest": digestFiles listing absent');
      return { ...d, digestFiles: new Set([...d.digestFiles, "ghost"]) };
    } },

  // This suite's own size, quoted in two docs. Adding a sabotage and forgetting the docs is
  // the drift these catch -- starting with the drift caused by adding these two.
  { name: "CLAUDE.md sabotage-count drift", expect: /CLAUDE\.md says \d+ sabotages/,
    apply: d => ({ ...d, claude: replaceInDoc(d.claude, /requires all \*\*\d+\*\* sabotages/, "requires all **999** sabotages", "CLAUDE.md sabotage-count drift") }) },
  { name: "README.md sabotage-count drift", expect: /README\.md says \d+ sabotages/,
    apply: d => ({ ...d, readme: replaceInDoc(d.readme, /injects\s+\d+\s+sabotages/, "injects 999 sabotages", "README.md sabotage-count drift") }) },

  // The discovery-verb ledger, ledger side. Each lands on exactly one rule: the first spoils a
  // quote; the second renames a `none` entry, which has no quote to fail instead; the third
  // adds a verb under a quote that is still valid, so only the ledger-side arm of the tag
  // comparison can fire.
  { name: "a ledger quote that is not in its row", expect: /M\d{3} · [^:]+: quote is not in the row's/,
    apply: d => ({ ...d, verbLedger: replaceInDoc(d.verbLedger, /^(- [^\n]+? · (?:how|loop|notes) · `)[^`]/m, "$1§", "a ledger quote that is not in its row") }) },
  { name: "a none entry whose header names another row", expect: /### M\d{3} names "Not this row's name", the row is named/,
    apply: d => ({ ...d, verbLedger: replaceInDoc(d.verbLedger, /^(### M\d{3} — )[^\n]+(\n- none · )/m, "$1Not this row's name$2", "a none entry whose header names another row") }) },
  { name: "a ledger verb the page does not carry", expect: /docs\/verbs\.md justifies "(Consequence|Traded)" on M\d{3}, which the codex does not carry/,
    apply: d => ({ ...d, verbLedger: replaceInDoc(d.verbLedger,
      /^(### M\d{3} — [^\n]+\n- ([^\n]+?) · (how|loop|notes) · (`[^`\n]+`))$(?!\n- )/m,
      (line, _entry, verb, field, quote) => `${line}\n- ${verb === "Consequence" ? "Traded" : "Consequence"} · ${field} · ${quote}`,
      "a ledger verb the page does not carry") }) },
  { name: "CLAUDE.md verb-tag count drift", expect: /CLAUDE\.md says \d+ of \d+ rows are tagged/,
    apply: d => ({ ...d, claude: replaceInDoc(d.claude, /\*\*\d+ of \d+ rows are tagged\*\*/, "**999 of 281 rows are tagged**", "CLAUDE.md verb-tag count drift") }) },

  // The lineage ledger, ledger side: a line naming a chain that does not list the row (the
  // first entry is outside the timing chain, and its quote stays valid), and a spoiled quote,
  // which proves this ledger's problems reach `errors` at all — the shared checks are
  // already proven through docs/verbs.md, but not this call site.
  { name: "a lineage-ledger line naming a chain that does not list the row", expect: /docs\/lineages\.md quotes M\d{3} for "The timing lineage", but that lineage does not list it/,
    apply: d => ({ ...d, lineageLedger: replaceInDoc(d.lineageLedger,
      /^(### M\d{3} — [^\n]+\n- (?!The timing lineage · )[^\n]+? · (how|loop|notes) · (`[^`\n]+`))$/m,
      "$1\n- The timing lineage · $2 · $3", "a lineage-ledger line naming a chain that does not list the row") }) },
  { name: "a lineage-ledger quote that is not in its row", expect: /docs\/lineages\.md:\d+: M\d{3} · [^:]+: quote is not in the row's/,
    apply: d => ({ ...d, lineageLedger: replaceInDoc(d.lineageLedger, /^(- [^\n]+? · (?:how|loop|notes) · `)[^`]/m, "$1§", "a lineage-ledger quote that is not in its row") }) },
  { name: "CLAUDE.md lineage count drift", expect: /CLAUDE\.md says \d+ lineages covering \d+ mechanics/,
    apply: d => ({ ...d, claude: replaceInDoc(d.claude, /\*\*\d+ lineages\*\*/, "**999 lineages**", "CLAUDE.md lineage count drift") }) },
];

/**
 * The size of this suite, derived — never restated. Both the docs check and the closing
 * log read it from here, so the number in CLAUDE.md and README.md is compared against the
 * arrays themselves rather than against a second copy of the figure.
 *
 * `validate()` calls this even though the arrays are declared below it. That is safe and
 * not an accident: `validate` is a hoisted function declaration, its body runs only when
 * called, `main()` is this module's last statement, and this file imports nothing local —
 * so its whole body has run before any importer's. Adding a LOCAL import to this file is
 * the one change that could put these consts back in the temporal dead zone.
 */
function sabotageCount() { return SABOTAGES.length + DOC_SABOTAGES.length; }

function selftest(html, docs) {
  let failed = 0;
  const run = (name, expect, mutatedHtml, mutatedDocs) => {
    let errors;
    try {
      ({ errors } = validate(mutatedHtml, mutatedDocs));
    } catch (e) {
      errors = [`threw: ${e.message}`];
    }
    const hit = errors.some(e => expect.test(e));
    if (hit) {
      console.log(`  caught   ${name}`);
    } else {
      failed++;
      console.log(`  MISSED   ${name}`);
      console.log(`           expected an error matching ${expect}`);
      console.log(errors.length ? errors.slice(0, 3).map(e => `           got: ${e}`).join("\n") : "           got: no errors at all");
    }
  };

  console.log("selftest — every sabotage below must make validation FAIL:");
  for (const s of SABOTAGES) {
    let mutated;
    try {
      mutated = s.apply(html);
    } catch (e) {
      failed++;
      console.log(`  BROKEN   ${s.name}: ${e.message}`);
      continue;
    }
    run(s.name, s.expect, mutated, docs);
  }
  for (const s of DOC_SABOTAGES) {
    let mutatedDocs;
    try {
      mutatedDocs = s.apply(docs);
    } catch (e) {
      failed++;
      console.log(`  BROKEN   ${s.name}: ${e.message}`);
      continue;
    }
    run(s.name, s.expect, html, mutatedDocs);
  }
  return failed;
}

// ---------------------------------------------------------------------- main

function main() {
  const html = readFileSync(CODEX, "utf8");
  const read = p => { try { return readFileSync(join(ROOT, p), "utf8"); } catch { return null; } };

  // Real listing of the shots folder, normalized to the repo-relative form the
  // SHOTS rows use. Injectable so the selftest can stage missing/orphan files.
  let shotFiles = null;
  try {
    shotFiles = new Set(
      readdirSync(join(ROOT, "shots"), { recursive: true })
        .map(String)
        .filter(f => /\.(jpg|png|webp)$/.test(f))
        .map(f => "shots/" + f.split(sep).join("/"))
    );
  } catch { /* no folder yet — SHOTS rows will then fail closed if any exist */ }

  // The digests a game row may claim, and the cover files a row may name — both listed
  // for the two-way checks, both injectable so the selftest can stage an orphan.
  let digestFiles = null;
  try {
    digestFiles = new Set(
      readdirSync(join(ROOT, "docs", "research"))
        .filter(f => /\.md$/.test(f) && !/^(README|_template)\.md$/.test(f))
        .map(f => f.replace(/\.md$/, ""))
    );
  } catch { /* no folder — rows claiming a digest then fail closed */ }
  let coverFiles = null;
  try {
    coverFiles = new Set(readdirSync(join(ROOT, "covers")).filter(f => /\.(jpg|png|webp)$/.test(f)).map(f => "covers/" + f));
  } catch { /* no covers/ yet — rows naming a cover then fail closed */ }

  const docs = { claude: read("CLAUDE.md"), agents: read("AGENTS.md"), readme: read("README.md"), verbLedger: read("docs/verbs.md"), lineageLedger: read("docs/lineages.md"), shotFiles, digestFiles, coverFiles };

  const { errors, stats } = validate(html, docs);

  if (stats) {
    console.log(
      `codex: ${stats.mechanics} mechanics · ${stats.minigames} minigames ` +
      `(${stats.rewardTables} with reward tables) · ${stats.games} games ` +
      `(${stats.researched} researched, ${stats.queued} queued; ${stats.gf} with GameFAQs details, ${stats.covers} with covers) · ${stats.want} marked want:Yes`
    );
  }

  if (errors.length) {
    console.error(`\n${errors.length} problem${errors.length === 1 ? "" : "s"} found:`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log("validation passed");

  if (process.argv.includes("--selftest")) {
    console.log("");
    const failed = selftest(html, docs);
    if (failed) {
      console.error(`\n${failed} check(s) did not fire — the gate is weaker than it looks.`);
      process.exit(1);
    }
    console.log(`\nall ${SABOTAGES.length + DOC_SABOTAGES.length} sabotages were caught`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) main();
