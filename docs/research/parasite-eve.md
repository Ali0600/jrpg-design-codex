# Parasite Eve — research digest

Codex: `Parasite Eve` (1998, PlayStation) · GameFAQs: `/ps/198265-parasite-eve` confirmed
2026-09-06 (the page's own Release line reads September 9, 1998) · digest started 2026-09-06

> Facts only, in our own words. Item names and numbers may be quoted; guide prose may not.
> Every fact carries a pointer: `[gf:<id> §<section>, <author> v<ver>]` or `[wiki:<host>/<Page>]`.

## Sources

| id | title | author | version | updated | category | KB | url |
|---|---|---|---|---|---|---|---|
| 50263 | Game Mechanic Guide | PrinceThrakhath | 1.1 | 09/28/2007 | In-Depth Guides | 56 | https://gamefaqs.gamespot.com/ps/198265-parasite-eve/faqs/50263 |
| 4082 | EX Mode Guide | KWee | 1.6 | 10/06/1999 | In-Depth Guides | 62 | https://gamefaqs.gamespot.com/ps/198265-parasite-eve/faqs/4082 |

Coverage 50263: single page, 56,172 chars, 48 sections — 3 read (What is a toolkit or super
toolkit 100%, the reward table 54%, How are my bonus points determined 100%, plus the
Chrysler Building mechanics section); greps: tool, super tools. Unread: the maximum-stats
and best-attributes chapters (5.5K and 3.8K) and the per-round weapon tables — optimisation
material rather than rules.

Coverage 4082: single page, 61,768 chars, 62 sections — 0 sections read; five greps
(toolkit, bonus point, floors/sections, rare card, junk) plus two `lines()` reads at the
junk secret. 24 sections over 800 chars unread — this guide is a floor-by-floor EX-mode
walkthrough, and it was used purely as an independent check on the other guide's claims.

Triage (2026-09-06, `__gf.triage()` on 37 guides): a Secrets Guide, a Game Mechanic Guide,
**three separate EX Mode guides** (KWee 62KB, DKusama 27KB, WAvalon 7KB), three Chrysler
Building guides, an Inventory List and a Level 38 Trick FAQ — all above the two
walkthroughs. A game whose community documented its NG+ far more thoroughly than its story.

## Mechanics candidates

### Bonus Points: a reward for the fight, discounted by how much the fight hurt
cat: Meta & Replayability
how: Every monster carries a fixed Bonus Point value and a separate "BP damage" value. What you actually bank when you level is the creature's BP minus its BP-damage figure times the number of times it wounded you — so the same enemy pays a clean fighter more than a mauled one. Neither the number of battles nor how fast you win changes anything. On top of that sit fixed awards: a set amount for each day survived in the EX round, and a lump sum for finishing the game.
loop: fight well rather than often → bank BP the enemy did not claw back → level up and collect → spend it carrying your character into the next round
notes: The important inversion is that the meta-currency is not a participation trophy — it is discounted by damage taken, so it rewards playing WELL rather than playing MORE, and grinding is explicitly worthless because battle count does not enter the formula. Compare Xenogears' arena bonus, which uses the same idea in a single fight (M276–M278's game). If the owner wants a NG+ currency, this is the shape: pay for quality, cap the farm by making quantity irrelevant, and publish a fixed schedule for the milestones so the player can plan a run.
verbs: Consequence, Mastery reveal
pointers: [gf:50263 §How are my bonus points determined, PrinceThrakhath v1.1] [gf:4082 §Final Encounter, KWee v1.6]
row: M279
- BP arrive on three occasions: levelling up, finishing a round, and finishing a day in the EX round [gf:50263 §How are my bonus points determined, PrinceThrakhath v1.1]
- The level-up award is the sum over every monster fought since the last level of that creature's BP minus its BP-damage value times the number of times it wounded you [gf:50263 §How are my bonus points determined, PrinceThrakhath v1.1]
- The number of battles and the speed of each battle have no influence on the BP pool at all [gf:50263 §How are my bonus points determined, PrinceThrakhath v1.1]
- Certain creatures in special locations carry different BP, BP-damage and experience values from others of the same kind — the first scorpion in the museum among them [gf:50263 §How are my bonus points determined, PrinceThrakhath v1.1]
- The EX-round day awards are fixed and rise: 800 for day 1, 1,200 for day 2, 2,000 for days 3 and 4, and 3,000 for day 5 [gf:50263 §How are my bonus points determined, PrinceThrakhath v1.1]
- Letting the ending credits run to the end after the final battle awards 3,000 bonus points for completion, and then prompts a save [gf:4082 §Final Encounter, KWee v1.6]

