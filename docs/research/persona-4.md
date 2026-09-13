# Persona 4 — research digest

Codex: `Persona 4` (2008, PlayStation 2) · GameFAQs: `/ps2/945498-shin-megami-tensei-persona-4` confirmed
2026-09-14 (the row's harvested `gf.u`; the page's Release line reads December 9, 2008) · digest started 2026-09-14

> Facts only, in our own words. Item names and numbers may be quoted; guide prose may not.
> Every fact carries a pointer: `[gf:<id> §<section>, <author> v<ver>]` or `[wiki:<host>/<Page>]`.

## Sources

| id | title | author | version | updated | category | KB | url |
|---|---|---|---|---|---|---|---|
| 56627 | Quest FAQ | ssk9716757 | 1.01 | 12/04/2017 | In-Depth Guides | 26 | https://gamefaqs.gamespot.com/ps2/945498-shin-megami-tensei-persona-4/faqs/56627 |
| 55038 | Max Social Link Guide | penguin_knight | 1.5 | 02/03/2009 | In-Depth Guides | 89 | https://gamefaqs.gamespot.com/ps2/945498-shin-megami-tensei-persona-4/faqs/55038 |
| 53550 | Guide and Walkthrough (grep only) | Zoel | 0.65 | 05/08/2013 | Full Game Guides | 815 | https://gamefaqs.gamespot.com/ps2/945498-shin-megami-tensei-persona-4/faqs/53550 |
| 60532 | Guide and Walkthrough (grep only, cross-check) | neoXsaga | 2.2 | 06/03/2017 | Full Game Guides | 618 | https://gamefaqs.gamespot.com/ps2/945498-shin-megami-tensei-persona-4/faqs/60532 |
| 65252 | Walkthrough (grep only, item names) | KADFC | 0.86 | 11/16/2012 | Full Game Guides | 530 | https://gamefaqs.gamespot.com/ps2/945498-shin-megami-tensei-persona-4/faqs/65252 |

Coverage 56627: single page, 26,796 chars, 666 lines, 4 sections — no whole section read; greps:
reward (25 hits), fox|fish|Daidara (18 hits); four `lines()` reads at the introduction's reward
paragraph and at requests No. 06, No. 22 and No. 48. Unread: the Quests list itself (22,372
chars) beyond those hits — a per-request walkthrough whose every reward line surfaced through the
reward grep.

Coverage 55038: single page, 88,024 chars, 3,532 lines, 30 sections — no whole section read;
greps: discount|cheaper|SP restor|price (6 hits), fishing|old man|Guardian (8 hits); three
`lines()` reads at the social-link basics (the A–E list of what a link gives), the fox's
joining note on 5/5 and a fishing note. Unread: the 69,236-char day-by-day schedule beyond the
grep hits, which is answer and calendar data rather than rules.

Coverage 60532: grep only — 622,021 chars, 11,603 lines, 151 sections, 0 sections read. Three greps
(the sixteen prize names, 27 hits with 3 cut by the size cap; selling materials to the smith, 3;
August's and December's prizes, 2) plus `lines()` reads at its May and September trade lists.
Largest unread: a 176,467-char appendix section and the day-by-day chapters.

Coverage 65252: grep only — 536,349 chars, 6,889 lines, 277 sections, 0 sections read. One grep for
the disputed prize names (13 hits), used only to settle their spellings. Everything else unread,
including its 17,021-char New Game Plus guide.

Coverage 53550: **grep only, by design** — 815,065 chars, 19,793 lines, 2,543 sections, 0 sections
read. Four greps (Daidara, 236 hits; old man and the fish names, 90; Shuffle Time, 3; fog and
forecast, 8) plus `lines()` reads at the smithy's entry in the town guide, the opening of the
weapon chapter, and the whole fishing chapter with its monthly Fish Exchange table. No section
reaches 8,000 chars; the other 2,540 went unread.

## Triage

