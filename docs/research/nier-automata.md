# NieR: Automata — research digest

Codex: `NieR: Automata` (2017, PlayStation 4) · GameFAQs: `/ps4/168677-nier-automata` confirmed 2026-09-14 (the row's
harvested `gf.u`, released March 7, 2017) · digest started 2026-09-14

> Facts only, in our own words. Item names and numbers may be quoted; guide prose may not.
> Every fact carries a pointer: `[gf:<id> §<section>, <author> v<ver>]` or `[wiki:<host>/<Page>]`.

## Sources

| id | title | author | version | updated | category | KB | url |
|---|---|---|---|---|---|---|---|
| 75141 | Guide and Walkthrough (grep only) | PuppyLand | — | — | Full Game Guides | 946 | https://gamefaqs.gamespot.com/ps4/168677-nier-automata/faqs/75141 |
| 74472 | Guide and Walkthrough (grep only) | vinheim | 2.4 | 04/14/2017 | Full Game Guides | 314 | https://gamefaqs.gamespot.com/ps4/168677-nier-automata/faqs/74472 |

Coverage 75141: 21 pages, four opened — page 1 (59,067 chars: greps for fusion, 4 hits; upgrades, 0;
fishing and vendors, 2; and a read of the guide's own page list), page 14 (51,422 chars: greps for
fusion, the Canyon Machine and the formula, 39 hits cut to 28 by the cap; the fusion ceilings, 2;
the formula and its rounding, 11), page 16 (33,187 chars: one grep for Masamune, the trader, stories,
level 4 and the Iron Pipe, 15 hits) and page 20 (greps for weapon stories, 5 hits, and fish, 77). No
whole section read. Unread: the Fusion Cost Tables (11,772), the weapon lists (Small Swords 7,141)
and the other seventeen pages, including the Materials chapter.

Coverage 74472: page 1 of 7, 52,242 chars, 55 sections — four greps (the Canyon Machine and fusion,
2 hits; weapon stories and upgrades, 1; the trophy seller, 0; fishing, 5) and a `lines()` read of
the weapons trader's first quest. Pages 2–7 not opened.

## Triage

`__gf.triage()` on 2026-09-14: 3 guides listed (2 Full Game Guides, 0 In-Depth Guides, 1 under other
headings: a Portuguese walkthrough, not read). With no In-Depth guide, both walkthroughs carried the
pass. PuppyLand's 21-page guide has chapters on chip fusion, weapons, weapon stories and fishing,
reached through its own page list, and vinheim's first page was grepped for the weapons trader's
quest and the fishing chip's price. On 2026-09-15 `__gf.pick()` returned no guide: both Full Game
Guides carry the HTML flair, so neither is a plain-text walkthrough to read under the owner's rule,
and the grep-only readings stand. The flags column copies the listing on that day.

| id | title | author | category | KB | score | decision | flags |
|---|---|---|---|---|---|---|---|
| 75141 | Guide and Walkthrough | PuppyLand | Full Game Guides | 946 | 3 | grep only | Highest Rated · HTML |
| 74472 | Guide and Walkthrough | vinheim | Full Game Guides | 314 | 3 | grep only | FAQ of the Month Winner: March 2017 · HTML |

## Mechanics candidates

