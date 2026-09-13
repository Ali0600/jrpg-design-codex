# Lineage ledger

Every node of every lineage in `JRPG_Design_Codex.html` is justified here. A lineage is a chain of
mechanics that share one design shape, listed in release order. A node belongs only when a
verbatim span of that row's own `how`, `loop` or `notes` shows the shape. The grammar is the
discovery-verb ledger's (`docs/verbs.md`), with the lineage's name where a verb would go.
`node scripts/validate_codex.mjs` checks every quote against its row and holds each chain's nodes
equal to the lines here, in both directions.

The shapes:

- *The timing lineage*: a button press timed to the action changes what the action pays.
- *The place that becomes yours*: what exploration finds builds or restores a place.
- *Collection that converts into power*: owning the collectible changes what you can do.
- *The shop that has upgrades too*: the shop itself grows, in its stock, its prices or its skill.
- *A cast you recruit*: people found across the world join, and each adds something.
- *Mastery earned by use*: a move, tool or class levels by being used.
- *A second map*: the world exists twice, ruined and whole, above and below, then and now.
- *Abilities that outlive the class*: what a job, class or item teaches stays when you move on.
- *A new verb reopens old ground*: an ability earned later changes places already passed.
- *The world is the answer key*: a clue found in one place is solved by recognising or reaching another.
- *Named monsters as landmarks*: named, over-strength monsters fixed in the world pay for the hunt.
- *A collection you cash in with someone*: a world-wide collectible handed to one person who pays in tiers.

The verb ledger's rules apply. The quote must show the shape, not merely share a word with it,
and a `notes` quote must describe the game rather than advise the owner. A counter-example is
quoted for the chain it fails. Entries run in id order, and a mechanic in two chains carries one
line per chain.

### M015 — Fiend Intel (elite hunts with bonus objectives)
- Named monsters as landmarks · how · `Rare elite monster variants roam the overworld`

### M020 — Mogstools / Moogle Emporium
- The shop that has upgrades too · how · `Each clear raises your Emporium level, unlocking new stock`

### M028 — Paintings → vista treasure
- The world is the answer key · loop · `the WORLD is the answer key`

### M039 — Al Bhed Primers (language collectible)
- The world is the answer key · how · `NPC dialogue written in Al Bhed gradually becomes readable as you collect them`

### M054 — Traversal skills taught by Heroes
- A new verb reopens old ground · loop · `revisit old regions with new reach`

### M057 — Unique Monsters (named world bosses)
- Named monsters as landmarks · how · `Named elite monsters with bespoke titles roam fixed spots`

### M064 — Monster mounts (enemies as traversal keys)
- A new verb reopens old ground · loop · `previously teasing ledges/cracks open`

### M066 — Korok seeds → inventory expansion
- A collection you cash in with someone · how · `whose seeds are traded to Hestu for weapon/bow/shield inventory slots`

### M069 — Depths + Lightroots (mirrored map knowledge)
- A second map · how · `A vast dark underworld mirrors the surface`

### M078 — Unique monster hunts + guild payoff
- Named monsters as landmarks · how · `Named unique monsters hide across every region`

### M080 — Timed hits + Live Mana
- The timing lineage · how · `Pressing attack at the moment of impact deals bonus damage and feeds resources`

### M082 — Rainbow Conches → tiered trade-in
- A collection you cash in with someone · how · `handing them to a collector NPC pays out escalating reward tiers`

### M083 — Mirth (build a town from found plans)
- The place that becomes yours · loop · `exploration builds a place that's YOURS`

### M086 — Ability learning from equipment
- Abilities that outlive the class · how · `the ability is learned PERMANENTLY and stays after unequipping`

### M087 — Chocobo Hot & Cold + Chocographs
- The world is the answer key · loop · `recognize the place from its scenery → travel and dig`

### M091 — Stellazzio coins (riddle-clued treasure)
- The world is the answer key · loop · `Read a verse → interpret it against places you know → find the coin`
- A collection you cash in with someone · how · `Turning coins in to Queen Stella pays escalating rewards`

### M099 — Home / Another World (mirrored dual dimensions)
- A second map · how · `Two versions of the same archipelago exist`

