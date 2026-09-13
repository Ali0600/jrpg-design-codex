/**
 * Offline tests for the My Game board's pure logic: how the owner's pillar judgements add up
 * over a shortlist, and which people recur behind it. The functions live in the page's data
 * region, so these tests evaluate them straight out of JRPG_Design_Codex.html, the way
 * scripts/facets.test.mjs does.
 *
 *   node --test scripts/mygame.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { extractScript, extractData } from "./validate_codex.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HTML = readFileSync(join(ROOT, "JRPG_Design_Codex.html"), "utf8");
const { PILLARS, pillarCoverage, BOARD_CREDITS, FACET_KINDS, creditTally } =
  new Function(extractData(extractScript(HTML)) + "; return {PILLARS, pillarCoverage, BOARD_CREDITS, FACET_KINDS, creditTally};")();

// ---------------------------------------------------------------- pillar coverage

const pool = ["M001", "M002", "M003"].map(id => ({ id }));
const per = counts => ({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, ...counts });

test("the page declares the five pillars these tests count against", () => {
  assert.deepEqual(PILLARS.map(p => p.n), [1, 2, 3, 4, 5]);
});

test("nothing judged: every pillar at zero and the whole shortlist not yet judged", () => {
  for (const judged of [{}, undefined, null]) {
    assert.deepEqual(pillarCoverage(pool, judged), { per: per({}), judged: 0, unjudged: 3, total: 3 }, String(judged));
  }
});

test("an empty list is a judgement: judged, and serving no pillar", () => {
  assert.deepEqual(pillarCoverage(pool, { M001: [] }), { per: per({}), judged: 1, unjudged: 2, total: 3 });
});

test("a repeat counts once, and a number that is not a pillar is ignored", () => {
  assert.deepEqual(pillarCoverage(pool, { M001: [1, 1, 3], M002: [9, 3] }),
    { per: per({ 1: 1, 3: 2 }), judged: 2, unjudged: 1, total: 3 });
});

test("a judgement for a mechanic outside the shortlist is not counted", () => {
  assert.deepEqual(pillarCoverage(pool, { M001: [2], M999: [2, 4] }),
    { per: per({ 2: 1 }), judged: 1, unjudged: 2, total: 3 });
});

test("an entry that is not a list is not a judgement, and never throws", () => {
  assert.deepEqual(pillarCoverage(pool, { M001: "1", M002: { 0: 1 }, M003: 4 }),
    { per: per({}), judged: 0, unjudged: 3, total: 3 });
});

// ---------------------------------------------------------------- credits behind the shortlist

// Synthetic games carrying only what facetsOf reads for credits. B spells the composer in capitals:
// the credit kinds have no vocabulary table, so only facetNorm makes the two one name.
const ib = fields => ({ plat: ["PC"], at: "2026-09-14", ...fields });
const GAMES = {
  A: { title: "A", infobox: ib({ comp: ["Yasunori Mitsuda"], dir: ["Person X"], wri: ["Writer W"] }) },
  B: { title: "B", infobox: ib({ comp: ["YASUNORI MITSUDA"], dir: ["Person Y"], wri: ["Writer W"] }) },
  Custom: { title: "Custom" },
};
const byTitle = games => t => games[t] || null;
const mechs = (...games) => games.map((game, i) => ({ id: `M${i + 1}`, game }));

test("every credit kind the board shows is a facet kind", () => {
  assert.deepEqual(BOARD_CREDITS.map(([k]) => k), ["director", "designer", "writer", "composer"]);
  for (const [k] of BOARD_CREDITS) assert.ok(FACET_KINDS.includes(k), k);
});

test("a name counts once per game, and only names on two or more games are listed", () => {
  // A has two shortlisted mechanics, so Person X has two mechanics but only one game.
  assert.deepEqual(creditTally(mechs("A", "A", "B"), byTitle(GAMES)), {
    names: [
      { k: "writer", v: "Writer W", games: ["A", "B"], mechs: 3 },
      { k: "composer", v: "Yasunori Mitsuda", games: ["A", "B"], mechs: 3 },
    ],
    belowFloor: 2,
  });
});

test("a custom game and a title off the roster add no names, and never throw", () => {
  assert.deepEqual(creditTally(mechs("A", "Custom", "Nowhere"), byTitle(GAMES)), { names: [], belowFloor: 3 });
  assert.deepEqual(creditTally(undefined, byTitle(GAMES)), { names: [], belowFloor: 0 });
});

test("sorted by games, then mechanics, then name", () => {
  const S = {
    S1: { title: "S1", infobox: ib({ comp: ["Composer C"], wri: ["Writer V"], des: ["Designer Q", "Designer P"] }) },
    S2: { title: "S2", infobox: ib({ comp: ["Composer C"], des: ["Designer Q", "Designer P"] }) },
    S3: { title: "S3", infobox: ib({ comp: ["Composer C"] }) },
    S4: { title: "S4", infobox: ib({ wri: ["Writer V"] }) },
  };
  // Writer V: 2 games but 6 mechanics. Composer C: 3 games, 3 mechanics. Games decide first.
  const t = creditTally(mechs("S1", "S2", "S3", "S4", "S4", "S4", "S4", "S4"), byTitle(S));
  assert.deepEqual(t.names.map(n => `${n.v} ${n.games.length}g ${n.mechs}m`),
    ["Composer C 3g 3m", "Writer V 2g 6m", "Designer P 2g 2m", "Designer Q 2g 2m"]);
});
