# Bravely Default — research digest

Codex: `Bravely Default` (2012, 3DS) · GameFAQs: `/3ds/643004-bravely-default-flying-fairy` confirmed 2026-09-14 (the
row's harvested `gf.u`, the original Flying Fairy release of October 11, 2012) · digest started 2026-09-14

> Facts only, in our own words. Item names and numbers may be quoted; guide prose may not.
> Every fact carries a pointer: `[gf:<id> §<section>, <author> v<ver>]` or `[wiki:<host>/<Page>]`.

## Sources

| id | title | author | version | updated | category | KB | url |
|---|---|---|---|---|---|---|---|
| 68747 | Norende Village Restoration Lists | silktail | — | — | In-Depth Guides | 17 | https://gamefaqs.gamespot.com/3ds/643004-bravely-default-flying-fairy/faqs/68747 |
| 68625 | Guide and Walkthrough (grep only) | vinheim | — | — | Full Game Guides | 1062 | https://gamefaqs.gamespot.com/3ds/643004-bravely-default-flying-fairy/faqs/68625 |
| 68918 | Guide and Walkthrough (grep only) | KeyBlade999 | 1.90 | 09/18/2015 | Full Game Guides | 680 | https://gamefaqs.gamespot.com/3ds/643004-bravely-default-flying-fairy/faqs/68918 |

Coverage 68747: single page, 12,965 chars, 250 lines, 26 sections — every line from Getting Started to
the end (lines 27–250) read with `lines()`, which covers the rules, the reclaim tree and all eleven
shop tables; no greps. Unread: the table of contents only.

Coverage 68625: single page, 986,145 chars, 14,824 lines, 56 sections — no whole section read; six
greps (special moves and parts, 36 hits; the eggs, a weapon, a crag and villagers, 20; combat
bonuses, 3; Norende, 35; activation and song, 2; the Norende chapter's shops, 13) and `lines()` reads
of the Chain Special Moves tutorial (0540) and the Norende chapter (0701) from its rules to the
Compound Shop. Unread: the rest of that chapter (the River, Cape and Valley parts shops) and the
largest sections (186,724, 132,942 and 70,027 chars).

Coverage 68918: page 1 of 18, 47,598 chars, 41 sections — one grep (parts shops, the eggs, a weapon
and the villager rule), 0 hits. Pages 2–18 not opened.

## Triage

`__gf.triage()` on 2026-09-14: 13 guides listed (5 Full Game Guides, 3 In-Depth Guides, 5 under other
headings: four Maps and Charts and one Demo Guide, none read). The lead question was Norende's
level-by-level stock, so the Norende list was read first and two walkthroughs were grepped for a
second and third reading of it. KeyBlade999's walkthrough turned out to be 18 pages, and its first
page had no Norende text, so vinheim's Norende chapter was used instead. Zoel's opened on a short
introduction page whose chapters continue elsewhere, so it was not searched further.

| id | title | author | category | KB | score | decision |
|---|---|---|---|---|---|---|
| 68686 | Salve-Maker Compounding List | silktail | In-Depth Guides | 21 | 5 | skipped — item compounding recipes, outside this pass's questions |
| 80129 | Event Viewer/Notes Guide | Xerox1919 | In-Depth Guides | 67 | 4 | skipped — a list of story events |
| 68625 | Guide and Walkthrough | vinheim | Full Game Guides | 1062 | 3 | grep only |
| 68918 | Guide and Walkthrough | KeyBlade999 | Full Game Guides | 680 | 3 | grep only |
| 68747 | Norende Village Restoration Lists | silktail | In-Depth Guides | 17 | 3 | read |
| 68431 | Guide and Walkthrough | Sailor_Nemesis | Full Game Guides | 1152 | 2 | skipped — a third 1 MB walkthrough, after vinheim's Norende chapter answered |
| 68353 | Guide and Walkthrough | Zoel | Full Game Guides | 417 | 2 | skipped — a chaptered guide whose first page is only an introduction |
| 68738 | Walkthrough | vhayste | Full Game Guides | 145 | 2 | skipped — a shorter walkthrough, not needed after two readings |

## Mechanics candidates

### Special moves grown in the village: one shop unlocks them, four more make their parts
cat: Progression & Upgrades
how: Special moves are weapon-based finishers, each ready once its condition has been met with its weapon type. Norende's Special Move Shop unlocks them over ten levels, 26 moves across nine weapon types with the last three levels taking 99 hours each, and four parts shops make the modifiers slotted into every move: its element, a bonus against a monster family, a power boost from 10% to 50%, a status effect, and for some moves healing or extra turns. A move's effects last as long as its music plays, and firing another special before the music ends carries the first move's effects into the second, so specials chain.
loop: rebuild Norende's special move and parts shops → new finishers and modifiers arrive in the Special menu → meet a move's weapon condition and fire it, then chain a second before the music stops → feels good because the town you rebuilt is fighting beside you
notes: The idea to steal is a combat verb whose power grows somewhere else: every finisher and every modifier comes out of the town-building menu, so hours spent rebuilding show up as a new move in the next boss fight, and the 99-hour levels keep the town worth tending late. The modifier slots make each finisher a small build decision (which element, which monster family, raw power or extra turns), and the rename and battle-shout options make it personal. For a timing-combat game, adapt the chain: a follow-up that must land before an audible, visible timer runs out is a readable skill test that rewards sequencing the party rather than repeating the strongest move. It is fed by the Norende rebuild (M224), whose shops supply every part.
pointers: [gf:68747 §Special Move Shop, silktail] [gf:68625 §Chain Special Moves (0540), vinheim] [wiki:bravelydefault.fandom.com/Special (Bravely Default)]
row: M290
- Every special move has a condition to meet with a specific weapon type, and further moves come from upgrading Norende's Special Move Shop [wiki:bravelydefault.fandom.com/Special (Bravely Default)]; the Special menu lists each move's activation condition [gf:68747 §Special Moves, silktail]
- The parts shops' modifiers change a move's damage type, the monster family it is strong against, its power boost and the ailment it inflicts; staff and rod moves also take healing and extra-turn modifiers [wiki:bravelydefault.fandom.com/Special (Bravely Default)] [gf:68747 §Cape Parts Shop, silktail] [gf:68747 §Valley Parts Shop, silktail]
- Using a special move while another is active carries the first move's effects through the second, for as long as the music plays [gf:68625 §Chain Special Moves (0540), vinheim] [wiki:bravelydefault.fandom.com/Special (Bravely Default)]
- A move's name and what its character shouts can be changed [wiki:bravelydefault.fandom.com/Special (Bravely Default)] [gf:68625 §Rename Your Special Moves (0533), vinheim]

## Minigame candidates

None. Norende is a menu-driven rebuild rather than a minigame with payouts, and its stock tables are
recorded below; the listing has no minigame guide.

## Exploration & upgrade facts

### Hidden
- Nemesis monsters arrive in the village from other players by StreetPass and from data updates; they do not block building and can be fought or passed on [gf:68747 §Nemesis in your village, silktail] [wiki:bravelydefault.fandom.com/Norende Village]
- Up to seven Nemeses can wait in Norende at once, after which the oldest unprotected one is removed [wiki:bravelydefault.fandom.com/Norende Village]

### Upgrades
- Six blocked areas open the village: Tangled Woods (2 hours) opens the Special Move Shop, Blackwater Fen and the Downstream Area; the Ancient Boulder (10 hours) opens the Weapons Shop, the Hill Parts Shop, the Collapsed Bridge and the Rigid Crag; Blackwater Fen (30 hours) opens the Accessory and River Parts shops; the Collapsed Bridge (50 hours) the Combat Item and Cape Parts shops; the Downstream Area (70 hours) the Compound Shop; and the Rigid Crag (99 hours) the Valley Parts Shop. The Trader and the Armor Shop are open from the start [gf:68747 §Reclaiming Areas, silktail] [wiki:bravelydefault.fandom.com/Norende Village] [gf:68625 §Norende (0701), vinheim]
- Every shop has eleven levels, and the eleventh takes 99 hours [gf:68747 §Trader, silktail] [wiki:bravelydefault.fandom.com/Norende Village] [gf:68625 §Norende (0701), vinheim]
- Special Move Shop: level 1 (2 hours) Infinity and Rejuvenation; 2 (3 hours) Piercing Bolt, Horizon, Maximum Draw; 3 (3 hours) Moonbeam, Grand Strike, Moonshadow; 4 (48 hours) Air Splitter, Blade Storm; 5 (48 hours) Overpower, Withering Ripple; 6 (48 hours) Lux, Rapid Fire; 7 (72 hours) Breaking Wave, Maelstrom, Ascendant Palm; 8 (99 hours) Holy Weapon, Divine Light, Cross Divide; 9 (99 hours) Megiddo Flame, Angelic Pillar, Thunderburst; 10 (99 hours) Sonic Wave, Gigaton Swing, Petal Swirl; 11 (99 hours) the Falcon Knife [gf:68747 §Special Move Shop, silktail] [gf:68625 §Norende (0701), vinheim] [wiki:bravelydefault.fandom.com/Norende Village]
- The shop's 26 moves cover daggers, staves, rods, spears, bows, knuckles, axes and katanas three times each and swords twice [gf:68747 §Special Move Shop, silktail] [gf:68625 §Norende (0701), vinheim]
- Hill Parts Shop: the six elements with matching resistance up and down parts, plus Speed Up and Down, Evade Up and Accuracy Down; elemental parts add to the move's attack element [gf:68747 §Hill Parts Shop, silktail] [wiki:bravelydefault.fandom.com/Norende Village]
- River Parts Shop: slaying parts for beasts, plants, aquatic monsters, insects, fliers, undead, demons and dragons, with cures and resistance-ups for each ailment and a critical-rate part [gf:68747 §River Parts Shop, silktail] [wiki:bravelydefault.fandom.com/Norende Village]
- Cape Parts Shop: HP and MP recovery from Lv.1 to Lv.5, a status touch for each ailment and matching resistance-downs [gf:68747 §Cape Parts Shop, silktail] [wiki:bravelydefault.fandom.com/Norende Village]
- Valley Parts Shop: power boosts of 10%, 20%, 30%, 40% and 50%, +1 to +5 turns, attack and defence up and down parts, and BP Bonus Lv.1 and Lv.2 [gf:68747 §Valley Parts Shop, silktail] [wiki:bravelydefault.fandom.com/Norende Village]
- Weapons Shop: Carving Knife, Simian Staff, Ogre's Club, Bastet Claws, Sage's Staff, Angel's Bow, Lü Bu's Spear, Grinder Axe, Mutsu-no-Kami and Night Emperor at levels 1–10 (1 h 30 min to 60 hours), then the Magic Knife [gf:68747 §Weapons Shop, silktail] [wiki:bravelydefault.fandom.com/Norende Village] [gf:68625 §Norende (0701), vinheim]
- Armor Shop: Bronze Armor, Brigandine, Red Cap, Rainbow Dress, Lambent Hat, Blessed Shield, Bloody Shield, Heike Gloves, Heike Helm and Heike Armor at levels 1–10 (30 minutes to 48 hours), then the Onion Shirt [gf:68747 §Armor Shop, silktail] [wiki:bravelydefault.fandom.com/Norende Village] [gf:68625 §Norende (0701), vinheim]
- Accessory Shop: Venture Badge, Smiley Badge, Gale Hairpin, Normalizer, Red Muleta, Reflect Ring, Alarm Earrings, Taunt Bangle, then the Golden Egg at level 9 (68 hours) and the Growth Egg at level 10 (80 hours), then Melodist's Shirt [gf:68747 §Accessory Shop, silktail] [wiki:bravelydefault.fandom.com/Norende Village] [gf:68625 §Norende (0701), vinheim]
- The Golden Egg doubles the money a battle pays and gives no experience or job points; the Growth Egg doubles experience and job points and gives no money [gf:68747 §Accessory Shop, silktail] [wiki:bravelydefault.fandom.com/Bravely Default accessories] [gf:68625 §Norende (0701), vinheim]
- Each shop's eleventh level is bonus equipment: outfits (Knight's Tunic, Onion Shirt, Melodist's Shirt, Edea's Garb, Plain Tunic) and weapons (Falcon Knife, Magic Knife, Labrys, Silver Glaive, Fox Tail, Donnerschlag) [gf:68747 §Notes for the bonus equipment, silktail] [wiki:bravelydefault.fandom.com/Norende Village]

### Shops & exchange
- Norende's stock is bought from the Adventurer, the merchant at save points [gf:68747 §Getting Started, silktail] [wiki:bravelydefault.fandom.com/Norende Village] [gf:68625 §Norende (0701), vinheim]
- A job's time is divided by the villagers working on it: the Armor Shop's first level takes 30 minutes with one villager and 15 with two [gf:68625 §Norende (0701), vinheim] [gf:68747 §Getting Started, silktail]
- Villagers come from StreetPass and from a once-a-day data update that brings invited net friends [gf:68747 §Villagers, silktail] [wiki:bravelydefault.fandom.com/Norende Village]
- The Trader, the Combat Item Shop and the Compound Shop send presents from their stock from time to time [gf:68747 §Presents, silktail] [wiki:bravelydefault.fandom.com/Norende Village]
- Trader: Potion and Teleport Stone at level 1 (15 minutes) up to Turbo Ether at level 10 (36 hours), then the Knight's Tunic [gf:68747 §Trader, silktail] [wiki:bravelydefault.fandom.com/Norende Village] [gf:68625 §Norende (0701), vinheim]

## Unverified or contradicted
- **The Combat Item Shop's second level.** silktail gives 1 hour; the wiki and vinheim give 2 hours 30 minutes. The item is Antarctic Wind in silktail and vinheim, and Antarctic Ward on the wiki [gf:68747 §Combat Item Shop, silktail] [wiki:bravelydefault.fandom.com/Norende Village] [gf:68625 §Norende (0701), vinheim]
- **The Weapons Shop's fifth level.** 9 hours 30 minutes in silktail and on the wiki, 9 hours in vinheim [gf:68747 §Weapons Shop, silktail] [wiki:bravelydefault.fandom.com/Norende Village] [gf:68625 §Norende (0701), vinheim]
- **The Hill Parts Shop's tenth level.** Cure Doom, Doom Res Up and Death Res Up in silktail and on the wiki; vinheim lists Doom Res Down as the third part [gf:68747 §Hill Parts Shop, silktail] [wiki:bravelydefault.fandom.com/Norende Village] [gf:68625 §Norende (0701), vinheim]
- **Three special moves per weapon type.** The wiki says three for every type, but the shop's lists in both guides give swords two. A third sword move may come from somewhere else; this pass did not check [wiki:bravelydefault.fandom.com/Special (Bravely Default)] [gf:68747 §Special Move Shop, silktail]
- **When building time passes.** silktail says it runs while the game is played or in sleep mode and stops when the game is off or at the title screen; vinheim says only that it is real time [gf:68747 §Getting Started, silktail] [gf:68625 §Norende (0701), vinheim]
- **Where the bonus equipment came from.** silktail says it was downloadable content in the original Japanese release [gf:68747 §Unlocked Bonus Equipment, silktail]
- **The remaster.** The wiki adds a Bravo Bikini to the Compound Shop's last level in the HD Remaster, and says the remaster moved Nemeses out of the village; this pass is about the 3DS game [wiki:bravelydefault.fandom.com/Norende Village]

## Codex rows

```js
// Spliced into JRPG_Design_Codex.html on 2026-09-14 by
// scripts/splice_rows.mjs (the rows there are the source of truth; this is the map).
// M290  Special moves grown in the village: one shop unlocks them, four more make their parts  Progression & Upgrades
```

## Codex delta
- (ids after the splice)
- M224 (the Norende rebuild) sharpened in place from this digest's Upgrades and Shops facts: the six blocked areas, eleven shops of eleven levels, time divided by villagers, the eggs, and the bonus equipment at each shop's last level. It gained its first sources. The brief's third question, hidden items with stated stats, was not pursued.
