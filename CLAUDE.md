# JRPG Design Codex

## What this project is
A personal game-design research database for a solo developer designing their own JRPG.
The owner's core design pillar: **"a world that rewards exploration, where everything has upgrades."**

The main artifact is `JRPG_Design_Codex.html` — a single-file, fully-offline web app
(open directly in a browser, no server needed) containing the entire research database.
`JRPG_Design_Research_Database.xlsx` is the earlier spreadsheet version, kept as a legacy
backup; the HTML file is the source of truth and is more up to date.

## Current contents (as of handoff)
- **261 mechanics** (`BASE_MECHS` array, M001-M261) across **66 researched games**: FF7 Rebirth,
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
  Plus the **queue-clearing batch** (M244-M261, g088-g089, added 2026-08-12), which
  emptied the research queue: EarthBound (the rolling HP odometer — damage arrives as a
  RATE so you can out-heal a killing blow; the Sound Stone's eight melodies; the phone
  economy where Dad banks your money and homesickness is cured by calling Mum), Mother 3
  (Sound Battles — combos timed to the ENEMY'S battle theme, 16 hits max, tempo learnable
  by putting the foe to sleep; Battle Memory, a found item that unlocks a risk-free
  practice mode), Kingdom Hearts II (**the standout**: five Drive Forms each levelling on
  a DIFFERENT verb — hits landed, Heartless killed, Drive Orbs collected, Nobodies slain —
  and each paying out a permanent TRAVERSAL ability for base Sora; plus a Moogle shop that
  gains EXP from the items it makes for you, which is the owner's "shops have upgrades too"
  pillar built), Lost Odyssey (Skill Link — immortals learn only by standing next to
  mortals, so party composition IS the skill tree; 33 dreams triggered by places, not plot;
  the Aim Ring, whose miss costs the BONUS not the turn), Baten Kaitos (Magnus that change
  while carried — lava hardens to a hot rock then cools to a pebble; a healing item can rot
  into a damaging one), Live A Live (eight chapters with eight different VERBS over one
  rigid spine — a boss-rush chapter where you learn techniques by BEING HIT by them, a
  stealth chapter completable at 0 or 100 kills, a combat-free chapter that is trap prep
  against a clock).
- **89 minigames** (`MINIGAMES` array, g001-g089): the Final Fantasy series (g001-g054)
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
- **Games roster** (`BASE_GAMES` array) — **72 researched + 0 queued** (72 total). The
  queue is EMPTY as of 2026-08-12; refill it with BRIEF-style `why` entries before the
  next research session (see the Research playbook).
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
- Tabs: Mechanics / Minigames / Games / **My Game** / Design Pillars / How to Use.
- **My Game tab** — the codex's output surface. Every effective `want:"Yes"` mechanic
  (plus `Maybe` behind a toggle) is placed into one of six system buckets defined by
  the `BUCKETS` const (discovery / combat / progress / venues / world / parked), each
  with a free-text design note. Persists as `store.myGame = {assign:{mechId->bucket},
  notes:{bucket->text}}`. **`normalizeStore()` backfills every store slot on load AND
  on import** — backups predate newer keys, and without it a restored v1 backup makes
  the board throw on `store.myGame.assign`. Add new store keys THERE, not just to the
  literal, or import breaks.
- **`VERBS`** — the 15 discovery verbs from GAME_PROMPT_V2 §3, keyed by display name
  (like CATS). Mechanics carry an optional `verbs:[...]`; 32 are tagged, seeded from
  the brief's own verb->mechanic table so the mapping is sourced, not invented. Filter
  chips live in a collapsed `<details>` on the Mechanics tab.
- **`LINEAGES`** — chains of mechanics where each game answers the previous one.
  Rendered under the Design Pillars tab; clicking a node jumps to that mechanic. An
  optional `counter:"<id>"` marks a chain's counter-example (Tetra Master ends the
  collection chain) — it renders RED and moves the green "worth stealing" marker to
  the previous node. Without that flag the styling asserts the opposite of the note.
