/**
 * Offline tests for splice_rows.mjs — synthetic codex, synthetic digest, no disk writes.
 *
 *   node --test scripts/splice_rows.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { planSplice, serializeRow, appendToArray, updateDigest, parseCodex, logChange, ranges, stampDigest } from "./splice_rows.mjs";

const hash = s => createHash("sha256").update(s).digest("hex");

/** A codex small enough to read, shaped exactly like the real one. `tail` picks the
 *  array ending: the real file ends `}` with no comma, older splices left `},`. */
function codexHtml({ tail = "}" } = {}) {
  return `<!doctype html><html><body><script>
const CATS = {"Combat":"#a00","Progression & Upgrades":"#0a0"};
const BASE_MECHS = [
{id:"M001",game:"Lantern Vale",name:"First",cat:"Combat",how:"h",loop:"l",rating:0,want:""},
{id:"M002",game:"Lantern Vale",name:"Second",cat:"Combat",how:"h",loop:"l",rating:0,want:""${tail === "}" ? "}" : "},"}
];
const BASE_GAMES = [
{title:"Lantern Vale",year:1999,dev:"d",status:"Researched"},
{title:"Harbor Town",year:2001,dev:"d",status:"Researched"}
];
const PILLARS = [{n:1,t:"t",m:"m",q:"q"}];
const CHANGES = [
  {date:"2026-09-05", title:"Earlier", added:["M001-M002","g001"], updated:[]},
];
const MINIGAMES = [
{id:"g001",g:"Lantern Vale",n:"Arena",p:"p",r:"r",l:"l"${tail === "}" ? "}" : "},"}
];
/* ============================= STATE ============================= */
const REF_HOSTS = /^(gamefaqs\\.gamespot\\.com|[a-z0-9-]+\\.fandom\\.com)$/i;
</script></body></html>`;
}

const GF = "https://gamefaqs.gamespot.com/ps/1-lantern-vale/faqs/103";

function digestMd(block, { rowLines = true } = {}) {
  return [
    "# Lantern Vale — research digest", "",
    "## Sources", "| id | title |", "|---|---|", "| 103 | Power-Up FAQ |", "",
    "## Mechanics candidates", "",
    "### Cores that rewrite the class", "cat: Combat",
    "pointers: [gf:103 §Power-Ups, cinder v1.0] [wiki:lanternvale.fandom.com/Cores]",
    ...(rowLines ? ["row: <after the splice>"] : []),
    "- eight cores in the base game [gf:103 §Power-Ups, cinder v1.0]", "",
    "### The lantern count", "cat: Progression & Upgrades",
    "pointers: [gf:103 §SECRETS, cinder v1.0] [wiki:lanternvale.fandom.com/Lanterns]",
    ...(rowLines ? ["row: <after the splice>"] : []),
    "- the blue door opens at 12 [gf:103 §SECRETS, cinder v1.0]", "",
    "## Minigame candidates", "",
    "### Harbor arena", "pointers: [gf:103 §SECRETS, cinder v1.0] [wiki:lanternvale.fandom.com/Arena]",
    ...(rowLines ? ["row: <after the splice>"] : []),
    "", "## Codex rows", "", "```js", block, "```", "",
    "## Codex delta", "- (ids after the splice)", "",
  ].join("\n");
}

const GOOD_BLOCK = [
  `{id:"M+1",game:"Lantern Vale",name:"Cores",cat:"Combat",how:"How it works.",`,
  ` loop:"Find a core -> slot it -> your class changes.",want:"Yes",notes:"n",`,
  ` refs:[{u:"${GF}",t:"Power-Up FAQ by cinder (GameFAQs)"}]},`,
  `{id:"M+2",game:"Lantern Vale",name:"Lanterns",cat:"Progression & Upgrades",how:"How.",`,
  ` loop:"Light a lantern -> the door opens.",want:"Maybe",verbs:["Guarded"]},`,
  `{id:"g+1",g:"Lantern Vale",n:"Harbor arena",p:"p",r:"r",l:"l",`,
  ` rt:[{at:"30 wins",get:"Sun Sigil"}],refs:[{u:"${GF}",t:"Power-Up FAQ by cinder"}]}`,
].join("\n");

