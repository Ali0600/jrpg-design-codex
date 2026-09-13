# Design Decisions

The roads not taken, preserved. Sibling of `learnings.md`: that file keeps concepts,
this one keeps forks — every substantive either/or, what was chosen, and what the
rejected options still offer.

## Backlog — alternatives worth trying later

- **Both-scores-per-game (original + best remaster)** (from the Metacritic fork) —
  revisit hook: `scripts/fetch_scores.py` already resolves both slugs; add a second
  field set (`mcR`, `usR`) and a second chip row.
- ~~**A committed splice script for digest rows**~~ — **promoted 2026-09-06**, its revisit
  hook reached: the 15-game GameFAQs rollout will splice 45–75 rows. Shipped as
  `scripts/splice_rows.mjs` (placeholder ids bind rows to digest candidates; dry run by
  default; 18 checks, each mutation-proven).
- **An at-least-three gate on discovery verbs** (from the verb-evidence fork, 2026-09-13) —
  revisit hook: once research adds rows whose own text brings *The fleeing rare* (1 today)
  and *Vista sketch* (2) to three mechanics each, add the rule to `validate()` beside the
  ledger checks, with one sabotage that inserts an unused verb into `VERBS`.

---

## 2026-09-13 — What a lineage claims, and which node it marks

**Fork:** the Pillars tab called each lineage a chain "where each game answers the one before
it", two of the three chains were not even in release order, and the green "worth stealing"
marker went to whichever node came last.

- **A shared shape, in release order, with an explicit `best`** ✔ — the copy claims only what
  the data can show: a shape each node's own text carries (quoted in `docs/lineages.md`) and a
  release year. The validator enforces the order, and `best` names the green node, so sorting a
  chain can never move the emphasis.
- **Keep "answers the one before it"** — `rejected — an influence claim; no row's text says one
  game's designers responded to another's, so it could only ever be asserted`
- **Strictly increasing years** — `rejected — 1998 alone has seven roster games; a tie is two
  releases in one year, not a broken order, and forbidding it would drop real nodes`
- **Keep the positional marker** — `rejected — it once rendered a counter-example green
  (docs/learnings.md), and release order moves the best node mid-chain (Ys VIII)`

**Chosen:** the first. 3 chains became 12, covering 65 mechanics from 44 games. The evidence
pass moved one planned node: Suikoden II's castle left *The shop that has upgrades too*,
because its card says shops appear inside the castle, never that a shop itself grows.

**Revisit hook:** an influence claim could return as its own field (`answers:"<id>"` on a node)
the day a cited source, such as a developer interview, supports one; the ledger's quote slot is
where that citation would sit.

---

## 2026-09-13 — Where a discovery-verb tag's evidence lives

**Fork:** 53 rows carried verbs seeded from `GAME_PROMPT_V2.md` §3's verb table, and 62 rows
in the three discovery categories had never been reviewed. What makes a tag defensible, and
where is that recorded?

- **A quote from the row, in a committed ledger** ✔ — `docs/verbs.md`, one entry per reviewed
  row. Each tag carries a verbatim span of the row's own `how`/`loop`/`notes`; the validator
  proves every quote is a real substring, holds the page's tags equal to the ledger's in both
  directions, and requires an entry for every discovery-category row. `scripts/verb_tags.mjs`
  is the only writer. A `none` entry records a row that was read and has no verb.
- **Keep the brief-seeded tags as sourced** — the brief's table names a root mechanic per verb.
  `rejected — a tag a reader cannot check against the card is the claim this codex refuses
  everywhere else; M098 is the brief's root for The fleeing rare and never says a chocobo flees`
- **`verbs:[]` in the data for a reviewed row with no verb** — completeness readable from the
  page alone. `rejected — renders nothing, adds ~36 no-op edits to the owner's data file, and
  would have to be taught to splice_rows.mjs and the digest template`

**Chosen:** the ledger. Measured on the 2026-09-13 pass: 118 entries, tags 74 → 101 (52
added, 25 dropped). The 25 dropped tags, each with no supporting span in its row: M029 Visible
but unreachable; M087 Heard, not seen; M098 The fleeing rare; M209 Inscription deduction; M265
A second layer; M266 Latent geometry; M267 Shop stock and Mastery reveal; M268 Latent geometry
and Consequence; M269 Vista sketch and Mastery reveal; M270 Traded; M271 The fleeing rare; M272
Mastery reveal; M273 Latent geometry; M274 The fleeing rare; M275 Mastery reveal; M277 Shop
stock and Traded; M278 Mastery reveal and Consequence; M279 Consequence and Mastery reveal; M280
The fleeing rare. Seven seeded rows now read `none` (M029, M267, M269, M272, M277–M279); each
entry says why.

