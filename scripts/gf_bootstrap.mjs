#!/usr/bin/env node
/**
 * Prints the two pastes that arm gf_probe.js in the Browser pane.
 *
 *   node scripts/gf_bootstrap.mjs           the one-time paste (stores the probe, then runs it)
 *   node scripts/gf_bootstrap.mjs --rearm   the one-liner for every page after that
 *
 * Why: the probe is ~21KB and a page navigation wipes it, so the naive flow re-pastes the
 * whole thing about twelve times per game — the single largest cost of a research pass.
 * The first paste parks the probe's own source under one key in the gamefaqs origin's
 * localStorage; every later page re-arms with forty characters.
 *
 * What this stores is OUR script, in OUR browser, under OUR key. It reads nothing the site
 * put there, sends nothing anywhere, and stores no guide text. If the page's CSP blocks
 * `eval`, this simply fails and the flow falls back to pasting the probe each time.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const KEY = "__gf_src";
export const REARM = `eval(localStorage.getItem(${JSON.stringify(KEY)}))`;

/** The one-time paste: store this source, then run it from storage — so page one proves
 *  the stored copy is the one that works, rather than assuming it on page two. */
export function bootstrapText(src) {
  return `try{localStorage.setItem(${JSON.stringify(KEY)},${JSON.stringify(src)})}catch(e){};${REARM}`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === join(process.argv[1])) {
  const src = readFileSync(join(ROOT, "scripts", "gf_probe.js"), "utf8");
  if (process.argv.includes("--rearm")) {
    console.log(REARM);
  } else {
    const text = bootstrapText(src);
    process.stderr.write(
      `# one-time paste for this origin (${text.length} chars). Later pages: ` +
      `node scripts/gf_bootstrap.mjs --rearm (${REARM.length} chars)\n`
    );
    console.log(text);
  }
}