### Wayne's counters: two collections nobody asks you for, each converted into permanence
cat: Exploration & Rewards
how: The gunsmith Wayne pays attention to two running totals that no quest ever mentions. Bring him 300 pieces of junk — the worthless clutter picked up all game — and he lets you choose an Ultimate Weapon. Separately, use the rare trading cards looted from the Chrysler Building's storage rooms enough TIMES on your gear, then ask to see his rare-card collection, and he hands over a toolkit or super toolkit: an item that makes tools or super tools effectively infinite, where super tools are otherwise limited to about two to four a round.
loop: hoard what looks like litter → hand it over unprompted → a permanent upgrade the shop never advertised → and store it with Wayne before the last fight so it survives into the next round
notes: Two rewards for behaviour rather than for objectives, which is exactly the owner's pillar — the game never sets "collect 300 junk" as a task, so finding it is a discovery rather than a checklist item. The toolkit is the more interesting of the two because it converts a SCARCITY into an infinity: the tuning system's whole difficulty is rationing super tools, and the reward for exploring the tower is that the rationing stops. Note the trap worth copying deliberately or avoiding: the counter is on card USES, not cards owned, and a card can be spent twice — so a player who hoards rather than spends never triggers it.
verbs: Traded, The fleeing rare
pointers: [gf:50263 §What is a toolkit or super toolkit, PrinceThrakhath v1.1] [gf:4082 §Secrets, KWee v1.6]
row: M280
- A toolkit or super toolkit sets the count of tools or super tools to 999 while held, effectively infinite, and ordinary tools in the inventory are not consumed while a kit is equipped [gf:50263 §What is a toolkit or super toolkit, PrinceThrakhath v1.1]
- Super tools are otherwise severely limited: seven are theoretically obtainable in round 1, but two to four is the realistic count [gf:50263 §Where do I get super tools, PrinceThrakhath v1.1]
- The kits come only from the EX round, by looting rare trading cards from the Chrysler Building's storage rooms and using them on weapons and armour at Wayne's [gf:50263 §What is a toolkit or super toolkit, PrinceThrakhath v1.1]
- A rare card adds two slots to one item, or one slot each to two items, and what the reward counts is how many times cards have been USED, not how many were found or held [gf:50263 §What is a toolkit or super toolkit, PrinceThrakhath v1.1]
- Wayne's collection can only be viewed from day 4, after the police department is cleared and Ben is saved [gf:50263 §What is a toolkit or super toolkit, PrinceThrakhath v1.1]
- The earliest a fifth rare card, and so a toolkit, can be had is floors 21–30; the earliest a super toolkit is floors 31–40 [gf:50263 §What is a toolkit or super toolkit, PrinceThrakhath v1.1]
- Taking the toolkit first does not block the super toolkit, but once the super toolkit is taken the regular one can never be obtained [gf:50263 §What is a toolkit or super toolkit, PrinceThrakhath v1.1]
- A kit must be STORED with Wayne before the final battle to be retrievable on day 2 of the next round; kept in the inventory it does not survive [gf:50263 §What is a toolkit or super toolkit, PrinceThrakhath v1.1]
- The second guide describes the same two rewards in its own words — the super tool kit as a limitless supply of super tools and the tool kit as the same for normal tools [gf:4082 §Secrets, KWee v1.6]
- 300 junk must be collected before Wayne will let you pick an Ultimate Weapon, which is then customised with abilities; the guide's own pick is the rifle [gf:4082 §Secrets, KWee v1.6]

