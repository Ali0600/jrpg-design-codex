# Grandia — research digest

Codex: `Grandia` (1997, PlayStation) · GameFAQs: `/ps/197483-grandia` (the row's harvested `gf.u`) · digest started 2026-09-18

> Facts only, in our own words. Item names and numbers may be quoted; guide prose may not.
> Every fact carries a pointer: `[gf:<id> §<section>, <author> v<ver>]`, `[wiki:<host>/<Page>]` or `[web:<host>/<path>]`.

A sources pass (plan section R, batch 3) for Grandia's three mechanics rows, M139–M141, and its minigame row g059. No new
rows; all four are edited in place. The Grandia Wiki (`grandia.fandom.com`) has pages for Mana Eggs, the game itself and the
deck-swabbing minigame but none for the skill or IP systems, so those rest on GameFAQs authors: Dalez's walkthrough, which
`pick()` names, Tricrokra's Skill Guide and Shotgunnova's walkthrough.

## Sources

| id | title | author | version | updated | category | KB | url |
|---|---|---|---|---|---|---|---|
| 6812 | Guide and Walkthrough | Dalez | 2.25 | 01/06/2001 | Full Game Guides | 433 | https://gamefaqs.gamespot.com/ps/197483-grandia/faqs/6812 |
| 13587 | Skill Guide | Tricrokra | 1.01 | 09/18/2001 | In-Depth Guides | 45 | https://gamefaqs.gamespot.com/ps/197483-grandia/faqs/13587 |
| 63755 | Guide and Walkthrough | Shotgunnova | — | — | Full Game Guides | 410 | https://gamefaqs.gamespot.com/ps/197483-grandia/faqs/63755 |
| wiki | Mana Egg; Grandia; Deck Swabbing | — | — | — | grandia.fandom.com | — | https://grandia.fandom.com/wiki/Mana_Egg |

Coverage 6812: single page, 434,150 chars, 10,098 lines, 304 sections. Read: Weapon and Magic Skills, Issuing Commands and
the IP Bar block (lines 591–630). Greps: the IP and Com marks (14 hits), camera, rotation and compass (16), rotate (2),
hidden (8). Largest unread: LIST OF ENEMIES (57,974 chars), g. Twin Towers (11,736) and a. Town of Parm (9,001).

Coverage 13587: single page, 45,366 chars, 945 lines, 26 sections. Read: Introduction and Skills. Largest unread: Skills and
spells detailed (10,479 chars), Hints per character (9,070) and the per-element spell lists.

Coverage 63755: single page, 395,711 chars, 6,234 lines, 87 sections. Read: the deck-swabbing block (lines 760–781). Greps:
swab (3 hits), camera and rotation (8). Largest unread: the walkthrough's dungeon chapters, which no row needs beyond the
two camera notes quoted here.

## Triage

`__gf.triage()` and `__gf.pick()` on 2026-09-18: 20 guides listed (6 Full Game Guides, 10 In-Depth Guides, 4 Foreign Language
Guides, none read). Nothing in this listing carries a flag at all, so `pick()` falls to its last arm, the largest plain-text
Full Game Guide: Dalez's 6812 at 433 KB.

| id | title | author | category | KB | score | decision | flags |
|---|---|---|---|---|---|---|---|
| 6812 | Guide and Walkthrough | Dalez | Full Game Guides | 433 | 2 | read | — |
| 63755 | Guide and Walkthrough | Shotgunnova | Full Game Guides | 410 | 2 | read | — |
| 18850 | Guide and Walkthrough | Tricrokra | Full Game Guides | 372 | 2 | skipped — the same author's Skill Guide was read instead | — |
| 6846 | Guide and Walkthrough | Kildread | Full Game Guides | 337 | 2 | skipped — another walkthrough; the two read answered | — |
| 6323 | Guide and Walkthrough | Zenodeus | Full Game Guides | 103 | 2 | skipped — another walkthrough; the two read answered | — |
| 5067 | Guide and Walkthrough (Japanese) | SRuchet | Full Game Guides | 81 | 2 | skipped — the Saturn version, in Japanese | — |
| 26559 | Bestiary | Capt_Evil | In-Depth Guides | 45 | 5 | skipped — a bestiary | — |
| 6478 | Bonus Dungeon Walkthrough | Zero_ | In-Depth Guides | 22 | 4 | skipped — one optional dungeon | — |
| 11200 | Boss Guide | Tricrokra | In-Depth Guides | 40 | 1 | skipped — bosses | — |
| 7198 | Character/Secrets FAQ | NAkhtar | In-Depth Guides | 72 | 7 | skipped — characters; the skill system is 13587's subject | — |
| 63754 | Game Script | Shotgunnova | In-Depth Guides | 448 | -1 | skipped — a script | — |
| 27473 | Item/Equipment FAQ | Ornitier | In-Depth Guides | 111 | 10 | skipped — equipment | — |
| 72894 | Magic/Moves Database | Boomerang78 | In-Depth Guides | 188 | 4 | skipped — a spell and move database; 13587 covers how they unlock | — |
| 72695 | Save State Hacking Guide | demonsword2 | In-Depth Guides | 14 | 3 | skipped — save hacking | — |
| 13587 | Skill Guide | Tricrokra | In-Depth Guides | 45 | 7 | read | — |
| 7563 | Translation Guide | _Alent_ | In-Depth Guides | 398 | -1 | skipped — a Saturn translation | — |

## Mechanics candidates

No new rows. The blocks below source the three existing rows, each edited in place on 2026-09-18.

### M139 Use-Based Growth: Weapon Skills & Mana-Egg Magic
pointers: [gf:6812 §Weapon and Magic Skills, Dalez v2.25] [gf:13587 §Introduction, Tricrokra v1.01] [wiki:grandia.fandom.com/Mana Egg]
row: M139
- Grandia keeps two kinds of experience: general experience, and skill experience split into weapon skills and magic skills [gf:13587 §Introduction, Tricrokra v1.01] [gf:6812 §Weapon and Magic Skills, Dalez v2.25]
- There are six weapon categories — Sword, Mace, Axe, Throw, Whip and Knife — and striking with one raises that category's own skill [gf:13587 §Introduction, Tricrokra v1.01] [gf:6812 §Weapon and Magic Skills, Dalez v2.25]
- Moves unlock at skill-level thresholds rather than being bought: Round Wacker at Mace 7, W-Break at Sword 6 and Mace 4, and some need magic levels too (Fight Cheer: Mace 8, Earth 2, Fire 3) [gf:13587 §Skills, Tricrokra v1.01] [gf:6812 §Weapon and Magic Skills, Dalez v2.25]
- Using a move costs SP and casting a spell costs MP [gf:6812 §Issuing Commands, Dalez v2.25]
- Magic is bought with a Mana Egg at a magic shop, one of Fire, Wind, Water or Earth; a used egg is not returned, and there are 18 in the game [wiki:grandia.fandom.com/Mana Egg] [gf:6812 §Weapon and Magic Skills, Dalez v2.25]
- Each cast adds EXP to that element, and 100 EXP raises its skill level; spells list the level they need [gf:6812 §Weapon and Magic Skills, Dalez v2.25] [gf:13587 §Introduction, Tricrokra v1.01]
- Four combination attributes are mixtures of two elements and gain no levels of their own: Lightning (Fire and Wind), Blizzard (Water and Wind), Forest (Water and Earth), Explosion (Fire and Earth) [wiki:grandia.fandom.com/Mana Egg] [gf:6812 §Weapon and Magic Skills, Dalez v2.25]
- A combination spell names levels in both its elements — Boom! needs Earth 7 and Fire 6 [gf:6812 §Weapon and Magic Skills, Dalez v2.25]
- Skill levels also move statistics: Sword gives Str and Wit, Mace Def and HP, Wind Agility, Fire Wit [gf:13587 §Introduction, Tricrokra v1.01]

### M140 IP Gauge Combat: Cancel & Counter
pointers: [gf:6812 §IP Bar, Dalez v2.25] [gf:6812 §Issuing Commands, Dalez v2.25] [gf:63755 §I. CONTROLS (CNTR), Shotgunnova]
row: M140
- The IP bar sits in the lower right and carries an icon for every ally and enemy; icons travel right at a speed set by the unit's action level [gf:6812 §IP Bar, Dalez v2.25]
- A unit issues its command when its icon reaches the "Com" mark, and the move or spell only fires when the icon reaches the "Act" mark after it [gf:6812 §IP Bar, Dalez v2.25] [gf:6812 §Issuing Commands, Dalez v2.25]
- Combo is the ordinary attack and strikes twice; Critical charges for a second or two, hits for less, and can cancel an enemy's move [gf:6812 §Issuing Commands, Dalez v2.25]
- Hitting a unit while it is in the middle of attacking does extra Counter damage [gf:6812 §Issuing Commands, Dalez v2.25]
- Enemies do it back: a powerful hit while your character is charging can stop the move or spell outright [gf:6812 §Issuing Commands, Dalez v2.25]
- Look reports what a unit is doing, and on a charging enemy it highlights its target on the IP bar [gf:6812 §Issuing Commands, Dalez v2.25]
- L1 and R1 show current SP in battle, the resource the unlocked moves spend [gf:63755 §I. CONTROLS (CNTR), Shotgunnova] [gf:6812 §Issuing Commands, Dalez v2.25]

### M141 The Adventure Ethos: A World Built to Reward Exploration
pointers: [wiki:grandia.fandom.com/Grandia] [gf:6812 §Exploring, Dalez v2.25] [gf:63755 §19) GOD OF LIGHT MOUNTAIN (WK19), Shotgunnova]
row: M141
- The world believes exploring is finished because "The End of the World" was found, an insurmountable stone wall on a newly discovered continent, and the hero's father was an adventurer [wiki:grandia.fandom.com/Grandia]
- L1 and R1 rotate the camera on the field, though some rooms and whole dungeons disable it — the End of the World among them [gf:6812 §Exploring, Dalez v2.25] [gf:63755 §I. CONTROLS (CNTR), Shotgunnova] [gf:63755 §21) END OF THE WORLD (WK21), Shotgunnova]
- Turning the camera is what reveals some pickups: 10G hidden in the Sult Ruins, the Light God Amulet near a chest on God of Light Mountain [gf:6812 §c. Sult Ruins, Dalez v2.25] [gf:63755 §19) GOD OF LIGHT MOUNTAIN (WK19), Shotgunnova]
- The compass sits in the upper right at all times: its red bar is north and its arrow points at the destination, spinning faster as you near it [gf:6812 §Exploring, Dalez v2.25]
- Select gives a zoomed-out town view with green arrows for people, and Dungeon-Scope icons zoom out inside dungeons [gf:6812 §Exploring, Dalez v2.25] [gf:63755 §01) PORT TOWN OF PARM (WK01), Shotgunnova]
- Money and items are strewn through the scenery, some of it semi-hidden behind rocks [gf:6812 §a. Valley of the Flying Dragon, Dalez v2.25]

