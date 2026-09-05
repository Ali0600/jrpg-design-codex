/**
 * Offline tests for gf_probe.js — synthetic fixtures, no browser, no network.
 *
 *   node --test scripts/gf_probe.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  FAQ_TEXT, splitFaq, listingPage, bigListingPage, faqPage, htmlFaqPage, challengePage, searchPage,
} from "./fixtures/gf/pages.mjs";
import { lintDigest, lintDir } from "./digest_lint.mjs";

const require = createRequire(import.meta.url);
const { core, install } = require("./gf_probe.js");
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MAX = 12000, DEF = 6000;

const size = v => JSON.stringify(v).length;
const mount = page => { install(page.win, page.doc, page.loc); return page.win.__gf; };
const parse = () => { const lines = core.splitLines(FAQ_TEXT); return { lines, secs: core.sections(lines) }; };
const byHead = (secs, frag) => secs.find(s => s.head.includes(frag));

test("detects every plain-text heading style", () => {
  const { secs } = parse();
  const expect = {
    "Introduction": "rule", "Power-Ups": "banner", "[REL01] Relics": "rule", "Hidden Relics": "numbered",
    "SECRETS": "caps", "Shops": "rule", "Version History": "rule",
  };
  for (const [frag, kind] of Object.entries(expect)) {
    const s = byHead(secs, frag);
    assert.ok(s, `no section for ${frag}; got ${secs.map(x => x.head).join(" | ")}`);
    assert.equal(s.kind, kind, `${frag} detected as ${s.kind}`);
  }
  assert.equal(byHead(secs, "Version History").boiler, true);
  assert.equal(byHead(secs, "Hidden Relics").boiler, false);
});

test("decoys are not headings: caps lists, lowercase list items, sentences", () => {
  const { secs } = parse();
  for (const frag of ["FLAME CORE", "used for nothing", "Go to the town", "given away"]) {
    assert.equal(byHead(secs, frag), undefined, `${frag} became a heading`);
  }
  const list = byHead(secs, "POWER-UP LIST");
  assert.ok(list && list.list, "a caps item list collapses under its own title");
});

test("the FAQ's own contents list collapses, but the section that touches it survives", () => {
  const { secs } = parse();
  const tocs = secs.filter(s => s.head.startsWith("Table of Contents"));
  assert.equal(tocs.length, 1);
  assert.ok(tocs[0].list, "contents list flagged");
  assert.match(tocs[0].head, /\(6 entries\)/);
  // The Introduction banner starts two lines after the last contents entry.
  const intro = byHead(secs, "Introduction");
  assert.ok(intro && !intro.list, "Introduction kept as its own section");
  assert.ok(intro.line > tocs[0].line);
});

test("a heading whose underline sits in the next <pre> chunk is still found", () => {
  const chunks = splitFaq(FAQ_TEXT, "-----\nThe vendor");
  assert.ok(chunks[0].endsWith("Shops\n"), "fixture splits right after the Shops title");
  const g = mount(faqPage({ chunks }));
  assert.equal(g.meta().chunks, 2);
  assert.ok(g.toc().rows.some(r => r.head === "Shops"), "Shops heading found across the chunk boundary");
});

test("section() is pageable and clamps to the ceiling", () => {
  const g = mount(faqPage({ chunks: [FAQ_TEXT] }));
  const i = g.toc().rows.find(r => r.head.includes("[REL01] Relics")).i;
  const a = g.section(i, 100);
  assert.equal(a.text.length, 100);
  assert.equal(a.to, 100);
  assert.ok(a.to < a.total);
  const b = g.section(i, 100, 100);
  assert.equal(b.from, 100);
  assert.equal(b.text, g.section(i).text.slice(100, 200));
  assert.ok(g.section(i, 50000).text.length <= MAX - 400);
  assert.ok(g.section(999).error);
});

test("grep finds the reward thresholds and honours max", () => {
  const g = mount(faqPage({ chunks: [FAQ_TEXT] }));
  const t = g.grep("threshold");
  assert.ok(t.hits >= 1);
  assert.equal(t.rows[0].sec, "SECRETS");
  assert.match(t.rows[0].text, /30 wins/);
  const r = g.grep("Relic", 0, 1);
  assert.ok(r.hits >= 2, "several lines mention relics");
  assert.equal(r.rows.length, 1);
  assert.equal(typeof r.rows[0].line, "number");
  assert.ok(g.grep("(").error, "a broken pattern reports, not throws");
  // PILLAR presets are exposed and used by name.
  assert.ok(Object.keys(g.PILLAR).includes("threshold"));
});

test("every accessor stays under the ceiling", () => {
  let big = "";
  for (let i = 0; i < 400; i++) big += `Heading Number ${i}\n=================\nbody text for section ${i} mentions Heading\n\n`;
  const g = mount(faqPage({ chunks: [big] }));
  const toc = g.toc({ max: 1000 });
  assert.ok(size(toc) <= DEF, `toc ${size(toc)}`);
  assert.ok(toc.dropped > 0, "toc reports what it cut");
  assert.equal(toc.total, 400);
  const gr = g.grep("Heading", 2, 1000);
  assert.ok(size(gr) <= DEF, `grep ${size(gr)}`);
  assert.ok(gr.hits >= 400 && gr.rows.length < gr.hits);
  assert.ok(size(g.lines(1, 5000)) <= MAX, "lines()");
  const gl = mount(bigListingPage(200)).guides();
  assert.ok(size(gl) <= DEF, `guides ${size(gl)}`);
  assert.equal(gl.n, 200);
  assert.ok(gl.dropped > 0);
});

test("meta() reads the page chrome and the title, not the body", () => {
  const g = mount(faqPage({ chunks: splitFaq(FAQ_TEXT, "===== Power-Ups") }));
  const m = g.meta();
  assert.equal(m.id, "103");
  assert.equal(m.game, "Lantern Vale");
  assert.equal(m.title, "Relic & Power-Up FAQ");
  assert.equal(m.platform, "PlayStation");
  assert.equal(m.author, "aster");
  assert.equal(m.version, "1.2");
  assert.equal(m.updated, "07/26/2005");
  assert.equal(m.format, "pre");
  assert.equal(m.chunks, 2);
  assert.equal(m.chars, FAQ_TEXT.length);   // the chunks are re-joined without a seam
});

test("guides() attaches the category that precedes each row, in document order", () => {
  const g = mount(listingPage()).guides();
  assert.equal(g.n, 4);
  assert.deepEqual(g.rows.map(r => r.cat), ["Full Game Guides", "In-Depth Guides", "In-Depth Guides", "Demo Guides"]);
  const first = g.rows[0];
  assert.equal(first.id, "101");
  assert.equal(first.author, "aster");
  assert.equal(first.ver, "1.3");
  assert.equal(first.kb, 380);
  assert.equal(first.year, 2002);
  assert.equal(first.date, "06/25/2002");
  assert.equal(first.rec, true);
  assert.deepEqual(first.flags, ["Highest Rated"]);
  assert.equal(g.rows[1].ver, "");
  assert.equal(g.rows[1].kb, 387);
});

test("triage ranks guides by codex value", () => {
  const t = mount(listingPage()).triage();
  assert.deepEqual(t.rows.map(r => r.author), ["cinder", "aster", "brook", "dune"]);
  assert.match(t.rows[0].why, /In-Depth/);
  assert.match(t.rows[2].why, /script/i);
  assert.match(t.rows[1].why, /toc first/);
  assert.match(t.rows[3].why, /thin/);
});

test("page() tells the four page kinds apart, including the challenge", () => {
  assert.equal(mount(listingPage()).page().kind, "listing");
  assert.equal(mount(faqPage({ chunks: [FAQ_TEXT] })).page().kind, "faq");
  assert.equal(mount(challengePage()).page().kind, "challenge");
  assert.equal(mount(searchPage()).page().kind, "search");
});

test("search() lists game candidates once each and never picks", () => {
  const s = mount(searchPage()).search();
  assert.deepEqual(s.rows, [
    { title: "Persona 5", platform: "ps4", url: "/ps4/835628-persona-5" },
    { title: "Persona 5 Strikers", platform: "switch", url: "/switch/262892-persona-5-strikers" },
  ]);
});

test("a second eval is a no-op", () => {
  const page = faqPage({ chunks: [FAQ_TEXT] });
  assert.match(install(page.win, page.doc, page.loc), /loaded/);
  const first = page.win.__gf;
  assert.equal(install(page.win, page.doc, page.loc), "already loaded");
  assert.equal(page.win.__gf, first);
});

test("HTML-formatted guides fall back to heading sentinels and flattened tables", () => {
  const g = mount(htmlFaqPage());
  const m = g.meta();
  assert.equal(m.format, "html");
  assert.equal(m.chunks, 0);
  assert.equal(m.version, "2.0");
  const heads = g.toc().rows.map(r => r.head);
  assert.ok(heads.includes("Items") && heads.includes("Weapons"), heads.join(" | "));
  assert.match(g.grep("Reed Blade").rows[0].text, /Reed Blade \| Harbor shop, 120 coins/);
  assert.ok(g.grep("Nested paragraph").hits === 1, "text inside wrapper divs is reached");
});

test("digest lint: every fact needs a pointer, every row needs two sources", () => {
  const good = [
    "# Lantern Vale", "", "## Sources", "| id | title |", "|---|---|", "| 103 | Power-Up/Item FAQ |", "",
    "## Mechanics candidates", "### Cores", "cat: Progression & Upgrades",
    "pointers: [gf:103 §Power-Ups, cinder v1.0] [wiki:lanternvale.fandom.com/Cores]", "row: M262",
    "- eight cores in the base game [gf:103 §Power-Ups, cinder v1.0]", "",
    "## Minigame candidates", "### Harbor arena", "pointers: [gf:103 §SECRETS, cinder v1.0]",
    "| at | get | src |", "|---|---|---|", "| 30 wins | Sun Sigil | [gf:103 §SECRETS, cinder v1.0] |", "",
    "## Codex rows", "```js", "- not a fact, code", "```", "",
    "## Notes", "- prose bullets outside the fact sections need nothing",
  ].join("\n");
  assert.deepEqual(lintDigest(good, "good"), []);

  const bad = [
    "## Exploration & upgrade facts", "- a fact from memory", "",
    "## Minigame candidates", "### Arena", "pointers: [gf:103 §SECRETS, cinder v1.0]", "row: g090",
    "| at | get | src |", "|---|---|---|", "| 30 wins | Sun Sigil | no pointer here |",
    "### Lottery", "- ticket prices [gf:103 §Shops, cinder v1.0]",
  ].join("\n");
  const problems = lintDigest(bad, "bad");
  assert.ok(problems.some(p => /2: fact bullet without/.test(p)), problems.join("\n"));
  assert.ok(problems.some(p => /10: table row without/.test(p)), problems.join("\n"));
  assert.ok(problems.some(p => /Arena became row g090 on fewer than two/.test(p)), problems.join("\n"));
  assert.ok(problems.some(p => /Lottery has no pointers/.test(p)), problems.join("\n"));
  assert.equal(problems.length, 4);
});

test("every committed digest passes the lint", () => {
  const { files, problems } = lintDir(join(ROOT, "docs", "research"));
  assert.deepEqual(problems, []);
  assert.ok(files.length >= 1, "docs/research holds at least the template");
});

test("the probe file is small enough to paste into a page", () => {
  const src = readFileSync(join(ROOT, "scripts", "gf_probe.js"), "utf8");
  assert.ok(src.length < 22000, `probe is ${src.length} chars — every page navigation re-pastes it`);
  assert.doesNotMatch(src, /^\s*(const|let|class)\s/m, "no top-level bindings — the REPL must be able to eval it twice");
});
