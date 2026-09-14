# Fire Emblem: Three Houses — research digest

Codex: `Fire Emblem: Three Houses` (2019, Nintendo Switch) · GameFAQs: `/switch/204445-fire-emblem-three-houses`
confirmed 2026-09-14 (the row's harvested `gf.u`, released July 26, 2019) · digest started 2026-09-14

> Facts only, in our own words. Item names and numbers may be quoted; guide prose may not.
> Every fact carries a pointer: `[gf:<id> §<section>, <author> v<ver>]` or `[wiki:<host>/<Page>]`.

## Sources

| id | title | author | version | updated | category | KB | url |
|---|---|---|---|---|---|---|---|
| 79956 | Optimal Fishing Guide | Cozy | 1.0 | 05/18/2022 | In-Depth Guides | 5 | https://gamefaqs.gamespot.com/switch/204445-fire-emblem-three-houses/faqs/79956 |
| 77641 | Teatime Guide | redbluezero | — | — | In-Depth Guides | 4 | https://gamefaqs.gamespot.com/switch/204445-fire-emblem-three-houses/faqs/77641 |
| 79505 | Greenhouse Combination Guide | Reidog | — | — | In-Depth Guides | 4 | https://gamefaqs.gamespot.com/switch/204445-fire-emblem-three-houses/faqs/79505 |
| 77587 | Guide and Walkthrough (grep only) | vreaper | 1.5 | 06/23/2022 | Full Game Guides | 645 | https://gamefaqs.gamespot.com/switch/204445-fire-emblem-three-houses/faqs/77587 |

Coverage 79956: single page, 5,410 chars, 127 lines — read whole with `lines()`.

Coverage 77641: a chaptered guide — only its introduction page (689 chars) read. Unread: the per-house
chapters of conversation topics and favourite teas.

Coverage 79505: single page, 2,947 chars, 29 lines — read whole with `lines()`; its combination tables
did not come through as text.

Coverage 77587: a chaptered guide, four chapters opened. The contents page (2,333 chars: four greps,
0 hits each, and a read of the contents). Exploring the monastery (6,402 chars: one grep, 3 hits).
Gardening and Fishing (19,503 chars: two greps, 17 and 11 hits, and `lines()` reads of the rank table,
the item counts, the stat boosters and the end of the fish list). Activities (77,477 chars: one grep,
131 hits cut by the cap, and the Tea party invite and Tea time event sections read in full). Unread:
the walkthrough and route chapters, the yield tables, the per-character tea topics, Market, and
Calendar and time management.

## Triage

`__gf.triage()` on 2026-09-14: 11 guides listed (3 Full Game Guides, 8 In-Depth Guides, none under other
headings). The brief's questions each had a short dedicated guide (fishing, teatime, greenhouse
combinations), so those were read whole, and vreaper's chaptered walkthrough was grepped by chapter as
the independent second reading. On 2026-09-15 `__gf.pick()` returned no guide: all three Full Game
Guides carry the HTML flair, so there is no plain-text walkthrough to read under the owner's rule. The
flags column copies the listing on that day.

| id | title | author | category | KB | score | decision | flags |
|---|---|---|---|---|---|---|---|
| 77646 | Lost Item FAQ | Sonictrainer | In-Depth Guides | 176 | 8 | skipped — lost items returned for support, outside this pass's questions | Highest Rated · HTML |
| 77599 | Side Quest Guide | naiming | In-Depth Guides | 10 | 6 | skipped — the two quests used were read on the wiki | HTML |
| 79956 | Optimal Fishing Guide | Cozy | In-Depth Guides | 5 | 6 | read | — |
| 79487 | Gardening Guide | geoff_hom_gmail | In-Depth Guides | 36 | 5 | skipped — vreaper's gardening chapter and the combination guide answered first | Highest Rated · FAQ of the Month Winner: September 2021 · HTML |
| 79505 | Greenhouse Combination Guide | Reidog | In-Depth Guides | 4 | 4 | read | Highest Rated · HTML |
| 77587 | Guide and Walkthrough | vreaper | Full Game Guides | 645 | 3 | grep only | FAQ of the Month Winner: October 2019 · HTML |
| 77641 | Teatime Guide | redbluezero | In-Depth Guides | 4 | 3 | read | HTML |
| 77770 | Guide and Walkthrough | RagingTasmanian | Full Game Guides | 251 | 2 | skipped — a second walkthrough, not needed | HTML |
| 77702 | Guide and Walkthrough | GrimGamingOnYT | Full Game Guides | 228 | 2 | skipped — a third walkthrough, not needed | HTML |
| 77596 | Support Conversation Script | Misha-Heart | In-Depth Guides | 2929 | -1 | skipped — a script of support conversations | — |
| 78021 | Byleth Support Conversations Script | Misha-Heart | In-Depth Guides | 955 | -1 | skipped — a script of support conversations | — |