- **`SHOTS` / `SHOT_TYPES`** — the UI Gallery (its own tab + thumbnail strips on game
  cards + a shared lightbox). Each row: `{game, src, type, cap, from}`; files live in
  `shots/<game-slug>/` NEXT to the HTML (the one exception to single-file — a bare copy
  degrades cleanly, every img removes itself on error). Captions are REQUIRED and must
  describe what the UI shows. The validator enforces SET EQUALITY between SHOTS rows
  and the folder (both directions), and the deploy workflow copies `shots/` into the
  site — if you add an image, the row, file, and (auto) deploy all travel together.
  Add images via `scripts/fetch_ui_shots.py` (`--list` a wiki page, then `--get` a
  File: title) — it detects format by MAGIC BYTES (Fandom's CDN serves WebP under .png
  names), keeps ≤512px sources as PNG (pixel art smears under JPEG), resizes the rest
  to ≤960px JPEG, and appends provenance to `shots/SOURCES.md`. CURATE VISUALLY: view
  every candidate before keeping it — wiki pages are mostly character art, and one
  "battle screenshot" turned out to be a scanned strategy-guide page.
- Minigame videos: base rows never hardcode a video id (they rot). The owner can pin
  a specific URL per minigame, stored in `store.overrides[gID].yt` and validated by
  `cleanYt()` — https + a real YouTube host + an actual video id, so a stray paste
  can't put a `javascript:` URL behind a link they'll click later.
