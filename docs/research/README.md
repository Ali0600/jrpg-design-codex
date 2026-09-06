# Research digests

One file per game: everything useful that a research pass found, in our own words, with a
pointer on every fact to the guide or wiki page it came from. The codex keeps two or three
rows per game; the digest keeps the rest, and it is the staging file the rows are written
from — committed, so it survives a lost session.

**The rule.** Facts only. Item names, amounts and thresholds may be quoted; a guide's prose
may not — GameFAQs guides are their authors' copyright and this repo is public. Every fact
bullet and every reward-table row carries a pointer, and a candidate becomes a codex row
only once two distinct sources agree. `node scripts/digest_lint.mjs` enforces the grammar;
it also runs in CI.

```
[gf:38095 §Power-Ups, SIMSteven v1.0]     a GameFAQs guide: id, section, author, version
[wiki:threadsoffate.fandom.com/Power-Ups]  a MediaWiki page: host, title
```

Start a digest by copying [`_template.md`](_template.md) to `<game-slug>.md`.

## The GameFAQs flow

GameFAQs answers every scripted client with a Cloudflare challenge — `curl` gets a 403
"Just a moment…" even with a browser User-Agent, and there is no API. So the codex reads it
the way a person does: in the in-app **Browser pane**, one page at a time, with
[`scripts/gf_probe.js`](../../scripts/gf_probe.js) evaluated inside the page as its eyes.
The probe returns small, capped JSON (6KB by default, 12KB ceiling) because the only channel
from the page back to the agent is the tool result, and a 380KB guide must never come back
whole.

Not done, ever: reusing the browser's Cloudflare cookie from a script, spoofing a browser
fingerprint, `get_page_text` / `read_page` on a GameFAQs page (the consent dialog alone is
~14KB of text), or storing guide text anywhere in the repo.

### Runbook

1. **Confirm the game.** `preview_start` with
   `https://gamefaqs.gamespot.com/search?game=<title>`, arm the probe
   (`node scripts/gf_bootstrap.mjs` → paste its output as the `javascript_tool` text; it
   answers `"gf probe v1 loaded"` and parks the probe in the origin's localStorage, so
   every later page re-arms with `node scripts/gf_bootstrap.mjs --rearm`, 38 characters
   instead of 21KB. If the page refuses `eval`, paste `scripts/gf_probe.js` itself each
   time), then `__gf.search()`. Pick the row whose **platform and year match
   the BASE_GAMES row** — the search is fuzzy ("persona 5 royal" returns *Persona 5*). Never
   let the tool pick.
2. **Triage the guides.** Navigate to `<game url>/faqs`, re-eval the probe (the page reset
   it), `__gf.triage()`. Take the top three; keep the full walkthroughs for `grep` only.
   `why` says what scored: In-Depth item/secret/minigame guides high, scripts and
   translations out, `toc first` on anything over 200KB.
3. **Read one guide.** Navigate, re-arm, then in this order: `__gf.meta()` →
   `__gf.toc({min:800})` → `__gf.grep("threshold")` / `"rewards"` / `"hidden"` /
   `"upgrades"` / `"economy"` → at most four `__gf.section(i)` reads (page a long one with
   `from`) → `__gf.visited()`, whose answer becomes the guide's **Coverage** line in the
   digest's Sources section: what was read, which greps ran, and the biggest sections that
   were not read. The probe indexes every line of the guide, but only what comes back
   through a tool result reaches the agent — the Coverage line is what stops "we harvested
   this guide" from meaning more than it does, and tells the next pass where to start.
   Budget: about 60KB of context per guide, about twelve pages per game per session.
   If `__gf.page().kind` is `"challenge"`, **stop** — never loop. The fallback is the owner's
   real Chrome (`claude-in-chrome`) with the same probe text.
4. **Write the digest as facts land** — not at the end. A lost session then costs a page,
   not a game.
5. **Cross-check** each fact that will become a row: `python3 scripts/wiki_fetch.py <host>
   "<Page>"` or a second guide by a different author. Two distinct pointers on the
   candidate's `pointers:` line before it gets a `row:`.
6. **Write the rows.** In the digest's `## Codex rows` block, give each row a
   placeholder id naming its candidate — `id:"M+1"` is the first `###` under `## Mechanics
   candidates`, `id:"g+2"` the second under `## Minigame candidates` — then
   `node scripts/splice_rows.mjs docs/research/<slug>.md` to see the id map, and
   `--write` to apply it. It assigns ids from the current max, checks every `cat`, `game`,
   `want`, `rt` row and `refs` host against the page's own vocabularies, appends to both
   arrays, and writes the assigned ids back into the digest's `row:` lines. Sharpening an
   EXISTING row stays a hand edit. Then update the counts in CLAUDE.md, copy it to
   AGENTS.md, and run `node scripts/validate_codex.mjs --selftest` and
   `node scripts/digest_lint.mjs`.
7. **Record the delta** under `## Codex delta` and set the game's status.

"No minigame with defined payouts" is a valid result. Never pad.

### What the digest holds

| Section | Maps onto |
|---|---|
| `## Sources` | the guides read — id, title, author, version, updated, category, KB, URL — plus a **Coverage** line per guide, from `__gf.visited()` |
| `## Mechanics candidates` | one `###` per candidate: `cat`, `how`, `loop`, `notes`, `verbs`, `pointers`, `row` |
| `## Minigame candidates` | one `###` per candidate: `p`, `r`, `l`, `pointers`, `row`, and an `rt` table with a `src` column |
| `## Exploration & upgrade facts` | bullets under `### Hidden`, `### Upgrades`, `### Shops & exchange` — the pillar's raw material |
| `## Unverified or contradicted` | single-source facts and conflicts, so the next pass doesn't redo them |
| `## Codex rows` | a paste-ready `js` block, ids as placeholders |
| `## Codex delta` | the ids assigned after the splice |