## Mechanics candidates

### The greenhouse: seeds, cultivation, and a stat booster rolled the moment you plant
cat: Progression & Upgrades
how: Once per free day Byleth plants seeds in the monastery greenhouse and pays for a cultivation method, and the harvest is collected on the next exploration day. More seeds and dearer methods yield more items, and both limits rise with Professor Level, up to five seeds at a time. Certain seeds can also yield a permanent stat booster, likelier with a better yield, and that booster is decided when the seeds are planted rather than when they are picked.
loop: plant seeds and pay for cultivation → collect ingredients, gifts and flowers next week → sometimes a permanent stat booster → feels good because a free weekly chore quietly adds up to stronger students
notes: The greenhouse is an upgrade track that costs no time: it never spends an Activity Point, pays professor experience, and its capacity grows with the same rank it feeds. The detail worth copying is where its randomness sits. Because the booster is decided at planting, the game invites saving and reloading at exactly one moment, which both guides describe; decide on purpose whether the owner's game wants that. A deterministic version, where a known seed mix and yield guarantee the booster, would reward the combination knowledge players chase here without the reload.
pointers: [gf:77587 §Gardening and Fishing, vreaper v1.5] [gf:79505 §Tips, Reidog] [wiki:fireemblem.fandom.com/Professor Level]
row: M293
- Seeds can be planted once per exploration, and gardening costs no Activity Points [gf:77587 §Gardening and Fishing, vreaper v1.5] [wiki:fireemblem.fandom.com/Professor Level]
- A stat booster is rolled when the seeds are planted, so reloading before harvest cannot change it [gf:77587 §Gardening and Fishing, vreaper v1.5] [gf:79505 §Savescumming for Stat Boosters, Reidog]
- The seeds that can be planted rise with Professor Level to five [gf:77587 §Gardening and Fishing, vreaper v1.5] [wiki:fireemblem.fandom.com/Professor Level]
- 4-star and 5-star seeds are not sold, so they are limited [gf:79505 §The Greenhouse at Garreg Mach, Reidog]

## Minigame candidates

### The monastery fishing pond: bait, coloured shadows and professor experience
p: At the pond Byleth casts once per bait, and better bait catches rarer fish. When a fish bites, a coloured shadow shows what kind it is, and the player can pull at once or wait for a better shadow at the risk of losing the bait. Fishing costs no Activity Points, and on Fistful of Fish days each bait lands several fish.
r: Fish for meals, cooking and sale, and professor experience for every catch, from 10 for a small fish to 100 for the rare Goddess Messenger, which raises the rank that sets how much Byleth can do each week.
l: A free activity that pays into the budget of the paid ones: fishing spends no Activity Points, but its experience raises the Professor Level that grants them, so fishing between chores buys more week. The shadow system adds a small, readable push-your-luck choice to every cast. The owner's game can copy both: let a quiet side activity grow the main resource cap, and show what is on the line before the player commits.
pointers: [gf:79956 §How do you fish?, Cozy v1.0] [gf:77587 §Gardening and Fishing, vreaper v1.5] [wiki:fireemblem.fandom.com/Fishing]
row: g101

| at | get | src |
|---|---|---|
| Dark blue shadow (1–2 star fish) | a small fish such as Airmid Goby or White Trout, 10 professor experience | [gf:79956 §How do you fish?, Cozy v1.0] [gf:77587 §Gardening and Fishing, vreaper v1.5] |
| Light blue shadow (2–3 star fish) | a large fish such as Caledonian Gar, 20 professor experience | [gf:79956 §How do you fish?, Cozy v1.0] [gf:77587 §Gardening and Fishing, vreaper v1.5] |
| Red shadow (4–5 star fish) | a huge fish such as Teutates Pike or Bullhead, 30 professor experience | [gf:79956 §How do you fish?, Cozy v1.0] [gf:77587 §Gardening and Fishing, vreaper v1.5] |
| Gold shadow | a money fish for selling, such as Platinum Fish for 40 professor experience | [gf:79956 §How do you fish?, Cozy v1.0] [gf:77587 §Gardening and Fishing, vreaper v1.5] |
| Rainbow shadow, 5-star bait during Fish of Mystery | Goddess Messenger, 100 professor experience | [gf:79956 §How do you fish?, Cozy v1.0] [gf:77587 §Gardening and Fishing, vreaper v1.5] |
| A Fistful of Fish day | 2 to 4 fish for each bait | [gf:79956 §Fistfuls of Fish Days, Cozy v1.0] [gf:77587 §Gardening and Fishing, vreaper v1.5] |

