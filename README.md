# JRPG Design Codex

A searchable research database of **what makes JRPG progression and exploration feel
good**. It holds 281 mechanics across 72 games, 96 minigames with their actual reward
tables, and reception scores. It was built as a design reference for an original JRPG.

**[Open the codex →](https://ali0600.github.io/jrpg-design-codex/)**

It is one self-contained HTML file. No build step, no dependencies, no server. Open it
from the link above, or clone the repo and double-click `JRPG_Design_Codex.html`.

## What's in it

| | |
|---|---|
| **281 mechanics** | Each with how it works, its reward loop (`do X → get Y → feels good because Z`), and notes on adapting it |
| **96 minigames** | 51 carry concrete reward tables — the exact item at the exact threshold, not "prizes and gil" |
| **72 games** | PS1 cult classics through to Clair Obscur and Metaphor, with Metacritic critic + user scores |
| **5 design pillars** | Each with a test question to judge a mechanic against |

Every entry was checked against at least two wiki sources when it was written. Reward
details are never written from memory. A plausible but wrong item name is worse than
none, because it reads as verified.

### Features

- **Filter and search** mechanics by game, category, and your own rating
- **Reward tables** shown inside minigame cards, and searchable
- **Reception scores** as colour-banded chips, sortable five ways. One sort is the
  *users-vs-critics gap*, which works as a cult-classic finder (Legend of Dragoon +13,
  Radiata Stories +9, Suikoden II +8)
- **Research pipeline** on the Games tab: cards sort Researching → To Research →
  Researched. Each queued game carries a written brief for the question it should answer
- **My Game board** — everything you mark *Yes* collects into a workspace. You place each
  item into one of six systems of the game you are designing. Each system has its own
  design notes
- **Discovery verbs** — a 15-verb taxonomy of *how* a reward is found (guarded, traded,
  tool-gated, a second layer…). It lets you ask "who else solved this shape?" Every tag
  quotes the line of the card that earns it, and the quotes live in
  [`docs/verbs.md`](docs/verbs.md)
- **Lineages** — chains where each game answers the one before it. Each chain ends on
  the node worth stealing from, or on a counter-example worth designing against
- **A page for every game** — click a game's name anywhere to open it. The page shows box
  art, what its GameFAQs page says (platform, genre, developer, publisher, release,
  franchise, and how GameFAQs readers rate it, its difficulty and length), every mechanic
  and minigame it contributed, its screenshots and sources, the lineages it sits in, and
  the games GameFAQs readers pair it with. The address carries the page, so Back and
  shared links work
- **Covers** — a box-art thumbnail beside every game. Each comes from Wikipedia at
  thumbnail size, with its source recorded and a Wikipedia link on the page
- **GameFAQs suggestions** — the games GameFAQs lists beside the codex's own, ranked by
  how many codex games point at each. One click on *Queue it* adds a game to your
  research queue
- **UI Gallery** — captioned screenshots of the researched games' actual interfaces
  (battle HUDs, menus, minigames). Filter them by game and screen type. Each game's card
  shows thumbnails
- **What's new** — a changelog strip on the Mechanics tab, `NEW` / `UPDATED` pills on
  the cards themselves, a *newest changes first* sort, a "new or updated only" filter,
  and a **Mark all as seen** button. A fresh batch of research becomes a glance rather
  than a hunt. Clicking any ID chip jumps straight to that card
- **Sources** — rows can carry links back to the guide or wiki page each claim came
  from. Everything a research pass found that did not fit a row lives in a per-game
  digest under [`docs/research/`](docs/research/)
- **Your own layer** — ratings, want/skip decisions, notes, pinned videos and custom
  entries save to `localStorage`. JSON export/import backs them up

> Browser storage is **per origin**. So edits made on the hosted site and edits made in
> the local file are separate. Use **Export backup** / **Import backup** to move between
> them.

## Design output

The codex is not only an input. Its research was distilled into an original game brief:

- **[`GAME_PROMPT_V2.md`](GAME_PROMPT_V2.md)** — *Waystone*, an exploration RPG. It builds
  on a 15-verb discovery taxonomy, defensive timing combat, and abilities that go
  party-wide once mastered
- **[`GAME_PROMPT.md`](GAME_PROMPT.md)** — the earlier Waystone brief, kept for reference

## Repository layout

```
JRPG_Design_Codex.html     the app and the database, in one file
shots/                     UI screenshots for the gallery (sources in SOURCES.md)
covers/                    box-art thumbnails, one per game (sources in SOURCES.md)
scripts/validate_codex.mjs structural validator (runs in CI)
scripts/gf_probe.js        in-page probe for reading GameFAQs guides (tests alongside)
scripts/digest_lint.mjs    pointer-grammar lint for the research digests
scripts/splice_rows.mjs    writes a research digest's rows into the app, and logs them
scripts/check_changes.mjs  CI gate: every rewritten row must be logged in the changelog
scripts/verb_tags.mjs      writes each row's discovery verbs from the evidence ledger
scripts/wiki_fetch.py      MediaWiki API client used for research
scripts/fetch_scores.py    Metacritic critic + user score fetcher
docs/research/             one digest per researched game, every fact with its source
docs/verbs.md              the evidence ledger: each verb tag with the quote that earns it
docs/                      learnings, design decisions, and ost-sources.md (where to buy each soundtrack)
```

## Working on it

```bash
node scripts/validate_codex.mjs --selftest
```

```bash
node scripts/splice_game.mjs --game "Parasite Eve" gf/parasite-eve.json --write
```

```bash
node scripts/fetch_covers.mjs --write
```

The second writes a saved `__gf.game()` result into that game's row. That result is a
game's GameFAQs page: platform, genre, developer, publisher, release, franchise, the user
rating, difficulty and length, and the games GameFAQs pairs it with. Without `--write`
it is a dry run. It refuses an unseen label, a mismatched title, a release year off by
more than two, or any string long enough to be prose. The third fetches every game's box
art from Wikipedia at thumbnail size. It records each file's article and `File:` page in
`covers/SOURCES.md`. It also builds a contact sheet to look at before you commit, because
a lead image is sometimes a logo or the remake's box.

Validation runs on every push and pull request, and it **gates the deploy**. Nothing
reaches the live site until it passes. It checks ID sequences, category and enum values,
cross-references between the arrays, score ranges, reward-table completeness, and
source-link hosts. It also checks that the counts quoted in this README and in CLAUDE.md
still match the data.

`--selftest` then breaks the data in memory on purpose — a duplicated ID, an out-of-range
score, a broken reference — and requires every check to fire. A validator that has only
ever passed cannot tell you the data is sound. It can only tell you it ran.

Research a game through the MediaWiki API. Fandom answers bots with a 403 over HTML, but
its `api.php` is open:

```bash
python3 scripts/wiki_fetch.py finalfantasy.fandom.com "Chocobo Hot and Cold" --plain
```

Add a UI screenshot to the gallery. List a page's images, then fetch one. The script
resizes it, detects its format by magic bytes, and logs it to `shots/SOURCES.md`:

```bash
python3 scripts/fetch_ui_shots.py --list finalfantasy.fandom.com "Sphere Grid"
```

GameFAQs guides are the richest source for item lists and minigame payouts. But the site
challenges every script. So they are read in a real browser, with a probe run inside the
page. The probe returns only bounded digests: contents, keyword windows, one section at a
time. The runbook is [`docs/research/README.md`](docs/research/README.md). The probe's
offline tests run against synthetic fixtures:

```bash
node --test scripts/gf_probe.test.mjs
```

Game screenshots in `shots/` belong to their publishers. They are reproduced at reduced
resolution for design study and commentary. Every image's source is recorded in
[`shots/SOURCES.md`](shots/SOURCES.md). Box-art thumbnails in `covers/` also belong to
their publishers. They are reproduced at 240px only to identify each game beside its
design commentary. Each one's Wikipedia article and `File:` page are recorded in
[`covers/SOURCES.md`](covers/SOURCES.md).

## Experience Gained

- Built a 2-job GitHub Actions CI/CD pipeline: a validation gate that blocks the deploy on
  failure, with SHA-pinned third-party actions and least-privilege job permissions
- Checked the data with a zero-dependency validator that proves it can fail: a self-check
  injects 55 sabotages and fails the build unless every one is caught, and every
  classification tag must quote a verbatim span of the record it labels. Backed by a
  105-case offline suite and a CI diff gate that fails a PR on any unlogged edit
- Deployed the 1-file static site to GitHub Pages, triggered only after checks pass
- Built fail-closed Python clients with host allowlists and range checks, plus an in-page
  probe that caps results at 12KB so a 1.4MB Cloudflare-gated guide is never fetched whole
- Treated docs as code: CI checks that the figures quoted in the README and the agent docs
  still match the data; the README check caught a real 2-batch drift the day it was added