`__gf.triage()` on 2026-09-14: 11 guides listed (4 Full Game Guides, 6 In-Depth Guides, 1 under
other headings: a Fusion Chart under Maps and Charts, not read). The decisions are the plan made
before any guide was opened; a plan that changes is recorded here. Two walkthroughs moved from
skipped to grep only: neoXsaga's, to cross-check the old man's prize table from a second author,
and KADFC's, to settle the item names those two disagreed on.

| id | title | author | category | KB | score | decision |
|---|---|---|---|---|---|---|
| 55038 | Max Social Link Guide | penguin_knight | In-Depth Guides | 89 | 5 | read |
| 56627 | Quest FAQ | ssk9716757 | In-Depth Guides | 26 | 4 | read |
| 60201 | Song Lyrics FAQ | piecemealcranky | In-Depth Guides | 25 | 4 | skipped — song lyrics: no mechanics, and lyrics are never quoted |
| 53550 | Guide and Walkthrough | Zoel | Full Game Guides | 815 | 3 | grep only |
| 70246 | Quiz Answer List | firefox8259 | In-Depth Guides | 2 | 3 | skipped — a 2 KB list of classroom answers |
| 60532 | Guide and Walkthrough | neoXsaga | Full Game Guides | 618 | 2 | grep only |
| 65252 | Walkthrough | KADFC | Full Game Guides | 530 | 2 | grep only |
| 55517 | Guide and Walkthrough | PeTeRL90 | Full Game Guides | 408 | 2 | skipped — a fourth walkthrough |
| 55505 | Boss Guide | Jeddi_kun | In-Depth Guides | 78 | 1 | skipped — boss strategy, no pillar material |
| 81155 | Japanese Game Script (Japanese) | BrideInMyDreams | In-Depth Guides | 1872 | -1 | skipped — a game script |

## Mechanics candidates

### A smithy whose shelves are stocked by the materials you sell it
cat: Economy & Currency
how: Monsters almost never drop equipment. Instead nearly every weapon past the starters has a recipe at Daidara's smithy: sell the smith a set number of one Shadow's material and that piece goes on sale. The walkthrough prints each recipe beside the Shadow that drops it — 6 Black Lamps from Black Ravens for the Long Sword, 10 Supple Metal from Magical Magus for the 5-Iron — and the smith himself hints at what a piece needs when you talk to him.
loop: hunt a named Shadow for its material → sell the full count to the smith → a new weapon appears on the shelf → the dungeon's monster list reads as a shopping list
notes: This is FF12's loot-for-the-bazaar idea (M208) made legible: one material, one fixed count, one item, and the shopkeeper tells you what he is short of. FF12 hides its recipes, so its players read a wiki; here the game points at the next hunt itself, and every Shadow becomes a known ingredient. For the owner's "shops have upgrades too" pillar, copy the legibility rather than the opacity: publish or hint the count and name the monster, so the upgrade is a plan the player makes rather than an accident they stumble into.
verbs: Shop stock
pointers: [gf:53550 §Weapon List, Zoel v0.65] [gf:56627 §Quests, ssk9716757 v1.01] [wiki:megamitensei.fandom.com/Daidara Metalworks]
row: M282
- Equipment is almost never dropped by monsters (the Reaper aside): materials are collected from Shadows and a set number sold back to the weapon shop before new stock can be bought, with rare treasure chests the occasional exception [gf:53550 §Weapon List, Zoel v0.65]
- The walkthrough's town guide contrasts it with Persona 3: the smithy offers new stock only after the materials are sold to it [gf:53550 §Shopping District, South, Zoel v0.65]
- Each recipe names its source: Long Sword for 6 Black Lamps from Black Ravens, 5-Iron for 10 Supple Metal from Magical Magus, Iai Katana for 10 Golden Cloth from Phantom Mages, Zweihander for 8 Pure Iron Lumps from Iron Dice [gf:53550 §Weapon List, Zoel v0.65]
- Prices climb with the recipe: 10,000 yen for the Long Sword, 18,000 for the Zweihander, 38,000 for the Gardenia Sword made from 6 Damascus [gf:53550 §Weapon List, Zoel v0.65]
- A second author shows the rule inside a request: 10 Thick Hides given to Daidara make the Hard Boots a townsperson wants [gf:56627 §Quests, ssk9716757 v1.01]
- A third author's walkthrough tells the player to sell the materials from the first dungeon so the smith can make new weapons, and warns against selling one Silver Lump because a later request needs it [gf:60532 §Walkthrough, neoXsaga v2.2]
- Talking to Daidara makes him hint at the materials a random piece needs [wiki:megamitensei.fandom.com/Daidara Metalworks]

