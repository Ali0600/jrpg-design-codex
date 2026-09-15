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
- **Wikidata ids for facets** (from the facet-vocabulary fork, 2026-09-13) — revisit hook:
  every row carries its `wd` since 2026-09-13, so what remains is fetching each item's platform
  (P400), genre (P136) and developer (P178) claims as a source in `facetSources()`, which would
  retire most of `FACET_VOCAB`.
- **The Mechanics and Minigames queries in the address** (from the row-search fork, 2026-09-14) —
  revisit hook: `route()` reads exactly two hash shapes (`#game=` and `#games=`). A third, say
  `#mechanics=<query>`, needs its own branch there, a writer in each tab's search listener, and a
  rule for what a tab click does to a hash that belongs to another tab.

---

## 2026-09-15 — How the Mechanics and Minigames tabs list rows

**Fork:** both tabs rendered one flat run of cards (294 mechanics, 103 minigames), with a row's game a
small link in its head. The owner asked for the games to be listed instead, each game's rows under it,
with a way to expand them all.

- **A: grouped by game, games newest first, opened by any filter** *(chosen by the owner,
  AskUserQuestion 2026-09-15)*. Each game is a collapsible group; the default order leads with the game
  whose rows changed most recently, as the Games tab does, and *research order* and *A–Z* stay in the
  sort menu. A search or a filter opens every game that still matches, so a filtered list reads like
  the flat one did, under headings.
- **B: the flat list kept behind a "group by game" toggle.** The old view one click away, at the cost
  of two views of one list to keep in step.
- **C: games in research order by default.** The order the codex was written in, but the newest
  research would sit wherever its game first appeared.
- **D: rows inside a game newest first as well.** The freshest row on top, but a reversed id order
  inside one game reads as random.

**Status:** A `built — 2026-09-15`. B `rejected — the owner chose one view; a search already opens every
matching game`. C `rejected — the owner chose newest first, matching the Games tab; still one click away
in the sort menu`. D `rejected — the NEW / UPDATED pills already mark the fresh rows inside a game`.
**Revisit hook:** `groupRows` in the data region returns the groups, so a flat view is a single group
rendered without its header, and another game order is one more `mode` there.

## 2026-09-14 — Which GameFAQs walkthrough a research pass reads