- Minigame cards link to YouTube via `ytLink()` (search-query URLs, never hardcoded
  video IDs — they don't rot).
- **`refs`** — optional provenance on mechanic AND minigame rows:
  `refs:[{u:"https://…",t:"Power-Up/Item FAQ by SIMSteven"}]`, rendered as a Sources
  line. `u` must be https on a host matching `REF_HOSTS` (defined beside `refOk()` in
  the page); the validator READS that regex out of the file, so there is one allowlist
  and the gate cannot drift from the renderer. A URL outside it renders as plain text,
  never an href — imported backups flow through the same renderer.

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
- `scripts/gf_probe.js` is the GameFAQs in-page probe (see the Research playbook, step
  2b, and `docs/research/README.md`); `scripts/digest_lint.mjs` enforces the pointer
  grammar on `docs/research/*.md`. Both are tested offline by
  `node --test scripts/gf_probe.test.mjs` (synthetic fixtures under `scripts/fixtures/gf/`,
  a 100-line DOM stand-in, no jsdom) — that suite runs in CI too.
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
- After any edit, run `node scripts/validate_codex.mjs --selftest` (it supersedes the
  old hand-rolled parse check — see the CI section below).

## Deployment & CI — main is a PRODUCTION TRIGGER
Live at **https://ali0600.github.io/jrpg-design-codex/** (public repo `Ali0600/jrpg-design-codex`).
`.github/workflows/validate.yml` runs on every push and PR; the Pages deploy job is
gated on `needs: validate`, so nothing unvalidated ever ships. Actions are SHA-pinned.

- **A push to `main` deploys the site.** Codex/app/workflow changes therefore go
  branch -> PR -> merge on green. Docs-only edits may still land directly on main.
- `node scripts/validate_codex.mjs` checks: script parses; M/g IDs sequential and
  unique; every `cat` in CATS; `want` and `status` enums; every mechanic `game` has a
  BASE_GAMES row; minigame `g` refs likewise EXCEPT the 8 unrostered FF titles
  allowlisted in the script (the FF minigame survey is broader than the mechanics
  roster — a new orphan outside that list is treated as a typo); score ranges (the
  fetch_scores guard re-asserted at rest); `rt` rows non-empty; queued games have a
  `why` brief; SHOTS rows carry a known game, a type in SHOT_TYPES, a caption and a
  well-formed `src`, with **two-way set equality against the shots/ folder** (a row
  without a file is a broken image; a file without a row is an orphan nobody audits),
  failing closed if the folder cannot be listed; optional `refs` on rows (https, host in
  the page's own `REF_HOSTS`, non-empty label); and **the counts quoted in CLAUDE.md AND
  README.md match the data**, with AGENTS.md byte-identical to CLAUDE.md. The last two
  make the doc drift that bit us before into a build failure — README sat at 243/87 for
  two batches before its check existed — so when counts change, update CLAUDE.md and
  README.md and re-copy AGENTS.md in the SAME commit or CI goes red.
- `--selftest` mutates the data in memory and requires all **25** sabotages to fire.
  Two fixture rules learned the hard way. (1) A sabotage must land INSIDE the data
  region — an early `/us:\d+/` fixture matched `border-radius:4px` in the CSS, changed
  the bytes, threw nothing, and tested nothing; `replaceFirst` now refuses a match
  outside the region. (2) A fixture for a CONDITIONAL rule must ESTABLISH the
  condition, not hope the data still satisfies it: the "queued game needs a brief"
  sabotage first broke because the first `why:"BRIEF:` in the file belongs to an
  already-RESEARCHED game, then broke again when clearing the queue left no queued row
  at all — a routine data change silently disarming the check. It now rewrites a row to
  BOTH `status:"To Research"` and an empty `why` in one mutation.
- Optional `LINEAGES` / `VERBS` / `SHOTS` / `SHOT_TYPES` structures are validated only
  if present, so the validator does not need editing when they land.

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
   Source notes as of 2026-08-12: **strategywiki.org now 403s its api.php too**, so it is
   no longer a usable second source. **wikibound.info** (EarthBound/Mother) was added to
   the allowlist — it blocks HTML but serves api.php openly, the same wrong-door pattern
   as Fandom. Wiki page titles are frequently NOT what you would guess: Lost Odyssey's
   pages are `Skills` / `Immortal` / `Rings`, and Mother 3's combo system lives at
   `Sound Battle` on WikiBound and nowhere on Fandom. Probe a few titles before concluding
   a wiki lacks coverage.
   **2b. GameFAQs** (added 2026-09-05) is the richest source for item lists, secrets and
   minigame payouts — and Cloudflare-challenged to every script (403 "Just a moment…"
   even with a browser UA; no API). Read it in the **Browser pane** with
   `scripts/gf_probe.js` evaluated in the page, following the runbook in
   `docs/research/README.md`: search → confirm platform+year against BASE_GAMES →
   `triage()` → per guide `meta()` → `toc({min:800})` → PILLAR `grep`s → ≤4 `section()`
   reads, ~12 pages per game. Facts land in `docs/research/<slug>.md` AS THEY ARE FOUND,
   every one with a `[gf:<id> §<section>, <author> v<ver>]` pointer; that digest is the
   committed staging file. Never `get_page_text` on gamefaqs (14KB of consent text),
   never curl it or reuse its cookie, never store guide text. Stop on
   `page().kind === "challenge"`.
3. Append mechanics rows (continue M-sequence) — every row needs the reward loop and
   owner-pillar adaptation notes.
4. Append minigame rows (continue g-sequence) — **rewards must be concrete**: name the
   actual items, amounts, and thresholds in an `rt` table wherever the minigame has
   defined payouts. "Prizes and gil" is not research.
5. Set status "Researched", update the counts in this file's "Current contents"
   section, run the parse sanity-check, and verify in the browser.

### The batch pipeline (use this for anything over ~3 games)
Proven across five batches (PS1, Clair Obscur, PS2, popular-classics, modern-hits):
1. **Stage** each game's verified result in `docs/research/<slug>.md` FIRST — the
   committed digest (copy `docs/research/_template.md`), written the moment that game's
   facts land, a pointer on every one. This replaced the scratchpad JSON that a lost
   staging dir once cost a re-do; `node scripts/digest_lint.mjs` keeps it honest.
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
- Possible features: pin specific YouTube videos per minigame; a "my game" tab for
  designing their own systems against the pillars.
