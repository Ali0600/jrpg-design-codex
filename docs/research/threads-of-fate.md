# Threads of Fate — research digest

Codex: `Threads of Fate` (1999, PlayStation) · GameFAQs: `/ps/197110-threads-of-fate`
confirmed 2026-09-05 (platform PS; 1999 JP release, matching the BASE_GAMES year) ·
digest started 2026-09-05

> Facts only, in our own words. Item names and numbers may be quoted; guide prose may not.
> Every fact carries a pointer: `[gf:<id> §<section>, <author> v<ver>]` or `[wiki:<host>/<Page>]`.

## Sources

| id | title | author | version | updated | category | KB | url |
|---|---|---|---|---|---|---|---|
| 38095 | Power-Up/Item FAQ | SIMSteven | 1.0 | 07/26/2005 | In-Depth Guides | 29 | https://gamefaqs.gamespot.com/ps/197110-threads-of-fate/faqs/38095 |
| 8585 | Secrets Guide | d0wner | 1.1 | 02/11/2001 | Codes and Secrets | 30 | https://gamefaqs.gamespot.com/ps/197110-threads-of-fate/faqs/8585 |
| 8509 | Guide and Walkthrough (grep only) | krystalklyr | 1.3 | 06/25/2002 | Full Game Guides | 380 | https://gamefaqs.gamespot.com/ps/197110-threads-of-fate/faqs/8509 |
| wiki | Threads of Fate · Rue · Arc Edge · Dual Rings | — | — | — | threadsoffate.fandom.com | — | https://threadsoffate.fandom.com/wiki/Threads_of_Fate |

Triage (2026-09-05, `__gf.triage()` on 10 guides): Power-Up/Item FAQ 10 · Secrets Guide 6 ·
Rue Walkthrough / Mint Mini-FAQ 4 · the three full walkthroughs (380/132/138KB) kept for
grep only · Game Script and Translation Guide skipped. The wiki has 28 pages, nearly all
characters — usable for the two existing rows, not for items. The Secrets Guide boxes its
headings as `//-=-=\\ … \\-=-=//`, which the probe did not read as sections until this
pilot taught it to (fixture added); `grep` and `lines()` carried the reading meanwhile.

## Mechanics candidates

### Monster coins: one drop, three uses (continue, sell, transform)
cat: Economy & Currency
how: Every monster drops its coin. A coin is a continue token (better coins restart with more MP), a sellable whose gold buys permanent stat boosts at Hobbs's shop, and — for Rue — the key to transforming into that monster. The rare Platinum Coin forces the design's choice out loud: use it in the field for stat raises, or sell it for three upgrades' worth of gold.
loop: kill → pocket the coin → choose: spend it, sell it, or wear it → every fight funds an upgrade
notes: Three currencies collapsed into one drop with no conversion menu — the player decides at the moment of use, not in a shop. The transferable part for the owner's pillar: the SAME collectible feeds traversal (transformation), survival (continues) and progression (stat shop), so nothing found is ever dead weight. The church selling coins for donations is the pressure valve that keeps the continue economy from starving a struggling player.
pointers: [gf:38095 §Coins, SIMSteven v1.0] [gf:8585 §Useless/Useful Items, d0wner v1.1] [gf:38095 §Stones, SIMSteven v1.0] [gf:8585 §Rue's Sidequests, d0wner v1.1]
row: M262
- Sell values: Bronze Coin 50 G, Silver 500 G, Gold 2,500 G, Platinum 15,000 G; with the Rare Wine discount an upgrade is 5,000 G, so two Gold Coins or one Platinum buy upgrades outright [gf:38095 §Coins, SIMSteven v1.0]
- Continuing with a better coin restarts with more MP; a Platinum Coin used to continue also adds a permanent +1 to base attack and defense [gf:8585 §Useless/Useful Items, d0wner v1.1]
- Roughly three Platinum Coins exist per playthrough; in the field one gives two stat raises, sold it funds three [gf:38095 §Coins, SIMSteven v1.0]
- Coins sit at shiny ground spots around Carona that change with story progress, in chests (three Gold Coins in one Tower of Maya room), and as minigame prizes [gf:38095 §Coins, SIMSteven v1.0]
- Coins can be bought at the church by praying and then donating: 1,000 G → 10 Bronze, 5,000 G → 5 Silver, 10,000 G → 2 Gold, 30,000 G → 1 Platinum [gf:8585 §Useless/Useful Items, d0wner v1.1]
- Rue's transformations are keyed by specific coins; both guides walk the same chains (Mandola → Ootang for a tree climb, Bubba + Stinger for a rock and a crawl-hole) [gf:38095 §Stones, SIMSteven v1.0] [gf:8585 §Rue's Sidequests, d0wner v1.1]

