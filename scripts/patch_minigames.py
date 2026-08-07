import json

path = "/home/claude/gamedb/JRPG_Design_Codex.html"
html = open(path, encoding="utf-8").read()
def js(s): return json.dumps(s, ensure_ascii=False)

# ============ 1. MINIGAMES DATA ============
MG = [
# --- FF1 ---
("Final Fantasy I","Hidden 15-Puzzle",
"A secret sliding-tile puzzle hidden aboard the ship, opened by a button-press easter egg no one would find by accident.",
"A little gil (and prizes in remakes) \u2014 but mostly the thrill of knowing the secret.",
"A hidden minigame is itself a reward: discovery of PLAY can be treasure, not just items."),
# --- FF4 ---
("Final Fantasy IV","Developer's Room",
"A hidden easter-egg room (in certain versions) where the actual dev team appears as NPCs with jokes and mini-interactions.",
"Laughs, lore, and a few gag items.",
"Authored secret spaces build cult memory \u2014 players evangelize what they weren't supposed to find."),
("Final Fantasy IV","Whyt training (DS)",
"Touch-screen microgames (counting, rhythm, drawing) that train your custom summon Whyt's individual stats.",
"A measurably stronger summon \u2014 minigame scores become companion stats.",
"Minigame performance feeding a companion's growth: play sessions leave a permanent mark on a creature you own."),
# --- FF5 ---
("Final Fantasy V","Piano practice",
"Eight pianos sit in towns across the world; each performance is a little better as your skill grows from clumsy plinking to a recital.",
"Master all eight and the traveling minstrel rewards you with the Bard's strongest song.",
"A skill that visibly improves across the whole journey, capped by a real combat reward \u2014 progression disguised as a running gag."),
# --- FF6 ---
("Final Fantasy VI","The Opera",
"Celes must actually PERFORM the opera: learn the libretto, hit timed lines on stage, then the scene erupts into gameplay chaos.",
"Story continuation and the most beloved scene of the era.",
"Performance-as-gameplay: putting the player on stage inside the fiction beats any cutscene."),
("Final Fantasy VI","Dragon's Neck Coliseum",
"Wager any single item; an AI-controlled fighter of your choice duels a matched opponent \u2014 win and the wagered item transmutes into a specific rarer one.",
"A hidden item-conversion table (junk \u2192 treasures), unique gear, and even recruiting Shadow.",
"Betting inventory turns loot into a gambling economy, and the secret conversion table makes item knowledge itself valuable."),
("Final Fantasy VI","Emperor's Banquet",
"A timed diplomatic dinner where your dialogue choices and side-tasks are silently scored for etiquette and strategy.",
"Score tiers pay out items, story scenes, and tactical advantages in the next sequence.",
"Dialogue as a scored minigame with consequences \u2014 social skill given real stakes."),
("Final Fantasy VI","Jidoor Auction House",
"Bid against theatrical noble NPCs (and a boy who always wants the airship) for rotating rare lots.",
"Relics and even two Espers are auction-exclusive.",
"A shop with drama and scarcity: purchases you must FIGHT for are remembered forever."),
# --- FF7 (1997) ---
("Final Fantasy VII (1997)","Battle Square",
"Survive eight consecutive fights while spinning handicaps (halved HP, broken materia, frog...) stack against you, earning Battle Points.",
"BP buys Omnislash (Cloud's ultimate Limit), W-Summon, and Champion Belt \u2014 peak power sold by an arena.",
"The boldest reward placement in the series: ULTIMATE abilities gated behind a skill arena's currency. Mastery content pays mastery prizes."),
("Final Fantasy VII (1997)","Chocobo Racing (Gold Saucer)",
"Race caught and bred chocobos through classes C to S, managing stamina and sprint.",
"Prizes, GP, and the rank-ups your breeding program needs to produce ocean-crossing gold chocobos.",
"The racing loop exists to SERVE the breeding-traversal metagame \u2014 a minigame as engine for an exploration system."),
("Final Fantasy VII (1997)","Fort Condor",
"A recurring tower-defense/RTS battle at a world-map fort, replayable at story intervals as the war there evolves.",
"Items and materia \u2014 miss the final battle and you forfeit the Phoenix materia.",
"A persistent strategic front that progresses WITH the story: return visits are rewarded, neglect has costs."),
("Final Fantasy VII (1997)","Snowboarding",
"A story escape becomes a Wonder Square arcade game with time trials, balloon courses, and hidden paths.",
"GP, course records, and unlockable routes.",
"Story set-pieces recycled as replayable arcade modes \u2014 one production effort, two lives."),
("Final Fantasy VII (1997)","G-Bike & Submarine games",
"The motorcycle chase and submarine assault, both story sequences later playable as arcade cabinets.",
"GP and high-score chasing.",
"Same lesson as snowboarding: build the set-piece so it can be replayed as a toy."),
("Final Fantasy VII (1997)","Wonder Square arcade (GP economy)",
"Arm wrestling, super dunk, Mog House, 3D Battler, fortune telling \u2014 a floor of quick games all paying GP.",
"GP buys EXP Plus and Gil Plus materia, the Gold Ticket, and prizes \u2014 arcade play converts to main-game growth rates.",
"A dedicated arcade currency whose prize shelf includes PROGRESSION modifiers \u2014 minigames literally accelerate the RPG."),
("Final Fantasy VII (1997)","Tifa's piano",
"A playable piano in Nibelheim, first touched in a flashback, holding secrets for those who return and play it properly.",
"Elemental materia \u2014 and later Tifa's ultimate Limit Break, Final Heaven.",
"A diegetic instrument that quietly guards a character's ULTIMATE move: intimacy and reward in one object."),
("Final Fantasy VII (1997)","Turtle's Paradise flyers",
"Six promotional flyers for a Wutai pub are pasted across the entire world \u2014 including one in a time-limited flashback.",
"Read all six, tell the owner, and receive a prize package of rare items.",
"Environmental READING as a global scavenger hunt \u2014 posters become collectibles, zero new art required."),
# --- FF7 Remake ---
("Final Fantasy VII Remake","Darts",
"A full darts board in Seventh Heaven with a hidden leaderboard.",
"Beat Wedge's high score and he gifts you Luck Up materia.",
"Ambient bar game, one clean prize, no menus \u2014 the reward is discovered socially, not advertised."),
("Final Fantasy VII Remake","Wall Market gym contests",
"Rhythm-input squat and pull-up duels against increasingly theatrical gym rivals.",
"Quest items, gear, and escalating rival drama.",
"Physical-comedy rhythm duels: character personality IS the difficulty curve."),
("Final Fantasy VII Remake","Whack-a-Box",
"A timed course of point-valued boxes to smash with optimal routing and ability use.",
"Prizes from the kids' hideout and sidequest completion.",
"Score-attack built from combat verbs \u2014 teaches optimal play patterns disguised as a playground."),
# --- FF7 Rebirth ---
("Final Fantasy VII Rebirth","Queen's Blood",
"A lane-and-pawn card battler with ranked opponents in every settlement, a hidden storyline, and cards sold, won, and hidden across the whole world.",
"New cards, rank titles, story revelations, and gear \u2014 the deck itself is the trophy case.",
"Your favorite: the card hunt makes every town a booster pack. See Mechanics tab for the full breakdown."),
("Final Fantasy VII Rebirth","Piano performances",
"Analog-stick rhythm performances of sheet music found across the world, plus a true free-play mode.",
"A-ranks pay materia per song, all songs pay a 4\u2605 capstone; one sheet is the 100% collection reward.",
"Scored track for rewards + sandbox mode for joy \u2014 two audiences, one instrument."),
("Final Fantasy VII Rebirth","Fort Condor (Rebirth)",
"A retro-toy-styled real-time strategy board game, reborn as an in-universe tabletop craze.",
"Protorelic questline progress and prizes.",
"A 'dead' minigame revived as nostalgia IN-FICTION \u2014 the world itself remembers the original game."),
("Final Fantasy VII Rebirth","3D Brawler",
"A one-on-one fighting game where you read attack tells and dodge-punch in rhythm, up through absurd champion tiers.",
"Gold Saucer prizes and, at the summit, a manuscript for character progression.",
"Pure execution challenge whose top prize feeds the MAIN progression system \u2014 side skill, core payoff."),
# --- FF8 ---
("Final Fantasy VIII","Triple Triad",
"A fast 3x3 card battler playable against nearly every NPC alive; each region runs different rules that spread and mutate as you travel (and can be manipulated); the Queen of Cards questline circulates rare cards around the world.",
"Cards refine (Card Mod) into items and magic \u2014 including some of the game's absolute best \u2014 so the collection converts into raw power.",
"The genre's best card economy: everyone plays, geography has card-culture, and collection transmutes into progression. Your Gwent instinct, fully realized in 1999."),
("Final Fantasy VIII","Chocobo Forests",
"Sonar-and-whistle puzzles in hidden forests to lure down a baby chicobo without startling the flock.",
"Items, a rideable chocobo, and the link to Chocobo World.",
"Gentle puzzle-catching as mount acquisition \u2014 capture as brainteaser, not battle."),
("Final Fantasy VIII","Chocobo World (PocketStation)",
"A tiny idle adventure starring your chicobo on a handheld peripheral, running while the console is off.",
"Items and rare loot imported back into FF8's inventory.",
"1999's companion-app loop: progress that accrues AWAY from the main game and pays back in."),
# --- FF9 ---
("Final Fantasy IX","Tetra Master",
"An arrow-and-battle card game playable against nearly anyone, with a mandatory story tournament and a collector ranking.",
"Cards and collector prestige \u2014 but famously few tangible prizes, and heavy RNG in battles.",
"The cautionary tale beside Triple Triad: collection without power conversion or agency deflates the hunt. Your instinct is right \u2014 card hunts need deck-power payoffs."),
("Final Fantasy IX","Chocobo Hot & Cold",
"Dig against the clock in chocobo forests for chocographs \u2014 treasure PICTURES you must recognize as real world locations \u2014 while Choco's beak level grows with use.",
"World treasure, chocobo traversal upgrades (reef/mountain/sea/sky), Dead Pepper caches, and Chocobo's Paradise.",
"The single best minigame reward design in the series: skill loop + picture riddles + mount upgrades + hidden paradise, all self-feeding. Study this before designing yours."),
("Final Fantasy IX","Jump rope",
"A rhythm endurance test on Alexandria's streets \u2014 tempo shifts as your count climbs toward 1000.",
"Gil tiers, the rare Genji card, and the King of Jump Rope key item.",
"Milestone ladders make one mechanic pay out five times \u2014 but respect wrists: 1000 jumps is a war story, not fun."),
("Final Fantasy IX","Sword fight (the play)",
"During the opening theater performance, input timed commands to impress up to 100 watching nobles.",
"Impress all 100 and the Queen sends 10,000 gil and a Moonstone.",
"A tutorial disguised as theater with a secret perfection prize \u2014 excellence rewarded from minute one."),
("Final Fantasy IX","Frog catching",
"Sneak-and-grab frogs in marshes worldwide, managing the population so they keep breeding (golden frogs are jackpots).",
"Item tiers per catch count, and Quina's Frog Drop damage scales with lifetime frogs caught.",
"A minigame whose score IS a combat stat \u2014 the sillier the fiction, the better that lands."),
("Final Fantasy IX","Hippaul racing",
"Footraces against Hippaul, a boy on Alexandria's streets, whose racer level climbs as you keep beating him.",
"Rare cards at level milestones.",
"A rival who LEVELS UP from losing to you \u2014 the opponent has the progression bar."),
("Final Fantasy IX","Treno Auction House",
"Bid against recurring noble NPCs for rotating rare lots; certain auction exclusives can then be resold to specific collectors around town at a profit.",
"Unique key items, gear \u2014 and an arbitrage metagame for the observant.",
"Auction plus resale market: two-layer economy play in one room of one city."),
("Final Fantasy IX","Festival of the Hunt",
"A timed city-wide monster hunt where three party members compete for points simultaneously.",
"The WINNER determines the prize \u2014 each character offers a different reward, so you choose by helping one win.",
"Player-steered reward selection through play, not menus \u2014 and a city that becomes an arena."),
("Final Fantasy IX","Ragtime Mouse",
"A rare friendly enemy that ambushes you with true/false trivia about the Final Fantasy series itself.",
"Gil per answer and a Protect Ring for a perfect record across all encounters.",
"Fourth-wall quiz as recurring world encounter \u2014 knowledge-of-the-game as a reward track."),
("Final Fantasy IX","Blackjack (post-credits)",
"Finish the game, then enter a button code at the end screen: a hidden blackjack table appears.",
"Nothing but the secret itself.",
"A reward AFTER the reward: secrets placed past the ending turn completion into legend."),
# --- FFX ---
("Final Fantasy X","Blitzball",
"A full underwater sports league with recruiting, leveling, techniques copied from opponents, and seasonal tournaments.",
"Wakka's overdrives and Sigil, player contracts, and a parallel career.",
"The maximal version of minigame-as-second-game \u2014 glorious, and a solo-dev scope warning in one."),
("Final Fantasy X","Lightning dodging",
"Dodge 200 consecutive lightning strikes on the Thunder Plains with no checkpoints.",
"The Venus Sigil for Lulu's ultimate weapon.",
"The infamous counterexample: endurance without checkpoints or expression is a hostage situation, not a challenge."),
("Final Fantasy X","Chocobo training & race",
"Train a chocobo through obstacle drills, then beat a balloon-and-birds race with a total time of 0:00.0.",
"The Sun Sigil for Tidus's ultimate weapon.",
"RNG birds deciding a frame-perfect goal \u2014 study it as the anti-pattern for skill-gated rewards."),
("Final Fantasy X","Butterfly hunt",
"Chase blue butterflies and avoid red ones through Macalania's woods under a timer.",
"The Saturn Sigil for Kimahri's ultimate weapon.",
"Sigil placement made minigames mandatory for combat completion \u2014 decide consciously if your minigames are optional flavor or required mastery."),
("Final Fantasy X","Remiem Temple race",
"A one-on-one chocobo race through temple ruins, grabbing treasure chests without touching poles.",
"The Cloudy Mirror \u2014 upgraded to the Celestial Mirror, the KEY that unlocks every ultimate weapon.",
"One elegant race guards the master key to the entire ultimate-gear system \u2014 gate the gate, not each prize."),
# --- FFX-2 ---
("Final Fantasy X-2","Sphere Break",
"A math-under-pressure coin game: chain coin values into multiples of a core number before time runs out.",
"Winning the Luca tournament awards the Lady Luck dressphere \u2014 an entire job class as a prize.",
"A JOB as a minigame trophy is astonishing generosity \u2014 prize scale creates minigame legends."),
("Final Fantasy X-2","Gunner's Gauntlet",
"An arcade run-and-gun score attack down Besaid's paths with combo multipliers.",
"Score-tier prizes and episode progress.",
"Reskinning a peaceful early zone as a shooting range \u2014 familiar spaces made strange is cheap novelty."),
("Final Fantasy X-2","Calm Lands publicity campaigns",
"Sign with one of two rival minigame companies and pitch their attractions to NPCs across the whole world, raising your marketing rank.",
"Perks, prizes, and completion progress \u2014 plus the Calm Lands' attractions themselves improving.",
"A meta-minigame about PROMOTING minigames \u2014 the park grows because you talked about it everywhere."),
# --- FF12 ---
("Final Fantasy XII","Fishing",
"A rod-timing minigame unlocked by sidequest, with ranked fishing spots and secret rods.",
"Rare items and a completion chain \u2014 though most of FF12's 'minigame' energy went into the Hunt bounty board instead.",
"FF12 shows the substitution: elite HUNTS can carry the side-content load when minigames are thin \u2014 but players still missed the toys."),
# --- FF13-2 ---
("Final Fantasy XIII-2","Serendipity casino",
"A pocket-dimension casino of slots and chocobo racing, added after FF13 shipped with no minigames at all.",
"Unique items and Fragments \u2014 some REQUIRED for 100% completion.",
"The course-correction entry: FF13's minigame-less design was so criticized the sequel built a casino dimension. Absence teaches too."),
# --- FF14 ---
("Final Fantasy XIV","Manderville Gold Saucer (MGP economy)",
"An entire theme-park zone: GATE live events, Cactpot lotteries, Fashion Report judging, mahjong \u2014 all paying MGP, a protected currency.",
"MGP buys exclusive mounts, outfits, emotes, and furniture that exist nowhere else.",
"A decade-old minigame hub kept alive by one rule: its best prizes are PRESTIGE-exclusive and never purchasable elsewhere."),
("Final Fantasy XIV","Triple Triad (revival)",
"The FF8 card game reborn at MMO scale: hundreds of cards hunted from NPC opponents, dungeons, raids, and tournaments across the entire world.",
"Cards, MGP, and completion prestige \u2014 the card list is a tour of everywhere.",
"Your Gwent/Queen's Blood pattern at maximum scale: every corner of the world holds a card, so the collection IS a map of your travels."),
("Final Fantasy XIV","Chocobo racing & breeding",
"Raise a racing chocobo through ranks, then retire it to breed a pedigree line inheriting stats and abilities across generations.",
"Race rewards, MGP, and bloodline mastery.",
"Generational progression inside a minigame \u2014 FF7's breeding idea industrialized."),
# --- FF15 ---
("Final Fantasy XV","Fishing",
"A full angling subsystem: rods, reels, lines, and lures bought and found across the world, a fishing skill that levels with use, and trophy fish with technique demands.",
"Ingredients, gear from the angler questline, skill perks \u2014 even fishing has an upgrade tree.",
"The purest 'everything has upgrades' hobby in the series \u2014 a sub-game with its own gear economy, skill curve, and grail catches."),
("Final Fantasy XV","Justice Monsters Five",
"A pinball-like monster battler cabinet at rest stops.",
"Items and accessories (at an infamously grindy rate).",
"Cross-promotional filler with weak reward pacing \u2014 the negative print of the Battle Square lesson."),
("Final Fantasy XV","Totomostro",
"A monster colosseum where you BET medals on beast teams rather than fight yourself.",
"Medal winnings exchange for exclusive items.",
"Spectator gambling on the game's own bestiary \u2014 your monster knowledge becomes handicapping skill."),
("Final Fantasy XV","Chocobo racing (Wiz's ranch)",
"Rent, name, and level chocobos, racing courses and hoop trails around the ranch.",
"Gil, items, and higher chocobo levels improving your actual overworld mount.",
"Race performance upgrading your REAL traversal mount closes the loop between toy and tool."),
("Final Fantasy XV","Camp hobbies (cooking & photography)",
"Ignis learns recipes from ingredients, restaurants, and sights; Prompto auto-photographs the day and you keep favorites at camp.",
"Meal buffs from found recipes; a photo album that becomes the game's emotional ledger.",
"Hobby loops that level by DOING and reward with memory \u2014 the photo review at camp is reward-as-ritual."),
]

