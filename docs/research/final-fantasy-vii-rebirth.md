# Final Fantasy VII Rebirth — research digest

Codex: `Final Fantasy VII Rebirth` (2024, PlayStation 5) · GameFAQs: `/ps5/371123-final-fantasy-vii-rebirth` (the row's
harvested `gf.u`) · digest started 2026-09-14

> Facts only, in our own words. Item names and numbers may be quoted; guide prose may not.
> Every fact carries a pointer: `[gf:<id> §<section>, <author> v<ver>]`, `[wiki:<host>/<Page>]` or `[web:<host>/<path>]`.

A reward-table pass (the plan's Section F) for Final Fantasy VII Rebirth's four minigame rows. No new rows;
g020–g023 are edited in place. On 2026-09-16 the sources pass (Section R, batch 1) reopened the digest for the
mechanics rows: M001–M007, the progression cluster, sourced and corrected in place. The Final Fantasy Wiki covers this game thinly, so each table rests on Uta's GameFAQs
guide and Game8, with the wiki where it has the fact.

## Sources

| id | title | author | version | updated | category | KB | url |
|---|---|---|---|---|---|---|---|
| 81141 | Guide and Walkthrough (four chapters read) | Uta | 0.8.6 | 01/26/2025 | Full Game Guides | 1153 | https://gamefaqs.gamespot.com/ps5/371123-final-fantasy-vii-rebirth/faqs/81141 |
| web | 3D Brawler, Piano, Fort Condor and Queen's Blood player pages | Game8 | — | — | game8.co | — | https://game8.co/games/Final-Fantasy-VII-Rebirth/archives/445507 |
| wiki | Folio | — | — | — | finalfantasy.fandom.com | — | https://finalfantasy.fandom.com/wiki/Folio |
| web | Folio Skill Trees, Materia, Best Materia, Weapon Abilities and Proficiency Bonuses | Game8 | — | — | game8.co | — | https://game8.co/games/Final-Fantasy-VII-Rebirth/archives/Skill-Trees |

Coverage 81141: a chaptered guide. The index page (6,171 chars; one grep, 6 hits) and four chapters: 3D Brawler
(16,568 chars, 259 lines; one grep, 36 hits, then lines 126–259 read), Piano Recital (9,243 chars, 153 lines; one grep,
26 hits, then lines 119–153 read), Fort Condor (10,117 chars, 102 lines; one grep, 14 hits) and Queen's Blood Opponents
(25,370 chars, 270 lines; one grep, 33 hits). Unread: every walkthrough chapter, most of the Fort Condor strategy text
(8,681 chars) and the opponents' own sections (Blood Peasant 3,958 chars, Blood Squire 3,509, Blood Servant 3,454).
The chapter slugs were read off the index's table of contents; each loaded on the first try.

Coverage 81141 on 2026-09-16: three more chapters, for the progression rows. Materia (12,096 chars, 326 lines, 8
sections; one grep, 28 hits). Weapons (76,736 chars, 1,679 lines, 63 sections; one grep, then the Weapon Level chart
and the Weapon Skills section read). Folios & Manuscripts (4,664 chars, 137 lines, 13 sections; one grep). Unread:
the 49 individual weapon sections of the Weapons chapter, roughly 1,300–1,600 chars each, and the per-character folio
tables, which the author has not written yet. The chapter slug `folios-manuscripts` 404s; it is `folios-and-manuscripts`.

## Triage

`__gf.triage()` on 2026-09-14: 1 guide listed (1 Full Game Guides, 0 In-Depth Guides, none under other headings).

| id | title | author | category | KB | score | decision |
|---|---|---|---|---|---|---|
| 81141 | Guide and Walkthrough | Uta | Full Game Guides | 1153 | 2 | read |

## Mechanics candidates

The seven progression rows, sourced on 2026-09-16. No new rows: M001–M007 are edited in place.

### M001 Materia System
pointers: [gf:81141 §Magic Materia, Uta v0.8.6] [gf:81141 §Support Materia, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/Materia] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/Materia-Best-List]
row: M001
- Materia slotted into any weapon or armour slot gains AP passively in battle, even when its spell is never cast, and each type needs a different amount to level [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/Materia]
- Uta's tables give the thresholds per materia: Fire reaches Fira at 300 AP and Firaga at 900, Healing reaches Cura at 300 and Curaga at 1,200 [gf:81141 §Magic Materia, Uta v0.8.6]
- Support materia fit only paired slots, and summoning materia only weapons [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/Materia]
- A linked pair is the combination: Elemental imbues attacks with the element of the magic materia linked to it, and Auto-Cast has an ally cast the linked materia's spells unprompted [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/Materia-Best-List] [gf:81141 §Support Materia, Uta v0.8.6]

