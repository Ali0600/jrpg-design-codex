# The Witcher 3 — research digest

Codex: `The Witcher 3` (2015, PS4 scored) · GameFAQs: `/pc/699808-the-witcher-3-wild-hunt`
confirmed 2026-09-06 (the page's own Release line reads May 18, 2015; the PS4 and PC guide
lists are identical) · digest started 2026-09-06

> Facts only, in our own words. Item names and numbers may be quoted; guide prose may not.
> Every fact carries a pointer: `[gf:<id> §<section>, <author> v<ver>]` or `[wiki:<host>/<Page>]`.

## Sources

| id | title | author | version | updated | category | KB | url |
|---|---|---|---|---|---|---|---|
| 71896 | Guide and Walkthrough | sokkus | 0.90 | 01/22/2017 | Full Game Guides | 939 | https://gamefaqs.gamespot.com/pc/699808-the-witcher-3-wild-hunt/faqs/71896 |
| wiki | Place of Power · Griffin School Gear · Viper School Gear · Gwent · Collect 'Em All | — | — | — | witcher.fandom.com | — | https://witcher.fandom.com/wiki/Place_of_Power |
| web | Gwent Guide · Gwent Player and Vendor Locations · How to Get The Best Gwent Cards | Game8 | — | — | game8.co | — | https://game8.co/games/Witcher3/archives/275443 |

Coverage 71896: **a formatted, 19-page guide** — pages 1 and 8 opened of 19. On those two
pages, 4 sections read of 128 (Gathering Experience and Levelling Up 100%, Skill Points and
Skill Trees 100%, Scavenger Hunt: Viper School Gear 100%, Hidden Treasure: Dirty Funds
~90%); greps: Places of Power, diagram, witcher/school gear, treasure hunt, Gwent, contract,
ability point. Unread: 17 of 19 pages entirely, which is the walkthrough proper — quest-by-
quest prose whose systems content is summarised on page 1. The per-category counts below
come from the guide's own contents list, which spans all 19 pages.

Triage (2026-09-06, `__gf.triage()` on 10 guides): this game has **no** in-depth item,
secrets or minigame guide — the list is four overlapping full walkthroughs, one
Achievement/Trophy Speedrun guide, a map, a Game Script and a Portuguese translation. So the
walkthrough was read for its systems sections and its contents list, and the wiki carried the
cross-checks. A thin GameFAQs result for a 2015 open-world game, recorded rather than padded.

## Triage

`__gf.triage()` and `__gf.pick()` on 2026-09-15: 10 guides listed (6 Full Game Guides, 2 In-Depth
Guides, and a Portuguese walkthrough and a map under other headings, none read). The scores below were
computed once with the probe's own `core.triage` over the whole listing. **`pick()` returns nothing,
because all six Full Game Guides are HTML**, so the owner's rule reads no walkthrough for this game.
sokkus's formatted 71896, of which the 2026-09-06 pass opened two of nineteen pages, keeps its `read`
decision. That pass counted four full walkthroughs; the listing now shows six, two of them sokkus's
(73519 and 74361) listed after the map. Its decisions come from its Sources table and summary above.

| id | title | author | category | KB | score | decision | flags |
|---|---|---|---|---|---|---|---|
| 71896 | Guide and Walkthrough | sokkus | Full Game Guides | 939 | 3 | read | Highest Rated · FAQ of the Month Winner: February 2016 · HTML |
| 71914 | Walkthrough | Nocturnia77 | Full Game Guides | 774 | 3 | skipped — HTML, a second full walkthrough | Highest Rated · HTML |
| 73519 | Guide and Walkthrough | sokkus | Full Game Guides | 423 | 3 | skipped — HTML, another of sokkus's walkthroughs | Highest Rated · FAQ of the Month Winner: July 2016 · HTML |
| 74361 | Guide and Walkthrough | sokkus | Full Game Guides | 190 | 3 | skipped — HTML, another of sokkus's walkthroughs | Highest Rated · FAQ of the Month Winner: January 2017 · HTML |
| 73988 | Achievement/Trophy Speedrun Guide | optimusmart | In-Depth Guides | 161 | 3 | skipped — HTML, a trophy speedrun | Highest Rated · HTML |
| 71878 | Guide and Walkthrough | Suikosun | Full Game Guides | 138 | 2 | skipped — HTML, another walkthrough | HTML |
| 74378 | Spoiler-Free Walkthrough | Rockstardreams | Full Game Guides | 34 | 2 | skipped — HTML, another walkthrough | HTML |
| 73353 | Game Script | Shotgunnova | In-Depth Guides | 1535 | -1 | skipped — a script | — |