**Fork:** the runbook kept every Full Game Guide for `grep` only, so 25 of the 27 digests that used
GameFAQs never read a walkthrough. The owner asked for the guide GameFAQs flags *Most Recommended*
under Full Game Guides, and never its HTML version. A listing marks a formatted, paginated guide with
an `HTML` flair (5 of The Witcher 3's 6 guides), and not every listing flags a Most Recommended one
(The Witcher 3 flags only Highest Rated guides).

- **A: the Most Recommended plain-text guide, with two fallbacks** *(chosen by the owner,
  AskUserQuestion 2026-09-14)*. When the star is HTML or absent, the largest plain-text Highest
  Rated guide, then the largest plain-text one. The probe's `core.pick` decides, and the linter runs
  it over each digest's Triage table.
- **B: read the HTML guide anyway.** One reading per game, but a formatted guide is split across
  pages, and The Witcher 3's 19-page one had two pages read.
- **C: read no Full Game Guide when the star is HTML or absent.** The rule stays literal, and the
  item lists inside those walkthroughs go unread.

**Status:** A `built — the rule and its linter landed on 2026-09-15, and all 25 older digests were
brought under it the same day (18 read a pick; 7 listings have only HTML walkthroughs)`. B `rejected — a
paginated guide is read two pages deep`. C `rejected — the walkthrough is where the item lists are`.
**Revisit hook:** `core.pick` in `scripts/gf_probe.js` is the one copy of the rule, and
`scripts/digest_lint.mjs` imports it.

## 2026-09-14 — What a game's "last update" means, for the Games tab's default sort

**Fork:** the owner asked for the page to open on the Games tab, sorted by last update. The
changelog records changes to rows (`added`, `updated`) and to games (`games`), but the two
harvest entries (covers on 2026-09-07, infoboxes on 2026-09-13) name all 72 games, so a date
alone ties most of the roster.

- **A: any change, ties broken by row changes, then A–Z** *(chosen by the owner, AskUserQuestion
  2026-09-14)*. A game's date is the newest entry naming it or one of its mechanics or minigames;
  a tie falls to the newest row change, so research order shows through the harvest dates.
- **B: row changes only.** Research order at full resolution, but a game whose details or cover
  were just harvested would not read as updated.
- **C: any change, ties A–Z.** The honest date, but about 52 games sit in one alphabetical block
  under 2026-09-13.

**Status:** B `rejected — it hides game-level updates`. C `rejected — the harvest entries tie most
of the roster`. **Revisit hook:** `gameChangeDates` in the page's data region is the one place a
change becomes a date, so a new kind of change (a `shots` list on an entry, say) is one more loop
there.

## 2026-09-14 — How a duplicate row leaves under a never-renumber rule

**Fork:** g006 and g081 are both Final Fantasy VI's Dragon's Neck Coliseum. g006 carries the
sourced reward table; g081, the July copy, has no sources and a four-row table of bullet points.
Ids are the join key for the owner's saved favourites and pinned videos, so a row cannot simply
vanish or be reused.

- **A: retire g081 into g006** *(chosen by the owner, AskUserQuestion 2026-09-14; built 2026-09-15)*.
  g081's lesson folds into g006, a `RETIRED` map names g081 → g006 so the gap is deliberate and
  the id never returns, a load-time migration moves a favourite or pinned video to g006, and the
  validator and `check_changes.mjs` learn that a row may leave only through the map.
- **B: keep both cards**: give g081 g006's sources and retitle it to the AI-controlled-bout angle.
  Two cards for one minigame stay on the game page.
- **C: repurpose g081** as a different Final Fantasy VI minigame.

**Status:** B `rejected — one minigame, one card`. C `rejected — a favourite saved on g081 would
silently point at another minigame`. **Revisit hook:** none; the `RETIRED` map is the pattern for
any later duplicate.

## 2026-09-14 — The order of the sources pass

**Fork:** 253 mechanics and 44 minigames, every row written before the GameFAQs pilot, carry no
`refs`. They are to be checked against two sources each, one digest per game.

- **A: by research batch** *(chosen by the owner, AskUserQuestion 2026-09-14)*, in the order the
  rows were written, from the original nine games to the queue-clearing batch. Each batch shares
  wikis and an era of guides, so one host's quirks are learned once.
- **B: shortlist first**: games with want:Yes rows first, so provenance lands where the design
  leans, but the host changes on nearly every PR.
- **C: shortlist only**: source the 113 Yes mechanics and stop.

**Status:** B `rejected — the owner preferred the batch order`. C `rejected — it would leave about
140 rows unsourced`. **Revisit hook:** none; the pass runs to the end.

## 2026-09-14 — Where the UI Gallery's screenshots come from, now that Fandom blocks scripts

**Fork:** `scripts/fetch_ui_shots.py` took every gallery image from a game's Fandom wiki. On
2026-09-14 Fandom's image CDN (`static.wikia.nocookie.net`) answered every script download with a
Cloudflare 403, for the full file and the thumbnail, with the helper's user agent and a browser's,
including a file the pipeline fetched on 2026-08-29. A retry twelve minutes later was refused the
same way. The wiki API still answers, so research reads are unaffected, and the Mario wiki's and
WikiBound's CDNs still serve images. Most of the 62 games without a screenshot are Fandom-only.

- **A: Wikipedia only** *(chosen by the owner, AskUserQuestion 2026-09-14)*. The screenshot
  fetcher accepts `en.wikipedia.org`, whose game articles carry small fair-use gameplay
  screenshots (about 300×250) served from `upload.wikimedia.org`. That is the same source and
  licence basis as the covers. It gives about one shot per game, mostly battle screens.
- **B: Wikipedia now, Fandom later**: the same baseline, plus a retry of Fandom's CDN on later days
  for its larger, typed shots.
- **C: Wait for Fandom**: land the three non-Fandom shots, and resume only if the CDN reopens.
- **D: Stop at three shots.**

**Status:** B `rejected — the owner chose not to wait on Fandom`. C `rejected — an indefinite
wait on a block with no known end`. D `rejected — leaves 59 games without a screenshot`.
**Revisit hook:** `fetch_ui_shots.py` still accepts `wikia.nocookie.net` image bytes, so if a
later need for larger shots arises and the CDN answers a single request with 200, a pass can add
them beside the Wikipedia ones.

## 2026-09-14 — Where a minigame-only title's research digest is claimed

**Fork:** eight Final Fantasy titles own minigame rows but no roster row, so nothing can carry
their `digest` field, and the validator refuses a digest file that no game row claims. The
reward-table pass needs digests for them, starting with Final Fantasy XV.

- **A — a policy map beside `KNOWN_UNROSTERED` in the validator** *(chosen, in the plan the
  owner approved on 2026-09-14)*: `UNROSTERED_DIGESTS` maps a title to its slug. Each title must
  be allowlisted and still own a minigame row, and each slug must name a file; three sabotages
  hold those rules. The eight titles stay off the roster.
- **B — roster the eight titles**: each would get a row and a `digest`, but the roster is the
  mechanics roster, and a Researched game with no mechanics would be a false claim on the
  Games tab and in every count.
- **C — no digests for them**: the validator stays as it is, but their reward tables and any
  "no defined payouts" findings would have no committed staging file and no pointers.

**Status:** B `rejected — the roster means researched for mechanics`. C `rejected — the facts
would have nowhere to live`. **Revisit hook:** if one of the titles is ever rostered, move its
slug from the map to the row's `digest`; the validator refuses a slug claimed twice, so the
move cannot be half done.

## 2026-09-14 — Where a game page's related games come from

**Fork:** each game page should list the codex games most like it, so something has to say what
"like" means.

- **Weighted overlap of the facets every row already carries** ✔ — series, studio and the people
  credited count; platform, genre, year and award are left out as too common to mean kinship.
  It is computed on the page from data already there, and every entry shows what it shares.
  An entry must also share a series, a studio or a credited person. Measured on the roster before
  shipping, letting two weak links qualify filled the lists of 14 of 72 games with nothing but
  shared features and themes: Elden Ring's six were links like *Multiple endings* and *Multiplayer*.
- **Wikidata claims** — `rejected for now — unmeasured on these items`: every row carries its `wd`,
  but reading claims is a new harvest, and the credits it would add are already the infobox's.
- **GameFAQs' "Games You May Like"** — `rejected — already on the page`: it names mostly games
  outside the codex, and it keeps its own section.

**Chosen:** facet overlap. `RELATED_WEIGHTS` is one table in the data region, so retuning a weight
is a one-line edit that the tests pin.

---

## 2026-09-14 — Whether the Mechanics and Minigames searches live in the address

**Fork:** the Games tab keeps its query in the hash (`#games=`), so Back and shared links work.
The same grammar now runs in the Mechanics and Minigames search boxes.

- **Keep those two queries out of the address** ✔ — the box and its chips are the whole state,
  exactly as the plain text search always was, and routing does not change.
- **Give each tab its own hash shape** — `deferred — worth trying`: shareable, Back-able mechanic
  queries, at the cost of a third branch in `route()` and a rule for what a tab click does to a
  hash that belongs to another tab. Revisit hook in the Backlog above.

**Chosen:** out of the address. The hash is the Games tab's contract, and its one reader was built
to answer two shapes; widening it is a change of its own.

---

## 2026-09-14 — How the board measures pillar coverage

**Fork:** the My Game board should say how well the shortlist serves each of the five design
pillars, so something has to decide which pillars a mechanic serves.

- **Owner-judged chips** ✔ — five chips and a *none* on every shortlisted mechanic, stored in the
  owner's own `store.myGame.pillars`. An entry, even an empty one, means judged, and the read-out
  always shows how many are not judged yet, so a partial answer never reads as complete.
- **Derived from `cat`** — `rejected — a relabelled category histogram`: pillars 1, 2 and 5 map
  roughly onto categories, while pillars 3 (discovery breeds discovery) and 4 (rewards are
  layered) have no signal in `cat` at all. A computed number would read near zero on exactly the
  two pillars the owner cannot otherwise see, with the confidence of arithmetic.
- **A `pillar:` field on base rows** — `rejected — pillars are tests, not places`: the same reason
  the board's structure fork (2026-08-12) turned down grouping by pillar, and a base-row value
  would be the codex's judgement rather than the owner's.

**Chosen:** owner-judged. The strip and the Design Pillars cards count through one function,
`pillarCoverage()`, over the same pool the bucket tallies use, so the read-outs cannot disagree
about what is on the shortlist.

**Revisit hook:** none needed; a derived suggestion, if ever wanted, would pre-tick chips the owner
confirms, never replace the judgement.

---

## 2026-09-13 — Which unused research data to put to work first

**Fork:** an audit of what each source returns against what the codex keeps found four kinds of
unused data. The owner picked one to build.

- **Themes, features and awards from Wikipedia categories** ✔ — 538 visible categories across
  the 72 articles, 91 of them shared by four or more games. The ones no other facet covers
  (story themes, protagonists, presentation, awards) became filters, and every row gained its
  Wikidata id on the way.
- **Fill the score gaps** — `rejected — owner declined 2026-09-14 ("I don't want at all")`:
  Famitsu scores, and the per-platform Metascores `fetch_scores.py` downloads and discards.
- **Original platform, length and difficulty** — `rejected — owner declined 2026-09-14`: the
  dropped Release row and two stored-but-inert GameFAQs fields.
- **Show research already done** — `rejected — owner declined 2026-09-14`: digest facts, source
  disagreements and soundtracks that never reach the page.

**Chosen:** themes, features and awards. Two calls sit inside it. Categories are stored raw
(`wpcats`) and chosen on the page (`CATEGORY_FACETS`), because storing only the mapped ones would
turn every re-curation into a re-harvest; this is the same reason infobox values are stored as
written. And a category may widen an existing vocabulary kind: "Turn-based role-playing video
games" joins the GameFAQs genre Turn-Based instead of becoming a second filter that nearly
duplicates it. Wikidata's "main subject" (P921) as the theme source — `rejected for now —
unmeasured on these items, while the categories were already one call away and measured`.

---

## 2026-09-13 — How one platform, genre or studio becomes one filter

**Fork:** the owner asked for every platform and genre on a game to be clickable, and for
"Role-Playing" to read RPG. The sources spell one thing several ways: SquareSoft (GameFAQs),
Squaresoft (the hand-written row) and Square (Wikipedia). A filter on the raw string would list
a fraction of the games under each spelling.

- **A canonical vocabulary in the page, closed for platform and genre** ✔ — one table folds
  every spelling to one name. The filter and the validator run the same fold, and a new console
  or label is a build failure that names the string, not a quietly thin filter.
- **Relabel at render time only** (`Role-Playing` → `RPG` in the markup) — `rejected — the
  labels would agree while the filter still split SquareSoft from Squaresoft into two lists`
- **Match by substring** (`dev:square` finds anything containing "square") — `rejected —
  Square Enix and Square Electronic Arts are other companies, and "PlayStation" would list
  every PlayStation 2, 4 and 5 game`
- **Wikidata ids** (platform P400, genre P136, developer P178) — `deferred — worth trying`:
  ids end the spelling problem at the source, but every roster game's item has to be resolved
  and checked first, which is a harvest of its own. Revisit hook in the Backlog above.

**Chosen:** the first. Two calls sit inside it. The developer comes from GameFAQs' `gf.dev`, not
the hand-written row, because the row's `"Enix (tri-Ace)"` would file Star Ocean 2 under its
publisher. And an entry merges spellings of one company or series, never a parent and its
child, so Shin Megami Tensei stays apart from Megami Tensei. Every platform from Wikipedia's
infobox, with every credited person, came in the next PR (the fork below).

---

## 2026-09-13 — Reading a Wikipedia infobox: rendered HTML, not wikitext

**Fork:** every platform a game came out on and every credited person sits in its article's
infobox, which can be read as the wikitext editors write or as the HTML the parser renders.

- **The rendered HTML** (`action=parse`, section 0) ✔ — all 72 articles rendered to one
  `infobox-label` / `infobox-data` table. Its traps show up in that one shape, and each has a
  rule: bold re-release headers, region prefixes, footnotes, comma-joined cells.
- **The wikitext** — `rejected — the roster's articles spell one list with {{Plainlist}},
  {{Video game release}}, <br> and commas, inside templates the parser expands; reading it means
  reimplementing part of MediaWiki`
- **Wikidata** — `deferred — worth trying`, as recorded in the facet-vocabulary fork above.

**Chosen:** the rendered HTML. Values are stored as the article writes them, qualifiers included,
and the page's fold does the normalising, so a better fold never needs a re-harvest.

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
