/**
 * Offline tests for splice_game.mjs — the strict side of the game-page harvest.
 *
 *   node --test scripts/splice_game.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { normalizeGame, LABELS, normTitle } from "./splice_game.mjs";
import { setOwnedFields, evalCodex, GF_KEYS } from "./game_rows.mjs";
import { miniCodex } from "./fixtures/mini_codex.mjs";
import { gamePage } from "./fixtures/gf/pages.mjs";

const require = createRequire(import.meta.url);
const { install } = require("./gf_probe.js");
const hash = s => createHash("sha256").update(s).digest("hex");
const TODAY = "2026-09-06";
const ROW = { title: "Lantern Vale", year: 1999 };

/** The probe's own output for the fixture page — the seam the two scripts share. */
function probeOf(page = gamePage()) {
  install(page.win, page.doc, page.loc);
  return JSON.parse(JSON.stringify(page.win.__gf.game()));
}
const norm = (edit = p => p, row = ROW, opts = {}) => {
  const probe = probeOf();
  edit(probe);
  return normalizeGame(probe, row, { today: TODAY, ...opts });
};
const problemMatching = (r, re) => r.problems.some(p => re.test(p));

test("the probe's own fixture output is accepted end-to-end and lands on the row", () => {
  const { gf, problems } = norm();
  assert.deepEqual(problems, []);
  assert.deepEqual(gf, {
    u: "/ps/1-lantern-vale", plat: "PlayStation", genre: ["Role-Playing", "Action RPG"],
    dev: "Lantern Works", pub: "Lantern Works", rel: "March 3, 1999", fr: ["Lantern", "Vale Chronicles"],
    aka: ["Rantan no Tani (JP)"], also: ["PSP", "Vita"],
    rating: { v: 4.12, n: 12317, w: "Great" }, diff: { v: 3.25, n: 1560, w: "Just Right/Tough" },
    len: { v: 31, n: 1105, w: "31 Hours" },
    like: [{ t: "Harbor Story", u: "/ps/4-harbor-story" }, { t: "Lantern Vale II", u: "/ps/5-lantern-vale-ii" }, { t: "Reed Blade Saga", u: "/ps/6-reed-blade-saga" }],
    at: TODAY,
  });
  assert.deepEqual(Object.keys(gf), GF_KEYS.filter(k => k in gf), "keys in the canonical order");
  const html = setOwnedFields(miniCodex(), "Lantern Vale", { gf });
  assert.deepEqual(evalCodex(html).BASE_GAMES.find(g => g.title === "Lantern Vale").gf, gf);
});

test("an unknown Game Detail label is a refusal that names it; a known-ignored one is not", () => {
  assert.ok(problemMatching(norm(p => { p.detail.Blurb = "x"; }), /unknown Game Detail label "Blurb"/));
  const r = norm(p => { p.detail.Expansions = "8 available"; });
  assert.deepEqual(r.problems, []);
  assert.equal(r.gf.Expansions, undefined);
  assert.equal(LABELS.Expansions, null);
});

test("the page must be a GameFAQs game page for the row it is spliced into", () => {
  assert.ok(problemMatching(norm(p => { p.url = "https://example.com/ps/1-lantern-vale"; }), /is not on https:\/\/gamefaqs\.gamespot\.com/));
  assert.ok(problemMatching(norm(p => { p.url = "https://gamefaqs.gamespot.com/ps/1-lantern-vale/faqs"; }), /is not a game page/));
  assert.ok(problemMatching(norm(undefined, { title: "Harbor Town", year: 1999 }), /titled "Lantern Vale" but the codex row is "Harbor Town"/));
  assert.deepEqual(norm(undefined, { title: "Harbor Town", year: 1999 }, { allowTitleMismatch: true }).problems, []);
  const xsx = norm(p => { p.url = "https://gamefaqs.gamespot.com/xbox-series-x/370656-lantern-vale"; });
  assert.equal(xsx.gf.u, "/xbox-series-x/370656-lantern-vale", "a hyphenated platform segment is a game page too");
  assert.equal(normTitle("The Witcher 3: Wild Hunt"), "thewitcher3wildhunt");
  assert.ok(problemMatching(normalizeGame({ n: 2, rows: [] }, ROW, { today: TODAY }), /not a game\(\) result/));
});

