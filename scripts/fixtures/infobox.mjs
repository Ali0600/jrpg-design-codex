/**
 * Synthetic Wikipedia infobox markup for fetch_infobox.test.mjs. Written by hand to reproduce
 * each cell shape measured on the roster's 72 articles (2026-09-13): a plainlist, a region
 * prefix (single and compound), a bold re-release header both inline and as its own list item,
 * a footnote, an inline style block, entities, a comma-joined genre cell, and the two labels the
 * harvest knows and skips. No Wikipedia text.
 */
export const row = (label, cell) =>
  `<tr><th scope="row" class="infobox-label">${label}</th><td class="infobox-data">${cell}</td></tr>`;

export const box = (...rows) =>
  `<div class="mw-content-ltr mw-parser-output"><table class="infobox ib-video-game hproduct"><tbody>` +
  `<tr><th colspan="2" class="infobox-above">Lantern Vale</th></tr>${rows.join("")}</tbody></table>` +
  `<p><b>Lantern Vale</b> is a role-playing game.</p></div>`;

export const LANTERN_VALE = box(
  row("Developer", `<a href="/wiki/Lantern_Works">Lantern Works</a><sup id="cite_ref-1" class="reference"><a href="#cite_note-1"><span class="cite-bracket">&#91;</span>a<span class="cite-bracket">&#93;</span></a></sup>`),
  row("Publishers", `<style data-mw-deduplicate="TemplateStyles:r1">.mw-parser-output .plainlist ul{margin:0}</style><b>Original</b><div class="plainlist"><ul><li><span style="font-size:97%;"><a href="/wiki/Japan">JP</a>:</span> Lantern Works</li><li><span style="font-size:97%;"><abbr>JP/NA</abbr>:</span> Harbor&#160;Soft</li></ul></div><i><b>Lantern Vale Remastered</b></i><br /><a href="/wiki/Harbor_Soft">Harbor Soft</a> (<i>Remastered</i>)`),
  row("Composers", `<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r1"/><div class="plainlist"> <ul><li>Mira Tone</li> <li>Kai &amp; Sons</li></ul> </div>`),
  row("Series", `<i><a href="/wiki/Lantern_(series)">Lantern</a></i>`),
  row("Platforms", `<div class="plainlist"><ul><li><a href="/wiki/PlayStation_(console)">PlayStation</a></li><li><i><b>Remastered</b></i></li><li><a href="/wiki/Windows">Windows</a></li><li><a href="/wiki/PlayStation_(console)">PlayStation</a></li></ul></div>`),
  row("Release", `JP: March 3, 1999<br />ZZ: never`),
  row("Genres", `<a href="/wiki/Role-playing_video_game">Role-playing</a>, <a href="/wiki/Social_simulation_game">social simulation</a>`),
  row("Mode", `Single-player`),
);

export const LANTERN_VALE_INFOBOX = {
  plat: ["PlayStation", "Windows"],
  genre: ["Role-playing", "social simulation"],
  dev: ["Lantern Works"],
  pub: ["Lantern Works", "Harbor Soft", "Harbor Soft (Remastered)"],
  series: ["Lantern"],
  comp: ["Mira Tone", "Kai & Sons"],
};

/** A synthetic `action=query` answer (categories and page properties). By default the categories
    come out of order, one repeated and one written with an underscore. */
export const LANTERN_VALE_CATEGORIES = [
  { ns: 14, title: "Category:Video games about lanterns" },
  { ns: 14, title: "Category:Harbor_Soft games" },
  { ns: 14, title: "Category:1999 video games" },
  { ns: 14, title: "Category:Video games about lanterns" },
];
export const LANTERN_VALE_WPCATS = ["1999 video games", "Harbor Soft games", "Video games about lanterns"];
export const meta = ({ title = "Lantern Vale", wd = "Q4242", categories = LANTERN_VALE_CATEGORIES, extra = {} } = {}) => ({
  batchcomplete: true, ...extra,
  query: { pages: [{ pageid: 7, ns: 0, title, ...(wd ? { pageprops: { wikibase_item: wd } } : {}), categories }] },
});