const plan = (block = GOOD_BLOCK, opts = {}, codexOpts = {}) =>
  planSplice(codexHtml(codexOpts), digestMd(block, opts));

test("ids continue each sequence from the current max", () => {
  const { assignments, problems } = plan();
  assert.deepEqual(problems, []);
  assert.deepEqual(assignments.map(a => a.id), ["M003", "M004", "g002"]);
  assert.deepEqual(assignments.map(a => a.candidate.name),
    ["Cores that rewrite the class", "The lantern count", "Harbor arena"]);
});

test("`->` becomes `→`, and the defaults the file expects are filled in", () => {
  const { assignments } = plan();
  const m = assignments[0].row;
  assert.match(m.loop, /Find a core → slot it → your class changes\./);
  assert.doesNotMatch(m.loop, /->/);
  assert.equal(assignments[1].row.rating, 0, "rating defaults to 0");
  assert.equal(assignments[1].row.want, "Maybe");
});

test("both array endings are appended to, and the result still evaluates", () => {
  for (const tail of ["}", "},"]) {
    const html = codexHtml({ tail });
    const { assignments } = planSplice(html, digestMd(GOOD_BLOCK));
    let out = appendToArray(html, "BASE_MECHS", assignments.filter(a => a.kind === "M").map(serializeRow));
    out = appendToArray(out, "MINIGAMES", assignments.filter(a => a.kind === "g").map(serializeRow));
    const codex = parseCodex(out);
    assert.equal(codex.nextM, 5, `tail ${tail}: mechanics did not land`);
    assert.equal(codex.nextG, 3, `tail ${tail}: minigames did not land`);
    assert.ok(!/,\s*,/.test(out), `tail ${tail}: doubled comma`);
    assert.ok(!/\}\s*\{/.test(out), `tail ${tail}: rows fused without a separator`);
  }
});

test("a dry run leaves the codex byte-identical", () => {
  const html = codexHtml();
  const before = hash(html);
  const { assignments } = planSplice(html, digestMd(GOOD_BLOCK));
  serializeRow(assignments[0]);
  assert.equal(hash(html), before, "planning must not mutate its input");
});

