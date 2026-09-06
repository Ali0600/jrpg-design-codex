# JRPG Design Codex

## What this project is
A personal game-design research database for a solo developer designing their own JRPG.
The owner's core design pillar: **"a world that rewards exploration, where everything has upgrades."**

The main artifact is `JRPG_Design_Codex.html` — a single-file, fully-offline web app
(open directly in a browser, no server needed) containing the entire research database.
`JRPG_Design_Research_Database.xlsx` is the earlier spreadsheet version, kept as a legacy
backup; the HTML file is the source of truth and is more up to date.

## Current contents (as of handoff)
- **281 mechanics** (`BASE_MECHS` array, M001-M281) across **72 researched games**: FF7 Rebirth,
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
  Plus the **GameFAQs pilot** (M262-M265, g090-g092, added 2026-09-05): Threads of Fate
  re-researched through the new flow (`docs/research/README.md`) from two GameFAQs guides
  by different authors plus the wiki — a three-use monster-coin economy, a legendary set
  that is really an NPC's cookware converting monster coins into stats, a hidden wine that
  cuts the upgrade shop's prices sixfold, Mint's spell effects hidden five different ways
  (against Rue's forms all in the open), and three minigames with reward tables. The
  first rows to carry `refs`; the digest is `docs/research/threads-of-fate.md`.
  Plus the **GameFAQs rollout** (owner-approved 2026-09-06: the 15 roster games with ≤2
  mechanics rows and no minigame rows, in five waves of three). **The Witcher 3**
  (M266-M269) — the game has no in-depth GameFAQs guide at all, so its systems came from
  one 19-page formatted walkthrough plus the Witcher wiki: Scavenger Hunts where finding a
  diagram is what CREATES the quest, witcher gear as six pieces × five tiers with 3- and
  6-piece set bonuses, Hidden Treasure whose real payload is the note that starts the next
  quest, and Places of Power paying one permanent Skill Point on first activation.
  **Golden Sun** (M270-M272, g093-g094) — the Artifact List, where selling or dropping rare
  gear files it permanently in every artifact shop's menu; Game Tickets (given free for
  expensive purchases) and Lucky Medals (found in jars, dropped by Mimics) as two tokens
  with two venues holding gear sold nowhere else; Unleashes and breakable artifact powers.
  Both venues came with real reward tables (g093 Lucky Wheels, g094 the Tolbi Spring).
  **Paper Mario: TTYD** (M273-M275, g095) — 100 hidden Star Pieces whose only sink is
  trading for badges; Charlieton, a shop that rerolls its stock every time you leave and
  the only route to a complete badge set; and the Glitz Pit's per-fight battle CONDITIONS,
  where winning without obeying pays a flat consolation fee and no rank (g095's table).
  **Wave 2** — **Xenogears** (M276-M278, g096): Deathblows as a combo alphabet that trains
  itself (seven moves per character, hidden per-move experience, and a percentage bar that
  weights components equally though their costs differ tenfold); Gears whose stats are
  bought PARTS multiplying the pilot's own numbers, with fuel spent by Booster and bought
  back by a guarding Charge; Hyper Mode, whose odds are literally the fraction of health
  missing; and the Kislev Battling arena, a real-time fight paying a fixed purse plus a
  bonus for speed and damage avoided. **Parasite Eve** (M279-M280, M115/M116 sharpened):
  Bonus Points discounted by how much each fight hurt, with battle COUNT deliberately
  irrelevant so grinding pays nothing; and Wayne's two uncounted collections — 300 junk for
  an Ultimate Weapon, and rare cards counted by USE for a toolkit that turns the tuning
  system's scarcest consumable infinite. The two guides disagree on the toolkit threshold
  and one explains the other's error; the digest keeps both. **Suikoden V** (M281, M187
  sharpened): a trade economy whose CATALOGUE widens with use — sell enough staples and the
  shops start stocking their refined forms (soybeans→miso, wheat→beer, fruit→wine,
  rice→sake), which is the shop-upgrades pillar as an economy. Its two guides disagree on
  whether prices move meaningfully at all, and both readings are kept. The brief's
  castle-facility question came back THIN and is recorded as such.