mg_entries = []
for i,(g,n,p,r,l) in enumerate(MG, 1):
    mg_entries.append('{id:"g%03d",g:%s,n:%s,p:%s,r:%s,l:%s}' % (i, js(g), js(n), js(p), js(r), js(l)))
mg_block = "const MINIGAMES = [\n" + ",\n".join(mg_entries) + "\n];\n\n"

anchor = "/* ============================= STATE ============================= */"
assert html.count(anchor) == 1
html = html.replace(anchor, mg_block + anchor)

# ============ 2. MECHANICS: Tetra Master + Gwent ============
mechs = [
('M131',"Final Fantasy IX","Tetra Master (card collection without conversion)","Side Content & Minigames",
"An arrow-based card battler playable against nearly any NPC, with a collector ranking and a mandatory story tournament. Card battles resolve with heavy hidden RNG, and the collection never converts into items, power, or currency.",
"Win matches \u2192 grow a collection \u2192 ... and that's where it stops. The hunt is fun; the payoff shelf is empty.",
"Maybe",
"You hoped to find this here \u2014 and its absence of rewards is exactly the lesson. Compare FF8's Triple Triad (cards refine into best-in-game items) and Witcher 3's Gwent: a card hunt thrives when new cards visibly POWER UP the deck and the collection converts into something. Steal Tetra Master's ubiquity (everyone plays), fix its economy."),
('M132',"The Witcher 3","Gwent (shop-hunted deck building)","Side Content & Minigames",
"A lane-based card game where your starting deck is deliberately weak and grows ONLY through acquisition: nearly every innkeeper and merchant sells a few cards, most named NPCs play exactly once for a unique card, and quests and tournaments award the rares. Checking every shop's card stock becomes second nature.",
"Enter any town \u2192 check the shopkeeper \u2192 sometimes a new card \u2192 deck visibly stronger \u2192 shops become treasure chests and the world becomes a booster box.",
"Yes",
"Your own insight: the card hunt made the WORLD fun. The design keys: (1) vendors everywhere hold cards so every stop has slot-machine potential, (2) one-per-NPC uniques make people collectible, (3) every card mechanically matters in the deck. This plus Queen's Blood's ranked ladder is your card game's blueprint."),
]
mech_js = []
for mid,g,n,c,how,loop,want,notes in mechs:
    mech_js.append('{id:%s,game:%s,name:%s,cat:%s,\nhow:%s,\nloop:%s,\nrating:0,want:%s,\nnotes:%s}'
                   % (js(mid), js(g), js(n), js(c), js(how), js(loop), js(want), js(notes)))
