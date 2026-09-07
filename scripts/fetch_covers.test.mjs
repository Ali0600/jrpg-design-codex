/**
 * Offline tests for fetch_covers.mjs — the pure guards and the download path with a fake fetch.
 *
 *   node --test scripts/fetch_covers.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { slugOf, wpTitleFor, buildQuery, mapResolved, pickThumb, magicExt, provenanceLine, wikiUrl, download, sheetHtml, ledgerWithout, MAX_BYTES, WIDTH, RETRY_DELAYS_MS } from "./fetch_covers.mjs";
import { Refusal } from "./game_rows.mjs";

const JPG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]);
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]);
const fakeFetch = (body, { status = 200, length = null } = {}) => async () => ({
  ok: status < 400, status,
  headers: { get: k => (k === "content-length" && length != null ? String(length) : null) },
  arrayBuffer: async () => body,
});

test("slugOf matches the shots/ folder convention", () => {
  assert.equal(slugOf("Final Fantasy VII (1997)"), "final-fantasy-vii-1997");
  assert.equal(slugOf("NieR: Automata"), "nier-automata");
  assert.equal(slugOf("Clair Obscur: Expedition 33"), "clair-obscur-expedition-33");
  assert.equal(slugOf("The Legend of Dragoon"), "the-legend-of-dragoon");
  assert.equal(slugOf("Ys VIII: Lacrimosa of Dana"), "ys-viii-lacrimosa-of-dana");
});

test("the row's wp is the override; the title is the default", () => {
  assert.equal(wpTitleFor({ title: "Dark Cloud 2" }), "Dark Cloud 2");
  assert.equal(wpTitleFor({ title: "Dark Cloud 2", wp: "Dark Chronicle" }), "Dark Chronicle");
  assert.equal(wpTitleFor({ title: "X", wp: "  " }), "X");
});

test("the query pins the measured parameters: non-free lead images, 240px, redirects, dab flag", () => {
  const q = buildQuery(["Xenogears", "Wild ARMs"]);
  assert.equal(q.pilicense, "any", "box art is non-free; without this the API returns no thumbnail");
  assert.equal(q.pithumbsize, String(WIDTH));
  assert.equal(q.redirects, "1");
  assert.equal(q.ppprop, "disambiguation");
  assert.equal(q.titles, "Xenogears|Wild ARMs");
  assert.equal(q.formatversion, "2");
});

test("mapResolved follows normalized and redirects back to each input title", () => {
  const query = {
    normalized: [{ from: "wild ARMs", to: "Wild ARMs" }],
    redirects: [{ from: "Wild ARMs", to: "Wild Arms" }, { from: "Dark Cloud 2", to: "Dark Chronicle" }],
    pages: [
      { title: "Wild Arms", pageimage: "WildArms.png", thumbnail: { source: "https://upload.wikimedia.org/w.png", width: 240, height: 138 } },
      { title: "Dark Chronicle", pageimage: "Dark_Chronicle_Coverart.png", thumbnail: { source: "https://upload.wikimedia.org/d.png", width: 240, height: 340 } },
      { title: "Final Fantasy VII (1997)", missing: true },
    ],
  };
  const r = mapResolved(query, ["wild ARMs", "Dark Cloud 2", "Final Fantasy VII (1997)", "Nobody"]);
  assert.equal(r["wild ARMs"].title, "Wild Arms");
  assert.equal(r["Dark Cloud 2"].title, "Dark Chronicle");
  assert.equal(r["Final Fantasy VII (1997)"].missing, true);
  assert.equal(r["Nobody"].missing, true, "a title the API did not answer for is missing, not undefined");
});

test("pickThumb refuses the four bad shapes and accepts a real page", () => {
  assert.deepEqual(pickThumb({ missing: true }), { ok: false, why: "missing" });
  assert.deepEqual(pickThumb(undefined), { ok: false, why: "missing" });
  assert.equal(pickThumb({ title: "Parasite Eve", pageprops: { disambiguation: "" }, thumbnail: { source: "https://upload.wikimedia.org/x.jpg" } }).why, "disambiguation");
  assert.equal(pickThumb({ title: "Grandia" }).why, "no page image");
  assert.equal(pickThumb({ title: "X", thumbnail: { source: "https://example.com/x.jpg" } }).why, "bad image host");
  assert.equal(pickThumb({ title: "X", thumbnail: { source: "http://upload.wikimedia.org/x.jpg" } }).why, "bad image host");
  const ok = pickThumb({ title: "Xenogears", pageimage: "Xenogears_box.jpg", thumbnail: { source: "https://upload.wikimedia.org/a/b.jpg", width: 240, height: 225 } });
  assert.deepEqual(ok, { ok: true, source: "https://upload.wikimedia.org/a/b.jpg", file: "Xenogears_box.jpg", pageTitle: "Xenogears", width: 240, height: 225 });
});

test("magicExt reads the bytes, never the name", () => {
  assert.equal(magicExt(JPG), "jpg");
  assert.equal(magicExt(PNG), "png");
  assert.equal(magicExt(Buffer.from("RIFF\0\0\0\0WEBPVP8 ", "latin1")), "webp");
  assert.throws(() => magicExt(Buffer.from("<!doctype html><title>Error</title>")), Refusal);
  assert.throws(() => magicExt(Buffer.alloc(0)), Refusal);
});

test("download takes bytes from the image host only, bounded, and refuses non-images", async () => {
  const good = await download("https://upload.wikimedia.org/a/b.jpg", fakeFetch(JPG));
  assert.equal(good.ext, "jpg");
  assert.equal(good.buf.length, JPG.length);
  await assert.rejects(() => download("https://example.com/a.jpg", fakeFetch(JPG)), /refusing to download from example\.com/);
  await assert.rejects(() => download("https://upload.wikimedia.org/a.jpg", fakeFetch(JPG, { status: 404 })), /HTTP 404/);
  await assert.rejects(() => download("https://upload.wikimedia.org/a.jpg", fakeFetch(JPG, { length: MAX_BYTES + 1 })), /over the .*-byte cap/);
  await assert.rejects(() => download("https://upload.wikimedia.org/a.jpg", fakeFetch(Buffer.alloc(MAX_BYTES + 1, 0xff))), /over the .*-byte cap/);
  await assert.rejects(() => download("https://upload.wikimedia.org/a.jpg", fakeFetch(Buffer.from("<!doctype html>"))), /not a JPEG, PNG or WebP/);
  await assert.rejects(() => download("https://upload.wikimedia.org/a.jpg", fakeFetch(Buffer.alloc(0))), /empty body/);
});

test("download backs off and retries a 429, then gives up; a 404 is refused at once", async () => {
  const answers = [429, 429, 200];
  const calls = [], slept = [];
  const flaky = async () => { const st = answers[calls.length]; calls.push(st); return { ok: st < 400, status: st, headers: { get: () => null }, arrayBuffer: async () => JPG }; };
  const sleepImpl = async ms => { slept.push(ms); };
  const got = await download("https://upload.wikimedia.org/a.jpg", flaky, { sleepImpl });
  assert.equal(got.ext, "jpg");
  assert.deepEqual(calls, [429, 429, 200]);
  assert.deepEqual(slept, RETRY_DELAYS_MS.slice(0, 2), "waits before each retry, growing");
  const always = async () => ({ ok: false, status: 429, headers: { get: () => null }, arrayBuffer: async () => JPG });
  await assert.rejects(() => download("https://upload.wikimedia.org/a.jpg", always, { sleepImpl }), /HTTP 429 after 4 attempts/);
  let n = 0;
  const gone = async () => { n++; return { ok: false, status: 404, headers: { get: () => null }, arrayBuffer: async () => JPG }; };
  await assert.rejects(() => download("https://upload.wikimedia.org/a.jpg", gone, { sleepImpl }), /HTTP 404/);
  assert.equal(n, 1, "a 404 is not retried");
  assert.ok(RETRY_DELAYS_MS.length >= 3 && RETRY_DELAYS_MS.every((d, i) => i === 0 || d > RETRY_DELAYS_MS[i - 1]));
});

test("the provenance line names the article and the File: page", () => {
  assert.equal(provenanceLine("covers/xenogears.jpg", "Xenogears", "Xenogears_box.jpg"),
    "- `covers/xenogears.jpg` — [Xenogears](https://en.wikipedia.org/wiki/Xenogears) (File:Xenogears_box.jpg, https://en.wikipedia.org/wiki/File:Xenogears_box.jpg)");
  assert.equal(provenanceLine("covers/parasite-eve.png", "Parasite Eve (video game)", "File:Parasite_Eve_Coverart.png"),
    "- `covers/parasite-eve.png` — [Parasite Eve (video game)](https://en.wikipedia.org/wiki/Parasite_Eve_(video_game)) (File:Parasite_Eve_Coverart.png, https://en.wikipedia.org/wiki/File:Parasite_Eve_Coverart.png)");
  assert.equal(wikiUrl("The Witcher 3: Wild Hunt"), "https://en.wikipedia.org/wiki/The_Witcher_3:_Wild_Hunt");
});

test("a re-fetch replaces the ledger line by slug, whatever the old extension was", () => {
  const ledger = "# head\n\n- `covers/wild-arms.png` — old\n- `covers/wild-arms-3.jpg` — keep\n- `covers/alundra.jpg` — keep\n";
  const out = ledgerWithout(ledger, "wild-arms");
  assert.doesNotMatch(out, /wild-arms\.png/, "the stale line under the old extension is gone");
  assert.match(out, /wild-arms-3\.jpg/, "a slug that merely starts the same is untouched");
  assert.match(out, /alundra\.jpg/);
  assert.match(out, /\n$/, "ends with exactly one newline so the next line appends cleanly");
  assert.doesNotMatch(out, /\n\n$/);
});

test("the contact sheet embeds every cover and escapes the titles", () => {
  const html = sheetHtml([{ title: "A <b>", pageTitle: "A", file: "a.jpg", ext: "jpg", b64: "AAAA", width: 240, height: 300, bytes: 3 }]);
  assert.match(html, /data:image\/jpg;base64,AAAA/);
  assert.match(html, /A &lt;b&gt;/);
  assert.doesNotMatch(html, /<b>A <b>/);
});

test("--selftest exits 0 and reports every guard", () => {
  const out = execFileSync("node", ["scripts/fetch_covers.mjs", "--selftest"], { encoding: "utf8" });
  assert.match(out, /SELFTEST: all \d+ guards hold/);
  assert.doesNotMatch(out, /FAIL/);
});
