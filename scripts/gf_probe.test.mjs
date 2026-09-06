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
  FAQ_TEXT, splitFaq, listingPage, bigListingPage, faqPage, htmlFaqPage, ffaqPage, challengePage, searchPage,
  gamePage,
} from "./fixtures/gf/pages.mjs";
import { lintDigest, lintDir } from "./digest_lint.mjs";
import { armText, pasteText, probeUrl, KEY } from "./gf_bootstrap.mjs";

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
    // The boxed style the Threads of Fate Secrets Guide uses (found live, 2026-09-05).
    "04> LEGENDARY STUFF": "rule", "Legendary Ladle": "banner", "Legendary Pot": "banner",
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
  const gg = mount(gamePage({ likes: 300 })).game();
  assert.ok(size(gg) <= DEF, `game ${size(gg)}`);
  assert.ok(gg.dropped > 0, "game() reports what it cut from the like-list");
  assert.ok(gg.like.length > 3 && gg.like.length < 300);
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

test("page() tells the five page kinds apart, including the challenge", () => {
  assert.equal(mount(listingPage()).page().kind, "listing");
  assert.equal(mount(faqPage({ chunks: [FAQ_TEXT] })).page().kind, "faq");
  assert.equal(mount(challengePage()).page().kind, "challenge");
  assert.equal(mount(searchPage()).page().kind, "search");
  assert.equal(mount(gamePage()).page().kind, "game");
});

