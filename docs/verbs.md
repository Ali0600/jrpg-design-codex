# Discovery-verb ledger

Every discovery-verb tag in `JRPG_Design_Codex.html` is justified here, and nowhere else. The
verbs are the 15 in the page's `VERBS` const, taken from `GAME_PROMPT_V2.md` §3. A tag goes on a
row only when a verbatim span of that row's own `how`, `loop` or `notes` shows the shape the verb
describes. `node scripts/validate_codex.mjs` checks every quote against its row, holds the tags
in the page equal to the tags here, and requires an entry for every row in the three discovery
categories (Exploration & Rewards, Traversal, Side Content & Minigames).
`node scripts/verb_tags.mjs --write` copies the tags across.

How to tag:

- The quote must show the discovery shape, not merely share a word with it. Sixty rows mention a
  shop; *Shop stock* means merchants whose stock rotates or grows.
- A `notes` quote must describe the source game. Advice to the owner ("your version could use
  songs") is not evidence.
- *Mastery reveal* follows the brief's wording: levelling a verb shows you something new.
- *Heard, not seen* covers any sense but sight leading the player: sound, warmth or scent.
- *Consequence* means helping someone changes what exists. Recruiting alone does not count.
- `none` is a finding, not a gap. It records that the row was read, that no verb applies, and why.

Grammar: a `### M123 — <exact row name>` header, then one line per tag (a dash, the verb, the
field, and the quote in backticks, separated by ` · `), or a single `- none · <reason>` line.
Entries run in id order. After a research splice, add an entry for every new row in a discovery
category and for every row the digest tagged.

### M012 — World Intel (umbrella checklist)
- none · a payout spine shared by every activity type; the row names how exploring pays, not how anything is found

### M013 — Remnawave Towers
- Guarded · how · `Climbable towers (guarded by enemies)`

### M014 — Lifesprings + Springseeker Owls
- none · glowing owls lead the player by sight to a hidden spring, and no verb names following a creature

### M015 — Fiend Intel (elite hunts with bonus objectives)
- Guarded · how · `Rare elite monster variants roam the overworld`

### M016 — Classified Intel (regional secret boss)
- Guarded · how · `reveals a hidden legendary monster. It drops materials found nowhere else`

### M017 — Summon Sanctuaries (Divine Intel)
- Mastery reveal · how · `levels up the summon materia — finding all 3 maxes it at ★4 with a new ability`

### M018 — Excavation Intel (chocobo digging)
- Heard, not seen · how · `ride a chocobo that sniffs out buried treasure`

### M019 — Protorelic questlines
- none · a regional quest chain feeding one global prize; the row names no way the relics are found

### M020 — Mogstools / Moogle Emporium
- Shop stock · how · `Each clear raises your Emporium level, unlocking new stock`

### M021 — Chocobo Intel (regional mounts with unique traversal)
- Tool-gated · how · `a region-specific traversal power (gliding, wall-climbing, water-walking) required to reach that region's secrets`
- Visible but unreachable · loop · `previously visible-but-unreachable places open up`

### M024 — Queen's Blood (collectible card game)
- none · cards come from shops, quests and opponents, but the row names no rotating stock or guarded prize

### M025 — Gold Saucer & minigame economy (GP)
- none · a hub of minigames paying a dedicated currency; nothing escalates, hides or rotates

### M028 — Paintings → vista treasure
- Vista sketch · how · `it depicts a real location somewhere in the world. Travel there, identify the painted vantage point`

### M029 — Unmarked world density (every landmark pays off)
- none · the brief names this the root of Visible but unreachable, but the row says every landmark you can see pays off, never that reaching one is the puzzle

### M030 — Golden Seeds & Sacred Tears
- none · visible landmarks the player simply walks to; nothing guards, gates or hides them

### M031 — Illusory walls & secret-behind-secret
- Latent geometry · how · `Some walls are fake and hide rooms, sometimes chaining multiple layers deep`

### M034 — Chadley Combat Simulator (VR arena)
- Challenge gauntlet · how · `endgame Brutal Challenges (full-party gauntlets) and Legendary Bouts (solo trials)`

### M038 — Celestial Weapons + world challenges
- none · each weapon's keys hide behind a spread of minigames; the row names no arena ladder, guard or tool

### M039 — Al Bhed Primers (language collectible)
- Inscription deduction · how · `each permanently translate one letter of the Al Bhed language. NPC dialogue written in Al Bhed gradually becomes readable`

### M040 — Blitzball (full sub-game with its own RPG)
- Challenge gauntlet · how · `An underwater sports minigame with its own leagues, tournaments`

### M048 — Will Seeds (dungeon exploration collectibles)
- none · three collectibles per dungeon in side rooms; nothing guards, gates or hides them beyond being off the path

### M049 — Mementos + request board
- Guarded · how · `that spawn mini-boss targets inside it`
- Traded · how · `a resident NPC whose flower-trading economy and stamps upgrade the dungeon's own rewards`

### M050 — Daily activities that upgrade combat
- none · leisure activities raise combat stats; nothing is found

### M051 — Exploration EXP (discovering places levels you)
- none · discovery pays EXP directly; the row names no way the places are found, guarded or gated

### M052 — Hero Quests (people are unlockables)
- none · heroes are found by markers and questlines; recruiting one changes the party, not the world

### M054 — Traversal skills taught by Heroes
- Tool-gated · how · `Terrain throughout the world is gated by them`
- Visible but unreachable · how · `containers and paths visibly tease locked routes`

### M057 — Unique Monsters (named world bosses)
- Guarded · how · `Named elite monsters with bespoke titles roam fixed spots`

### M059 — Recipe books hidden in the world
- none · recipes are found items; the player applies nothing they read

### M062 — Tickington / Tockles (retro world collect-a-thon)
- A second layer · how · `unlock quests inside 2D retro recreations of past Dragon Quest games`

### M064 — Monster mounts (enemies as traversal keys)
- Tool-gated · how · `each needed to reach specific treasures in that zone`
- Visible but unreachable · loop · `previously teasing ledges/cracks open`

### M065 — Shrines → Lights of Blessing economy
- none · a visible beacon holding a self-contained puzzle; no verb names a trial that simply always pays

### M066 — Korok seeds → inventory expansion
- Traded · how · `whose seeds are traded to Hestu for weapon/bow/shield inventory slots`

### M068 — Caves + Bubbulfrogs (layered cave economy)
- Traded · how · `its gems trade with a traveling merchant for exclusive outfits and items`
- The wanderer · how · `its gems trade with a traveling merchant for exclusive outfits and items`

### M069 — Depths + Lightroots (mirrored map knowledge)
- A second layer · how · `A vast dark underworld mirrors the surface`

### M071 — Ability-driven traversal (Ascend/Recall/Ultrahand)
- none · abilities granted early make terrain permeable; the row argues against gating, and nothing is hidden

### M072 — Reward Board (achievements that pay gear)
- none · an achievements board that pays for discoveries rather than hiding any

### M076 — Sky Armor (mechs as traversal + second combat layer)
- Tool-gated · how · `gains a flying mech: fast overworld traversal, access to new areas`

### M078 — Unique monster hunts + guild payoff
- Guarded · how · `Named unique monsters hide across every region`

### M082 — Rainbow Conches → tiered trade-in
- Traded · how · `handing them to a collector NPC pays out escalating reward tiers`

### M083 — Mirth (build a town from found plans)
- none · found plans and recruits build a home base; no one is helped and nothing outside the base changes

### M084 — Falcon-Eyed Parrot (earned completion tracker)
- Mastery reveal · how · `A relic earned via conch trade-ins adds a parrot to the world map that reports which collectibles remain`

### M085 — Solstice Shrines + day/night as a verb
- Latent geometry · loop · `Use your unique power on the world itself → environments reconfigure`

### M087 — Chocobo Hot & Cold + Chocographs
- Vista sketch · how · `treasure PICTURES showing a real location somewhere in the world`
- Tool-gated · how · `each form unlocking new terrain, more chocographs, and eventually the hidden Chocobo's Paradise`

### M091 — Stellazzio coins (riddle-clued treasure)
- Inscription deduction · loop · `Read a verse → interpret it against places you know → find the coin`
- Traded · how · `Turning coins in to Queen Stella pays escalating rewards`

### M092 — Triple Triad + regional rules + Card Mod
- none · a card game against any NPC whose collection refines into items; no verb names how cards are found

### M096 — Weapon remodeling via magazines
- none · found magazines unlock upgrades at a shop; the recipe is an item, not a rule the player applies

### M098 — Chocobo catching, racing & breeding
- Tool-gated · how · `Each color reaches otherwise-inaccessible caves holding the game's best materia`

### M099 — Home / Another World (mirrored dual dimensions)
- A second layer · how · `Two versions of the same archipelago exist`

### M109 — Land Make (you place the world yourself)
- none · the player builds the map by placing found artifacts, a shape none of the 15 verbs names

### M120 — Bincho rescue (town rebuilt person by person)
- Consequence · how · `Each rescued citizen returns to town and reopens something`

### M122 — Shard hunting (exploration assembles the world)
- A second layer · how · `materialize entire new islands (in the past), whose stories then restore those islands in the present`

### M124 — Immigrant Town (recruit settlers, evolve a city)
- none · invited settlers grow a town; the row names recruiting, not helping, so Consequence does not apply

### M130 — Photon-crystal platforming dungeons
- Latent geometry · how · `freeze enemies into solid crystal — which become platforms, weights for switches, and stepping stones`

### M131 — Tetra Master (card collection without conversion)
- none · the collection never converts, and no verb names how cards are found

### M132 — Gwent (shop-hunted deck building)
- Shop stock · notes · `vendors everywhere hold cards so every stop has slot-machine potential`

### M135 — Stardust Collection
- The wanderer · how · `A wandering NPC, Martel, takes your running total and hands back a unique accessory for every 10 collected`

### M136 — 108 Stars of Destiny (Recruitment)
- none · recruits are found by varied conditions and fill roles; recruiting is not one of the 15 verbs

### M139 — Use-Based Growth: Weapon Skills & Mana-Egg Magic
- Mastery reveal · how · `mastering two elements together unlocks combined magic`

### M141 — The Adventure Ethos: A World Built to Reward Exploration
- Latent geometry · how · `you must physically turn it to reveal hidden items and passages`

### M147 — Genesis Trees & Mist De-fogging
- Consequence · how · `Reviving a region's dormant Genesis Tree purges the Mist there, turns Seru-monsters back into people`

### M148 — Tools (Field Gadgets)
- Tool-gated · how · `Tools are the game's real keys: they solve dungeon puzzles, some gate story progress, others open optional treasure`

### M151 — Dreamwalking (Dream-Dive Dungeons)
- Consequence · loop · `save (or fail to save) a named person → each dive advances the town's unfolding fate`

### M153 — Puzzle-Box Dungeons (Platforming + Logic as Content)
- Inscription deduction · how · `demonstrates a solution in one room and demands its mirror or inversion in another`

### M157 — Minion Capture (Cocoon Master)
- Mastery reveal · how · `species that shrug off your flute early become catchable once your rank climbs`

### M162 — Esquie's magic rocks (traversal tied to a companion)
- Tool-gated · how · `each 'magic rock' you recover permanently adds a traversal verb`
- Visible but unreachable · how · `each converts water or sky you had only been able to look at into somewhere you can now go`

### M166 — Georama (town-building)
- Consequence · how · `satisfy each one's demand (a botanist wants trees nearby, a baker wants bread delivered)`
- A second layer · how · `restores that town's ruined FUTURE 100 years on`

### M168 — Invention (photograph -> Ideas -> build)
- none · photographing the world banks ideas for crafting; Vista sketch runs the other way, from a picture to the place

### M170 — Monster Arena (Infamous Monster Recruitment)
- Guarded · how · `Roaming 'Infamous Monsters' are the only special visible encounters in the world; defeat one and you recruit that species`
- Challenge gauntlet · how · `climb ranked cups G → S, each rank granting a fixed equipment prize plus a permanent perk`

### M173 — Quarries / Bounty Hunting (Hunter Rank)
- Guarded · how · `beating it drops rare gear plus a large pile of Hunter Points`
- Inscription deduction · how · `a 'thinking circle' hints which item you must present as BAIT to lure the beast out`

### M184 — Simulated Day/Night NPC Schedules
- The wanderer · how · `the person (or item) you need only exists at a particular place at a particular hour`

### M188 — Midnight Channel Weather Deadline
- none · a deadline read off the weather; it paces dungeon clearing rather than leading to a reward

### M191 — Search System (clue-gated world-map discovery)
- Inscription deduction · how · `First you must obtain a CLUE to a location (from NPCs or by examining signposts); only then do you travel to the spot`

### M192 — Endgame sidequest chains (story and gear in one)
- A second layer · how · `leave the dormant Moon Stone in a shrine in 65,000,000 B.C., then collect it in the present`
- Traded · how · `plus Dreamstone taken to its original smith`

### M197 — World of Ruin (an optional second half)
- A second layer · how · `The world is destroyed at the midpoint and the game reopens as a broken, largely non-linear map`

### M199 — Hidden Treasure Boxes (room-scale curiosity)
- Latent geometry · how · `Invisible treasure blocks hang in the air throughout the world, revealed only by jumping in the right empty space`

### M201 — World Resurrection as the progression track
- Consequence · how · `frees the giant tree Ra from a parasite, which resurrects every plant on the barren planet`

### M203 — The hollow world (Lightside / Darkside)
- A second layer · how · `The two worlds mirror and depend on each other`

### M206 — The Hunts (a bounty board as a content spine)
- Guarded · loop · `hunt a named monster somewhere off the path → LP, gear and loot`

### M208 — Loot -> Bazaar economy
- Shop stock · how · `selling ENOUGH of specific loot combinations silently unlocks new Bazaar goods in every shop in the world`

### M209 — Discoveries (exploration that literally pays)
- Traded · how · `the INFORMATION is then sold at Sailors' Guilds in any city`

### M212 — Djinn (a collection that rewrites your class)
- Guarded · how · `Djinn are elemental creatures collected across the world — often behind a fight or a puzzle`

### M213 — Psynergy as world verbs
- Tool-gated · loop · `puzzles and blocked routes you walked past become solvable`
- Latent geometry · how · `freezes puddles into steps, grows vines`

### M214 — Monster recruitment (the pre-Pokemon original)
- none · rare recruits come from ordinary fights, but nothing bolts, so The fleeing rare does not apply

### M221 — Colony 6 Reconstruction
- Consequence · how · `its population climbs toward 150 as refugees you have found elsewhere move in`

### M222 — Unique Monsters as world landmarks
- Guarded · how · `visible bosses embedded in ordinary terrain, often far above the level of the area around them`

### M228 — Poundmates (a summon roster built from side content)
- none · side stories pay summonable allies; nothing is hidden, guarded or gated

### M230 — Path Actions (every townsperson is an interactable)
- Tool-gated · loop · `every NPC in the world is a container with several different keys`

### M231 — Day / Night as a switchable world state
- A second layer · how · `the same town holds a different set of possibilities after dark`

### M233 — Castaway Village (population as the key to the map)
- Consequence · how · `that clear only once the village holds enough people`

### M234 — Cartography rewards (exploring pays you in more exploring)
- Mastery reveal · how · `reaching twelve earns the Eagle Eye Orb — a gear that widens the radius at which you clear fog`

### M237 — Familiars (tame, feed, metamorphose)
- The fleeing rare · how · `at which point Esther must Serenade it before it flees`

### M239 — Elemental modes as world verbs (with an overload tax)
- Tool-gated · how · `imbued shots are REQUIRED to solve certain environmental puzzles`

### M245 — Sound Stone & the eight Your Sanctuaries
- Guarded · how · `each sealed behind its own guardian boss`

### M247 — Sound Battles (combos played on the battle music)
- Heard, not seen · how · `judged against the LEAD ENEMY'S battle theme, not a visual cue`

### M250 — Drive Forms (five transformations, five different growth verbs)
- Tool-gated · notes · `combat experimentation cashes out as map access`
- Mastery reveal · how · `each level threshold grants a permanent movement ability to BASE Sora`

### M252 — The Gummi garage (a second game with its own progress bar)
- none · a side mode whose tool upgrades; nothing in the world is discovered through it

### M254 — A Thousand Years of Dreams (33 memories the world triggers)
- none · memories unlock at trigger places; the row names no clue, picture or sense leading the player there

### M259 — Eight chapters, eight rulesets
- Heard, not seen · how · `finds its encounters through a tracking sense of SMELL that paints scent-clouds on the map`

### M261 — A chapter that replaces combat with preparation
- none · a timed trap-setting chapter; searching the town is the content, but no verb names delegating under a clock

### M263 — Legendary set → an NPC kitchen that cooks monster coins into stats
- Traded · how · `A sword, shield and helmet found in three dungeons turn out to be cookware when handed to Jergen the barman`

### M264 — Rare Wine: a hidden item that permanently discounts the upgrade shop
- Tool-gated · how · `melting them takes a fire attack and about 110 MP`
- Traded · how · `Given to the shopkeeper Hobbs for free, it cuts his permanent stat items from 30,000 G to 5,000 G`

### M265 — Spell effects as hidden collectibles — each found a different way
- Tool-gated · how · `Circle under a cliff rock blown up with Graviton and then a pixel-perfect jump`
- Guarded · how · `Hyper by rematching the dragon Wygraf in a narrow story window`

### M266 — Scavenger Hunts (the found item creates the quest)
- Guarded · how · `guarded by a level 7 Wraith`
- Tool-gated · how · `behind an AARD-broken church door`

### M267 — Witcher gear tiers (six pieces, five qualities, two set bonuses)
- none · a crafting ladder; finding the diagrams is M266's Scavenger Hunts, and this row names no shop, rotation or reveal

### M268 — Hidden Treasure (loot carrying the note that starts the next quest)
- Guarded · how · `A treasure icon leads to a guarded camp where Witcher Sense finds a red chest`

### M269 — Places of Power (a permanent skill point for finding one)
- none · a one-time Skill Point for finding a place; the row describes no picture to match, guard, tool or reveal

### M270 — The Artifact List (a shop's stock is the record of what you found)
- Shop stock · how · `files it in the Artifact List, a menu every artifact-carrying shop of that type then shares`

### M271 — Game Tickets and Lucky Medals (two tokens, two venues, two exclusive catalogues)
- Shop stock · notes · `it turns BUYING into a source of rewards, so a shopping trip is itself a lottery ticket`

### M272 — Unleashes and breakable artifact powers
- none · a weapon reveals its Unleash through use, but nothing is levelled and nothing in the world opens

### M273 — Star Pieces (100 hidden collectibles that buy your build)
- Tool-gated · how · `needing a Spin Jump or the Ultra Hammer to dig up`
- Traded · how · `their one use is trading with Dazzle in Rogueport Underground, who exchanges them for badges`

### M274 — Charlieton (a shop that rerolls, and the only route to a full collection)
- Shop stock · how · `whose inventory changes every time you leave and come back`

### M275 — Glitz Pit battle conditions (the constraint is the content)
- Challenge gauntlet · how · `Every ranked Glitz Pit match arrives with a condition set by the promoter`

### M276 — Deathblows (a combo alphabet that trains itself)
- Mastery reveal · how · `Deathblows are named button strings, learned by accumulating hidden experience on each component move during ordinary fighting`

### M277 — Gears (stats made of parts, fuel made of turns)
- none · upgrades are parts bought outright; the row names no rotating stock, trade-in or hidden route

### M278 — Hyper Mode (the odds of your best state rise as your health falls)
- none · a comeback roll inside combat; nothing is found, revealed or changed in the world

### M279 — Bonus Points (a reward discounted by how much the fight hurt)
- none · a meta-currency discounted by damage taken; nothing is found, revealed or changed in the world

### M280 — Wayne's counters (300 junk, and cards counted by use)
- Traded · how · `Bring him 300 pieces of junk - the worthless clutter picked up all game - and he lets you choose an Ultimate Weapon`

### M281 — Trade that widens its own catalogue
- Shop stock · how · `sell enough of the cheap staples and the trade shops begin stocking their refined counterparts`
- Traded · how · `profit comes from carrying goods along a route rather than from any single shop`