### M002 Weapon Levels + Weapon Skills
pointers: [gf:81141 §Weapon Level, Uta v0.8.6] [gf:81141 §Weapon Skills, Uta v0.8.6] [wiki:finalfantasy.fandom.com/Folio]
row: M002
- A weapon's level is set by its owner's MAXIMUM SP, not by the SP still unspent, so a weapon found late is already at the level reached with the old one, and every weapon owned levels alongside it [gf:81141 §Weapon Level, Uta v0.8.6]
- The chart: 25 SP for level 2, then 40, 70, 110, 155, 200, and 335 for level 8 [gf:81141 §Weapon Level, Uta v0.8.6]
- A normal playthrough earns at most 335 SP, exactly weapon level 8, so level 9 needs Hard Mode [gf:81141 §Weapon Level, Uta v0.8.6]
- The wiki agrees that SP levels the weapon, and that the gain is a stat boost across the weapon rather than a skill [wiki:finalfantasy.fandom.com/Folio]
- Each weapon starts with one Weapon Skill slot; levels add slots and unlock further skills, and skills swap freely [gf:81141 §Weapon Skills, Uta v0.8.6]

### M003 Weapon Abilities + Proficiency
pointers: [gf:81141 §Weapon Ability, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/Weapon-Abilities-Proficiency-Bonuses]
row: M003
- Every weapon carries an ability its owner can master: using it in combat raises proficiency, and so does fulfilling that weapon's own Proficiency Bonus [gf:81141 §Weapon Ability, Uta v0.8.6]
- Once the gauge is full the ability stays available with the weapon unequipped [gf:81141 §Weapon Ability, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/Weapon-Abilities-Proficiency-Bonuses]
- Game8 adds that a Proficiency Bonus counts only while that weapon is equipped, and that the objectives differ per weapon: staggering, exploiting a weakness, or a number of hits [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/Weapon-Abilities-Proficiency-Bonuses]
- There are seven weapons per character, and each is unique to that character [gf:81141 §Weapon Overview, Uta v0.8.6]

### M004 Folios (Skill Trees)
pointers: [wiki:finalfantasy.fandom.com/Folio] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/Skill-Trees]
row: M004
- A folio is a grid of skill cores, unlocked with SP, unique per character [wiki:finalfantasy.fandom.com/Folio]
- Cores come in kinds: stat boosts, abilities, and synergy abilities or skills shared with one other character, with one ability core granting that character's level 3 limit break [wiki:finalfantasy.fandom.com/Folio] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/Skill-Trees]
- A core has to be made available by party level before SP can be spent on it [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/Skill-Trees]
- Folios are unlocked at Maghnata Books shops and vending machines [wiki:finalfantasy.fandom.com/Folio]

### M005 SP as a triple-duty resource
pointers: [gf:81141 §Weapon Level, Uta v0.8.6] [wiki:finalfantasy.fandom.com/Folio] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/Skill-Trees]
row: M005
- SP arrives 5 at a time on a level-up and +10 per manuscript [gf:81141 §Weapon Level, Uta v0.8.6] [wiki:finalfantasy.fandom.com/Folio]
- The same SP does two jobs: the maximum ever earned sets weapon level, and the pool is spent on folio cores [gf:81141 §Weapon Level, Uta v0.8.6] [wiki:finalfantasy.fandom.com/Folio]
- Party level is not SP. It rises with Party EXP, and what it governs is which cores the SP may be spent on [wiki:finalfantasy.fandom.com/Folio] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/Skill-Trees]