## Mechanics candidates

### Scavenger Hunts: the found item is what creates the quest
cat: Exploration & Rewards
how: Witcher gear sets are not quest rewards; they are quests you cause. The diagrams lie in the world with nothing pointing at them, and picking up the first one is what registers the Scavenger Hunt in your journal and turns on tracking for the rest of the set. The Viper hunt's two diagrams sit behind an AARD-broken church door guarded by a level 7 Wraith, and in a ruined tower reached by a leaning wall used as a ramp.
loop: explore with no marker → find one diagram → the quest appears and now tracks the rest → craft a set that upgrades five more times
notes: The inversion the owner should steal: discovery CREATES the objective instead of an objective pointing at the discovery. The player who never enters that church never learns the quest existed, so the world keeps its secrets from the incurious — and the moment one piece is found, the game switches to helping, which keeps the remaining pieces from becoming a pixel hunt. Pair it with the tier ladder below so the found thing is a beginning, not a trophy.
verbs: Guarded, Tool-gated, Latent geometry
pointers: [gf:71896 §Scavenger Hunt: Viper School Gear, sokkus v0.90] [wiki:witcher.fandom.com/Viper School Gear]
row: M266
- The quest is unlocked by finding a diagram, not by being given it: the guide says the diagrams are not pointed out and you must explore and find one to unlock the quest and its tracking [gf:71896 §Scavenger Hunt: Viper School Gear, sokkus v0.90]
- The wiki says the same in its own words: collecting the first weapon schematic starts a new Scavenger Hunt secondary quest [wiki:witcher.fandom.com/Viper School Gear]
- Viper diagrams: Diagram: Serpentine Silver Sword inside the White Orchard Cemetery church (AARD the door, kill a level 7 Wraith, loot the bodies with Witcher Sense); Diagram: Serpentine Steel Sword in the ruins on the hill west of the Ransacked Village fast-travel point, approached from the southwest up a leaning brickwork wall [gf:71896 §Scavenger Hunt: Viper School Gear, sokkus v0.90]
- In the base game the Viper set is only the two swords; its full armour arrives with Hearts of Stone and has no quest attached at all [wiki:witcher.fandom.com/Viper School Gear]

### Witcher gear: one found diagram, then five upgrade tiers of the same six pieces
cat: Progression & Upgrades
how: A school's gear is six pieces — armour, boots, gauntlets, trousers, a steel sword and a silver sword — and each exists at Griffin, Enhanced, Superior, Mastercrafted and Grandmaster quality, with a parallel Legendary line of the same five steps in New Game+. Set bonuses pay at three pieces and again at six, so the ladder rewards both climbing and completing.
loop: find a diagram → craft the piece → find the enhanced diagram → craft again → wear three for a bonus, six for a bigger one
notes: This is the owner's pillar stated as a schedule: a single discovery is the entry to a ten-rung ladder rather than a one-off item, and the set bonus means the upgrade path and the collection path are the same path. Worth copying exactly: name the tiers so a player reading "Enhanced" knows a Superior exists, and make the 3-piece bonus reachable early so the ladder advertises itself.
verbs: Shop stock, Mastery reveal
pointers: [wiki:witcher.fandom.com/Griffin School Gear] [gf:71896 §Scavenger Hunt: Viper School Gear, sokkus v0.90]
row: M267
- Griffin School Gear is six upgradeable pieces: chest armour, steel and silver swords, gauntlets, boots and trousers [wiki:witcher.fandom.com/Griffin School Gear]
- Its tiers are Griffin, Enhanced, Superior, Mastercrafted and Grandmaster, each with a Legendary counterpart (Legendary, Enhanced legendary, Superior legendary, Mastercrafted legendary, Grandmaster legendary) — the legendary gear being stronger versions of base-game gear in New Game+ [wiki:witcher.fandom.com/Griffin School Gear]
- Set bonuses: at 3 pieces, a Sign cast within 3 seconds of a standard-mode Sign costs no Stamina; at 6 pieces, Yrden traps are 40% larger and inside one you gain 5/s Stamina regeneration, +100% Sign Intensity and 20% damage reduction [wiki:witcher.fandom.com/Griffin School Gear]