### A fox whose healing gets cheaper as you grant the town's wishes
cat: Economy & Currency
how: A fox living at the town shrine hands out wishes written on ema plaques, each one a small errand for somebody in town, and granting a wish raises the fox's Social Link. Inside the TV dungeons the same fox sells SP recovery, and its price falls with that rank: 60 yen per SP at rank 1, 15 yen at rank 10, with a bad mood pushing a given day's price up. When every wish is granted, the townsfolk's offerings pay to restore the run-down shrine, and the fox hands over an item that unlocks a Persona fusion.
loop: grant a townsperson's wish from the fox's ema → the fox's rank rises → its dungeon healing costs a quarter of what it did → every dive runs longer, and at the end the shrine itself is rebuilt
notes: The owner's "shops have upgrades too" pillar, earned through side errands instead of money, and paid out where it matters most: SP is the scarce resource inside a dungeon, so a cheaper healer is felt on every dive. Two details are worth copying. The price is a ratio the player can watch shrink (60 → 15 per point), which makes each rank legible. And the last payoff is a PLACE: the shrine the wishes were for is visibly restored, so the errands accumulate into something standing in the world. The mood swing in price is a small, cheap source of variety.
verbs: Consequence
pointers: [gf:56627 §Introduction, ssk9716757 v1.01] [gf:55038 §Schedule, penguin_knight v1.5] [wiki:megamitensei.fandom.com/Social Link/Fox]
row: M283
- The Quest FAQ counts 50 requests in all, and every completed request pays out a reward from the person who asked [gf:56627 §Introduction, ssk9716757 v1.01]
- Granting the wishes on the fox's ema maxes the Hermit Social Link, and the discount on the fox's healing inside the TV grows with that rank [gf:56627 §Introduction, ssk9716757 v1.01]
- The fox's dungeon SP recovery starts at 60 yen per SP at rank 1 and falls to 15 yen at rank 10 [gf:55038 §Schedule, penguin_knight v1.5]
- The fox's is the one link that ranks through errands rather than meetings: its wishes are folded into the game's 50 quests [gf:55038 §Schedule, penguin_knight v1.5]
- The same guide lists "discount on service" as one of the kinds of benefit a Social Link can give, with Hermit as its example [gf:55038 §E) Discount on service, penguin_knight v1.5]
- The fox charges more when it is in a bad mood that day [wiki:megamitensei.fandom.com/Fox]
- The link starts on May 5; taking up a wish does not use the day, but reporting a granted one to the fox does [wiki:megamitensei.fandom.com/Social Link/Fox]
- The first ema request unlocks on 5/6, and each finished one is reported back at Tatsuhime Shrine to raise the rank [gf:56627 §Quests, ssk9716757 v1.01]
- The last wish, request No. 48, needs every earlier rank-up done, a Huge Fish traded to the old man at the river for a better fishing set, and the river Guardian, which bites only on rainy days or in December [gf:56627 §Quests, ssk9716757 v1.01]
- With every wish granted, the offerings pay to restore the shrine, and the fox gives a Gratitude Ema that enables the fusion of Ongyo-Ki [wiki:megamitensei.fandom.com/Fox] [wiki:megamitensei.fandom.com/Social Link/Fox]

## Minigame candidates