mech_anchor = "];\n\nconst BASE_GAMES = ["
assert html.count(mech_anchor) == 1
html = html.replace(mech_anchor, ",\n" + ",\n".join(mech_js) + "\n];\n\nconst BASE_GAMES = [")

game_anchor = "];\n\nconst PILLARS = ["
assert html.count(game_anchor) == 1
w3 = '{title:"The Witcher 3",year:2015,dev:"CD Projekt Red",status:"Researched",\nwhy:%s}' % js(
"Not a JRPG, but Gwent is the definitive shop-hunted card collection \u2014 the pattern you loved that makes every merchant a treasure chest.")
html = html.replace(game_anchor, ",\n" + w3 + "\n];\n\nconst PILLARS = [")

# ============ 3. STORE DEFAULTS ============
html = html.replace(
 "let store = {overrides:{}, customMechs:[], customGames:[], gameStatus:{}};",
 "let store = {overrides:{}, customMechs:[], customGames:[], gameStatus:{}, minigameFavs:{}};")
html = html.replace(
 "store = Object.assign({overrides:{},customMechs:[],customGames:[],gameStatus:{}}, data.store);",
 "store = Object.assign({overrides:{},customMechs:[],customGames:[],gameStatus:{},minigameFavs:{}}, data.store);")

# ============ 4. CSS ============
css_anchor = ".notes-p{color:var(--ink-dim); font-style:italic;}"
assert html.count(css_anchor) == 1
html = html.replace(css_anchor, css_anchor + """
  .rew{
    border:1px solid color-mix(in srgb, var(--gold) 40%, var(--line));
    background:color-mix(in srgb, var(--gold) 8%, transparent);
    border-radius:8px; padding:10px 13px; margin:10px 0;
  }
  .rew .flabel{color:var(--gold);}
  .mg-card{padding:14px 18px 15px;}
  .mg-top{display:flex; align-items:center; gap:10px; flex-wrap:wrap;}
  .mg-top h3{font-size:15.5px; color:#eef3ff;}
  .mg-game{font-size:11.5px; letter-spacing:.08em; text-transform:uppercase; color:var(--ink-faint);}
  .favbtn{margin-left:auto;}
  .mg-play{margin-top:7px;}""")

