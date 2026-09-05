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
   `https://gamefaqs.gamespot.com/search?game=<title>`, eval the probe
   (`cat scripts/gf_probe.js` → paste as the `javascript_tool` text; it answers
   `"gf probe v1 loaded"`), then `__gf.search()`. Pick the row whose **platform and year match
   the BASE_GAMES row** — the search is fuzzy ("persona 5 royal" returns *Persona 5*). Never
   let the tool pick.
2. **Triage the guides.** Navigate to `<game url>/faqs`, re-eval the probe (the page reset
   it), `__gf.triage()`. Take the top three; keep the full walkthroughs for `grep` only.
   `why` says what scored: In-Depth item/secret/minigame guides high, scripts and
   translations out, `toc first` on anything over 200KB.
3. **Read one guide.** Navigate, re-eval, then in this order: `__gf.meta()` →
   `__gf.toc({min:800})` → `__gf.grep("threshold")` / `"rewards"` / `"hidden"` /
   `"upgrades"` / `"economy"` → at most four `__gf.section(i)` reads (page a long one with
   `from`). Budget: about 60KB of context per guide, about twelve pages per game per session.
   If `__gf.page().kind` is `"challenge"`, **stop** — never loop. The fallback is the owner's
   real Chrome (`claude-in-chrome`) with the same probe text.
4. **Write the digest as facts land** — not at the end. A lost session then costs a page,
   not a game.
5. **Cross-check** each fact that will become a row: `python3 scripts/wiki_fetch.py <host>
   "<Page>"` or a second guide by a different author. Two distinct pointers on the
   candidate's `pointers:` line before it gets a `row:`.
6. **Write the rows.** Paste the digest's `## Codex rows` block into the arrays in
   `JRPG_Design_Codex.html` (continue the M/g sequences, never renumber), give each row its
   `refs:[{u,t}]`, update the counts in CLAUDE.md and copy it to AGENTS.md, then
   `node scripts/validate_codex.mjs --selftest` and `node scripts/digest_lint.mjs`.
7. **Record the delta** under `## Codex delta` and set the game's status.

"No minigame with defined payouts" is a valid result. Never pad.

### What the digest holds

| Section | Maps onto |
|---|---|
| `## Sources` | the guides read — id, title, author, version, updated, category, KB, URL |
| `## Mechanics candidates` | one `###` per candidate: `cat`, `how`, `loop`, `notes`, `verbs`, `pointers`, `row` |
| `## Minigame candidates` | one `###` per candidate: `p`, `r`, `l`, `pointers`, `row`, and an `rt` table with a `src` column |
| `## Exploration & upgrade facts` | bullets under `### Hidden`, `### Upgrades`, `### Shops & exchange` — the pillar's raw material |
| `## Unverified or contradicted` | single-source facts and conflicts, so the next pass doesn't redo them |
| `## Codex rows` | a paste-ready `js` block, ids as placeholders |
| `## Codex delta` | the ids assigned after the splice |