### M006 Manuscripts (SP collectibles)
pointers: [gf:81141 §Weapon Level, Uta v0.8.6] [gf:81141 §Folios & Manuscripts, Uta v0.8.6] [wiki:finalfantasy.fandom.com/Folio]
row: M006
- A manuscript grants +10 SP to the character it names [gf:81141 §Weapon Level, Uta v0.8.6]
- Six per character below Hard Mode, with about twenty more from Hard Mode and the legendary combat-simulator challenges, so a folio cannot be filled without Hard Mode [gf:81141 §Weapon Level, Uta v0.8.6] [wiki:finalfantasy.fandom.com/Folio]
- Uta's chapter names each volume's source: quest rewards, the Moogle Emporium at 6 Moogle Medals and a merchant rank, the Gold Saucer's GP exchanges at 100 GP, and colosseum or battleground prizes [gf:81141 §Folios & Manuscripts, Uta v0.8.6]

### M007 Party Level / Party EXP
pointers: [wiki:finalfantasy.fandom.com/Folio] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/Skill-Trees]
row: M007
- Party EXP is separate from each character's own EXP: story chapters pay it, World Intel and Odd Jobs pay it in bulk, and minigames pay it once those are exhausted [wiki:finalfantasy.fandom.com/Folio] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/Skill-Trees]
- Raising party level raises the folio level of every character, revealing more cores [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/Skill-Trees]

## Minigame candidates

None new. The findings below are written into the existing rows g020–g023.

### g020 Queen's Blood
pointers: [wiki:finalfantasy.fandom.com/Queen's Blood] [gf:81141 §Queen's Blood Opponents, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/447403]

| at | get | src |
|---|---|---|
| Defeating 6 players | Blood Squire rank | [wiki:finalfantasy.fandom.com/Queen's Blood] [gf:81141 §Queen's Blood Opponents, Uta v0.8.6] |
| Defeating 9 players and Cameron, a Keeper of the Cruor | Blood Acolyte rank | [wiki:finalfantasy.fandom.com/Queen's Blood] [gf:81141 §Queen's Blood Opponents, Uta v0.8.6] |
| Defeating 12 players | Blood Knight rank | [wiki:finalfantasy.fandom.com/Queen's Blood] [gf:81141 §Queen's Blood Opponents, Uta v0.8.6] |
| Defeating 15 players and Navalan | Blood Knight 2nd Class rank | [wiki:finalfantasy.fandom.com/Queen's Blood] [gf:81141 §Queen's Blood Opponents, Uta v0.8.6] |
| Defeating 18 players | Blood Captain rank | [wiki:finalfantasy.fandom.com/Queen's Blood] [gf:81141 §Queen's Blood Opponents, Uta v0.8.6] |
| Defeating 21 players and Wize 3.0 | Blood Tactician rank | [wiki:finalfantasy.fandom.com/Queen's Blood] [gf:81141 §Queen's Blood Opponents, Uta v0.8.6] |
| Defeating 24 players and Regina | Blood Marquis rank | [wiki:finalfantasy.fandom.com/Queen's Blood] [gf:81141 §Queen's Blood Opponents, Uta v0.8.6] |
| Defeating 28 players and Lidrehl | Blood Sovereign rank | [wiki:finalfantasy.fandom.com/Queen's Blood] [gf:81141 §Queen's Blood Opponents, Uta v0.8.6] |
| Defeating the last Keeper of the Cruor | Blood Executioner rank | [wiki:finalfantasy.fandom.com/Queen's Blood] [gf:81141 §Queen's Blood Opponents, Uta v0.8.6] |
| Defeating the Shadowblood Queen | Blood Champion, the final rank | [wiki:finalfantasy.fandom.com/Queen's Blood] [gf:81141 §Queen's Blood Opponents, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/447403] |