# ============ 5. TAB BUTTON ============
tab_anchor = '<button class="tab" role="tab" aria-selected="false" data-view="games">Games</button>'
assert html.count(tab_anchor) == 1
html = html.replace(tab_anchor,
 '<button class="tab" role="tab" aria-selected="false" data-view="minigames">Minigames</button>\n  ' + tab_anchor)

# ============ 6. SECTION HTML ============
sec_anchor = "  <!-- ================= GAMES ================= -->"
assert html.count(sec_anchor) == 1
section = """  <!-- ================= MINIGAMES ================= -->
  <section class="view" id="view-minigames">
    <div class="filters">
      <div class="frow">
        <input type="search" id="mgq" placeholder="Search minigames\u2026 (e.g. cards, racing, piano)">
        <select id="mgGame"><option value="">All games</option></select>
        <label class="chip" style="cursor:pointer"><input type="checkbox" id="mgFav" style="accent-color:#f2cb4e"> Saved ideas only</label>
      </div>
    </div>
    <p class="count-note" id="mgCount"></p>
    <div id="mgCards"></div>
  </section>

"""
html = html.replace(sec_anchor, section + sec_anchor)

# ============ 7. RENDER FUNCTION ============
init_anchor = "/* ============================= INIT ============================= */"
assert html.count(init_anchor) == 1
fn = """/* ============================= MINIGAMES ============================= */
function buildMgFilters(){
  const sel = $("#mgGame"); const cur = sel.value;
  sel.innerHTML = '<option value="">All games</option>' +
    [...new Set(MINIGAMES.map(m=>m.g))].map(g=>`<option${g===cur?" selected":""}>${esc(g)}</option>`).join("");
}
function renderMinigames(){
  const q = $("#mgq").value.trim().toLowerCase();
  const g = $("#mgGame").value, favOnly = $("#mgFav").checked;
  const list = MINIGAMES.filter(m=>{
    if(g && m.g!==g) return false;
    if(favOnly && !store.minigameFavs[m.id]) return false;
    if(q && !(m.n+" "+m.g+" "+m.p+" "+m.r+" "+m.l).toLowerCase().includes(q)) return false;
    return true;
  });
  $("#mgCount").textContent = list.length + " minigame" + (list.length===1?"":"s") + " shown";
  const box = $("#mgCards"); box.innerHTML = "";
  if(!list.length){ box.innerHTML = '<div class="empty">Nothing matches. Clear the filters to see the full arcade.</div>'; return; }
  list.forEach(m=>{
    const fav = !!store.minigameFavs[m.id];
    const card = document.createElement("article");
    card.className = "card mg-card";
    card.innerHTML = `
      <div class="mg-top">
        <h3>${esc(m.n)}</h3><span class="mg-game">${esc(m.g)}</span>
        <button class="wbtn favbtn ${fav?"on-Maybe":""}">${fav?"\u2605 Idea saved":"\u2606 Save idea"}</button>
      </div>
      <p class="mg-play">${esc(m.p)}</p>
      <div class="rew"><div class="flabel">Rewards</div><p>${esc(m.r)}</p></div>
      <p class="notes-p">${esc(m.l)}</p>`;
    card.querySelector(".favbtn").addEventListener("click", ()=>{
      if(store.minigameFavs[m.id]) delete store.minigameFavs[m.id];
      else store.minigameFavs[m.id] = true;
      persist(); renderMinigames();
    });
    box.appendChild(card);
  });
}
["mgq","mgGame","mgFav"].forEach(id=> $("#"+id).addEventListener("input", renderMinigames));

"""
html = html.replace(init_anchor, fn + init_anchor)

# ============ 8. INIT CALLS + STATS ============
html = html.replace("buildFilters(); renderCards(); renderGames(); renderStats();",
 "buildFilters(); renderCards(); renderGames(); renderStats(); buildMgFilters(); renderMinigames();")

stats_anchor = '<div class="stat"><b>${done} / ${gs.length}</b><span>Games researched</span></div>`;'
assert html.count(stats_anchor) == 1
html = html.replace(stats_anchor,
 '<div class="stat"><b>${done} / ${gs.length}</b><span>Games researched</span></div>\n    <div class="stat"><b class="y">${MINIGAMES.length}</b><span>Minigames cataloged</span></div>`;')

open(path, "w", encoding="utf-8").write(html)
print("patched: %d minigames, mechanics through M132" % len(MG))
