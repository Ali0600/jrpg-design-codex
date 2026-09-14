# CrossCode — research digest

Codex: `CrossCode` (2018, PC) · GameFAQs: `/pc/160090-crosscode` confirmed 2026-09-14 (the row's harvested `gf.u`,
released September 20, 2018) · digest started 2026-09-14

> Facts only, in our own words. Item names and numbers may be quoted; guide prose may not.
> Every fact carries a pointer: `[gf:<id> §<section>, <author> v<ver>]` or `[wiki:<host>/<Page>]`.

## Sources

| id | title | author | version | updated | category | KB | url |
|---|---|---|---|---|---|---|---|
| 82669 | Dungeon Race Guide | LooperXT | 1.0 | 08/03/2026 | In-Depth Guides | 8 | https://gamefaqs.gamespot.com/pc/160090-crosscode/faqs/82669 |
| 79506 | Guide and Walkthrough (grep only) | SpriteRain | 35 | 06/28/2024 | Full Game Guides | 768 | https://gamefaqs.gamespot.com/pc/160090-crosscode/faqs/79506 |

Coverage 82669: single page, 8,271 chars, 187 lines, 18 sections — lines 1–160 read with `lines()`,
everything but the wrap-up and the legal text.

Coverage 79506: a chaptered guide, five chapters opened. The contents page (1,794 chars: greps for the
arena, cups and medals, 16 hits; traders, 2; botanics and chests, 1; and a `lines()` read of the
contents). Arena Mechanics (48,893 chars: a grep for coins, medals and Rush Mode, 32 hits; one for coin
amounts, 1; and a `lines()` read of its opening notes). Trader Book (47,041 chars: one grep for trades,
botanics and credits, 503 hits). Trophies (13,324 chars: one grep, 29 hits). Chapter 12: Questing
(17,815 chars: a botanics grep, 2 hits). Two guessed chapter addresses (all-botanics,
autumns-rise-3-and-gold-chests) returned 404. Unread: the story chapters, the cup strategies (Ancient
Boss Cup, 5,202 chars, the largest), Consumables and the Monster Fibula.

## Triage

`__gf.triage()` on 2026-09-14: 2 guides listed (1 Full Game Guide, 1 In-Depth Guide, none under other
headings). Both were used. The race guide is short and was read whole; SpriteRain's guide is split
into chapters at their own addresses, reached by name from its contents page. On 2026-09-15
`__gf.pick()` returned no guide: the only Full Game Guide, SpriteRain's chaptered one, carries the HTML
flair, so there is no plain-text walkthrough to read under the owner's rule. The flags column copies
the listing on that day.

| id | title | author | category | KB | score | decision | flags |
|---|---|---|---|---|---|---|---|
| 79506 | Guide and Walkthrough | SpriteRain | Full Game Guides | 768 | 3 | grep only | FAQ of the Month Winner: September 2021 · HTML |
| 82669 | Dungeon Race Guide | LooperXT | In-Depth Guides | 8 | 3 | read | — |

## Mechanics candidates

### Traders: gear bought with the world's drops, and every trader and plant counted
cat: Economy & Currency
how: Besides its shops, CrossWorlds has traders, and every trade asks for particular items as well as credits: Rookie Harbor's Chef Sandwich, for one, takes two Veggie Sets, two Fruit Sets and 950 credits. The materials come from botanics, the breakable plants and objects placed around each area that drop trade items. New trades open as the story and quests move on, and the game counts both halves of the hunt, with trophies at 25, 50, 75 and 100 percent of traders found and of environmental objects analysed.
loop: break the plants and objects in each area for their drops → take them with credits to a trader → walk away with food and gear → feels good because clearing an area's scenery is part of paying for your next upgrade
notes: The trade economy turns scenery into currency. Botanics sit in every area, so exploring and breaking things is how the next piece of gear gets paid for, and a trade names its exact materials, which tells the player what to look for and roughly where. The quarter-step counters on traders and plants turn the hunt into a visible collection. For the owner's game, price upgrades in named materials found in specific places and let a log count what has been found; a trade list doubles as a map of where to go. It sits beside Xenoblade's trading (M288), where the same idea is gated by affinity instead of materials.
pointers: [gf:79506 §Trader Book, SpriteRain v35] [gf:79506 §Trophies, SpriteRain v35] [wiki:crosscode.fandom.com/Traders] [wiki:crosscode.fandom.com/Botanics]
row: M292
- A trade requires particular items in addition to credits [wiki:crosscode.fandom.com/Traders] [gf:79506 §Trader Book, SpriteRain v35]
- Rookie Harbor's trades include a Chef Sandwich for 2 Veggie Sets, 2 Fruit Sets and 950 credits, and a Cross Sandwich for 7 Veggie Sets, 7 Fruit Sets, 3 Spice Sets and 5,000 credits [gf:79506 §Trader Book, SpriteRain v35]
- Botanics are destructible objects that can drop items often used in trade [wiki:crosscode.fandom.com/Botanics]; the walkthrough lists each area's botanics with their drops [gf:79506 §Chapter 12: Questing, SpriteRain v35]
- Some traders and trades open only after story points or quests, and a trader counts as found only once its menu has been opened, again after new trades appear [wiki:crosscode.fandom.com/Traders]; the walkthrough advises checking every trader after every quest for the trophies [gf:79506 §Trader Book, SpriteRain v35]
- Trophies come at 25, 50, 75 and 100 percent of traders found and of environmental objects analysed [gf:79506 §Trophies, SpriteRain v35] [wiki:crosscode.fandom.com/Traders]

