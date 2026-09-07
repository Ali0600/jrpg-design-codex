#!/usr/bin/env node
/**
 * Fetches a cover thumbnail for every roster game from Wikipedia, records where each one
 * came from, and writes `cover` + `wp` onto the game's row.
 *
 *   node scripts/fetch_covers.mjs                          dry run: what every title resolves to
 *   node scripts/fetch_covers.mjs --write                  download, write covers/<slug>.<ext>,
 *                                                          set cover + wp, log provenance, build
 *                                                          a contact sheet for VISUAL curation
 *   node scripts/fetch_covers.mjs --only "<title>" [--only …]   just these rows
 *   node scripts/fetch_covers.mjs --only "<title>" --file "Box_art.jpg" --write
 *                                                          a named File: instead of the page image
 *   node scripts/fetch_covers.mjs --force                  re-fetch rows that already have a cover
 *   node scripts/fetch_covers.mjs --selftest               the pure guards, no network
 *
 * Source: the MediaWiki API's `pageimages` (each article's lead image, which for a game is
 * its box art), asked with `pilicense=any` because box art is a non-free file, and with
 * `pithumbsize=240` so Wikipedia serves the thumbnail itself — no resize step, no sips,
 * nothing platform-specific. Measured 2026-09-06 on four titles and 2026-09-07 on all 72.
 *
 * The row's `wp` field is the override: the script asks for `wp ?? title`, follows
 * `normalized` + `redirects`, refuses a disambiguation page or a missing one, and writes
 * the RESOLVED article title back into `wp`, so the next run is deterministic and the
 * page can link the article.
 *
 * Bytes are checked, not trusted: only upload.wikimedia.org may serve them, at most
 * MAX_BYTES, and the extension comes from the magic bytes (Fandom once served WebP under
 * a .png name). And an image is a CLAIM about its content until someone has looked at it:
 * `--write` builds a contact sheet, and the rule is to view every cover before shipping —
 * an article's lead image is sometimes a logo, a deluxe-edition photo, or the remake's box.
 */

import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Refusal, refuse, evalCodex, setOwnedFields } from "./game_rows.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CODEX = join(ROOT, "JRPG_Design_Codex.html");
const LEDGER = join(ROOT, "covers", "SOURCES.md");

export const API = "https://en.wikipedia.org/w/api.php";
export const WIKI = "https://en.wikipedia.org/wiki/";
export const IMG_HOST = /^upload\.wikimedia\.org$/;
export const USER_AGENT = "jrpg-design-codex/1.0 (https://github.com/Ali0600/jrpg-design-codex; personal game-design research)";
export const MAX_BYTES = 2 * 1024 * 1024;
export const WIDTH = 240;
export const BATCH = 50;
const PAUSE_MS = 1000;
/** Backoff for a 429 or a 5xx on the image host: transient on a route that just worked. */
export const RETRY_DELAYS_MS = [2000, 4000, 8000];

export const LEDGER_HEADER = `# Cover image sources

Every cover thumbnail, the Wikipedia article it was taken from, and the file it was derived
from. Box art is the property of its publishers, reproduced at thumbnail size (${WIDTH}px
wide) solely to identify each game beside its design commentary; every file's article and
\`File:\` page are recorded so the rationale and the original are one click away.

`;

// ------------------------------------------------------------------- pure

