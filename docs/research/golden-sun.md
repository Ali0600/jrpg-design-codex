# Golden Sun — research digest

Codex: `Golden Sun` (2001, Game Boy Advance) · GameFAQs: `/gba/468548-golden-sun`
confirmed 2026-09-06 (the page's own Release line reads November 11, 2001) ·
digest started 2026-09-06

> Facts only, in our own words. Item names and numbers may be quoted; guide prose may not.
> Every fact carries a pointer: `[gf:<id> §<section>, <author> v<ver>]` or `[wiki:<host>/<Page>]`.

## Sources

| id | title | author | version | updated | category | KB | url |
|---|---|---|---|---|---|---|---|
| 18461 | Artifacts Guide | RocketTrekkieEvoli | 1.6 | 02/09/2003 | In-Depth Guides | 22 | https://gamefaqs.gamespot.com/gba/468548-golden-sun/faqs/18461 |
| wiki | Artifact · Lucky Wheels · Lucky Medal · Lucky Medal Fountains · Game Ticket · Unleash | — | — | — | goldensun.fandom.com | — | https://goldensun.fandom.com/wiki/Artifact |

Coverage 18461: single page, 21,587 chars, 130 sections — 4 read at 100% (Introduction,
Notes on Artifacts, Weapon Artifacts, Armor Artifacts); greps: Lucky Wheels/Medal, Tolbi
Springs, Artifact List. `visited()` reports **no** unread section over 800 chars: the other
126 sections are one-item entries, and the four read here are the whole guide's explanatory
material. The per-item stat tables were deliberately not harvested.

Triage (2026-09-06, `__gf.triage()` on 52 guides): unusually rich — four In-Depth guides
score above every walkthrough (Djinn/Class Mechanics 93KB, Class Setup 43KB, **Artifacts
22KB**, Djinn Location List). Djinn and its class system are already M212, so this pass took
the Artifacts guide, which is the one that answers the brief's question about shops.

## Mechanics candidates

### The Artifact List: a shop's stock is the permanent record of what you have found
cat: Economy & Currency
how: Artifacts are the game's special equipment, and they are the only items a shop will buy back. Selling one — or merely dropping it — files it in the Artifact List, a menu that every artifact-carrying shop of that type then shares, and it stays listed until somebody buys it. Ordinary stock varies from town to town; the Artifact List does not.
loop: find rare gear → sell or drop it → it joins every artifact shop's permanent menu → buy it back later, anywhere, when you finally have the class that can wear it
notes: This is the owner's "shops have upgrades too" in its purest form: the world's shops literally grow a catalogue out of the player's own discoveries, and nothing rare is ever lost by selling it. It also solves a real problem — the artifact you find for a party member you have not recruited stops being dead weight, because the shop remembers it for you. Cheap to implement (one global set) and it makes the shop feel like it has been paying attention.
verbs: Shop stock, Traded
pointers: [gf:18461 §INTRODUCTION, RocketTrekkieEvoli v1.6] [wiki:goldensun.fandom.com/Artifact]
row: M270
- Unlike the other items in stores, Artifacts can be bought back from a store if they are dropped or sold; as the party progresses, artifacts appear on the shops' Artifact Lists [gf:18461 §INTRODUCTION, RocketTrekkieEvoli v1.6]
- Once an artifact appears in a shop's Artifact List it stays on all of those shops' lists until it is bought, unlike regular stock which differs by town [gf:18461 §INTRODUCTION, RocketTrekkieEvoli v1.6]
- The wiki states the same rule independently: artifacts are individually buyable and sellable through shopkeeper "Artifacts" menus, and selling or dropping one lets you buy it back from any shopkeeper with such a menu [wiki:goldensun.fandom.com/Artifact]
- Items sell for 75% of shop price, and any item can be sold at any shop [gf:18461 §Notes on Artifacts, RocketTrekkieEvoli v1.6]
- Two artifacts are exceptions that never appear in the List once discarded — the Fur Coat and the Psynergy Armor [gf:18461 §Notes on Artifacts, RocketTrekkieEvoli v1.6]

### Two token currencies, each with its own venue and its own exclusive gear
cat: Economy & Currency
how: Game Tickets are handed over free by any vendor when the party makes a particularly expensive purchase, and are spent at the Lucky Wheels slot game. Lucky Medals are found in jars, crates and chests and dropped by Mimics, and are thrown into the Tolbi Spring. Each venue holds equipment obtainable nowhere else in the game — the Wheels supply most of the Boot, Shirt and Ring artifacts; the Spring supplies a dozen weapons and armours.
loop: spend heavily at a shop → get a ticket → gamble it for gear the shop cannot sell you → and search jars for medals that buy a different exclusive list
notes: Two currencies that never convert into each other, each with one venue and one catalogue, is a tidy way to make two different player behaviours — spending, and searching scenery — both pay in equipment. Note the elegance of the ticket: it turns the act of BUYING into a source of rewards, so a shopping trip is itself a lottery ticket. That is the missing half of "everything has upgrades" — the shop is not only a place upgrades come from, it is a place that pays you for using it.
verbs: Shop stock, The fleeing rare
pointers: [wiki:goldensun.fandom.com/Game Ticket] [gf:18461 §Notes on Artifacts, RocketTrekkieEvoli v1.6] [wiki:goldensun.fandom.com/Lucky Medal]
row: M271
- Game Tickets are often handed to the party for free by any vendor whenever it makes a particularly expensive purchase, and are used in the Lucky Wheels minigame in Tolbi [wiki:goldensun.fandom.com/Game Ticket]
- Lucky Medals are found in jars and crates, and dropped by enemies, primarily Mimics [wiki:goldensun.fandom.com/Lucky Medal]
- The guide lists both as artifact sources alongside chests, gifts and rare monster drops [gf:18461 §Notes on Artifacts, RocketTrekkieEvoli v1.6]
- All equipment won at the Fountains can be found nowhere else in the games, and each fountain has its own set [wiki:goldensun.fandom.com/Lucky Medal Fountains]
- The Wheels are where players of either game get most of their Boot, Shirt and Ring artifacts [wiki:goldensun.fandom.com/Lucky Wheels]

### Every weapon hides a second attack, and every artifact power can break
cat: Combat
how: Most weapon artifacts carry Unleashes — weapon-specific special attacks that fire at random when you choose Attack, each aligned to Earth, Fire, Wind or Water and often carrying a side effect. Separately, rings and many weapons and armours have a usable power that "may break if used in battle": a broken artifact keeps its stats but loses its power until a shop repairs it.
loop: equip a new weapon → discover what it unleashes by fighting with it → use its power → risk breaking it → pay a shop to make it whole
notes: Two ideas worth taking. First, the upgrade you buy is partly unknown until used, so equipment has something to reveal rather than just a number to compare — the reward for using a weapon is learning what it does. Second, breakage gives the shop a THIRD role beside selling and remembering: repair. Make sure a broken item still works as armour, as here, or breakage becomes a punishment for engaging with the system.
verbs: Mastery reveal
pointers: [gf:18461 §Weapon Artifacts, RocketTrekkieEvoli v1.6] [wiki:goldensun.fandom.com/Unleash] [gf:18461 §Notes on Artifacts, RocketTrekkieEvoli v1.6]
row: M272
- Most weapon artifacts have unleashes, hidden magic attacks that may be released when the weapon is used, based on Earth, Fire, Wind or Water and often carrying a secondary effect such as a status change or a stat drop [gf:18461 §Weapon Artifacts, RocketTrekkieEvoli v1.6]
- The wiki agrees an Unleash is a special attack used randomly when the Attack command is selected, and that it is weapon-specific, so changing weapon changes the Unleash available [wiki:goldensun.fandom.com/Unleash]
- A broken artifact still affects statistics in battle, but its special power cannot be used again until it is repaired at a shop [gf:18461 §Notes on Artifacts, RocketTrekkieEvoli v1.6]
- Cursed items cannot be unequipped until a Sanctum healer removes the curse, and carry a chance of being bound and unable to move for a turn; the Cleric's Ring blocks the binding but not the curse [gf:18461 §Notes on Artifacts, RocketTrekkieEvoli v1.6]
- Three weapons — Kusanagi, Masamune and Sol Blade — exist in the game's code but cannot be obtained in normal play [gf:18461 §Weapon Artifacts, RocketTrekkieEvoli v1.6]

## Minigame candidates

### Lucky Wheels (the slot machine paid for by shopping)
p: A slot machine above the Tolbi inn, played with Game Tickets earned by making expensive purchases. The player bets up to four tickets, which decides how many lines can score — one ticket scores the middle row only, four scores every row and both diagonals — then has five spins, holding whichever wheels they like between pulls, to line up the symbols for the prize they want.
r: Most of the game's Shirt, Boot and Ring artifacts, plus consumables; the three Shirts are the only body armour that can be worn UNDER other body armour.
l: The bet does not multiply a payout, it widens the board — so raising the stake buys more chances to hit the thing you are aiming at, and the player is choosing a prize rather than hoping for a number.
pointers: [wiki:goldensun.fandom.com/Lucky Wheels] [gf:18461 §Armor Artifacts, RocketTrekkieEvoli v1.6]
row: g093

| at | get | src |
|---|---|---|
| Bet 1 Game Ticket | scoring on the middle row only | [wiki:goldensun.fandom.com/Lucky Wheels] |
| Bet 2 Game Tickets | scoring on the middle three rows | [wiki:goldensun.fandom.com/Lucky Wheels] |
| Bet 3 Game Tickets | scoring on five rows | [wiki:goldensun.fandom.com/Lucky Wheels] |
| Bet 4 Game Tickets | scoring on all rows and the diagonals | [wiki:goldensun.fandom.com/Lucky Wheels] |
| Match a prize's symbols within the 5 spins — Shirts | Running Shirt, Silk Shirt, Mythril Shirt (worn under body armour) | [gf:18461 §Armor Artifacts, RocketTrekkieEvoli v1.6] |
| Match — Boots | Fur Boots, Quick Boots, Hyper Boots | [gf:18461 §Item Artifacts, RocketTrekkieEvoli v1.6] |
| Match — Rings | Adept Ring, War Ring, Sleep Ring | [gf:18461 §Item Artifacts, RocketTrekkieEvoli v1.6] |
| Match — consumables | Potion, Psy Crystal, Water of Life | [gf:18461 §Item Artifacts, RocketTrekkieEvoli v1.6] |

### The Tolbi Spring (throw a medal over your shoulder)
p: The player stands with their back to the fountain and throws a coin or a Lucky Medal backwards into it, aiming at a bullseye ringed by alternating targets. Where it lands decides the prize, and the closer to the centre the better. Turtles and crabs wander the water; hitting one deflects the throw badly, changes the creature's colour and speeds it up, with a third hit resetting it to its slowest.
r: A coin wins coins, up to 20. A Lucky Medal wins artifacts — a dozen weapons and armours available nowhere else in the game — banded by which ring it lands in.
l: The same throw pays on a gradient rather than hit-or-miss, so a bad throw still pays something and a perfect one is worth aiming for; and the moving obstacles mean skill and patience both matter without any stat being involved.
pointers: [wiki:goldensun.fandom.com/Lucky Medal Fountains] [gf:18461 §Notes on Artifacts, RocketTrekkieEvoli v1.6]
row: g094

| at | get | src |
|---|---|---|
| A coin landing within any target | coins, up to a maximum of 20 (a coin never wins items) | [wiki:goldensun.fandom.com/Lucky Medal Fountains] |
| Medal in the centre purple circle | Assassin Blade, Earth Shield or Spirit Armor | [wiki:goldensun.fandom.com/Lucky Medal Fountains] |
| Medal in the first yellow ring | Adept's Helm, Assassin Blade, Burning Axe, Cocktail Dress, Earth Shield, Spirit Armor | [wiki:goldensun.fandom.com/Lucky Medal Fountains] |
| Medal in the second purple ring | adds Glittering Tiara, Grievous Mace, Guardian Armlet | [wiki:goldensun.fandom.com/Lucky Medal Fountains] |
| Medal in the third yellow ring | Battle Gloves, Kimono, Ninja Hood and the commoner armours | [wiki:goldensun.fandom.com/Lucky Medal Fountains] |
| Medal in the fourth blank ring | the cheaper artifacts plus Potion, Psy Crystal, Water of Life | [wiki:goldensun.fandom.com/Lucky Medal Fountains] |
| Medal outside all rings | unlikely to be worth much | [wiki:goldensun.fandom.com/Lucky Medal Fountains] |
| Spring-exclusive pool (any ring) | Assassin Blade, Burning Axe, Grievous Mace, Spirit Armor, Kimono, Cocktail Dress, Earth Shield, Battle Gloves, Guardian Armlet, Adept's Helm, Ninja Hood, Glittering Tiara | [gf:18461 §Notes on Artifacts, RocketTrekkieEvoli v1.6] |

## Exploration & upgrade facts

### Hidden
- Lucky Medals are found in jars and crates all over the world, and dropped by enemies, primarily Mimics [wiki:goldensun.fandom.com/Lucky Medal]
- Artifacts are also, rarely, dropped by monsters after a battle — those are called Rare Item Drops and are harder to get than Antidotes, Nuts and Vials [gf:18461 §Notes on Artifacts, RocketTrekkieEvoli v1.6]

### Upgrades
- Most artifacts are unique and only one of each can be held, but Item Drops and Tolbi Springs items can be obtained more than once, and the Artifact List records how many of each have been listed [gf:18461 §Notes on Artifacts, RocketTrekkieEvoli v1.6]
- Armour covers four areas — head, body, arms, feet — one piece each, except the three Lucky Wheels Shirts which are worn under other body armour [gf:18461 §Armor Artifacts, RocketTrekkieEvoli v1.6]
- Five weapon classes (Long Sword, Light Blade, Axe, Mace, Staff) are split across the party, so a found weapon is also a statement about who it is for [gf:18461 §Weapon Artifacts, RocketTrekkieEvoli v1.6]

### Shops & exchange
- Artifacts are considerably more expensive than ordinary weapons and armour [gf:18461 §INTRODUCTION, RocketTrekkieEvoli v1.6]
- A shop repairs broken artifacts; a Sanctum healer removes curses — two services beyond buying and selling [gf:18461 §Notes on Artifacts, RocketTrekkieEvoli v1.6]

## Unverified or contradicted
- **The brief asked about a forge or crafting economy: this game has none.** No smith, no recipes and no material inputs appear anywhere in the Artifacts guide's explanation of where artifacts come from — the sources are chests, people, the two gambling venues and rare drops. Forging arrives in the sequel and was not researched here [gf:18461 §Notes on Artifacts, RocketTrekkieEvoli v1.6]
- The wiki's Tolbi Spring prize lists are given per ring without probabilities, and it says the RNG can be manipulated by save-and-reset in the first game; no odds were harvested and none are claimed [wiki:goldensun.fandom.com/Lucky Medal Fountains]
- The Lucky Wheels prize pool is assembled from the Artifacts guide's per-item source lines rather than from a payout table in the guide; the wiki confirms the Wheels are the main source of Boot, Shirt and Ring artifacts but lists no per-symbol table [gf:18461 §Item Artifacts, RocketTrekkieEvoli v1.6] [wiki:goldensun.fandom.com/Lucky Wheels]
- Coin values quoted beside spring and wheel items in the guide are shop PRICES for those artifacts, not payouts [gf:18461 §Notes on Artifacts, RocketTrekkieEvoli v1.6]

## Codex rows

```js
// Spliced into JRPG_Design_Codex.html on 2026-09-06 by
// scripts/splice_rows.mjs (the rows there are the source of truth; this is the map).
// M270  The Artifact List: a shop's stock is the permanent record of what you have found  Economy & Currency
// M271  Two token currencies, each with its own venue and its own exclusive gear          Economy & Currency
// M272  Every weapon hides a second attack, and every artifact power can break            Combat
// g093  Lucky Wheels (the slot machine paid for by shopping)                              rt: 8 rows
// g094  The Tolbi Spring (throw a medal over your shoulder)                               rt: 8 rows
```

## Codex delta
- (ids after the splice)
