#!/usr/bin/env node
/**
 * Prints the one-liner that arms gf_probe.js inside a GameFAQs page.
 *
 *   node scripts/gf_bootstrap.mjs                   the arm line (fetches the probe)
 *   node scripts/gf_bootstrap.mjs --ref <branch>    arm from a branch instead of main
 *   node scripts/gf_bootstrap.mjs --paste           the fallback: the whole probe inline
 *
 * Why: the probe is ~22KB and a page navigation wipes it, so the naive flow re-pastes the
 * whole thing about twelve times per game — the single largest cost of a research pass.
 * The repo is public, and a GameFAQs page is allowed to fetch raw.githubusercontent.com
 * (measured 2026-09-06), so the arm line pulls the probe over the network instead: our own
 * script, from our own public repo, with no credentials and nothing sent anywhere.
 *
 * Three things this got wrong once, all now built in:
 *   - It FETCHES first and falls back to the cached copy only if the network fails. A cache
 *     preferred over the network serves yesterday's probe after you fix a bug in it, and the
 *     symptom is a probe that "ignores" your change.
 *   - It deletes `window.__gf` first. The probe's second-eval guard is deliberate, so
 *     without the delete a re-arm silently keeps the old object on the same page.
 *   - It SAYS where the probe came from (`from:"network"|"cache"`, plus `len` and the
 *     fetch error): a fallback that serves yesterday's probe without announcing itself is
 *     how a fix "did nothing" for three re-arms in a row (2026-06-27 lesson, met again).
 *   - It appends `?t=<now>` to the fetch. raw.githubusercontent.com's CDN serves a branch
 *     file for five minutes after a push (cache-control: max-age=300), and `no-store` only
 *     bypasses the browser's own cache — the live proof for game() ran the pre-fix probe
 *     twice before the fetched length gave it away (2026-09-06). The host ignores the query.
 *
 * A ref is always spelled `refs/heads/<name>`: a branch name containing a slash makes the
 * short raw URL ambiguous, and raw.githubusercontent answers 404 rather than guessing.
 */

import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const KEY = "__gf_src";
export const RAW = "https://raw.githubusercontent.com/Ali0600/jrpg-design-codex";

export function probeUrl(ref = "main") {
  return `${RAW}/refs/heads/${ref}/scripts/gf_probe.js`;
}

/** The arm line: fetch the probe, cache it, run it — and say what it did. */
export function armText(ref = "main") {
  return `(async()=>{try{delete window.__gf}catch(e){window.__gf=undefined}`
    + `var K=${JSON.stringify(KEY)},s=null,from="network",why="";`
    + `try{s=await(await fetch(${JSON.stringify(probeUrl(ref))}+"?t="+Date.now(),{cache:"no-store"})).text();`
    + `if(s.length<1000)throw new Error("short read "+s.length);localStorage.setItem(K,s)}`
    + `catch(e){s=localStorage.getItem(K);from="cache";why=String(e&&e.message||e)}`
    + `if(!s)return{armed:false,why:"no network and nothing cached: "+why};`
    + `var r=eval(s);`
    + `return{armed:r,from:from,len:s.length,why:why,page:window.__gf?window.__gf.page():null}})()`;
}

/** The fallback for a page that blocks the fetch: the probe itself, inline. */
export function pasteText(src) {
  return `try{delete window.__gf}catch(e){window.__gf=undefined};`
    + `try{localStorage.setItem(${JSON.stringify(KEY)},${JSON.stringify(src)})}catch(e){};`
    + `eval(localStorage.getItem(${JSON.stringify(KEY)}))`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const argv = process.argv.slice(2);
  const ref = argv.includes("--ref") ? argv[argv.indexOf("--ref") + 1] : "main";
  if (argv.includes("--paste")) {
    const text = pasteText(readFileSync(join(ROOT, "scripts", "gf_probe.js"), "utf8"));
    process.stderr.write(`# fallback paste, ${text.length} chars — only if the page blocks the fetch\n`);
    console.log(text);
  } else {
    process.stderr.write(`# arm line (${armText(ref).length} chars), pulling the probe from ${ref}\n`);
    console.log(armText(ref));
  }
}