### g021 Piano performances
pointers: [gf:81141 §Standard Songs, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/443879] [wiki:finalfantasy.fandom.com/Piano]

| at | get | src |
|---|---|---|
| An A rank on On Our Way (sheet music at the Crow's Nest, Junon) | HP Up Materia ★★ | [gf:81141 §Standard Songs, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/443879] |
| An A rank on Tifa's Theme (Costa del Sol) | MP Up Materia ★★ | [gf:81141 §Standard Songs, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/443879] |
| An A rank on Barret's Theme (North Corel) | Warding Materia ★★ | [gf:81141 §Standard Songs, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/443879] |
| An A rank on Cinco de Chocobo (Gongaga) | Steadfast Block Materia ★★ | [gf:81141 §Standard Songs, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/443879] |
| An A rank on Two Legs? Nothin' To It (Cosmo Canyon) | Disempowerment Materia ★★ | [gf:81141 §Standard Songs, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/443879] |
| An A rank on all six songs | Healing Materia ★★★★ and the sheet music for Let the Battles Begin! | [gf:81141 §Standard Songs, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/443879] |

### g022 Fort Condor
pointers: [wiki:finalfantasy.fandom.com/Fort Condor] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/445612] [gf:81141 §Fort Condor, Uta v0.8.6]

- No item table: a Fort Condor match is how the Junon region's protorelic sites are cleared, and Chadley pays for completed world intel in materia [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/445612]
- The minigame opens through the Junon region's phenomenon world intel from Chapter 4, and the party can only use preset units [wiki:finalfantasy.fandom.com/Fort Condor] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/445612]
- Clearing every stage on Normal opens a Hard Mode, where the same formations hit harder [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/445612] [gf:81141 §Fort Condor, Uta v0.8.6]

### g023 3D Brawler
pointers: [gf:81141 §3D Brawler, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/445621] [wiki:finalfantasy.fandom.com/Final Fantasy VII Rebirth accessories]

| at | get | src |
|---|---|---|
| Beating Saucer Brawler (a repeat win pays 25 points) | Mega-Potion and 100 Gold Saucer Points | [gf:81141 §Standard Opponents, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/445621] |
| Beating Fat Moogle (repeat: 50) | Dry Ether and 150 Gold Saucer Points | [gf:81141 §Standard Opponents, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/445621] |
| Beating Dio (repeat: 75) | Silver Brawler's Gloves and 200 Gold Saucer Points | [gf:81141 §Dio – ★★★☆☆, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/445621] |
| Beating Shiva (repeat: 135) | Dark Matter and 270 Gold Saucer Points | [gf:81141 §Shiva – ★★★★☆, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/445621] |
| Beating Ifrit (repeat: 175) | Golden Brawler's Gloves and 350 Gold Saucer Points | [gf:81141 §Ifrit – ★★★★★, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/445621] |
| Beating Sephiroth, unlocked by the quest Can't Stop, Won't Stop (repeat: 200) | Ribbon and 400 Gold Saucer Points | [gf:81141 §Sepiroth – ★★★★★, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/445621] [wiki:finalfantasy.fandom.com/Final Fantasy VII Rebirth accessories] |
| Beating Yuffie | A one-time rise in Yuffie's relationship level | [gf:81141 §Yuffie – ★★★☆☆, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/445621] |

## Exploration & upgrade facts

### Hidden
- Beating the Shadowblood Queen also gives her card, number 145 [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/447403]
- Johnny's Treasure Trove in Costa del Sol pays the One-Winged Angel sheet music once complete [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/443879]
- Every 3D Brawler opponent except Yuffie and the Ultimate Party Animal adds a collectible to the Gold Saucer points shop, needed for Johnny's Treasure Trove [gf:81141 §3D Brawler, Uta v0.8.6]

