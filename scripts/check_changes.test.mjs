/**
 * Offline tests for check_changes.mjs — two synthetic pages, no git, no network.
 *
 *   node --test scripts/check_changes.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { diffChanges, readVersion } from "./check_changes.mjs";

/**
 * A miniature codex. `tail` picks the array ending the real file uses (`}` / `},`).
 *
 * `verbs` is opt-in and emits NOTHING when absent, deliberately: the key-reordering test
 * below hardcodes M117's whole row literal twice, so a `verbs:[]` that appeared by default
 * would stop those two `.replace()` calls matching.
 */
function page({ m117 = "the original note", changes = null, tail = "}", extraRow = "", verbs = null } = {}) {
  const log = changes ?? [
    `{date:"2026-09-05", title:"Pilot", added:["M117-M118","g001"], updated:[]}`,
  ];
  return `<!doctype html><html><body><script>
const CATS = {"Combat":"#a00"};
const BASE_MECHS = [
{id:"M117",game:"Lantern Vale",name:"First",cat:"Combat",how:"h",loop:"l",rating:0,want:"",notes:${JSON.stringify(m117)}${verbs ? `,verbs:${JSON.stringify(verbs)}` : ""}},
{id:"M118",game:"Lantern Vale",name:"Second",cat:"Combat",how:"h",loop:"l",rating:0,want:""${extraRow ? "}," + extraRow : tail === "}" ? "}" : "},"}
];
const BASE_GAMES = [{title:"Lantern Vale",year:1999,dev:"d",status:"Researched"}];
const PILLARS = [{n:1,t:"t",m:"m",q:"q"}];
const MINIGAMES = [
{id:"g001",g:"Lantern Vale",n:"Arena",p:"p",r:"r",l:"l"${tail === "}" ? "}" : "},"}
];
const CHANGES = [
${log.join(",\n")}
];
function expandIds(list){
  const out = [];
  (list||[]).forEach(e=>{
    const s = String(e), r = s.match(/^([Mg])(\\d+)-([Mg])(\\d+)$/);
    if(r){ const a=+r[2], b=+r[4], w=r[2].length;
      for(let i=a;i<=b;i++) out.push(r[1]+String(i).padStart(w,"0")); return; }
    out.push(s);
  });
  return out;
}
/* ============================= STATE ============================= */
const REF_HOSTS = /^(gamefaqs\\.gamespot\\.com)$/i;
</script></body></html>`;
}

const LOGGED = [
  `{date:"2026-09-06", title:"Sharpened", added:[], updated:["M117"]}`,
  `{date:"2026-09-05", title:"Pilot", added:["M117-M118","g001"], updated:[]}`,
];

test("a row rewritten without a log entry is caught, and named", () => {
  const { problems, changed } = diffChanges(page(), page({ m117: "a sharper note" }));
  assert.deepEqual(changed, ["M117"]);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /^M117 was rewritten but is not in any NEW CHANGES entry/);
});

test("the same rewrite passes once it is logged in a new entry", () => {
  const { problems, changed, newlyLogged } = diffChanges(
    page(), page({ m117: "a sharper note", changes: LOGGED }));
  assert.deepEqual(changed, ["M117"]);
  assert.deepEqual([...newlyLogged], ["M117"]);
  assert.deepEqual(problems, []);
});

test("an entry the BASE already had does not excuse a fresh edit", () => {
  // The row was logged as updated in a previous release; editing it again needs a NEW
  // entry, or one stale log would licence every future edit to that row.
  const base = page({ changes: LOGGED });
  const head = page({ m117: "edited again", changes: LOGGED });
  const { problems } = diffChanges(base, head);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /M117 was rewritten/);
});

test("an unchanged file is clean, and so is a pure append", () => {
  assert.deepEqual(diffChanges(page(), page()).problems, []);

  // Appending a row rewrites the previous last row by one comma. Comparing parsed
  // objects makes that invisible; a text diff would demand an `updated` entry for M118
  // on every splice, and the gate would be trained away within two PRs.
  const head = page({
    extraRow: `{id:"M119",game:"Lantern Vale",name:"Third",cat:"Combat",how:"h",loop:"l",rating:0,want:""}`,
    changes: [
      `{date:"2026-09-06", title:"Wave", added:["M119"], updated:[]}`,
      `{date:"2026-09-05", title:"Pilot", added:["M117-M118","g001"], updated:[]}`,
    ],
  });
  const { problems, changed } = diffChanges(page(), head);
  assert.deepEqual(changed, [], "M118 gained a comma, not a change");
  assert.deepEqual(problems, []);
});

test("reordering a row's keys is not a change", () => {
  const base = page();
  const head = base.replace(
    '{id:"M117",game:"Lantern Vale",name:"First",cat:"Combat",how:"h",loop:"l",rating:0,want:"",notes:"the original note"}',
    '{name:"First",id:"M117",cat:"Combat",game:"Lantern Vale",loop:"l",how:"h",want:"",rating:0,notes:"the original note"}');
  assert.notEqual(head, base, "the fixture must actually differ textually");
  assert.deepEqual(diffChanges(base, head).changed, []);
});

/*
 * `verbs` is analysis metadata derived FROM a row, not content the owner re-reads, so a
 * retagging pass must not have to log every row it touches. The app keeps exactly one
 * change record per id (buildChangeMap is last-write-wins), and the newest-first sort has
 * no key but that date — so logging ~44 ids in one entry would collapse them into a single
 * undated-looking block pinned above the genuinely new rows, permanently. Hence the
 * carve-out; hence also the second test, which pins how narrow it is.
 */
test("adding a verb tag is not a rewrite", () => {
  const base = page();
  const head = page({ verbs: ["Guarded"] });
  assert.notEqual(head, base, "the fixture must actually differ textually");
  assert.deepEqual(diffChanges(base, head).changed, []);
  assert.deepEqual(diffChanges(base, head).problems, []);
});

test("a verbs change alongside a notes change still fires", () => {
  const { problems, changed } = diffChanges(
    page(), page({ m117: "a sharper note", verbs: ["Guarded"] }));
  assert.deepEqual(changed, ["M117"], "the notes edit is still content");
  assert.equal(problems.length, 1);
  assert.match(problems[0], /^M117 was rewritten but is not in any NEW CHANGES entry/);
});

test("logging an id that does not exist is reported", () => {
  const head = page({ changes: [
    `{date:"2026-09-06", title:"Typo", added:[], updated:["M999"]}`,
    `{date:"2026-09-05", title:"Pilot", added:["M117-M118","g001"], updated:[]}`,
  ] });
  const { problems } = diffChanges(page(), head);
  assert.ok(problems.some(p => /CHANGES logs M999 as updated, but no such row exists/.test(p)), problems.join("\n"));
});

test("a minigame row is covered too, not just mechanics", () => {
  const head = page().replace('n:"Arena"', 'n:"The Arena"');
  const { changed, problems } = diffChanges(page(), head);
  assert.deepEqual(changed, ["g001"]);
  assert.equal(problems.length, 1);
});

test("a working copy with no changelog fails loudly instead of passing", () => {
  const noLog = page().replace(/const CHANGES = \[[\s\S]*?\n\];/, "");
  assert.throws(() => readVersion(noLog, "head"), /the working copy has no CHANGES/);
  // A BASE from before the feature existed is fine — nothing was logged back then.
  assert.doesNotThrow(() => readVersion(noLog, "base"));
  assert.deepEqual(diffChanges(noLog, page({ changes: LOGGED })).problems, []);
});
