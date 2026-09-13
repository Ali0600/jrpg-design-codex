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
const NAMES = ["BASE_GAMES", "facetLookup", "canonFacet", "facetsOf", "parseGameQuery", "withFacet", "withoutFacet", "buildGameQuery", "matchesFacets"];
const { BASE_GAMES, facetLookup, canonFacet, facetsOf, parseGameQuery, withFacet, withoutFacet, buildGameQuery, matchesFacets } =
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