### Upgrades
- Queen's Blood losses cost nothing, wins pay new cards, and higher-ranked players refuse much lower-ranked challengers [wiki:finalfantasy.fandom.com/Queen's Blood]
- Cameron, Navalan, Wize 3.0 and Regina each appear only once Cloud holds the rank just below the one they award; Lidrehl waits for Blood Tactician [gf:81141 §Queen's Blood Opponents, Uta v0.8.6]

### Shops & exchange
- Beating all six piano songs at A rank is also what the Piano Virtuoso trophy asks for [gf:81141 §Standard Songs, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/443879]

## Unverified or contradicted
- **Aerith's Theme.** Uta gives its A-rank reward as HP Up Materia ★★★; Game8 gives Binding Materia ★★★ [gf:81141 §Standard Songs, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/443879]
- **The first two ranks.** The wiki starts at Blood Peasant and reaches Blood Servant after three wins; Uta's list has the two names the other way round [wiki:finalfantasy.fandom.com/Queen's Blood] [gf:81141 §Queen's Blood Opponents, Uta v0.8.6]
- **The Blood Executioner's opponent.** The wiki names the Beast of Chaos; Uta names Vincent [wiki:finalfantasy.fandom.com/Queen's Blood] [gf:81141 §Queen's Blood Opponents, Uta v0.8.6]
- **Shiva's Dark Matter.** Uta says three; Game8 gives no count [gf:81141 §Shiva – ★★★★☆, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/445621]
- **Where SP comes from.** Uta and the wiki both have SP raising the weapon level; Game8's skill-tree guide says the reverse, that SP is earned by raising weapon level. Two of the three agree, and M002 and M005 follow them [gf:81141 §Weapon Level, Uta v0.8.6] [wiki:finalfantasy.fandom.com/Folio] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/Skill-Trees]
- **Folio cores gated by weapon level, and free respeccing.** M004 claimed both. Neither the wiki, nor Game8, nor Uta's chapters say either, so both clauses were dropped from the row [wiki:finalfantasy.fandom.com/Folio] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/Skill-Trees]
- **Weapon levels granting extra materia slots.** M002 claimed it. Uta's weapon chapter gives a level stat boosts and Weapon Skill slots only, so the clause was dropped [gf:81141 §Weapon Level, Uta v0.8.6] [gf:81141 §Weapon Skills, Uta v0.8.6]
- **Party level from pooled SP.** M005 claimed the party's combined SP set party level; both the wiki and Game8 make it a Party EXP track, and the row was corrected [wiki:finalfantasy.fandom.com/Folio] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/Skill-Trees]
- **The cores' colours.** The wiki calls synergy cores red and ability cores purple; Game8 calls the synergy icon orange [wiki:finalfantasy.fandom.com/Folio] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/Skill-Trees]
- **Who else can play the piano.** Uta says Tifa, Aerith and Yuffie once all six songs are done; Game8 names Yuffie and Aerith [gf:81141 §Standard Songs, Uta v0.8.6] [web:game8.co/games/Final-Fantasy-VII-Rebirth/archives/443879]

## Codex rows

```js
// No new rows. g020–g023 were edited in place: g020, g021 and g023 gained `rt` tables, all four gained `refs`,
// and g022's and g023's reward lines were corrected. Logged in CHANGES as updated.
// 2026-09-16: M001–M007 edited in place too — all seven gained `refs`, and M002, M004, M005, M006 and M007
// had claims corrected against the sources. Logged in the 2026-09-16 entry as updated.
```

## Codex delta
- g020–g023 (all four Final Fantasy VII Rebirth minigames) sourced in place on 2026-09-14; Fort Condor (g022) has no item table.
- 2026-09-16: M001–M007, the progression cluster, sourced. M001 and M003 stood as written; M002, M004, M005, M006 and M007
  were corrected. The remaining 25 Rebirth rows (M008–M027, M032–M036) wait for the next PRs of batch 1.