## Minigame candidates

### Dungeon races against Emilie: a hidden time limit per temple
p: Emilie challenges Lea to race through each temple dungeon. The result depends on Lea's time against a limit the game never shows, set per dungeon: the first race, through the tutorial dungeon, cannot be won, and in two temples only the second half counts.
r: Only a trophy. Beating Emilie in all five winnable main races earns At the Speed of Sound, with limits of 90 minutes for the Temple Mine, 50 for Faj'ro Temple's second half, 60 each for So'najiz and Zir'vitar, and 30 for Grand Krys'kajo's second half.
l: A race inside a game about exploring pulls against it: to win, the player has to skip the loot, and the race guide's advice is to save first and come back for the chests afterwards. A limit the player cannot see also means nobody knows they are racing well until the exit. If the owner adds timed challenges to an exploration game, show the clock, and give the win a reward besides a trophy so the tension pays off.
pointers: [gf:82669 §Dungeons and Their Time Limits, LooperXT v1.0] [gf:79506 §Trophies, SpriteRain v35] [wiki:crosscode.fandom.com/Trophies]
row: g100

| at | get | src |
|---|---|---|
| Temple Mine, under 90 minutes | a win over Emilie | [gf:82669 §Dungeons and Their Time Limits, LooperXT v1.0] [gf:79506 §Trophies, SpriteRain v35] |
| Faj'ro Temple, under 50 minutes from the halfway balcony | a win over Emilie | [gf:82669 §Dungeons and Their Time Limits, LooperXT v1.0] [gf:79506 §Trophies, SpriteRain v35] |
| So'najiz Temple, under 60 minutes | a win over Emilie | [gf:82669 §Dungeons and Their Time Limits, LooperXT v1.0] [gf:79506 §Trophies, SpriteRain v35] |
| Zir'vitar Temple, under 60 minutes | a win over Emilie | [gf:82669 §Dungeons and Their Time Limits, LooperXT v1.0] [gf:79506 §Trophies, SpriteRain v35] |
| Grand Krys'kajo, under 30 minutes from the halfway point | a win over Emilie | [gf:82669 §Dungeons and Their Time Limits, LooperXT v1.0] [gf:79506 §Trophies, SpriteRain v35] |
| All five of those races won | At the Speed of Sound trophy | [gf:82669 §Dungeons and Their Time Limits, LooperXT v1.0] [gf:79506 §Trophies, SpriteRain v35] [wiki:crosscode.fandom.com/Trophies] |

- The tutorial race through the Rhombus Dungeon is a scripted loss, and the DLC's Ku'lero Temple race does not count toward the trophy [gf:82669 §Dungeons and Their Time Limits, LooperXT v1.0] [wiki:crosscode.fandom.com/Trophies]
- The timer runs whenever Lea can act, and pauses in menus, cutscenes and conversations and while she is outside the dungeon [gf:82669 §About Race Timers, LooperXT v1.0]
- The race ends only when Lea walks out of the temple exit, not when the boss falls [gf:82669 §About Race Timers, LooperXT v1.0]
- Race results do not change the story but change how Lea's friends react after each dungeon [gf:82669 §Introduction, LooperXT v1.0]
- The Ku'lero Temple race, 120 minutes, can be declined in advance, in which case Lea always finishes ahead [gf:82669 §Dungeons and Their Time Limits, LooperXT v1.0]

