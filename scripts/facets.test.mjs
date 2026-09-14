/**
 * Offline tests for the Games-tab facets: the vocabulary fold, the query grammar and the matcher.
 * They live in the page's data region so the page and the validator run one implementation, and
 * these tests evaluate them straight out of JRPG_Design_Codex.html.
 *
 *   node --test scripts/facets.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { extractScript, extractData, validate } from "./validate_codex.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HTML = readFileSync(join(ROOT, "JRPG_Design_Codex.html"), "utf8");
const NAMES = ["BASE_GAMES", "BASE_MECHS", "MINIGAMES", "facetLookup", "canonFacet", "facetsOf", "parseGameQuery", "parseQuery", "withFacet", "withoutFacet", "buildGameQuery", "matchesFacets",
  "MECH_QUERY_KEYS", "MG_QUERY_KEYS", "matchesRowQuery", "exactTitlesOf", "relatedGames", "relatedScore"];
const { BASE_GAMES, BASE_MECHS, MINIGAMES, facetLookup, canonFacet, facetsOf, parseGameQuery, parseQuery, withFacet, withoutFacet, buildGameQuery, matchesFacets,
  MECH_QUERY_KEYS, MG_QUERY_KEYS, matchesRowQuery, exactTitlesOf, relatedGames, relatedScore } =
  new Function(extractData(extractScript(HTML)) + `; return {${NAMES.join(", ")}};`)();

const game = title => {
  const g = BASE_GAMES.find(x => x.title === title);
  assert.ok(g, `roster has ${title}`);
  return g;
};
const values = (g, k) => [...facetsOf(g)[k]];
const matches = (g, q) => matchesFacets(g, parseGameQuery(q).facets);

test("a query's key:value and key:\"two words\" tokens are facets, the rest is text", () => {
  assert.deepEqual(parseGameQuery('platform:PC genre:"Action RPG" ys'),
    { text: "ys", facets: [{ k: "platform", v: "PC" }, { k: "genre", v: "Action RPG" }] });
  assert.deepEqual(parseGameQuery("plat:SNES developer:Square publisher:Enix franchise:Mana year:1990s").facets.map(f => f.k),
    ["platform", "dev", "pub", "series", "year"]);
});

test("a colon that is not a facet stays text", () => {
  for (const q of ["Metaphor: ReFantazio", "ys viii:lacrimosa", "platform:", 'genre:"Action RPG']) {
    const p = parseGameQuery(q);
    assert.deepEqual(p.facets, [], q);
    assert.equal(p.text, q, q);
  }
});

test("one facet spelled two ways is one facet", () => {
  assert.deepEqual(parseGameQuery("genre:RPG genre:role-playing dev:Squaresoft dev:SquareSoft").facets,
    [{ k: "genre", v: "RPG" }, { k: "dev", v: "Squaresoft" }]);
});

test("every spelling folds to the canonical one; case, spacing and punctuation never need an entry", () => {
  const cases = [
    ["genre", "Role-Playing", "RPG"], ["genre", "role playing", "RPG"], ["genre", "Japanese-Style", "JRPG"],
    ["genre", "Tactics", "Tactical RPG"], ["genre", "Action Adventure", "Action-Adventure"],
    ["platform", "Super Nintendo", "SNES"], ["platform", "snes", "SNES"], ["platform", "pc", "PC"],
    ["dev", "SquareSoft", "Square"], ["dev", "Squaresoft", "Square"], ["pub", "Square EA", "Square Electronic Arts"],
    ["dev", "From Software", "FromSoftware"], ["series", "Dragon Quest / Warrior", "Dragon Quest"],
  ];
  for (const [k, raw, want] of cases) assert.equal(canonFacet(k, raw), want, `${k} ${raw}`);
});

test("a trailing release qualifier is dropped, an unlisted studio stands as itself, junk folds to nothing", () => {
  assert.equal(canonFacet("dev", "Chunsoft (SFC)"), "Chunsoft");
  assert.equal(canonFacet("dev", "  Radical   Fish Games "), "Radical Fish Games");
  assert.equal(canonFacet("dev", "—"), "");
  assert.equal(canonFacet("dev", ""), "");
  assert.equal(facetLookup("dev", "Squaresoft").via, "SquareSoft");
  assert.equal(facetLookup("platform", "PC").via, "PC");
  assert.equal(facetLookup("dev", "Radical Fish Games").via, null);
});

test("a harvested game's facets fold GameFAQs and Wikipedia together, GameFAQs' first", () => {
  const cc = game("CrossCode"), ct = game("Chrono Trigger");
  assert.deepEqual(values(cc, "platform"), ["PC", "Linux", "macOS", "Nintendo Switch", "PlayStation 4", "Xbox One", "Xbox Series X/S", "PlayStation 5"]);
  assert.deepEqual(values(cc, "genre"), ["RPG", "Action RPG"], "Wikipedia's Action role-playing folds into GameFAQs' label");
  assert.deepEqual(values(cc, "pub"), ["Deck13"], "GameFAQs' Deck 13 and Wikipedia's Deck13 are one publisher");
  assert.deepEqual(values(cc, "year"), ["2018", "2010s"]);
  assert.deepEqual(values(ct, "platform").slice(0, 2), ["SNES", "PlayStation"]);
  assert.ok(values(ct, "platform").includes("PC"), "Wikipedia's Windows is PC");
  assert.deepEqual(values(ct, "genre"), ["RPG", "JRPG", "Turn-Based"], "Wikipedia's turn-based RPG category widens the GameFAQs genre");
  assert.deepEqual(values(ct, "dev"), ["Square"]);
  assert.deepEqual(values(ct, "composer"), ["Yasunori Mitsuda", "Nobuo Uematsu", "Noriko Matsueda"]);
});

test("a card's summary reads only the primary sources", () => {
  const primary = (g, k) => [...facetsOf(g, s => s.from !== "wp")[k]];
  assert.deepEqual(primary(game("CrossCode"), "platform"), ["PC"]);
  assert.deepEqual(primary(game("Chrono Trigger"), "composer"), []);
});

test("an infobox's credits and engine are facets, qualifiers dropped, and one spelling is one value", () => {
  const g = { title: "Lantern Vale", year: 2001, dev: "d", status: "Researched",
    gf: { plat: "PC", genre: ["Role-Playing"], dev: "Lantern Works", pub: "XSEED Games" },
    infobox: { plat: ["Windows", "Linux"], genre: ["hack and slash"], dev: ["LANTERN works", "Harbor Soft"], pub: ["Xseed Games", "Harbor Soft (JP)"],
      series: ["Lantern"], comp: ["Mira Tone (Remaster)"], engine: ["Unity (HD)"], at: "2026-09-13" } };
  assert.deepEqual(values(g, "platform"), ["PC", "Linux"]);
  assert.deepEqual(values(g, "genre"), ["RPG", "Hack and Slash"]);
  assert.deepEqual(values(g, "dev"), ["Lantern Works", "Harbor Soft"]);
  assert.deepEqual(values(g, "pub"), ["XSEED Games", "Harbor Soft"]);
  assert.deepEqual(values(g, "series"), ["Lantern"]);
  assert.deepEqual(values(g, "composer"), ["Mira Tone"]);
  assert.deepEqual(values(g, "engine"), ["Unity"]);
  assert.ok(matches(g, 'composer:"mira tone" engine:unity platform:linux'));
  assert.ok(!matches(g, "platform:macOS"));
});

test("a custom game with no GameFAQs details falls back to its own row, co-developers split", () => {
  const mine = { title: "Mine", year: "1998", dev: "Ape / HAL Laboratory", status: "To Research" };
  assert.deepEqual(values(mine, "dev"), ["Ape", "HAL Laboratory"]);
  assert.deepEqual(values(mine, "year"), ["1998", "1990s"]);
  assert.deepEqual(values(mine, "status"), ["To Research"]);
  assert.deepEqual(values(mine, "platform"), []);
  assert.deepEqual(values({ title: "Queued", year: "—", dev: "—", status: "To Research" }, "year"), []);
  assert.deepEqual(values({ title: "Queued", year: "—", dev: "—", status: "To Research" }, "dev"), []);
});

test("a facet matches its games and not their neighbours, and facets AND together", () => {
  const cc = game("CrossCode"), ct = game("Chrono Trigger"), terra = game("Terranigma"), eb = game("EarthBound");
  assert.ok(matches(cc, "platform:PC"));
  assert.ok(!matches(game("Final Fantasy X"), "platform:PC"), "Final Fantasy X is on PlayStation 2 alone");
  assert.ok(matches(ct, 'composer:"Nobuo Uematsu"') && matches(game("Final Fantasy X"), "music:\"nobuo uematsu\""));
  assert.ok(!matches(cc, 'composer:"Nobuo Uematsu"'));
  assert.ok(matches(cc, "genre:RPG") && matches(ct, "genre:RPG"));
  assert.ok(matches(ct, "genre:JRPG") && !matches(cc, "genre:JRPG"));
  assert.ok(matches(ct, "platform:SNES year:1995") && matches(terra, "platform:SNES year:1995"));
  assert.ok(!matches(eb, "platform:SNES year:1995"), "EarthBound is SNES but 1994");
  assert.ok(matches(eb, "platform:snes year:1990s"));
  assert.ok(!matches(ct, "platform:Nonexistent"));
  assert.ok(matches(ct, ""));
});

test("every spelling of a studio lands in ONE filter", () => {
  const square = /^(SquareSoft|Squaresoft|Square)( \(.*\))?$/;
  const raw = BASE_GAMES.filter(g => [g.gf?.dev, ...(g.infobox?.dev ?? [])].some(d => square.test(d ?? "")));
  assert.ok(raw.length > 1, "the roster still has Square games");
  assert.equal(BASE_GAMES.filter(g => matches(g, "dev:Square")).length, raw.length);
  assert.equal(BASE_GAMES.filter(g => matches(g, "dev:squaresoft")).length, raw.length);
});

test("a Wikipedia category is a facet only when CATEGORY_FACETS names it, and may widen a genre", () => {
  const g = { title: "Lantern Vale", year: 1999, dev: "d", status: "Researched", wp: "Lantern Vale",
    gf: { plat: "PlayStation", genre: ["Role-Playing"] },
    wpcats: ["1999 video games", "Japan Game Award winners", "Single-player video games", "Turn-based role-playing video games",
      "Video games about time travel", "Science fantasy role-playing video games", "Science fantasy video games"] };
  assert.deepEqual(values(g, "theme"), ["Time travel", "Science fantasy"], "two categories naming one theme are one value");
  assert.deepEqual(values(g, "genre"), ["RPG", "Turn-Based"]);
  assert.deepEqual(values(g, "award"), ["Japan Game Award"]);
  assert.deepEqual(values(g, "feature"), [], "an unmapped category is not a facet");
  assert.ok(matches(g, 'theme:"time travel" award:"japan game award" genre:turn-based'));
  assert.ok(!matches(g, "theme:dragons"));
  assert.deepEqual([...facetsOf(g, s => s.from !== "wp").theme], [], "a card's summary never reads categories");
  assert.deepEqual(values({ ...g, wpcats: undefined }, "theme"), []);
});

test("the roster's categories land where the table puts them", () => {
  const ct = game("Chrono Trigger");
  assert.ok(values(ct, "theme").includes("Time travel"));
  assert.ok(values(ct, "feature").includes("Silent protagonist"));
  assert.ok(values(game("Elden Ring"), "award").includes("The Game Awards Game of the Year"));
  assert.ok(matches(game("Persona 5 Royal"), 'theme:tokyo genre:"social sim"'));
  assert.ok(!matches(game("CrossCode"), "genre:turn-based"));
});

test("adding a facet narrows, adding it again is a no-op, removing it keeps the rest", () => {
  assert.equal(withFacet("platform:PC ys", "year", "1998"), "platform:PC year:1998 ys");
  assert.equal(withFacet("platform:PC ys", "platform", "pc"), "platform:PC ys");
  assert.equal(withFacet("", "genre", "Action RPG"), 'genre:"Action RPG"');
  assert.equal(withoutFacet("genre:role-playing platform:PC ys", "genre", "RPG"), "platform:PC ys");
  const q = 'series:"Dragon Quest" plat:SNES old save';
  assert.deepEqual(parseGameQuery(buildGameQuery(parseGameQuery(q))), parseGameQuery(q));
});

test("the validator folds the real roster through the page's vocabulary without complaint", () => {
  const { errors } = validate(HTML, {});
  assert.deepEqual(errors.filter(e => /FACET_VOCAB|facet/i.test(e)), []);
});

// ---------------------------------------------------------------- the Mechanics and Minigames searches

const gameRow = title => BASE_GAMES.find(x => x.title === title) || null;
const EXACT_TITLES = exactTitlesOf(BASE_GAMES);
const rowMatches = (row, title, q, keys) => matchesRowQuery(row, title, gameRow(title), parseQuery(q, keys).facets, EXACT_TITLES);
const mechsFor = q => BASE_MECHS.filter(m => rowMatches(m, m.game, q, MECH_QUERY_KEYS));
const minisFor = q => MINIGAMES.filter(m => rowMatches(m, m.g, q, MG_QUERY_KEYS));

test("the row searches take the Games grammar plus their own keys, and only their own", () => {
  assert.deepEqual(parseQuery('cat:traversal platform:SNES verb:"a second" ys', MECH_QUERY_KEYS),
    { text: "ys", facets: [{ k: "cat", v: "traversal" }, { k: "platform", v: "SNES" }, { k: "verb", v: "a second" }] });
  assert.deepEqual(parseQuery("table:no cat:traversal", MG_QUERY_KEYS),
    { text: "cat:traversal", facets: [{ k: "table", v: "no" }] }, "cat is not a minigame key");
  assert.deepEqual(parseGameQuery("cat:traversal table:no").facets, [], "the Games grammar is unchanged");
  assert.deepEqual(parseQuery("constructor:x toString:y", MECH_QUERY_KEYS).facets, [], "an inherited property is not a key");
  assert.equal(withoutFacet("cat:traversal want:yes ys", "cat", "Traversal", MECH_QUERY_KEYS), "want:yes ys");
  assert.equal(withFacet("ys", "table", "no", MG_QUERY_KEYS), "table:no ys");
});

test("a game key answers through the row's game, and a row whose game is off the roster fails it", () => {
  const snesTitles = new Set(BASE_GAMES.filter(g => matches(g, "platform:SNES")).map(g => g.title));
  const expected = BASE_MECHS.filter(m => snesTitles.has(m.game)).map(m => m.id);
  assert.ok(expected.length > 0, "the roster still has SNES games with mechanics");
  assert.deepEqual(mechsFor("platform:SNES").map(m => m.id), expected);
  const g001 = MINIGAMES.find(m => m.id === "g001");
  assert.equal(gameRow(g001.g), null, "g001's game is not on the roster");
  assert.ok(!rowMatches(g001, g001.g, 'series:"Final Fantasy"', MG_QUERY_KEYS));
  // Its own keys still answer. Each fixture sets the table state it asks about, so the rule does not
  // depend on whether g001 happens to carry a reward table today (it gained one on 2026-09-14).
  const bare = { ...g001, rt: undefined }, tabled = { ...g001, rt: [{ at: "a finish", get: "a prize" }] };
  assert.ok(rowMatches(bare, bare.g, "table:no id:g001", MG_QUERY_KEYS), "its own keys still answer: no table");
  assert.ok(!rowMatches(bare, bare.g, "table:yes id:g001", MG_QUERY_KEYS), "a row with no table is not tabled");
  assert.ok(rowMatches(tabled, tabled.g, "table:yes id:g001", MG_QUERY_KEYS), "its own keys still answer: a table");
});

test("a row's own keys: category and verb by prefix, game by whole words, id exactly, want and table", () => {
  assert.deepEqual([...new Set(mechsFor("cat:exploration").map(m => m.cat))], ["Exploration & Rewards"]);
  assert.equal(mechsFor("cat:exploration").length, BASE_MECHS.filter(m => m.cat === "Exploration & Rewards").length);
  const mastery = BASE_MECHS.filter(m => (m.verbs || []).includes("Mastery reveal")).map(m => m.id);
  assert.ok(mastery.length > 0);
  assert.deepEqual(mechsFor("verb:mastery").map(m => m.id), mastery);
  const titles = q => [...new Set(mechsFor(q).map(m => m.game))].sort();
  assert.deepEqual(titles('game:"Final Fantasy X"'), ["Final Fantasy X"], "X is not XII");
  assert.deepEqual(titles("game:persona"), ["Persona 4", "Persona 5 Royal"]);
  assert.deepEqual(mechsFor("id:m001").map(m => m.id), ["M001"]);
  assert.equal(mechsFor("want:yes").length, BASE_MECHS.filter(m => m.want === "Yes").length);
  assert.equal(mechsFor("want:undecided").length, BASE_MECHS.filter(m => !m.want).length);
  assert.ok(mechsFor("want:undecided").length > 0);
  assert.equal(minisFor("table:no").length, MINIGAMES.filter(m => !m.rt).length);
  assert.equal(minisFor("table:yes").length + minisFor("table:no").length, MINIGAMES.length);
  assert.deepEqual(parseQuery("table:yes", MECH_QUERY_KEYS), { text: "table:yes", facets: [] }, "table is a minigame key; on Mechanics it is plain text");
});

test("a game key naming a roster title exactly lists only that game, and a partial name still matches by whole words", () => {
  const titlesFor = q => [...new Set(mechsFor(q).map(m => m.game))].sort();
  assert.deepEqual(titlesFor('game:"Xenoblade Chronicles"'), ["Xenoblade Chronicles"], "not Xenoblade Chronicles 3");
  assert.deepEqual(titlesFor('game:"xenoblade  chronicles"'), ["Xenoblade Chronicles"], "case and spacing still fold");
  assert.deepEqual(titlesFor("game:xenoblade"), ["Xenoblade Chronicles", "Xenoblade Chronicles 3"]);
  assert.deepEqual(titlesFor('game:"Persona 4"'), ["Persona 4"]);
  assert.deepEqual(titlesFor("game:persona"), ["Persona 4", "Persona 5 Royal"]);
  const withoutRoster = BASE_MECHS.filter(m => matchesRowQuery(m, m.game, gameRow(m.game), parseQuery('game:"Xenoblade Chronicles"', MECH_QUERY_KEYS).facets));
  assert.ok(withoutRoster.some(m => m.game === "Xenoblade Chronicles 3"), "with no roster to check against, the whole-word rule applies");
});

test("game keys and row keys AND together", () => {
  const expected = mechsFor("platform:SNES").filter(m => m.cat === "Exploration & Rewards").map(m => m.id);
  assert.ok(expected.length > 0);
  assert.deepEqual(mechsFor("platform:SNES cat:exploration").map(m => m.id), expected);
});

// ---------------------------------------------------------------- related games on a game page

const kin = (title, infobox, extra = {}) => ({ title, infobox: { plat: ["PC"], at: "2026-09-14", ...infobox }, ...extra });

test("a publisher, an engine, a theme or a feature adds weight but never makes a relative on its own", () => {
  const themes = ["Video games about time travel", "Science fantasy video games"];
  const one = kin("One", { pub: ["Pub Co"], engine: ["Unity"], comp: ["Composer C"], des: ["Designer D"] }, { wpcats: themes });
  const two = kin("Two", { pub: ["Pub Co"], engine: ["Unity"] }, { wpcats: themes });
  const three = kin("Three", { comp: ["Composer C"] });
  const four = kin("Four", { des: ["Designer D"] });
  assert.equal(relatedScore(facetsOf(one), facetsOf(two)).score, 4, "the weak links still count");
  assert.deepEqual(relatedGames(one, [one, two, three, four]).map(r => [r.title, r.score]), [["Three", 2]],
    "Two shares only weak links; Four shares a person but scores 1");
});

test("relatives sort by score, then title, list the strongest kind first, and stop at the limit", () => {
  const home = kin("Home", { series: ["Saga S"], comp: ["Composer C"] });
  const all = [home, kin("Zed", { series: ["Saga S"], comp: ["Composer C"] }), kin("Beta", { comp: ["Composer C"] }), kin("Alpha", { comp: ["Composer C"] })];
  assert.deepEqual(relatedGames(home, all).map(r => `${r.title} ${r.score}`), ["Zed 5", "Alpha 2", "Beta 2"]);
  assert.deepEqual(relatedGames(home, all)[0].shared, [{ k: "series", v: "Saga S" }, { k: "composer", v: "Composer C" }]);
  assert.deepEqual(relatedGames(home, all, 1).map(r => r.title), ["Zed"]);
  assert.deepEqual(relatedGames(null, all), []);
});

test("a game is never its own relative, and kinship is symmetric across the roster", () => {
  const F = new Map(BASE_GAMES.map(g => [g.title, facetsOf(g)]));
  for (const a of BASE_GAMES) {
    assert.ok(!relatedGames(a, BASE_GAMES).some(r => r.title === a.title), a.title);
    for (const b of BASE_GAMES) {
      if (a !== b) assert.equal(relatedScore(F.get(a.title), F.get(b.title)).score, relatedScore(F.get(b.title), F.get(a.title)).score, `${a.title} / ${b.title}`);
    }
  }
  const ff7 = game("Final Fantasy VII (1997)"), ff8 = game("Final Fantasy VIII");
  const ff8InFf7 = relatedGames(ff7, BASE_GAMES).find(r => r.title === ff8.title);
  assert.ok(ff8InFf7, "FF7 lists FF8");
  assert.ok(relatedGames(ff8, BASE_GAMES).some(r => r.title === ff7.title), "FF8 lists FF7");
  assert.deepEqual(ff8InFf7.shared[0], { k: "series", v: "Final Fantasy" });
});