### Legendary set → an NPC kitchen that turns monster coins into permanent stats
cat: Progression & Upgrades
how: A sword, shield and helmet are found in three dungeons. Given to the barman Jergen, they turn out to be cookware, and a new "Today's Special" appears on his menu: four stat-raising meals that cost no gold but are paid in stacks of specific monster coins. After around ten meals the set breaks and he hands over a Platinum Coin.
loop: find three set pieces → unlock a converter NPC → farm the named monsters → eat +2 STR / +2 DEF meals the shop cannot sell → the set expires into one last payout
notes: A collection that unlocks a SERVICE rather than an item, and a converter with a built-in expiry so it cannot be farmed forever. The double-strength STR/DEF meals versus the shop's HP/MP ones is the incentive that makes the detour worth it — "everything has upgrades" needs converters like this between its currencies. Both guides read it as a wink at Brave Fencer Musashi's Legendary gear.
verbs: Traded
pointers: [gf:38095 §Legendary Items, SIMSteven v1.0] [gf:8585 §Legendary Stuff, d0wner v1.1]
row: M263
- Legendary Sword: Underground Ruins, on the ledge across the platform room after the boulder; Legendary Shield: Raging Mountain, third pillar after the Belle & Duke fight; Legendary Helmet: Tower of Maya, across the moving-platform room by the door [gf:38095 §Legendary Items, SIMSteven v1.0] [gf:8585 §Legendary Stuff, d0wner v1.1]
- Meal table: Minced Fire Blob = 50 Fire Blob coins → Max HP +10; Mushroom Soup = 60 Fungie coins → Max MP +10; Pollywog Souffle = 50 Pollywog coins → Strength +2; Goudon Liver Soup = 30 Goudon coins → Defense +2 [gf:38095 §Legendary Items, SIMSteven v1.0] [gf:8585 §Legendary Stuff, d0wner v1.1]
- Fungies for the soup come from one of the games at Mel's Atelier (the "big balls" one) [gf:8585 §Legendary Stuff, d0wner v1.1]
- The set breaks after ten meals of any mix and Jergen gives a Platinum Coin — 13 to 23 stat points in total depending on the mix [gf:38095 §Legendary Items, SIMSteven v1.0]

### Rare Wine: a hidden item that permanently discounts the upgrade shop
cat: Exploration & Rewards
how: Three ice blocks near the end of the Underground Ruins hide the Rare Wine (and, for Mint, the Super spell effect); melting them needs a fire attack and about 110 MP. Given to the shopkeeper Hobbs for free, it drops his Strength / Defense / HP / MP upgrade items from 30,000 G to 5,000 G each for the rest of the game.
loop: notice the ice → come back with fire → refuse Marcum's cash and give it away → every future upgrade costs a sixth
notes: The shop itself is the thing that gets upgraded — the owner's exact phrase. The refusal is the design's teeth: selling the wine to the trader forfeits the discount. Pair with a visible "30,000 G" price tag early so the player feels the wall before the key.
verbs: Tool-gated, Traded
pointers: [gf:38095 §Rare Wine, SIMSteven v1.0] [gf:8585 §Useless/Useful Items, d0wner v1.1] [gf:8585 §Magic Colors/Effects, d0wner v1.1]
row: M264
- Fire source: Burner (Mint) or a Goudon's flame attack (Rue); the MP is earned by casting early, which also raises max MP [gf:38095 §Rare Wine, SIMSteven v1.0]
- The three blocks need about 110 MP; 106 is possible with no misses [gf:8585 §Magic Colors/Effects, d0wner v1.1]
- Hobbs's shop is in the back alley to the right of the pub; the discount applies to everything he sells [gf:8585 §Useless/Useful Items, d0wner v1.1]