**Sub-fork (owner, AskUserQuestion, 2026-09-13):** the plan also gated "every verb carries at
least three mechanics", and the evidence rule leaves two verbs short.
- **Ship without that gate** ✔ — the thin verbs become research targets, named in CLAUDE.md.
- **Research first, then gate** — hold the PR for a research pass that adds rows for both.
  `deferred — worth trying` (see the Backlog)
- **Merge the two verbs away** — fold them into Guarded and Inscription deduction.
  `rejected — it rewrites the brief's 15-verb taxonomy to fit what the codex happens to hold`

**Revisit hook:** a second evidence type — `brief · §3` — checked against the brief's own
table would restore the seeded roots without a quote, if a later pass decides the brief is a
source in its own right. The parser's field list (`LEDGER_FIELDS`) is where it plugs in.

---

## 2026-09-07 — Covers: Wikipedia thumbnails committed vs GameFAQs box art vs none

**Fork:** the owner asked for a picture beside every game's name. Where do 72 box-art
images come from, and where do the bytes live?

- **Wikipedia's lead image, committed at thumbnail size** ✔ — one `pageimages` API call
  per fifty titles (`pilicense=any`, because box art is a non-free file; `pithumbsize=240`,
  so Wikipedia serves the thumbnail and nothing is resized locally), the bytes checked by
  host, size and magic, written to `covers/<slug>.<ext>` with the article and the `File:`
  page recorded in `covers/SOURCES.md`, and the row's `wp` field doubling as the override
  and the article link. Same posture as `shots/` (2026-08-29): reduced size, identification
  beside design commentary, provenance one click away.
- **GameFAQs' own box thumbnails** — the page the owner was looking at, but the host is
  Cloudflare-challenged to every script, hotlinking was already rejected for the gallery
  (link rot plus a copyright optic), and pulling bytes back through the browser tool's
  result channel costs thousands of tokens per image.
  `rejected — unfetchable by script, and hotlinking was rejected 2026-08-29`
- **No pictures** — nothing to curate, nothing to defend.
  `rejected — the owner asked for them, and a roster of 72 names is hard to scan`

**Chosen:** Wikipedia, committed. Two rules travel with it: an image is a CLAIM about its
content until someone has looked at it (`--write` builds a contact sheet; the first run's
file names lied both ways — `WildArms.png` was the series logo, while `BDFF_Logo.jpg` and
`Deluxe_package.jpg` were the real boxes), and a game Wikipedia cannot serve is recorded in
the ledger's no-yield list, never padded from elsewhere.

**Revisit hook:** if a takedown ever arrives, `git rm` the file and unset the row's
`cover` (`game_rows.mjs --unset cover`); the validator's two-way check makes a half-removal
impossible and the site redeploys clean.

---

## 2026-09-07 — Where the GameFAQs game-page data lives

**Fork:** a game's GameFAQs page carries a Game Detail box, user ratings and a "Games You
May Like" list. Where do those facts go once the probe has read them?

- **On the `BASE_GAMES` row** ✔ — four script-owned fields (`gf`, `cover`, `wp`, `digest`),
  each on its own line, last in the row, in a fixed order, written only by
  `scripts/game_rows.mjs`. One join key (the title), one renderer, and the validator is
  already looping over the rows. The line-per-field invariant is what lets the writer
  replace text instead of parsing braces — and copy every other line of the row byte for
  byte, which is the whole safety argument.
- **A separate `GF_DETAILS` table keyed by title** — keeps the roster rows short, but a
  second title-keyed structure drifts the day a title is edited, and every consumer
  would join twice.
  `rejected — a second title-keyed table drifts on rename`
- **The raw probe JSON committed under `docs/research/gf/`** — re-derivable and diffable,
  but a second source of truth beside the arrays, and a JSON that carries the page's
  `meta` blurbs is one careless copy away from storing publisher prose in a public repo.
  `rejected — a second source of truth, one copy from storing prose`