### Weapon stories: every upgrade unlocks the next part of a weapon's history
cat: Progression & Upgrades
how: Every weapon has four levels, paid for in materials. Each upgrade adds attack and longer combos, with a first ability at level 2 and a second at level 4. The camp's weapons trader opens only after an early quest brings him the parts to repair his broken maintenance device, and even then he stops at level 3; level 4 is sold only by Masamune in the Forest Castle. Each level also unlocks another part of that weapon's written story, four parts in all, so the Weapon Stories archive is complete only when every weapon has reached level 4.
loop: gather materials from machines and the world → pay to raise a weapon a level → gain attack, an ability and the next part of its story → feels good because each upgrade pays in both power and lore
notes: The move worth copying is attaching writing to the upgrade track. A fourth level pays a second ability and the end of the weapon's story, so a player who has already settled on a main weapon still has a reason to raise the others. The ladder around it leads the player places, too: the first upgrade shop opens only after a quest repairs it, and the last level is sold by a single merchant in a late area. For the owner's game, write each weapon's history in stages and release the last stage only at full upgrade; a completionist grind becomes something the player reads.
pointers: [gf:75141 §Upgrading Weapons (page 16), PuppyLand] [gf:75141 §Weapon Stories (page 20), PuppyLand] [wiki:nier.fandom.com/Weapons (Automata)] [wiki:nier.fandom.com/Virtuous Treaty]
row: M291
- A weapon's first ability unlocks at level 2 and its second at level 4 [gf:75141 §Weapon Effects/Abilities (page 16), PuppyLand] [wiki:nier.fandom.com/Virtuous Treaty]
- The Weapon Stories archive fills as weapons are upgraded and reaches 100% when every weapon is at level 4 [gf:75141 §Weapon Stories (page 20), PuppyLand]; each weapon's wiki page lists its story in four parts, one per level [wiki:nier.fandom.com/Virtuous Treaty]
- The Resistance Camp's weapons trader needs Complex Gadgets to fix his maintenance device, which starts the first sub-quest, and he reopens his shop with a gift of upgrade materials once it is fixed [gf:74472 §Gathering Intel, vinheim v2.4] [wiki:nier.fandom.com/The Weapon Dealer's Request]
- The trader upgrades weapons to level 3, and level 4 needs Masamune at the Forest Castle [wiki:nier.fandom.com/Weapons (Automata)] [gf:75141 §Upgrading Weapons (page 16), PuppyLand]

## Minigame candidates

### Fishing with the Pod: sale fish, an encyclopedia, and two catches that are equipment
p: Wherever the fishing prompt appears, the character sits and casts their Pod into the water, then presses the button when it dips to land the catch. Fish have set locations and rarities, but one guide and the wiki both found nothing else in a spot that changes what bites. Catches fill a Fishing Encyclopedia in the Intel menu and sell well, which makes fishing an early source of money.
r: Mostly fish to sell and encyclopedia entries, plus two one-time catches that are equipment: the Iron Pipe, a small sword, from the sewers leading to the Amusement Park, and a second Pod, Pod B, from the Flooded City coast.
l: A relaxing loop that pays mostly in money and a collection log still hides two pieces of real equipment, found by casting in particular places. That is the unpredictable shape of reward the owner values, placed in the least likely activity. Copy it, but signpost the spots a little: here the only aid is a chip that marks fishing spots, and one guide calls fishing's other rewards useless.
pointers: [gf:75141 §Fishing (page 20), PuppyLand] [wiki:nier.fandom.com/Fishing (Automata)] [gf:74472 §Reboot, vinheim v2.4]
row: g099

| at | get | src |
|---|---|---|
| Cast in the sewers leading to the Amusement Park (once) | Iron Pipe, a small sword | [gf:75141 §Fishing (page 20), PuppyLand] [wiki:nier.fandom.com/Fishing (Automata)] |
| Cast at the Flooded City coast (once) | Pod B | [gf:75141 §Fishing (page 20), PuppyLand] [wiki:nier.fandom.com/Fishing (Automata)] |

- The catch is a matter of luck within each spot's list [gf:75141 §Fishing (page 20), PuppyLand] [wiki:nier.fandom.com/Fishing (Automata)]
- Fish sell for enough to make fishing a decent early way to earn money [gf:75141 §Fishing (page 20), PuppyLand] [wiki:nier.fandom.com/Fishing (Automata)]
- A chip marks fishing spots; vinheim's walkthrough prices it at 5,000 G [wiki:nier.fandom.com/Fishing (Automata)] [gf:74472 §Reboot, vinheim v2.4]
- The Iron Pipe is listed among the small swords [wiki:nier.fandom.com/Weapons (Automata)]

## Exploration & upgrade facts

### Hidden
- Neither one-time catch is logged in the Fishing Encyclopedia [wiki:nier.fandom.com/Fishing (Automata)] [wiki:nier.fandom.com/A Round by the Pond (Automata)]
- One fishing catch is needed for a secret sidequest [wiki:nier.fandom.com/Fishing (Automata)]

