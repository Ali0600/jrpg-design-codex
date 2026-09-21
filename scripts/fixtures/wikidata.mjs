/**
 * Synthetic Wikidata API answers for fetch_catalogue.test.mjs: search pages shaped like
 * `list=search`, entities shaped like `wbgetentities` (labels, the enwiki sitelink, claims with
 * ranks), and a codex page carrying the catalogue consts and one roster game. Titles are invented
 * (Lantern Vale, Harbor Quest), ids are small. `wiki()` is a stand-in fetch routed by action.
 */
import { miniCodex } from "./mini_codex.mjs";

export const PLATFORMS = [
  { name: "PlayStation 2", wd: "Q10680", label: "PlayStation 2" },
  { name: "PSP", wd: "Q170325", label: "PlayStation Portable" },
];
export const GENRE = "Q744038";
/** P279 children, as the search index would list them. Q102 points back up, so a walk must not loop. */
export const SUBTREE = { Q744038: ["Q100", "Q101"], Q100: ["Q102"], Q101: [], Q102: ["Q744038"] };
export const NAMES = {
  Q744038: "role-playing video game", Q100: "action role-playing game", Q101: "tactical role-playing game", Q102: "action roguelike",
  Q900: "Lantern Works", Q901: "Harbor Soft", Q902: "Port House",
};

const item = id => ({ "entity-type": "item", "numeric-id": Number(id.slice(1)), id });
const time = t => ({ time: t, timezone: 0, before: 0, after: 0, precision: 11, calendarmodel: "http://www.wikidata.org/entity/Q1985727" });
/** One statement; `value` is the datavalue's value, `rank` normal unless said. */
export const statement = (property, value, rank = "normal") => ({ mainsnak: { snaktype: "value", property, datavalue: { value, type: typeof value === "object" && value.time ? "time" : "wikibase-entityid" } }, rank });

/** A game entity. `deprecated` lists ids or times to file at deprecated rank instead of normal. */
export function game({ wd = "Q4242", label = "Lantern Vale", mul = false, enwiki = "Lantern Vale", years = ["+1999-03-01T00:00:00Z"], plats = ["Q10680"], genres = ["Q744038"], devs = ["Q900"], pubs = ["Q901"], deprecated = [] } = {}) {
  const rank = v => (deprecated.includes(v) ? "deprecated" : "normal");
  const claims = {};
  if (years.length) claims.P577 = years.map(t => statement("P577", time(t), rank(t)));
  if (plats.length) claims.P400 = plats.map(id => statement("P400", item(id), rank(id)));
  if (genres.length) claims.P136 = genres.map(id => statement("P136", item(id), rank(id)));
  if (devs.length) claims.P178 = devs.map(id => statement("P178", item(id), rank(id)));
  if (pubs.length) claims.P123 = pubs.map(id => statement("P123", item(id), rank(id)));
  return {
    type: "item", id: wd,
    labels: label == null ? {} : mul ? { mul: { language: "mul", value: label } } : { en: { language: "en", value: label } },
    sitelinks: enwiki ? { enwiki: { site: "enwiki", title: enwiki, badges: [] } } : {},
    claims,
  };
}

/** A label-only entity, as `props=labels` answers. */
export const labelled = (id, value, lang = "en") => ({ type: "item", id, labels: value == null ? {} : { [lang]: { language: lang, value } } });

/** One search page. */
export const searchPage = (ids, total, next = null) => ({
  batchcomplete: "", ...(next == null ? {} : { continue: { sroffset: next, continue: "-||" } }),
  query: { searchinfo: { totalhits: total }, search: ids.map(id => ({ ns: 0, title: id })) },
});

const reply = (body, { status = 200, retryAfter = null, text = null } = {}) =>
  ({ ok: status >= 200 && status < 300, status, headers: { get: h => (h.toLowerCase() === "retry-after" ? retryAfter : null) }, text: async () => text ?? JSON.stringify(body) });
export { reply };

/**
 * A stand-in fetch. `games` is a list of game entities; `members` maps a platform id to the ids
 * its search lists (defaults to every game whose live P400 names it); `labels` overrides a
 * platform's label; `subtree` the P279 children; `pageSize` the search page.
 */