test("the release year must sit within two years of the row's, or be explained", () => {
  assert.ok(problemMatching(norm(undefined, { title: "Lantern Vale", year: 1990 }), /a port or remake page/));
  assert.deepEqual(norm(undefined, { title: "Lantern Vale", year: 2001 }).problems, [], "the NA date is later than a JP-first year");
  const ok = norm(undefined, { title: "Lantern Vale", year: 1990 }, { allowYearMismatch: "the 1999 page is the original; the row's year is the JP prototype" });
  assert.deepEqual(ok.problems, []);
  assert.equal(ok.gf.note, "the 1999 page is the original; the row's year is the JP prototype");
  assert.equal(norm().gf.note, undefined, "no note when nothing needs explaining");
  assert.equal(norm(undefined, ROW, { note: "  GameFAQs has no Royal page; this is Persona 5's  " }).gf.note, "GameFAQs has no Royal page; this is Persona 5's", "--note writes the same field");
  assert.ok(problemMatching(norm(p => { p.detail.Release = "Spring"; }), /carries no year/));
});

test("ratings are range-checked, and length stores the hours from the word, not the bucket", () => {
  assert.ok(problemMatching(norm(p => { p.ratings.rate.v = 9.5; }), /rate: value 9\.5 is out of range/));
  assert.ok(problemMatching(norm(p => { p.ratings.rate.n = "2,317"; }), /rate: count "2,317" is not a positive integer/));
  const over = norm(p => { p.ratings.length = { v: 5, w: "Over 80 Hours", n: 1923 }; });
  assert.deepEqual(over.gf.len, { v: 80, n: 1923, w: "Over 80 Hours" });
  const none = norm(p => { delete p.ratings.length; });
  assert.equal(none.gf.len, undefined);
});

test("related games keep only title and path, once each, never the page itself", () => {
  const r = norm(p => {
    p.like = [
      { t: "Self", u: "/ps/1-lantern-vale" },
      { t: "Harbor Story", u: "/ps/4-harbor-story", m: "PUBLISHER BLURB" },
      { t: "Harbor Story again", u: "/ps/4-harbor-story" },
    ];
  });
  assert.deepEqual(r.gf.like, [{ t: "Harbor Story", u: "/ps/4-harbor-story" }]);
  // A news path shares a game path's shape, so the shape check cannot tell them apart —
  // a guide path or a community path it can.
  assert.ok(problemMatching(norm(p => { p.like = [{ t: "Odd", u: "/community/someone" }]; }), /like\[0\] "Odd": path "\/community\/someone" is not a game page/));
});

test("list labels split the way the page joins them, and prose cannot get in", () => {
  const r = norm(p => {
    p.detail["Also Known As"] = "• Paper Mario RPG (JP)• Paper Mario: La Puerta Milenaria (EU)";
    p.detail["Developer/Publisher"] = "Konami";
    delete p.detail.Developer; delete p.detail.Publisher;
  });
  assert.deepEqual(r.gf.aka, ["Paper Mario RPG (JP)", "Paper Mario: La Puerta Milenaria (EU)"]);
  const dup = norm(p => { p.detail["Also Known As"] = "• Seiken Densetsu (JP)• Seiken Densetsu (JP)• Legend of Mana (AU)"; });
  assert.deepEqual(dup.gf.aka, ["Seiken Densetsu (JP)", "Legend of Mana (AU)"], "a page that lists an alias twice yields it once");
  assert.equal(r.gf.dev, "Konami");
  assert.equal(r.gf.pub, "Konami");
  assert.ok(problemMatching(norm(p => { p.detail["Also Known As"] = "x".repeat(130); }), /gf\.aka\[0\] is 130 chars — longer than 120/));
});

test("the CLI dry-runs by default, writes with --write, and refuses loudly", () => {
  const dir = mkdtempSync(join(tmpdir(), "splice-game-"));
  const codex = join(dir, "codex.html");
  const json = join(dir, "lantern-vale.json");
  writeFileSync(codex, miniCodex());
  writeFileSync(json, JSON.stringify(probeOf()));
  const before = hash(readFileSync(codex, "utf8"));
  const cli = (...args) => execFileSync("node", ["scripts/splice_game.mjs", "--codex", codex, "--today", TODAY, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  const dry = cli("--game", "Lantern Vale", json);
  assert.match(dry, /dry run/);
  assert.match(dry, /gf:\{u:"\/ps\/1-lantern-vale"/);
  assert.equal(hash(readFileSync(codex, "utf8")), before);
  cli("--game", "Lantern Vale", json, "--write");
  assert.equal(evalCodex(readFileSync(codex, "utf8")).BASE_GAMES.find(g => g.title === "Lantern Vale").gf.at, TODAY);
  assert.throws(() => cli("--game", "Harbor Town", json), /titled "Lantern Vale" but the codex row is "Harbor Town"/);
  assert.throws(() => cli("--game", "No Such Game", json), /no BASE_GAMES row titled/);
});