**Chosen:** on the row. The strictness lives in `scripts/splice_game.mjs`: an unseen Game
Detail label is a refusal that names the label (the map is extended by hand, never
guessed), the page's title must match the row's, the release year must sit within two
years of the row's unless a reason is written into `gf.note`, and no stored string may
exceed 120 characters — the machine-checkable form of "prose is not stored", re-asserted
by the validator at rest. The changelog gained a `games:[…]` list so a batch of harvested
rows shows up in What's New without an id-less entry, which would have moved the
first-visit baseline (`seenDate()` falls back to the second-newest entry's date).

**Revisit hook:** if a fifth script-owned field ever appears, it goes into `OWNED` in
`game_rows.mjs` and nowhere else — the invariant, the validator and the writer all read
that list.

---

## 2026-09-06 — How the app should show "what changed since I last looked"

**Fork:** derive the change list from git at deploy time / stamp each row with an `added`
date / keep one hand-maintained `CHANGES` list in the data.

- **Git at deploy time** — a build step writes the changelog from the commit history.
  Accurate and free of bookkeeping, but the codex is deliberately a single file that
  works from `file://` with no build; a derived changelog would be absent exactly when
  the owner opens the local copy, and it would describe COMMITS rather than the
  research batches the owner actually reviews.
  `rejected — needs a build step the project does not have, and dies on file://`
- **A date on every row** (`added:"2026-09-06"`) — no separate list to keep in sync, but
  it cannot express "this row was REWRITTEN" without a second field stamped by hand on
  every edit, and 370 rows would each carry a date nobody reads.
  `rejected — cannot express an update, which is half of what the owner wants to see`
- **One `CHANGES` list in the data region** ✔ — newest first, each entry `{date, title,
  note, added, updated}`. Every surface derives from it: the pills, the strip, the sort,
  the filters, the Games-tab tally.

**Chosen:** the `CHANGES` list, with two gates that stop it rotting into decoration.
The validator requires the union of every `added` to EQUAL the full id set, so a row
cannot reach the arrays unlisted; `scripts/check_changes.mjs` diffs a PR against its base
and fails when a rewritten row is not newly logged as `updated`. The splicer writes the
`added` half itself, so the only manual step is logging an edit you made by hand.

**Revisit hook:** if the manual `updated` step is ever missed twice in a row, the next
step is deriving it — have `check_changes.mjs` WRITE the entry instead of failing, behind
a `--fix` flag, so the gate becomes a codemod rather than a chore.

---

## 2026-07-28 — Metacritic scores: which release's score to record

**Fork:** original release / highest-rated version / both.

- **Original** *(chosen)*: matches the codex's "year = first release" convention; where
  only a port is scored, the platform is labelled (13 caveats live in the data).
- **Highest-rated**: flatters remasters; number describes a version whose mechanics
  differ from what the codex catalogued.
- **Both**: most complete; doubles fetch work and adds a second chip row.

**Status:** highest-rated rejected — misleading for design research. Both:
`deferred — worth trying` (see Backlog).

## 2026-08-12 — Repo visibility and where the codex is hosted

**Fork:** the codex needed off-machine backup, a validation gate, and ideally a URL that
works from a phone. Free GitHub Pages requires a public repo, and this repo carries the
owner's original design work (both Waystone briefs).

- **A — public repo + GitHub Pages** *(chosen — owner's call)*: simplest path, free
  hosting, and a data-rich project with a real CI gate reads well as a portfolio piece.
  Cost: the design documents become publicly readable. Mitigations applied — the personal
  overlay (`jrpg-codex-backup.json`) is gitignored so ratings and private notes never
  land in the repo, and publishing first is itself a timestamped authorship record.
- **B — private repo + Cloudflare Pages**: keeps the designs unpublished while still
  giving a hosted URL, since Cloudflare deploys from private repos on its free tier.
  Costs a second account and a second CI surface to keep honest.
- **C — private repo, CI only, no hosting**: backup and validation without publishing
  anything; the app stays a local file.

**Status:** B — `deferred — worth trying` if the owner later wants the designs private
without losing the hosted URL. C — `rejected`: gives up the phone-accessible copy, which
was one of the two reasons to do this at all.

**Revisit hook:** the deploy is one job in `.github/workflows/validate.yml`. Switching to
B means flipping the repo private and replacing that job with a Cloudflare Pages build —
the `validate` job and its `needs:` gate stay exactly as they are.

## 2026-08-12 — How much of the codex the "My Game" board should organise

**Fork:** the board needed a fixed structure to sort the shortlist into.

- **A — six fixed system buckets** *(chosen)*: mirrors `GAME_PROMPT_V2.md`'s own
  structure, so the board and the brief stay legible against each other, and an
  unplaceable mechanic is itself a useful signal.
- **B — user-defined buckets**: maximum flexibility; but an empty board with no
  suggested structure is a blank page, and the brief already settled the systems.
- **C — group by the five design pillars**: reuses `PILLARS`; rejected because pillars
  are *tests* a mechanic must pass, not places a mechanic lives — most good mechanics
  satisfy several, so the grouping would be arbitrary.

**Status:** B — `deferred — worth trying` once the fixed six prove too coarse.
C — `rejected — pillars are tests, not containers`.

**Revisit hook:** `BUCKETS` is a single const near the My Game render code; making it
user-editable means persisting it into `store.myGame` and adding an editor.

## 2026-08-12 — Dropping the card-game side project

**Fork:** a standalone card game was designed from the codex's card-game research
(Triple Triad, Queen's Blood, Tetra Master) and written up as a full rules document.
The owner tried it and reported it "wasn't helpful or fun". What happens to it?

- **A — delete it and every reference** *(chosen — owner's call)*: the design document
  removed, references cleared from CLAUDE.md, AGENTS.md, README.md, the codex data and
  this file. Gone from the repo, the live site, and any fresh clone.
- **B — scrub it from git history too**: rejected. It rewrites every commit hash on an
  already-published repo, GitHub retains orphaned objects by SHA regardless, and the
  content was the owner's own design doc rather than a secret.
- **C — keep it, marked abandoned**: rejected — the point was to stop seeing it.

**Do not re-propose building it.** This is recorded so a future session reads "tried,
didn't land" rather than spotting the gap and suggesting it again.

**What survives it:** Baten Kaitos stays in the research queue on its own merits, with
its brief rewritten away from serving the card game and toward the mechanic itself —
every item being a card that ages in real time. Possessions that change on their own is
a legitimate "everything has upgrades" question independent of any card game. The
underlying card-game research also remains in the codex as ordinary entries (mechanics
M024, M092, M131 and their minigame rows), which is where it belongs.

## 2026-08-29 — UI screenshots: committed copies vs hotlinks vs local-only

**Fork:** the gallery needs images of copyrighted game UIs, and the repo + site are
public. Where do the bytes live?

- **A — commit compressed copies** *(chosen — owner's call)*: downloaded once via the
  wiki APIs, resized (≤960px JPEG, small pixel art stays PNG), committed under
  `shots/` with per-file provenance in `shots/SOURCES.md`. No rot, works offline and
  on Pages. Standard wiki fair-use posture: reduced resolution, accompanying design
  commentary, attribution.
- **B — hotlink the wiki CDN URLs**: no copyrighted bytes in the repo — but images
  break when wikis rename files, which is the exact rot class the codex already
  refuses for YouTube video ids; and the local file needs internet.
- **C — local-only, gitignored**: safest legally, but the hosted copy (the whole point
  of Pages for the owner) would show an empty gallery.

**Status:** B — `rejected — trades a copyright optic for guaranteed link rot`.
C — `rejected — defeats the phone use-case`.

**Revisit hook:** if a takedown ever arrives, the fix is `git rm` the file + row (CI's
set-equality check makes a half-removal impossible) and the site redeploys clean.

## 2026-09-05 — How to read GameFAQs, a source that challenges every script

**Fork:** GameFAQs guides hold the item lists, secrets and minigame payouts the codex
wants, but the site answers every scripted client with a Cloudflare challenge (HTTP 403
"Just a moment…", browser User-Agent or not) and has no API.

- **A — read it in the Browser pane, one page at a time, with an in-page probe**
  *(chosen)*: a real browser passes the challenge because it IS the thing being checked
  for; `scripts/gf_probe.js` is evaluated inside the page and returns bounded digests
  (contents list, keyword windows, one section at a time — 6KB default, 12KB ceiling),
  because the only channel back is the tool result. Facts, never guide text, land in a
  committed per-game digest with a pointer on every one. Cost: human browsing pace,
  ~12 pages per game, and the probe is re-pasted on every navigation.
- **B — reuse the browser's `cf_clearance` cookie from `curl`**: fast and scriptable,
  and exactly the fingerprint-spoofing bypass the repo's own learning rejects — it turns
  a "wrong door" into an arms race with the site's bot defence, against a robots.txt
  that names AI crawlers as disallowed.
- **C — skip the source**: the wikis already work through their API. But the pilot game
  has two mechanics rows, zero minigame rows, and a 29KB *Power-Up/Item FAQ* nobody else
  transcribed.

**Status:** B `rejected — a bypass, not a front door`. C `rejected — leaves the richest
source on the table`.

## 2026-09-05 — Where harvested facts live before they are rows

**Fork:** a guide yields far more than the two or three rows the codex keeps per game.

- **A — `docs/research/<slug>.md`, committed** *(chosen — owner's call)*: every useful
  fact in our own words with its pointer; survives a lost session; is the staging file
  the rows are written from; greppable later. Public repo, so the linter refuses a fact
  without a source and the runbook forbids guide prose.
- **B — scratchpad only**: what the batch pipeline did before. A lost staging dir once
  cost a full re-do, and the surplus was thrown away every time.

**Status:** B `rejected — lossy, and it already bit once`. Related, deferred: a committed
splice script (see Backlog) — the digest's paste-ready `## Codex rows` block makes
row-writing mechanical without one at today's two-to-four rows per game.