### Fishing for the old man's monthly prize list
p: From the start of May the old man at the Samegawa riverbed teaches fishing and hands out the first bait. A session allows up to five casts, set by the hero's Diligence, and takes a whole afternoon or evening; which fish bite depends on the weather and the month, and big fish are likelier in the rain. Every fish is also a healing item, so each catch is either used or traded.
r: Every month the old man swaps a new list of prizes for set catches — armour, accessories, a Chest Key and bait — ending with the Musashi Shinai, a weapon with a 50% experience bonus, for two Guardians in December.
l: A prize list that changes every month turns a quiet minigame into a calendar to plan around: the same fish buys a Chest Key one month and bait the next, and the best prizes ask for the rarest fish in the months they finally bite. It only works because the list can be known; an unpublished rotation would just be frustrating.
pointers: [gf:53550 §Fish Exchange, Zoel v0.65] [gf:60532 §Walkthrough, neoXsaga v2.2] [wiki:megamitensei.fandom.com/Fishing]
row: g097

| at | get | src |
|---|---|---|
| May: 2 Inaba Trout | Titanium Club | [gf:53550 §Fish Exchange, Zoel v0.65] [gf:60532 §Walkthrough, neoXsaga v2.2] |
| May: 1 Amber Seema (3 in one guide) | Falcon Eye | [gf:60532 §Walkthrough, neoXsaga v2.2] [gf:53550 §Fish Exchange, Zoel v0.65] |
| June: 3 Inaba Trout | Duchess | [gf:53550 §Fish Exchange, Zoel v0.65] [gf:60532 §Walkthrough, neoXsaga v2.2] |
| June: 1 Huge Fish | Land Badge | [gf:53550 §Fish Exchange, Zoel v0.65] [gf:60532 §Walkthrough, neoXsaga v2.2] |
| July: 1 Huge Fish | Bath Lid | [gf:53550 §Fish Exchange, Zoel v0.65] [gf:60532 §Walkthrough, neoXsaga v2.2] |
| July: 4 Amber Seema | Blessed Hands | [gf:60532 §Walkthrough, neoXsaga v2.2] [gf:53550 §Fish Exchange, Zoel v0.65] |
| August: 6 Red Goldfish | Cutie Action | [gf:53550 §Fish Exchange, Zoel v0.65] |
| August: 2 Huge Fish | Red Battle Clothes | [gf:53550 §Fish Exchange, Zoel v0.65] |
| September: 8 Amber Seema | Steel Slippers | [gf:53550 §Fish Exchange, Zoel v0.65] [gf:60532 §Walkthrough, neoXsaga v2.2] |
| September, on a second playthrough: 1 Guardian | Haikara Shirt (body armour, +50% experience) | [gf:60532 §Walkthrough, neoXsaga v2.2] [gf:65252 §Walkthrough, KADFC v0.86] |
| October: 4 Huge Fish | Titanium Wrench | [gf:53550 §Fish Exchange, Zoel v0.65] [gf:60532 §Walkthrough, neoXsaga v2.2] |
| October: 3 Huge Fish | Eagle Eye | [gf:53550 §Fish Exchange, Zoel v0.65] [gf:60532 §Walkthrough, neoXsaga v2.2] |
| November: 10 Genji Ayu | Red-Leaf Gusoku | [gf:53550 §Fish Exchange, Zoel v0.65] [gf:60532 §Walkthrough, neoXsaga v2.2] |
| November: 6 Red Goldfish | Bead Chain | [gf:60532 §Walkthrough, neoXsaga v2.2] [gf:53550 §Fish Exchange, Zoel v0.65] |
| December: 2 Guardian | Musashi Shinai (the hero's weapon, +50% experience) | [gf:60532 §Walkthrough, neoXsaga v2.2] [gf:65252 §Walkthrough, KADFC v0.86] |
| December: 3 Huge Fish | Uzume Robe (women's armour) | [gf:60532 §Walkthrough, neoXsaga v2.2] [gf:65252 §Walkthrough, KADFC v0.86] |
| Every month: one or two of a common fish, which changes month to month | Chest Key | [gf:53550 §Fish Exchange, Zoel v0.65] [gf:60532 §Walkthrough, neoXsaga v2.2] |
| Every month: one or two of a common fish | 3 bait | [gf:53550 §Fish Exchange, Zoel v0.65] [gf:60532 §Walkthrough, neoXsaga v2.2] |

- A session allows more casts the higher the hero's Diligence, up to five, and any fish caught can be traded to the old man; his prizes change each month [gf:53550 §Fishing, Zoel v0.65]
- Bait comes from the old man on the first visit, then from trading fish, from some home-cooked meals, and from a woman near the Dojima house [gf:53550 §Where to get Fish Bait, Zoel v0.65]
- Every fish is also a healing item: 10 HP for a Red Goldfish, 25 for a Genji Ayu, 50 for an Amber Seema, 100 for an Inaba Trout, 200 for a Huge Fish, and SP for the Guardian [wiki:megamitensei.fandom.com/Fishing]
- Three walkthroughs agree on December: two Guardians buy the Musashi Shinai, the hero's weapon with a 50% experience bonus, and three Huge Fish buy the Uzume Robe, a women's armour [gf:60532 §Walkthrough, neoXsaga v2.2] [gf:65252 §Walkthrough, KADFC v0.86] [gf:53550 §Weapon List, Zoel v0.65]
- September's Guardian prize, the Haikara Shirt, is body armour with a 50% experience bonus that two guides say can only be traded for on a second playthrough [gf:60532 §Walkthrough, neoXsaga v2.2] [gf:65252 §Walkthrough, KADFC v0.86]

## Exploration & upgrade facts

### Hidden
- The navigator's link upgrades exploration itself: at rank 3 she learns Treasure Radar, which reveals the location of every treasure chest, at rank 6 Enemy Radar, and at rank 10 a scan for enemy weaknesses [gf:55038 §Basic of the social links, penguin_knight v1.5]
- The river Guardian bites only on rainy days or in December, and only on the better fishing set the old man gives for a Huge Fish [gf:56627 §Quests, ssk9716757 v1.01]
- Fishing opens on May 1 through the old man at Samegawa, who starts the player with ten bait; Diligence sets how many casts a session allows, up to five, the fish on offer change with the month and the weather, and big fish are likelier in the rain [wiki:megamitensei.fandom.com/Fishing]

### Upgrades
- The weather drives fusion as well as the deadline: a Persona fused on a rainy day randomly gains an extra skill, and the walkthrough's Persona tables list date-specific ones such as Debilitate for a Yoshitsune fused on December 24 [gf:53550 §Section 9, Zoel v0.65]
- Every Social Link adds bonus experience when a Persona of its arcana is fused, up to five extra levels at rank 10, and each maxed link unlocks that arcana's ultimate Persona [gf:55038 §Basic of the social links, penguin_knight v1.5]
- Links with party members change how they fight, rank by rank: at 1 they take a lethal hit for the hero, at 3 they follow up a knockdown, at 5 they help a fallen ally up, at 7 they cure ailments, at 9 they endure a killing blow, and at 10 their Persona is upgraded with new resistances [gf:55038 §Basic of the social links, penguin_knight v1.5]
- Request rewards climb with the calendar, from 4,000 yen early to 15,000, 30,000, 40,000 and 45,000 yen later, alongside Chest Keys, Beads, stat-raising Souls and books [gf:56627 §Quests, ssk9716757 v1.01]
- Many requests name the exact Shadow and floor that drops the item wanted, such as a Suspicious Pole from Trance Twins on floors 3–5 of Yukiko's Castle and an Everlasting Lamp from Amenti Ravens on floors 3–4 of Void Quest [gf:56627 §Quests, ssk9716757 v1.01]
- Some requests are riddles, and answering correctly pays out: 3 Chest Keys for one, a Snuff Soul and a Chewing Soul for later ones [gf:56627 §Quests, ssk9716757 v1.01]

### Shops & exchange
- On set days the TV shopping channel sells fish, so a player who cannot land a Huge Fish can buy one instead [gf:55038 §Schedule, penguin_knight v1.5]
- Daidara Metalworks sells equipment and buys the materials Shadows drop; selling the required amount of a given material unlocks new equipment for sale, and talking to Daidara hints at what one piece needs [wiki:megamitensei.fandom.com/Daidara Metalworks]
- A request can route through the smithy: Hard Boots are made from 10 Thick Hides given to Daidara, and the hides drop from Dancing Hands on floors 5–8 of the Steamy Bathhouse [gf:56627 §Quests, ssk9716757 v1.01]

## Unverified or contradicted
- **When the big fish start biting.** The walkthrough's fish list says the Huge Fish and the Guardian appear from November, yet its own exchange table asks for a Huge Fish in June and July and a Guardian in September (two later guides settle the Guardian: that prize is for a second playthrough); the wiki gives the Huge Fish from August, and the Social Link guide suggests buying a Huge Fish from the TV shopping channel for a player who cannot catch one. The codex row names no start month [gf:53550 §Fishing, Zoel v0.65] [wiki:megamitensei.fandom.com/Fishing] [gf:55038 §Schedule, penguin_knight v1.5]
- The walkthrough dates the start of fishing to May 2 in its fishing chapter and to May 1 in its calendar, and the wiki says May 1 [gf:53550 §Fishing, Zoel v0.65] [wiki:megamitensei.fandom.com/Fishing]
- Which stat the fox's final rank needs in the original game: the Social Link/Fox page's Persona 4 tab says max Understanding, while the Fox page says maxed Expression, which the Social Link page gives as Golden's requirement. Both readings kept [wiki:megamitensei.fandom.com/Social Link/Fox] [wiki:megamitensei.fandom.com/Fox]
- **Item names differ between guides.** Zoel's exchange table says Musashi Bamboo Sword, Uzume Clothes, Stylish Underwear, Chain Bead and Blessed Hand; neoXsaga and KADFC both say Musashi Shinai, Uzume Robe and Haikara Shirt, neoXsaga says Bead Chain and Blessed Hands, and the wiki has pages under those names. The codex uses the corroborated set [gf:53550 §Fish Exchange, Zoel v0.65] [gf:60532 §Walkthrough, neoXsaga v2.2] [gf:65252 §Walkthrough, KADFC v0.86] [wiki:megamitensei.fandom.com/Musashi Shinai]
- May's Falcon Eye costs 3 Amber Seema in Zoel's table and 1 in neoXsaga's; the codex row gives both [gf:53550 §Fish Exchange, Zoel v0.65] [gf:60532 §Walkthrough, neoXsaga v2.2]
- August's two prizes, Cutie Action for 6 Red Goldfish and Red Battle Clothes for 2 Huge Fish, appear only in Zoel's table, and the wiki has no page for either [gf:53550 §Fish Exchange, Zoel v0.65] [wiki:megamitensei.fandom.com/Fishing]

## Codex rows

```js
// Spliced into JRPG_Design_Codex.html on 2026-09-14 by
// scripts/splice_rows.mjs (the rows there are the source of truth; this is the map).
// M282  A smithy whose shelves are stocked by the materials you sell it  Economy & Currency
// M283  A fox whose healing gets cheaper as you grant the town's wishes  Economy & Currency
// g097  Fishing for the old man's monthly prize list                     rt: 18 rows
```

## Codex delta
- M282 (the smithy), M283 (the fox) and g097 (fishing, 18 table rows), spliced 2026-09-14 and logged in their own changelog entry.
- M188 (the weather deadline) and M189 (Shuffle Time) were not re-sourced this pass: the walkthroughs touch both, but not every claim in those rows.
