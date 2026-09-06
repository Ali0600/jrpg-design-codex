/**
 * gf_probe.js — the codex's eyes on a GameFAQs page. Runbook: docs/research/README.md
 * Evaluated INSIDE the page (paste whole as the javascript_tool text); installs
 * window.__gf, whose accessors return small, capped JSON — the only channel back to the
 * agent is the tool result, so a guide is read toc → grep → one section at a time.
 * Reads div.faqtext and ol.gf_guides only, never document.body (consent text, ~14KB).
 *   In the page:  __gf.help()      In node (tests):  require("./gf_probe.js")
 */
(function (root) {
  "use strict";

  var V = 1;
  var MAX = 12000;   // hard ceiling on any result, in JSON characters
  var DEF = 6000;    // default budget for one accessor call

  /* ============================================================== pure core
     Functions of strings and plain objects only, so the tests can drive them
     against synthetic fixtures without a browser. */
  var core = { V: V, MAX: MAX, DEF: DEF };

  // A rule line may be boxed: `//-=-=-=-=\\` opens a heading box, `\\-=-=-=-=//` closes it.
  var RULE = /^\s*[\/\\|]{0,2}\s*[=\-_*#~+]{4,}\s*[\/\\|]{0,2}\s*$/;
  var BANNER = /^[\-=*#~+<>]{2,}\s*[^\s\-=*#~+<>].*?\s*[\-=*#~+<>]+$/;
  var BRACKET = /^\[[A-Za-z0-9.]{2,8}\]\s*\S/;
  var NUMBERED = /^(\d{1,2}(?:\.\d{1,2}){0,2}|[IVX]{1,5}|[A-Z])[.)>:]?\s+[A-Z0-9]/;
  var CAPS = /^[A-Z0-9][A-Z0-9 \-'&\/:,()!?]{3,60}$/;
  var BOILER = /^(copyright|legal|disclaimer|version history|revision history|update history|updates?$|credits|contact|thanks|acknowledg|about (the|this) (author|guide|faq)|introduction|table of contents|contents|faq info|legal stuff|e-?mail)/i;

  // Grep presets for the owner's pillar: "a world that rewards exploration, where
  // everything has upgrades". `threshold` is the reward-table hunter.
  core.PILLAR = {
    rewards:   "reward|prize|receive|obtain|you('ll)? (get|earn)|\\bwin\\b",
    upgrades:  "upgrade|power[- ]?up|level ?up|enhance|\\bmax(imum)?\\b|\\+\\d",
    hidden:    "hidden|secret|optional|missable|bonus|unlock|only (if|when|after)",
    economy:   "\\bshop|store|buy|sell|price|cost|exchange|trade|coins?\\b|\\bgil\\b|points?\\b|tickets?\\b",
    collect:   "collect|all \\d+|set of|\\d+/\\d+|\\d+ (of|out of) \\d+",
    threshold: "\\b\\d{2,5}\\s*(pts|points|coins|gold|gil|G\\b|tickets|wins|kills|times)",
    minigame:  "mini[- ]?game|\\brace\\b|arena|tournament|casino|lottery|quiz|fishing|contest"
  };

  core.splitLines = function (text) {
    return String(text || "").replace(/\r\n?/g, "\n").split("\n");
  };

  function isRule(s) { return RULE.test(s); }
  function isBlank(s) { return !s || !s.trim(); }
  function clean(s) { return s.replace(/^[\s\-=*#~+|:!<>]+|[\s\-=*#~+|:!<>]+$/g, "").replace(/\s+/g, " "); }
  function letters(s) { return (s.match(/[A-Z]/g) || []).length; }
  function nwords(s) { return s.split(/\s+/).filter(Boolean).length; }

  // One line as a heading candidate: {kind, head, score} or null.
  function candidate(lines, i) {
    var raw = lines[i];
    if (isBlank(raw) || isRule(raw)) return null;
    var t = raw.trim();
    if (t.charAt(0) === "\u0001") return { kind: "html", head: t.replace(/^\u0001H\d\s*/, ""), score: 5 };
    if (t.length > 80) return null;                                  // classic guides are 79 columns wide
    if (/\.$/.test(t) && !/\.\.\.$/.test(t)) return null;          // a sentence, not a heading
    var prev = i > 0 ? lines[i - 1] : "";
    var next = i + 1 < lines.length ? lines[i + 1] : "";
    var over = isRule(prev), under = isRule(next);
    var blankBefore = i === 0 || isBlank(prev) || over;
    // Underlined, boxed, or overlined-then-blank — but the rule line above must not be
    // the previous heading's underline, or a one-line body reads as a heading.
    var overOnly = over && !under && isBlank(next) && (i < 2 || isBlank(lines[i - 2]) || isRule(lines[i - 2]));
    if (((under && blankBefore) || (over && under) || overOnly) && nwords(t) <= 10) {
      return { kind: "rule", head: clean(t), score: 4 };
    }
    if (BANNER.test(t)) return { kind: "banner", head: clean(t), score: 3 };
    if (BRACKET.test(t)) return { kind: "bracket", head: clean(t), score: 3 };
    if (NUMBERED.test(t) && /^\s{0,4}\S/.test(raw) && nwords(t) <= 10) return { kind: "numbered", head: clean(t), score: 2 };
    if (blankBefore && CAPS.test(t) && letters(t) >= 2 && nwords(t) <= 8) return { kind: "caps", head: clean(t), score: 1 };
    return null;
  }

  // Candidates that crowd together are lists (a contents list, a caps item list), not
  // headings: a run of 5+ with 4+ weak members folds into ONE section named after its
  // first line, keeping any strong (underlined/HTML) heading inside the run.
  core.headings = function (lines) {
    var cands = [], out = [], run = [], i, k;
    for (i = 0; i < lines.length; i++) {
      var c = candidate(lines, i);
      if (c) { c.i = i; cands.push(c); }
    }
    function flush() {
      if (!run.length) return;
      var weak = 0, kept = [];
      run.forEach(function (c) { if (c.score <= 3) weak++; });
      if (run.length >= 5 && weak >= 4) {
        var first = run[0];
        kept.push(first);
        run.forEach(function (c) { if (c !== first && c.score >= 4) kept.push(c); });
        first.list = true;
        first.head += " (" + (run.length - kept.length) + " entries)";
      } else if (run.length > 3) {
        run.forEach(function (c) { if (c.score >= 4) kept.push(c); });
      } else kept = run;
      kept.forEach(function (c) { out.push(c); });
      run = [];
    }
    // Weak candidates (caps lines, numbered lines) chain across a one-line body and a
    // blank; strong ones only across a bare rule line.
    for (k = 0; k < cands.length; k++) {
      if (run.length) {
        var last = run[run.length - 1];
        if (cands[k].i - last.i > (last.score <= 3 && cands[k].score <= 3 ? 4 : 2)) flush();
      }
      run.push(cands[k]);
    }
    flush();
    return out;
  };

  core.sections = function (lines) {
    var hs = core.headings(lines), out = [], k;
    var strip = function (h) {
      return h.replace(/^\[[^\]]*\]\s*/, "").replace(/^(\d{1,2}(?:\.\d{1,2}){0,2}|[IVX]{1,5}|[A-Z])[.)]?\s+/, "");
    };
    var push = function (start, end, head, kind, list) {
      var len = 0, j;
      for (j = start; j < end; j++) len += lines[j].length + 1;
      out.push({ i: out.length, line: start + 1, head: head, kind: kind, start: start, end: end,
                 len: len, boiler: BOILER.test(strip(head)), list: !!list });
    };
    if (!hs.length || hs[0].i > 0) push(0, hs.length ? hs[0].i : lines.length, "(preamble)", "pre", false);
    for (k = 0; k < hs.length; k++) {
      push(hs[k].i, k + 1 < hs.length ? hs[k + 1].i : lines.length, hs[k].head, hs[k].kind, hs[k].list);
    }
    return out;
  };

  core.regex = function (p) {
    if (p instanceof RegExp) return new RegExp(p.source, p.flags.replace("g", ""));
    if (core.PILLAR[p]) p = core.PILLAR[p];
    try { return new RegExp(String(p), "i"); } catch (e) { return null; }
  };

  core.grep = function (lines, sections, pattern, ctx, max) {
    var re = core.regex(pattern);
    if (!re) return { error: "bad pattern " + JSON.stringify(String(pattern)) };
    ctx = ctx == null ? 2 : Math.max(0, Math.min(6, ctx | 0));
    max = max == null ? 25 : Math.max(1, max | 0);
    var rows = [], hits = 0, s = 0, i;
    for (i = 0; i < lines.length; i++) {
      if (!re.test(lines[i])) continue;
      hits++;
      if (rows.length >= max) continue;
      while (s + 1 < sections.length && sections[s + 1].start <= i) s++;
      rows.push({ line: i + 1, sec: sections[s] ? sections[s].head : "",
                  text: lines.slice(Math.max(0, i - ctx), i + ctx + 1).join("\n") });
    }
    return { pattern: re.source, hits: hits, rows: rows };
  };

  core.size = function (v) { return JSON.stringify(v).length; };

  // Trim `rows` from the end until the result fits the budget, and say what was cut.
  core.fitRows = function (obj, key, budget) {
    budget = Math.min(budget || DEF, MAX);
    var dropped = 0;
    obj.dropped = 0;                       // measured WITH the field it may need to carry
    while (obj[key].length && core.size(obj) > budget) { obj[key].pop(); obj.dropped = ++dropped; }
    if (!dropped) delete obj.dropped;
    return obj;
  };

  // "<Game> - <Guide title> - <Platform> - By <author> - GameFAQs", read from the end
  // so a game whose name contains " - " still parses.
  core.parseTitle = function (title) {
    var t = String(title || "").replace(/\s*-\s*GameFAQs\s*$/, "");
    var m = t.match(/^(.*?)\s+-\s+By\s+(.+)$/);
    var author = m ? m[2].trim() : "";
    var parts = (m ? m[1] : t).split(" - ");
    var platform = parts.length > 2 ? parts.pop().trim() : "";
    var guide = parts.length > 1 ? parts.pop().trim() : "";
    return { game: parts.join(" - ").trim(), title: guide, platform: platform, author: author };
  };

  core.parseVersion = function (text) {
    var s = String(text || "");
    var v = s.match(/Version:?\s*v?\.?\s*(\d[\w.]*)/i);
    var u = s.match(/Updated:?\s*([\d/.-]{6,})/i);
    return { version: v ? v[1] : "", updated: u ? u[1] : "" };
  };

  core.parseGuide = function (it) {
    var meta = it.meta || "";
    var v = meta.match(/\bv\.?\s*(\d[\d.]*[a-z]?)/i);
    var kb = meta.match(/(\d+)\s*KB/i);
    var y = (it.date || meta).match(/\b((?:19|20)\d\d)\b/);
    var id = (it.href || "").match(/\/(faqs|map)\/(\d+)/);
    return { id: id ? id[2] : "", kind: id && id[1] === "map" ? "map" : "text", title: it.title || "",
             author: it.author || "", cat: it.cat || "", ver: v ? v[1] : "", kb: kb ? +kb[1] : 0,
             year: y ? +y[1] : 0, date: it.date || "", rec: !!it.rec, flags: it.flags || [], url: it.href || "" };
  };

  var TITLE_HI = /item|equip|weapon|armou?r|accessor|secret|side[- ]?quest|mini[- ]?game|shop|synth|alchem|craft|power[- ]?up|upgrade|collect|treasure|chest|100%|completion|hidden|unlock|abilit|skill|\bcard|fishing|arena|casino|reward/ig;
  var TITLE_MID = /monster|bestiary|troph|enem/i;
  var TITLE_LO = /\bboss|speed ?run|challenge run|low[- ]level/i;
  var TITLE_NO = /script|translation|transcript|dialogue|glossary/i;

  core.triage = function (guides) {
    return guides.map(function (g) {
      var s = 0, why = [];
      var cat = g.cat || "";
      var c = /in-depth/i.test(cat) ? 3 : /secret|code/i.test(cat) ? 2 : /full game|walkthrough|map|chart/i.test(cat) ? 1
            : /demo|foreign|language/i.test(cat) ? -5 : 0;
      s += c; why.push((cat || "uncategorised") + (c >= 0 ? " +" : " ") + c);
      var hi = (g.title.match(TITLE_HI) || []).length;
      if (hi) { s += 3 * hi; why.push("title +" + 3 * hi); }
      if (TITLE_MID.test(g.title)) { s += 1; why.push("bestiary +1"); }
      if (TITLE_LO.test(g.title)) { s -= 3; why.push("boss/run -3"); }
      if (TITLE_NO.test(g.title)) { s -= 5; why.push("script/translation -5"); }
      if (g.kb >= 20) { s += 1; why.push("size +1"); }
      if (g.kb && g.kb < 8) why.push("thin");
      if (g.kb >= 200) why.push("toc first, never section() blind");
      if (g.rec || (g.flags || []).some(function (f) { return /highest rated/i.test(f); })) { s += 1; why.push("recommended +1"); }
      var row = { score: s, why: why.join(", ") };
      for (var k in g) if (Object.prototype.hasOwnProperty.call(g, k)) row[k] = g[k];
      return row;
    }).sort(function (a, b) { return b.score - a.score || b.kb - a.kb; });
  };

  /* ============================================================== DOM layer */
  function install(win, doc, loc) {
    if (win && win.__gf && win.__gf.v === V) return "already loaded";
    var api = { v: V, MAX: MAX, DEF: DEF, PILLAR: core.PILLAR, _c: {} };

    function q(sel) { return doc.querySelector(sel); }
    function qa(sel) { return Array.prototype.slice.call(doc.querySelectorAll(sel)); }
    function txt(el) { return el ? String(el.textContent || "").replace(/\s+/g, " ").trim() : ""; }
    function href() { return loc ? String(loc.href || "") : ""; }

    api.page = function () {
      var title = String(doc.title || "");
      var kind = "unknown";
      if (/^just a moment/i.test(title) || q("#challenge-error-text, #challenge-running, #cf-chl-widget")) kind = "challenge";
      else if (q("ol.gf_guides")) kind = "listing";
      else if (q("div.faqtext")) kind = "faq";
      else if (/^\/search/.test((loc && loc.pathname) || "")) kind = "search";
      return { kind: kind, url: href(), title: title };
    };

    api.guides = function () {
      var cat = "", rows = [];
      qa("h2, h3, h4, ol.gf_guides > li").forEach(function (el) {
        if (/^H[234]$/i.test(String(el.tagName))) { cat = txt(el); return; }
        var a = el.querySelector("a.bold");
        if (!a) return;
        var meta = el.querySelector("div.meta.float_r");
        var date = el.querySelector("span.guide_date");
        rows.push(core.parseGuide({
          title: txt(a), href: a.getAttribute("href") || "", author: txt(el.querySelector("a.link_color")),
          meta: txt(meta), rec: !!(meta && /\brec\b/.test(String(meta.className || ""))),
          flags: txt(el.querySelector("div.meta.bold.ital")).split("*").map(function (s) { return s.trim(); }).filter(Boolean),
          date: date ? (date.getAttribute("title") || "") : "", cat: cat
        }));
      });
      return core.fitRows({ n: rows.length, rows: rows }, "rows", DEF);
    };

    api.triage = function () {
      var g = api.guides();
      return core.fitRows({ n: g.n, rows: core.triage(g.rows) }, "rows", DEF);
    };

    api.search = function () {
      var seen = {}, rows = [];
      qa("a[href]").forEach(function (a) {
        var h = a.getAttribute("href") || "";
        var m = h.match(/^\/([a-z0-9]+)\/(\d+-[a-z0-9-]+)$/);
        if (!m || seen[h]) return;
        seen[h] = 1;
        rows.push({ title: txt(a), platform: m[1], url: h });
      });
      return core.fitRows({ n: rows.length, rows: rows }, "rows", DEF);
    };

    // The guide text, assembled once per page: <pre> chunks are joined BEFORE the
    // split into lines, so a heading whose underline fell into the next chunk survives.
    function assemble() {
      var key = href();
      if (api._c[key]) return api._c[key];
      var pres = qa("div.faqtext pre"), format = "pre", text;
      if (pres.length) {
        text = pres.reduce(function (acc, p) {           // no blank line at a chunk seam
          var s = String(p.textContent || "");
          return acc + (acc && acc.charAt(acc.length - 1) !== "\n" ? "\n" : "") + s;
        }, "");
      } else {
        format = "html";   // formatted guides: headings become sentinel lines, tables flatten
        var parts = [];
        var walk = function (el) {
          var tag = String(el.tagName || "").toUpperCase();
          if (/^H[1-6]$/.test(tag)) parts.push("\u0001" + tag + " " + txt(el));
          else if (tag === "TABLE") {
            Array.prototype.slice.call(el.querySelectorAll("tr")).forEach(function (tr) {
              parts.push(Array.prototype.slice.call(tr.children).map(txt).join(" | "));
            });
          } else if (el.children && el.children.length && !/^(P|LI|PRE)$/.test(tag)) {
            Array.prototype.slice.call(el.children).forEach(walk);
          } else parts.push(String(el.innerText != null ? el.innerText : (el.textContent || "")));
        };
        var box = q("div.faqtext");
        Array.prototype.slice.call(box ? box.children : []).forEach(walk);
        text = parts.join("\n");
      }
      var lines = core.splitLines(text);
      var entry = { format: format, chunks: pres.length, chars: text.length, lines: lines,
                    sections: core.sections(lines), read: {}, greps: [] };
      api._c[key] = entry;
      return entry;
    }

    api.meta = function () {
      var a = assemble(), t = core.parseTitle(doc.title);
      var id = (href().match(/\/faqs\/(\d+)/) || [])[1] || "";
      // "Version: x | Updated: y" is page chrome outside the guide box: scanned in-page,
      // only the match leaves. Older guides also carry it in their own header.
      var vu = core.parseVersion(doc.body ? String(doc.body.innerText || "") : "");
      if (!vu.version) vu = core.parseVersion(a.lines.slice(0, 60).join("\n"));
      return { id: id, game: t.game, title: t.title, platform: t.platform, author: t.author,
               version: vu.version, updated: vu.updated, format: a.format, chunks: a.chunks,
               chars: a.chars, lines: a.lines.length, sections: a.sections.length, url: href() };
    };

    api.toc = function (opts) {
      opts = opts || {};
      var max = opts.max == null ? 120 : opts.max, min = opts.min || 0;
      var a = assemble();
      var rows = a.sections.filter(function (s) { return s.len >= min; }).map(function (s) {
        return { i: s.i, line: s.line, head: s.head, len: s.len, boiler: s.boiler || undefined, list: s.list || undefined };
      });
      var total = rows.length;
      return core.fitRows({ sections: a.sections.length, total: total, rows: rows.slice(0, max) }, "rows", opts.budget || DEF);
    };

    api.section = function (i, maxChars, from) {
      var a = assemble(), s = a.sections[i | 0];
      if (!s) return { error: "no section " + i + " (0-" + (a.sections.length - 1) + ")" };
      maxChars = Math.min(maxChars == null ? DEF : (maxChars | 0), MAX - 400);
      from = Math.max(0, from | 0);
      var text = a.lines.slice(s.start, s.end).join("\n");
      var to = Math.min(from + maxChars, text.length);
      var seen = a.read[s.i];                                 // for visited(): how far in, of what
      a.read[s.i] = { to: Math.max(seen ? seen.to : 0, to), total: text.length };
      return { i: s.i, head: s.head, from: from, to: to,
               total: text.length, text: text.slice(from, from + maxChars) };
    };

    api.grep = function (pattern, ctx, max) {
      var a = assemble(), r = core.grep(a.lines, a.sections, pattern, ctx, max);
      if (r.rows && a.greps.indexOf(String(pattern)) < 0) a.greps.push(String(pattern));
      return r.rows ? core.fitRows(r, "rows", DEF) : r;
    };

    api.lines = function (from, count) {
      var a = assemble();
      from = Math.max(1, from | 0);
      count = Math.min(Math.max(1, count == null ? 60 : (count | 0)), 200);
      var text = a.lines.slice(from - 1, from - 1 + count).join("\n").slice(0, MAX - 200);
      return { from: from, to: Math.min(from - 1 + count, a.lines.length), of: a.lines.length, text: text };
    };

    // What this session actually READ of the guide, and what it did not. The probe
    // indexes every line, but only what comes back through a tool result reaches the
    // agent — so the digest records coverage instead of implying it.
    api.visited = function (minUnread) {
      var a = assemble(), min = minUnread == null ? 800 : (minUnread | 0);
      var read = [], unread = [];
      a.sections.forEach(function (s) {
        var r = a.read[s.i];
        if (r) read.push({ i: s.i, head: s.head, pct: Math.round(r.to * 100 / Math.max(1, r.total)) });
        else if (s.len >= min && !s.boiler && !s.list) unread.push({ i: s.i, head: s.head, len: s.len });
      });
      unread.sort(function (x, y) { return y.len - x.len; });
      return core.fitRows({ sections: a.sections.length, chars: a.chars, read: read,
                            greps: a.greps.slice(), unread: unread }, "unread", DEF);
    };

    api.skeleton = function () {
      var target = q("ol.gf_guides > li") || q("div.faqtext") || doc.body || null;
      var acc = [];
      var outline = function (el, depth) {
        if (!el || depth > 4 || acc.length > 60) return;
        var kids = Array.prototype.slice.call(el.children || []);
        var cls = el.className ? "." + String(el.className).trim().replace(/\s+/g, ".") : "";
        acc.push(new Array(depth + 1).join("  ") + String(el.tagName || "").toLowerCase() + (el.id ? "#" + el.id : "") + cls
                 + (kids.length ? "" : " " + JSON.stringify(txt(el).slice(0, 40))));
        kids.forEach(function (c) { outline(c, depth + 1); });
      };
      outline(target, 0);
      return { target: target ? String(target.tagName).toLowerCase() : null, outline: acc.join("\n").slice(0, 1500) };
    };

    api.help = function () {
      return [
        "page()                      what this page is: listing | faq | search | challenge (STOP on challenge)",
        "guides() / triage()         the guide list, raw or scored for codex value",
        "search()                    game candidates on a /search?game= page — confirm platform + year, never auto-pick",
        "meta()                      id, author, version, updated, size, section count",
        "toc({max,min})              section list; min skips sections shorter than N chars; list = a contents/item list folded into one section (grep reaches inside)",
        "section(i, maxChars, from)  one section's text, pageable with `from`",
        "grep(pattern, ctx, max)     keyword windows; pattern = regex source or a PILLAR key: " + Object.keys(core.PILLAR).join(" "),
        "lines(from, count)          raw lines by 1-based number, when heading detection fails",
        "visited(minUnread)          what you read, which greps ran, and the biggest sections you did NOT read",
        "skeleton()                  DOM outline of a list row / the guide box, for selector repair",
        "Every result is capped (" + DEF + " chars default, " + MAX + " max). Read only what you need."
      ];
    };

    if (win) win.__gf = api;
    return "gf probe v" + V + " loaded";
  }

  if (typeof module === "object" && module && module.exports) {
    module.exports = { core: core, install: install };
    return "gf probe exported";
  }
  return install(root, root.document, root.location);
})(typeof window !== "undefined" ? window : globalThis);