### Hidden Treasure: loot that carries the note that starts the next quest
cat: Exploration & Rewards
how: A treasure icon on the map leads to a guarded camp; Witcher Sense finds a red chest holding a crafting diagram and an alchemy formula. Reading the Scrawled Notes found with it converts the site into a Treasure Hunt quest with a new objective marker somewhere else entirely, which ends at another pair of chests. The guide's contents list 32 of these against 27 Witcher Contracts and 5 Gwent quests.
loop: spot an icon → clear the camp → loot a diagram and a formula → read the note → a second location you would never have visited
notes: The reward is not the chest, it is the note in the chest — treasure that spends itself buying the player a reason to go somewhere new. Cheap to build (two locations and a text item) and it makes the world feel written rather than scattered. Note the payload is always a DIAGRAM or FORMULA, i.e. a thing that feeds the crafting ladder, never a finished sword.
verbs: Latent geometry, Consequence
pointers: [gf:71896 §Hidden Treasure: Dirty Funds, sokkus v0.90] [wiki:witcher.fandom.com/Dirty Funds] [gf:71896 §Table of Contents, sokkus v0.90]
row: M268
- Dirty Funds: at a hidden-treasure icon east of the Mill fast-travel point, in a camp of level 4–5 Wolves and Wargs; Witcher Sense finds a red chest in a tent holding Diagram: Kovari Cutlass and Formula: Hydragenum [gf:71896 §Hidden Treasure: Dirty Funds, sokkus v0.90]
- Reading the Scrawled Notes is what unlocks the Treasure Hunt quest and sets a new objective marker at the largest bandit camp, where a shield-carrying Deserter Leader guards a tent with a further pair of chests [gf:71896 §Hidden Treasure: Dirty Funds, sokkus v0.90]
- The wiki tells the same chain in its own words: loot the hidden treasure east-northeast of the mill, guarded by wolves, find scrawled notes, read them, and they lead to a bandit camp northwest of Cackler Bridge whose tent chests end the quest [wiki:witcher.fandom.com/Dirty Funds]
- The world is checked, not just the flag: if the bandit camp was looted FIRST, the quest ends the instant the hidden treasure is opened, costing only the middle journal entries [wiki:witcher.fandom.com/Dirty Funds]
- Counted from the guide's own contents list, which spans all 19 pages: 32 entries titled "Hidden Treasure:", 27 titled "Contract:" or "Witcher Contract:", 5 titled "Gwent:", 1 titled "Scavenger Hunt:" [gf:71896 §Table of Contents, sokkus v0.90]

### Places of Power: a permanent skill point for the act of finding one
cat: Exploration & Rewards
how: Places of Power are landmarks that grant one Skill Point the first time they are discovered and activated, and only that first time. There is a limited number of them, so they are a finite, exploration-only slice of a build that otherwise comes from levelling. Each is tied to one of the five Signs and boosts that Sign's intensity while drawn from.
loop: wander → find a Place of Power → one permanent Skill Point, once, plus a temporary Sign boost → your build is partly made of places you went
notes: The cleanest possible statement of "exploration pays into progression": the currency is the same Skill Point levelling gives, so the player never has to value an exploration-only currency. The one-time-only rule is what keeps it a discovery rather than a farm — and because the count is limited, a completionist's build genuinely differs from a hurrier's.
verbs: Vista sketch, Mastery reveal
pointers: [gf:71896 §Skill Points and Skill Trees, sokkus v0.90] [wiki:witcher.fandom.com/Place of Power]
row: M269
- A single Skill Point is obtained each time a Place of Power is discovered and used for the first time, on top of the points levelling gives [gf:71896 §Skill Points and Skill Trees, sokkus v0.90]
- The wiki adds that the number of Places of Power is limited, that finding them matters because Skill Points are finite, and that each is tied to one of the five Signs and increases that Sign's intensity when drawn from [wiki:witcher.fandom.com/Place of Power]
- Skill Points feed four trees — Combat, Signs, Alchemy and General Skills — each of which also grants a passive bonus (Adrenaline gain, Stamina regeneration, Potion duration respectively) [gf:71896 §Skill Points and Skill Trees, sokkus v0.90]