## Minigame candidates

No new rows. The existing row is edited in place on 2026-09-18.

### g059 Deck Swabbing
pointers: [wiki:grandia.fandom.com/Deck Swabbing] [gf:63755 §07) STEAMER SHIP (WK07), Shotgunnova]
row: g059

| at | get | src |
|---|---|---|
| Each morning aboard the Steamer to New Parm | Justin and Sue, apprentice sailors, are set to swab the upper deck | [wiki:grandia.fandom.com/Deck Swabbing] [gf:63755 §07) STEAMER SHIP (WK07), Shotgunnova] |
| Mopping a large dirty deck in straight lines | speed is pumped with the button while a power gauge must not be overrun; overrunning it resets both | [wiki:grandia.fandom.com/Deck Swabbing] [gf:63755 §07) STEAMER SHIP (WK07), Shotgunnova] |
| Finishing under 26 seconds | 25G | [wiki:grandia.fandom.com/Deck Swabbing] [gf:63755 §07) STEAMER SHIP (WK07), Shotgunnova] |
| Sue swabs one lane alongside, uncontrolled | if the clock reaches her finish at 35"20 the attempt fails and cannot be retried | [wiki:grandia.fandom.com/Deck Swabbing] [gf:63755 §07) STEAMER SHIP (WK07), Shotgunnova] |

