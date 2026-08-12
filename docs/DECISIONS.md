# Design Decisions

The roads not taken, preserved. Sibling of `learnings.md`: that file keeps concepts,
this one keeps forks — every substantive either/or, what was chosen, and what the
rejected options still offer.

## Backlog — alternatives worth trying later

- **In-match knowledge quizzes on card lore** (from the WAYMARK fork) — cards carrying
  world-facts that matter in play; revisit hook: WAYMARK §5.4 keywords could host a
  "Loremark" keyword once the base game is proven.
- **Both-scores-per-game (original + best remaster)** (from the Metacritic fork) —
  revisit hook: `scripts/fetch_scores.py` already resolves both slugs; add a second
  field set (`mcR`, `usR`) and a second chip row.

---

## 2026-07-28 — WAYMARK: standalone vs in-RPG card game

**Fork:** design the owner's card game as (A) the in-world card game of Waystone,
(B) a standalone game, or (C) standalone-first with explicit integration hooks.

- **A — in-RPG only**: richest thematic fit immediately; but unusable until Waystone
  exists, and the design brief couldn't be handed to another conversation cleanly.
- **B — standalone only**: shippable on its own; but risks designing economy hooks
  (shops, opponents) that later fight Waystone's systems.
- **C — standalone-first, renameable slots** *(chosen — owner's call)*: every economy
  element is a named slot with a 1:1 Waystone binding (CARD_GAME_PROMPT.md §10).
  Constraint adopted: if a mechanic can't survive the renaming untouched, it was
  designed wrong.

**Status:** A rejected — subsumed by C's §10. B rejected — C is B plus a mapping table.

**Revisit hook:** integration time = replace GAME_PROMPT_V2.md §7 with §10's bindings.

## 2026-07-28 — WAYMARK: which ancestor lineage drives the core rules

**Fork:** grid-capture (Triple Triad / Tetra Master), lane-&-rank (Queen's Blood /
Gwent), or a research-driven hybrid.

- **Grid-capture pure**: most readable, fastest matches; but well-trodden — hard to be
  "unique, not a clone."
- **Lane-&-rank pure**: deepest deck construction; but heavier rules and longer matches,
  failing the owner's 2–4-minute bar for roadside NPC play.
- **Hybrid** *(chosen — research decided, owner pre-approved that mode)*: Triad's
  side-rank capture for readability + QB's territory logic as an adjacency gate
  (no pawn bookkeeping) + the genuinely novel layer moved to the META: collectible
  rule-cards (Edicts) and per-copy growth (Journey Marks).

**Status:** pure lineages rejected — each fails one of the owner's acceptance tests
(uniqueness / match length). `deferred — worth trying`: a lane-scored VARIANT could
ship later as a venue type ("tournament boards score by row totals") without touching
the core rules.

**Revisit hook:** WAYMARK §9 knobs; a lane-scoring venue would slot in as a House
Edict, keeping §4 untouched.

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
owner's original design work (WAYMARK's full rules, both Waystone briefs).

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