### M109 — Land Make (you place the world yourself)
- The place that becomes yours · how · `each of which you physically place on the map, where it blooms into a town, dungeon, or landmark`

### M122 — Shard hunting (exploration assembles the world)
- The place that becomes yours · loop · `exploration doesn't reveal the map; it CREATES it`
- A second map · how · `materialize entire new islands (in the past), whose stories then restore those islands in the present`

### M124 — Immigrant Town (recruit settlers, evolve a city)
- A cast you recruit · how · `Scattered across the world are wandering people you can invite to a fledgling settlement`

### M131 — Tetra Master (card collection without conversion)
- Collection that converts into power · how · `the collection never converts into items, power, or currency`

### M133 — Additions
- The timing lineage · how · `Basic attacks are timed button-press combos`
- Mastery earned by use · how · `Every successful completion increments that Addition's own use-counter`

### M135 — Stardust Collection
- A collection you cash in with someone · how · `A wandering NPC, Martel, takes your running total and hands back a unique accessory for every 10 collected`

### M136 — 108 Stars of Destiny (Recruitment)
- A cast you recruit · how · `Up to 108 unique characters are scattered across the world and recruited`

### M137 — Growing Castle HQ (Dunan Castle)
- The place that becomes yours · how · `Your headquarters begins as a ruined town and visibly grows through distinct Castle Levels`

### M139 — Use-Based Growth: Weapon Skills & Mana-Egg Magic
- Mastery earned by use · how · `Weapons and magic level through USE, not shared XP`

### M146 — Ra-Seru & Seru Absorption
- Collection that converts into power · loop · `your bestiary literally becomes your leveling spellbook`

### M148 — Tools (Field Gadgets)
- A new verb reopens old ground · how · `Getting the Radar even makes hidden item and Gella spots appear across the overworld you'd already crossed`

### M152 — Gilded Falcons & Life Vessels (One Per Dungeon)
- A collection you cash in with someone · how · `the 50 Gilded Falcons are turned in to Captain Merrick, who pays out on a rising ladder every five falcons`

### M154 — Job System
- Abilities that outlive the class · loop · `every unit becomes an ever-growing toolkit instead of a fixed class`

### M158 — Minion Merging (Fusion)
- Collection that converts into power · loop · `your whole collection compounds into a single escalating super-minion`

### M160 — Pictos & Lumina (mastery makes it party-wide)
- Collection that converts into power · how · `the Lumina then becomes usable by ANY party member, without the physical Picto`
- Mastery earned by use · how · `Equip one and win FOUR different battles with it and that character masters it`
- Abilities that outlive the class · loop · `the effect unlocks permanently for the WHOLE party`

### M161 — Reactive timing defense (parry / dodge / jump / gradient counter)
- The timing lineage · how · `On an enemy's turn you dodge, parry, or jump each incoming hit on timing`

### M162 — Esquie's magic rocks (traversal tied to a companion)
- A new verb reopens old ground · loop · `every coastline you already walked past turns into a door`

### M163 — Judgement Ring
- The timing lineage · how · `Almost every action is gated by a real-time timing wheel`

### M166 — Georama (town-building)
- The place that becomes yours · loop · `exploration literally assembles a world that becomes yours`

### M168 — Invention (photograph -> Ideas -> build)
- The world is the answer key · loop · `looking closely at the world is what unlocks the best gear`

### M173 — Quarries / Bounty Hunting (Hunter Rank)
- Named monsters as landmarks · how · `Quarries are unique super-boss hunts`

### M183 — 176-NPC World Recruitment (Friends List)
- A cast you recruit · how · `Exactly 176 named NPCs living across Radiata City and its world can be recruited`

### M191 — Search System (clue-gated world-map discovery)
- The world is the answer key · how · `First you must obtain a CLUE to a location`

### M197 — World of Ruin (an optional second half)
- A second map · how · `The world is destroyed at the midpoint and the game reopens as a broken, largely non-linear map`

### M198 — Action Commands (Timed Hits)
- The timing lineage · how · `press the button at the moment of impact and the attack does significantly more damage`