## Exploration & upgrade facts

### Hidden
- Parm opens with a dare to find four "legendary treasures" hidden around town, with an NPC giving riddling clues [gf:6812 §a. Town of Parm, Dalez v2.25]

### Upgrades
- Skills keep rising even from a battle you flee: escaping costs the EXP, gold and items but not the weapon and magic skills [gf:6812 §Issuing Commands, Dalez v2.25]

### Shops & exchange
- Mana Eggs are traded at magic shops for an element, and are also won from certain bosses [wiki:grandia.fandom.com/Mana Egg]

## Unverified or contradicted

- **Moves bought with Skill Points.** M139 said a weapon class's Moves are "learned by spending Skill Points won in battle". Both sources describe moves unlocking at skill-level thresholds, with SP as what a move costs to use in battle. The row is rewritten [gf:13587 §Skills, Tricrokra v1.01] [gf:6812 §Issuing Commands, Dalez v2.25]
- **Five weapon types.** M139 listed sword, mace, axe, whip and knife. Tricrokra's table has six, adding Throw [gf:13587 §Introduction, Tricrokra v1.01]
- **A camera that "fully rotates".** M141 said so. Both walkthroughs say rotation is unavailable in some rooms, and Shotgunnova notes it is disabled for the whole End of the World dungeon [gf:6812 §Exploring, Dalez v2.25] [gf:63755 §21) END OF THE WORLD (WK21), Shotgunnova]
- **A Critical that knocks the enemy icon far back.** M140 said a cancel knocks the icon far back along the bar. Both the cancel and Counter damage are confirmed, but no source read here quantifies or even describes the knockback, so the row says the turn is cancelled and leaves the distance out [gf:6812 §Issuing Commands, Dalez v2.25]
- **Parm's four legendary treasures.** Dalez opens the Town of Parm with a dare to find four "legendary treasures" hidden around the town, clued by an NPC. Shotgunnova's walkthrough, grepped on 2026-09-21, has no hit for the phrase at all, so the hunt rests on one guide and M141 does not name it [gf:6812 §a. Town of Parm, Dalez v2.25] [gf:63755 §21) END OF THE WORLD (WK21), Shotgunnova]

## Codex rows

```js
// No new rows. M139–M141 and g059 were edited in place on 2026-09-18 and gained `refs`; logged in that day's entry as updated.
```

## Codex delta
- 2026-09-18: M139–M141 and g059, all four Grandia rows, sourced from the Grandia Wiki and three GameFAQs authors; M139, M140 and M141 corrected.
- 2026-09-21: the PS1 expansion pass probed this game and added no row. The Mana Egg trade is already in M139, the camera and the End of the World in M141, and Parm's four legendary treasures failed a second source (recorded above). The Grandia Wiki is series-wide: its Arm Wrestling page is Grandia II's minigame, Arrange Dice is Grandia III's, and the Adventurer's Society page carries only story.
