/**
 * A tiny DOM stand-in for testing gf_probe.js without a browser or jsdom.
 *
 * Supports exactly the selector shapes the probe uses: tag, #id, .class chains,
 * [attr] presence, descendant (`a b`), child (`a > b`) and comma lists. Results
 * come back in document order, which the probe relies on to attach each guide
 * row to the heading that precedes it.
 */

export function el(tag, props = {}, children = []) {
  if (Array.isArray(props)) { children = props; props = {}; }
  const node = {
    tagName: tag.toUpperCase(),
    className: props.cls || "",
    id: props.id || "",
    attrs: Object.assign({}, props.attrs || {}),
    childNodes: [],
    parent: null,
    _ord: 0,
  };
  if (props.href) node.attrs.href = props.href;
  if (props.title) node.attrs.title = props.title;
  for (const c of children) {
    const ch = typeof c === "string" ? { tagName: "#text", _text: c, childNodes: [], attrs: {}, className: "" } : c;
    ch.parent = node;
    node.childNodes.push(ch);
  }
  Object.defineProperty(node, "children", { get: () => node.childNodes.filter(c => c.tagName !== "#text") });
  Object.defineProperty(node, "textContent", {
    get: () => node.childNodes.map(c => (c.tagName === "#text" ? c._text : c.textContent)).join(""),
  });
  Object.defineProperty(node, "innerText", { get: () => node.textContent });
  node.getAttribute = n => (n in node.attrs ? node.attrs[n] : null);
  node.classList = { contains: c => node.className.split(/\s+/).includes(c) };
  node.querySelectorAll = sel => select(node, sel);
  node.querySelector = sel => select(node, sel)[0] || null;
  return node;
}

function descendants(node, acc = []) {
  for (const c of node.childNodes) {
    if (c.tagName === "#text") continue;
    acc.push(c);
    descendants(c, acc);
  }
  return acc;
}

function matches(node, simple) {
  const m = simple.match(/^([a-zA-Z0-9]*)(#[\w-]+)?((?:\.[\w-]+)*)((?:\[[\w-]+\])*)$/);
  if (!m) throw new Error(`minidom: unsupported selector ${JSON.stringify(simple)}`);
  const [, tag, id, classes, attrs] = m;
  if (tag && node.tagName !== tag.toUpperCase()) return false;
  if (id && node.id !== id.slice(1)) return false;
  const have = node.className.split(/\s+/).filter(Boolean);
  for (const c of classes.split(".").filter(Boolean)) if (!have.includes(c)) return false;
  for (const a of attrs.split("]").filter(Boolean)) if (!(a.slice(1) in node.attrs)) return false;
  return true;
}

function select(root, selector) {
  const out = new Set();
  for (const part of selector.split(",")) {
    const tokens = part.trim().match(/[^\s>]+|>/g) || [];
    let cur = null;
    let comb = " ";
    for (const tok of tokens) {
      if (tok === ">") { comb = ">"; continue; }
      if (cur === null) {
        cur = descendants(root).filter(n => matches(n, tok));
      } else {
        const next = [];
        for (const n of cur) {
          const pool = comb === ">" ? n.children : descendants(n);
          for (const c of pool) if (matches(c, tok)) next.push(c);
        }
        cur = next;
      }
      comb = " ";
    }
    for (const n of cur || []) out.add(n);
  }
  return [...out].sort((a, b) => a._ord - b._ord);
}

/** Build a document/window/location triple around a root element. */
export function document({ title = "", root, bodyText = "", path = "/" }) {
  let ord = 0;
  (function index(n) { n._ord = ord++; for (const c of n.childNodes) if (c.tagName !== "#text") index(c); })(root);
  const body = root.querySelector("body");
  const doc = {
    title,
    body: { innerText: bodyText, tagName: "BODY", children: body ? body.children : [], className: "", id: "" },
    querySelector: s => root.querySelector(s),
    querySelectorAll: s => root.querySelectorAll(s),
  };
  const loc = { href: "https://gamefaqs.gamespot.com" + path, pathname: path };
  const win = { document: doc, location: loc };
  return { win, doc, loc };
}