test("game() reads the Game Detail box, the user ratings and the like-list, and nothing else", () => {
  const r = mount(gamePage()).game();
  assert.equal(r.title, "Lantern Vale");
  assert.equal(r.platform, "PlayStation");
  assert.equal(r.url, "https://gamefaqs.gamespot.com/ps/1-lantern-vale");
  // Labels exactly as the page prints them, values with the label stripped: the splicer,
  // not the probe, decides what each label means.
  assert.deepEqual(r.detail, {
    Platform: "PlayStation",
    Genre: "Role-Playing » Action RPG",
    "Developer/Publisher": "Lantern Works",
    Release: "March 3, 1999",
    Franchises: "Lantern, Vale Chronicles",
    "Also Known As": "Rantan no Tani (JP)",
    "Also on": "PSP, Vita",
  });
  assert.deepEqual(r.links.Release, ["/ps/1-lantern-vale/data"]);
  assert.deepEqual(r.links["Also on"], ["/psp/2-lantern-vale", "/vita/3-lantern-vale"]);
  assert.equal(r.links["Also Known As"], undefined, "plain-text rows carry no hrefs");
  // The precise averages and counts come from each block's title attribute, never from
  // the hidden input, which rounds difficulty and length to the icon count.
  assert.deepEqual(r.ratings, {
    rate: { v: 4.12, w: "Great", n: 12317 },
    difficulty: { v: 3.25, w: "Just Right/Tough", n: 1560 },
    length: { v: 31, w: "31 Hours", n: 1105 },
  });
  assert.deepEqual(r.like, [
    { t: "Harbor Story", u: "/ps/4-harbor-story" },
    { t: "Lantern Vale II", u: "/ps/5-lantern-vale-ii" },
    { t: "Reed Blade Saga", u: "/ps/6-reed-blade-saga" },
  ]);
  // The prose guard: neither the Description pod nor the blurb under each related game
  // may come back, through any field.
  assert.doesNotMatch(JSON.stringify(r), /MUST NOT LEAK/);
  assert.ok(size(r) <= DEF, `game ${size(r)}`);
  const walk = v => {
    if (typeof v === "string") assert.ok(v.length < 120, `a value long enough to be prose: ${v.slice(0, 40)}…`);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(r);
  // Without the optional rows the map simply lacks them — no empty keys.
  const short = mount(gamePage({ withAlso: false })).game();
  assert.equal(Object.keys(short.detail).length, 5);
  assert.equal(short.detail["Also on"], undefined);
});

test("game() on a page with no Game Detail box is empty, not a throw", () => {
  const r = mount(searchPage()).game();
  assert.deepEqual(r.detail, {});
  assert.deepEqual(r.links, {});
  assert.deepEqual(r.ratings, {});
  assert.deepEqual(r.like, []);
  assert.equal(r.title, "");
});

test("search() lists game candidates once each and never picks", () => {
  const s = mount(searchPage()).search();
  assert.deepEqual(s.rows, [
    { title: "Persona 5", platform: "ps4", url: "/ps4/835628-persona-5" },
    { title: "Persona 5 Strikers", platform: "switch", url: "/switch/262892-persona-5-strikers" },
  ]);
});

test("a formatted guide in div.ffaq is read, and its pagination is reported", () => {
  const g = mount(ffaqPage({ page: 3, pages: 19 }));
  assert.equal(g.page().kind, "faq", "an ffaq guide is a guide, not an unknown page");
  const m = g.meta();
  assert.equal(m.format, "html");
  assert.equal(m.page, 3);
  assert.equal(m.pages, 19, "18 other pages exist and the digest must be able to say so");
  const heads = g.toc().rows.map(r => r.head);
  assert.ok(heads.includes("Places of Power"), heads.join(" | "));
  assert.ok(heads.includes("Finisher Attacks"), "H4 headings are sections too");
  assert.match(g.grep("Ability Point").rows[0].text, /one Ability Point/);
  const v = g.visited();
  assert.equal(v.page, 3);
  assert.equal(v.pages, 19, "coverage that hides 18 unread pages is not coverage");
});

test("a single-page guide reports one page, not zero", () => {
  const g = mount(faqPage({ chunks: [FAQ_TEXT] }));
  assert.equal(g.meta().pages, 1);
  assert.equal(g.meta().page, 1);
  assert.equal(g.page().pages, 1);
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

test("visited() reports what was read, what was greped, and the biggest unread section", () => {
  const g = mount(faqPage({ chunks: [FAQ_TEXT] }));
  const rows = g.toc().rows;
  const relics = rows.find(r => r.head.includes("[REL01] Relics")).i;
  const secrets = rows.find(r => r.head === "SECRETS").i;
  assert.deepEqual(g.visited().read, [], "nothing is read until something is read");

  g.section(relics);                       // whole section
  g.section(secrets, 20);                  // first 20 chars only
  g.grep("threshold");

  const v = g.visited();
  assert.deepEqual(v.read.map(r => r.i).sort((a, b) => a - b), [relics, secrets].sort((a, b) => a - b));
  assert.equal(v.read.find(r => r.i === relics).pct, 100);
  assert.ok(v.read.find(r => r.i === secrets).pct < 100, "a partial read is reported as partial");
  assert.deepEqual(v.greps, ["threshold"]);

  const unread = v.unread.map(r => r.head);
  assert.ok(!unread.includes("SECRETS") && !unread.includes("[REL01] Relics"), "read sections are not listed unread");
  assert.ok(v.unread.every(r => r.len >= 800), "the floor is honoured");
  assert.ok(g.visited(0).unread.length > v.unread.length, "a lower floor surfaces more");
  assert.ok(size(v) <= DEF, `visited ${size(v)}`);
});

test("unread ranks by size, not document order, and never counts boilerplate", () => {
  // Sizes deliberately disagree with document order, and the biggest section of all is
  // boilerplate — so ordering and the boiler filter are both observable here.
  const body = (title, n) => `${title}\n${"=".repeat(title.length)}\n${("filler line about rewards\n").repeat(n)}\n`;
  const g = mount(faqPage({ chunks: [
    body("Alpha Items", 40) + body("Beta Rewards", 120) + body("Gamma Notes", 60) + body("Credits", 200),
  ] }));
  const v = g.visited();
  assert.deepEqual(v.unread.map(r => r.head), ["Beta Rewards", "Gamma Notes", "Alpha Items"]);
  assert.ok(v.unread.every(r => r.len >= 800), "all three clear the floor");
  assert.ok(v.unread[0].len < 20000 && !v.unread.some(r => r.head === "Credits"),
    "Credits is the largest section and pure boilerplate — it must not be recommended");
});

test("visited() stays under the ceiling on a guide with hundreds of sections", () => {
  let big = "";
  for (let i = 0; i < 400; i++) big += `Section Number ${i}\n=================\n${("body text\n").repeat(90)}\n`;
  const g = mount(faqPage({ chunks: [big] }));
  const v = g.visited();
  assert.ok(size(v) <= DEF, `visited ${size(v)}`);
  assert.ok(v.dropped > 0, "it reports how much of the unread list it had to cut");
  assert.ok(v.unread.length < 400);
});

test("the arm line fetches the probe, caches it, and runs what it fetched", async () => {
  const src = readFileSync(join(ROOT, "scripts", "gf_probe.js"), "utf8");
  const store = new Map();
  const localStorage = { setItem: (k, v) => store.set(k, String(v)), getItem: k => store.get(k) ?? null };
  const page = faqPage({ chunks: [FAQ_TEXT] });
  const calls = [];
  const fetch = async (u) => { calls.push(u); return { text: async () => src }; };
  const run = (win, fetchImpl, text) =>
    new Function("window", "document", "localStorage", "fetch", "return eval(arguments[4])")(
      win, page.doc, localStorage, fetchImpl, text);

  const out = await run(page.win, fetch, armText());
  assert.match(String(out.armed), /gf probe v\d+ loaded/);
  assert.equal(out.page.kind, "faq");
  assert.deepEqual(calls, [probeUrl("main")]);
  assert.equal(store.get(KEY), src, "the fetched probe is cached for the offline case");

  // The network is preferred over the cache: a stale cache must never win, or a probe fix
  // looks like it did nothing. Serve DIFFERENT bytes and the new ones must be what runs.
  // Padded past the arm line's short-read guard, which treats a tiny body (a 404 page,
  // say) as a failed fetch — that guard is why a 14-byte "404: Not Found" never ran.
  const freshSrc = 'localStorage.setItem("seen","fresh");"fresh probe";' + "//x".repeat(400);
  const sentinel = async () => ({ text: async () => freshSrc });
  const fresh = await run(faqPage({ chunks: [FAQ_TEXT] }).win, sentinel, armText());
  assert.equal(fresh.page, null, "a body that is not the probe reports null, it does not throw");
  assert.equal(store.get("seen"), "fresh", "the freshly fetched source is the one evaluated");
  assert.equal(store.get(KEY), freshSrc, "and it replaces the cache rather than reading it");
  assert.doesNotMatch(String(fresh.armed), /gf probe v\d+ loaded/, "the stale cached probe did not win");

  // …and when the network fails, the cache carries it.
  store.set(KEY, src);
  const offline = async () => { throw new Error("offline"); };
  const back = await run(faqPage({ chunks: [FAQ_TEXT] }).win, offline, armText());
  assert.match(String(back.armed), /gf probe v\d+ loaded/, "falls back to the cached probe");

  // A 404 body is short, not empty: it must be refused as a fetch failure, not evaluated.
  store.set(KEY, src);
  const notFound = async () => ({ text: async () => "404: Not Found" });
  const guarded = await run(faqPage({ chunks: [FAQ_TEXT] }).win, notFound, armText());
  assert.match(String(guarded.armed), /gf probe v\d+ loaded/, "a 404 body never becomes the probe");
  assert.equal(store.get(KEY), src, "and it does not poison the cache");

  assert.ok(armText().length < 700, `arm line is ${armText().length} chars, not a paste`);
  assert.match(probeUrl("research/witcher-3"), /\/refs\/heads\/research\/witcher-3\//,
    "a slashed branch name needs the refs/heads form or raw 404s");
});

test("re-arming the SAME page replaces the installed probe, by both routes", async () => {
  // The probe's second-eval guard is deliberate, so an arm that does not clear window.__gf
  // silently keeps the old object — which is how a probe fix appears to do nothing.
  const page = faqPage({ chunks: [FAQ_TEXT] });
  const store = new Map();
  const localStorage = { setItem: (k, v) => store.set(k, String(v)), getItem: k => store.get(k) ?? null };
  const src = readFileSync(join(ROOT, "scripts", "gf_probe.js"), "utf8");
  const fetch = async () => ({ text: async () => src });

  const runPaste = text => new Function("window", "document", "localStorage", "return eval(arguments[3])")(
    page.win, page.doc, localStorage, text);
  runPaste(pasteText(src));
  const afterPaste = page.win.__gf;
  runPaste(pasteText(src));
  assert.notEqual(page.win.__gf, afterPaste, "the paste clears window.__gf");

  const runArm = text => new Function("window", "document", "localStorage", "fetch", "return eval(arguments[4])")(
    page.win, page.doc, localStorage, fetch, text);
  const before = page.win.__gf;
  const out = await runArm(armText());
  assert.notEqual(page.win.__gf, before, "the arm line clears window.__gf too");
  assert.match(String(out.armed), /gf probe v\d+ loaded/, "and installs, rather than reporting already loaded");
});

test("the probe file is small enough to paste into a page", () => {
  const src = readFileSync(join(ROOT, "scripts", "gf_probe.js"), "utf8");
  // Paste cost, not correctness: the arm line fetches the probe, but the --paste fallback
  // still inlines the whole file on a page that blocks the fetch. Raised from 24,000 when
  // game() landed (2026-09-06); correctness is the tests above.
  assert.ok(src.length < 27000, `probe is ${src.length} chars — the --paste fallback inlines all of it`);
  assert.doesNotMatch(src, /^\s*(const|let|class)\s/m, "no top-level bindings — the REPL must be able to eval it twice");
});