- **96 minigames** (`MINIGAMES` array, g001-g096): the Final Fantasy series (g001-g054)
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
  - IDs are sequential: mechanics M001-M265, minigames g001-g092. Continue the
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
- **`CHANGES`** — the changelog, and the ONLY record of what is new: the app is a single
  offline file with no build step, so it cannot ask git, and a per-row `added` date could
  not express "this row was rewritten" without hand-stamping every edit. Newest first,
  dates strictly decreasing, `added` naming every id in the file (the validator fails the
  build otherwise, so a row cannot reach the arrays unmarked). `expandIds()` lives beside
  it in the data region and turns `"M266-M275"` into ids — the validator calls the PAGE's
  copy, so the ranges the UI renders are the ranges it checks.
  **Edited an existing row in place? Add its id to the newest entry's `updated` list** —
  `scripts/check_changes.mjs` fails CI otherwise. The splicer logs `added` for you.
  Everything else derives from this one list: `changeInfo(id)` maps each id to the NEWEST
  entry naming it, `store.seen` (an ISO date, backfilled by `normalizeStore`) is the
  owner's read marker, and from those come the NEW/UPDATED pills, the "What's new" strip,
  the newest-first sort, the "new or updated only" filters and the Games-tab tally.
  Before anything is marked seen the baseline is `CHANGES[1].date`, so a first visit
  highlights the latest batch instead of pilling all 370 rows.
- **`gotoCard(id)`** is the single jump implementation — clears that tab's filters, opens
  the card, switches tab, scrolls it to centre and outlines it. The changelog chips AND
  the lineage chain both call it; two jump paths drifted apart the moment a filter was
  added. It scrolls with `behavior:"instant"` deliberately: the sheet sets
  `scroll-behavior:smooth`, and a 35,000px animated scroll reads as a broken page.
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
  grammar on `docs/research/*.md`. `__gf.visited()` reports what a session actually READ
  of a guide — the probe indexes every line, but only what returns through a tool result
  reaches the agent, so each digest carries a Coverage line naming the biggest sections
  nobody opened. `__gf.game()` reads a game's HOME page (`page().kind === "game"`): the
  Game Detail labels as printed, the user rating / difficulty / length averages with vote
  counts, and the "Games You May Like" titles with site-relative paths — never the
  Description pod or the related-game blurbs, which are marketing prose.
- `scripts/gf_bootstrap.mjs` prints the ~500-character line that arms the probe in a page:
  it FETCHES `gf_probe.js` from the public repo (a GameFAQs page is allowed to fetch
  raw.githubusercontent.com — measured 2026-09-06), caches it in the origin's localStorage
  as the offline fallback, clears `window.__gf` and evaluates it. Re-arm on every page; a
  navigation wipes the probe, and re-pasting 22KB a dozen times per game was the flow's
  largest cost. `--ref <branch>` arms from a branch while iterating on the probe (always
  spelled `refs/heads/<name>` — a slashed branch 404s the short raw URL); `--paste` prints
  the probe inline for a page that blocks the fetch. Two traps it now handles: the cache is
  never preferred over the network (a stale cached probe makes a fix look like a no-op),
  and a short body such as a 404 page is refused rather than evaluated.
- **A formatted guide is paginated.** `div.ffaq` guides (the norm for post-2010 games) split
  across `?page=N`, zero-based; `meta().pages` and `visited().pages` say how many, and every
  other number describes the page you are on. Before the Witcher 3 pass the probe could not
  read these guides at all — it reported `kind:"unknown"` — so a 19-page guide would have
  been silently read as nothing.
- `scripts/check_changes.mjs` is the differential gate: it evaluates the codex at the PR's
  base revision and in the working copy, compares each M/g row as a PARSED object with
  sorted keys, and requires every row whose content changed to appear in an `updated` list
  the base did not already have. Parse, never text-diff — appending a row rewrites the
  previous last row by one comma, so a textual diff would demand an `updated` entry for
  M243, M261, M265 … on every splice and the gate would be trained away in two PRs.
