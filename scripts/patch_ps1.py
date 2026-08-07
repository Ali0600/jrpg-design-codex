import json

path = "/home/claude/gamedb/JRPG_Design_Codex.html"
html = open(path, encoding="utf-8").read()

F9="Final Fantasy IX"; F8="Final Fantasy VIII"; F7="Final Fantasy VII (1997)"
CC="Chrono Cross"; XG="Xenogears"; VS="Vagrant Story"; LM="Legend of Mana"
SG="SaGa Frontier"; PE="Parasite Eve"; TF="Threads of Fate"; BM="Brave Fencer Musashi"
D7="Dragon Quest VII"; SO="Star Ocean: The Second Story"; VP="Valkyrie Profile"

E="Exploration & Rewards"; P="Progression & Upgrades"; C="Combat"
EC="Economy & Currency"; T="Traversal"; SC="Side Content & Minigames"
SR="Social & Relationships"; M="Meta & Replayability"

rows = [
# ---------- Final Fantasy IX ----------
(F9,"Ability learning from equipment",P,
"Weapons, armor, and accessories each contain abilities. While a piece is equipped, its abilities are usable and earn AP in battle; once enough AP accumulates, the ability is learned PERMANENTLY and stays after unequipping. Support abilities are then toggled on using a limited pool of Magic Stones.",
"Find or buy gear \u2192 wear it to study it \u2192 keep its skills forever \u2192 every piece of equipment is a school, not a stat stick, and old shops stay interesting.",
"Yes",
"The direct ancestor of FF7 Rebirth's weapon-proficiency system you love. Note the Magic Stone twist: learned passives are infinite, but SLOTTING them is budgeted \u2014 collection plus loadout decisions."),
(F9,"Chocobo Hot & Cold + Chocographs",E,
"A digging minigame in chocobo forests uncovers Chocographs \u2014 treasure PICTURES showing a real location somewhere in the world. Deciphering the image and digging at the actual spot yields major treasure, and key finds upgrade your chocobo (reef \u2192 mountain \u2192 sea \u2192 sky forms), each form unlocking new terrain, more chocographs, and eventually the hidden Chocobo's Paradise.",
"Dig up a picture-riddle \u2192 recognize the place from its scenery \u2192 travel and dig \u2192 treasure + mount upgrades that open MORE of the map \u2192 discovery chains into traversal chains into discovery.",
"Yes",
"This is the Elden Ring paintings mechanic, made in 2000, fused with FF7R's chocobo traversal gating \u2014 both of your stated favorites in one system. Arguably the single most important historical entry in this codex for your game."),
(F9,"Synthesis shops",EC,
"Special shops combine two items you own plus gil into a new, stronger piece of gear \u2014 often the only source of the best equipment. Old and shop-bought items become ingredients.",
"Hold onto old gear \u2192 combine into exclusives \u2192 your inventory is a pantry, and obsolete items regain purpose.",
"",
"Makes 'outdated' loot valuable forever; synthesis recipes double as collection goals."),
(F9,"Mognet (moogle mail network)",SR,
"Moogles hidden across the entire world ask you to carry letters between them. Each delivery reveals an ongoing soap opera among the moogles, ties locations together socially, and culminates in the Mognet Central hidden quest.",
"Meet a moogle anywhere \u2192 carry its letter as you naturally travel \u2192 gossip, rewards, and a final secret location \u2192 the courier work makes the world feel like a community.",
"",
"Near-zero-cost world-building: a delivery web that piggybacks on travel the player already does, with a completion capstone."),
(F9,"Active Time Events (ATEs)",M,
"At key moments, an on-screen prompt lets you optionally watch short scenes of party members or NPCs elsewhere in the city \u2014 what the others are doing while you play. A few grant items; most are pure character texture.",
"Press one button out of curiosity \u2192 the world demonstrably continues without you \u2192 places feel inhabited, and curiosity is rewarded narratively.",
"",
"Cheap storytelling trick for a solo dev: optional cutaways that reward curiosity and make towns feel simultaneous rather than staged."),
(F9,"Stellazzio coins (riddle-clued treasure)",E,
"Twelve zodiac coins hide across the world, each accompanied by a short poem describing where its figure 'waits.' Turning coins in to Queen Stella pays escalating rewards, with a twist 13th coin for completionists.",
"Read a verse \u2192 interpret it against places you know \u2192 find the coin \u2192 tiered payouts \u2192 literary riddles reward world knowledge.",
"Maybe",
"Text-clue treasure hunting \u2014 the low-art-budget sibling of picture-based hunts. A solo dev can write twelve poems in an afternoon."),

# ---------- Final Fantasy VIII ----------
(F8,"Triple Triad + regional rules + Card Mod",SC,
"A collectible card game playable against almost any NPC. Each region has its own rule variants that spread and mix as you play across the world (and can be deliberately manipulated). The Card Mod ability converts cards into items and magic \u2014 including some of the best in the game \u2014 so the card collection feeds character power.",
"Challenge anyone, anywhere \u2192 win cards \u2192 refine them into real power \u2192 the minigame's collection IS a progression route, and regional rules make geography matter.",
"Maybe",
"Two steals: (1) a minigame whose collection converts into main-game upgrades, (2) regional rule variation that makes the same minigame feel different per area \u2014 and spreads like a living culture."),
(F8,"Junction system (magic as equippable resource)",P,
"Spells are stocked as quantities (up to 100 each) drawn from enemies and refined from items, then 'junctioned' to individual stats \u2014 100 Firagas on Strength makes you hit harder. Casting spends your stat fuel.",
"Hunt and refine magic \u2192 socket it into your body \u2192 visible stat surges \u2192 build-crafting where the ammo is also the armor.",
"",
"Radical idea, famously double-edged (drawing was tedious; casting felt punished). Lesson: making a resource pull double duty is potent, but never make players grind the fun out of it."),
(F8,"GF ability learning + refinement web",P,
"Guardian Forces are summons that level independently and learn abilities from a menu \u2014 unlocking character commands, stat junctions, and a web of refinement abilities that transmute items into magic, cards into items, and items into better items.",
"Assign a GF's study plan \u2192 it learns while you play \u2192 whole new systems (refining, junctions) unlock \u2192 your summons are research trees.",
"",
"Companions whose growth unlocks SYSTEMS rather than just damage \u2014 the refinement web makes the entire item economy interconvertible."),
(F8,"SeeD rank salary (tested knowledge as income)",EC,
"As a mercenary, you're paid a periodic salary based on SeeD rank \u2014 raised by taking written lore exams (answerable anytime from the menu) and by conduct in the field, and lowered by sloppiness.",
"Learn the world's lore \u2192 pass exams \u2192 your paycheck grows \u2192 knowledge and professionalism convert directly into economy.",
"",
"A knowledge-is-reward oddity: quizzes about the world's own fiction as an income mechanic. Niche, but memorable."),
(F8,"Weapon remodeling via magazines",E,
"Weapons upgrade only at junk shops, and each upgrade requires a recipe from a Weapons Monthly magazine found in the world plus monster-part materials.",
"Find a magazine in some corner \u2192 a concrete upgrade project appears \u2192 hunt its parts \u2192 remodel \u2192 reading material found by exploring drives the whole gear curve.",
"",
"Recipes-as-exploration-loot again (see DQ11, FF7R chips) \u2014 this is the earliest, purest version of the pattern in your codex."),

# ---------- Final Fantasy VII (1997) ----------
(F7,"Materia mastery births new materia",P,
"Materia levels up with AP; when a materia reaches MASTER level, it spawns a brand-new baby copy of itself and keeps working. Dedicated players can breed full loadouts of mastered materia.",
"Invest in an orb \u2192 master it \u2192 it reproduces \u2192 growth literally compounds, and generosity to your future self is built into the system.",
"Maybe",
"The original's twist that Rebirth dropped: upgrades that REPRODUCE at mastery. A beautiful compounding-reward idea for long games."),
(F7,"Chocobo catching, racing & breeding",E,
"Catch wild chocobos, race them at the Gold Saucer to raise their class, and breed pairs with rare nuts across generations to produce colored offspring \u2014 blue (rivers), green (mountains), black (both), and finally gold (cross oceans). Each color reaches otherwise-inaccessible caves holding the game's best materia (Knights of Round, Mime).",
"Catch \u2192 race \u2192 breed across generations \u2192 each generation unlocks new terrain \u2192 the ultimate rewards live behind a full husbandry-and-racing metagame.",
"Maybe",
"Multi-generation traversal gating: the map's final secrets require mastering an entire optional ecosystem. Compare Rebirth's simpler regional chocobos \u2014 decide how much friction your version wants."),

# ---------- Chrono Cross ----------
(CC,"Home / Another World (mirrored dual dimensions)",E,
"Two versions of the same archipelago exist \u2014 dimensions that diverged ten years ago \u2014 and you travel between them freely. Every town and island exists twice with different histories, inhabitants, and consequences; puzzles, recruits, and treasures depend on comparing and crossing between the two.",
"Notice a difference between worlds \u2192 cross over to exploit it \u2192 items, characters, and story open up \u2192 the same map is doubled content, and observation is the key skill.",
"Maybe",
"The ancestor of TotK's surface/depths mirroring: one world built twice, where KNOWLEDGE of one layer is the key to the other. For a solo dev, a mirrored world nearly doubles content from one map's assets."),
(CC,"Element grid (spatial magic loadouts)",P,
"Every character has a personal grid of slots arranged by power level; consumable-style Elements (spells/items) are allocated into it, with higher slots casting stronger versions. Characters have innate colors affecting affinity, and the grid grows with star levels.",
"Collect elements \u2192 compose each character's grid like a deck \u2192 casting order and slot height matter \u2192 magic is a build you author spatially.",
"",
"Magic-as-deckbuilding with spatial placement \u2014 a middle path between FF7's materia and a card game."),
(CC,"Star levels (boss-driven growth, no grinding)",M,
"Stats grow meaningfully only when you earn a Star from boss and event fights; between stars, regular battles give small capped gains. Enemies are visible and avoidable, and running from any fight is always allowed.",
"Fight what you choose \u2192 power comes from milestones, not repetition \u2192 pacing stays authored and grinding is structurally impossible.",
"",
"The 1999 origin of the no-grind stance Chained Echoes later took. If exploration is your reward engine, this is how you stop level-grinding from competing with it."),
(CC,"45 recruitable characters",SR,
"An enormous roster of party members joins through exploration, dialogue choices, dimension-crossing, and mutually exclusive story branches \u2014 each with unique techs, endings contributions, and a personal accent. New Game+ exists partly so you can recruit the ones you missed.",
"Talk to everyone, everywhere, in both worlds \u2192 people join you \u2192 your party is a museum of the world's inhabitants \u2192 recruitment is exploration's warmest reward.",
"",
"People-as-collectibles at maximal scale. The lesson is honest, though: 45 shallow beats is worse than 12 deep ones for most games \u2014 XC3's Heroes refined this idea."),
(CC,"Field Effect (battlefield color economy)",C,
"The last three Elements cast (by anyone, including enemies) tint the battlefield. Matching your innate color boosts you; filling all three slots with one color enables that color's summon. Combat becomes a tug-of-war over the field's palette.",
"Watch the field \u2192 sequence casts to paint it your color \u2192 boosted damage and summon windows \u2192 every cast has a second, positional meaning.",
"",
"A shared battlefield-state layer that both sides manipulate \u2014 cheap to display, deep to play (compare Chained Echoes' Overdrive bar)."),

# ---------- Xenogears ----------
(XG,"Deathblows learned by doing",C,
"Combat uses light/medium/heavy attack points chained into combos. Repeatedly inputting a specific combo pattern gradually 'trains' its named Deathblow until it clicks and becomes permanently available \u2014 you feel the character practicing.",
"Experiment with inputs \u2192 mastery bar fills invisibly \u2192 the move AWAKENS mid-fight \u2192 practice, not menus, is where power comes from.",
"Maybe",
"Learn-by-doing at its most tactile: the player and character master the move together. Same philosophy as FF9's gear-learning and FFX's overdrive modes \u2014 doing teaches."),
(XG,"Gears (mech scale with its own economy)",P,
"Party members pilot customizable mechs with purchasable frames upgrades, engines, armor, and accessories \u2014 a parallel gear economy \u2014 and Gear combat runs on limited Fuel that dungeon design forces you to budget. Learned human deathblows translate into Gear deathblows.",
"Upgrade your machine in shops \u2192 manage fuel through hostile places \u2192 human mastery carries into the mech \u2192 two combat scales, one growth identity.",
"",
"A second combat scale that INHERITS your progression rather than resetting it \u2014 Chained Echoes' Sky Armor is this idea's direct descendant."),

# ---------- Vagrant Story ----------
(VS,"Weapon affinity growth (weapons with memory)",P,
"Every weapon silently accumulates class affinities (human, beast, dragon, phantom...) and elemental leanings based on WHAT IT KILLS \u2014 growing stronger against favored types and weaker against opposites. Your blade becomes a biography of its own history.",
"Use a weapon \u2192 it remembers its victims \u2192 specialized killers emerge \u2192 you curate an armory of veterans, each with a story told in numbers.",
"Maybe",
"Equipment that grows from experience rather than upgrades purchased \u2014 'everything has upgrades' where the upgrade is HISTORY. Haunting, thematic, and mechanically real."),
(VS,"Workshop crafting (assemble, combine, break down)",EC,
"Workshops found in the dungeon let you disassemble weapons into blades and grips, reforge combinations (two items merge into new types with blended stats and inherited affinities), and socket gems for effects.",
"Loot everything \u2192 break it apart \u2192 recombine inheritances into a custom arsenal \u2192 the workshop is a laboratory and every drop is genetic material.",
"",
"Combinatorial crafting where properties INHERIT \u2014 pairs naturally with weapon-memory above. Warning from history: Vagrant Story under-explained all of it; surface your systems better."),
(VS,"Chain abilities + Risk (push-your-luck combat)",C,
"Timed button presses chain extra hits (and defensive reactions) indefinitely \u2014 but every chained hit raises RISK, which tanks your accuracy and defense the higher it climbs. Big combos are always a gamble against your own greed.",
"Nail the timing \u2192 extend the chain \u2192 Risk climbs \u2192 decide when to stop \u2192 execution skill with a built-in temptation meter.",
"",
"Timed-hit combat (see Sea of Stars) plus a greed governor: the counterweight makes restraint a skill too."),

# ---------- Legend of Mana ----------
(LM,"Land Make (you place the world yourself)",E,
"The world map starts EMPTY. Quests and exploration reward Artifacts \u2014 each of which you physically place on the map, where it blooms into a town, dungeon, or landmark. Placement position affects elemental mana levels, which alter what appears inside. Every player's world layout is different.",
"Earn an artifact \u2192 choose where your world grows \u2192 explore the place you created \u2192 the map itself is your collection, garden, and save file's fingerprint.",
"Yes",
"The most radical exploration-reward loop on this list: the reward for playing is THE WORLD ITSELF, piece by piece, arranged by you. Even a simplified version (found artifacts unlock map nodes you position) would make your game unmistakable."),
(LM,"Home workshop suite (a house of systems)",EC,
"Your home hosts an entire crafting campus: a forge with a famously deep tempering system (plunging materials imbues hidden essences), instrument-making (crafted instruments ARE your spells), a monster corral for raising pets from found eggs, golem assembly from logic blocks, and an orchard whose fruit feeds it all.",
"Gather across the world \u2192 come home to craft, raise, grow, and build \u2192 each workshop is its own rabbit hole \u2192 home base is a cluster of upgrade hobbies.",
"Maybe",
"'Everything has upgrades' as a PLACE: five interlocking hobby-systems under one roof. Scope warning \u2014 each was near-inscrutably deep; two well-explained workshops beat five opaque ones."),
(LM,"68 non-linear events (questlog-free discovery)",M,
"The game is 68 self-contained events with three loose arcs and no central quest log; content is found by wandering into it, and NPC storylines thread through whichever events you happen to trigger.",
"Wander \u2192 stumble into stories \u2192 piece the tapestry together yourself \u2192 discovery applies to the NARRATIVE, not just the map.",
"",
"The Elden Ring-style unguided philosophy applied to quests, decades early. Divisive then, beloved now \u2014 decide how much scaffolding your players get."),

# ---------- SaGa Frontier ----------
(SG,"Sparking / Glimmer (techs learned mid-battle)",C,
"While using an attack, characters can spontaneously 'spark' a related, stronger technique mid-fight \u2014 a lightbulb flashes and the new move executes immediately and is learned permanently. Spark odds depend on the move used and enemy strength.",
"Fight above your weight \u2192 someone's eyes light up \u2192 a new move is born THIS TURN \u2192 the most electric level-up feeling in the genre.",
"Maybe",
"Discovery applied to combat itself: new abilities arrive as surprise moments, not menu purchases. Players farm dangerous foes hoping for the lightbulb \u2014 risk-seeking becomes its own reward loop."),
(SG,"Free-Scenario system (7 protagonists, one world)",M,
"Seven protagonists each have a full campaign in the same connected world, with wildly different structures (one is a pure monster, one a robot, one a pop idol). Regions, systems, and characters recur, seen from different angles.",
"Pick a life \u2192 see the world from its angle \u2192 replay as another \u2192 the world is the constant; perspective is the content.",
"",
"One authored world amortized across many campaigns \u2014 heavy up-front, but the multi-protagonist replay structure (see Threads of Fate) can work at small scale with just two."),
(SG,"Growth by action (no levels, stats follow behavior)",P,
"There are no experience levels: stats rise based on what each character actually does in battle (sword use raises sword skill, taking hits raises HP), and different races grow by entirely different rules (monsters absorb enemies to transform).",
"Play a style \u2192 become that style \u2192 builds emerge from behavior rather than plans \u2192 every character's sheet is a diary.",
"",
"Behavior-driven growth is thematic and self-balancing, but opaque \u2014 if you use it, SHOW the cause-effect on screen."),

# ---------- Parasite Eve ----------
(PE,"Weapon tuning with trait carryover",P,
"Using Tools and rare Super Tools, you strip stats and special effects off one gun and graft them onto another \u2014 meaning your favorite weapon can absorb the best traits of everything you find and evolve across the whole game.",
"Loot a new gun \u2192 harvest its best trait into YOUR gun \u2192 one signature weapon accumulates a lifetime of upgrades \u2192 attachment plus optimization in one loop.",
"Maybe",
"The 'ship of Theseus' weapon: every drop matters because anything can be absorbed into your one true gun. Solves the classic problem of loot invalidating attachment."),
(PE,"Chrysler Building (earned NG+ mega-dungeon)",M,
"Finishing the game unlocks EX mode, carrying progress into a replay that opens the 77-floor randomized Chrysler Building \u2014 a brutal optional tower hiding the true final boss and true ending.",
"Finish \u2192 replay stronger \u2192 climb the tower \u2192 the REAL ending is a reward for mastery-driven replay.",
"",
"True-ending-behind-a-gauntlet: replay as an upgrade path (compare FF7R hard mode, Sea of Stars' true ending)."),

# ---------- Threads of Fate ----------
(TF,"Dual protagonists (two campaigns, one story)",M,
"Rue and Mint each have a complete campaign through the same events \u2014 different mechanics, motives, bosses, and endings \u2014 and the full picture only exists after playing both.",
"Choose a hero \u2192 finish their truth \u2192 replay as the other \u2192 the second run recontextualizes everything you thought you knew.",
"",
"The cheapest honest 2x-content multiplier for a solo dev: one world, two mechanically distinct lenses (Rue transforms; Mint casts). Design the overlap once, the perspectives twice."),
(TF,"Monster transformation (enemy forms as verbs)",P,
"Rue's Arc Edge harvests coins from defeated monsters, letting him TRANSFORM into those monsters at will \u2014 each form with its own attacks and traversal quirks (swimming, flying, fitting small spaces) used to solve puzzles and reach secrets.",
"Defeat a creature \u2192 collect its form \u2192 BE it where its body opens paths \u2192 the bestiary is a wardrobe of abilities.",
"Maybe",
"Enemy abilities as collectible traversal verbs \u2014 the action-game cousin of blue magic. Every new monster is potentially a new key."),

# ---------- Brave Fencer Musashi ----------
(BM,"Assimilate (steal techniques with your sword)",P,
"Musashi's Fusion sword lassoes enemies and absorbs their signature technique, adding it to his moveset \u2014 many stolen moves double as traversal or puzzle tools, and the bestiary tracks which techniques you've claimed.",
"See an enemy do something cool \u2192 take it \u2192 use it on the world \u2192 combat encounters are auditions for your toolkit.",
"Maybe",
"Kirby-logic in an action RPG: enemies as ability vendors. Pairs perfectly with your pillar if stolen moves open terrain."),
(BM,"Bincho rescue (town rebuilt person by person)",E,
"Thirty-five townsfolk are petrified in Bincho crystals hidden across every corner of the world \u2014 behind puzzles, platforming, and secrets. Each rescued citizen returns to town and reopens something: shops, a restaurant, a church with save perks, minigames, better inventory.",
"Spot a glowing crystal somewhere improbable \u2192 free a person \u2192 the town audibly, visibly grows \u2192 exploration rebuilds a community one soul at a time.",
"Yes",
"The origin of the town-that-grows lineage in your codex (Sea of Stars' Mirth, DQ7's immigrant town). People-as-collectibles where every find upgrades your HOME \u2014 emotional and mechanical at once."),
(BM,"Living clock (day/night schedules and fatigue)",M,
"A real-time clock runs the world: NPCs keep daily schedules, shops close at night, events happen at set hours, and Musashi himself gets sleepy and fights worse if you don't put him to bed.",
"Learn the town's rhythms \u2192 plan your days \u2192 the world feels like it exists without you \u2192 time itself is something to master.",
"",
"Ambient simulation on a budget: even a simple schedule table makes a town feel alive (compare P5's calendar, formalized)."),

# ---------- Dragon Quest VII ----------
(D7,"Shard hunting (exploration assembles the world)",E,
"The world begins almost empty \u2014 one island. Map shards found through dungeons, puzzles, and stories are placed on pedestals to materialize entire new islands (in the past), whose stories then restore those islands in the present.",
"Find fragments \u2192 slot them \u2192 A NEW LAND APPEARS \u2192 fix its past \u2192 the present world grows \u2192 exploration doesn't reveal the map; it CREATES it.",
"Yes",
"With Legend of Mana's Land Make, one of the two great 'the world is the reward' designs. Shards give the same feeling with far simpler tech: collect \u2192 unlock region \u2192 region's story enriches the hub."),
(D7,"Vocation system (classes mastered and hybridized)",P,
"Characters take vocations at a shrine, mastering them through battles; mastered basics unlock hybrid advanced classes, and defeated rare foes can even grant MONSTER vocations. Many learned skills persist across class changes.",
"Master a class \u2192 unlock its combinations \u2192 skills accumulate across a career \u2192 each character is a r\u00e9sum\u00e9 you author.",
"",
"Class mastery as combinable ingredients (XC3 later polished this); monster classes tie the bestiary into the progression tree."),
(D7,"Immigrant Town (recruit settlers, evolve a city)",E,
"Scattered across the world are wandering people you can invite to a fledgling settlement. As population grows the town physically evolves through stages, and its final form \u2014 with exclusive shops and items \u2014 depends on WHO you recruited.",
"Meet strangers everywhere \u2192 invite them home \u2192 watch the town transform \u2192 your recruitment choices decide what city exists.",
"Maybe",
"Bincho rescue plus player authorship: the town not only grows from exploration, its IDENTITY reflects your choices. Exclusive endgame shops give it teeth."),

# ---------- Star Ocean: The Second Story ----------
(SO,"Item Creation (a dozen crafting hobbies)",EC,
"Skill points buy each character proficiencies \u2014 Cooking, Alchemy, Blacksmithing, Writing, Painting, Music, Machinery, Pickpocketing \u2014 each a gacha-like creation system turning materials into items, including gear far beyond anything in shops. Hidden per-character Talents affect success and can be awakened by trying.",
"Invest in a craft \u2192 gamble materials \u2192 occasionally produce something absurdly good \u2192 the economy bends to players who master the workshops.",
"",
"A whole parallel progression through hobbies, with hidden talents rewarding experimentation. Balance warning: it famously breaks the game \u2014 decide if 'craft your way to godhood' is a feature (it can be!)."),
(SO,"Private Actions (split up in towns)",SR,
"Entering a town in Private Action mode disperses the party to live their own lives; finding and talking to them triggers optional scenes whose choices shift hidden affinity values \u2014 which determine pairings across more than 80 possible ending combinations.",
"Walk a town alone \u2192 discover your friends being people \u2192 quiet choices accumulate \u2192 the epilogue reflects every coffee you shared.",
"Maybe",
"Relationship content triggered by CHOOSING to explore towns socially \u2014 affinity earned through curiosity about your own party. The combinatorial epilogue is a lovely completion hook."),
(SO,"Super Specialties (party-wide combined skills)",EC,
"Individual skills combine into party-wide group abilities: Orchestra (the whole party performs music to supercharge the next crafting attempt), Bunny Call (summon a giant rabbit to RIDE across the world map over mountains), Publishing, Reverse Side...",
"Level individual hobbies \u2192 unlock team-scale powers \u2192 including a crafting buff and a traversal mount \u2192 systems combine into bigger systems.",
"",
"Skills that COMBINE across the party \u2014 and note Bunny Call: a traversal upgrade hidden at the intersection of two crafting skills. Delightfully weird gating."),

# ---------- Valkyrie Profile ----------
(VP,"Einherjar (recruit the dead, train them, give them away)",SR,
"As a valkyrie, you witness mortals' final moments across the world and claim their souls as party members. You train them in dungeons \u2014 then must periodically SEND your best (meeting specific stat/personality requirements) up to Valhalla, losing them from the party but earning rewards and the war's favor.",
"Find a death-story \u2192 gain a person \u2192 raise them \u2192 let them go \u2192 the game's core loop is cultivating others for a purpose beyond yourself \u2014 melancholy as mechanics.",
"Maybe",
"The bravest recruitment design ever shipped: party members as gifts, not possessions. Even borrowing 10% of this (training something to release it) gives progression emotional stakes no stat-up can match."),
(VP,"Period economy (chapters of limited actions)",M,
"Each chapter grants a fixed number of Periods; visiting towns and dungeons spends them, with a divine evaluation at chapter's end. Spirit Concentration hints where events lie, and spending time well versus exploring freely is the constant tension.",
"Budget your periods \u2192 choose destinations \u2192 evaluation judges you \u2192 time is the true currency and routes are builds.",
"",
"P5's calendar in embryo. Same caution applies: time pressure fights free exploration \u2014 use only if tension IS the point."),
(VP,"Photon-crystal platforming dungeons",T,
"Dungeons are 2D platforming spaces where Lenneth fires photons that freeze enemies into solid crystal \u2014 which become platforms, weights for switches, and stepping stones \u2014 turning every monster into potential architecture.",
"See a gap \u2192 freeze a foe \u2192 climb your enemy \u2192 combat tools double as traversal tools and dungeons become puzzles about improvisation.",
"",
"One verb (freeze) serving combat AND traversal simultaneously \u2014 maximal design economy for a small team."),
]