- One cast per bait, and the bait sets the rarity of what can bite [wiki:fireemblem.fandom.com/Fishing] [gf:77587 §Gardening and Fishing, vreaper v1.5]
- The player need not pull on the first shadow; waiting past the third risks losing the bait [gf:79956 §How do you fish?, Cozy v1.0] [wiki:fireemblem.fandom.com/Fishing]
- Fishing earns professor experience per fish and costs no Activity Points [gf:79956 §Why is fishing during Fistfuls of Fish best?, Cozy v1.0] [gf:77587 §Gardening and Fishing, vreaper v1.5] [wiki:fireemblem.fandom.com/Professor Level]
- Cozy's experience table is copied from a fan site the guide names; vreaper's fish list gives the same values independently [gf:79956 §How much professor experience does fishing give?, Cozy v1.0] [gf:77587 §Gardening and Fishing, vreaper v1.5]

### Tea time: topics chosen for one guest, and Charm for a perfect finish
p: After Ferdinand's quest Tea for Two, Byleth can invite a character to tea for an Activity Point. Serve a tea, then choose a topic from three, three times over; three good topics lead to a final comment that needs the right reaction. Serving the guest's favourite tea forgives one mistake.
r: Support with the guest, and a permanent +1 Charm for both after a Great or Perfect finish; a Perfect Tea Time also opens Extra Time to give a gift.
l: Tea time turns a relationship stat into a small knowledge test: the right topics differ for every character, so learning people is how the player wins, and the favourite-tea rule rewards attention paid before the conversation began. It also pays two currencies at once, the bond and the professor's own Charm. For the owner's game, make social scenes a test of what the player has learned about someone, and pay both sides of the relationship.
pointers: [wiki:fireemblem.fandom.com/Tea Party] [gf:77587 §Tea time event, vreaper v1.5] [gf:77641 §Introduction, redbluezero]
row: g102

| at | get | src |
|---|---|---|
| Three good topics, final reaction wrong | a Great result: support and +1 Charm for both | [gf:77587 §Tea time event, vreaper v1.5] [wiki:fireemblem.fandom.com/Tea Party] |
| Three good topics and the right final reaction | Perfect Tea Time: support, +1 Charm for both, and Extra Time to give a gift | [gf:77587 §Tea time event, vreaper v1.5] [wiki:fireemblem.fandom.com/Tea Party] |
| The guest's favourite tea served | one mistake forgiven on the way to a Perfect | [gf:77587 §Tea time event, vreaper v1.5] [gf:77641 §Introduction, redbluezero] |

- Tea parties open after the quest Tea for Two, given by Ferdinand [wiki:fireemblem.fandom.com/Tea Party] [wiki:fireemblem.fandom.com/Tea for Two] [gf:77587 §Tea party invite, vreaper v1.5]
- A tea party costs one Activity Point [wiki:fireemblem.fandom.com/Professor Level] [gf:77587 §Tea party invite, vreaper v1.5]
- A perfect teatime is what raises Charm and support [gf:77641 §Introduction, redbluezero] [wiki:fireemblem.fandom.com/Tea Party]

## Exploration & upgrade facts

### Hidden
- Purple and rainbow fish need 5-star bait, and some appear only in the second part of the game [gf:77587 §Gardening and Fishing, vreaper v1.5]
- Every character likes the Hresvelg Blend and Leicester Cortania teas [gf:77587 §Tea time event, vreaper v1.5]

