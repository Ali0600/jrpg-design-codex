# JRPG Design Codex

## What this project is
A personal game-design research database for a solo developer designing their own JRPG.
The owner's core design pillar: **"a world that rewards exploration, where everything has upgrades."**

The main artifact is `JRPG_Design_Codex.html` — a single-file, fully-offline web app
(open directly in a browser, no server needed) containing the entire research database.
`JRPG_Design_Research_Database.xlsx` is the earlier spreadsheet version, kept as a legacy
backup; the HTML file is the source of truth and is more up to date.

## Current contents (as of handoff)
- **243 mechanics** (`BASE_MECHS` array, M001-M243) across **66 researched games**: FF7 Rebirth,
  Elden Ring, FFX, Persona 5 Royal, Xenoblade Chronicles 3, DQ11, Tears of the Kingdom,
  Chained Echoes, Sea of Stars, the PS1 Squaresoft/Enix catalog (FF7/8/9, Chrono Cross,
  Xenogears, Vagrant Story, Legend of Mana, SaGa Frontier, Parasite Eve, Threads of
  Fate, Brave Fencer Musashi, DQ7, Star Ocean 2, Valkyrie Profile), The Witcher 3, and
  the **PS1 cult-classic batch** (M133-M159): The Legend of Dragoon, Suikoden II, Grandia,
  Breath of Fire IV, Legend of Legaia, Wild ARMs, Alundra, Final Fantasy Tactics, Jade
  Cocoon — added 2026-07-20, 3 mechanics each, wiki-verified via scripts/wiki_fetch.py.
  Plus **Clair Obscur: Expedition 33** (M160-M162, added 2026-07-20): Pictos/Lumina
  (master a Picto over 4 battles -> the ability goes PARTY-WIDE and frees the item slot),
  reactive timing defense (parry the whole attack string -> AP refund + free counter), and
  companion-bound traversal (Esquie's rocks: swim -> break coral -> fly). The owner
  specifically loves the LoD -> Sea of Stars -> Clair Obscur timing-combat lineage.
  Plus the **PS2 golden-age batch** (M163-M191, added 2026-07-28): Shadow Hearts: Covenant
  (Judgement Ring — the timing-lineage node), Dark Cloud 2 (Georama town-building + weapon
  evolution + photograph-to-invent), Dragon Quest VIII (Alchemy Pot + Monster Arena),
  Rogue Galaxy (weapon fusion + bounty hunts), SMT Nocturne (Press Turn + Magatama +
  fusion), Odin Sphere (seed/Phozon cultivation), Star Ocean 3 (Item Creation + 300 Battle
  Trophies), Radiata Stories (176-NPC schedule recruitment), Suikoden V (war battles +
  Battle Formations), Persona 4 (weather-deadline + Shuffle Time), Wild ARMs 3 (Personal
  Skills + Search System). 2-3 mechanics each; the 3 "sequel" picks (Suikoden V / P4 / WA3)
  were scoped to only what DIFFERS from their predecessor already in the codex.
  Plus the **popular-classics batch** (M192-M224, added 2026-07-28) which also CLEARED the
  research queue: Chrono Trigger (sidequests that pay story+gear; Millennial Fair), FF6
  (relics, esper level-up sculpting, World of Ruin, the wager-an-item Colosseum), Super
  Mario RPG (the 1996 ORIGIN of the timed-hit lineage; hidden chests; Super Jump 30/100 ->
  Attack Scarf/Super Suit), Terranigma (world resurrection as the progression track),
  Yakuza 0 (money-as-XP; business sims that unlock combat styles), FF12 (45 Hunts; License
  Board; loot->bazaar), Skies of Arcadia (89 Discoveries sold to guilds with DECAYING
  value; 22 crew who upgrade your island), Golden Sun (Djinn: set->unleash->summon->recover,
  four systems from one collectible), DQ5 (the pre-Pokemon monster recruiting), Paper Mario
  TTYD (Badge Points budget; the audience as a resource), Trails in the Sky (quartz feeding
  elemental values into orbment LINES), Xenoblade 1 (Colony 6 rebuild; 157 Unique Monsters),
  Bravely Default (Brave/Default turn banking; Norende village).
  Plus the **modern-hits batch** (M225-M242, added 2026-07-28): Metaphor: ReFantazio
  (Archetypes rank on their OWN A-EXP track; Follower bonds gate class LINEAGES and
  scarce skill-inheritance slots), Yakuza: Like a Dragon (Poundmates — a summon roster
  built from substories), Octopath Traveler II (Path Actions: a DAY and a NIGHT verb per
  traveler, 16 total, usable on any NPC; some townsfolk become battle summons), Ys VIII
  (**the batch standout**: rescued castaways become the village's shops AND a headcount the
  world reads — blocked routes clear only at 5/8/14/20/21/23 villagers, so saving people IS
  the traversal upgrade; map-completion rewards that upgrade the ACT of exploring; one hidden
  Reputation meter absorbing every side activity and gating the ending. M233-M234+M243,
  g084-g087 — two agents cross-checked, the second correcting the first), NieR: Automata (Plug-in Chips as a
  spatial storage budget with fusion + 'diamond' per-copy quality), Ni no Kuni (familiars
  whose FINAL metamorphosis is a choice; a cauldron that rewards undocumented experiment),
  CrossCode (elemental modes gate puzzles but an Overload gauge locks you out if you lean
  on one), Fire Emblem: Three Houses (the monastery week as point-allocation; cross-house
  recruits earned by training into someone they'd respect).
- **87 minigames** (`MINIGAMES` array, g001-g087): the Final Fantasy series (g001-g054)
  plus the PS1 batch (g055-g067), PS2 batch (g068-g079) and popular-classics batch
  (g080-g083: Chrono Trigger's Millennial Fair, FF6's Colosseum, Yakuza 0's two business
  sims), each with a highlighted Rewards field and a
  design lesson. The 9 substantive FFIX entries (g027-g035) and the 13 PS1-batch entries
  carry concrete `rt` reward tables — the exemplar standard for future minigame research.
  As of 2026-07-20 the FFIX entries were verified row-by-row directly against the Final
  Fantasy Wiki via scripts/wiki_fetch.py (no longer snippet-sourced); that pass corrected
  5 facts, notably: "Master Hunter" is the Hunt winner's TITLE, not a key item; FFIX's
  Rebirth Ring is the card game's only item reward but is also obtainable 3 other ways (not
  missable); Ragtime Mouse's Protect Ring depends on answering the FINAL question, not a
  score threshold; Green Plains grants the "Sea" ability (not "Ocean").
- **5 design pillars** (`PILLARS` array) with test questions.
- **Games roster** (`BASE_GAMES` array) — **66 researched + 6 queued** (72 total). Queue
  refilled 2026-07-28 with BRIEF-style `why` entries: EarthBound, Mother 3 (rhythm combos —
  the timing lineage keyed to MUSIC), Kingdom Hearts II, Lost Odyssey, Baten Kaitos (cards
  that AGE in real time — direct WAYMARK research), Live A Live.
- **Reception scores** on each game row (added 2026-07-28): `mc` (Metascore 0-100),
  `mcN` (critic review count), `us` (Metacritic user score 0-10), `usN` (user rating
  count), `mcPlat` (platform the score is FOR), `mcUrl`, `mcNote` (caveat). All fields
  are OPTIONAL — absent means genuinely no data, and the UI prints "no Metascore" /
  "no user score" rather than a zero. Coverage: 63/72 critic, 67/72 user.
  The Games tab renders these as colour-banded chips and offers sorting by Metascore,
  user score, year, and **users-vs-critics gap** (the cult-classic finder: Legend of
  Dragoon +13, Radiata Stories +9, Suikoden II +8).

## Game design briefs (the codex's output, not just its input)
- `GAME_PROMPT.md` — v1 build brief for **Waystone**, a Three.js exploration RPG derived
  from the owner's want:"Yes" clusters. Kept for reference.
- `GAME_PROMPT_V2.md` — **the current one.** Supersedes v1 on three axes: (1) discovery is
  a 15-verb **taxonomy** with a "no region repeats its neighbour's mix" rule, not a single
  riddle gimmick; (2) combat is two-sided timing with DEFENSE as the skill expression
  (Clair Obscur); (3) abilities are earned via Marks & Masteries (master over 4 encounters
  -> party-wide -> frees the slot).
- IMPORTANT owner clarification (2026-07-20): what they love about Elden Ring's paintings
  is NOT the riddle — it's that Elden Ring rewards exploration in *many different ways* so
  the shape of the next reward is unpredictable. Design for VARIETY of discovery, not for
  one clever mechanic.
- `CARD_GAME_PROMPT.md` (added 2026-07-28) — **WAYMARK**, the owner's unique card game:
  rules-complete, fully self-contained (built to hand to a different conversation).
  Standalone-first; its §10 maps every element onto Waystone and supersedes
  GAME_PROMPT_V2.md §7 when integration happens. Core: Triple Triad's readable capture +
  Queen's Blood's territory-gated placement + "Edicts" (collectible rule-cards — the
  regional-rules idea made ownable) + "Journey Marks" (Tetra Master's per-copy growth,
  made visible/chosen/deterministic). Zero RNG in match resolution (the Tetra autopsy
  law). Research staged in scratchpad/cardgame/ (Triad ruleset, QB ruleset, Tetra autopsy).

## Owner's key preferences (learned over the project)
- Loves: FF7 Rebirth's materia/weapon-upgrade layering; Elden Ring's paintings
  (world-knowledge riddles); card games where you HUNT cards through shops and NPCs
  (Witcher 3 Gwent, Queen's Blood) — but only when the collection converts into deck
  power (Tetra Master's flaw: collection with no payoff).
- Wants every minigame to reward the player "properly" — concrete, progression-relevant
  rewards, not trinkets.
- Prefers wiki-style sources (Fandom, Game8, etc.) for game research.
- Key flagged mechanics (marked want:"Yes" in the data): FF9's Chocobo Hot & Cold,
  Chained Echoes' Reward Board, Legend of Mana's Land Make, DQ7 shard hunting,
  XC3 exploration EXP, Sea of Stars' relics/Mirth, TotK shrines, Johnny's Treasure
  Trove, Gwent, and the FF7R materia/weapon/chocobo-gear systems.

## Architecture of JRPG_Design_Codex.html
Single file: CSS + HTML + vanilla JS. No build step, no dependencies, no server.
- Data lives in four JS const arrays near the top of the <script>:
  `CATS` (category -> color), `BASE_MECHS`, `BASE_GAMES`, `MINIGAMES`, `PILLARS`.
- Mechanic row shape: `{id:"M001", game, name, cat, how, loop, rating, want, notes}`
  - `cat` must be a key of CATS; `want` is "Yes" | "Maybe" | "No" | "".
  - IDs are sequential: mechanics M001-M243, minigames g001-g087. Continue the
    sequences when adding entries; never reuse an ID (user edits are keyed to them).
    NEVER RENUMBER. If a later pass improves an existing game's entry, REPLACE that
    row's content in place and APPEND any extra rows at the end of the array — the
    array need not be grouped by game (the app filters by name, not position).
- Minigame row shape: `{id:"g001", g:game, n:name, p:how-it-plays, r:rewards, l:lesson}`.
- User state (ratings, want decisions, notes, custom entries, saved minigame ideas)
  persists in `localStorage` under key `jrpg_codex_v1`, merged over the base arrays at
  runtime via `store.overrides`. Export/Import backup buttons serialize this to JSON.
  IMPORTANT: base-array edits are safe; renaming/removing IDs breaks user overrides.
- Tabs: Mechanics / Minigames / Games / Design Pillars / How to Use.
- Minigame cards link to YouTube via `ytLink()` (search-query URLs, never hardcoded
  video IDs — they don't rot).

## Conventions for extending
- To add researched games/mechanics: append to the arrays following the existing row
  shapes and tone (how = 2-3 sentences; loop = "do X -> get Y -> feels good because Z";
  notes = adaptation advice for THIS owner's pillar).
- Minigame rows support an optional `rt` field — a concrete reward table:
  `rt:[{at:"<threshold/condition>",get:"<exact item/amount>"},...]` rendered as a table
  inside the card's Rewards box and included in search. `r` stays the one-line summary;
  `rt` holds the actual items and thresholds.
- `scripts/` contains the Python patch scripts that built the file historically —
  reference only; with direct file access, edit the arrays in place instead.
- `scripts/fetch_scores.py` refreshes the Metacritic critic + user scores. It reads a
  roster JSON (`[{title,year,dev},...]` exported from BASE_GAMES) and writes scores.json.
  Design notes worth keeping: it resolves the DIRECT slug first (Metacritic's canonical
  slug is normally the ORIGINAL release; their finder API does fuzzy matching and will
  happily return a remaster — "Final Fantasy X" returns the 2014 HD Remaster, "Legend of
  Mana" returns "Legend of Keepers"). It reads both scores from the page's own
  `critic-score-summary` / `user-score-summary` composer components (clean JSON — do NOT
  scrape the page HTML, whose score fields are flattened-array INDEX POINTERS that a
  naive regex reports as scores like 2769). It treats `score:0` with `sentiment:null` as
  Metacritic's "not enough ratings to publish" sentinel, not a real zero. Run
  `python3 scripts/fetch_scores.py --selftest` to prove the range guards still reject
  out-of-range values before trusting a refresh.
- After any edit, sanity-check by extracting the <script> block and parsing it
  (e.g. `node -e 'new Function(require("fs").readFileSync("JRPG_Design_Codex.html","utf8").match(/<script>([\s\S]*)<\/script>/)[1])'`).

## Research playbook (the system for "research <game>")
The Games tab is a pipeline: cards sort Researching -> To Research -> Researched, each
shows its mechanics/minigames coverage counts, and queued cards carry a `why` written as
a research BRIEF (the question this game should answer). When the owner asks to research
a game (or to work the queue):
1. Set/confirm the game's BASE_GAMES entry, status "Researching" (add the row if new,
   with a BRIEF-style `why`).
2. Research from wiki-style sources (Fandom, Game8, Jegged, Caves of Narshe — the
   owner's preference). NEVER write reward specifics, item names, or thresholds from
   memory — fetch and cross-check at least two sources (use subagents for fan-out).
   Fandom & other MediaWiki wikis 403 their HTML to bots (even with a browser UA),
   but their api.php endpoint is open — so DON'T settle for search snippets. Use the
   helper: `python3 scripts/wiki_fetch.py finalfantasy.fandom.com "Page Title"`
   (add `--plain` for readable prose; default is raw wikitext with reward tables intact).
   It's the sanctioned front-door (the MediaWiki API), not a scraper bypass, and it
   fails closed on missing pages. Non-MediaWiki sites (Jegged, Game8, RPG Site, FFExodus,
   Caves of Narshe) fetch fine directly. Only a site with neither open API nor fetchable
   HTML (e.g. Neoseeker) drops to snippets — corroborate those with a readable source.
   A 402/403 is a bot-block, not a missing page.
3. Append mechanics rows (continue M-sequence) — every row needs the reward loop and
   owner-pillar adaptation notes.
4. Append minigame rows (continue g-sequence) — **rewards must be concrete**: name the
   actual items, amounts, and thresholds in an `rt` table wherever the minigame has
   defined payouts. "Prizes and gil" is not research.
5. Set status "Researched", update the counts in this file's "Current contents"
   section, run the parse sanity-check, and verify in the browser.

### The batch pipeline (use this for anything over ~3 games)
Proven across five batches (PS1, Clair Obscur, PS2, popular-classics, modern-hits):
1. **Stage** each game's verified result as its own JSON in a scratchpad dir FIRST —
   one file per game, written the moment that game's research lands. This survives
   context compaction and agent crashes; a lost staging dir cost a re-do once.
2. **Compile** with a throwaway Node script: assigns sequential IDs from the current
   max, validates every `cat` against CATS, converts `->` to `→`, and emits three
   text blocks (mechanics / games / minigames).
3. **Splice** with a Python script that, per array, asserts the anchor string is
   FOUND, is UNIQUE, and that the gap between it and the closing `];` is whitespace
   only. Anchor on the LAST ROW'S ending text — verify it at execution time, it
   changes every batch. These asserts caught two would-be corruptions; do not skip them.
   Watch for curly apostrophes (’ vs ') when copying anchor text.
4. **Validate**: parse via `new Function(<script>)`, then assert exact counts, ID
   sequentiality + zero dupes, every `cat` in CATS, and zero orphan `game`/`g` refs.
5. **Score + docs**: `fetch_scores.py` for new rows, then update this file's counts.

### Gotcha: research subagents die on account usage limits
Twice this session an entire fan-out (12 agents) was killed mid-flight by an
account-level weekly limit, and later agents returned hours late. **Launch one canary
agent first**; if it errors on limits, fall back immediately to researching directly
(wiki_fetch.py + targeted greps, staging each game before starting the next). The
direct path is slower per game but produced the same verified standard. Also: a late
agent may still deliver — if its data is better than the hand-done version, upgrade
the entry in place (see the ID rule above) rather than discarding the better research.

### Gotcha: AGENTS.md is a MIRROR of this file
`AGENTS.md` duplicates CLAUDE.md for tools that look for that name. It silently went
stale this session (frozen at 224 mechanics while CLAUDE.md said 243). **After editing
CLAUDE.md, copy it over AGENTS.md** — two sources of truth always drift.

## Known backlog / ideas discussed but not built
- Merge the user's localStorage backup (they should drop `jrpg-codex-backup.json`
  into this folder; it contains their ratings/notes/custom entries).
- Work the research queue (seeded in BASE_GAMES as "To Research" with briefs):
  Chrono Trigger, FF6, Super Mario RPG, Terranigma, Yakuza 0. Also: non-FF card games.
- Distill all want:"Yes" mechanics into a design document ("pillars v2") for the
  owner's own JRPG.
- ~~Design the owner's card game using the four-ingredient formula~~ — DONE 2026-07-28:
  see `CARD_GAME_PROMPT.md` (WAYMARK). Remaining follow-up: build the prototype
  (priority order in its §11) and, on integration, rebind §10's slots into Waystone.
- Possible features: pin specific YouTube videos per minigame; a "my game" tab for
  designing their own systems against the pillars.