export function wiki({ games = [game()], members = null, labels = {}, subtree = SUBTREE, names = NAMES, pageSize = 50, log = null } = {}) {
  const byId = new Map(games.map(g => [g.id, g]));
  const liveOn = (g, plat) => ((g.claims.P400 || []).some(s => s.rank !== "deprecated" && s.mainsnak.datavalue.value.id === plat));
  return async (url, init) => {
    const q = new URL(url).searchParams;
    if (log) log.push({ action: q.get("action"), list: q.get("list"), ids: q.get("ids"), props: q.get("props"), srsearch: q.get("srsearch"), sroffset: q.get("sroffset"), ua: init && init.headers && init.headers["User-Agent"] });
    if (q.get("action") === "wbgetentities") {
      const entities = {};
      for (const id of q.get("ids").split("|")) {
        const p = PLATFORMS.find(x => x.wd === id);
        if (p) entities[id] = labelled(id, labels[id] === null ? null : labels[id] ?? p.label, labels[id] && labels[id].startsWith("mul:") ? "mul" : "en");
        else if (q.get("props").includes("claims")) entities[id] = byId.get(id) ?? { id, missing: "" };
        else entities[id] = names[id] !== undefined ? labelled(id, names[id]) : byId.has(id) ? { type: "item", id, labels: byId.get(id).labels } : { id, missing: "" };
      }
      for (const [id, e] of Object.entries(entities)) if (e.labels && e.labels.en && String(labels[id] ?? "").startsWith("mul:")) e.labels = { mul: { language: "mul", value: labels[id].slice(4) } };
      return reply({ entities });
    }
    if (q.get("action") === "query" && q.get("list") === "search") {
      const s = q.get("srsearch");
      let ids;
      const child = s.match(/^haswbstatement:P279=(Q\d+)$/);
      if (child) ids = subtree[child[1]] ?? [];
      else {
        const plat = (s.match(/haswbstatement:P400=(Q\d+)/) || [])[1];
        ids = !plat ? [] : members ? (members[plat] ?? []) : games.filter(g => liveOn(g, plat)).map(g => g.id);
      }
      const offset = Number(q.get("sroffset") || 0), size = Math.min(pageSize, Number(q.get("srlimit") || 50));
      const slice = ids.slice(offset, offset + size);
      return reply(searchPage(slice, ids.length, offset + size < ids.length ? offset + size : null));
    }
    return reply({ error: { code: "unknown_action", info: `no stand-in for ${q.get("action")}` } });
  };
}

const ROSTER = `{title:"Lantern Vale",year:1999,dev:"Lantern Works",status:"Researched",why:"w",
gf:{u:"/ps2/1-lantern-vale",plat:"PlayStation 2",genre:["Role-Playing"],dev:"Lantern Works",pub:"Harbor Soft",rel:"1999",rating:{v:4,n:10,w:"Great"},diff:{v:3,n:5,w:"Just Right"},len:{v:40,n:5,w:"40 Hours"},like:[],at:"2026-09-07"},
wp:"Lantern Vale",
wd:"Q4242"},
{title:"Harbor Town",year:2001,dev:"d",status:"Researched",why:"w",
wp:"Harbor Town",
wd:"Q4243"}`;

/** The mini codex with a roster game on PlayStation 2 and the three catalogue consts, `rows` as the page stores them. */
export function catalogueCodex({ rows = "", at = "2026-09-20", platforms = PLATFORMS } = {}) {
  const consts = `const CATALOGUE_PLATFORMS = [\n${platforms.map(p => `  {name:${JSON.stringify(p.name)}, wd:${JSON.stringify(p.wd)}, label:${JSON.stringify(p.label)}}`).join(",\n")}\n];\n`
    + `const CATALOGUE_META = {source:"wikidata", genre:${JSON.stringify(GENRE)}, at:${JSON.stringify(at)}};\n`
    + `const CATALOGUE = [\n${rows}${rows ? "\n" : ""}];\n`;
  return miniCodex({ games: ROSTER }).replace("/* ============================= STATE", consts + "/* ============================= STATE");
}