### Upgrades
- Professor Level runs E, E+, D, D+, C, C+, B, B+, A and A+ [wiki:fireemblem.fandom.com/Professor Level]
- Activity Points per exploration rise from 1 to 10 with Professor Level [wiki:fireemblem.fandom.com/Professor Level] [gf:77587 §Activities, vreaper v1.5]
- Every activity costs one Activity Point except fishing, gardening and the counselor box [wiki:fireemblem.fandom.com/Professor Level] [gf:77587 §Activities, vreaper v1.5]
- Cultivation methods by rank: E, one seed and Infuse with magic (0G); E+, one seed and Pour Airmid water (300G); D, two seeds and Prune (500G); C, three seeds and Scatter Bonemeal (1,000G); B, four seeds and Use Caledonian soil (1,500G); A, five seeds and Spread pegasus blessings (2,000G) [gf:77587 §Gardening and Fishing, vreaper v1.5]
- A harvest gives 6 items for one seed with Infuse with magic, up to 15 for five seeds with Spread pegasus blessings; the Blessing of the Land event adds 5 [gf:77587 §Gardening and Fishing, vreaper v1.5]
- Seeds for stat boosters: Ailell Pomegranate (Morfis-Plum, Morfis, Green Flower), Ambrosia (Root Vegetable, Eastern Fodlan), Fruit of Life (Western Fodlan, Blue Flower), Golden Apple (Northern Fodlan, Albinean, White Flower), Miracle Bean (Boa-Fruit, Mixed Fruit), Premium Magic Herbs (Southern Fodlan, Yellow Flower), Rocky Burdock (Mixed Herb, Angelica, Purple Flower), Speed Carrot (Nordsalat, Pale-Blue Flower), White Verona (Vegetable, Red Flower) [gf:77587 §Gardening and Fishing, vreaper v1.5]
- A mixed planting gives items from only one of its seed types, and one that rolls a booster always gives that same booster [gf:77587 §Gardening and Fishing, vreaper v1.5]

### Shops & exchange
- Seeds and bait are sold at the monastery's southern and eastern shops, and bait later in bulk by the Eastern Merchant [gf:77587 §Gardening and Fishing, vreaper v1.5] [gf:79956 §Why is fishing during Fistfuls of Fish best?, Cozy v1.0]
- Tea comes from picking it around the monastery, the eastern shop and quests [gf:77587 §Tea party invite, vreaper v1.5]
- Tea for Two pays 2 Sweet-Apple Blend and 300 Renown [wiki:fireemblem.fandom.com/Tea for Two]

## Unverified or contradicted
- **Seeds at rank E.** The wiki gives no seed plot until E+; vreaper gives one seed at E [wiki:fireemblem.fandom.com/Professor Level] [gf:77587 §Gardening and Fishing, vreaper v1.5]
- **The rest of the rank table.** Lecture Points rising from 3 to 7, Battle Points from 1 to 3, monthly funds from 1,000 to 5,000, adjutants from 0 to 3, and master classes from rank C come from the wiki alone [wiki:fireemblem.fandom.com/Professor Level]
- **The fishing tournament's prizes.** The wiki lists what each classmate hands over for a bigger fish (a Vulnerary from Ashe for 3 stars, a Steel Sword from Catherine for 4 stars, and others) and Pure Water, a Fishing Float and 200 Renown for finishing; no guide read here repeats them [wiki:fireemblem.fandom.com/Fishing Tournament]
- **Tea time's timer and its weakest result.** vreaper gives each choice a 15-second limit and names a Nice result for two good topics; no other source read here says so [gf:77587 §Tea time event, vreaper v1.5]

## Codex rows

```js
// Spliced into JRPG_Design_Codex.html on 2026-09-14 by
// scripts/splice_rows.mjs (the rows there are the source of truth; this is the map).
// M293  The greenhouse: seeds, cultivation, and a stat booster rolled the moment you plant  Progression & Upgrades
// g101  The monastery fishing pond: bait, coloured shadows and professor experience         rt: 6 rows
// g102  Tea time: topics chosen for one guest, and Charm for a perfect finish               rt: 3 rows
```

## Codex delta
- (ids after the splice)
- M241 (the monastery week) sharpened in place: Professor Level's ten ranks raising Activity Points from 1 to 10 and the greenhouse to five seeds, which activities cost nothing, and the loop where free activities grow the budget. It gained its first sources. The brief's merchant question came back THIN: no merchant unlock tied to rank turned up.
- 2026-09-15: no plain-text Full Game Guide exists to read under the owner's rule (all three are HTML), so nothing changed beyond the Triage flags.
