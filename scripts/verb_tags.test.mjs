/**
 * Offline tests for the discovery-verb ledger: its parser and row checks (which live in
 * validate_codex.mjs so the gate and the writer read one grammar) and verb_tags.mjs, the
 * writer that copies the ledger's verbs into BASE_MECHS.
 *
 *   node --test scripts/verb_tags.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { syncVerbs } from "./verb_tags.mjs";
import { parseVerbLedger, ledgerProblems, extractScript, extractData } from "./validate_codex.mjs";
import { Refusal } from "./game_rows.mjs";
import { miniCodex } from "./fixtures/mini_codex.mjs";

const hash = s => createHash("sha256").update(s).digest("hex");

// Rows in the real file's shape: the first line ends at `cat`, and `verbs` sits after the id
// (M002), after `cat` (M003, as two real rows have it) or nowhere (M001, M004).
const MECHS = `{id:"M001",game:"Lantern Vale",name:"First",cat:"Exploration & Rewards",
how:"A lantern shows a door that was not there a moment ago, and the vault behind it pays out.",
loop:"Light the lantern → find the door → loot the vault.",
rating:0,want:""},
{id:"M002",verbs:["Guarded"],game:"Lantern Vale",name:"Second",cat:"Combat",
how:"An elite knight sits on the chest at the top of the tower, and only beating him opens it.",
loop:"Climb → fight the knight → open the chest.",
rating:0,want:"",
notes:"n"},
{id:"M003",game:FF,name:"Third — with a dash",cat:"Combat",verbs:["Traded"],
how:"A fisherman on the pier trades a rare lure for every ten shells you bring back from the reef.",
loop:"l",
rating:0,want:""},
{id:"M004",game:"Harbor Town",name:"Fourth",cat:"Combat",
how:"Nothing in the ledger names this row.",
loop:"l",
rating:0,want:""}`;
const VERBS = { "Guarded": "An elite sits on it.", "Traded": "An NPC wants something.", "Latent geometry": "A path appears." };
const LEDGER = `# Discovery-verb ledger

Prose before the first entry is free,
- including a line that looks like a tag.

### M001 — First
- Latent geometry · how · \`shows a door that was not there a moment ago\`

### M002 — Second
- none · the knight guards a tower chest, but the row is about the fight

### M003 — Third — with a dash
- Traded · how · \`trades a rare lure for every ten shells\`
`;

const page = (opts = {}) => miniCodex({ mechs: MECHS, verbs: VERBS, ...opts });
const rows = html => new Function(extractData(extractScript(html)) + "; return BASE_MECHS;")();
const byId = (html, id) => rows(html).find(r => r.id === id);
const lineOf = (html, id) => html.split("\n").find(l => l.startsWith(`{id:"${id}",`));

// ------------------------------------------------------------------ the writer

test("a ledger tag is written straight after the id", () => {
  const { html, changed } = syncVerbs(page(), LEDGER);
  assert.ok(changed.includes("M001"));
  assert.equal(lineOf(html, "M001"), '{id:"M001",verbs:["Latent geometry"],game:"Lantern Vale",name:"First",cat:"Exploration & Rewards",');
  assert.deepEqual(byId(html, "M001").verbs, ["Latent geometry"]);
});

test("a none entry removes the key", () => {
  const { html, changed } = syncVerbs(page(), LEDGER);
  assert.ok(changed.includes("M002"));
  assert.equal(lineOf(html, "M002"), '{id:"M002",game:"Lantern Vale",name:"Second",cat:"Combat",');
  assert.equal(byId(html, "M002").verbs, undefined);
});

test("a key found after cat is moved to after the id, even when its verbs already match", () => {
  const { html, changed } = syncVerbs(page(), LEDGER);
  assert.ok(changed.includes("M003"));
  assert.equal(lineOf(html, "M003"), '{id:"M003",verbs:["Traded"],game:FF,name:"Third — with a dash",cat:"Combat",');
});

test("only the named rows' first lines change; every other line is byte-identical", () => {
  const before = page();
  const { html, changed } = syncVerbs(before, LEDGER);
  assert.deepEqual(changed, ["M001", "M002", "M003"]);
  const a = before.split("\n"), b = html.split("\n");
  assert.equal(b.length, a.length);
  const moved = a.flatMap((l, i) => (l === b[i] ? [] : [l.slice(0, 11)]));
  assert.deepEqual(moved, ['{id:"M001",', '{id:"M002",', '{id:"M003",']);
  assert.deepEqual(byId(html, "M004"), byId(before, "M004"));
});

test("a second run changes nothing", () => {
  const once = syncVerbs(page(), LEDGER).html;
  const twice = syncVerbs(once, LEDGER);
  assert.deepEqual(twice.changed, []);
  assert.equal(hash(twice.html), hash(once));
});

test("a tagged row the ledger does not name is a refusal, not a silent strip", () => {
  const ledger = LEDGER.replace(/### M003[\s\S]*$/, "");
  assert.throws(() => syncVerbs(page(), ledger), Refusal);
  assert.throws(() => syncVerbs(page(), ledger), /M003 carries \["Traded"\] but has no docs\/verbs\.md entry/);
});

test("a verb that is not a VERBS key is a refusal", () => {
  const ledger = LEDGER.replace("- Latent geometry · how", "- Ghost verb · how");
  assert.throws(() => syncVerbs(page(), ledger), /"Ghost verb" is not a VERBS key/);
});

test("a ledger that fails its own checks is a refusal", () => {
  const ledger = LEDGER.replace("a rare lure for every ten shells", "a rare lure for every eleven shells");
  assert.throws(() => syncVerbs(page(), ledger), /quote is not in the row's how/);
});

test("a codex with no VERBS is a refusal", () => {
  assert.throws(() => syncVerbs(page({ verbs: null }), LEDGER), /defines no VERBS/);
});

test("a row not at column 0 is a refusal, not a guess", () => {
  const html = page().replace('\n{id:"M004",', '\n  {id:"M004",');
  assert.throws(() => syncVerbs(html, LEDGER), /evaluates to 4 rows but 3 lines start/);
});

test("a first line it cannot read is a refusal", () => {
  const html = page().replace('name:"Fourth",cat:"Combat",\nhow:', 'name:"Fourth",cat:"Combat",how:');
  assert.throws(() => syncVerbs(html, LEDGER), /M004: first line does not have the shape/);
});

test("the command line is a dry run until --write, and --write is idempotent", () => {
  const dir = mkdtempSync(join(tmpdir(), "verb-tags-"));
  const codex = join(dir, "codex.html"), ledger = join(dir, "verbs.md");
  writeFileSync(codex, page());
  writeFileSync(ledger, LEDGER);
  const run = (...extra) => execFileSync(process.execPath,
    ["scripts/verb_tags.mjs", "--codex", codex, "--ledger", ledger, ...extra], { encoding: "utf8" });
  const start = hash(readFileSync(codex, "utf8"));

  assert.match(run(), /3 rows would change: M001, M002, M003/);
  assert.equal(hash(readFileSync(codex, "utf8")), start, "a dry run wrote to the file");

  assert.match(run("--write"), /3 rows rewritten/);
  const written = hash(readFileSync(codex, "utf8"));
  assert.notEqual(written, start);

  assert.match(run("--write"), /every row already matches/);
  assert.equal(hash(readFileSync(codex, "utf8")), written);
});

// ------------------------------------------------------------------ the parser

test("parses tags, none entries and a name containing ' — ', and ignores the intro", () => {
  const { entries, problems } = parseVerbLedger(LEDGER);
  assert.deepEqual(problems, []);
  assert.deepEqual([...entries.keys()], ["M001", "M002", "M003"]);
  assert.equal(entries.get("M003").name, "Third — with a dash");
  assert.deepEqual(entries.get("M001").tags.map(t => [t.verb, t.field, t.quote]),
    [["Latent geometry", "how", "shows a door that was not there a moment ago"]]);
  assert.match(entries.get("M002").none, /^the knight guards/);
});

test("a second entry for one id is a problem", () => {
  const { problems } = parseVerbLedger(LEDGER + "\n### M001 — First\n- none · again\n");
  assert.ok(problems.some(p => /M001 has a second entry \(the first is at line 6\)/.test(p)), problems.join("\n"));
});

test("the same verb twice in one entry is a problem", () => {
  const md = LEDGER.replace("\n\n### M002", "\n- Latent geometry · loop · `Light the lantern → find the door`\n\n### M002");
  const { problems } = parseVerbLedger(md);
  assert.ok(problems.some(p => /M001 tags "Latent geometry" twice/.test(p)), problems.join("\n"));
});

test("none mixed with tags is a problem, in either order", () => {
  const after = parseVerbLedger(LEDGER.replace("\n\n### M002", "\n- none · changed my mind\n\n### M002")).problems;
  const before = parseVerbLedger(LEDGER.replace("\n\n### M003", "\n- Guarded · how · `sits on the chest at the top of the tower`\n\n### M003")).problems;
  assert.ok(after.some(p => /M001 mixes `- none` with other lines/.test(p)), after.join("\n"));
  assert.ok(before.some(p => /M002 mixes `- none` with other lines/.test(p)), before.join("\n"));
});

test("an entry with no lines is a problem", () => {
  const { problems } = parseVerbLedger(LEDGER.replace("- none · the knight guards a tower chest, but the row is about the fight\n", ""));
  assert.ok(problems.some(p => /### M002 has no tag line and no `- none` line/.test(p)), problems.join("\n"));
});

test("an unreadable line or a field outside how/loop/notes is a problem", () => {
  const typo = parseVerbLedger(LEDGER.replace("- Traded · how", "-Traded · how")).problems;
  const field = parseVerbLedger(LEDGER.replace("- Traded · how", "- Traded · name")).problems;
  assert.ok(typo.some(p => /M003: cannot read "-Traded/.test(p)), typo.join("\n"));
  assert.ok(field.some(p => /M003: field "name" is not one of how, loop, notes/.test(p)), field.join("\n"));
});

test("a ### header without an id and a name is a problem", () => {
  const { problems } = parseVerbLedger(LEDGER.replace("### M002 — Second", "### M002 Second"));
  assert.ok(problems.some(p => /a ### header must read/.test(p)), problems.join("\n"));
});

// ------------------------------------------------------------- the row checks

test("a quote shorter than the minimum is a problem even when it is in the row", () => {
  const md = LEDGER.replace("`trades a rare lure for every ten shells`", "`a rare lure`");
  const out = ledgerProblems(parseVerbLedger(md), rows(page()));
  assert.ok(out.some(p => /M003 · Traded: quote is 11 chars — evidence needs at least 25/.test(p)), out.join("\n"));
});

test("a quote is checked against the field it names, including a field the row lacks", () => {
  const wrongField = LEDGER.replace("- Traded · how", "- Traded · loop");
  const noNotes = LEDGER.replace("- Traded · how", "- Traded · notes");
  const a = ledgerProblems(parseVerbLedger(wrongField), rows(page()));
  const b = ledgerProblems(parseVerbLedger(noNotes), rows(page()));
  assert.ok(a.some(p => /M003 · Traded: quote is not in the row's loop/.test(p)), a.join("\n"));
  assert.ok(b.some(p => /M003 · Traded: quote is not in the row's notes/.test(p)), b.join("\n"));
});

test("a header must name a real row by its exact name", () => {
  const renamed = ledgerProblems(parseVerbLedger(LEDGER.replace("### M002 — Second", "### M002 — Secnd")), rows(page()));
  const missing = ledgerProblems(parseVerbLedger(LEDGER.replace("### M002 — Second", "### M099 — Second")), rows(page()));
  assert.ok(renamed.some(p => /### M002 names "Secnd", the row is named "Second"/.test(p)), renamed.join("\n"));
  assert.ok(missing.some(p => /### M099 names no mechanic in the codex/.test(p)), missing.join("\n"));
});
