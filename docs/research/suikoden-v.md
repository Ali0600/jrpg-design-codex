# Suikoden V — research digest

Codex: `Suikoden V` (2006, PlayStation 2) · GameFAQs: `/ps2/929668-suikoden-v` confirmed
2026-09-06 (the page's own Release line reads March 21, 2006) · digest started 2026-09-06

> Facts only, in our own words. Item names and numbers may be quoted; guide prose may not.
> Every fact carries a pointer: `[gf:<id> §<section>, <author> v<ver>]` or `[wiki:<host>/<Page>]`.

## Sources

| id | title | author | version | updated | category | KB | url |
|---|---|---|---|---|---|---|---|
| 42465 | Trading Guide | popemobile | 0.98 | 05/03/2006 | In-Depth Guides | 35 | https://gamefaqs.gamespot.com/ps2/929668-suikoden-v/faqs/42465 |
| 60774 | Guide and Walkthrough (grep only) | 29_Rooks | — | — | Full Game Guides | 764 | https://gamefaqs.gamespot.com/ps2/929668-suikoden-v/faqs/60774 |
| 42169 | Character Recruitment Guide | yangxu | 1.0 | 03/21/2008 | In-Depth Guides | 50 | https://gamefaqs.gamespot.com/ps2/929668-suikoden-v/faqs/42169 |

Coverage 42465: single page, 35,475 chars, 287 sections — 1 read (Build Up Your
Achievements, 100%, which carries the unlock chain, the rumour-event list and the median
prices); greps: price/fluctuate. Unread: the per-city price tables and best-route lists,
which are lookup data rather than rules.

Coverage 60774: **grep only, by design** — 766,082 chars, 158 sections, 0 sections read.
Six greps (trade/Miso/Sake, castle, formation, formation acquisition, tactics, money) plus
two `lines()` reads at the Money Making and Trade chapter and the Tactics explainer. 131
sections over 800 chars unread.

Coverage 42169: single page, 50,099 chars, 10 sections — 0 sections read; three greps (HQ
and castle, "opens/runs the", shop and service names). Used to answer one question, which
it turned out not to answer — see Unverified.

Triage (2026-09-06, `__gf.triage()` on 35 guides): an Armor Guide, a Bestiary, a Level 60
Character Database, a Character Evaluation Guide, a Newspaper Guide, a Recruitment Guide, a
**Trading Guide**, an Army Battles Guide, a Rune/Orb Guide and an Old Book Guide, all above
the two walkthroughs. blazefeeler alone wrote five of them.

## Mechanics candidates

### A trade economy that widens its own catalogue the more you use it
cat: Economy & Currency
how: Every town buys and sells the same commodities at different prices, so profit comes from carrying goods along a route rather than from any single shop. The part worth stealing is that the LIST of tradable goods is itself a progression track: sell enough of the cheap staples and the trade shops begin stocking their refined counterparts, which carry far better margins. Soybeans open miso and soy sauce, wheat opens beer, fruit opens wine, rice opens sake, and gold opens gold craftworks.
loop: haul cheap staples between towns for thin margins → the shops start offering the refined version of what you have been trading → the same route now pays several times more
notes: This is the owner's "shops have upgrades too" pillar as an economy rather than an inventory: the SHOP's catalogue levels up in response to the player's behaviour, and the upgrade is a better version of the exact good they chose to specialise in. Note how well it solves the usual trading-minigame problem — early margins are deliberately thin, so without the unlock the whole system would be a chore, and the unlock is what converts patience into a real income. Worth pairing with a published price list so the player can plan, as this game does.
verbs: Shop stock, Traded
pointers: [gf:42465 §Build Up Your Achievements, popemobile v0.98] [gf:60774 §Money Making and Trade, 29_Rooks]
row: M281
- Trading a lot of the basic items unlocks new tradable items which offer by far the largest profits, so the cheap goods should not be neglected [gf:42465 §Build Up Your Achievements, popemobile v0.98]
- The unlock chain pairs each staple with its refined form: soybeans to miso and soy sauce, wheat to beer, fruit to wine, rice to sake, and gold to gold craftworks [gf:42465 §Build Up Your Achievements, popemobile v0.98]
- A second author states the same rule independently: more trade items become available if you buy and sell many of the lower-level items [gf:60774 §Money Making and Trade, 29_Rooks]
- The exact quantity needed is not known to the guide's author, though selling a large number at once appears to help — recorded as the guide's own uncertainty [gf:42465 §Build Up Your Achievements, popemobile v0.98]
- Prices differ from town to town, and the walkthrough's tables show it: sugar is 100 in Sol-Falena against 55 in Raftfleet, soybeans 440 against 300 [gf:60774 §Money Making and Trade, 29_Rooks]
- Median prices across the country give a quick cheap-or-dear reference: sugar 70, salt 200, soybeans 360, vegetables 640, fruit 1,600 [gf:42465 §Build Up Your Achievements, popemobile v0.98]
- Rumour events temporarily move prices, and trading more opens up more profitable ones; the listed events include price drops on iron and on gold and silver in Dwarf Camp, on pearls in Estrise, and booms on tea in Beaver Lodge, spices in Sable, handicrafts on Nirva Island and coffee in Sauronix [gf:42465 §Build Up Your Achievements, popemobile v0.98]
- The guide's author reports never seeing the gold rumour event in 110 hours of play, and passes on a reader's report that asking Sairoh after a "no rumour" result can produce one putting gold and silver at 900k in Haud [gf:42465 §Build Up Your Achievements, popemobile v0.98]

## Minigame candidates

None with defined payouts. Trading is an economy rather than a scored side activity, so it
is recorded above as a mechanic; the Sacred Games tournament is story combat, and no
casino, arena or fishing game appears anywhere in the 35-guide list. Recorded, not padded.

## Exploration & upgrade facts

### Hidden
- Battle formations are found in CHESTS out in the world rather than bought or awarded: the Double Arm Tactic is the first one the walkthrough points at, the Sorcery Tactic sits in a chest in the Underground Ruins, and the True Men Tactic on the Estrise waterfront [gf:60774 §Tactics, 29_Rooks]

### Upgrades
- A formation is chosen under Formation, then Rearrange, and grants a party-wide status bonus — Double Arm gives +2 Physical Defence and +2 Magical Defence [gf:60774 §Tactics, 29_Rooks]
- Every formation also carries a special skill usable once per battle at the cost of a turn; the Standard formation's heals a small amount of HP [gf:60774 §Tactics, 29_Rooks]
- Which formation is worth using depends on who is in the party, and because many parties have required members, the guide's author switches formation frequently to suit the roster he is given [gf:60774 §Tactics, 29_Rooks]
- Weapons come in three ranges, and the grid on the Rearrange window decides whether they connect: short-range weapons attacking from the back row will rarely land at all [gf:60774 §Tactics, 29_Rooks]
- The headquarters physically grows with the story — after the coronation it expands a level downward, opening a floor below the one the party had been using [gf:42169 §Quick FAQ, yangxu]

### Shops & exchange
- Towns carry distinct services the recruitment guide routes the player through — a trade shop in Rainwall, an appraisal shop in Haud Village, a bath house on the Tricolor Inn's second floor [gf:42169 §Quick FAQ, yangxu]

## Unverified or contradicted
- **The two guides disagree about how much prices move.** The Trading Guide treats rumour events as the best way to make money, greatly increasing margins; the walkthrough's author says prices in this game are "quite stable" compared with earlier Suikodens, that he noticed only one meaningful shift (soybeans in Sol-Falena before and after the Sacred Games), and that trading is largely a waste of time next to random battles in the second half. Both are first-hand play reports, and the codex keeps both [gf:42465 §Build Up Your Achievements, popemobile v0.98] [gf:60774 §Money Making and Trade, 29_Rooks]
- **The brief's castle-facility question came back thin.** The Character Recruitment Guide documents how to recruit each of the 108 stars, not what each recruit then runs at headquarters, and no guide in the list tabulates recruit-to-facility. The only sourced fact found is that the HQ expands a floor downward after the coronation. A dedicated pass would need the Comment Box List or a castle-specific source [gf:42169 §Quick FAQ, yangxu]
- Two rumour events — a sweets boom in Rainwall and a gold and silver boom in Haud Village — are marked unconfirmed by the guide's own author [gf:42465 §Build Up Your Achievements, popemobile v0.98]
- The Suikoden wiki's Trading page covers Suikoden, Suikoden II and Tierkreis but has no Suikoden V section at all, so it could not serve as a cross-check; the second source is a second GameFAQs author instead [wiki:suikoden.fandom.com/Trading]

## Codex rows

```js
// Spliced into JRPG_Design_Codex.html on 2026-09-06 by
// scripts/splice_rows.mjs (the rows there are the source of truth; this is the map).
// M281  A trade economy that widens its own catalogue the more you use it  Economy & Currency
```

## Codex delta
- (ids after the splice)
