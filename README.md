# JRPG Design Codex

A searchable research database of **what makes JRPG progression and exploration feel
good** — 243 mechanics across 66 games, 87 minigames with their actual reward tables,
and reception scores — built as a design reference for an original JRPG.

**[Open the codex →](https://ali0600.github.io/jrpg-design-codex/)**

It is one self-contained HTML file. No build step, no dependencies, no server: open it
from the link above, or clone the repo and double-click `JRPG_Design_Codex.html`.

## What's in it

| | |
|---|---|
| **243 mechanics** | Each with how it works, its reward loop (`do X → get Y → feels good because Z`), and notes on adapting it |
| **87 minigames** | 42 carry concrete reward tables — the exact item at the exact threshold, not "prizes and gil" |
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
- **Your own layer** — ratings, want/skip decisions, notes and custom entries save to
  `localStorage`, with JSON export/import for backup

> Browser storage is **per origin**, so edits made on the hosted site and edits made by
> opening the local file are separate. Use **Export backup** / **Import backup** to move
> between them.

## Design output

The codex isn't only an input. Three original design documents were written from it:

- **[`GAME_PROMPT_V2.md`](GAME_PROMPT_V2.md)** — *Waystone*, an exploration RPG built on
  a 15-verb discovery taxonomy, defensive timing combat, and abilities that go party-wide
  once mastered
- **[`CARD_GAME_PROMPT.md`](CARD_GAME_PROMPT.md)** — *WAYMARK*, a rules-complete card
  game: territory-gated placement, collectible rule-cards, per-copy card growth, and
  zero randomness in match resolution
- **[`GAME_PROMPT.md`](GAME_PROMPT.md)** — the earlier Waystone brief, kept for reference

## Repository layout

```
JRPG_Design_Codex.html     the app and the database, in one file
scripts/validate_codex.mjs structural validator (runs in CI)
scripts/wiki_fetch.py      MediaWiki API client used for research
scripts/fetch_scores.py    Metacritic critic + user score fetcher
docs/                      learnings and design decision records
```

## Working on it

```bash
node scripts/validate_codex.mjs --selftest
```

Validation runs on every push and pull request, and **gates the deploy** — nothing
reaches the live site that hasn't passed. It checks ID sequences, category and enum
values, cross-references between the arrays, score ranges, reward-table completeness,
and that the counts quoted in the docs still match the data.

`--selftest` then sabotages the data in memory — a duplicated ID, an out-of-range score,
a broken reference — and requires every check to fire. A validator that has only ever
passed can't tell you the data is sound; it can only tell you it ran.

Research a game via the MediaWiki API (Fandom serves 403 to bots over HTML, but its
`api.php` is open):

```bash
python3 scripts/wiki_fetch.py finalfantasy.fandom.com "Chocobo Hot and Cold" --plain
```

## Experience gained

- **CI/CD pipeline** (GitHub Actions) with a validation gate that blocks deployment on
  failure, SHA-pinned third-party actions, and least-privilege job permissions
- **Automated data-integrity testing** — a zero-dependency validator enforcing 14
  structural invariants, with a mutation-testing self-check proving each one can fail
- **Static site deployment** to GitHub Pages, triggered only after checks pass
- **Resilient data collection in Python** — API-first clients with host allowlisting,
  range validation that rejects malformed upstream values, and fail-closed error handling
- **Documentation-as-code** — CI verifies that figures quoted in the docs still match the
  data they describe, so the two can't silently drift
