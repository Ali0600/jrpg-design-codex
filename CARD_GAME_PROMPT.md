# WAYMARK — a collectible card game design brief

> **Self-contained design document.** Everything needed to build, playtest, or iterate this game is in this file — no other document required. It was synthesized from wiki-verified research into Final Fantasy VIII's Triple Triad, Final Fantasy IX's Tetra Master, Final Fantasy VII Rebirth's Queen's Blood, and The Witcher 3's Gwent, plus a design database of 191 catalogued JRPG mechanics.
>
> **Status**: standalone game first; Section 10 maps every element onto the owner's Three.js exploration RPG (*Waystone*) for later integration.

---

## 0. Who this is for (the owner's brief, inlined)

The designer is a solo developer whose game-design pillar is: **"a world that rewards exploration, where everything has upgrades."** Sub-pillars: the world rewards exploration; everything has upgrades (even minigames have growth tracks); discovery breeds discovery; rewards are layered; **knowledge is a reward**.

Their four-ingredient formula for a card game, distilled from what they love (Gwent, Queen's Blood, Triple Triad) and what they reject (Tetra Master):

1. **Ubiquitous opponents** — nearly everyone plays; challenging is one button.
2. **Shops as booster packs** — every merchant might hold your next card; the world is a booster box.
3. **Collection converts to power** — a card hunt is only alive if the collection pays off in capability.
4. **Ranked ladder with a storyline** — named rivals, gatekeepers, and a narrative arc of the game's own.

**Hard constraint:** zero randomness in match resolution. This is the confirmed autopsy of Tetra Master — its visible stats are 16-wide hidden bands, then *both* sides roll 0-to-value, so even lopsided matchups upset ~1 in 12 and no mastery feedback loop can form. The comparative research law: *hidden information belongs in the hand, never in the resolution math.*

---

## 1. Identity & pitch

**WAYMARK** is a traveler's card game played at waystations along the Long Road. Its cards — *waycards* — depict the creatures, places, and wanderers of the road, and every region keeps its own beloved **house rules** as physical, collectible **Edicts** you can win, buy, and pin to a match.

Pitch in one line: **Triple Triad's readable capture, played on Queen's Blood's contested territory, where the *rules themselves* are part of your collection.**

The three signature ideas (what makes it *not* a clone):

1. **Edicts — rules as collectibles.** Triple Triad's famous regional rules (Same, Plus, Open…) exist here as ownable cards. Before a match, each player **pins one Edict** they own; both are visible before hands are chosen. Geography still matters (regions favor local Edicts; venues have house Edicts), but rule culture is now something you *hunt, own, and wield* — collection→power at the meta level, and mastering Edict interactions is pure knowledge-as-reward.
2. **Territory-gated placement.** You may only place adjacent to cards you control, so every capture redraws the map of where both players can legally play. Placement is simultaneously attack, economy, and denial (Queen's Blood's Splatoon insight) — with none of its pawn bookkeeping.
3. **Journey Marks — cards with a history.** The one thing Tetra Master got right, salvaged and fixed: individual card copies grow through play — but growth is **visible, bounded, and chosen by the player**, never hidden or random. Your starter ox that carried you through the first circuit can be engraved into a veteran no shop copy will ever match. Even the cards have an upgrade track.

---

## 2. Design pillars as acceptance tests

Every feature must pass:

- **Determinism test**: could a spectator compute the outcome of this play from public information + the rules? (Hands are the only hidden information; nothing rolls.)
- **Conversion test**: does this collectible convert into capability somewhere?
- **Knowledge test**: can a player be rewarded here purely for paying attention (venue terrain, opponent's signature Edict, Edict interactions)?
- **Two-minute test**: does the base match stay playable in 2–4 minutes?

---

## 3. Components & card anatomy

### 3.1 Waycards

```
 ┌──────────────┐
 │      [5]     │   ← TOP rank
 │ [2]  ART [7] │   ← LEFT / RIGHT ranks
 │      [4]     │   ← BOTTOM rank
 │  ◆ GROVE     │   ← biome tag (one of four)
 │  Trail Ox    │   ← name (+ keyword line on rare cards)
 └──────────────┘
```

- **Four side ranks** (Top/Right/Bottom/Left), values **1–9**; the value **X (=10)** appears only on Unique cards.
- **Biome tag**: `RIDGE`, `MIRE`, `GROVE`, or `RUIN`. Opposed pairs: Ridge↔Mire, Grove↔Ruin.
- **Rarity**: Common / Uncommon / Rare / **Unique** (one copy exists in the world).
- Rare and Unique cards may carry **one keyword** (Section 5.4). Commons and uncommons are always vanilla — depth lives in position and Edicts, not text soup.
- Notation used in this document: `Name (T/R/B/L, Biome)` — e.g. `Trail Ox (5/4/5/2, Grove)`.

### 3.2 Edicts

Small rule-cards. Each match, **each player pins at most one** Edict from their collection; pins are revealed **before hand selection**. Both pinned Edicts are active for the whole match. If both players pin the same Edict it is active once. Some venues add a **House Edict** (always active there, a third slot) — that's regional culture, and knowing it before you travel is scouting.

### 3.3 The board (a *venue*)

- **3 rows × 4 columns = 12 tiles.** Columns are labeled `a b c d`, rows `1 2 3` (tile `b2` = column b, row 2).
- The challenger's **home column is `a`**; the defender's is `d`.
- Venues may print **biome glyphs** on specific tiles — **fixed per venue, never random**. A venue's terrain layout is part of its identity; regulars know their home board.

---

## 4. Match rules (complete)

### 4.1 Setup

1. Reveal venue (terrain + House Edict, if any).
2. Both players reveal their **pinned Edict** (or "no pin").
3. Each player **selects a hand of exactly 6** from their 12-card deck — *chosen, not drawn*. (No draw RNG; informed by the venue and the opponent's pin. Hidden from the opponent unless the Edict of Candor is active.)
4. The **challenger places first**; players then alternate. Exactly 12 placements fill the board; the match always ends with the board full.

### 4.2 Placement legality

- Your **first** placement must be on an empty tile in **your home column**.
- Every later placement must be on an empty tile **orthogonally adjacent to at least one card you currently control** (any color card you own, not just ones you placed).
- If you have no legal tile (possible only if you control zero cards): you may place on any empty tile in your home column; if your home column is full too, you may place on **any empty tile**. (Fail-open so the game always completes 12 placements.)

### 4.3 Capture (the basic comparison)

When you place a card, compare it against **each orthogonally adjacent enemy card**, one pair of **touching sides** at a time (your placed card's side vs. the side of theirs that faces it):

- If your touching rank is **strictly higher**, that enemy card **flips** to your control.
- Equal or lower: nothing happens (under base rules).
- Flips triggered by placement do **not** chain (no cascades under base rules).
- Flipped cards keep their printed ranks and can be flipped back later.
- Control changes **also change the legal-placement map** (Section 4.2) — this is the territory game.

### 4.4 Terrain modifiers

A card on a biome-glyph tile gets, **for basic comparisons only** (never for Edict checks):

- Matching biome: **+1 to all four sides** while it sits there.
- **Opposed** biome (Ridge↔Mire, Grove↔Ruin): **−1 to all four sides**.
- Unrelated biome or no tag: no modifier.

### 4.5 Cascade (core rule, dormant until an Edict wakes it)

When a card is captured **by an Edict effect** (Echoes, Sums, the Wall), immediately re-evaluate that captured card as if its new owner had just placed it: apply the **basic comparison** (4.3, with terrain) against its adjacent enemy cards; any card flipped this way re-evaluates in turn. Cascades use basic comparison only — Edict checks never re-trigger inside a cascade. (This is Triple Triad's Combo, verified: cascades flow from Same/Plus captures and resolve by the basic rule.)

### 4.6 End & scoring

- The match ends when all 12 tiles are filled (always exactly 12 placements — 6 per player).
- **Winner: whoever controls 7 or more of the 12 cards.**
- **6–6 tie → the Underdog Rule**: the player whose six controlled cards have the **lower combined printed side-total** wins — holding the line with humbler cards is the greater feat. (Printed values only; terrain and engravings… engravings *are* printed once made — see 7.2.) If the totals are also equal: the match is a **draw** (no wager resolves; rematch at will — or immediately, if the Edict of the Long Road is pinned).

### 4.7 Wagers (stakes without dread)

Agreed before the match:

- **Friendly** — nothing staked (default vs. any NPC already beaten).
- **Purse** — loser pays the posted coin purse.
- **Bounty** — winner takes **one Common/Uncommon/Rare card of their choice** from the loser's *deck of 12*. **Uniques can never be staked.**
- **The Win-Back Rule (universal):** any card an NPC takes from you enters *their* deck and is **always re-winnable by beating them at Bounty stakes**. Nothing is ever permanently lost. (Triple Triad's Card Club safety valve, promoted to a law: real stakes, zero permadeath.)

---

## 5. The card pool

### 5.1 Stat budgets (balance backbone)

| Rarity | Side-total budget (4 sides) | Keyword | Notes |
|---|---|---|---|
| Common | **16–19** | never | the workhorses; many per pack |
| Uncommon | **20–22** | never | shape-focused (spiky sides) |
| Rare | **23–25** | one | signature effects |
| Unique | **26–28**, may carry one **X (10)** side | one | one copy in the world; unstakeable |

Shape beats size: a 9 on one side must be paid for with weak sides. A card is a *direction*, not a number.

### 5.2 Starter set (16 cards — the "Wayfarer's Dozen +4")

Every new player's deck. Vanilla, four per biome, budgets 16–19.

| # | Card | T/R/B/L | Total | Biome |
|---|---|---|---|---|
| 01 | Trail Ox | 5/4/5/2 | 16 | Grove |
| 02 | Orchard Warden | 3/6/4/4 | 17 | Grove |
| 03 | Bramble Hare | 2/5/2/8 | 17 | Grove |
| 04 | Old Milestone | 6/3/6/2 | 17 | Grove |
| 05 | Quarry Wisp | 3/2/6/6 | 17 | Ridge |
| 06 | Cairn Sentinel | 6/5/4/4 | 19 | Ridge |
| 07 | Scree Fox | 4/7/3/3 | 17 | Ridge |
| 08 | Windworn Arch | 7/2/5/3 | 17 | Ridge |
| 09 | Fen Heron | 4/6/3/5 | 18 | Mire |
| 10 | Peat Lantern | 2/4/7/4 | 17 | Mire |
| 11 | Bog Strider | 5/5/3/4 | 17 | Mire |
| 12 | Drowned Bell | 3/3/8/2 | 16 | Mire |
| 13 | Toppled Idol | 8/2/4/3 | 17 | Ruin |
| 14 | Vault Moth | 3/6/2/6 | 17 | Ruin |
| 15 | Hollow Knight | 5/4/6/4 | 19 | Ruin |
| 16 | Dust Chorus | 4/5/5/3 | 17 | Ruin |

### 5.3 Power-curve examples (uncommon → unique)

- **Uncommon — Switchback Mule (7/3/7/4 = 21, Ridge).** Pure shape: a vertical wall.
- **Rare — Lightkeeper of the Ford (6/6/5/6 = 23, Mire). Keyword: Standard-bearer.**
- **Rare — The Unmapped Stair (4/8/4/8 = 24, Ruin). Keyword: Pathfinder.**
- **Unique — The Cartographer's Compass (X/6/5/7 = 28, no biome). Keyword: Bulwark.** Won only at the end of the ladder (Section 8).

### 5.4 Keywords (exactly four exist)

- **Pathfinder** — may be placed on **any empty tile** (ignores the adjacency gate; home-column first-placement rule still applies).
- **Standard-bearer** — allied cards orthogonally adjacent to this card get **+1 on the side facing it** (basic comparisons only, like terrain).
- **Bulwark** — cannot be flipped by **cascades**; only a direct placement's comparison (or an Edict check on placement) can flip it.
- **Assayer** — when a match you *win* ends with this card under your control, it earns **2 Journey pips** instead of 1 (see 7.2).

### 5.5 The Edict set (initial eight)

| Edict | Effect (exact) | Ancestor |
|---|---|---|
| **Edict of Echoes** | On placement: if your card's touching ranks are **equal** to the touching ranks of **2+ adjacent cards** (at least one enemy), all those cards flip to you. Printed ranks only. Triggers Cascade. | Same (FF8), verified |
| **Edict of Sums** | On placement: if (your touching rank + theirs) gives the **same sum** against **2+ adjacent cards** (≥1 enemy), those cards flip. Printed ranks only. Triggers Cascade. | Plus (FF8), verified |
| **Edict of the Wall** | Board edges count as rank **X (10)** for **Echoes checks only**. Inert unless Echoes is also active (pin it *against* an Echoes region — knowledge play). | Same Wall (FF8), verified: extends Same only |
| **Edict of Candor** | Both chosen hands are revealed after selection, before the first placement. | Open (FF8) |
| **Edict of the Wilds** | All terrain modifiers are doubled (+2/−2). | Elemental (FF8), made deterministic |
| **Edict of the Long Road** | A drawn match immediately rematches; each player's new deck-of-12 for it = the 6 cards they controlled at the end + their 6 unplayed… i.e. hands are re-chosen from what you *held and controlled*. | Sudden Death (FF8) |
| **Edict of the Quiet Hand** | The Underdog Rule (4.6) also applies at **7–5**: a 7-card winner only wins if their controlled printed total is not more than **double** the loser's. Otherwise the match is a draw. (A defensive pin for humble decks.) | new |
| **Edict of the Toll** | Each player's **first** capture of the match immediately awards its owner +1 coin from the venue purse, win or lose. (An economy pin — makes even losses pay.) | new |

Edict interactions are intentionally a study: Wall without Echoes is inert; Wilds turns venue knowledge into a weapon; Quiet Hand punishes greed. **NPCs pin signature Edicts** — scouting an opponent *is* preparation.

---

## 6. Worked example (played strictly by the rules above)

Venue: **Millbrook Rest** — terrain: `b2` = Grove glyph, `c2` = Ridge glyph. No House Edict.
Challenger **P1** pins **Edict of Echoes**; defender **P2** pins **Edict of Candor** (both hands are therefore open).
P1's hand includes Trail Ox, Fen Heron, Old Milestone; P2's includes Quarry Wisp, Cairn Sentinel, Hollow Knight.

Board coordinates:

```
    a    b    c    d
1  [ ]  [ ]  [ ]  [ ]
2  [ ]  [G]  [R]  [ ]      G = Grove glyph, R = Ridge glyph
3  [ ]  [ ]  [ ]  [ ]
```

**Turn 1 — P1 plays Trail Ox (5/4/5/2, Grove) at `a2`.** Legal: first placement, home column. No neighbors.

**Turn 2 — P2 plays Quarry Wisp (3/2/6/6, Ridge) at `d2`.** Legal: home column. No neighbors.

**Turn 3 — P1 plays Fen Heron (4/6/3/5, Mire) at `b2`.** Legal: adjacent to Trail Ox (`a2`), P1-controlled. Terrain: `b2` is Grove; Heron is Mire — Grove↔Mire are *not* an opposed pair → no modifier. Adjacent enemy cards: none (Wisp at `d2` is not adjacent). No comparisons.

**Turn 4 — P2 plays Cairn Sentinel (6/5/4/4, Ridge) at `c2`.** Legal: adjacent to Wisp (`d2`). Terrain: `c2` is Ridge, Sentinel is Ridge → **+1 all sides for basic comparisons** (7/6/5/5 effective). Adjacent enemy: Fen Heron at `b2`. Touching sides: Sentinel's **Left (4+1=5)** vs Heron's **Right (6)**. 5 < 6 → no flip. (Echoes check: Sentinel touches only one card — needs 2+ — no trigger.)

**Turn 5 — P1 plays Old Milestone (6/3/6/2, Grove) at `c1`.** Legal: adjacent to Fen Heron (`b2`)? No — `c1` is adjacent to `b1`, `d1`, `c2`. `c2` is enemy. Adjacent to a P1 card? **No — illegal.** P1 instead plays at **`b1`** (adjacent to Heron `b2` ✓). Adjacent enemy: none (`c1` empty, `a1` empty). No comparisons. *(Kept the misstep visible: `c1` would violate 4.2 — legality is adjacency to your own cards.)*

**Turn 6 — P2 plays Hollow Knight (5/4/6/4, Ruin) at `c1`.** Legal: adjacent to Sentinel (`c2`) ✓. No terrain on `c1`. Comparisons — two adjacent enemies: Old Milestone at `b1`: Knight's **Left (4)** vs Milestone's **Right (3)** → 4 > 3, **Milestone flips to P2**. Below, `c2` is friendly. **Echoes check (active all match):** Knight's touching ranks — vs Milestone L4-vs-R3 (unequal), vs Sentinel B6-vs-T6 (**equal**) — only **one** equal pair; Echoes needs 2+ → no trigger. Cascade: none (basic flips don't cascade).

Score so far: P2 controls Wisp, Sentinel, Knight, Milestone (4); P1 controls Ox, Heron (2). Six placements remain — P1's Echoes pin is live, and every P2 card on row 2 shares rank-adjacent sides… the comeback line is visible, computable, and entirely deterministic.

*(A full 12-placement script belongs in the prototype's tutorial; this excerpt demonstrates every load-bearing rule: home-column start, adjacency legality — including a rejected illegal move — terrain, basic capture, an Edict check that correctly does not fire, and open-information planning under Candor.)*

---

## 7. Economy — the four ingredients as mechanisms

### 7.1 Acquisition (deterministic; hunting, not gacha)

- **Outfitters (shops-as-boosters):** every waystation's outfitter sells 2–3 **fixed-content themed packs** at a flat price (Queen's Blood's verified model — guides can map every card to its pack; collection is exploration, not chance). Regional themes: Ridge packs in the mountains, Ruin packs on the old frontier.
- **First-win cards (ubiquitous opponents):** every named NPC awards a **specific card** on first defeat. Losing costs nothing outside wagers. One button to challenge anyone.
- **Puzzle boards:** some venues host set-piece challenges ("win this board in 2 placements") that teach a card's best use and award that card (Queen's Blood's Card Carnival — the tutorial *is* content).
- **The catch-up shop:** the hub outfitter restocks any pack after it debuts elsewhere; nothing is missable (a codex law: never punish curiosity with permanent loss).
- **Edicts:** bought with Assay Tokens at guild tables, or won from gatekeepers (each gatekeeper's signature Edict joins your collection when you take their rank).

### 7.2 Conversion (collection → power)

- **Assay:** retire duplicate cards into **Assay Tokens** (Common 1 / Uncommon 2 / Rare 4). Tokens buy Edicts and pay for engravings. *No card is ever a dead pull* (Triple Triad's law: even trash cards convert — verified down to its Fastitocalon-F → early magic loop).
- **Journey Marks (the Tetra salvage, fixed):** a card under your control at the end of a **won** match earns **1 Journey pip** (2 with Assayer). At **3 pips**, you may pay **2 Assay Tokens** to **engrave** it: **+1 to one side of your choice** (max 9; X sides can't grow), printed permanently on that copy, pips reset. **Maximum 2 engravings per card.** Visible, chosen, bounded, deterministic — a veteran card is *earned*, never rolled.
- **Collection milestones open the map:** at 20 / 35 / 50 unique cards collected, side-routes unlock on the circuit (new waystations, packs, and opponents). The collection literally opens the world.

### 7.3 The circuit (ranked ladder with a storyline)

**Ten ranks:** Wayfarer → Cairnkeeper → Fordwalker → Tollmaster → Ridge Runner → Mirewise → Grovesworn → Ruinreader → Warden of the Long Road → **Cartographer's Heir**. Gatekeepers at ranks 3/5/7/9 refuse matches until you qualify (Queen's Blood's verified gatekeeper structure) and each pins a signature Edict you must play *under* before you can *own* it.

**The storyline — The First Deck.** The game is older than any road. Folklore says the original twelve waycards were the surveyor's tools that *charted the first roads* — that a match of Waymark was how the land was argued into shape. The founder — the **Cartographer** — never stopped walking; the twelve First Deck cards scattered along the routes they walked. Story beats:

1. A gatekeeper's Edict is stolen; you're deputized to win it back (tutorial arc).
2. A rival — **Petra Nine-Roads** — is hunting the First Deck too, one waystation ahead of you all season.
3. A First Deck card surfaces in a backwater Bounty game; winning it makes every gatekeeper treat you differently (and Petra stops smiling).
4. The Warden of the Long Road reveals the truth: the First Deck cards are waymarks *themselves* — wherever all twelve gather, the road there becomes real again.
5. Final: the **Cartographer** waits at the road's unfinished end and plays with **all Edicts active at once** — the complete original rules. Winning earns the **Cartographer's Compass** (unique), the twelve First Deck cards, and the title. The road past the final waystation opens — and walks on into the sequel hook (or, in integration: into *Waystone* itself).

---

## 8. Ancestry table — what this steals and what it fixes

| Ancestor | Stolen | Fixed / rejected |
|---|---|---|
| **Triple Triad** (FF8) | Readable side-rank capture; Same/Plus/Wall as depth (now Edicts); regional rule culture (now collectible); real stakes; conversion economy; ~2-min matches; one-button ubiquity | The Random rule's rare-loss dread → Uniques unstakeable + universal Win-Back Rule; rule spread is player-driven (pins), not RNG-rolled |
| **Tetra Master** (FF9) | Per-copy individuality + cards that grow through play (→ Journey Marks); choose-your-battle-order planning (→ cascade order is placement order, computable) | **Everything else**: hidden stat bands → printed ranks; double-RNG battles → strict comparisons; random per-copy arrows → identical printed copies that *diverge only through chosen engraving*; opaque rules → every rule in this document fits on a card |
| **Queen's Blood** (FF7R) | Territory as the second game (placement = attack + economy + denial); deterministic fixed-content packs; gatekeepered ladder; the minigame owning a real storyline; puzzle-boards-as-tutorial | Pawn-rank bookkeeping → simple adjacency; power-total lanes → capture majority (keeps Triad's flip drama); no-stakes matches → wager tiers |
| **Gwent** (Witcher 3) | Every vendor a slot-machine moment; one-per-NPC uniques make *people* collectible; every card mechanically matters | Round/attrition structure (too long for a roadside match) |

---

## 9. Balance knobs & playtest questions

**Knobs** (tune without redesign): side-total budgets per rarity; terrain at ±1 vs ±2; engraving cost (2 tokens) and cap (2 per card); Echoes/Sums requiring 2+ matches (raise to 3+ if cascades dominate); wager purse sizes; pip threshold (3).

**Playtest questions, in priority order:**
1. **Second-placement advantage.** With 12 alternating placements the defender places last (Triple Triad's known edge). Candidate fixes if it exceeds ~55% win rate: challenger picks home column *after* seeing the venue; or the Underdog Rule breaks ties *toward the challenger*.
2. Does the adjacency gate ever produce degenerate walls (a player sealed into 3 tiles)? If so, add one "ford" tile per venue that counts as adjacent-to-everything.
3. Are two active Edicts per match too much cognitive load for NPC matches at rank 1–2? (Option: ladder rank 1 plays pin-free.)
4. Engraving economy: is +1 side worth 3 wins + 2 tokens, or does everyone bank pips on one carry card? (Assayer keyword may need to be Rare-only… it already is; verify it isn't mandatory.)
5. Underdog Rule: does it warp deckbuilding toward minimum totals? (It should reward *efficient* captures, not throwaway decks — if warped, scope it to printed totals ≤ a floor.)

---

## 10. Waystone integration hooks (the renameable slots)

Every standalone element was designed as a slot. When the owner's Three.js exploration RPG (*Waystone* — a Surveyor completes a half-sung world by planting Waystones; its hub grows as recruited residents build shops) absorbs this game, the mapping is 1:1 — **this section replaces `GAME_PROMPT_V2.md` §7 ("The Deck Game")**:

| Standalone slot | Waystone binding |
|---|---|
| Waystations / the circuit map | The Waystation hub + the manifested regions |
| Outfitters' fixed packs | The recruited **Merchant**'s rotating stock (every shop a booster) |
| Edict guild tables | The recruited **Scribe**; Edicts bought with Lumen |
| Named NPC opponents + first-win cards | Hub residents and region NPCs — recruiting someone adds a Waymark player to the hub |
| The circuit ladder + storyline | The **Cardplayer** resident's own questline (the game-within-the-game keeps its narrative) |
| Biomes (Ridge/Mire/Grove/Ruin) | The four region palettes; venue terrain = the region you're in |
| Waycards' art subjects | Creatures, places, and people **the player has actually encountered** — the deck becomes a record of exploration (cards unlock as codex-of-the-world entries) |
| Assay Tokens | Lumen, or feed engravings into the Marks & Masteries loadout economy |
| First Deck / Cartographer arc | Ties into the world's stopped-song fiction: the First Deck cards are fragments of the original song's notation |

Integration rule: **nothing in Sections 3–6 changes.** Only the nouns rebind. If a mechanic can't survive the renaming untouched, it was designed wrong — flag it rather than fork the rules.

---

## 11. Prototype scope note (for the next conversation)

Priority order for a first playable:
1. **Paper-equivalent digital board** (HTML/canvas): 3×4 grid, the 16 starter cards, basic comparison + adjacency + terrain, hotseat. *No Edicts yet.* Proves the 2-minute core.
2. Add **Echoes + Sums + Cascade** and the two-pin flow. Proves the depth layer.
3. One AI opponent (greedy 1-ply: maximize immediate flips minus exposure — even weak AI works for NPC rank 1–2).
4. Journey pips + engraving on a persistent localStorage collection.
5. Three-venue mini-circuit with one gatekeeper: proves the loop *hunt → pin → win → engrave*.

Anti-scope: no multiplayer netcode, no card art pipeline (typography + biome color is enough), no more than 8 Edicts until the first 8 are proven.

---

## Appendix — research provenance

Rules facts verified against: Final Fantasy Wiki (Triple Triad, Card Mod, Queen of Cards, Tetra Master, Queen's Blood pages — via MediaWiki API), Jegged, Game8, VGKAMI, PowerPyx, RPG Site, xvw.lol's Tetra Master analysis, and aggregated reception (PCGamesN, Polygon, Eurogamer, Kotaku, Gamerant). Key verified anchors: Same/Plus/Same Wall exact definitions and Combo cascade behavior (FF8); Queen's Blood 3×5 board, 15-card decks, deterministic pack contents, gatekeepered 12-rank ladder; Tetra Master's hidden 16-wide stat bands + double 0-to-value rolls (~1-in-12 upsets between unequal cards) and its collection-converts-to-nothing economy. Where sources disagreed or were silent (Tetra battle ties; QB per-turn draw), nothing in this design depends on the unresolved point.
