/**
 * A codex small enough to read, shaped exactly like the real one, for the row-writer,
 * game-splicer and validator-adjacent tests. Three game rows: one whose title is a CONST
 * (`title:FF`, as two real rows are), one followed by the real file's lone-comma seam, and
 * one plain. `games` replaces the roster body; `tail` picks the mechanics array's ending.
 * `mechs` replaces the mechanics body and `verbs` adds a `const VERBS`; both are opt-in and
 * emit nothing by default, so the default page stays byte-identical for the older tests.
 */
export const FF_TITLE = "Final Fantasy VII Rebirth";

export const DEFAULT_GAMES = `{title:FF,year:2024,dev:"Square Enix",status:"Researched",
mc:92,mcN:145,us:8.8,usN:6912,mcPlat:"PS5",mcUrl:"https://www.metacritic.com/game/final-fantasy-vii-rebirth/",
why:"Layered upgrade systems."},
{title:"Lantern Vale",year:1999,dev:"Lantern Works",status:"Researched",
why:"A brief with a \\u201cquote\\u201d and the text gf: which is not a key, wp: neither."}
,
{title:"Harbor Town",year:2001,dev:"d",status:"Researched",why:"w"}`;

export function miniCodex({ games = DEFAULT_GAMES, tail = "}", changes = null, mechs = null, verbs = null } = {}) {
  const changesText = changes ?? `  {date:"2026-09-05", title:"Earlier", added:["M001-M002","g001"], updated:[]},`;
  const mechsText = mechs ?? `{id:"M001",game:"Lantern Vale",name:"First",cat:"Combat",how:"h",loop:"l",rating:0,want:""},
{id:"M002",game:"Lantern Vale",name:"Second",cat:"Combat",how:"h",loop:"l",rating:0,want:""${tail === "}" ? "}" : "},"}`;
  const verbsText = verbs ? `const VERBS = ${JSON.stringify(verbs)};\n` : "";
  return `<!doctype html><html><body><script>
const CATS = {"Combat":"#a00","Progression & Upgrades":"#0a0"};
const FF="${FF_TITLE}", ER="Elden Ring";
const BASE_MECHS = [
${mechsText}
];
const BASE_GAMES = [
${games}
];
const PILLARS = [{n:1,t:"t",m:"m",q:"q"}];
const CHANGES = [
${changesText}
];
const MINIGAMES = [
{id:"g001",g:"Lantern Vale",n:"Arena",p:"p",r:"r",l:"l"${tail === "}" ? "}" : "},"}
];
${verbsText}/* ============================= STATE ============================= */
const REF_HOSTS = /^(gamefaqs\\.gamespot\\.com|[a-z0-9-]+\\.fandom\\.com)$/i;
</script></body></html>`;
}
