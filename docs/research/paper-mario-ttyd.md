# Paper Mario: The Thousand-Year Door — research digest

Codex: `Paper Mario: The Thousand-Year Door` (2004, GameCube; the codex scores the Switch
remake) · GameFAQs: `/gamecube/920182-paper-mario-the-thousand-year-door` confirmed
2026-09-06 (the page's own Release line reads October 11, 2004) · digest started 2026-09-06

> Facts only, in our own words. Item names and numbers may be quoted; guide prose may not.
> Every fact carries a pointer: `[gf:<id> §<section>, <author> v<ver>]` or `[wiki:<host>/<Page>]`.

## Sources

| id | title | author | version | updated | category | KB | url |
|---|---|---|---|---|---|---|---|
| 33039 | Badge FAQ | Fullgore_EXE | 8 | 10/26/2004 | In-Depth Guides | 28 | https://gamefaqs.gamespot.com/gamecube/920182-paper-mario-the-thousand-year-door/faqs/33039 |
| 34937 | Glitz Pit Guide | MarsJenkar | — | — | In-Depth Guides | 118 | https://gamefaqs.gamespot.com/gamecube/920182-paper-mario-the-thousand-year-door/faqs/34937 |
| wiki | Glitz Pit · Charlieton · Star Piece (Paper Mario series) | — | — | — | www.mariowiki.com | — | https://www.mariowiki.com/Glitz_Pit |

Coverage 33039: single page, 28,477 chars, 31 sections — 2 read at 100% (Reading this FAQ,
Badge List/Summary); greps: Star Piece, Merlow/Charlieton/Dazzle, BP cost, Trouble Center.
Unread: the four per-badge catalogue sections (III–VI, ~16K chars), which are one-badge
entries; the vendor price tables in §VII were what this pass needed.

Coverage 34937: single page, 119,187 chars, 160 sections — 2 read (Definitions ~40%, Battle
Restrictions ~25%); greps: coins/prize/reward, rank, belt. Unread: the whole
opponent-by-opponent walkthrough, ~100 sections. The guide is a strategy guide and carries
no payout table, so the prize ladder came from MarioWiki instead — recorded rather than
inferred.

Triage (2026-09-06, `__gf.triage()` on 49 guides): the strongest In-Depth list of the rollout
so far — an Enemy Item/Badge Drop FAQ scoring 9, a Completion Guide, an Item FAQ, a Glitz Pit
Guide and two badge guides all above every walkthrough.

## Mechanics candidates

### 100 hidden Star Pieces are the currency that buys your build
cat: Exploration & Rewards
how: Star Pieces are hidden throughout the world — some buried, needing a Spin Jump or the Ultra Hammer to dig up — and also handed out as sidequest rewards. There are 100 in the game and they are not money: their one use is trading with Dazzle in Rogueport Underground, who exchanges them for badges at fixed prices from 1 to 15 pieces. A fortune teller, Merluvlee, will sell you the location of ones you have missed.
loop: search scenery and floors for a hidden star → carry the pieces to one NPC in the sewers → convert them into the badges your build is made of → a fortune teller sells you the rest
notes: The cleanest exploration-to-power pipeline in the codex: a collectible with exactly one sink, and that sink is the build system. Because the price list is fixed and public, the player can plan a hunt for a specific badge, which turns idle searching into a shopping trip with a goal. The fortune teller is the anti-frustration valve — pay money to convert "somewhere in the world" into "here" — and it is worth copying alongside the hunt, not instead of it.
verbs: Latent geometry, Tool-gated, Traded
pointers: [wiki:www.mariowiki.com/Star Piece (Paper Mario series)] [gf:33039 §Badge List/Summary, Fullgore_EXE v8]
row: M273
- Star Pieces are found in hidden locations, some underground where a Spin Jump or the Ultra Hammer digs them up, and some are sidequest rewards; there are 100 in this game and they are traded to Dazzle in Rogueport Underground for badges [wiki:www.mariowiki.com/Star Piece (Paper Mario series)]
- Merluvlee the fortune teller can tell Mario where the Star Pieces are [wiki:www.mariowiki.com/Star Piece (Paper Mario series)]
- Dazzle's price list, in Star Pieces: Attack FX P 1; Chill Out 2; Pretty Lucky 3; Happy Heart, Happy Heart P and Happy Flower 4; Item Hog 5; Heart Finder and Flower Finder 6; Peekaboo 7; Quick Change 8; Flower Saver and Flower Saver P 10; Power Plus and Power Plus P 15 [gf:33039 §Badge List/Summary, Fullgore_EXE v8]
- Dazzle is found by entering the sewers from east Rogueport and going one screen left [gf:33039 §Reading this FAQ, Fullgore_EXE v8]

### Charlieton: a shop whose stock rerolls, and the only route to a complete collection
cat: Economy & Currency
how: Charlieton is a travelling salesman in Rogueport Plaza whose inventory changes every time you leave and come back — two screens away is enough. His prices are high and his stock is rare, and he is the only source that can finish a badge collection, so completing the set means repeatedly walking away and returning to see what he has today.
loop: check the stall → nothing you want → walk two screens and back → new stock → eventually the badge that exists nowhere else
notes: This is the owner's favourite pattern — hunting a collection through shops and NPCs — with the important half attached: the hunt CONVERTS into power, because the badges are the build. The reroll is what makes a static shop into a place worth revisiting, and gating completion behind it means the shop is content, not a menu. Copy the mechanic, but keep a public price list as in Dazzle's case so the player can save toward a known target rather than only reacting to what appears.
verbs: Shop stock, The fleeing rare
pointers: [gf:33039 §Reading this FAQ, Fullgore_EXE v8] [wiki:www.mariowiki.com/Charlieton]
row: M274
- Charlieton's inventory changes every time the party re-enters Rogueport, so the guide's advice for a specific badge is to go into the sewers and come back [gf:33039 §Reading this FAQ, Fullgore_EXE v8]
- The wiki puts the reroll distance at two screens, and adds that because of it everything he sells can theoretically be obtained at any point after Chapter 1 [wiki:www.mariowiki.com/Charlieton]
- He is the only way for Mario to complete his badge collection, his prices are high, and his stock is mostly rare [wiki:www.mariowiki.com/Charlieton]
- Charlieton's badge prices in coins: Slow Go 12; Double Pain 36; Mega Rush 60; Attack FX C 120; Timing Tutor 120; Jumpman 180; Hammerman 180 [gf:33039 §Badge List/Summary, Fullgore_EXE v8]
- A third vendor, the Lovely Howz of Badges, sits above the Rogueport Plaza inn [gf:33039 §Reading this FAQ, Fullgore_EXE v8]

### Battle conditions: the fight is not the challenge, the constraint is
cat: Combat
how: Every ranked Glitz Pit match arrives with a condition set by the promoter — appeal to the crowd at least once, appeal three times, do not attack for the first three turns, do not let Mario attack, and so on. Winning is not enough: fail the condition and you do not rank up, and you face the same opponent again until you win while obeying it. Most conditions are chosen at random, though a few story fights have fixed ones.
loop: read today's condition → rebuild your approach around it → win the way the crowd asked → rank up
notes: The best value-for-effort idea in this game: one line of text per fight turns a fixed roster of enemies into a different puzzle each time, with no new content. Note how the conditions attack the player's HABITS — the badge build, the reliable opener, the favourite partner — so the reward for a deep system is being asked to use the parts of it you avoid. The designers also protected the player from unwinnable pairings: the condition against the Iron Clefts can never forbid the one move that can hurt them.
verbs: Challenge gauntlet, Mastery reveal
pointers: [gf:34937 §Battle Restrictions, MarsJenkar] [wiki:www.mariowiki.com/Glitz Pit]
row: M275
- Before each fight Grubba (Jolene after Chapter 3) gives one restriction, and only one at a time [gf:34937 §Battle Restrictions, MarsJenkar]
- Examples the guide works through: appeal at least once, appeal at least three times, do not attack for the first three turns, do not let Mario attack [gf:34937 §Battle Restrictions, MarsJenkar]
- The condition must be fulfilled for the victory to count toward ranking up; fail it and Mario faces the same opponent until he both wins and meets it [wiki:www.mariowiki.com/Glitz Pit]
- Conditions are usually random, with exceptions: the first fight is always "appeal at least once", and the Iron Clefts fight will never forbid FP or partner attacks because the only move that can damage them is a partner FP move [wiki:www.mariowiki.com/Glitz Pit]

## Minigame candidates

### The Glitz Pit (a rank ladder where the purse is tied to the condition)
p: Mario fights as "The Great Gonzales" from Rank 20 of the minor league upward, choosing matches from a computer terminal in the locker room and facing opponents in a fixed order by rank. Each match carries a condition that must be met to rank up. Reaching Rank 10 promotes him to the major league; beating the champion Rawk Hawk takes the belt.
r: Prize money rising with each opponent beaten, a flat consolation fee when the condition is failed, and coin bonuses at promotion and at the championship.
l: The purse pays for OBEYING, not for winning: a win that ignores the condition drops you to a flat fee, so the money is really the fee for playing the designer's way. And the rising ladder means the last fight pays most, which is the opposite of a grind.
pointers: [wiki:www.mariowiki.com/Glitz Pit] [gf:34937 §The Opponents/Walkthrough, MarsJenkar]
row: g095

| at | get | src |
|---|---|---|
| Win the first ranked match | 5 coins | [wiki:www.mariowiki.com/Glitz Pit] |
| Each subsequent opponent defeated | 1 coin more than the last (6, 7, 8 …) | [wiki:www.mariowiki.com/Glitz Pit] |
| Win but fail the imposed condition — minor league | a flat 4 coins, and no rank up | [wiki:www.mariowiki.com/Glitz Pit] |
| Win but fail the imposed condition — major league | a flat 10 coins, and no rank up | [wiki:www.mariowiki.com/Glitz Pit] |
| Lose or flee | 1 coin | [wiki:www.mariowiki.com/Glitz Pit] |
| Reach Rank 10 | promotion to the major league, a 30 coin bonus, and the major-league locker room | [wiki:www.mariowiki.com/Glitz Pit] [gf:34937 §The Opponents/Walkthrough, MarsJenkar] |
| Defeat Rawk Hawk | champion, a 100 coin bonus, the champion's room and the Champ's Belt | [wiki:www.mariowiki.com/Glitz Pit] |
| Lose a match (GameCube version) | drop one rank; in the Switch version the rank is unchanged until you are champion | [wiki:www.mariowiki.com/Glitz Pit] |

## Exploration & upgrade facts

### Hidden
- Some Star Pieces are underground and need a Spin Jump or the Ultra Hammer to bring up, so part of the collectible is gated on traversal tools rather than on knowing where to look [wiki:www.mariowiki.com/Star Piece (Paper Mario series)]

### Upgrades
- Badge Points cap not the number of badges owned but the collective number and power of those worn, so the collection and the loadout are separate problems [gf:34937 §Definitions, MarsJenkar]
- Each badge lists a BP cost and, where relevant, an FP cost, so the trade is legible before purchase [gf:33039 §Reading this FAQ, Fullgore_EXE v8]
- The audience is a resource: a bigger crowd recharges more Star Power after each attack, and failing or skipping an Action Command shrinks it [gf:34937 §Definitions, MarsJenkar]

### Shops & exchange
- Three badge vendors exist — Dazzle (Star Pieces, in the sewers), Charlieton (coins, rerolling stock, Rogueport Plaza) and the Lovely Howz of Badges (above the plaza inn) [gf:33039 §Reading this FAQ, Fullgore_EXE v8]
- Charlieton sells Jammin' Jellies and Ultra Shrooms at 120 coins, their cheapest price in the game [wiki:www.mariowiki.com/Charlieton]

## Unverified or contradicted
- The brief asked whether the Trouble Center is a badge source. Only one Trouble Center reference appears in the Badge FAQ (a badge behind a sidequest posted by "???"), and the Trouble Center itself was not researched this pass — treat "badges from Troubles" as unconfirmed [gf:33039 §Entertaining Badges, Fullgore_EXE v8]
- Enemy badge drops were not harvested. A dedicated Enemy Item/Badge Drop FAQ exists (gf:63451, 38KB, the highest-scoring guide in the list) and is the obvious next read for this game [gf:33039 §Reading this FAQ, Fullgore_EXE v8]
- The Pianta Parlor, named in the brief, was not reached this pass and no payout for it is claimed. It does not appear in the Badge FAQ's vendor glossary, which names only Dazzle, Charlieton and the Lovely Howz of Badges [gf:33039 §Reading this FAQ, Fullgore_EXE v8]
- Prize amounts come from MarioWiki, not from the Glitz Pit guide, which is a strategy guide and tabulates no purse; the two agree on the 30-coin promotion bonus, which is the only figure both state [wiki:www.mariowiki.com/Glitz Pit] [gf:34937 §The Opponents/Walkthrough, MarsJenkar]

## Codex rows

```js
// Spliced into JRPG_Design_Codex.html on 2026-09-06 by
// scripts/splice_rows.mjs (the rows there are the source of truth; this is the map).
// M273  100 hidden Star Pieces are the currency that buys your build                         Exploration & Rewards
// M274  Charlieton: a shop whose stock rerolls, and the only route to a complete collection  Economy & Currency
// M275  Battle conditions: the fight is not the challenge, the constraint is                 Combat
// g095  The Glitz Pit (a rank ladder where the purse is tied to the condition)               rt: 8 rows
```

## Codex delta
- (ids after the splice)
