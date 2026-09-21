/**
 * Offline tests for fetch_catalogue.mjs — the Wikidata harvest behind the platform catalogue.
 * Synthetic API answers from scripts/fixtures/wikidata.mjs (search pages, entities with ranked
 * claims, labels), a stand-in fetch routed by action, and a mini codex carrying the catalogue
 * consts and one roster game.
 *
 *   node --test scripts/fetch_catalogue.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { apiJson, retryAfterMs, labelProblems, labelOf, search, subtree, membershipQuery, claimValues, yearsOf, recordOf, toRow,
  sortRows, mergeRows, withoutPlatforms, rosterReport, renderRows, writeCatalogue, readCatalogue, diffRows, harvest, MAX_TEXT, MAX_DEPTH } from "./fetch_catalogue.mjs";
import { Refusal, evalCodex } from "./game_rows.mjs";
import { miniCodex } from "./fixtures/mini_codex.mjs";
import { PLATFORMS, GENRE, SUBTREE, NAMES, game, labelled, statement, searchPage, reply, wiki, catalogueCodex } from "./fixtures/wikidata.mjs";

const NAMES_OF = PLATFORMS.map(p => p.name);
const IDS = new Set(PLATFORMS.map(p => p.wd));
const TREE = new Set(["Q744038", "Q100", "Q101", "Q102"]);
const TODAY = "2026-09-21";
const quiet = { today: TODAY, sleepImpl: async () => {}, pauseMs: 0, canon: s => s };
const net = { fetchImpl: async () => reply({}), sleepImpl: async () => {} };
const row = (over = {}) => ({ wd: "Q4242", t: "Lantern Vale", y: 1999, plat: ["PlayStation 2"], genre: ["role-playing video game"], dev: ["Lantern Works"], pub: ["Harbor Soft"], wp: "Lantern Vale", ...over });
const names = new Map(Object.entries(NAMES));

test("a 429 waits Retry-After, a 5xx backs off, a 404 is not retried, and the rest refuse", async () => {
  const waits = [], sleepImpl = async ms => { waits.push(ms); };
  let n = 0, seen = null;
  const flaky = async url => { seen = url; return ++n === 1 ? reply(null, { status: 429, retryAfter: "3" }) : n === 2 ? reply(null, { status: 502 }) : reply({ ok: 1 }); };
  assert.deepEqual(await apiJson({ action: "x" }, "t", { fetchImpl: flaky, sleepImpl }), { ok: 1 });
  assert.deepEqual(waits, [3000, 4000], "the header's seconds, then the second attempt's backoff");
  assert.equal(new URL(seen).searchParams.has("maxlag"), false, "no maxlag: on Wikidata it defers to the query service's lag too");
  let calls = 0;
  await assert.rejects(apiJson({ action: "x" }, "t", { fetchImpl: async () => { calls++; return reply(null, { status: 503 }); }, sleepImpl, delays: [1, 1] }), /HTTP 503 for t/);
  assert.equal(calls, 3, "one try per delay, then the verdict");
  calls = 0;
  await assert.rejects(apiJson({ action: "x" }, "t", { fetchImpl: async () => { calls++; return reply(null, { status: 404 }); }, sleepImpl }), /HTTP 404/);
  assert.equal(calls, 1);
  await assert.rejects(apiJson({ action: "x" }, "t", { fetchImpl: async () => reply(null, { text: "<html>502" }), sleepImpl }), /something other than JSON/);
  await assert.rejects(apiJson({ action: "x" }, "t", { fetchImpl: async () => reply({ error: { code: "badvalue", info: "no" } }), sleepImpl }), /refused t: badvalue — no/);
});

test("Retry-After reads seconds or a date, capped, and anything else is no instruction", () => {
  assert.equal(retryAfterMs("3"), 3000);
  assert.equal(retryAfterMs("120"), 60000);
  assert.equal(retryAfterMs(new Date(Date.now() + 5000).toUTCString()) <= 5000, true);
  assert.equal(retryAfterMs("soon"), null);
  assert.equal(retryAfterMs(null), null);
});

test("platform ids must carry the page's label, in the English or the multilingual slot", () => {
  const body = { entities: Object.fromEntries(PLATFORMS.map(p => [p.wd, labelled(p.wd, p.label)])) };
  assert.deepEqual(labelProblems(PLATFORMS, body), []);
  const mul = { entities: { ...body.entities, Q10680: labelled("Q10680", "PlayStation 2", "mul") } };
  assert.deepEqual(labelProblems(PLATFORMS, mul), [], "a mul-only label is the label");
  const wrong = { entities: { ...body.entities, Q10680: labelled("Q10680", "PlayStation Two") } };
  assert.match(labelProblems(PLATFORMS, wrong)[0], /Q10680 \(PlayStation 2\): Wikidata labels it "PlayStation Two", the page says "PlayStation 2"/);
  const gone = { entities: { ...body.entities, Q170325: { id: "Q170325", missing: "" } } };
  assert.match(labelProblems(PLATFORMS, gone)[0], /Q170325 \(PSP\): no such Wikidata item/);
  assert.match(labelProblems(PLATFORMS, { error: "x" })[0], /without an entities map/);
  assert.equal(labelOf(labelled("Q1", null)), null);
});

test("a search is paged to the end and deduped, and pages that do not add up to the hit count refuse", async () => {
  const ids = Array.from({ length: 120 }, (_, i) => `Q${i + 1}`);
  const log = [];
  const got = await search("haswbstatement:P400=Q10680", { fetchImpl: wiki({ members: { Q10680: ids }, games: [], pageSize: 50, log }), sleepImpl: async () => {} }, { pauseMs: 0 });
  assert.deepEqual(got, ids);
  assert.deepEqual(log.map(l => l.sroffset), ["0", "50", "100"], "three pages of fifty");
  const shifted = async url => { const o = Number(new URL(url).searchParams.get("sroffset") || 0); return reply(searchPage(o ? ["Q1", "Q3"] : ["Q1", "Q2"], 4, o ? null : 2)); };
  await assert.rejects(search("haswbstatement:P400=Q10680", { fetchImpl: shifted, sleepImpl: async () => {} }, { pauseMs: 0 }), /3 distinct ids over the pages, 4 hits reported/);
  const stalled = async () => reply(searchPage([], 4, 2));
  await assert.rejects(search("haswbstatement:P400=Q10680", { fetchImpl: stalled, sleepImpl: async () => {} }, { pauseMs: 0 }), /a page came back empty with more promised/);
  await assert.rejects(search("x", { fetchImpl: async () => reply({ batchcomplete: "" }), sleepImpl: async () => {} }, { pauseMs: 0 }), /without a search list/);
});

test("the genre subtree is walked breadth-first through P279, sorted, with a cycle stopped and a runaway refused", async () => {
  const tree = await subtree(GENRE, { fetchImpl: wiki({ games: [] }), sleepImpl: async () => {} }, { pauseMs: 0 });
  assert.deepEqual(tree, ["Q100", "Q101", "Q102", "Q744038"]);
  const chain = {};
  for (let i = 0; i <= MAX_DEPTH; i++) chain[i ? `Q${i}` : GENRE] = [`Q${i + 1}`];
  await assert.rejects(subtree(GENRE, { fetchImpl: wiki({ games: [], subtree: chain }), sleepImpl: async () => {} }, { pauseMs: 0 }), /deeper than/);
  assert.equal(membershipQuery("Q10680", ["Q1", "Q2"]), "haswbstatement:P31=Q7889 haswbstatement:P400=Q10680 haswbstatement:P136=Q1|P136=Q2");
});

test("claims are read with deprecated statements skipped, years by precision, and an entity becomes a record or a reason to leave it out", () => {
  const g = game({ years: ["+2001-07-19T00:00:00Z", "+1999-03-01T00:00:00Z", "+1990-01-01T00:00:00Z"], plats: ["Q10680", "Q170325", "Q8079"], genres: ["Q744038", "Q100", "Q5"], deprecated: ["+1990-01-01T00:00:00Z", "Q170325"] });
  assert.deepEqual(claimValues(g, "P400").map(v => v.id), ["Q10680", "Q8079"]);
  assert.deepEqual(yearsOf(claimValues(g, "P577")), [2001, 1999]);
  assert.deepEqual(yearsOf([{ time: "+1999-00-00T00:00:00Z", precision: 8 }, { time: "-0044-03-15T00:00:00Z", precision: 11 }]), [-44], "a decade is not a year; an ancient date still parses");
  assert.deepEqual(recordOf("Q4242", g, IDS, TREE), { wd: "Q4242", t: "Lantern Vale", wp: "Lantern Vale", y: 1999, plat: ["Q10680"], genre: ["Q744038", "Q100"], dev: ["Q900"], pub: ["Q901"] });
  assert.deepEqual(recordOf("Q1", game({ enwiki: null }), IDS, TREE), { wd: "Q1", skip: "no English Wikipedia article" });
  assert.deepEqual(recordOf("Q1", game({ plats: ["Q8079"] }), IDS, TREE).skip, "no live claim for a catalogued console");
  assert.deepEqual(recordOf("Q1", game({ deprecated: ["Q10680"] }), IDS, TREE).skip, "no live claim for a catalogued console");
  assert.deepEqual(recordOf("Q1", game({ genres: ["Q5"] }), IDS, TREE).skip, "no live claim for a genre in the subtree");
  assert.equal(recordOf("Q1", game({ label: "Lantern Vale", mul: true }), IDS, TREE).t, "Lantern Vale", "a mul label is the title");
  assert.equal(recordOf("Q1", game({ label: null, enwiki: "Lantern Vale (video game)" }), IDS, TREE).t, "Lantern Vale (video game)", "no label at all: the article's title");
  assert.equal(recordOf("Q1", game({ years: [] }), IDS, TREE).y, null);
});

test("a record with its ids named becomes a row: consoles in page order, names sorted, deduped and capped, the unnamed reported", () => {
  const rec = { wd: "Q4242", t: "Lantern Vale", wp: "Lantern Vale", y: 1999, plat: ["Q170325", "Q10680"], genre: ["Q100", "Q744038"], dev: ["Q902", "Q900", "Q900", "Q77"], pub: ["Q901"] };
  const r = toRow(rec, names, PLATFORMS);
  assert.deepEqual(r.row, row({ plat: ["PlayStation 2", "PSP"], genre: ["action role-playing game", "role-playing video game"], dev: ["Lantern Works", "Port House"] }));
  assert.deepEqual(r.unnamed, ["Q77"]);
  const many = new Map([...names, ...["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"].map(id => [id, `Studio ${id}`])]);
  assert.equal(toRow({ ...rec, dev: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"] }, many, PLATFORMS).row.dev.length, 5);
  assert.match(toRow({ ...rec, y: 1979 }, names, PLATFORMS).problem, /year 1979 is outside 1980–2035/);
  assert.match(toRow({ ...rec, y: 2036 }, names, PLATFORMS).problem, /year 2036 is outside/);
  assert.match(toRow({ ...rec, genre: ["Q77"] }, names, PLATFORMS).problem, /none of its genres has a label/);
  assert.match(toRow({ ...rec, wp: "x".repeat(MAX_TEXT + 1) }, names, PLATFORMS).problem, /is 121 chars — longer than 120/);
  assert.equal(toRow({ ...rec, wp: "x".repeat(MAX_TEXT) }, names, PLATFORMS).problem, undefined, "120 is the cap, not over it");
});

test("rows from two harvests fold to one game: plat in CATALOGUE_PLATFORMS order, the earliest year, the union of labels", () => {
  const psp = row({ plat: ["PSP"], y: 2006, genre: ["tactical role-playing game"], dev: ["Port House"] });
  const [merged] = mergeRows([[psp], [row({ y: 2004 })]], NAMES_OF);
  assert.deepEqual(merged, row({ plat: ["PlayStation 2", "PSP"], y: 2004, genre: ["role-playing video game", "tactical role-playing game"], dev: ["Lantern Works", "Port House"] }));
  assert.equal(mergeRows([[row({ y: null })], [row({ y: 2001 })]], NAMES_OF)[0].y, 2001, "an unknown year yields to a known one");
  assert.deepEqual(withoutPlatforms([row({ plat: ["PlayStation 2", "PSP"] }), row({ wd: "Q9", plat: ["PSP"] })], ["PSP"]), [row()], "a row left with no console goes");
});

test("the block runs by title then id in code-point order, and empty dev/pub are left out", () => {
  const rows = [row({ wd: "Q3", t: "b" }), row({ wd: "Q2", t: "a" }), row({ wd: "Q1", t: "B" }), row({ wd: "Q4", t: "a" })];
  assert.deepEqual(sortRows(rows).map(r => r.wd), ["Q1", "Q2", "Q4", "Q3"]);
  assert.equal(renderRows([row({ dev: [], pub: [] })]), `{wd:"Q4242",t:"Lantern Vale",y:1999,plat:["PlayStation 2"],genre:["role-playing video game"],wp:"Lantern Vale"}`);
});

test("writing the block replaces exactly it and the meta line, and the page reads back; a page without the block refuses", () => {
  const rows = [row(), row({ wd: "Q9", t: "Harbor Quest", wp: "Harbor Quest", plat: ["PSP"] })];
  const next = writeCatalogue(catalogueCodex(), rows, { source: "wikidata", genre: GENRE, at: TODAY });
  const back = readCatalogue(next);
  assert.deepEqual(back.CATALOGUE, sortRows(rows));
  assert.deepEqual(back.CATALOGUE_META, { source: "wikidata", genre: GENRE, at: TODAY });
  assert.deepEqual(back.CATALOGUE_PLATFORMS, PLATFORMS, "the platform list is the page's, untouched");
  assert.deepEqual(evalCodex(next).BASE_GAMES.map(g => g.title), ["Lantern Vale", "Harbor Town"], "the roster is untouched");
  assert.throws(() => writeCatalogue(miniCodex(), rows, { source: "wikidata", genre: GENRE, at: TODAY }), /exactly one `const CATALOGUE = \[` block, found 0/);
  assert.throws(() => readCatalogue(miniCodex()), Refusal);
});

test("the roster guard finds a game by wd through the platform fold and reports the one Wikidata lacks", () => {
  const games = evalCodex(catalogueCodex()).BASE_GAMES;
  const r = rosterReport([row()], games, ["PlayStation 2"], s => s);
  assert.deepEqual([r.expected.map(g => g.title), r.found.map(g => g.title), r.missing, r.folded.map(g => g.title)], [["Lantern Vale"], ["Lantern Vale"], [], ["Lantern Vale"]]);
  assert.deepEqual(rosterReport([row()], games, ["PlayStation 2"], () => "").folded, [], "a fold that answers nothing folds nothing");
  assert.deepEqual(rosterReport([row({ wd: "Q1" })], games, ["PlayStation 2"], s => s).missing.map(g => g.title), ["Lantern Vale"]);
  assert.deepEqual(rosterReport([row()], games, ["PSP"], s => s).expected, [], "a game on no catalogued console is not expected");
  const famicom = [{ title: "Old Tale", wd: "Q77", infobox: { plat: ["Super Famicom"], at: TODAY } }];
  assert.equal(rosterReport([], famicom, ["SNES"], s => (s === "Super Famicom" ? "SNES" : s)).expected.length, 1, "the fold reaches the console");
});

test("a harvest verifies the labels, walks the subtree, searches each console, reads each game once, writes the block, and a re-run writes nothing", async () => {
  const games = [
    game(),                                                                                               // PS2 only, on the roster
    game({ wd: "Q9", label: "Harbor Quest", enwiki: "Harbor Quest", years: ["+2006-01-01T00:00:00Z"], plats: ["Q170325", "Q10680"], genres: ["Q101"], devs: ["Q902"], pubs: [] }),
    game({ wd: "Q8", label: "Unseen", enwiki: null, plats: ["Q170325"] }),                                // no English article: left out
    game({ wd: "Q7", label: "Old Port", enwiki: "Old Port", plats: ["Q170325"], genres: ["Q5"] }),         // the index lists it, the live claim is outside the tree
  ];
  const log = [];
  const r = await harvest(catalogueCodex(), { ...quiet, fetchImpl: wiki({ games, log }) });
  assert.equal(r.changed, true);
  const actions = log.map(l => l.action + (l.list ? ":" + l.list : "") + (l.props ? ":" + l.props : ""));
  assert.deepEqual(actions.slice(0, 1), ["wbgetentities:labels"], "labels first");
  assert.equal(log.filter(l => l.srsearch && l.srsearch.startsWith("haswbstatement:P279=")).length, 4, "one P279 search per subtree item");
  assert.equal(log.filter(l => l.srsearch && l.srsearch.includes("P400=")).length, 2, "one membership search per console");
  const entityCalls = log.filter(l => l.props && l.props.includes("claims"));
  assert.deepEqual(entityCalls.map(l => l.ids.split("|").sort()), [["Q4242", "Q7", "Q8", "Q9"]], "every listed game once, in one batch");
  assert.ok(log.every(l => /jrpg-design-codex/.test(l.ua)), "every request names itself");
  assert.deepEqual(r.rows, [
    row({ wd: "Q9", t: "Harbor Quest", wp: "Harbor Quest", y: 2006, plat: ["PlayStation 2", "PSP"], genre: ["tactical role-playing game"], dev: ["Port House"], pub: [] }),
    row(),
  ]);
  assert.deepEqual(r.counts, { "PlayStation 2": { all: 2, in: 1 }, PSP: { all: 1, in: 0 } });
  assert.deepEqual(r.report.found.map(g => g.title), ["Lantern Vale"]);
  assert.deepEqual(r.leftOut, { "no English Wikipedia article": 1, "no live claim for a genre in the subtree": 1 });
  assert.deepEqual(readCatalogue(r.html).CATALOGUE.map(x => x.wd), ["Q9", "Q4242"]);
  assert.equal(readCatalogue(r.html).CATALOGUE_META.at, TODAY);
  assert.match(r.html, /\nconst CATALOGUE = \[\n\{wd:"Q9",t:"Harbor Quest",y:2006,plat:\["PlayStation 2","PSP"\],genre:\["tactical role-playing game"\],dev:\["Port House"\],wp:"Harbor Quest"\},\n\{wd:"Q4242"/);

  const again = await harvest(r.html, { ...quiet, today: "2026-09-28", fetchImpl: wiki({ games }) });
  assert.equal(again.changed, false, "only the date differs");
  assert.equal(again.html, r.html);
});

test("--only re-harvests those consoles and keeps every other console's rows, and a row never carries a console outside the harvest", async () => {
  const both = game({ wd: "Q9", label: "Harbor Quest", enwiki: "Harbor Quest", plats: ["Q10680", "Q170325"] });
  const first = await harvest(catalogueCodex(), { ...quiet, fetchImpl: wiki({ games: [game(), both, game({ wd: "Q8", label: "Gone", enwiki: "Gone", plats: ["Q170325"] })] }) });
  assert.deepEqual(readCatalogue(first.html).CATALOGUE.map(x => [x.wd, x.plat]), [["Q8", ["PSP"]], ["Q9", ["PlayStation 2", "PSP"]], ["Q4242", ["PlayStation 2"]]]);
  const psp = await harvest(first.html, { ...quiet, only: ["PSP"], fetchImpl: wiki({ games: [game(), game({ wd: "Q9", label: "Harbor Quest", enwiki: "Harbor Quest", plats: ["Q10680"] }), game({ wd: "Q10", label: "New", enwiki: "New", plats: ["Q170325"] })] }) });
  assert.deepEqual(readCatalogue(psp.html).CATALOGUE.map(x => [x.wd, x.plat]), [["Q9", ["PlayStation 2"]], ["Q4242", ["PlayStation 2"]], ["Q10", ["PSP"]]],
    "the PS2 rows stay as they were, Harbor Quest loses only its PSP, Gone goes, New arrives");
  const ps2only = await harvest(catalogueCodex(), { ...quiet, only: ["PlayStation 2"], fetchImpl: wiki({ games: [game(), both] }) });
  assert.deepEqual(ps2only.rows.map(x => [x.wd, x.plat]), [["Q9", ["PlayStation 2"]], ["Q4242", ["PlayStation 2"]]], "PSP was not harvested, so the row does not claim it");
  await assert.rejects(harvest(first.html, { ...quiet, only: ["Lantern Box"], fetchImpl: wiki({}) }), /--only "Lantern Box": CATALOGUE_PLATFORMS lists no such platform/);
});

test("a label mismatch, a refused game, an answer with no roster game in it, or a bad date writes nothing", async () => {
  await assert.rejects(harvest(catalogueCodex(), { ...quiet, fetchImpl: wiki({ labels: { Q10680: "PlayStation Two" } }) }), /platform ids do not match their labels/);
  await assert.rejects(harvest(catalogueCodex(), { ...quiet, fetchImpl: wiki({ games: [game(), game({ wd: "Q9", label: "Early", enwiki: "Early", years: ["+1979-01-01T00:00:00Z"] })] }) }), /1 game\(s\) refused; nothing written:\n  Early \(Q9\): year 1979/);
  await assert.rejects(harvest(catalogueCodex(), { ...quiet, fetchImpl: wiki({ games: [game({ wd: "Q9", label: "Other", enwiki: "Other" })] }) }), /none of the 1 roster games on these consoles came back/);
  await assert.rejects(harvest(catalogueCodex(), { ...quiet, canon: () => "", fetchImpl: wiki({}) }), /no roster game folds onto any catalogued console/, "a fold that answers nothing is a broken guard, not a clean roster");
  const psp = await harvest(catalogueCodex(), { ...quiet, only: ["PSP"], fetchImpl: wiki({ games: [game(), game({ wd: "Q9", label: "Harbor Quest", enwiki: "Harbor Quest", plats: ["Q170325"] })] }) });
  assert.deepEqual([psp.report.expected, psp.report.folded.map(g => g.title)], [[], ["Lantern Vale"]], "no roster game on PSP is fine while the fold still reaches PS2");
  await assert.rejects(harvest(catalogueCodex(), { ...quiet, fetchImpl: wiki({ members: { Q10680: ["Q4242", "Q404"] } }) }), /no item Q404, which its own search just listed/);
  await assert.rejects(harvest(catalogueCodex(), { ...quiet, today: "21/09/2026", fetchImpl: wiki({}) }), /today must be YYYY-MM-DD/);
});

test("the diff names added, removed and changed rows by wd", () => {
  const d = diffRows([row(), row({ wd: "Q9", t: "Gone" })], [row({ y: 2000 }), row({ wd: "Q10", t: "New" })]);
  assert.deepEqual([d.added.map(r => r.wd), d.removed.map(r => r.wd), d.changed.map(r => r.wd)], [["Q10"], ["Q9"], ["Q4242"]]);
});