- `scripts/splice_rows.mjs` writes a digest's `## Codex rows` block into the arrays:
  placeholder ids (`M+1` = the first `###` under `## Mechanics candidates`) bind each row
  to its candidate, ids are assigned from the current max, every `cat`/`game`/`want`/`rt`/
  `refs` host is checked against the page's own vocabularies, and the assigned ids are
  written back into the digest's `row:` lines. Dry run by default; `--write` applies.
  It appends only — sharpening an EXISTING row stays a hand edit, because ids are the join
  key for the owner's saved ratings. It imports `extractScript` / `extractData` /
  `readRefHosts` from `validate_codex.mjs` rather than re-deriving them (that file's
  `main()` is guarded so importing it does not run a validation). It also LOGS the splice
  in `CHANGES` — a new entry dated today, or merged into today's entry if one exists
  (two entries sharing a date would break the strictly-decreasing order) — and refuses
  outright if `const CHANGES = [` is missing. **After a same-day merge, re-read that entry's
  `title` and `note`**: the merge keeps the FIRST title, so a second game spliced the same
  day lands under a heading that no longer describes it (wave 2's rows merged into an entry
  titled "GameFAQs rollout, wave 1"). Retitle it by hand.
- All of them are tested offline by
  `node --test scripts/gf_probe.test.mjs scripts/splice_rows.test.mjs scripts/check_changes.test.mjs` (synthetic fixtures
  under `scripts/fixtures/gf/`, a 100-line DOM stand-in, no jsdom) — that suite runs in CI
  too. Both suites have been mutation-swept: every check was deleted in turn and had to
  take a test down with it.
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
- To eyeball a render, use the live site: `file://` in the Browser pane loads as a static
  `data:` snapshot where `scrollIntoView` does nothing, so screenshots show the hero
  whatever you scroll. Reach a card with `find` + `scroll_to`, and take the DOM (anchors,
  hrefs, computed visibility) as the proof, not the picture.

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
  the page's own `REF_HOSTS`, non-empty label); **the changelog** (ISO dates strictly
  decreasing, every range parseable by the page's own `expandIds`, no id added twice, and
  the union of every `added` list EQUAL to the full M/g id set — membership, so both a
  missing row and a phantom one are caught); and **the counts quoted in CLAUDE.md AND
  README.md match the data**, with AGENTS.md byte-identical to CLAUDE.md. The last two
  make the doc drift that bit us before into a build failure — README sat at 243/87 for
  two batches before its check existed — so when counts change, update CLAUDE.md and
  README.md and re-copy AGENTS.md in the SAME commit or CI goes red.
- `--selftest` mutates the data in memory and requires all **29** sabotages to fire.
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
   Source notes as of 2026-09-06 (wave 2): **a game's own Fandom wiki is often LORE-only** —
   `xenogears.fandom.com` has no Gear, Deathblow, Fuel or Hyper Mode page at all, the
   Xeno-series wiki's Gear page is origin-and-history with no stats, and
   `suikoden.fandom.com`'s Trading page covers I, II and Tierkreis but has no Suikoden V
   section. When the wiki cannot carry a MECHANICAL cross-check, take the second source from
   a second GameFAQs AUTHOR instead; a strong In-Depth list usually supplies one, and
   Xenogears had two independent Deathblow guides. Also: the GameFAQs search page
   occasionally renders its EMPTY form and ignores `?game=`, returning zero rows — re-navigate
   the same URL once before concluding the game is not there.
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
2–3. **Compile + splice** with `node scripts/splice_rows.mjs docs/research/<slug>.md`
   (dry run) then `--write`. It does what the old throwaway scripts did — sequential ids
   from the current max, `cat` checked against CATS, `->` converted to `→`, anchors
   asserted found-and-unique, both array endings (`}` and `},`) handled — and refuses
   rather than guessing. The hand-rolled version is gone; do not write another.
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