test("the digest gets its row: lines and a comment map", () => {
  const md = digestMd(GOOD_BLOCK);
  const { assignments, digest } = planSplice(codexHtml(), md);
  const out = updateDigest(md, assignments, digest);
  assert.match(out, /### Cores that rewrite the class\ncat: Combat\npointers: .*\nrow: M003\n/);
  assert.match(out, /### The lantern count[\s\S]*?\nrow: M004\n/);
  assert.match(out, /### Harbor arena[\s\S]*?\nrow: g002\n/);
  assert.doesNotMatch(out, /row: <after the splice>/);
  assert.match(out, /```js\n\/\/ Spliced into JRPG_Design_Codex\.html on \d{4}-\d\d-\d\d/);
  assert.match(out, /\/\/ M003 {2}Cores that rewrite the class\s+Combat/);
  assert.match(out, /\/\/ g002 {2}Harbor arena\s+rt: 1 rows/);
  assert.doesNotMatch(out, /id:"M\+1"/, "the placeholder block is retired");
});

test("a candidate with no row: line gets one inserted, without shifting later candidates", () => {
  const md = digestMd(GOOD_BLOCK, { rowLines: false });
  const { assignments, digest } = planSplice(codexHtml(), md);
  const out = updateDigest(md, assignments, digest);
  assert.match(out, /### Cores that rewrite the class[\s\S]*?\nrow: M003\n/);
  assert.match(out, /### The lantern count[\s\S]*?\nrow: M004\n/);
  assert.match(out, /### Harbor arena[\s\S]*?\nrow: g002\n/);
  // Each id appears exactly once — an off-by-one in the shift would double or skip one.
  for (const id of ["M003", "M004", "g002"]) {
    assert.equal(out.split(`row: ${id}`).length - 1, 1, `${id} written once`);
  }
});

test("every refusal fires, and none of them is the parser being lenient", () => {
  const cases = [
    ["unknown cat", `{id:"M+1",game:"Lantern Vale",name:"n",cat:"Nope",how:"h",loop:"l"}`,
      /cat "Nope" is not a CATS key/],
    ["unrostered game", `{id:"M+1",game:"Atlantis",name:"n",cat:"Combat",how:"h",loop:"l"}`,
      /game "Atlantis" has no BASE_GAMES row/],
    ["bad want", `{id:"M+1",game:"Lantern Vale",name:"n",cat:"Combat",how:"h",loop:"l",want:"Sure"}`,
      /want "Sure" is not Yes\/Maybe\/No/],
    ["missing field", `{id:"M+1",game:"Lantern Vale",name:"n",cat:"Combat",how:"h"}`,
      /field `loop` is missing or empty/],
    ["ref host not allowed", `{id:"M+1",game:"Lantern Vale",name:"n",cat:"Combat",how:"h",loop:"l",refs:[{u:"https://evil.example.com/x",t:"t"}]}`,
      /evil\.example\.com is not an allowed https host/],
    ["ref not https", `{id:"M+1",game:"Lantern Vale",name:"n",cat:"Combat",how:"h",loop:"l",refs:[{u:"http://gamefaqs.gamespot.com/x",t:"t"}]}`,
      /is not an allowed https host/],
    ["ref with no label", `{id:"M+1",game:"Lantern Vale",name:"n",cat:"Combat",how:"h",loop:"l",refs:[{u:"${GF}"}]}`,
      /has no label `t`/],
    ["empty rt row", `{id:"g+1",g:"Lantern Vale",n:"n",p:"p",r:"r",l:"l",rt:[{at:"",get:"Sigil"}]}`,
      /rt\[0\] needs a non-empty `at` and `get`/],
    ["placeholder past the candidate list", `{id:"M+9",game:"Lantern Vale",name:"n",cat:"Combat",how:"h",loop:"l"}`,
      /M\+9 names mechanics candidate #9, but the digest has 2/],
    ["not a placeholder", `{id:"M266",game:"Lantern Vale",name:"n",cat:"Combat",how:"h",loop:"l"}`,
      /is not a placeholder like "M\+1"/],
    ["claimed twice", `{id:"M+1",game:"Lantern Vale",name:"a",cat:"Combat",how:"h",loop:"l"},\n{id:"M+1",game:"Lantern Vale",name:"b",cat:"Combat",how:"h",loop:"l"}`,
      /M\+1 is claimed twice/],
  ];
  for (const [name, block, expect] of cases) {
    const { problems } = plan(block);
    assert.ok(problems.some(p => expect.test(p)),
      `${name}: no problem matched ${expect} — got ${JSON.stringify(problems)}`);
  }
});

test("a digest with nothing to splice is refused, not silently applied", () => {
  const already = "// M262  Monster coins   Economy & Currency\n// g090  Rod's duels    rt: 6 rows";
  assert.throws(() => plan(already), /already spliced/);
  assert.throws(() => plan(`{id:"M+1" game:"Lantern Vale"}`), /does not parse as row literals/);
  assert.throws(() => planSplice(codexHtml(), "# no rows section here"), /no `## Codex rows` section/);
  assert.throws(() => planSplice(codexHtml(), "\n## Codex rows\n\nprose, no fence\n"), /no ```js block/);
});

test("an ambiguous or missing array anchor is refused rather than guessed", () => {
  const html = codexHtml();
  const rows = [`{id:"M003",game:"Lantern Vale",name:"n",cat:"Combat",how:"h",loop:"l"}`];
  assert.throws(() => appendToArray(html, "BASE_NOPE", rows), /could not find `const BASE_NOPE = \[`/);
  const doubled = html.replace("const BASE_MECHS = [", "const BASE_MECHS = [\n// const BASE_MECHS = [");
  assert.throws(() => appendToArray(doubled, "BASE_MECHS", rows), /appears more than once/);
});

test("a codex whose REF_HOSTS cannot be read refuses instead of skipping the check", () => {
  const blind = codexHtml().replace(/const REF_HOSTS = .*/, "const REF_HOSTS = whatever;");
  assert.throws(() => parseCodex(blind), /could not read `const REF_HOSTS`/);
});

test("serialized rows carry every field through unchanged", () => {
  const { assignments } = plan();
  const [m, , g] = assignments;
  const back = new Function("return [" + serializeRow(m) + "," + serializeRow(g) + "]")();
  assert.deepEqual(back[0], m.row);
  assert.deepEqual(back[1], g.row);
  assert.match(serializeRow(assignments[1]), /verbs:\["Guarded"\]/);
});

test("ranges collapses runs and leaves singletons alone", () => {
  assert.deepEqual(ranges(["M266","M267","M268","M270"]), ["M266-M268","M270"]);
  assert.deepEqual(ranges(["g093","M266","g094"]), ["M266","g093-g094"]);
  assert.deepEqual(ranges(["M009","M010"]), ["M009-M010"], "padding is preserved across the ten boundary");
  assert.deepEqual(ranges(["M266","M266"]), ["M266"]);
});

test("a splice logs itself in CHANGES, newest first", () => {
  const html = codexHtml();
  const out = logChange(html, { date: "2026-09-06", title: "Golden Sun", ids: ["M003","M004","g002"] });
  assert.match(out, /const CHANGES = \[\n  \{date:"2026-09-06", title:"Golden Sun",\n   added:\["M003-M004","g002"\], updated:\[\]\},\n  \{date:"2026-09-05"/);
  // The page's own reader must accept what the splicer wrote.
  const { CHANGES, expandIds } = evalChanges(out);
  assert.equal(CHANGES[0].date, "2026-09-06");
  assert.deepEqual(expandIds(CHANGES[0].added), ["M003","M004","g002"]);
});

test("a second splice on the same day widens that day's entry instead of adding another", () => {
  // Two entries sharing a date would break the strictly-decreasing order the validator
  // enforces, so the same-day path must merge — including across an existing range.
  let out = logChange(codexHtml(), { date: "2026-09-06", title: "Golden Sun", ids: ["M003","M004"] });
  out = logChange(out, { date: "2026-09-06", title: "Paper Mario", ids: ["M005","g002"] });
  const { CHANGES, expandIds } = evalChanges(out);
  assert.equal(CHANGES.length, 2, "still one entry for today");
  assert.equal(CHANGES[0].title, "Golden Sun", "the first title of the day stands");
  assert.deepEqual(expandIds(CHANGES[0].added), ["M003","M004","M005","g002"]);
  assert.deepEqual(CHANGES.map(c => c.date), ["2026-09-06","2026-09-05"]);
});

test("a splice stamps digest:<slug> on every game row it touched, and only those", () => {
  const html = stampDigest(codexHtml(), ["Lantern Vale", "Lantern Vale"], "lantern-vale");
  const games = new Function(html.slice(html.indexOf("const CATS"), html.indexOf("/* ============================= STATE")) + "; return BASE_GAMES;")();
  assert.equal(games.find(g => g.title === "Lantern Vale").digest, "lantern-vale");
  assert.equal(games.find(g => g.title === "Harbor Town").digest, undefined);
  assert.match(html, /status:"Researched",\ndigest:"lantern-vale"\},/, "one owned line, last in the row");
  assert.throws(() => stampDigest(codexHtml(), ["No Such Game"], "x"), /no BASE_GAMES row titled/);
});

test("a codex with no changelog is refused, not silently spliced", () => {
  const noLog = codexHtml().replace(/const CHANGES = \[[\s\S]*?\n\];/, "");
  assert.throws(() => logChange(noLog, { date: "2026-09-06", title: "x", ids: ["M003"] }),
    /could not find `const CHANGES = \[`/);
  const doubled = codexHtml().replace("const CHANGES = [", "const CHANGES = [\n// const CHANGES = [");
  assert.throws(() => logChange(doubled, { date: "2026-09-06", title: "x", ids: ["M003"] }),
    /appears more than once/);
});

/** Read CHANGES + expandIds back out of a page, the way the app and validator do. */
function evalChanges(html) {
  const script = html.slice(html.indexOf("<script>") + 8, html.lastIndexOf("</script>"));
  const src = script.slice(script.indexOf("const CATS"), script.indexOf("/* ============================= STATE"));
  return new Function(src + `
    function expandIds(list){ const out=[]; (list||[]).forEach(e=>{ const s=String(e),
      r=s.match(/^([Mg])(\\d+)-([Mg])(\\d+)$/);
      if(r){ const a=+r[2],b=+r[4],w=r[2].length; for(let i=a;i<=b;i++) out.push(r[1]+String(i).padStart(w,"0")); return; }
      out.push(s); }); return out; }
    return {CHANGES, expandIds};`)();
}