### Mint's spell effects are hidden collectibles — and each one hides differently
cat: Exploration & Rewards
how: Mint's magic is a grid of seven colours and seven effects; a spell is a named pair (Graviton = Black + Power). The colours arrive automatically with the story, but five of the seven effects must be found: behind melted ice, on a boss's body after returning to a cleared dungeon, under a cliff rock blown up with a specific spell and then a pixel-perfect jump, by rematching a dragon in a narrow story window, and one by the plot.
loop: learn a colour for free → hunt an effect → every new effect multiplies the whole grid → the hardest hunts unlock the best spells
notes: One collectible family, five different discovery verbs — exactly the "variety of discovery" the owner asked for, inside a single system. Rue's campaign is the deliberate opposite: all of his forms are in the open, and item sidequests fill the gap. Note the multiplicative payoff — an effect is worth seven spells, not one.
verbs: Tool-gated, Guarded, A second layer
pointers: [gf:8585 §Magic Colors/Effects, d0wner v1.1] [gf:8585 §Rue's Sidequests, d0wner v1.1] [gf:8509 §Magic, krystalklyr v1.3]
row: M265
- Colours after the two starting ones arrive in story order: Red, Green, Black, Yellow, Gold — none hidden [gf:8585 §Magic Colors/Effects, d0wner v1.1]
- The walkthrough's own magic primer lists the same seven effects and says effects come from chests and events while colours come from the story [gf:8509 §Magic, krystalklyr v1.3]
- Effects: Normal and Wide at the start; Super behind the three ice blocks (with the Rare Wine); Power on Skull Beast's body at the bottom of the spiral staircase after returning to the Underground Ruins; Circle in a chest under a cliff rock on the Carona Forest descent, blown up with Graviton, then a jump with almost no margin; Hyper from a rematch with Wygraf on Raging Mountain after the Tower of Maya and before Valen's Fortress; Cosmos from the story [gf:8585 §Magic Colors/Effects, d0wner v1.1]
- Rue's abilities (monster forms) are never hidden; his campaign gets item sidequests instead — the Star Stone behind a rock (Bubba to smash, Stinger to crawl, then kill the Little Bats) and the Moon Stone up the Ootang's tree [gf:8585 §Rue's Sidequests, d0wner v1.1]

## Minigame candidates

### Rod's duels
p: Rod the Blade Star waits in the grass field between the inn and Klaus's house and duels for a 100 G stake, paying ten to one. He fights with four successive weapons, five bouts each; after every win his Strength and Defense rise by 4 and his HP by 40, so the duel scales with the player's own upgrades.
r: 1,000 G per win; a coin after each weapon's fifth win, Platinum for the last two; after twenty wins he announces his stats before each bout.
l: A rival who levels with you is a self-balancing money sink AND source — and a prize on every fifth win turns a grind into a ladder with rungs.
pointers: [gf:38095 §Rod, SIMSteven v1.0] [gf:8585 §Rod the Blade Star, d0wner v1.1]
row: g090

| at | get | src |
|---|---|---|
| each win, on a 100 G stake | 1,000 G (ten to one) | [gf:38095 §Rod, SIMSteven v1.0] [gf:8585 §Rod the Blade Star, d0wner v1.1] |
| 5 wins vs Silver Breeze | Gold Coin | [gf:38095 §Rod, SIMSteven v1.0] |
| 5 wins vs Golden Gale | Gold Coin | [gf:38095 §Rod, SIMSteven v1.0] |
| 5 wins vs Black Tornado | Platinum Coin | [gf:38095 §Rod, SIMSteven v1.0] [gf:8585 §Rod the Blade Star, d0wner v1.1] |
| 5 wins vs Dark Hurricane | Platinum Coin | [gf:38095 §Rod, SIMSteven v1.0] [gf:8585 §Rod the Blade Star, d0wner v1.1] |
| 10 / 15 / 20 wins vs Dark Hurricane | Gold, Silver, Bronze Coin | [gf:38095 §Rod, SIMSteven v1.0] |

### Valen's Fortress arenas (timed)
p: Each arena room in the final dungeon runs a timer; the exit marker pays a coin sized by the time left and restores HP — the walkthrough's maps mark a Gold / Silver / Bronze Coin at every arena exit.
r: Gold / Silver / Bronze Coin by remaining time, nothing on a timeout.
l: A single timer converts a combat room into a graded minigame with no extra content — the reward tier IS the score screen.
pointers: [gf:38095 §Coins, SIMSteven v1.0] [gf:8509 §Arena I, krystalklyr v1.3]
row: g091

| at | get | src |
|---|---|---|
| more than 75% of the timer left | Gold Coin | [gf:38095 §Coins, SIMSteven v1.0] |
| 50–75% left | Silver Coin | [gf:38095 §Coins, SIMSteven v1.0] |
| 25–50% left | Bronze Coin | [gf:38095 §Coins, SIMSteven v1.0] |
| timer runs out | nothing | [gf:38095 §Coins, SIMSteven v1.0] |

### Poppul Purrel games at Mel's Atelier
p: Mel's mushroom-like helpers run three timed courses outside her atelier — Blow Trumpet, Big Swings and Giant Balls — each ending in a bonus game (stomp trumpets to keep cockadoos off your head; collect coloured balls, streaks score extra, black ones don't count; whack the Fungies). Hurrying the course banks extra time for the bonus round.
r: Beat the high score for a Silver Coin; fail and still get a Bronze Coin. The Giant Balls game is where Fungie coins for Jergen's soup come from.
l: Even the consolation prize is a real currency item, and one game doubles as the farm for a crafting ingredient.
pointers: [gf:38095 §Coins, SIMSteven v1.0] [gf:8509 §Mel's Atelier, krystalklyr v1.3] [gf:8585 §Legendary Stuff, d0wner v1.1]
row: g092

| at | get | src |
|---|---|---|
| bonus game score of 500 or more | Silver Coin | [gf:38095 §Coins, SIMSteven v1.0] [gf:8509 §Mel's Atelier, krystalklyr v1.3] |
| below 500 | Bronze Coin | [gf:38095 §Coins, SIMSteven v1.0] [gf:8509 §Mel's Atelier, krystalklyr v1.3] |

## Exploration & upgrade facts

### Hidden
- The Last Hero (book): stay at the hotel (500 G), take the Dream Stone from the room's corner and dream of an Ootang jumping into a hollow tree stump; in Carona Forest jump into that stump, water the wilted Mandola (Mint's Blue magic, or Rue as a Spectre), climb the grown flower to the chest; Rod trades the book for Strength +4 [gf:38095 §Unique Items, SIMSteven v1.0] [gf:8585 §The Dream Sequence, d0wner v1.1]
- Mysterious Statue (Rue only): after clearing the Ghost Temple, a wall near the Duke fight room is gone; the room behind holds three chests including the statue; Klaus gives MP +10 for it, or Marcum pays 4,000 G — 6,000 G if the first offer is refused, and no higher [gf:38095 §Unique Items, SIMSteven v1.0] [gf:8585 §Useless/Useful Items, d0wner v1.1]
- Brooch (Mint only): a Gamul lever puzzle — at the pair of adjacent levers hit only the left one so they face each other; Annette gives a drink discount for it (Milk 10 G, Rootbeer 30 G, Tropical Delight 50 G), or Marcum pays 4,000 / 6,000 G [gf:38095 §Unique Items, SIMSteven v1.0] [gf:8585 §Useless/Useful Items, d0wner v1.1]
- Star Stone (Rue only): Bubba coin from Raging Mountain to smash the cliff rock in Carona Forest, Stinger coin to fit the hole behind it, then about 20 Little Bats — a chest drops a Star Stone [gf:38095 §Stones, SIMSteven v1.0] [gf:8585 §Rue's Sidequests, d0wner v1.1]
- Moon Stone (Rue only): become a Mandola, use Bloom to lure the Ootang and shoot it for its coin; as an Ootang climb the ruins' tree to a trampoline branch and a chest [gf:38095 §Stones, SIMSteven v1.0] [gf:8585 §Rue's Sidequests, d0wner v1.1]

### Upgrades
- Tonio's shop sells bracers (Strength) and belts (Defense) in tiers unlocked by story milestones: Bronze +4 (1,000 G), Silver +8 (3,000 G, or 2,500 G if the Bronze is owned), Gold +12 (3,500 G), Platinum +16 (3,500 G), Mythril +20 (5,500 G), Brave Bracer / Black Belt +24 (6,500 G) [gf:38095 §Tonio's Armor, SIMSteven v1.0]
- The wiki agrees bracers raise the weapons' attack power for both heroes [wiki:threadsoffate.fandom.com/Arc Edge] [wiki:threadsoffate.fandom.com/Dual Rings]
- Stones sell for: Night Stone 500 G, Moon Stone 1,000 G, Dream Stone 2,000 G, Star Stone 3,000 G [gf:8585 §Useless/Useful Items, d0wner v1.1] [gf:38095 §Stones, SIMSteven v1.0]
- Monster-coin farming in Valen's Fortress is the fastest money: the guide's own run of ~999 coins each of four late monsters sold for ~760,000 G, about 152 upgrades [gf:38095 §Monster Hunting, SIMSteven v1.0]

### Shops & exchange
- Hobbs's shop sells the permanent stat items (base Strength, base Defense, max HP, max MP, +10 each) at 30,000 G until the Rare Wine is given away, then 5,000 G [gf:38095 §Rare Wine, SIMSteven v1.0] [gf:8585 §Useless/Useful Items, d0wner v1.1] [gf:8509 §Town of Carona, krystalklyr v1.3]
- Marcum the trader buys the Mysterious Statue or the Brooch: 4,000 G, or 6,000 G after refusing his first offer [gf:38095 §Unique Items, SIMSteven v1.0] [gf:8585 §Useless/Useful Items, d0wner v1.1]
- The church sells continues: donate 1,000 / 5,000 / 10,000 / 30,000 G for 10 Bronze / 5 Silver / 2 Gold / 1 Platinum Coin [gf:8585 §Useless/Useful Items, d0wner v1.1]

## Unverified or contradicted
- Tonio's Armor table lists the Gold, Platinum, Mythril and Brave BRACERS as "Defense +"; the section's own opening and the wiki say bracers raise attack — read as a copy error [gf:38095 §Tonio's Armor, SIMSteven v1.0]
- The set breaks after "ten meals" in one guide and "about a dozen" in the other [gf:38095 §Legendary Items, SIMSteven v1.0] [gf:8585 §Legendary Stuff, d0wner v1.1]
- The barman is "Jergen" in one guide and "Jargen"/"Jargon" in the other; the codex uses Jergen [gf:38095 §Legendary Items, SIMSteven v1.0] [gf:8585 §Legendary Stuff, d0wner v1.1]
- Rod's per-win growth (+4 STR/DEF, +40 HP) and the music changes at 999/244/220 and 999/444/420 are one author's own observations [gf:38095 §Rod, SIMSteven v1.0]
- The Valen's Fortress arena timer PERCENTAGES have one source; the walkthrough confirms a tiered Gold / Silver / Bronze Coin at each arena exit but not the cut-offs [gf:38095 §Coins, SIMSteven v1.0] [gf:8509 §Arena I, krystalklyr v1.3]

## Codex rows

```js
// Spliced straight into JRPG_Design_Codex.html on 2026-09-05 (the rows there are the
// source of truth; this block is the map from candidate to row).
// M262  Monster coins: one drop, three uses            Economy & Currency      refs: gf:38095 gf:8585
// M263  Legendary set → Jergen's kitchen               Progression & Upgrades  refs: gf:38095 gf:8585   verbs: Traded
// M264  Rare Wine: a hidden shop discount              Exploration & Rewards   refs: gf:38095 gf:8585   verbs: Tool-gated, Traded
// M265  Spell effects as hidden collectibles           Exploration & Rewards   refs: gf:8585 gf:8509    verbs: Tool-gated, Guarded, A second layer
// g090  Rod's duels                                    rt: 6 rows              refs: gf:38095 gf:8585
// g091  Valen's Fortress arenas (timed)                rt: 4 rows              refs: gf:38095 gf:8509
// g092  Poppul Purrel games at Mel's Atelier           rt: 2 rows              refs: gf:38095 gf:8509 gf:8585
// M117  (existing) notes sharpened + refs: wiki, gf:8585
// M118  (existing) notes sharpened + refs: wiki, gf:38095, gf:8585
```

## Codex delta
- 2026-09-05: M262–M265 and g090–g092 added; M117 and M118 given `refs` and a sharper note. Threads of Fate goes from 2 mechanics / 0 minigames to 6 / 3.
