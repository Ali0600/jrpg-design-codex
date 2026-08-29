# Design Decisions

The roads not taken, preserved. Sibling of `learnings.md`: that file keeps concepts,
this one keeps forks — every substantive either/or, what was chosen, and what the
rejected options still offer.

## Backlog — alternatives worth trying later

- **Both-scores-per-game (original + best remaster)** (from the Metacritic fork) —
  revisit hook: `scripts/fetch_scores.py` already resolves both slugs; add a second
  field set (`mcR`, `usR`) and a second chip row.

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
