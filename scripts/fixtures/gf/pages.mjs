/**
 * Synthetic GameFAQs pages for the probe tests — the DOM shapes measured on the
 * live site (2026-09-05), with invented game, guides and authors so nothing here
 * reproduces anyone's guide text.
 */
import { readFileSync } from "node:fs";
import { el, document } from "./minidom.mjs";

export const FAQ_TEXT = readFileSync(new URL("./lantern-vale-faq.txt", import.meta.url), "utf8");

/** Split a FAQ into two `<pre>` chunks at the first occurrence of `marker`. */
export function splitFaq(text, marker) {
  const at = text.indexOf(marker);
  if (at < 0) throw new Error(`splitFaq: marker ${JSON.stringify(marker)} not in text`);
  return [text.slice(0, at), text.slice(at)];
}

function guideLi({ title, href, author, meta, rec = false, flags = "", date = "" }) {
  const metaChildren = date
    ? [meta.replace(/\d{4}$/, ""), el("span", { cls: "guide_date", title: date }, [meta.slice(-4)])]
    : [meta];
  return el("li", { attrs: { "data-platform": "PS" } }, [
    el("div", { cls: "content" }, [
      el("div", { cls: "float_l" }, [
        el("a", { cls: "bold", href }, [title]),
        el("span", {}, [" by ", el("a", { cls: "link_color", href: "/community/" + author }, [author])]),
      ]),
      el("div", { cls: "meta float_r" + (rec ? " rec" : "") }, metaChildren),
      ...(flags ? [el("div", { cls: "meta float_l bold ital" }, [flags])] : []),
    ]),
  ]);
}

function pod(heading, lis) {
  // The heading is NOT a sibling of the list — it sits in a different wrapper,
  // exactly why the probe walks headings and rows together in document order.
  return el("div", { cls: "pod" }, [
    el("div", { cls: "head" }, [el("h3", {}, [heading])]),
    el("div", { cls: "body" }, [el("ol", { cls: "list flex col1 stripe guides gf_guides" }, lis)]),
  ]);
}

export function listingPage() {
  const root = el("html", {}, [el("body", {}, [
    el("h2", {}, ["PlayStation"]),
    pod("Full Game Guides", [
      guideLi({ title: "Guide and Walkthrough", href: "/ps/1-lantern-vale/faqs/101", author: "aster",
                meta: "v.1.3, 380KB, 2002", rec: true, flags: "*Highest Rated*", date: "06/25/2002" }),
    ]),
    pod("In-Depth Guides", [
      guideLi({ title: "Game Script", href: "/ps/1-lantern-vale/faqs/102", author: "brook", meta: "387KB, 2008" }),
      guideLi({ title: "Power-Up/Item FAQ", href: "/ps/1-lantern-vale/faqs/103", author: "cinder", meta: "v.1.0, 29KB, 2005" }),
    ]),
    pod("Demo Guides", [
      guideLi({ title: "Guide and Walkthrough", href: "/ps/1-lantern-vale/faqs/104", author: "dune", meta: "v.1.0, 5KB, 2000" }),
    ]),
    el("h2", {}, ["Want to Write Your Own Guide?"]),
  ])]);
  return document({ title: "Lantern Vale FAQs, Walkthroughs, and Guides for PlayStation - GameFAQs",
                    root, path: "/ps/1-lantern-vale/faqs" });
}

/** A listing with `n` rows, for the cap tests. */
export function bigListingPage(n) {
  const lis = [];
  for (let i = 0; i < n; i++) {
    lis.push(guideLi({ title: "In-Depth Guide Number " + i, href: "/ps/1-lantern-vale/faqs/" + (1000 + i),
                       author: "author" + i, meta: "v.1.0, 40KB, 2010" }));
  }
  const root = el("html", {}, [el("body", {}, [pod("In-Depth Guides", lis)])]);
  return document({ title: "Big listing - GameFAQs", root, path: "/ps/1-lantern-vale/faqs" });
}

const CHROME = "Menu\nHome\nBoards\n";
const CONSENT = "\nWe Care About Your Privacy\nWe and our partners process data to provide: ...\n";

