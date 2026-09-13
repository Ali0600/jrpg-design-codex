/**
 * Offline tests for the local-date helper and for the scripts that date their writes with it.
 *
 *   node --test scripts/dates.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { planSplice, updateDigest } from "./splice_rows.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATES = pathToFileURL(join(ROOT, "scripts", "dates.mjs")).href;

/** localToday() evaluated in a child process whose time zone is `tz`, fixed at its startup. */
const todayIn = (tz, iso) => execFileSync(process.execPath, ["--input-type=module", "-e",
  `import { localToday } from ${JSON.stringify(DATES)}; process.stdout.write(localToday(new Date(${JSON.stringify(iso)})));`],
  { env: { ...process.env, TZ: tz }, encoding: "utf8" });

const SYNTHETIC_DIGEST = [
  "# Synthetic — research digest", "",
  "## Mechanics candidates", "",
  "### A synthetic row",
  "pointers: [gf:1 §Section, author v1] [wiki:example.fandom.com/Page]", "",
  "## Codex rows", "",
  "```js",
  '{id:"M+1",game:"Persona 4",name:"A synthetic row",cat:"Combat",how:"h",loop:"l"}',
  "```", "",
].join("\n");

test("today is the local calendar day, not the UTC one, on both sides of Greenwich", () => {
  // 23:09 UTC on the 13th is 01:09 on the 14th in Berlin: the moment a splice was filed under yesterday.
  assert.equal(todayIn("Europe/Berlin", "2026-09-13T23:09:00Z"), "2026-09-14");
  // 03:00 UTC on the 14th is still the evening of the 13th in Los Angeles.
  assert.equal(todayIn("America/Los_Angeles", "2026-09-14T03:00:00Z"), "2026-09-13");
  assert.equal(todayIn("UTC", "2026-09-13T23:09:00Z"), "2026-09-13");
});

test("no script dates a write from an ISO string cut to ten characters, which is the UTC day", () => {
  const dir = join(ROOT, "scripts");
  const offenders = readdirSync(dir)
    .filter(f => f.endsWith(".mjs") && !f.endsWith(".test.mjs"))
    .filter(f => /toISOString\(\)\.slice\(0,\s*10\)/.test(readFileSync(join(dir, f), "utf8")));
  assert.deepEqual(offenders, []);
});

test("splice_rows --today pins the date its changelog entry would carry", () => {
  const tmp = mkdtempSync(join(tmpdir(), "codex-dates-"));
  try {
    const digest = join(tmp, "synthetic.md");
    writeFileSync(digest, SYNTHETIC_DIGEST);
    const out = execFileSync(process.execPath, ["scripts/splice_rows.mjs", "--today", "2026-09-20", digest], { cwd: ROOT, encoding: "utf8" });
    assert.match(out, /would log M\d+ under 2026-09-20/);
    assert.match(out, /nothing written/);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test("the digest's splice note carries the same pinned date", () => {
  const html = readFileSync(join(ROOT, "JRPG_Design_Codex.html"), "utf8");
  const { assignments, digest, problems } = planSplice(html, SYNTHETIC_DIGEST);
  assert.deepEqual(problems, []);
  assert.match(updateDigest(SYNTHETIC_DIGEST, assignments, digest, "2026-09-20"), /Spliced into JRPG_Design_Codex\.html on 2026-09-20 by/);
});
