/**
 * Offline tests for the research-digest linter: the pointer grammar's bookkeeping between a
 * digest's Sources table, its Coverage lines and its Triage record (which GameFAQs guides a pass
 * read, grepped or skipped, and why).
 *
 *   node --test scripts/digest_lint.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { lintDigest, lintDir } from "./digest_lint.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const SOURCES = [
  "| 11111 | Item FAQ | Ann | 1.0 | 01/01/2001 | In-Depth Guides | 30 | https://gamefaqs.gamespot.com/ps/1-lantern-vale/faqs/11111 |",
  "| 22222 | Walkthrough (grep only) | Bo | 2.0 | 02/02/2002 | Full Game Guides | 400 | https://gamefaqs.gamespot.com/ps/1-lantern-vale/faqs/22222 |",
  "| wiki | Lantern Vale Wiki: Items | — | — | — | lanternvale.fandom.com | — | https://lanternvale.fandom.com/wiki/Items |",
];
const COVERAGE = ["Coverage 11111: read 3/20 sections.", "Coverage 22222: grep only."];
const TRIAGE_HEAD = [
  "`__gf.triage()` on 2026-09-14: 3 guides listed (1 Full Game Guides, 2 In-Depth Guides, 0 under other headings).",
  "",
  "| id | title | author | category | KB | score | decision |",
  "|---|---|---|---|---|---|---|",
];
const TRIAGE_ROWS = [
  "| 11111 | Item FAQ | Ann | In-Depth Guides | 30 | 9 | read |",
  "| 22222 | Walkthrough | Bo | Full Game Guides | 400 | 4 | grep only |",
  "| 33333 | Boss FAQ | Cy | In-Depth Guides | 12 | -1 | skipped — boss guide, no pillar words |",
];
const BODY = [
  "## Mechanics candidates", "",
  "### Lanterns",
  "cat: Exploration & Rewards",
  "pointers: [gf:11111 §Items, Ann v1.0] [wiki:lanternvale.fandom.com/Items]",
  "row: M+1",
  "- A lantern fact [gf:22222 §Walkthrough, Bo v2.0]", "",
];

const digest = ({ started = "2026-09-14", sources = SOURCES, coverage = COVERAGE, triage = [...TRIAGE_HEAD, ...TRIAGE_ROWS], body = BODY } = {}) => [
  "# Lantern Vale — research digest", "",
  `Codex: \`Lantern Vale\` (1999, PlayStation) · GameFAQs: \`/ps/1-lantern-vale\` confirmed ${started} · digest started ${started}`, "",
  "## Sources", "",
  "| id | title | author | version | updated | category | KB | url |",
  "|---|---|---|---|---|---|---|---|",
  ...sources, "",
  ...coverage, "",
  ...(triage == null ? [] : ["## Triage", "", ...triage, ""]),
  ...body,
].join("\n");
const lint = opts => lintDigest(digest(opts), "d.md");
const hit = (problems, re) => problems.some(p => re.test(p));

test("a complete new digest lints clean, a wiki source needing no Coverage line", () => {
  assert.deepEqual(lint(), []);
});

test("a cited guide must be described in the Sources table", () => {
  const p = lint({ body: [...BODY, "- Another fact [gf:44444 §Secrets, Di v1.0]"] });
  assert.ok(hit(p, /gf:44444.*Sources/), p.join("\n"));
});

test("a GameFAQs source must say what was read", () => {
  const p = lint({ coverage: [COVERAGE[0]] });
  assert.ok(hit(p, /22222.*Coverage/), p.join("\n"));
});

test("a digest from before Coverage lines and triage records existed is held to neither", () => {
  assert.deepEqual(lint({ started: "2026-09-05", coverage: [], triage: null }), []);
});

test("a new digest records its triage, and the template's placeholder date counts as new", () => {
  assert.ok(hit(lint({ triage: null }), /Triage/));
  assert.ok(hit(lint({ started: "<date>", triage: null }), /Triage/));
  assert.deepEqual(lint({ started: "2026-09-13", triage: null }), [], "a digest started the day before the rule is not held to it");
});

test("a digest with no GameFAQs guide says so instead of carrying a table", () => {
  const wikiOnly = {
    sources: [SOURCES[2]], coverage: [], triage: ["No GameFAQs guide used; wiki-sourced."],
    body: ["## Mechanics candidates", "", "### Lanterns", "pointers: [wiki:lanternvale.fandom.com/Items] [wiki:finalfantasy.fandom.com/Lanterns]", "row: M+1", ""],
  };
  assert.deepEqual(lint(wikiOnly), []);
  assert.ok(hit(lint({ ...wikiOnly, triage: ["Nothing to see."] }), /Triage/), "an empty section is not a record");
});

test("every triage row names a guide heading and a decision", () => {
  assert.ok(hit(lint({ triage: [...TRIAGE_HEAD, ...TRIAGE_ROWS, "| 44444 | Map | Di | Maps and Charts | 2 | 0 | skipped — a map |"] }), /44444.*category/));
  assert.ok(hit(lint({ triage: [...TRIAGE_HEAD, TRIAGE_ROWS[0], TRIAGE_ROWS[1], "| 33333 | Boss FAQ | Cy | In-Depth Guides | 12 | -1 | maybe later |"] }), /33333.*decision/));
});

test("a guide the triage says was read must be in Sources", () => {
  const p = lint({ triage: [...TRIAGE_HEAD, ...TRIAGE_ROWS, "| 55555 | Secrets | Ed | In-Depth Guides | 20 | 7 | read |"] });
  assert.ok(hit(p, /55555.*Sources/), p.join("\n"));
});

test("every GameFAQs source must appear in the triage table", () => {
  const p = lint({ triage: [...TRIAGE_HEAD, TRIAGE_ROWS[0], TRIAGE_ROWS[2]] });
  assert.ok(hit(p, /22222.*Triage/), p.join("\n"));
});

test("a page that is neither a guide nor a wiki is cited with a web pointer, and counts as a source", () => {
  const body = [
    "## Minigame candidates", "",
    "### Lantern race",
    "pointers: [wiki:lanternvale.fandom.com/Race] [web:www.lanternvale.net/race.php?lap=2]",
    "row: g+1",
    "- A race prize [web:www.lanternvale.net/race.php?lap=2]", "",
  ];
  assert.deepEqual(lint({ body }), []);
});

test("a bracket inside a GameFAQs pointer's section is refused, since the pointer would end at the first ]", () => {
  const p = lint({ body: [...BODY, "- A chapter-coded fact [gf:11111 §[0501] Items, Ann v1.0]", ""] });
  assert.ok(hit(p, /section "\[0501" contains "\["/), p.join("\n"));
  assert.deepEqual(lint({ body: [...BODY, "- A chapter-coded fact [gf:11111 §Items (0501), Ann v1.0]", ""] }), []);
});

test("GameFAQs is never cited through a web pointer", () => {
  const p = lint({ body: [...BODY, "- A guide fact [web:gamefaqs.gamespot.com/ps/1-lantern-vale/faqs/11111]", ""] });
  assert.ok(hit(p, /GameFAQs.*\[gf:/), p.join("\n"));
});

// ---------------------------------------------------------------- the walkthrough a pass reads

const FLAG_HEAD = [TRIAGE_HEAD[0], "", "| id | title | author | category | KB | score | decision | flags |", "|---|---|---|---|---|---|---|---|"];
const flagRows = (walkthrough, extra = []) => [
  "| 11111 | Item FAQ | Ann | In-Depth Guides | 30 | 9 | read | — |",
  walkthrough,
  "| 33333 | Boss FAQ | Cy | In-Depth Guides | 12 | -1 | skipped — boss guide, no pillar words | Most Recommended |",
  ...extra,
];

test("the plain-text Most Recommended walkthrough must be read, and an In-Depth star need not be", () => {
  const graze = lint({ triage: [...FLAG_HEAD, ...flagRows("| 22222 | Walkthrough | Bo | Full Game Guides | 400 | 4 | grep only | Most Recommended |")] });
  assert.ok(hit(graze, /22222 is the Full Game Guide to read \(most recommended\), but its decision is "grep only"/), graze.join("\n"));
  assert.equal(graze.length, 1, graze.join("\n"));
  assert.deepEqual(lint({ triage: [...FLAG_HEAD, ...flagRows("| 22222 | Walkthrough | Bo | Full Game Guides | 400 | 4 | read | Most Recommended |")] }), []);
});

test("an HTML star gives way to the plain Highest Rated walkthrough, and an all-HTML section asks nothing", () => {
  const star = "| 44444 | Guide and Walkthrough | Di | Full Game Guides | 900 | 3 | skipped — HTML, paginated | Most Recommended · HTML |";
  const graze = lint({ triage: [...FLAG_HEAD, ...flagRows("| 22222 | Walkthrough | Bo | Full Game Guides | 400 | 4 | grep only | Highest Rated |", [star])] });
  assert.ok(hit(graze, /22222 is the Full Game Guide to read \(the Most Recommended one is HTML; highest rated, largest\)/), graze.join("\n"));
  assert.deepEqual(lint({ triage: [...FLAG_HEAD, ...flagRows("| 22222 | Walkthrough | Bo | Full Game Guides | 400 | 4 | read | Highest Rated |", [star])] }), []);
  assert.deepEqual(lint({ triage: [...FLAG_HEAD, ...flagRows("| 22222 | Walkthrough | Bo | Full Game Guides | 400 | 4 | grep only | Highest Rated · HTML |", [star])] }), []);
});

test("a digest started on or after 2026-09-15 needs the flags column; an older one does not", () => {
  assert.ok(hit(lint({ started: "2026-09-15" }), /flags column/));
  assert.ok(hit(lint({ started: "<date>" }), /flags column/), "the template's placeholder date counts as new");
  assert.deepEqual(lint({ started: "2026-09-14" }), []);
  const read = flagRows("| 22222 | Walkthrough | Bo | Full Game Guides | 400 | 4 | read | Most Recommended |");
  assert.deepEqual(lint({ started: "2026-09-15", triage: [...FLAG_HEAD, ...read] }), []);
});

test("the committed digests and the template lint clean", () => {
  const { files, problems } = lintDir(join(ROOT, "docs", "research"));
  assert.ok(files.includes("_template.md") && files.length >= 8, files.join(", "));
  assert.deepEqual(problems, []);
});