### Upgrades
- Two chips of the same type and level fuse, for a fee, into one chip a level higher, and the fees run to millions over a whole build [gf:75141 §How to Fuse Chips (page 14), PuppyLand] [wiki:nier.fandom.com/Plug-in Chips]
- The fused chip's storage cost is the two costs plus the level, halved [gf:75141 §Fusion Cost Formula (page 14), PuppyLand] [wiki:nier.fandom.com/Plug-in Chips]
- The Resistance Camp's merchant fuses chips only up to +6; fusing into +7 and +8 needs the Canyon Machine in the Forest Kingdom's canyon, whose service opens after the quest Lord of the Valley [gf:75141 §How to Fuse Chips (page 14), PuppyLand] [wiki:nier.fandom.com/Canyon Machine] [wiki:nier.fandom.com/Lord of the Valley] [wiki:nier.fandom.com/Plug-in Chips]
- Enemies drop chips no higher than level 4, and those rarely [gf:75141 §Chips Sources (page 14), PuppyLand]; the wiki says drops seldom pass level 3 on the first two routes and level 4 on the third [wiki:nier.fandom.com/Plug-in Chips]
- Each level doubles the chips a +8 needs: 32 at level 3, 256 at level 0 [wiki:nier.fandom.com/Plug-in Chips]
- Chips bought from any merchant carry the highest storage cost for their level [gf:75141 §Chips Sources (page 14), PuppyLand] [wiki:nier.fandom.com/Canyon Machine]
- Some pairs of lower-level chips match a +8's effect for less storage: two Charge Attack +4 chips at cost 9 give its fourfold charged damage for 18 against 21 [gf:75141 §How to Fuse Chips (page 14), PuppyLand]; the wiki's example is two level-1 Combust chips matching a level-8 one [wiki:nier.fandom.com/Plug-in Chips]
- Virtuous Treaty's upgrades: Rusted Clump ×5, Beast Hide ×5 and Crystal ×5 for level 2; Dented Plate ×4, Titanium Alloy ×3, Warped Wire ×5 and Amber ×2 for level 3; Masamune plus Memory Alloy ×2, Severed Cable ×5, Pristine Cable ×3, Machine Torso ×2 and Moldavite ×1 for level 4 [wiki:nier.fandom.com/Virtuous Treaty]

### Shops & exchange
- Owning upgraded machine weapons makes machine-run shops 10% cheaper for each, up to 40%, without equipping them [gf:75141 §Weapon Effects/Abilities (page 16), PuppyLand]
- A Round by the Pond, the trophy for 20 kinds of fish, can be bought for 50,000 G from the Strange Resistance Woman after endings A, B and C/D [wiki:nier.fandom.com/A Round by the Pond (Automata)]

## Unverified or contradicted
- **Rounding in the fusion formula.** PuppyLand rounds every result up and counts a +0 chip as level 1. The wiki rounds up for even-numbered chips and down for odd-numbered and no-level chips, counting levels 0 and 1 as 1. Both readings give the same results on the examples each gives [gf:75141 §Fusion Cost Formula (page 14), PuppyLand] [wiki:nier.fandom.com/Plug-in Chips]
- **Where chips below +7 are fused.** PuppyLand names the Bunker's terminal area and the Resistance Camp's maintenance shop; the wiki names any merchant that sells Pod programs [gf:75141 §How to Fuse Chips (page 14), PuppyLand] [wiki:nier.fandom.com/Plug-in Chips]
- **The Iron Pipe's spot.** PuppyLand names the sewer passage between the City Ruins and the Amusement Park; the wiki names the sewers leading to the Amusement Park, or those between the City Ruins and the Flooded City [gf:75141 §Fishing (page 20), PuppyLand] [wiki:nier.fandom.com/Fishing (Automata)]
- **When a weapon's first story part appears.** PuppyLand says each entry unlocks on upgrading; the wiki lists a level 1 part, so the first part may come with the weapon itself [gf:75141 §Weapon Stories (page 20), PuppyLand] [wiki:nier.fandom.com/Virtuous Treaty]

## Codex rows

```js
// Spliced into JRPG_Design_Codex.html on 2026-09-14 by
// scripts/splice_rows.mjs (the rows there are the source of truth; this is the map).
// M291  Weapon stories: every upgrade unlocks the next part of a weapon's history             Progression & Upgrades
// g099  Fishing with the Pod: sale fish, an encyclopedia, and two catches that are equipment  rt: 2 rows
```

## Codex delta
- (ids after the splice)
- M235 (Plug-in Chips) sharpened in place: the fusion cost formula, the +6 ceiling at the camp's merchant, the Canyon Machine that a quest opens for the last two levels, and the doubling cost of a +8. It gained its first sources. The brief's question about hidden vendors came back as the Canyon Machine and Masamune.
- 2026-09-15: no plain-text Full Game Guide exists to read under the owner's rule (both are HTML), so nothing changed beyond the Triage flags.