### M132 Gwent (shop-hunted deck building)
pointers: [wiki:witcher.fandom.com/Gwent] [wiki:witcher.fandom.com/Collect 'Em All] [web:game8.co/games/Witcher3/archives/275443] [web:game8.co/games/Witcher3/archives/282396]
row: M132
- Added 2026-09-17 by the sources pass (plan section R, batch 2). No GameFAQs guide covers Gwent's cards, so the second source is Game8 [web:game8.co/games/Witcher3/archives/275443] [wiki:witcher.fandom.com/Collect 'Em All]
- Gwent is a card game of rows and rounds: a match is won two rounds out of three, on total unit strength [wiki:witcher.fandom.com/Gwent] [web:game8.co/games/Witcher3/archives/275443]
- Cards come from buying them from merchants, from beating players, and from Gwent quests [wiki:witcher.fandom.com/Collect 'Em All] [web:game8.co/games/Witcher3/archives/275443] [web:game8.co/games/Witcher3/archives/276249]
- Innkeepers are among the sellers; Game8 names Elsa of the White Orchard tavern for the Decoy and an Urialla Harbor innkeeper for Scorch [web:game8.co/games/Witcher3/archives/282396] [wiki:witcher.fandom.com/Collect 'Em All]
- Named opponents in Gwent quests and tournaments give particular cards, while ordinary players give random ones, and beating enough generic merchants stops paying new cards [wiki:witcher.fandom.com/Collect 'Em All] [web:game8.co/games/Witcher3/archives/282396]

## Minigame candidates

None harvested this pass. Gwent is already in the codex as a mechanic (M132) and its
per-opponent card rewards were not read, so no `rt` table can be written honestly yet — see
Unverified below. Nothing else in this game's guide list carries a payout table.

## Exploration & upgrade facts

### Hidden
- Hidden Treasure sites are marked with their own map icon and the chest inside is found with Witcher Sense rather than by looking [gf:71896 §Hidden Treasure: Dirty Funds, sokkus v0.90]
- Scavenger Hunt diagrams are the opposite: nothing marks them until one is in hand [gf:71896 §Scavenger Hunt: Viper School Gear, sokkus v0.90]

### Upgrades
- XP comes from kills, story progress, secondary quests and Witcher Contracts, side-tasks such as Abandoned Settlements, using AXII in conversation, and bribing people in conversation [gf:71896 §Gathering Experience and Levelling Up, sokkus v0.90]
- Levels cost 1,000 XP each from 1 to 10, 1,500 from 11 to 20, and 2,000 from 21 on; the cap is level 70 and is reachable only by importing a completed save into New Game+ [gf:71896 §Gathering Experience and Levelling Up, sokkus v0.90]
- Levelling also gives a small boost to base attributes alongside the Skill Point [gf:71896 §Gathering Experience and Levelling Up, sokkus v0.90]

### Shops & exchange

Nothing read this pass — the guide's shop and merchant material sits in the 17 unread pages.

## Unverified or contradicted
- The guide's contents list exactly one Scavenger Hunt (Viper), while the wiki documents several school sets including Griffin and Manticore with their own hunts — the guide is version 0.90 and its walkthrough is incomplete, so treat 1 as that guide's coverage and not the game's total [gf:71896 §Table of Contents, sokkus v0.90] [wiki:witcher.fandom.com/Griffin School Gear]
- **2026-09-17, Gwent's starting deck and every shop's stock.** M132 called the starting deck deliberately weak and said checking every shop's card stock becomes second nature. Neither the wiki nor Game8 says so, and both are cut from the row [wiki:witcher.fandom.com/Gwent] [web:game8.co/games/Witcher3/archives/275443]
- Gwent's rewards for beating each opponent were not harvested; the 5 "Gwent:" quests in the contents are player-hunt quests, and no card-by-card payout table was read. A minigame row with an `rt` table needs a dedicated pass [gf:71896 §Table of Contents, sokkus v0.90]
- The 32 / 27 / 5 / 1 category counts are ToC entry counts from one guide, not official quest totals [gf:71896 §Table of Contents, sokkus v0.90]

## Codex rows

```js
// Spliced into JRPG_Design_Codex.html on 2026-09-06 by
// scripts/splice_rows.mjs (the rows there are the source of truth; this is the map).
// M266  Scavenger Hunts: the found item is what creates the quest                        Exploration & Rewards
// M267  Witcher gear: one found diagram, then five upgrade tiers of the same six pieces  Progression & Upgrades
// M268  Hidden Treasure: loot that carries the note that starts the next quest           Exploration & Rewards
// M269  Places of Power: a permanent skill point for the act of finding one              Exploration & Rewards
```

## Codex delta
- (ids after the splice)
- 2026-09-15: the Triage record added. `pick()` returns nothing because every Full Game Guide is HTML, so the owner's rule reads no walkthrough here, and no row was edited.
- 2026-09-17: M132 (Gwent, from the original PS1-era batch) sourced from the Witcher Wiki and Game8, since no GameFAQs guide covers its cards; the claims of a deliberately weak starting deck and of checking every shop were cut.
