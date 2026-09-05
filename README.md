# JRPG Design Codex

A searchable research database of **what makes JRPG progression and exploration feel
good** — 261 mechanics across 72 games, 89 minigames with their actual reward tables,
and reception scores — built as a design reference for an original JRPG.

**[Open the codex →](https://ali0600.github.io/jrpg-design-codex/)**

It is one self-contained HTML file. No build step, no dependencies, no server: open it
from the link above, or clone the repo and double-click `JRPG_Design_Codex.html`.

## What's in it

| | |
|---|---|
| **261 mechanics** | Each with how it works, its reward loop (`do X → get Y → feels good because Z`), and notes on adapting it |
| **89 minigames** | 44 carry concrete reward tables — the exact item at the exact threshold, not "prizes and gil" |
| **72 games** | PS1 cult classics through to Clair Obscur and Metaphor, with Metacritic critic + user scores |
| **5 design pillars** | Each with a test question to judge a mechanic against |

Every entry is wiki-verified against at least two sources at the time it was written.
Reward specifics are never written from memory — a plausible-looking wrong item name is
worse than none, because it reads as verified.

### Features

- **Filter and search** across mechanics by game, category, and your own rating
- **Reward tables** rendered inside minigame cards, and searchable
- **Reception scores** as colour-banded chips, sortable five ways — including the
  *users-vs-critics gap*, which works as a cult-classic finder (Legend of Dragoon +13,
  Radiata Stories +9, Suikoden II +8)
- **Research pipeline** on the Games tab: cards sort Researching → To Research →
  Researched, and queued games carry a written brief for the question they should answer
- **My Game board** — everything you mark *Yes* collects into a workspace and gets placed
  into one of six systems of the game you're designing, each with its own design notes
- **Discovery verbs** — a 15-verb taxonomy of *how* a reward is found (guarded, traded,
  tool-gated, a second layer…), so you can ask "who else solved this shape?"
- **Lineages** — chains where each game answers the one before it, ending on the node
  worth stealing from, or on a counter-example worth designing against
- **UI Gallery** — captioned screenshots of the researched games' actual interfaces
  (battle HUDs, menus, minigames), filterable by game and screen type, with thumbnails
  on each game's card
- **Sources** — rows can carry provenance links back to the guide or wiki page each
  claim came from; everything a research pass found that didn't fit a row lives in a
  per-game digest under [`docs/research/`](docs/research/)
- **Your own layer** — ratings, want/skip decisions, notes, pinned videos and custom
  entries save to `localStorage`, with JSON export/import for backup

> Browser storage is **per origin**, so edits made on the hosted site and edits made by
> opening the local file are separate. Use **Export backup** / **Import backup** to move
> between them.

## Design output

The codex isn't only an input. Its research was distilled into an original game brief:

- **[`GAME_PROMPT_V2.md`](GAME_PROMPT_V2.md)** — *Waystone*, an exploration RPG built on
  a 15-verb discovery taxonomy, defensive timing combat, and abilities that go party-wide
  once mastered
- **[`GAME_PROMPT.md`](GAME_PROMPT.md)** — the earlier Waystone brief, kept for reference

## Repository layout

```
JRPG_Design_Codex.html     the app and the database, in one file
shots/                     UI screenshots for the gallery (sources in SOURCES.md)
scripts/validate_codex.mjs structural validator (runs in CI)
scripts/gf_probe.js        in-page probe for reading GameFAQs guides (tests alongside)
scripts/digest_lint.mjs    pointer-grammar lint for the research digests
scripts/wiki_fetch.py      MediaWiki API client used for research
scripts/fetch_scores.py    Metacritic critic + user score fetcher
docs/research/             one digest per researched game, every fact with its source
docs/                      learnings and design decision records
```

## Working on it

```bash
node scripts/validate_codex.mjs --selftest
```

Validation runs on every push and pull request, and **gates the deploy** — nothing
reaches the live site that hasn't passed. It checks ID sequences, category and enum
values, cross-references between the arrays, score ranges, reward-table completeness,
source-link hosts, and that the counts quoted in this README and in CLAUDE.md still
match the data.

`--selftest` then sabotages the data in memory — a duplicated ID, an out-of-range score,
a broken reference — and requires every check to fire. A validator that has only ever
passed can't tell you the data is sound; it can only tell you it ran.

Research a game via the MediaWiki API (Fandom serves 403 to bots over HTML, but its
`api.php` is open):

```bash
python3 scripts/wiki_fetch.py finalfantasy.fandom.com "Chocobo Hot and Cold" --plain
```

Add a UI screenshot to the gallery (list a page's images, then fetch one — it is
resized, format-detected by magic bytes, and logged to `shots/SOURCES.md`):

```bash
python3 scripts/fetch_ui_shots.py --list finalfantasy.fandom.com "Sphere Grid"
```

GameFAQs guides are the richest source for item lists and minigame payouts, but the
site challenges every script, so they are read in a real browser with a probe evaluated
inside the page that returns only bounded digests (contents, keyword windows, one
section at a time). The runbook is [`docs/research/README.md`](docs/research/README.md);
the probe's offline tests run against synthetic fixtures:

```bash
node --test scripts/gf_probe.test.mjs
```

Game screenshots in `shots/` are the property of their respective publishers,
reproduced at reduced resolution for design study and commentary; every image's
source is recorded in [`shots/SOURCES.md`](shots/SOURCES.md).

## Experience Gained

- **CI/CD pipeline** (GitHub Actions) with a validation gate that blocks deployment on
  failure, SHA-pinned third-party actions, and least-privilege job permissions
- **Automated data-integrity testing** — a zero-dependency validator enforcing 25
  structural invariants, with a mutation-testing self-check proving each one can fail,
  and a 17-case offline suite for the browser probe built on a 100-line DOM stand-in
- **Static site deployment** to GitHub Pages, triggered only after checks pass
- **Resilient data collection** — API-first Python clients with host allowlisting,
  range validation that rejects malformed upstream values, fail-closed error handling,
  and an in-page extraction probe for a Cloudflare-gated site that caps every result
  at 12KB so a 1.4MB guide can be read without ever being fetched whole
- **Documentation-as-code** — CI verifies that figures quoted in the README and the
  agent docs still match the data they describe; the README check caught a real
  two-batch drift on the day it was added
