# Xenogears — research digest

Codex: `Xenogears` (1998, PlayStation) · GameFAQs: `/ps/199365-xenogears` confirmed
2026-09-06 (the page's own Release line reads October 20, 1998) · digest started 2026-09-06

> Facts only, in our own words. Item names and numbers may be quoted; guide prose may not.
> Every fact carries a pointer: `[gf:<id> §<section>, <author> v<ver>]` or `[wiki:<host>/<Page>]`.

## Sources

| id | title | author | version | updated | category | KB | url |
|---|---|---|---|---|---|---|---|
| 4414 | Deathblow/Ability FAQ | Ranma | 1.2 | 01/13/1999 | In-Depth Guides | 14 | https://gamefaqs.gamespot.com/ps/199365-xenogears/faqs/4414 |
| 46377 | Deathblow Learning Guide | fidormula | 3rd ed. | 04/10/2008 | In-Depth Guides | 27 | https://gamefaqs.gamespot.com/ps/199365-xenogears/faqs/46377 |
| 58934 | Battle Mechanics FAQ | ForteGSOmega | 0.8 | 02/02/2010 | In-Depth Guides | 78 | https://gamefaqs.gamespot.com/ps/199365-xenogears/faqs/58934 |
| 50268 | Guide and Walkthrough (grep only) | Shotgunnova | — | — | Full Game Guides | 614 | https://gamefaqs.gamespot.com/ps/199365-xenogears/faqs/50268 |
| 4408 | Battling FAQ (versus mode) | Dan_GC | 1.2 | 04/16/1999 | In-Depth Guides | 53 | https://gamefaqs.gamespot.com/ps/199365-xenogears/faqs/4408 |

Coverage 4414: single page, 14,553 chars, 40 sections — 3 read at 100% (Introduction, the
Character DeathBlows rules block, Fei's list); greps: learn, combo, Gear/fuel, Ether, Gear
Options. Unread: the per-character Deathblow lists and the Gear Options catalogue, which are
enumerations, not rules.

Coverage 46377: single page, 27,778 chars, 14 sections — the preamble (54%) and the Basics
rules block (52%); greps: percent, numbered rules. Unread: Appendix 1's 11.7K
move-combination chart and the experience tables — player optimisation aids, not design
material.

Coverage 58934: single page, 77,952 chars, 166 sections — 3 read at 100% (Gear Parameters,
Gear Commands, Hyper Mode Mechanics) plus the Charger table; grep: fuel. Unread: the
per-character sections and the status/element chapters, ~160 sections.

Coverage 50268: **grep only, by design** — 588,346 chars, 114 sections, 0 sections read.
Nine greps (hyper mode, fuel, engine, battling, Kislev Battling, prize, fuel chart, the
sidequest anchor, and `BOSS: .*WIN:`) plus one 40-line `lines()` read at the arena. 75
sections over 800 chars unread, the largest 93K. A 614KB walkthrough is a lookup table, not
a document to read.

Coverage 4408: single page, 53,970 chars, 67 sections — 2 read (the contents/copyright
block, the mode-settings block); greps: money, unlock, matches, rank, prize, fuel. **Result:
this guide documents an unlockable versus mode, not the story arena** — zero money matches
in the whole file. Recorded and moved on.

Triage (2026-09-06, `__gf.triage()` on 50 guides): the strongest In-Depth list of the
rollout — two independent Deathblow guides, a Battle Mechanics FAQ, two Battling guides, a
Character FAQ and a 159KB Debug Room guide, all above seven full walkthroughs. The headline
mechanic's cross-check is therefore internal to GameFAQs.

## Mechanics candidates

### Deathblows: a combo alphabet where every press is quietly training a different move
cat: Combat
how: Each character has exactly seven moves — four Triangle (T1–T4), two Square (S1, S2) and one X — and which one comes out depends on the PREVIOUS press, not the current one, so the same button is a different move in a different position. Deathblows are named button strings, and you learn one by accumulating hidden experience on each of its component moves during ordinary fighting. Nothing is bought or taught: the combos you happen to favour become the combos you own.
loop: fight normally → the presses you make train the individual moves beneath them → a named Deathblow fills toward 100% → it becomes a move worth spending AP on
notes: The training is invisible and continuous, so a player who never thinks about it still unlocks things while a player who reads the table can steer it — that is the right shape for a mastery system. Two details are worth copying whole. Pressing a learned Deathblow's finisher earns that move NOTHING, so mastery pushes you off what you just mastered and onto the next string. And the on-screen percentage splits equally across a Deathblow's component moves even though their real costs differ by an order of magnitude, so the bar is an honest ordering and a dishonest estimate — copy that only on purpose.
verbs: Mastery reveal
pointers: [gf:46377 §Basics, fidormula 3rd ed.] [gf:4414 §Character DeathBlows, Ranma v1.2]
row: M276
- Each character has seven unique moves: four for Triangle, two for Square, one for X [gf:46377 §Basics, fidormula 3rd ed.]
- Which move a press produces depends on the previous one — after T3 the next attack is T4, S2 or X — so combinations, not single buttons, decide what gets trained [gf:46377 §Basics, fidormula 3rd ed.]
- Each move carries its own hidden experience total; Fei's full requirement across (T1,T2,T3,T4,S1,S2,X) is (440, 340, 100, 50, 310, 90, 430) [gf:46377 §Basics, fidormula 3rd ed.]
- Everyone starts at zero move experience even if they already have Deathblows; only Emeralda begins part-trained, at (230, 180, 90, 40, 150, 80, 195) [gf:46377 §Basics, fidormula 3rd ed.]
- X earns no experience on the press that TRIGGERS a Deathblow, so a learned string stops training its own finisher; reversing the order — XTTS for TTSX — uses the same moves without triggering and keeps training [gf:46377 §Basics, fidormula 3rd ed.]
- Learning rate is a flat per-character multiplier: Fei 1, Citan 2, Elly 3, Bart 3, Rico 3, Billy 4, Emeralda 1; a Wizardry Ring adds two to it, non-cumulative [gf:46377 §Basics, fidormula 3rd ed.]
- The status-screen percentage splits equally across the required moves regardless of real cost: Fuukei needs 5 moves so each is worth 20%, though T1 needs 240 experience and T4 needs 50 [gf:46377 §Basics, fidormula 3rd ed.]
- Experience is credited even when a move MISSES, and is not lost by calling a Gear, running from battle, or finishing at 0 HP — only a Game Over discards it [gf:46377 §Basics, fidormula 3rd ed.]
- Two gates sit on top: some Deathblows need 7 AP per turn to be learned at all (available after the Generator Battles in Shevat), and some, though 100% learned, stay unusable until a level — Fei's Kokei waits for Level 70 [gf:4414 §Character DeathBlows, Ranma v1.2]
- Fei's six elemental Deathblows each cost 7 AP and carry Wind, Earth, Fire, Water, Light or Darkness [gf:4414 §Fei Fong Wong, Ranma v1.2]
- Chu-Chu and Maria have no Deathblows at all [gf:46377 §Basics, fidormula 3rd ed.]

### Gears: a machine whose stats are parts, and whose fuel is a turn you choose not to attack
cat: Progression & Upgrades
how: A Gear has no experience of its own. Its Attack is the Gear's own multiplier times the Engine's Output, its Defence comes only from Armour and accessories, and its Response is added straight onto the PILOT's hit and evade — so the character's growth passes through the machine rather than being replaced by it. Upgrades are named parts in three slots (Engine, Frame, Armour) plus accessories, bought rather than levelled. Fuel is the running cost: Booster spends 2% of maximum per round to stay fast, and Charge buys fuel back with a turn while halving physical damage.
loop: earn money → buy a better Engine, Frame or Armour → your pilot's own numbers flow through the new part → spend fuel to go fast, spend a turn to get it back
notes: Two things to steal. First, the vehicle MULTIPLIES the pilot instead of replacing them (Gear hit% = character hit% + Response; the Ether amp multiplies the character's own Ether), so time spent on foot is never wasted and the mech is a lens rather than a second character sheet. Second, fuel makes speed a decision with a price, and the refill is itself a defensive stance — the "wasted" turn buys guard as well as fuel, so the economy and the combat read as one system. Note also that the status effects mirror across scales: Poison on foot is a Fuel Leak in a Gear.
verbs: Shop stock, Traded
pointers: [gf:58934 §Gear Parameters, ForteGSOmega v0.8] [gf:50268 §TH' BASICS, Shotgunnova] [gf:4414 §Gear Options, Ranma v1.2]
row: M277
- Attack is the Gear's Attack Multiplier times the Engine's Output — Xenogears has a multiplier of 12 and its X70-8000 engine 70 Output, giving 840 — plus a weapon's own Attack if one is carried [gf:58934 §Gear Parameters, ForteGSOmega v0.8]
- Defence depends solely on the Armour and accessories equipped; Ether Defence is the Armour's plus the character's own [gf:58934 §Gear Parameters, ForteGSOmega v0.8]
- Response is added to the pilot's numbers: Gear hit% = character hit% + Response, evade% = character evade% + Response/2, so three MagneticCoats and 13 character evade give the Gear 50% evade [gf:58934 §Gear Parameters, ForteGSOmega v0.8]
- The Ether amp multiplies the character's own Ether stat by EtherAmp/4 [gf:58934 §Gear Parameters, ForteGSOmega v0.8]
- Weight changes nothing directly, but a heavier Gear carries heavier accessories without losing Agility [gf:58934 §Gear Parameters, ForteGSOmega v0.8]
- The walkthrough lists the upgrade slots by name per character — Fei starts with a G4-1200 Engine, WELT-01800 Frame and MS 3 Armor; Elly with V15-2000, VIER-01500, MS 15 — confirming parts, not levels [gf:50268 §TH' BASICS, Shotgunnova]
- Booster induces SpeedUp but drains 2% of maximum Fuel every round it stays on, including the round it was switched on [gf:58934 §Gear Commands, ForteGSOmega v0.8]
- Charge restores Fuel by Attack Level and simultaneously guards, halving physical damage with 95% probability [gf:58934 §Gear Commands, ForteGSOmega v0.8]
- The Charger accessories multiply that refill enormously — at Attack Level 0 it is 30 without one, 50 with an A Charger, 100 with S, 200 with X and 500 with Z; each Attack Level adds a further 20 [gf:58934 §Gear Commands, ForteGSOmega v0.8]
- The Gear screen shows FL as current and maximum fuel capacity, and the status ailments mirror the on-foot ones — Poison on foot is Fuel Leak in a Gear [gf:50268 §TH' BASICS, Shotgunnova]
- DeathBlower accessories grant an extra Gear Deathblow at Attack Level 1 that costs less fuel than normal [gf:50268 §FAQ, Shotgunnova]

### Hyper Mode: the odds of your best state rise as your health falls
cat: Combat
how: Beyond the three Attack Levels sits a fourth, Hyper Mode, whose attacks are stronger AND cheaper in fuel, and in which Charge refills ten times as much. You cannot buy it or trigger it directly: reach Attack Level 3, take an action that does not spend it, and the game rolls against a percentage built from two things — how much damage you have taken, and which Deathblows you have been using.
loop: land Deathblows to bank Hyper Mode Points → get hurt, which multiplies them → hold at Attack Level 3 → roll into a mode that is both stronger and cheaper
notes: A comeback mechanic with its arithmetic in the open. The multiplier is literally the fraction of your health that is missing, so the mode is likeliest exactly when you are losing — and because heavier Deathblows bank more points (XX is worth six, TT worth one), the player who has been swinging big is the one who gets rescued. Worth stealing as a shape: make the emergency power a FUNCTION of the trouble rather than a button, and let the player's earlier choices weight the dice. The two hard-coded exceptions are instructive too — one Gear can never enter it, and the endgame Gear is always at 99%.
verbs: Mastery reveal, Consequence
pointers: [gf:58934 §Hyper Mode Mechanics, ForteGSOmega v0.8] [gf:50268 §FAQ, Shotgunnova]
row: M278
- Hyper Mode attacks are stronger than Attack Level 3 attacks and cost less fuel, and Charge restores 1000% of its normal amount while in it [gf:58934 §Hyper Mode Mechanics, ForteGSOmega v0.8]
- At full HP the modifier is a small positional constant plus one — 0 for the first party slot, 1 for the second, 2 for the third; below full HP it becomes (MaxHP − CurrentHP) × 10 / MaxHP, floored at 1 [gf:58934 §Hyper Mode Mechanics, ForteGSOmega v0.8]
- The final chance is (Hyper Mode Points + 5) × that modifier, rolled against 0–99 [gf:58934 §Hyper Mode Mechanics, ForteGSOmega v0.8]
- Only Deathblows bank Hyper Mode Points, and heavier ones bank more: TT and TS 1; TX, ST and SS 2; XT and XS 3; SX 4; XX 6. They reset on entering Hyper Mode or ending the battle [gf:58934 §Hyper Mode Mechanics, ForteGSOmega v0.8]
- Entry requires Attack Level 3 followed by an action that does not reduce it — a plain attack, Item, Ether, Booster, Charge or even a failed Escape [gf:58934 §Hyper Mode Mechanics, ForteGSOmega v0.8]
- Two hard-coded exceptions: swordless Heimdal can never enter it (0%), and Xenogears is always at 99% [gf:58934 §Hyper Mode Mechanics, ForteGSOmega v0.8]
- The walkthrough confirms the player-facing side: build to Attack Level 3 and read the Hyper Mode percentage shown on the right of the battle screen; it also notes Ether attacks work as the AL-preserving action [gf:50268 §FAQ, Shotgunnova]

## Minigame candidates

### The Kislev Battling arena (a real-time fighting ladder paid by speed and cleanliness)
p: Kislev's arena is a real-time one-on-one Gear fight with its own control scheme rather than a menu battle — Square attacks in a three-hit chain, Triangle jumps, O dashes, L1 guards, R1 fires ether bullets, and pausing offers GIVE UP. Register with the receptionist for two daily matches and climb a fixed ladder of opponents. Retries are unlimited.
r: A fixed purse per opponent, rising from 300G to 2,500G up the ladder, plus a separate bonus of 100–1,000G earned by winning fast and taking little damage — including the damage Fei does to himself by overheating.
l: Splitting the reward into a flat purse and a performance bonus lets the same fight pay a beginner and still have something left to chase; and because the bonus counts damage TAKEN, the skill it rewards is defence rather than speed alone.
pointers: [gf:50268 §Kislev Battling, Shotgunnova] [gf:4408 §Battling, Dan_GC v1.2]
row: g096

| at | get | src |
|---|---|---|
| Beat Tin Robo | 300 G, plus a 100–200 G bonus | [gf:50268 §Kislev Battling, Shotgunnova] |
| Beat Titan | 500 G, plus a 200–300 G bonus | [gf:50268 §Kislev Battling, Shotgunnova] |
| Beat W Shaver | 750 G, plus a 200–300 G bonus | [gf:50268 §Kislev Battling, Shotgunnova] |
| Beat Musha | 1,000 G, plus a 300–400 G bonus | [gf:50268 §Kislev Battling, Shotgunnova] |
| Beat Hamamoto | 1,500 G, plus a 400–500 G bonus | [gf:50268 §Kislev Battling, Shotgunnova] |
| Beat Firewheel | 2,000 G, plus a 500–600 G bonus | [gf:50268 §Kislev Battling, Shotgunnova] |
| Beat Silverstar | 2,500 G, plus an 800–1,000 G bonus | [gf:50268 §Kislev Battling, Shotgunnova] |
| How the bonus is earned | Speed of the win and how little damage you took, counting Fei's own overheating damage | [gf:50268 §Kislev Battling, Shotgunnova] |
| Losing | Unlimited retries; the story fights against Ganador and Stier carry no purse | [gf:50268 §Kislev Battling, Shotgunnova] |

## Exploration & upgrade facts

### Upgrades
- Gear parts are sold at the arena itself — Hammer's stock is available between Battling matches [gf:50268 §Kislev Battling, Shotgunnova]
- Gears carry installable "options" paid for in Fuel rather than AP or EP; Weltall's Fix Frame HP restores a percentage of Gear HP for no fuel [gf:4414 §Gear Options, Ranma v1.2]

### Shops & exchange

Nothing further read this pass; the walkthrough's shop appendix was not opened.

## Unverified or contradicted
- **The two "Battling" things are not the same thing.** Guide 4408 documents an unlockable versus mode — Player vs Com, Player vs Player, a Com-vs-Com demo, match counts, difficulty and a Rubber Band setting — with no money anywhere in its 54KB. The story arena in Kislev, with the purses above, is a separate sidequest documented in the walkthrough. Do not let the name merge them [gf:4408 §Special Mode 1, Dan_GC v1.2] [gf:50268 §Kislev Battling, Shotgunnova]
- The purse and bonus figures come from one guide; no second source was found tabulating them, and the bonus is quoted as a range rather than a formula [gf:50268 §Kislev Battling, Shotgunnova]
- The learning guide's Appendix 4 asserts a correlation between on-foot and Gear Deathblow learning (TT teaches TX, TS teaches TTX); only its heading and first lines were read and nothing confirms it [gf:46377 §Appendix 4, fidormula 3rd ed.]
- The Xeno-series wiki (`xenosaga.fandom.com`) has a Gear page, but it is lore — origin, history, Omnigears — and carries none of the stat or fuel mechanics, so it could not serve as a cross-check [wiki:xenosaga.fandom.com/Gear]

## Codex rows

```js
// Spliced into JRPG_Design_Codex.html on 2026-09-06 by
// scripts/splice_rows.mjs (the rows there are the source of truth; this is the map).
// M276  Deathblows: a combo alphabet where every press is quietly training a different move        Combat
// M277  Gears: a machine whose stats are parts, and whose fuel is a turn you choose not to attack  Progression & Upgrades
// M278  Hyper Mode: the odds of your best state rise as your health falls                          Combat
// g096  The Kislev Battling arena (a real-time fighting ladder paid by speed and cleanliness)      rt: 9 rows
```

## Codex delta
- (ids after the splice)