## Minigame candidates

None. This game has no arena, casino or scored side activity: the guide list is EX-mode
walkthroughs, Chrysler Building maps, an inventory list and a story FAQ. Recorded rather
than padded.

## Exploration & upgrade facts

### Hidden
- The Chrysler Building's floors 1–9 of each section are drawn at random from 107 predefined layouts, re-rolled every time the player enters the building, so mapping them is pointless [gf:50263 §Chrysler Building mechanics, PrinceThrakhath v1.1]
- Armory CONTENTS are drawn from 70 predefined layouts, ten per section, and are rolled only on the first entry — so a missed armory can be looted later in the same round even though the map around it has changed [gf:50263 §Chrysler Building mechanics, PrinceThrakhath v1.1]
- Boss floors and the whole of section 8 use fixed maps, so those are worth memorising while the others are not [gf:50263 §Chrysler Building mechanics, PrinceThrakhath v1.1]
- Items belonging to a section's armories reappear in that same section in another round, though not necessarily on the same floor [gf:50263 §Chrysler Building mechanics, PrinceThrakhath v1.1]

### Upgrades
- The building is 77 floors: seven sections of ten plus a final section of seven, with a boss on every tenth floor and on floor 77 [gf:50263 §Chrysler Building mechanics, PrinceThrakhath v1.1] [gf:4082 §Chrysler Building, KWee v1.6]
- Every floor in sections 1–7 contains an armory; each section has its own enemies and its own music, and section 8 is empty of enemies except the final boss [gf:50263 §Chrysler Building mechanics, PrinceThrakhath v1.1]
- **The building alone does not reset between rounds**: bosses beaten in an earlier round stay beaten, and the enemies and armory items on those floors are gone [gf:50263 §Chrysler Building mechanics, PrinceThrakhath v1.1]
- Rare trading cards are found through the tower, two per ten-floor stretch in the early sections — P38 on floors 1–10, Kasul and Bhawk on 11–20, Ppks and M1 on 21–30 [gf:4082 §Chrysler Building, KWee v1.6]

## Unverified or contradicted
- **The two guides disagree on the toolkit threshold, and one explains the other's error.** PrinceThrakhath states 14 card USES and a minimum of 7 cards for the super toolkit, and says commercial guides wrongly print 14 and 10 because they confuse the number of cards with the number of times cards can be used — a card used on two separate items counts twice. KWee's guide gives the figures PrinceThrakhath calls wrong: "the whole 14 rare TCs" for the super tool kit and "only 12 or so" for the tool kit. The codex follows the use-count reading and records both [gf:50263 §What is a toolkit or super toolkit, PrinceThrakhath v1.1] [gf:4082 §Secrets, KWee v1.6]
- The junk total (300) and the Ultimate Weapon reward come from one guide; the other guide has a section on the same secret which was not read [gf:4082 §Secrets, KWee v1.6]
- The BP formula, the EX-day schedule and every Chrysler Building randomisation rule come from a single guide; the second source confirms the building's shape and the completion bonus but not the arithmetic [gf:50263 §How are my bonus points determined, PrinceThrakhath v1.1]

## Codex rows

```js
// Spliced into JRPG_Design_Codex.html on 2026-09-06 by
// scripts/splice_rows.mjs (the rows there are the source of truth; this is the map).
// M279  Bonus Points: a reward for the fight, discounted by how much the fight hurt            Meta & Replayability
// M280  Wayne's counters: two collections nobody asks you for, each converted into permanence  Exploration & Rewards
```

## Codex delta
- (ids after the splice)
