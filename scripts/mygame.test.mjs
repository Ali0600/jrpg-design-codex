/**
 * Offline tests for the My Game board's pure logic: how the owner's pillar judgements add up
 * over a shortlist. The function lives in the page's data region, so these tests evaluate it
 * straight out of JRPG_Design_Codex.html, the way scripts/facets.test.mjs does.
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
const { PILLARS, pillarCoverage } =
  new Function(extractData(extractScript(HTML)) + "; return {PILLARS, pillarCoverage};")();

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