## Exploration & upgrade facts

### Hidden
- The quest Crocus Pocus, from Talatu Lips at Autumn's Rise, opens the botanics menu; collecting enough drops from a botanic fills in its locations and drop rates [wiki:crosscode.fandom.com/Crocus Pocus] [wiki:crosscode.fandom.com/Botanics]
- Crocus Pocus pays a hat at each quarter of the botanics entries: the Strawhat at 25%, the Dried Grass Hat at 50%, the Strawberry Hat at 75% and The Last Strawhat at 100% [wiki:crosscode.fandom.com/Crocus Pocus]
- Five hidden sprouts, one in each town, drop the Stones of Origin for the quest The Book of an Old Man [wiki:crosscode.fandom.com/Botanics]
- Chests come in Bronze, Silver and Gold tiers, and trophies are given for obtaining the Thief's Key, the White Key and the Radiant Key [gf:79506 §Trophies, SpriteRain v35]

### Upgrades
- The arena's cups replay earlier fights as scored rounds, taken one at a time or back to back in Rush Mode [wiki:crosscode.fandom.com/Arena] [gf:79506 §Arena Mechanics, SpriteRain v35]
- Arena Coins buy equipment and cosmetics at a coin shop that sells one of each item, and enough coins can be earned to buy everything [wiki:crosscode.fandom.com/Arena] [gf:79506 §Arena Mechanics, SpriteRain v35]
- Taking no damage in a round adds a 5,000-point bonus, and finishing enemies with level 2 and level 3 Combat Arts scores 750 and 1,000 points [gf:79506 §Arena Mechanics, SpriteRain v35]

### Shops & exchange
- Only the seven cups outside the DLC count toward full arena completion [gf:79506 §Arena Mechanics, SpriteRain v35]
- A trophy asks for 4 Cross Sandwiches, 8 Mega-Sandwiches, 16 Chef Sandwiches, 32 Hi-Sandwiches and 64 Sandwiches [gf:79506 §Trophies, SpriteRain v35]

## Unverified or contradicted
- **Arena coin payouts (the brief's question, THIN).** The wiki gives a Bronze medal 20% of a round's coins, Silver 50% and Gold 100%, the Rush Mode medal half of all the round coins, and the Rookie Cup 13,500 coins over nine rounds (200, 300 and 500 per medal step; 900, 1,350 and 2,250 for Rush). The walkthrough's cup chapters give strategies but no coin figures, so these rest on one source [wiki:crosscode.fandom.com/Arena] [wiki:crosscode.fandom.com/Rookie Cup]
- **Platinum.** The wiki says Platinum medals and trophies have no in-game effect, and True Platinum needs a Platinum trophy and a Platinum Rush medal. The walkthrough's condition is Platinum on Rush Mode and beating the combined Platinum scores of every round [wiki:crosscode.fandom.com/Arena] [gf:79506 §Arena Mechanics, SpriteRain v35]
- **How much gold buys the coin shop.** The walkthrough says the four DLC cups need only Gold on every round and Rush to earn enough coins for the whole shop; the wiki says only that enough coins exist to buy it all [gf:79506 §Arena Mechanics, SpriteRain v35] [wiki:crosscode.fandom.com/Arena]
- **Chest-count rewards (the brief's question, THIN).** The sources found only trophies for chest shares and keys, no item rewards for counts of chests opened [gf:79506 §Trophies, SpriteRain v35] [wiki:crosscode.fandom.com/Trophies]

## Codex rows

```js
// Spliced into JRPG_Design_Codex.html on 2026-09-14 by
// scripts/splice_rows.mjs (the rows there are the source of truth; this is the map).
// M292  Traders: gear bought with the world's drops, and every trader and plant counted  Economy & Currency
// g100  Dungeon races against Emilie: a hidden time limit per temple                     rt: 6 rows
```

## Codex delta
- (ids after the splice)
- 2026-09-15: no plain-text Full Game Guide exists to read under the owner's rule (the only one is HTML), so nothing changed beyond the Triage flags.