def js(s): return json.dumps(s, ensure_ascii=False)

entries = []
n = 86
for game, name, cat, how, loop, want, notes in rows:
    entries.append('{id:"M%03d",game:%s,name:%s,cat:%s,\nhow:%s,\nloop:%s,\nrating:0,want:%s,\nnotes:%s}'
                   % (n, js(game), js(name), js(cat), js(how), js(loop), js(want), js(notes)))
    n += 1

mech_anchor = "];\n\nconst BASE_GAMES = ["
assert html.count(mech_anchor) == 1, "mech anchor not found"
html = html.replace(mech_anchor, ",\n" + ",\n".join(entries) + "\n];\n\nconst BASE_GAMES = [")

games = [
 (F9,2000,"Squaresoft","Ability-learning gear, chocograph treasure pictures, synthesis, Mognet \u2014 the warmest expression of exploration-reward design in the PS1 catalog."),
 (F8,1999,"Squaresoft","Junction experiment, Triple Triad's regional card culture, refinement webs, recipes-as-loot. Bold ideas, instructive flaws."),
 (F7,1997,"Squaresoft","The original: materia that reproduces at mastery, and chocobo breeding as multi-generation traversal gating."),
 (CC,1999,"Squaresoft","Mirrored dual-world exploration, element grids, boss-driven no-grind growth, 45 recruits."),
 (XG,1998,"Squaresoft","Deathblows learned through practice; mechs with their own economy that inherit your mastery."),
 (VS,2000,"Squaresoft","Weapons that remember what they kill, inheritance crafting, push-your-luck chains. Systems-dense dungeon crawling."),
 (LM,1999,"Squaresoft","Land Make: the world map as YOUR collection. Plus a home full of crafting hobby-systems and questlog-free discovery."),
 (SG,1997,"Squaresoft","Sparking techs mid-battle, seven-protagonist free scenario, behavior-driven growth. Chaotic, visionary."),
 (PE,1998,"Squaresoft","One evolving signature weapon that absorbs every drop's best traits; true ending behind an earned NG+ tower."),
 (TF,1999,"Squaresoft","Two-campaign structure and monster forms as collectible traversal verbs. Small, focused, replay-built."),
 (BM,1998,"Squaresoft","Assimilating enemy techniques and rebuilding a town person-by-person via world-hidden rescues."),
 (D7,2000,"Enix","Shard hunting materializes the world island by island; vocations hybridize; an immigrant town evolves from your recruits."),
 (SO,1998,"Enix (tri-Ace)","Item Creation hobby economy, Private Actions with 80+ endings, and skills that combine into party-wide powers."),
 (VP,2000,"Enix (tri-Ace)","Recruit the dead, train them, and give your best away. Period time economy and freeze-your-enemies platforming."),
]
gentries = []
for t,y,d,w in games:
    gentries.append('{title:%s,year:%d,dev:%s,status:"Researched",\nwhy:%s}' % (js(t), y, js(d), js(w)))

game_anchor = "];\n\nconst PILLARS = ["
assert html.count(game_anchor) == 1, "game anchor not found"
html = html.replace(game_anchor, ",\n" + ",\n".join(gentries) + "\n];\n\nconst PILLARS = [")

open(path, "w", encoding="utf-8").write(html)
print("done, last mechanic id: M%03d" % (n-1))
