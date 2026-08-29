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

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
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

const WANT = new Set(["Yes", "Maybe", "No", ""]);
const STATUS = new Set(["Researched", "Researching", "To Research"]);

// ---------------------------------------------------------------- extraction

function extractScript(html) {
  const m = html.match(/<script>([\s\S]*)<\/script>/);
  if (!m) throw new Error("no <script> block found");
  return m[1];
}

/**
 * The data arrays sit in one contiguous prefix ending at the STATE banner. They must
 * be evaluated together, not one array at a time: some game rows reference shared
 * consts (title:FF) declared alongside them.
 */
function extractData(script) {
  const start = script.indexOf("const CATS");
  const end = script.indexOf("/* ============================= STATE");
  if (start < 0) throw new Error("could not locate `const CATS` — data region moved");
  if (end < 0) throw new Error("could not locate the STATE banner — data region moved");
  if (end <= start) throw new Error("STATE banner precedes the data region");
  return script.slice(start, end);
}

// ------------------------------------------------------------------- helpers

const isText = v => typeof v === "string" && v.trim() !== "";

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
        " VERBS: typeof VERBS === 'undefined' ? null : VERBS};"
    )();
  } catch (e) {
    errors.push(`data region does not evaluate: ${e.message}`);
    return { errors, stats: null };
  }

  const { CATS, BASE_MECHS, BASE_GAMES, PILLARS, MINIGAMES, LINEAGES, VERBS } = data;
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
    const mechIds = new Set(BASE_MECHS.map(m => m.id));
    for (const l of LINEAGES) {
      checkFields(l, `lineage ${JSON.stringify(l.name ?? "(unnamed)")}`, ["name", "note"], errors);
      for (const id of l.ids ?? []) {
        if (!mechIds.has(id)) errors.push(`lineage ${JSON.stringify(l.name)}: references missing mechanic ${id}`);
      }
      // A counter-example must be a node of its own chain, or it renders as nothing.
      if (l.counter != null && !(l.ids ?? []).includes(l.counter)) {
        errors.push(`lineage ${JSON.stringify(l.name)}: counter ${l.counter} is not in its own ids list`);
      }
    }
  }
  if (VERBS) {
    const verbSet = new Set(Array.isArray(VERBS) ? VERBS : Object.keys(VERBS));
    for (const m of BASE_MECHS) {
      for (const v of m.verbs ?? []) {
        if (!verbSet.has(v)) errors.push(`mechanic ${m.id}: unknown discovery verb ${JSON.stringify(v)}`);
      }
    }
  }

  // --- docs that restate the counts (two sources of truth always drift)
  const stats = {
    mechanics: BASE_MECHS.length,
    games: BASE_GAMES.length,
    minigames: MINIGAMES.length,
    researched: BASE_GAMES.filter(g => g.status === "Researched").length,
    queued: BASE_GAMES.filter(g => g.status !== "Researched").length,
    want: BASE_MECHS.filter(m => m.want === "Yes").length,
    rewardTables: MINIGAMES.filter(m => m.rt).length,
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
  }
  if (docs.agents != null && docs.claude != null && docs.agents !== docs.claude) {
    errors.push("AGENTS.md has drifted from CLAUDE.md — it is a byte-for-byte mirror; re-copy it");
  }

  return { errors, stats };
}

// ------------------------------------------------------------------ selftest

/**
 * Replace the first match, insisting the edit lands inside the data region.
 *
 * That last part is not paranoia: an early draft's `/us:\d+/` fixture matched
 * `border-radius:4px` in the CSS. It mutated the file, changed the bytes, threw
 * nothing — and tested absolutely nothing.
 */
function replaceFirst(src, needle, repl, label) {
  const at = typeof needle === "string" ? src.indexOf(needle) : src.search(needle);
  if (at < 0) throw new Error(`sabotage "${label}": pattern not found — the validator's own fixtures are stale`);

  const regionStart = src.indexOf("const CATS");
  const regionEnd = src.indexOf("/* ============================= STATE");
  if (at < regionStart || at > regionEnd) {
    throw new Error(`sabotage "${label}": matched at ${at}, outside the data region (${regionStart}-${regionEnd}) — the pattern needs more context`);
  }

  const out = typeof needle === "string"
    ? src.slice(0, at) + repl + src.slice(at + needle.length)
    : src.slice(0, at) + src.slice(at).replace(needle, repl);
  if (out === src) throw new Error(`sabotage "${label}": source unchanged — the mutation did not apply`);
  return out;
}

/**
 * Each case must (a) actually change the source and (b) trip the check it targets.
 * Matching the message, not just "some error", stops a sabotage from being caught by
 * an unrelated rule and reading as coverage it doesn't have.
 */
const SABOTAGES = [
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
  { name: "broken javascript", expect: /does not parse/,
    apply: s => replaceFirst(s, "const CATS", "const = ;\nconst CATS", "broken javascript") },
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
  { name: "AGENTS.md mirror drift", expect: /AGENTS\.md has drifted/,
    apply: d => ({ ...d, agents: d.agents + "\ndrifted\n" }) },
];

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
  const docs = { claude: read("CLAUDE.md"), agents: read("AGENTS.md") };

  const { errors, stats } = validate(html, docs);

  if (stats) {
    console.log(
      `codex: ${stats.mechanics} mechanics · ${stats.minigames} minigames ` +
      `(${stats.rewardTables} with reward tables) · ${stats.games} games ` +
      `(${stats.researched} researched, ${stats.queued} queued) · ${stats.want} marked want:Yes`
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

main();