/** "Final Fantasy VII (1997)" -> final-fantasy-vii-1997; "NieR: Automata" -> nier-automata */
export function slugOf(title) {
  return String(title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export const wpTitleFor = row => (row.wp != null && String(row.wp).trim() !== "" ? String(row.wp) : String(row.title));

/** The API's query parameters — pinned here because the tests pin them too. */
export function buildQuery(titles) {
  return {
    action: "query", prop: "pageimages|pageprops", ppprop: "disambiguation",
    pithumbsize: String(WIDTH), pilicense: "any", redirects: "1",
    format: "json", formatversion: "2", titles: titles.join("|"),
  };
}

/**
 * Fold `normalized` and `redirects` so each INPUT title maps to its page object (or to
 * `{ missing: true }`). A title Wikipedia normalises ("Wild ARMs" -> "Wild ARMs" is the
 * same, but underscores and first-letter case are not) and then redirects ("Wild Arms")
 * would otherwise be lost between the two lists.
 */
export function mapResolved(query, titles) {
  const norm = Object.fromEntries((query.normalized || []).map(n => [n.from, n.to]));
  const redir = Object.fromEntries((query.redirects || []).map(r => [r.from, r.to]));
  const pages = Object.fromEntries((query.pages || []).map(p => [p.title, p]));
  const out = {};
  for (const t of titles) {
    let cur = norm[t] ?? t;
    const seen = new Set();
    while (redir[cur] && !seen.has(cur)) { seen.add(cur); cur = redir[cur]; }
    out[t] = pages[cur] ?? { title: cur, missing: true };
  }
  return out;
}

/** What to fetch for one page, or why not. */
export function pickThumb(page) {
  if (!page || page.missing) return { ok: false, why: "missing" };
  if (page.pageprops && "disambiguation" in page.pageprops) return { ok: false, why: "disambiguation" };
  const th = page.thumbnail;
  if (!th || !th.source) return { ok: false, why: "no page image" };
  let u;
  try { u = new URL(th.source); } catch { return { ok: false, why: "bad image host" }; }
  if (u.protocol !== "https:" || !IMG_HOST.test(u.hostname)) return { ok: false, why: "bad image host" };
  return { ok: true, source: th.source, file: String(page.pageimage || ""), pageTitle: page.title, width: th.width, height: th.height };
}

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
/** The extension the BYTES say, never the one the name says. */
export function magicExt(buf) {
  const b = Buffer.from(buf);
  if (b.length >= 8 && b.subarray(0, 8).equals(PNG)) return "png";
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b.length >= 12 && b.subarray(0, 4).toString("latin1") === "RIFF" && b.subarray(8, 12).toString("latin1") === "WEBP") return "webp";
  refuse(`not a JPEG, PNG or WebP (starts ${b.subarray(0, 8).toString("hex")})`);
}

export const wikiUrl = title => WIKI + encodeURIComponent(String(title).replace(/ /g, "_")).replace(/%3A/g, ":").replace(/%2C/g, ",").replace(/%28/g, "(").replace(/%29/g, ")");

/**
 * The ledger minus any line for this SLUG — a re-fetch may change the extension
 * (wild-arms.png became wild-arms.jpg), and a stale line under the old name would claim a
 * file that no longer exists.
 */
export function ledgerWithout(ledger, slug) {
  return ledger.split("\n").filter(l => !l.startsWith(`- \`covers/${slug}.`)).join("\n").replace(/\n*$/, "\n");
}

export function provenanceLine(rel, pageTitle, file) {
  const f = String(file).replace(/^File:/, "");
  return `- \`${rel}\` — [${pageTitle}](${wikiUrl(pageTitle)}) (File:${f}, ${wikiUrl("File:" + f)})`;
}

/** A page of every downloaded cover, embedded as data URIs so it renders from anywhere. */
export function sheetHtml(entries) {
  const cells = entries.map(e => `<figure><img src="data:image/${e.ext};base64,${e.b64}" alt=""><figcaption><b>${esc(e.title)}</b><br>${esc(e.pageTitle)}<br><small>File:${esc(e.file)} · ${e.width}×${e.height} · ${e.bytes} B</small></figcaption></figure>`);
  return `<!doctype html><meta charset="utf-8"><title>covers — contact sheet</title>
<style>body{font:13px system-ui;background:#111;color:#ddd;margin:16px}figure{display:inline-block;width:200px;margin:8px;vertical-align:top;text-align:center}img{max-width:180px;border:1px solid #444;background:#000}figcaption{margin-top:4px}small{color:#999}</style>
<h1>${entries.length} covers — look at every one before shipping</h1>${cells.join("\n")}`;
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ---------------------------------------------------------------- network

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function apiGet(params, fetchImpl) {
  const url = API + "?" + new URLSearchParams(params).toString();
  const res = await fetchImpl(url, { headers: { "User-Agent": USER_AGENT, Accept: "application/json" } });
  if (!res.ok) refuse(`Wikipedia API answered ${res.status} for ${url.slice(0, 120)}…`);
  const body = await res.json();
  if (!body || !body.query) refuse(`Wikipedia API answered without a query object: ${JSON.stringify(body).slice(0, 200)}`);
  return body.query;
}

/**
 * Bytes from the image host only, bounded, checked by their magic. A 429 or a 5xx is
 * retried with backoff — the first full run died at file 31 on a 429 from a host that had
 * just served thirty (2026-09-07); a 404 is permanent and refused at once.
 */
export async function download(source, fetchImpl = fetch, { delays = RETRY_DELAYS_MS, sleepImpl = sleep } = {}) {
  const u = new URL(source);
  if (u.protocol !== "https:" || !IMG_HOST.test(u.hostname)) refuse(`refusing to download from ${u.hostname}`);
  let res;
  for (let attempt = 0; ; attempt++) {
    res = await fetchImpl(source, { headers: { "User-Agent": USER_AGENT } });
    const transient = res.status === 429 || res.status >= 500;
    if (!transient || attempt >= delays.length) break;
    await sleepImpl(delays[attempt]);
  }
  if (!res.ok) refuse(`${source}: HTTP ${res.status}${res.status === 429 || res.status >= 500 ? ` after ${delays.length + 1} attempts` : ""}`);
  const len = Number(res.headers && res.headers.get && res.headers.get("content-length"));
  if (Number.isFinite(len) && len > MAX_BYTES) refuse(`${source}: ${len} bytes is over the ${MAX_BYTES}-byte cap`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > MAX_BYTES) refuse(`${source}: ${buf.length} bytes is over the ${MAX_BYTES}-byte cap`);
  if (!buf.length) refuse(`${source}: empty body`);
  return { buf, ext: magicExt(buf) };
}

/** A named File: page's thumbnail at WIDTH, for the --file override. */
async function fileThumb(file, fetchImpl) {
  const f = "File:" + String(file).replace(/^File:/, "");
  const q = await apiGet({ action: "query", prop: "imageinfo", iiprop: "url|size", iiurlwidth: String(WIDTH), titles: f, format: "json", formatversion: "2" }, fetchImpl);
  const p = (q.pages || [])[0];
  const ii = p && !p.missing && p.imageinfo && p.imageinfo[0];
  if (!ii) refuse(`${f}: no such file on Wikipedia`);
  return { ok: true, source: ii.thumburl || ii.url, file: f.replace(/^File:/, ""), width: ii.thumbwidth || ii.width, height: ii.thumbheight || ii.height };
}

// ------------------------------------------------------------------- main

async function main(argv) {
  const write = argv.includes("--write"), force = argv.includes("--force");
  const only = argv.flatMap((a, i) => (a === "--only" ? [argv[i + 1]] : []));
  const arg = (flag, dflt) => (argv.includes(flag) ? argv[argv.indexOf(flag) + 1] : dflt);
  const fileOverride = arg("--file", null);
  const codexPath = resolve(ROOT, arg("--codex", CODEX));
  const sheetPath = resolve(arg("--sheet", join(tmpdir(), "covers-sheet.html")));
  if (fileOverride && only.length !== 1) refuse("--file needs exactly one --only <title>");

  let html = readFileSync(codexPath, "utf8");
  const { BASE_GAMES } = evalCodex(html);
  const rows = BASE_GAMES.filter(g => (only.length ? only.includes(g.title) : true) && (force || g.cover == null));
  for (const t of only) if (!BASE_GAMES.some(g => g.title === t)) refuse(`no BASE_GAMES row titled ${JSON.stringify(t)}`);
  if (!rows.length) { console.log("nothing to do — every selected row already has a cover (use --force to re-fetch)"); return; }

  // Resolve every row's article in batches of BATCH titles.
  const plan = [];
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const asked = chunk.map(wpTitleFor);
    const resolved = mapResolved(await apiGet(buildQuery(asked), fetch), asked);
    for (const [j, g] of chunk.entries()) {
      const page = resolved[asked[j]];
      const pick = fileOverride ? await fileThumb(fileOverride, fetch) : pickThumb(page);
      if (fileOverride) pick.pageTitle = page && !page.missing ? page.title : wpTitleFor(g);
      plan.push({ row: g, asked: asked[j], page, pick });
    }
  }

  const w = Math.max(...plan.map(p => p.row.title.length));
  for (const p of plan) {
    const target = `covers/${slugOf(p.row.title)}.<ext>`;
    console.log(p.pick.ok
      ? `${p.row.title.padEnd(w)}  → ${p.pick.pageTitle.padEnd(44)} File:${p.pick.file} ${p.pick.width}×${p.pick.height} → ${target}`
      : `${p.row.title.padEnd(w)}  ✗ ${p.asked.padEnd(44)} ${p.pick.why}${p.pick.why === "disambiguation" || p.pick.why === "missing" || p.pick.why === "no page image" ? " — set wp: with game_rows.mjs, or --file" : ""}`);
  }
  const ready = plan.filter(p => p.pick.ok), refused = plan.filter(p => !p.pick.ok);
  console.log(`\n${ready.length} ready, ${refused.length} unresolved`);
  if (!write) { console.log("dry run: nothing downloaded, nothing written. Re-run with --write."); return; }

  mkdirSync(join(ROOT, "covers"), { recursive: true });
  if (!existsSync(LEDGER)) writeFileSync(LEDGER, LEDGER_HEADER);
  const entries = [];
  for (const p of ready) {
    const { buf, ext } = await download(p.pick.source, fetch);
    const slug = slugOf(p.row.title);
    const rel = `covers/${slug}.${ext}`;
    for (const old of ["jpg", "png", "webp"]) {
      const stale = join(ROOT, `covers/${slug}.${old}`);
      if (old !== ext && existsSync(stale)) unlinkSync(stale);
    }
    writeFileSync(join(ROOT, rel), buf);
    html = setOwnedFields(html, p.row.title, { cover: rel, wp: p.pick.pageTitle });
    writeFileSync(codexPath, html);
    const ledger = readFileSync(LEDGER, "utf8");
    const line = provenanceLine(rel, p.pick.pageTitle, p.pick.file);
    writeFileSync(LEDGER, ledgerWithout(ledger, slug) + line + "\n");
    entries.push({ title: p.row.title, pageTitle: p.pick.pageTitle, file: p.pick.file, ext, b64: buf.toString("base64"), width: p.pick.width, height: p.pick.height, bytes: buf.length });
    console.log(`wrote ${rel} (${buf.length} B) · wp:${JSON.stringify(p.pick.pageTitle)}`);
    await sleep(PAUSE_MS);
  }
  // The sheet shows EVERY cover on disk, not just this run's, so a resumed run still
  // ends with the whole set in front of whoever is curating.
  const all = evalCodex(readFileSync(codexPath, "utf8")).BASE_GAMES.filter(g => g.cover).map(g => {
    const buf = readFileSync(join(ROOT, g.cover));
    const fresh = entries.find(e => e.title === g.title);
    return { title: g.title, pageTitle: g.wp, file: fresh ? fresh.file : "(see covers/SOURCES.md)", ext: g.cover.split(".").pop(), b64: buf.toString("base64"), width: fresh ? fresh.width : "?", height: fresh ? fresh.height : "?", bytes: buf.length };
  });
  writeFileSync(sheetPath, sheetHtml(all));
  console.log(`\n${entries.length} covers written this run, ${all.length} on disk; provenance in covers/SOURCES.md.`);
  console.log(`Contact sheet: ${sheetPath} — LOOK AT EVERY COVER before committing (logos, deluxe editions and remakes hide behind plausible file names).`);
  console.log("Then: node scripts/validate_codex.mjs --selftest");
}

// ---------------------------------------------------------------- selftest

export function selftest() {
  const cases = [];
  const check = (label, fn, expect) => {
    let got;
    try { got = fn(); } catch (e) { got = e instanceof Refusal ? "REFUSED" : "THREW " + e.message; }
    const ok = JSON.stringify(got) === JSON.stringify(expect);
    cases.push(ok);
    console.log(`${ok ? "PASS" : "FAIL"}  ${label}${ok ? "" : ` — got ${JSON.stringify(got)}, expected ${JSON.stringify(expect)}`}`);
  };
  check("slug strips punctuation", () => slugOf("Final Fantasy VII (1997)"), "final-fantasy-vii-1997");
  check("slug keeps roman numerals", () => slugOf("Kingdom Hearts II"), "kingdom-hearts-ii");
  check("a missing page is refused", () => pickThumb({ missing: true }).why, "missing");
  check("a disambiguation page is refused", () => pickThumb({ title: "Parasite Eve", pageprops: { disambiguation: "" }, thumbnail: { source: "https://upload.wikimedia.org/x.jpg" } }).why, "disambiguation");
  check("a page without a lead image is refused", () => pickThumb({ title: "Grandia" }).why, "no page image");
  check("a thumbnail off the image host is refused", () => pickThumb({ title: "X", thumbnail: { source: "https://example.com/x.jpg" } }).why, "bad image host");
  check("a real page is accepted", () => pickThumb({ title: "Xenogears", pageimage: "Xenogears_box.jpg", thumbnail: { source: "https://upload.wikimedia.org/a/b.jpg", width: 240, height: 225 } }).ok, true);
  check("PNG by magic", () => magicExt(Buffer.concat([PNG, Buffer.alloc(4)])), "png");
  check("JPEG by magic", () => magicExt(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0])), "jpg");
  check("WebP by magic", () => magicExt(Buffer.from("RIFF\0\0\0\0WEBPVP8 ", "latin1")), "webp");
  check("HTML is not an image", () => magicExt(Buffer.from("<!doctype html>")), "REFUSED");
  check("the query asks for non-free lead images at the thumbnail width", () => { const q = buildQuery(["A"]); return [q.pilicense, q.pithumbsize, q.redirects, q.ppprop]; }, ["any", String(WIDTH), "1", "disambiguation"]);
  const ok = cases.every(Boolean);
  console.log(ok ? `SELFTEST: all ${cases.length} guards hold` : "GUARD FAILURE");
  return ok ? 0 : 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const argv = process.argv.slice(2);
  if (argv.includes("--selftest")) process.exit(selftest());
  main(argv).catch(e => {
    if (!(e instanceof Refusal)) throw e;
    console.error(`refused: ${e.message}`);
    process.exit(1);
  });
}