### M200 — Super Jump chain (mastery as a reward track)
- Mastery earned by use · how · `A Chow in Monstro Town watches your record and pays out for it`

### M201 — World Resurrection as the progression track
- The place that becomes yours · how · `Continents, flora, birds, animals and finally humanity come back in sequence`

### M203 — The hollow world (Lightside / Darkside)
- A second map · how · `The planet is a hollow sphere with two faces`

### M206 — The Hunts (a bounty board as a content spine)
- Named monsters as landmarks · loop · `hunt a named monster somewhere off the path`

### M208 — Loot -> Bazaar economy
- The shop that has upgrades too · how · `silently unlocks new Bazaar goods in every shop in the world`

### M212 — Djinn (a collection that rewrites your class)
- Collection that converts into power · loop · `one collectible is simultaneously a stat stick, a class system, a battle move and a summon economy`

### M213 — Psynergy as world verbs
- A new verb reopens old ground · loop · `puzzles and blocked routes you walked past become solvable`

### M214 — Monster recruitment (the pre-Pokemon original)
- Collection that converts into power · notes · `recruits are FULL characters (gear, levels, orders), so the collection converts to power`
- A cast you recruit · how · `certain monsters from ordinary random encounters may ASK to join your party after being defeated`

### M221 — Colony 6 Reconstruction
- The place that becomes yours · loop · `your idle gathering habit rebuilds a civilisation`

### M222 — Unique Monsters as world landmarks
- Named monsters as landmarks · how · `157 named, one-of-a-kind monsters stand at fixed spots across the world`

### M224 — Norende Village rebuild
- The place that becomes yours · how · `Tiz's hometown is destroyed in the opening and he is put in charge of rebuilding it`
- The shop that has upgrades too · how · `raise shops, each of which has multiple levels`

### M225 — Archetype lineages (classes that rank up separately from you)
- Abilities that outlive the class · how · `hitting Rank 20 permanently raises one of the wearer's stats and unlocks the stronger form`

### M233 — Castaway Village (population as the key to the map)
- The place that becomes yours · loop · `your village gains a shop AND one more body on the headcount`
- A cast you recruit · how · `Adol's task is finding the other survivors — scattered mid-dungeon, on beaches and behind bosses`

### M235 — Plug-in Chips (a spatial loadout budget)
- Collection that converts into power · how · `Every skill, HUD element and passive is a physical chip placed on a storage GRID`

### M242 — Cross-house recruitment (collect people by meeting their standards)
- A cast you recruit · how · `most students from the other two houses can be recruited — if you meet their personal bar`

### M250 — Drive Forms (five transformations, five different growth verbs)
- Mastery earned by use · how · `each levels to LV7 on a COMPLETELY different action`
- A new verb reopens old ground · notes · `combat experimentation cashes out as map access`

### M251 — Synthesis, and the Moogle who levels up with it
- The shop that has upgrades too · how · `the SHOP MOOGLE earns experience every time it makes something for you`

### M264 — Rare Wine: a hidden item that permanently discounts the upgrade shop
- The shop that has upgrades too · how · `it cuts his permanent stat items from 30,000 G to 5,000 G each for the rest of the game`

### M270 — The Artifact List (a shop's stock is the record of what you found)
- The shop that has upgrades too · how · `files it in the Artifact List, a menu every artifact-carrying shop of that type then shares`

### M273 — Star Pieces (100 hidden collectibles that buy your build)
- A collection you cash in with someone · how · `their one use is trading with Dazzle in Rogueport Underground, who exchanges them for badges`

### M276 — Deathblows (a combo alphabet that trains itself)
- Mastery earned by use · how · `learned by accumulating hidden experience on each component move during ordinary fighting`

### M280 — Wayne's counters (300 junk, and cards counted by use)
- A collection you cash in with someone · how · `Bring him 300 pieces of junk - the worthless clutter picked up all game - and he lets you choose an Ultimate Weapon`

### M281 — Trade that widens its own catalogue
- The shop that has upgrades too · how · `sell enough of the cheap staples and the trade shops begin stocking their refined counterparts`
