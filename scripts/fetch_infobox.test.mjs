/**
 * Offline tests for fetch_infobox.mjs — the Wikipedia infobox harvest. Synthetic markup from
 * scripts/fixtures/infobox.mjs, a stand-in fetch, and the real page's facetLookup, so a platform
 * or genre is refused here exactly when the validator would refuse it.
 *
 *   node --test scripts/fetch_infobox.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseInfobox, cellItems, stripRegion, splitOutsideParens, infoboxOf, harvest, logGames, pageLookup } from "./fetch_infobox.mjs";
import { setOwnedFields, evalCodex, Refusal } from "./game_rows.mjs";
import { extractScript, extractData } from "./validate_codex.mjs";
import { miniCodex } from "./fixtures/mini_codex.mjs";
import { LANTERN_VALE, LANTERN_VALE_INFOBOX, box, row } from "./fixtures/infobox.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const lookup = pageLookup(readFileSync(join(ROOT, "JRPG_Design_Codex.html"), "utf8"));
const read = html => infoboxOf(parseInfobox(html), { lookup });
const TODAY = "2026-09-13";
const quiet = { sleepImpl: async () => {}, pauseMs: 0, lookup };
const answer = (text, title = "Lantern Vale", status = 200) => async () =>
  ({ ok: status < 400, status, json: async () => ({ parse: { title, text } }) });
const withWp = (html = miniCodex()) => setOwnedFields(html, "Lantern Vale", { wp: "Lantern Vale" });
const changesOf = html => new Function(extractData(extractScript(html)) + "; return CHANGES;")();

test("every cell shape the roster's infoboxes use reads as a clean list", () => {
  const { infobox, problems } = read(LANTERN_VALE);
  assert.deepEqual(problems, []);
  assert.deepEqual(infobox, LANTERN_VALE_INFOBOX);
});

test("a bold run is a re-release header, not a value", () => {
  assert.deepEqual(cellItems(`<b>Original</b><div class="plainlist"><ul><li>Square</li></ul></div><i><b>The Remaster</b></i><br />Square Enix`),
    ["Square", "Square Enix"]);
});

test("a comma splits a platform or genre cell, never a qualifier and never a studio", () => {
  assert.deepEqual(splitOutsideParens("Super Famicom, PlayStation 2 (Remake, HD), Android"), ["Super Famicom", "PlayStation 2 (Remake, HD)", "Android"]);
  const { infobox, problems } = read(box(
    row("Platforms", "Super Famicom, PlayStation 2 (Remake, HD), Android"),
    row("Developers", "ArtePiazza (PS2, DS, iOS, Android)")));
  assert.deepEqual(problems, []);
  assert.deepEqual(infobox.plat, ["Super Famicom", "PlayStation 2 (Remake, HD)", "Android"]);
  assert.deepEqual(infobox.dev, ["ArtePiazza (PS2, DS, iOS, Android)"]);
});

test("a region prefix is stripped only when every code is a known region", () => {
  assert.deepEqual(stripRegion("JP: Square"), { value: "Square" });
  assert.deepEqual(stripRegion("JP/NA: Atlus"), { value: "Atlus" });
  assert.deepEqual(stripRegion("Square"), { value: "Square" });
  assert.match(stripRegion("ZZ: Nowhere").problem, /unknown region code "ZZ"/);
});

test("each thing the harvest cannot place is a named problem", () => {
  const cases = [
    [box(row("Platform", "PlayStation"), row("Voice actors", "Someone")), /unknown infobox label "Voice actors"/],
    [box(row("Platform", "Lantern Box")), /platform "Lantern Box" is not in the page's FACET_VOCAB\.platform/],
    [box(row("Platform", "PlayStation"), row("Genre", "Lantern-like")), /genre "Lantern-like" is not in the page's FACET_VOCAB\.genre/],
    [box(row("Platform", "PlayStation"), row("Composer", "x".repeat(121))), /is 121 chars — longer than 120/],
    [box(row("Platform", "PlayStation"), row("Publisher", "ZZ: Harbor Soft")), /Publisher: unknown region code "ZZ"/],
    [box(row("Platform", "PlayStation"), row("Platforms", "Windows")), /labels "Platform" and "Platforms" both map to plat/],
    [box(row("Developer", "Lantern Works")), /lists no platform/],
    [`<p>An article with no infobox.</p>`, /has no infobox/],
  ];
  for (const [html, want] of cases) {
    const { problems } = read(html);
    assert.ok(problems.some(p => want.test(p)), `${want} in ${JSON.stringify(problems)}`);
  }
  assert.equal(read(box(row("Platform", "PlayStation"), row("Composer", "x".repeat(120)))).problems.length, 0, "120 is the cap, not over it");
});

test("a harvest writes the row after wp, in key order, and logs the game; a re-run changes nothing", async () => {
  const base = withWp();
  const r = await harvest(base, { only: ["Lantern Vale"], today: TODAY, fetchImpl: answer(LANTERN_VALE), ...quiet });
  assert.deepEqual(r.changed, ["Lantern Vale"]);
  const row = evalCodex(r.html).BASE_GAMES.find(g => g.title === "Lantern Vale");
  assert.deepEqual(row.infobox, { ...LANTERN_VALE_INFOBOX, at: TODAY });
  assert.deepEqual(Object.keys(row.infobox), ["plat", "genre", "dev", "pub", "series", "comp", "at"]);
  assert.match(r.html, /\nwp:"Lantern Vale",\ninfobox:\{plat:/);
  const [entry] = changesOf(r.html);
  assert.equal(entry.date, TODAY);
  assert.deepEqual(entry.games, ["Lantern Vale"]);
  assert.deepEqual([entry.added, entry.updated], [[], []]);

  const later = await harvest(r.html, { only: ["Lantern Vale"], today: "2026-09-20", fetchImpl: answer(LANTERN_VALE), ...quiet });
  assert.deepEqual(later.changed, [], "only the date differs");
  assert.equal(later.html, r.html);
});

test("a note is kept on a later harvest, and describes exactly one article", async () => {
  const noted = await harvest(withWp(), { only: ["Lantern Vale"], note: "The article covers the base game", today: TODAY, fetchImpl: answer(LANTERN_VALE), ...quiet });
  const again = await harvest(noted.html, { only: ["Lantern Vale"], today: TODAY, fetchImpl: answer(LANTERN_VALE), ...quiet });
  assert.deepEqual(again.changed, []);
  assert.equal(evalCodex(again.html).BASE_GAMES.find(g => g.title === "Lantern Vale").infobox.note, "The article covers the base game");
  await assert.rejects(harvest(withWp(), { note: "n", today: TODAY, fetchImpl: answer(LANTERN_VALE), ...quiet }), Refusal);
  await assert.rejects(harvest(withWp(), { only: ["Lantern Vale"], note: "x".repeat(121), today: TODAY, fetchImpl: answer(LANTERN_VALE), ...quiet }), /at most 120/);
});

test("one refused row writes nothing, and a failed fetch is recorded against its row", async () => {
  const base = setOwnedFields(withWp(), "Harbor Town", { wp: "Harbor Town" });
  const fetchImpl = async url => {
    if (new URL(url).searchParams.get("page") === "Harbor Town") throw new TypeError("network down");
    return answer(LANTERN_VALE)();
  };
  const r = await harvest(base, { only: ["Lantern Vale", "Harbor Town"], today: TODAY, fetchImpl, ...quiet });
  assert.match(r.results.find(x => x.title === "Harbor Town").problems[0], /fetch failed: network down/);
  assert.deepEqual(r.results.find(x => x.title === "Lantern Vale").problems, []);
  assert.equal(r.html, base);
});

test("a row without wp, or whose article resolves elsewhere, is refused", async () => {
  const noWp = await harvest(miniCodex(), { only: ["Lantern Vale"], today: TODAY, fetchImpl: answer(LANTERN_VALE), ...quiet });
  assert.match(noWp.results[0].problems[0], /has no wp/);
  const moved = await harvest(withWp(), { only: ["Lantern Vale"], today: TODAY, fetchImpl: answer(LANTERN_VALE, "Lantern Vale (video game)"), ...quiet });
  assert.match(moved.results[0].problems[0], /resolved "Lantern Vale" to "Lantern Vale \(video game\)"/);
});

test("a 429 is retried with backoff and a 404 is not", async () => {
  const calls = [], waits = [];
  const flaky = async () => { calls.push(1); return calls.length === 1 ? { ok: false, status: 429, json: async () => ({}) } : answer(LANTERN_VALE)(); };
  const ok = await harvest(withWp(), { only: ["Lantern Vale"], today: TODAY, fetchImpl: flaky, lookup, pauseMs: 0, sleepImpl: async ms => { waits.push(ms); } });
  assert.deepEqual([calls.length, waits], [2, [2000]]);
  assert.deepEqual(ok.changed, ["Lantern Vale"]);
  calls.length = 0;
  const gone = await harvest(withWp(), { only: ["Lantern Vale"], today: TODAY, fetchImpl: async () => { calls.push(1); return { ok: false, status: 404, json: async () => ({}) }; }, ...quiet });
  assert.equal(calls.length, 1);
  assert.match(gone.results[0].problems[0], /HTTP 404/);
});

test("a same-day harvest widens that day's entry, and a same-day entry with no games list is left to a person", () => {
  const once = logGames(miniCodex(), { date: TODAY, title: "t", note: "n", games: ["Lantern Vale"] });
  const twice = logGames(once, { date: TODAY, title: "t", note: "n", games: ["Harbor Town", "Lantern Vale"] });
  const entries = changesOf(twice);
  assert.equal(entries.filter(c => c.date === TODAY).length, 1);
  assert.deepEqual(entries[0].games, ["Lantern Vale", "Harbor Town"]);
  assert.throws(() => logGames(miniCodex(), { date: "2026-09-05", title: "t", note: "n", games: ["Lantern Vale"] }), /no games list/);
});