export function faqPage({ chunks, title = "Lantern Vale - Relic & Power-Up FAQ - PlayStation - By aster - GameFAQs",
                          version = "Version: 1.2 | Updated: 07/26/2005", path = "/ps/1-lantern-vale/faqs/103" }) {
  const box = el("div", { cls: "faqtext" }, chunks.map(c => el("pre", {}, [c])));
  const root = el("html", {}, [el("body", {}, [
    el("div", { cls: "ffaq" }, [
      el("h2", {}, ["Relic & Power-Up FAQ (PS) by aster"]),
      el("div", { cls: "faq_info" }, [version]),
      box,
    ]),
  ])]);
  return document({ title, root, path, bodyText: CHROME + version + "\n" + chunks.join("\n") + CONSENT });
}

/** The HTML-formatted guide shape (headings + tables instead of <pre>). Unverified live. */
/**
 * A FORMATTED guide, the post-2010 shape: no <pre>, real H2-H5 headings inside
 * div.ffaq.ffaqbody, and the text SPLIT over pages ("Page 3 of 19", ?page=N zero-based).
 * Copied from The Witcher 3's Guide and Walkthrough, 2026-09-06.
 */
export function ffaqPage({ page = 3, pages = 19 } = {}) {
  const box = el("div", { cls: "ffaq ffaqbody" }, [
    el("h3", {}, ["Table of Contents"]),
    el("h2", {}, ["Gameplay Basics"]),
    el("p", {}, ["Two sentences of body text about how the basics work in this game."]),
    el("h3", {}, ["Combat Techniques"]),
    el("p", {}, ["Melee, ranged and the rest, described at some length for the reader."]),
    el("h4", {}, ["Finisher Attacks"]),
    el("p", {}, ["A finisher triggers on a staggered enemy and costs no stamina."]),
    el("h2", {}, ["Places of Power"]),
    el("p", {}, ["Each one grants one Ability Point, once, the first time you use it."]),
  ]);
  const pager = el("div", { cls: "ffaq_pager" }, [
    el("span", {}, [`Page ${page} of ${pages}`]),
    el("a", { href: `/ps/1-lantern-vale/faqs/106?page=${page}` }, ["Next"]),
  ]);
  const root = el("html", {}, [el("body", {}, [el("div", {}, [pager, box])])]);
  return document({ title: "Lantern Vale - Guide and Walkthrough - PlayStation - By dune - GameFAQs",
                    root, path: `/ps/1-lantern-vale/faqs/106?page=${page - 1}`,
                    bodyText: CHROME + `Page ${page} of ${pages}` + "Version: 0.90 | Updated: 03/03/2021" + CONSENT });
}

export function htmlFaqPage() {
  const box = el("div", { cls: "faqtext" }, [
    el("h2", {}, ["Items"]),
    el("p", {}, ["Items are bought or found. Some upgrade in the field."]),
    el("h3", {}, ["Weapons"]),
    el("table", {}, [
      el("tr", {}, [el("th", {}, ["Name"]), el("th", {}, ["Where"])]),
      el("tr", {}, [el("td", {}, ["Reed Blade"]), el("td", {}, ["Harbor shop, 120 coins"])]),
    ]),
    el("div", {}, [el("p", {}, ["Nested paragraph inside a wrapper div."])]),
  ]);
  const root = el("html", {}, [el("body", {}, [el("div", { cls: "ffaq" }, [box])])]);
  return document({ title: "Lantern Vale - Item Guide - PlayStation - By brook - GameFAQs",
                    root, path: "/ps/1-lantern-vale/faqs/105", bodyText: CHROME + "Version: 2.0 | Updated: 01/02/2020" + CONSENT });
}

export function challengePage() {
  const root = el("html", {}, [el("body", {}, [
    el("div", { id: "challenge-error-text" }, ["Enable JavaScript and cookies to continue"]),
  ])]);
  return document({ title: "Just a moment...", root, path: "/ps/1-lantern-vale/faqs", bodyText: "Just a moment..." });
}

export function searchPage() {
  const root = el("html", {}, [el("body", {}, [
    el("a", { href: "/ps4/835628-persona-5" }, ["Persona 5"]),
    el("a", { href: "/ps4/835628-persona-5/faqs" }, ["Guides"]),
    el("a", { href: "/ps4/835628-persona-5" }, ["Persona 5"]),
    el("a", { href: "/switch/262892-persona-5-strikers" }, ["Persona 5 Strikers"]),
    el("a", { href: "/community/someone" }, ["someone"]),
  ])]);
  return document({ title: "Game Search - GameFAQs", root, path: "/search" });
}
