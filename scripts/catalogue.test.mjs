/**
 * Offline tests for the platform catalogue against the roster: catalogueMatch, catalogueCounts,
 * catalogueFilter and catalogueGenres. They live in the page's data region so the page and the
 * validator run one implementation, and these tests evaluate them straight out of
 * JRPG_Design_Codex.html, over synthetic rows and one real join (Dark Cloud 2).
 *
 *   node --test scripts/catalogue.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { extractScript, extractData } from "./validate_codex.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HTML = readFileSync(join(ROOT, "JRPG_Design_Codex.html"), "utf8");
const NAMES = ["CATALOGUE", "CATALOGUE_PLATFORMS", "BASE_GAMES", "catalogueMatch", "catalogueCounts", "catalogueFilter", "catalogueGenres"];
const { CATALOGUE, CATALOGUE_PLATFORMS, BASE_GAMES, catalogueMatch, catalogueCounts, catalogueFilter, catalogueGenres } =
  new Function(extractData(extractScript(HTML)) + `; return {${NAMES.join(", ")}};`)();

const PLATS = [{ name: "PlayStation 2", wd: "Q10680", label: "PlayStation 2" }, { name: "PSP", wd: "Q170325", label: "PlayStation Portable" }];
const row = (over = {}) => ({ wd: "Q4242", t: "Lantern Vale", y: 1999, plat: ["PlayStation 2"], genre: ["role-playing video game"], dev: ["Lantern Works"], pub: ["Harbor Soft"], wp: "Lantern Vale", ...over });
const ROWS = [
  row(),                                                                                                        // matches a base row by wd
  row({ wd: "Q9", t: "Harbor Quest", y: 2006, plat: ["PlayStation 2", "PSP"], genre: ["tactical role-playing game"], dev: ["Port House"], pub: [] }),
  row({ wd: "Q8", t: "Gone Fishing", y: null, plat: ["PSP"], genre: ["action role-playing game"], dev: [] }),
  row({ wd: "Q7", t: "Lantern Vale", y: 2001, plat: ["PSP"] }),                                                 // titled like the base row, another game
];
const GAMES = [
  { title: "Lantern Vale", wd: "Q4242", status: "Researched" },
  { title: "Harbor Quest", status: "To Research" },                                                              // a custom row: no wd
  { title: "Gone Fishing", status: "Researching" },                                                             // a custom row promoted past the queue
];

test("a roster row matches by wd whatever its title, and a custom game by title, with its queue status read", () => {
  const m = catalogueMatch(ROWS, GAMES);
  assert.deepEqual(m.map(r => [r.wd, r.in, r.queued]), [["Q4242", "Lantern Vale", false], ["Q9", "Harbor Quest", true], ["Q8", "Gone Fishing", false], ["Q7", null, false]]);
  assert.deepEqual(Object.keys(m[0]).slice(0, 8), ["wd", "t", "y", "plat", "genre", "dev", "pub", "wp"], "the row's own fields come through");
  assert.deepEqual(catalogueMatch(undefined, null), []);
});

test("Dark Cloud 2 is found under Wikidata's title \"Dark Chronicle\" — the join is the id, never the title", () => {
  const dc2 = BASE_GAMES.find(g => g.title === "Dark Cloud 2");
  const hit = catalogueMatch(CATALOGUE, BASE_GAMES).find(r => r.wd === dc2.wd);
  assert.equal(hit.t, "Dark Chronicle");
  assert.equal(hit.in, "Dark Cloud 2");
  assert.equal(hit.queued, false);
  assert.ok(catalogueMatch(CATALOGUE, BASE_GAMES).filter(r => r.in).length >= 50, "the roster's consoles are well represented");
});

test("counts run per console and in total: a two-console game counts once for each and once overall", () => {
  const { per, total } = catalogueCounts(catalogueMatch(ROWS, GAMES), PLATS);
  assert.deepEqual(total, { all: 4, in: 2, queued: 1 });
  assert.deepEqual(per, { "PlayStation 2": { all: 2, in: 1, queued: 1 }, PSP: { all: 3, in: 1, queued: 1 } });
  assert.deepEqual(catalogueCounts([], PLATS).total, { all: 0, in: 0, queued: 0 });
});

test("the filter hides what the codex has unless asked, keeps a queued game visible, narrows by console, genre and words, and sorts by year with unknown years last", () => {
  const m = catalogueMatch(ROWS, GAMES);
  assert.deepEqual(catalogueFilter(m, {}).map(r => r.wd), ["Q7", "Q9"], "Lantern Vale and Gone Fishing (in the codex, one of them a promoted custom) hidden, Harbor Quest (queued) shown");
  assert.deepEqual(catalogueFilter(m, { showAll: true }).map(r => r.wd), ["Q4242", "Q7", "Q9", "Q8"], "earliest year first, no year last");
  assert.deepEqual(catalogueFilter(m, { plat: "PSP" }).map(r => r.wd), ["Q7", "Q9"]);
  assert.deepEqual(catalogueFilter(m, { plat: "PlayStation 2" }).map(r => r.wd), ["Q9"]);
  assert.deepEqual(catalogueFilter(m, { genre: "action role-playing game" }), [], "Gone Fishing is in the codex");
  assert.deepEqual(catalogueFilter(m, { genre: "action role-playing game", showAll: true }).map(r => r.wd), ["Q8"]);
  assert.deepEqual(catalogueFilter(m, { q: "port" }).map(r => r.wd), ["Q9"], "a developer's name");
  assert.deepEqual(catalogueFilter(m, { q: "HARBOR" }).map(r => r.wd), ["Q7", "Q9"], "a publisher's name, case aside");
  assert.deepEqual(catalogueFilter(m, { q: "lantern vale", showAll: true }).map(r => r.wd), ["Q4242", "Q7"], "spaces and case fold away");
  assert.deepEqual(catalogueFilter(m, { q: "nowhere" }), []);
});

test("genre chips count labels on the chosen console, most common first then A–Z", () => {
  const m = catalogueMatch(ROWS, GAMES);
  assert.deepEqual(catalogueGenres(m, ""), [["role-playing video game", 2], ["action role-playing game", 1], ["tactical role-playing game", 1]]);
  assert.deepEqual(catalogueGenres(m, "PlayStation 2"), [["role-playing video game", 1], ["tactical role-playing game", 1]]);
  assert.deepEqual(catalogueGenres([], "PSP"), []);
});
