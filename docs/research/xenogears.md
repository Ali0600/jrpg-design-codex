# Xenogears — research digest

Codex: `Xenogears` (1998, PlayStation) · GameFAQs: `/ps/199365-xenogears` confirmed
2026-09-06 (the page's own Release line reads October 20, 1998) · digest started 2026-09-06

> Facts only, in our own words. Item names and numbers may be quoted; guide prose may not.
> Every fact carries a pointer: `[gf:<id> §<section>, <author> v<ver>]` or `[wiki:<host>/<Page>]`.

## Sources

| id | title | author | version | updated | category | KB | url |
|---|---|---|---|---|---|---|---|
| 4414 | Deathblow/Ability FAQ | Ranma | 1.2 | 01/13/1999 | In-Depth Guides | 14 | https://gamefaqs.gamespot.com/ps/199365-xenogears/faqs/4414 |
| 46377 | Deathblow Learning Guide | fidormula | 3rd ed. (04/10/2008) | — | In-Depth Guides | 27 | https://gamefaqs.gamespot.com/ps/199365-xenogears/faqs/46377 |

Coverage 4414: single page, 14,553 chars, 40 sections — 3 read at 100% (Introduction,
Character DeathBlows rules block, Fei's list); greps: learn, times/combo, Gear/fuel, Ether,
Gear Options. Unread: the per-character Deathblow lists (~800 chars each) and the full Gear
Options catalogue, which are enumerations rather than rules.

Coverage 46377: single page, 27,778 chars, 14 sections — the preamble (54%) and the rules
block (52%) read; greps: %, numbered rules. Unread: Appendix 1's 11.7K move-combination
chart and the experience tables, which are optimisation tables for a player, not design
material.

Triage (2026-09-06, `__gf.triage()` on 50 guides): an unusually strong In-Depth list —
Deathblow/Ability FAQ, Deathblow Learning Guide, Battle Mechanics FAQ (78KB), Battling FAQ
(53KB), Battling Special Mode 2 Guide, Character FAQs, and a 159KB Debug Room guide, all
above the seven full walkthroughs. **Two independent guides cover the Deathblow system**, so
the cross-check for this game's headline mechanic is internal to GameFAQs.

## Mechanics candidates

### Deathblows: a combo alphabet where every button press is quietly training a different move
cat: Combat
how: Each character has exactly seven moves — four Triangle (T1–T4), two Square (S1, S2) and one X — and which one comes out depends on the PREVIOUS press, not the current one, so the same button is a different move in a different position. Deathblows are named button strings (Fei's Senretsu is T,T,X), and you learn one by accumulating hidden experience on each of its component moves in ordinary fighting. Nothing is bought or taught: the combos you happen to favour are the combos you end up owning.
loop: fight normally → the presses you make train the individual moves under them → a named Deathblow fills toward 100% → it becomes a move you can spend AP on
notes: The transferable idea is that the training is INVISIBLE and continuous — a player who never thinks about it still unlocks things, while a player who reads the table can steer it. Two details worth copying whole: pressing a learned Deathblow's finisher stops training that move, so mastery makes you switch away from what you just mastered; and the on-screen percentage weights every component move equally even though their real costs differ by an order of magnitude, so the bar is an honest ordering and a dishonest estimate. If you copy the second, do it on purpose.
verbs: Mastery reveal
pointers: [gf:46377 §Basics, fidormula 3rd ed.] [gf:4414 §Character DeathBlows, Ranma v1.2]
row: M+1
- Each character has seven unique moves: four for Triangle, two for Square and one for X [gf:46377 §Basics, fidormula 3rd ed.]
- Which move a press produces depends on the previous one — after T3 the next attack is T4, S2 or X — so combinations, not single buttons, decide what is trained [gf:46377 §Basics, fidormula 3rd ed.]
- Each move carries its own hidden experience total; Fei's full requirement across (T1,T2,T3,T4,S1,S2,X) is (440, 340, 100, 50, 310, 90, 430) [gf:46377 §Basics, fidormula 3rd ed.]
- Everyone starts at zero move experience even if they already have Deathblows; only Emeralda begins part-trained, at (230, 180, 90, 40, 150, 80, 195) [gf:46377 §Basics, fidormula 3rd ed.]
- X earns no experience on the press that TRIGGERS a Deathblow, so a learned string stops training its own finisher; reversing the order (XTTS for TTSX) uses the same moves without triggering, and keeps training [gf:46377 §Basics, fidormula 3rd ed.]
- Learning rate is a flat per-character multiplier — Fei 1, Citan 2, Elly 3, Bart 3, Rico 3, Billy 4, Emeralda 1 — and a Wizardry Ring adds two to it, non-cumulative [gf:46377 §Basics, fidormula 3rd ed.]
- The status-screen percentage splits equally across a Deathblow's required moves regardless of their real cost: Fuukei needs 5 moves so each is worth 20%, though T1 needs 240 experience and T4 needs 50 [gf:46377 §Basics, fidormula 3rd ed.]
- Experience is credited even when a move MISSES, and is not lost by calling a Gear, running from the battle, or finishing it at 0 HP — only a Game Over discards it [gf:46377 §Basics, fidormula 3rd ed.]
- Two gates sit on top of learning: some Deathblows need 7 AP per turn to be learned at all (available after the Generator Battles in Shevat), and some, though 100% learned, stay unusable until a character level — Fei's Kokei waits for Level 70 [gf:4414 §Character DeathBlows, Ranma v1.2]
- Chu-Chu and Maria have no Deathblows at all [gf:46377 §Basics, fidormula 3rd ed.]

## Minigame candidates

(pending — the Battling FAQ is the next read)

## Exploration & upgrade facts

### Upgrades
- The elemental Deathblows are the expensive tier: Fei's Fukei, Chikei, Kakei, Suikei, Kokei and Yamikei each cost 7 AP and carry an element [gf:4414 §Fei Fong Wong, Ranma v1.2]
- Gears carry installable "options" paid for in Fuel rather than AP or EP — Weltall's Fix Frame HP restores a percentage of Gear HP for no fuel [gf:4414 §Gear Options, Ranma v1.2]

## Unverified or contradicted
- The learning guide's Appendix 4 asserts a correlation between on-foot and Gear Deathblow learning (pressing TT teaches TX, TS teaches TTX); only its heading and first two lines were read, and no second source has confirmed it [gf:46377 §Appendix 4, fidormula 3rd ed.]

## Codex rows

```js
// pending — written once the Battling and Gear reads are done
```

## Codex delta
- (ids after the splice)
