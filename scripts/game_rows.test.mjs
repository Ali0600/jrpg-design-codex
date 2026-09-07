/**
 * Offline tests for game_rows.mjs — the writer of the script-owned game-row fields.
 *
 *   node --test scripts/game_rows.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gameRowChunks, findGameRow, setOwnedFields, lit, canonGf, evalCodex, OWNED, GF_KEYS, Refusal } from "./game_rows.mjs";
import { miniCodex, DEFAULT_GAMES, FF_TITLE } from "./fixtures/mini_codex.mjs";

const hash = s => createHash("sha256").update(s).digest("hex");
const rowOf = (html, title) => evalCodex(html).BASE_GAMES.find(g => g.title === title);
const rowText = (html, title) => { const { chunks } = gameRowChunks(html); const c = findGameRow(chunks, title); return html.slice(c.start, c.end); };
const GF = { u: "/ps/1-lantern-vale", plat: "PlayStation", genre: ["Role-Playing", "Action RPG"], rel: "March 3, 1999",
             rating: { v: 4.12, w: "Great", n: 2317 }, like: [{ t: "Harbor Story", u: "/ps/4-harbor-story" }], at: "2026-09-06" };

test("rows are paired positionally with the evaluated roster, const titles included", () => {
  const { chunks } = gameRowChunks(miniCodex());
  assert.deepEqual(chunks.map(c => c.title), [FF_TITLE, "Lantern Vale", "Harbor Town"]);
  assert.equal(chunks[1].row.year, 1999);
});

test("a row that does not start at column 0 is a refusal, not a guess", () => {
  const games = DEFAULT_GAMES + `,\n  {title:"Indented",year:2000,dev:"d",status:"Researched",why:"w"}`;
  assert.throws(() => gameRowChunks(miniCodex({ games })), /evaluates to 4 rows but 3 lines start/);
  assert.throws(() => gameRowChunks(miniCodex({ games })), Refusal);
});

test("sets fields on a row that has none, and touches nothing else", () => {
  const html = miniCodex();
  const next = setOwnedFields(html, "Lantern Vale", { wp: "Lantern Vale (video game)", digest: "lantern-vale" });
  const row = rowOf(next, "Lantern Vale");
  assert.equal(row.wp, "Lantern Vale (video game)");
  assert.equal(row.digest, "lantern-vale");
  const before = rowOf(html, "Lantern Vale");
  for (const k of Object.keys(before)) assert.deepEqual(row[k], before[k], `${k} changed`);
  assert.match(row.why, /gf: which is not a key, wp: neither/, "prose that merely mentions an owned key is left alone");
  assert.equal(evalCodex(next).BASE_GAMES.length, 3);
});

test("replaces existing owned lines and keeps the fixed order gf, cover, wp, digest", () => {
  let html = miniCodex();
  html = setOwnedFields(html, "Lantern Vale", { wp: "first" });
  html = setOwnedFields(html, "Lantern Vale", { gf: GF });
  html = setOwnedFields(html, "Lantern Vale", { cover: "covers/lantern-vale.jpg", wp: "second" });
  const owned = rowText(html, "Lantern Vale").split("\n").filter(l => OWNED.some(k => l.startsWith(k + ":")));
  assert.deepEqual(owned.map(l => l.split(":")[0]), ["gf", "cover", "wp"]);
  assert.equal(owned.filter(l => l.startsWith("wp:")).length, 1, "one wp line, not two");
  assert.equal(rowOf(html, "Lantern Vale").wp, "second");
  assert.deepEqual(rowOf(html, "Lantern Vale").gf, GF);
});

test("unset removes one field and leaves the rest", () => {
  let html = setOwnedFields(miniCodex(), "Harbor Town", { wp: "Harbor Town (video game)", cover: "covers/harbor-town.jpg", digest: "harbor-town" });
  html = setOwnedFields(html, "Harbor Town", {}, { unset: ["cover"] });
  const row = rowOf(html, "Harbor Town");
  assert.equal(row.cover, undefined);
  assert.equal(row.wp, "Harbor Town (video game)");
  assert.equal(row.digest, "harbor-town");
  html = setOwnedFields(html, "Harbor Town", {}, { unset: ["wp", "digest"] });
  assert.doesNotMatch(rowText(html, "Harbor Town"), /,\s*\}/, "no dangling comma once every owned field is gone");
  assert.deepEqual(rowOf(html, "Harbor Town"), rowOf(miniCodex(), "Harbor Town"));
});

test("everything outside the row, and the row's own lone-comma seam, survive byte for byte", () => {
  const html = miniCodex();
  const { chunks } = gameRowChunks(html);
  const c = findGameRow(chunks, "Lantern Vale");
  const next = setOwnedFields(html, "Lantern Vale", { digest: "lantern-vale" });
  assert.equal(next.slice(0, c.start), html.slice(0, c.start));
  assert.equal(next.slice(next.length - (html.length - c.end)), html.slice(c.end));
  assert.match(rowText(next, "Lantern Vale"), /\}\n,\n$/, "the seam after the row is still `\\n,\\n`");
  assert.match(rowText(next, "Harbor Town"), /\}$/, "the last row still ends without a comma");
});

test("an owned key sharing a line with another key is a refusal", () => {
  const games = DEFAULT_GAMES.replace('why:"w"}', 'why:"w",wp:"x"}');
  assert.throws(() => setOwnedFields(miniCodex({ games }), "Harbor Town", { digest: "harbor-town" }), /carries an owned field after another key/);
  const games2 = DEFAULT_GAMES.replace('why:"w"}', 'why:"w",\nwp:"x",digest:"y"}');
  assert.throws(() => setOwnedFields(miniCodex({ games: games2 }), "Harbor Town", { cover: "covers/x.jpg" }), /together with another key/);
});

test("lit() writes the file's own literal style and round-trips", () => {
  const v = { u: "/ps/1-x", genre: ["Role-Playing", "Action RPG"], rating: { v: 4.12, n: 2317 }, "Also on": ["PSP"], q: 'say "hi" — ok', nil: null, skip: undefined };
  const text = lit(v);
  assert.match(text, /^\{u:"\/ps\/1-x",genre:\["Role-Playing","Action RPG"\],rating:\{v:4\.12,n:2317\},"Also on":\["PSP"\],q:/);
  assert.doesNotMatch(text, /skip/);
  const back = new Function("return " + text)();
  delete v.skip;
  assert.deepEqual(back, v);
  assert.doesNotMatch(text, /\n/, "one line");
});

test("gf is written in the canonical key order, and an unknown gf key is refused", () => {
  const html = setOwnedFields(miniCodex(), "Lantern Vale", { gf: { at: "2026-09-06", plat: "PlayStation", u: "/ps/1-lantern-vale", rel: "1999" } });
  const line = rowText(html, "Lantern Vale").split("\n").find(l => l.startsWith("gf:"));
  // The last owned line ends with the row's own closing brace.
  assert.equal(line, 'gf:{u:"/ps/1-lantern-vale",plat:"PlayStation",rel:"1999",at:"2026-09-06"}}');
  assert.throws(() => setOwnedFields(miniCodex(), "Lantern Vale", { gf: { u: "/ps/1-x", blurb: "x" } }), /"blurb" is not a gf key/);
  assert.deepEqual(Object.keys(canonGf({ at: "a", u: "b" })), ["u", "at"]);
  assert.equal(GF_KEYS[0], "u");
});

test("the const-titled row is written by its evaluated title and keeps `title:FF`", () => {
  const html = setOwnedFields(miniCodex(), FF_TITLE, { wp: "Final Fantasy VII Rebirth" });
  assert.match(rowText(html, FF_TITLE), /^\{title:FF,/);
  assert.equal(rowOf(html, FF_TITLE).wp, "Final Fantasy VII Rebirth");
  assert.throws(() => setOwnedFields(miniCodex(), "No Such Game", { wp: "x" }), /no BASE_GAMES row titled "No Such Game"/);
  assert.throws(() => setOwnedFields(miniCodex(), "Lantern Vale", { why: "x" }), /not a script-owned field/);
});

test("the CLI dry-runs by default and writes only with --write", () => {
  const dir = mkdtempSync(join(tmpdir(), "game-rows-"));
  const path = join(dir, "codex.html");
  writeFileSync(path, miniCodex());
  const before = hash(readFileSync(path, "utf8"));
  const cli = (...args) => execFileSync("node", ["scripts/game_rows.mjs", "--codex", path, ...args], { encoding: "utf8" });
  const dry = cli("--game", "Lantern Vale", "--set", "digest=lantern-vale", "--set", 'gf={"u":"/ps/1-lantern-vale","plat":"PS","rel":"1999","at":"2026-09-06"}');
  assert.match(dry, /dry run/);
  assert.equal(hash(readFileSync(path, "utf8")), before, "a dry run changes nothing");
  cli("--game", "Lantern Vale", "--set", "digest=lantern-vale", "--write");
  assert.notEqual(hash(readFileSync(path, "utf8")), before);
  assert.equal(rowOf(readFileSync(path, "utf8"), "Lantern Vale").digest, "lantern-vale");
  assert.throws(() => cli("--game", "Lantern Vale", "--set", "why=x"), /not a script-owned field/);
});
