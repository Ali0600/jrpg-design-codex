# Trails in the Sky — research digest

Codex: `Trails in the Sky` (2004, PC in Japan) · GameFAQs: `/psp/933329-the-legend-of-heroes-trails-in-the-sky`
confirmed 2026-09-14 (the row's harvested `gf.u`: the 2011 PSP release, the first in English) · digest started 2026-09-14

> Facts only, in our own words. Item names and numbers may be quoted; guide prose may not.
> Every fact carries a pointer: `[gf:<id> §<section>, <author> v<ver>]` or `[wiki:<host>/<Page>]`.

## Sources

| id | title | author | version | updated | category | KB | url |
|---|---|---|---|---|---|---|---|
| 62079 | Guide and Walkthrough | Berserker_Blade | 1.10 | 05/27/2011 | Full Game Guides | 210 | https://gamefaqs.gamespot.com/psp/933329-the-legend-of-heroes-trails-in-the-sky/faqs/62079 |
| 70899 | Quartz/Arts Guide (grep only) | KholdStareMud | 1.0 | 12/22/2014 | In-Depth Guides | 35 | https://gamefaqs.gamespot.com/psp/933329-the-legend-of-heroes-trails-in-the-sky/faqs/70899 |
| 62082 | Guide and Walkthrough (grep only) | yangxu | 1.37 | 06/08/2011 | Full Game Guides | 319 | https://gamefaqs.gamespot.com/psp/933329-the-legend-of-heroes-trails-in-the-sky/faqs/62082 |

Coverage 62079: a formatted guide over 4 pages (51,726, 52,748, 52,929 and 31,498 chars), no whole
section read. Page 1: greps for hidden quests, recipes, fishing, BP and the collectible books, and
a `lines()` read at the first job's results box. Pages 2 and 3: greps for rank and hidden jobs.
Page 4: greps for recipes, secrets and BP, and `lines()` reads across the whole 58-row recipe table
and the FAQ. Unread: the chapter walkthroughs beyond the grep hits, and the shop, orbment and
character chapters.

Coverage 70899: single page, 36,742 chars, 326 lines, 49 sections — no whole section read. The
contents and one grep (slot, unlock and sepith, 28 hits with 7 cut by the size cap). Largest unread:
Attack Arts (6,350 chars), Quartz Drops Locations (3,485) and the Sealed Area chapters.

Coverage 62082: grep only — 318,821 chars, 7,862 lines, 516 sections, 0 sections read. Three greps:
recipes (48 hits), hidden quests (39), casino (none). Everything else unread, including its item,
book and quartz lists.

## Triage

`__gf.triage()` on 2026-09-14: 13 guides listed (6 Full Game Guides, 3 In-Depth Guides, 4 under
other headings: dungeon maps of the Aureole Sealed Area under Maps and Charts, not read). The
decisions are the plan made before any guide was opened; a plan that changes is recorded here. The Quartz/Arts guide moved
from read to grep only: its contents and one grep answered what this pass asked of it.

| id | title | author | category | KB | score | decision |
|---|---|---|---|---|---|---|
| 70899 | Quartz/Arts Guide | KholdStareMud | In-Depth Guides | 35 | 5 | grep only |
| 56518 | Story Guide | coldkgon_mkII | In-Depth Guides | 96 | 4 | skipped — a plot guide, no mechanics |
| 62079 | Guide and Walkthrough | Berserker_Blade | Full Game Guides | 210 | 3 | read |
| 79398 | Guide and Walkthrough | Kartarius | Full Game Guides | 1089 | 2 | skipped — the largest walkthrough, held in reserve as a cross-check |
| 62082 | Guide and Walkthrough | yangxu | Full Game Guides | 319 | 2 | grep only |
| 78291 | Guide and Walkthrough | Kartarius | Full Game Guides | 265 | 2 | skipped — an earlier walkthrough by the same author as 79398 |
| 82117 | Guide and Walkthrough | shockinblue | Full Game Guides | 220 | 2 | skipped — a fifth walkthrough |
| 31436 | Guide and Walkthrough | girianshiido | Full Game Guides | 50 | 2 | skipped — written in 2004 for the Japanese PC original |
| 42367 | Translation Guide | ch00ch002u | In-Depth Guides | 10 | -2 | skipped — a translation aid for the Japanese release |

## Mechanics candidates

### A cookbook filled by tasting your way around the kingdom
cat: Exploration & Rewards
how: Estelle cannot cook a dish until she has eaten it. Bars, inns, cafés, crepe and ice-cream stands each serve their own dishes, and eating one adds its recipe to her book; a few come instead from dungeon chests, as job rewards, or from a cookbook left in a factory lab. The walkthrough's table holds 58, and the strongest heals are first tasted far from home: Pot O' Meat, from a border gate's mess hall, restores 5,000 HP and revives the whole party.
loop: stop at every counter in a new town → eat what it serves → the dish joins the recipe book → buy its ingredients or hunt the monster parts → carry a better heal into the next dungeon
notes: A collection that rewards visiting every building rather than every corner of a dungeon, and it converts straight into power: each tasted dish is a new consumable with its own effect, some with battle stats such as MOV +2 or SPD +30%. The detail worth copying is the gate — taste before you can cook — which turns towns into a treasure map and gives every café a reason to exist. One dish, Abaddon Potluck, drops an ally to 1 HP, a small joke that makes experimenting feel like a real choice.
pointers: [gf:62079 §Recipes, Berserker_Blade v1.10] [gf:62082 §Recipes, yangxu v1.37] [wiki:kiseki.fandom.com/Tomorrow's Cooking]
row: M284
- The first recipe comes with the Recipe Book: the general store's owner hands over a Maple Cookie too, and eating it adds the cookie's recipe [gf:62082 §Recipes, yangxu v1.37]
- More are learned by ordering from the bartender at the café north of the orbment factory and eating what he serves [gf:62082 §Recipes, yangxu v1.37]
- The cookbook in the lab, Tomorrow's Cooking, sits in the Zeiss Central Factory's lab room; it is one of the books a librarian lent out, and reading it teaches Bouillabaisse Plus [wiki:kiseki.fandom.com/Tomorrow's Cooking] [gf:62079 §Temp Librarian, Berserker_Blade v1.10]
- Certain dishes also restore CP, the gauge that crafts spend [gf:62082 §Crafts, yangxu v1.37]

### Hidden jobs that exist only between two story beats
cat: Exploration & Rewards
how: Beyond the jobs posted at the guild, most chapters hide a few that are never posted, eleven across the game, and they are found by noticing: a notebook in a chest under a vacuum cleaner in a bandit hideout, a faint blue trail on the road that gives away a hidden cliffside path, a borrowed book whose return starts a hunt for the rest. Every job, posted or hidden, has a window: new ones appear just before the main job is reported and expire after a named story step. Each is graded in Bracer Points by how it was done, with bonus points for the right dialogue choice or an unseen approach and points lost for being spotted.
loop: talk to everyone before reporting the main job → spot the odd detail that opens a hidden job → finish it well inside its window → bank bonus BP toward the rank, and carry a perfect total into the sequel
notes: M220 is the guild's rank ladder; this row is the part that turns the ladder into an exploration system. The hidden jobs reward attention rather than walking, and the windows make a town worth re-reading after every story beat instead of once. The grading is the other lesson: a job scored on HOW it was done (the choice, the stealth) gives side content stakes without a fail state. Copy the windows with care. The walkthrough's first tip is to keep a save before every story step, which is the sound of a player afraid of missing things; a softer version could show that a hidden job existed once its window closes.
verbs: Latent geometry
pointers: [gf:62079 §Sidequests, Berserker_Blade v1.10] [wiki:kiseki.fandom.com/List of quests (Sky FC)/Chapter 3] [gf:62082 §Hidden Quests, yangxu v1.37]
row: M285
- The wiki's chapter lists count the hidden jobs: none in the Prologue, two in Chapter 1, four in Chapter 2, five in Chapter 3 and none in the Final Chapter [wiki:kiseki.fandom.com/List of quests (Sky FC)/Prologue] [wiki:kiseki.fandom.com/List of quests (Sky FC)/Chapter 1] [wiki:kiseki.fandom.com/List of quests (Sky FC)/Chapter 2] [wiki:kiseki.fandom.com/List of quests (Sky FC)/Chapter 3] [wiki:kiseki.fandom.com/List of quests (Sky FC)/Final Chapter]
- A second walkthrough gives hidden quests their own section, numbered in the same order as the wiki: Amberl Tower Mystery, Black Notebook, Lighthouse Monsters, Decorate the Campus, Research Materials Hunt [gf:62082 §Hidden Quests, yangxu v1.37]
- New sidequests usually appear just before a main job is reported, and every entry in the walkthrough carries a timeframe and the story step it expires after [gf:62079 §Sidequests, Berserker_Blade v1.10]
- Two prologue jobs show the pay: Find the Shiny Rock pays 30 mira, 2 BP and 5 Drill Meatballs, whose recipe comes with them, and Orbment Replacement pays 600 mira and 3 BP, plus a bonus point and an Impede 2 quartz for sending Joshua and entering the lamp's code correctly [gf:62079 §Sidequests, Berserker_Blade v1.10] [gf:62079 §Recipes, Berserker_Blade v1.10]

## Minigame candidates

None with defined payouts. Fishing exists only at one lakeshore on a borrowed rod and yields recipe
ingredients (see Unverified), and the Lavantar Casino & Bar appears in this pass only as a clue
location in a job and as a place to taste two dishes. Recorded, not padded.

## Exploration & upgrade facts

### Hidden
- The wiki sorts every chapter's jobs into Required, Optional and Hidden: the Prologue has no hidden job, while Chapter 1 has two, Amberl Tower Mystery and Black Notebook [wiki:kiseki.fandom.com/List of quests (Sky FC)/Chapter 1] [wiki:kiseki.fandom.com/List of quests (Sky FC)/Prologue]
- Hidden jobs hang on noticing things: the Black Notebook one needs sits in a chest under a vacuum cleaner in the Sky Bandit hideout, and a Jeweled Ring in the same hideout belongs to the Stolen Ring job [gf:62079 §Sky Bandit's hideout, Berserker_Blade v1.10]
- A faint blue trail on the road outside Ruan gives away a hidden cliffside path; the barrel at its end holds a Torn Map and Daggers that a boy at the chapel trades for Skull Daggers, and saving that boy early in Chapter 2 is worth two extra BP [gf:62079 §Secret of the Old Map, Berserker_Blade v1.10]
- One job opens a hidden chain: returning a librarian's books in Zeiss starts a hunt for the rest of them across the region, and reading one, Tomorrow's Cooking, teaches Bouillabaisse Plus [gf:62079 §Temp Librarian, Berserker_Blade v1.10]
- The walkthrough marks hidden jobs with an exclamation mark in its sidequest list, and one of them is a monster job at the Varene lighthouse near Manoria [gf:62079 §Sidequests, Berserker_Blade v1.10] [gf:62079 §Manoria Byroad, Berserker_Blade v1.10]
- Apart from the first two volumes of the Carnelia novel, every collectible book volume can be missed [gf:62079 §General Question, Berserker_Blade v1.10]
- Many hidden items and quests exist only in the short windows between story steps, so the walkthrough advises talking to townspeople before every major mission rather than rushing ahead [gf:62079 §Tips and Tricks, Berserker_Blade v1.10]
- The walkthrough warns that many quests are hidden and missable, and tells a completionist to keep a separate save before every significant story step, since a minor choice can close one off for the rest of the game [gf:62079 §Tips and Tricks, Berserker_Blade v1.10]

### Upgrades
- Orbment slots are opened with sepith as the game goes: the arts guide's route opens Joshua's second slot in the Rolent sewers and Estelle's in the Malga Mine [gf:70899 §Rolent Sewers, KholdStareMud v1.0] [gf:70899 §Malga Mine, KholdStareMud v1.0]
- After the Fire sepith haul from the bandit hideout, the same route opens every remaining slot for both [gf:70899 §Bose, KholdStareMud v1.0]
- The guide says to spend no sepith opening Scherazard's slots [gf:70899 §Ravennue, KholdStareMud v1.0]
- Doing every prologue side quest should reach rank 7, which the arts guide says is rewarded with an Impede 2 quartz [gf:70899 §Malga Mine, KholdStareMud v1.0]
- Stronger arts cost more quartz: the guide argues a top-tier fire art is not worth the two extra quartz it needs, because a cheaper one's damage catches up at high ATS [gf:70899 §Attack Arts, KholdStareMud v1.0]
- The recipe table lists 58 dishes, each with its effect, its ingredients, where it is first tasted, and whether it is To-Go or Sit-In [gf:62079 §Recipes, Berserker_Blade v1.10]
- Most dishes are first tasted where they are served, at bars, inns, cafés, crepe and ice-cream stands, an academy cafeteria and a fort's mess hall; others come from dungeon chests (Esmeldas, Amberl and Carnelia Towers), job rewards, or a cookbook read in a Zeiss lab [gf:62079 §Recipes, Berserker_Blade v1.10]
- The biggest heals are found furthest afield: Pot O' Meat, first eaten in the Sanktheim Gate mess hall, restores 5,000 HP and revives the whole party, and takes three each of beast, fish and fowl monster meat, three Marbled Steak, a Vintage Wine and Aged Miso [gf:62079 §Recipes, Berserker_Blade v1.10]
- Some dishes carry battle stats: French Fries give MOV +1, Holey Popcorn MOV +2, Fruity Milk SPD +30%, Chomping Spare Ribs STR and DEF +15%; one is a trap, Abaddon Potluck, which drops a random ally to 1 HP [gf:62079 §Recipes, Berserker_Blade v1.10]
- The fish from the single fishing spot feed the Kingfisher Inn's dishes, from Deep-Fried Smelt at 200 HP to Salmon Meuniere at 600 HP [gf:62079 §Recipes, Berserker_Blade v1.10]
- The bracer's promotion comes from Recommendations: the fifth, from the capital's branch after the final boss, completes the set and earns it [gf:62079 §City of Grancel: Queen's Birthday, Berserker_Blade v1.10]
- Every job starts at the guild and pays mira and items, and each adds Bracer Points to a running tally that sets the bracer's rank; the right dialogue choices, or acting proactively inside a job, earn extra BP [gf:62079 §Bracers Guild, Berserker_Blade v1.10]
- The walkthrough's results boxes list mira and BP per job with any bonus beside it: 500 mira and 1 BP for the training job, 1,000 mira and 3 BP with a 1-point bonus for the first rescue, the bonus earned by choosing to run alongside Joshua [gf:62079 §Child Rescue: Malga Trail, Berserker_Blade v1.10]
- Sneaking is graded as well: being spotted while creeping up on a farm's crop thief costs BP [gf:62079 §Perzel Farm, Berserker_Blade v1.10]
- Lost BP cannot be won back within the same playthrough; the guide's options are reloading an earlier save or making it up on New Game+ [gf:62079 §Tips and Tricks, Berserker_Blade v1.10]
- A maximum BP total is worth chasing because it carries an advantage into the next game through the save transfer [gf:62079 §General Question, Berserker_Blade v1.10]
- Cooking is learned by eating: a dish must be eaten once before its recipe is known, after which it can be cooked from ingredients; dishes restore HP, EP or CP, often with a temporary stat boost [gf:62079 §Cooking, Berserker_Blade v1.10]
- The first recipe comes early: finishing bracer training yields a Recipe Book and a Maple Cookie, and eating the cookie teaches its recipe [gf:62079 §Rolent Sewers, Berserker_Blade v1.10]

### Shops & exchange
- Town shops sell the basic ingredients: 4 mira for Milled Flour, Maple Sugar or Kibbled Salt, 10 for Fresh Eggs, 100 for Marbled Steak, 300 for Vintage Wine or Aged Miso in Bose [wiki:kiseki.fandom.com/List of shops (Sky FC)/Bose]

## Unverified or contradicted
- Two guides tie an Impede 2 quartz to different prologue rewards: the walkthrough to the Orbment Replacement job done with Joshua and the right code, the arts guide to reaching rank 7 with every side quest done. Both may be true [gf:62079 §Sidequests, Berserker_Blade v1.10] [gf:70899 §Malga Mine, KholdStareMud v1.0]
- The Lavantar Casino & Bar turns up in a job only as a clue location (a roulette wheel to examine) and as a place to taste two dishes; no gambling minigame was found in this pass [gf:62079 §Candelabrium Theft, Berserker_Blade v1.10] [gf:62079 §Recipes, Berserker_Blade v1.10]
- The walkthrough calls the Black Notebook job the hidden mission of Chapter 2, while the wiki lists it among Chapter 1's hidden jobs [gf:62079 §Sky Bandit's hideout, Berserker_Blade v1.10] [wiki:kiseki.fandom.com/List of quests (Sky FC)/Chapter 1]
- M220 says the rank held at each chapter's audit pays out a reward package. This pass found no such package: the walkthrough shows mira and BP per job and five Recommendations that earn the promotion. The arts guide does mention a rank-7 reward in the prologue. M220 was not edited [gf:62079 §Bracers Guild, Berserker_Blade v1.10] [gf:62079 §City of Grancel: Queen's Birthday, Berserker_Blade v1.10]
- **Fishing is thin in this game.** Sky FC allows it only at Valleria Lakeshore, on a rod borrowed from the inn, choosing one of three spots, baits and reeling methods; the fish become recipe ingredients and nothing more. The sequel is where rods, sizes, a fishing journal and fish that drop accessories arrive, so no fishing minigame with payouts is recorded for this game [wiki:kiseki.fandom.com/Fishing] [gf:62079 §Valleria Shore, Berserker_Blade v1.10]

## Codex rows

```js
// Spliced into JRPG_Design_Codex.html on 2026-09-14 by
// scripts/splice_rows.mjs (the rows there are the source of truth; this is the map).
// M284  A cookbook filled by tasting your way around the kingdom  Exploration & Rewards
// M285  Hidden jobs that exist only between two story beats       Exploration & Rewards
```

## Codex delta
- M284 (the cookbook) and M285 (the hidden jobs), spliced 2026-09-14 into that day's wave 3 changelog entry, retitled to name both games.
- M219 (orbments) and M220 (the Bracer rank) were not edited: the arts guide touches M219's slots, and M220's reward-package claim is recorded under Unverified.
- No minigame: fishing and the casino came back thin.
