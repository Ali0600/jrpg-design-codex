# Learnings

Teachable, transferable concepts that came up while building the JRPG Design Codex.

---

## Range-check every scraped number — a value outside its possible range is a pointer, not a fact
Modern frameworks (Next.js and friends) serialise page data as a **flattened array**:
the HTML contains `"userScoreSummary":2769`, where 2769 is an **index into a strings
table**, not the value. A regex that grabs "the number after the field name" therefore
returns a confident, completely fabricated number. Scraping Metacritic user scores this
way produced 2769, 3059 and 3830 for a metric whose only legal range is 0–10.

**Why it came up:** adding Metacritic critic + user scores to all 50 games. The critic
score was safe (clean JSON-LD `aggregateRating`), but the first user-score scrape would
have written pure garbage into every row. A `0 <= x <= 10` assertion caught all of it,
and the real fix was finding the site's own JSON API (`user-score-summary` component)
so no HTML parsing was needed at all.

**Related trap in the same task:** a `score: 0` that arrives with `sentiment: null` and
`positiveCount: 3` is not a zero — it's the API's "not enough data to publish" sentinel.
Storing it would have told the reader a game rated 0/10.

**Takeaway:** every scraped/parsed number needs a validity range asserted at the parse
boundary, and any sentinel (0, -1, null) must be distinguished from a real measurement.
If a number *can't* be wrong-looking, you have no detector — so write the range check
first, then go find the structured source that makes scraping unnecessary.

## The official API is the front door; scraping the HTML is the side window
A site can return HTTP 403/402 to automated requests for its **HTML pages** while
leaving its **official API wide open** — because the API is the interface it *wants*
machines to use. Fandom (and every MediaWiki wiki) does exactly this: `finalfantasy.fandom.com/wiki/X`
403s even with a real browser User-Agent, but `finalfantasy.fandom.com/api.php?action=parse&page=X`
returns 200 with the full page.

**Why it came up:** research subagents kept getting bot-blocked on the Final Fantasy
Wiki and fell back to unreliable search-engine snippets. The reflex was to look for a
"bypass" tool (FlareSolverr, cloudscraper, curl-impersonate — anti-bot evasion). But the
block wasn't a wall, it was a *wrong door*: the MediaWiki API had the same data, unblocked
and better-structured (raw wikitext with reward tables intact). Built `scripts/wiki_fetch.py`
around it.

**Takeaway:** When automated HTTP gets a 403/402, look for an official/documented API
(MediaWiki `api.php`, REST endpoints, GraphQL, RSS/Atom) *before* reaching for a
fingerprint-spoofing bypass — the sanctioned interface is stabler, richer, and not an
arms race. A 402/403 means "not this way," not "no data."

## Verify a "block" with a direct probe before trusting it
Not every reported block is a hard wall. The subagents reported StrategyWiki and Caves of
Narshe as blocked, but a plain `curl` to both returned 200 — those were User-Agent-specific
or transient, not permanent. Only Fandom (403 even with a browser UA) and Neoseeker were
genuinely hard-blocked.

**Why it came up:** documenting "these sources are blocked" would have been half wrong and
would have steered future research away from sources that actually work.

**Takeaway:** Before recording "site X blocks bots," probe it directly and read the actual
status code. Distinguish a hard block (403 to everything) from a UA-specific or transient
one (200 to a different client) — and probe the *specific* surface you'll use, since the
API and the HTML frontend of the same site can behave oppositely.

## A sabotage that lands outside the region under test changes bytes and proves nothing
The validator's `--selftest` mutates the codex in memory and requires each check to fire.
One fixture used the regex `/us:\d+/` to corrupt a user score — and it matched
`border-radius:4px` in the CSS long before reaching any game row. The mutation applied
cleanly, the file's bytes changed, nothing threw, and the check reported "no errors at
all" for a data file that was still perfectly valid.

**Why it came up:** three of the first fourteen fixtures were wrong on the first run, and
this was the one that looked most like a *code* bug rather than a *fixture* bug. The usual
guards — pattern found, source changed, checksum differs — all passed, because the edit
was real. It just wasn't where I thought it was.

**Takeaway:** a mutation test needs to assert *where* it edited, not only *that* it
edited. `replaceFirst` now refuses any match outside the data region. When a sabotage
"applies" but the check stays green, suspect the fixture's aim before the check's logic.

## A test fixture must target a row that actually satisfies the rule's precondition
The "queued games need a research brief" check has a precondition: `status === "To
Research"`. The fixture emptied the first `why:"BRIEF: …"` in the file — but five
*researched* games kept their brief-style text after being researched, so the sabotage
landed on a row the rule doesn't apply to and the check correctly stayed silent.

**Why it came up:** it read as "the check is broken" for a check that was working exactly
as designed.

**Takeaway:** when a conditional rule's test fails to fire, verify the fixture satisfies
the condition — query the data for a row that *does*, and anchor on that. Text that looks
like a status marker (a `BRIEF:` prefix) is not the status field.

**It broke a second time, from the opposite direction (2026-08-12).** Clearing the
research queue meant *no* game had `status:"To Research"` any more, so the fixture had
nothing to sabotage and the check silently stopped firing — a routine data change
disarmed a validator rule. The real fix is stronger than picking a better row: the
fixture now **constructs** the failing shape itself, setting both `status:"To Research"`
and an empty `why` in one mutation. A fixture for a conditional rule should establish the
condition rather than hope the data still happens to satisfy it — otherwise the test's
survival depends on content that is free to change.

## Presentation can assert the opposite of the content it presents
The lineage view styles the last node of each chain green, meaning "the one worth stealing
from". The collection chain deliberately ends on Tetra Master — the codex's standing
example of collection that *never* converts into power. So the UI was about to highlight
the failure case as the payoff, directly contradicting the paragraph printed underneath it.

**Why it came up:** the data was right and the note was right; only the rendering was
wrong, and no data validation could ever have caught it. It surfaced from reading the
rendered output rather than the arrays.

**Takeaway:** when a view applies emphasis by *position* (last, first, largest, newest),
check whether every row's semantics match that position's meaning. Give the exception an
explicit flag (`counter:`) rather than assuming ordering encodes value.

## An image's filename and host page are claims about its content, not evidence
Building the UI gallery meant harvesting screenshots by metadata: a file called
`BattleXsample.JPG` sitting on the Sphere Grid page, `Sh2-judgment-ring.gif` on the
Judgement Ring page. Viewed before committing, the first turned out to be a **scanned
strategy-guide book spread** and the second decorative ring artwork — and roughly half
of all candidates were rejects (character art, box covers, vistas with no HUD). None of
that is visible in an API listing; the name, size and page context all read as exactly
what was wanted.

**Why it came up:** the curation bar was "the shot must show UI", and the only
instrument that can check that bar is looking at the pixels. Every image was downloaded
to a scratchpad and viewed before `--get` committed it to the repo; six of fourteen
games yielded nothing usable and were recorded as such rather than padded with art.

**Takeaway:** when harvesting media by filename/page/metadata, treat the metadata as a
claim and verify the bytes by *viewing them* before shipping — and record the no-yield
sources so the next pass doesn't re-search them. Same family as "verify the rendered
outcome, not the proxy": the plausible filename is the proxy.

## When the only channel back is your own context, make the instrument return digests, not documents
GameFAQs blocks every script, so the guides can only be read in a real browser — and the
only way anything gets from that browser to the agent is the tool result, which lands in
the agent's context window. A 380KB guide is 8 `<pre>` chunks; a 1.4MB one is 30. There
is no "download it and grep locally": whatever the page returns is paid for in tokens,
and one careless `get_page_text` on a GameFAQs page returns 14KB of cookie-consent
boilerplate before a single line of guide.

**Why it came up:** designing the GameFAQs harvest flow. The first instinct was a
fetcher (like `wiki_fetch.py`); the second was the browser's page-text tool. Neither
survives the arithmetic. `scripts/gf_probe.js` instead runs *inside* the page and
exposes `toc()` → `grep()` → `section(i, maxChars, from)`, every result capped at 12KB
and reporting what it cut, so a guide is read the way a person skims one — contents
first, then the paragraphs that matter.

**Takeaway:** when a surface can only be read through a channel that costs context
(a browser tool result, a screenshot, an LLM-summarised page), push the *selection*
logic to the far side of the channel and give every accessor a hard output budget with
a "dropped N" marker. The document never crosses; digests do. And when a site blocks
scripts outright, "read it like a person" is a legitimate front door — reusing the
browser's clearance cookie from a script is not.

## Synthetic fixtures only cover the shapes you imagined — run one real input before trusting them
The GameFAQs probe's heading detector passed 17 cases on a fixture I wrote, then met its
first real guide: the Secrets Guide boxes every heading as `//-=-=-=\\ … 04> TITLE …
\\-=-=-=//` and sub-heads as `>>Name >`, none of which any fixture contained, so a 30KB
guide came back as one section. Earlier the same fixture had *hidden* a bug the other way:
my hand-written contents lines were 77 characters wide, over a 72-character heading cap I
had chosen by feel — classic guides are 79 columns — so the TOC tests failed for a reason
that looked like a parser bug and was really a wrong constant.

**Why it came up:** the fail-first suite was genuinely red-then-green, which is exactly the
kind of evidence that invites overconfidence. The `grep`/`lines()` escape hatch kept the
pilot moving, and the fix went into the fixture as a block in the real guide's style.

**Takeaway:** a fixture you authored encodes your assumptions twice — in the input and in
the expectation — so before calling a parser covered, feed it one input you did not write
and read the whole output, not the assertion. Keep a raw-access escape hatch in any
instrument that classifies, so the day its classes are wrong the work still proceeds.

## A path-shaped ref only survives if nothing after it can be mistaken for the ref

`raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>` answered 404 for a branch named
`research/witcher-3` while the identical URL worked for `main`. The slash in the branch
name makes the boundary between ref and path ambiguous, and the server does not guess; the
explicit `refs/heads/research/witcher-3` form resolves, and it also works for `main`, so
there is no reason to ever write the short one.

**Why it came up:** the research flow fetches the probe from the repo instead of pasting
22KB into the page on every navigation. Arming from a work-in-progress branch returned a
14-byte "404: Not Found" body, which `eval` accepted happily — the failure surfaced two
calls later as a probe that "ignored" the fix.

**Takeaway:** when a ref, key or id can itself contain the separator, always use the
unambiguous long form — and have the fetcher reject a suspiciously short body instead of
handing it to the interpreter.

## A cache consulted before the network turns every fix into a no-op

The first version of the arm line read its localStorage copy first and fetched only if that
was empty. Every later page then ran the probe as it was the first time it was cached, so a
just-shipped fix appeared to do nothing and the obvious suspect — the fix — was innocent.

**Why it came up:** the same session updated the probe three times while researching, and
each update was invisible until the cache was cleared by hand.

**Takeaway:** for anything you are actively changing, fetch first and treat the cache as the
FALLBACK for a failed fetch, not the preferred source. A cache is a durability mechanism;
using it as the default read path silently pins the consumer to an old version. The related
tell is a component with a deliberate "already initialised, do nothing" guard: re-running
the loader is then a no-op, so the loader must clear the old instance before installing.

## Diff the parsed objects, not the text, or a serializer's punctuation becomes your signal

A CI gate was meant to catch "you edited a record but did not log the edit". Comparing the
two versions of the file as TEXT would have failed on rows nobody touched: appending an
entry to a JS array rewrites the previous last row by one character — the comma that now
follows its closing brace — so every splice would have demanded a changelog entry for
M243, then M261, then M265, each of which was untouched.

**Why it came up:** the history made it visible. Reconstructing which rows changed in each
past commit flagged exactly one row per research batch, always the last one, always the row
immediately before the newly appended block.

**Takeaway:** when comparing two versions of structured data, parse both and compare
canonical forms (sorted keys) rather than diffing the serialization. Incidental
punctuation — separators, trailing commas, key order, whitespace — belongs to the format,
not the content, and a gate that reports it will be trained away within a couple of PRs.
The tell to look for before trusting such a gate: does its output name a record that sits
adjacent to the real change?

## A positioning action should not be an animation

A "jump to this card" button set the target and called `scrollIntoView`, and the page never
moved. The stylesheet had `html{scroll-behavior:smooth}`, so the scroll was an animation
driven by the frame loop — and the destination was 35,000px away, which as an animation is
indistinguishable from a page that has frozen.

**Why it came up:** the jump measured as landed=false while the element, the outline and
the tab switch were all correct, which sent the search toward the selector before the CSS.

**Takeaway:** pass `behavior:"instant"` explicitly for any scroll whose purpose is to SHOW
something rather than to convey motion; inheriting a global smooth-scroll turns a jump into
a journey. The related trap when verifying: an animated scroll cannot complete in a hidden
or zero-height viewport, so size the viewport first and prefer synchronous measurement —
`requestAnimationFrame` never fires there either, and a test that awaits one simply hangs.

## A document that shares your subject's name is not necessarily about your subject

Xenogears' story arena is called "Battling", and the guide list carries a 53KB "Battling
FAQ". I read it for the arena's payouts, found zero money references in the entire file,
and was one step from recording "this arena has no defined payouts". The guide documents an
unlockable *versus* mode that happens to share the name — the story arena is a different
thing in a different guide, and it pays 300G to 2,500G plus a bonus scaled on speed and
damage taken.

**Why it came up:** this codex treats "no minigame with defined payouts" as a valid,
publishable result. That makes a wrong NEGATIVE as expensive as a wrong fact, because it
closes the question and nobody re-opens it.

**Takeaway:** before recording an absence, confirm the document you searched is about the
thing you meant — a name match is a hypothesis, not an identification. Check the document's
own framing (its contents list, its opening, the vocabulary it uses) against your subject.
The tell here was available and I nearly walked past it: the file was full of positive
evidence of a DIFFERENT subject — match counts, difficulty settings, a two-player mode —
which is much stronger information than the absence of the thing I wanted.

## A cache-buster you did not measure is a superstition, not a fix

Adding `?t=<now>` to a fetch only defeats a cache that keys on the query string; a CDN that
normalises it away serves the stale copy exactly as before, while the code now claims
otherwise.

**Why it came up:** the GameFAQs probe is fetched from `raw.githubusercontent.com` at arm
time, and that CDN serves a just-pushed file's previous version for up to five minutes
(`cache-control: max-age=300`). After one stale read during the `game()` proof, a `?t=`
cache-buster went into the arm line with a comment and a test asserting the URL carried it.
The next stale read, minutes after a merge, happened WITH the buster — the browser received
the pre-merge probe (26,598 bytes against the merged 27,968) on a URL that had never been
fetched before. The buster was removed and the docs rewritten to the honest instruction.

**Takeaway:** a workaround for a cache is a claim about how that cache keys its entries —
verify it with a readout that distinguishes the two versions (a length, a marker string, a
version number that actually changed) before writing it into the code, and keep the readout
in the tool's output so the next stale read cannot pass for a fresh one.

## A catalogue search answers in the script the label used — query that script before recording an absence
OTOTOY, a Japanese download store, returned only *Xenoblade 2* for the query "Xenoblade", so
two rows of the soundtrack list were written as "not on OTOTOY". The katakana query ゼノブレイド
returned the *Definitive Edition* and *Xenoblade Chronicles 3* albums as well — one of them at
24-bit/96 kHz, the best file on the whole list for that game. The Latin query had not been
wrong; it had matched only the albums whose titles the label had typed in Latin letters.

**Why it came up:** sourcing the 37 top-ranked soundtracks for Google Flow
(`docs/ost-sources.md`). "Store X does not carry Y" is exactly the documented absence that no
later check can hold true, and it was one search away from being copied into the codex as fact.

**Takeaway:** before writing that a catalogue lacks something, repeat the search in the
catalogue's own script and under the title's local name. A negative from a single-alphabet query
is evidence about the index, not the catalogue — the alphabet is one of the instrument's settings.

## A two-way check needs a mutant per direction, aimed at the example its own comment names
The restore contract compares the slots the `store` literal declares with the ones
`normalizeStore` defaults, in both directions. Its first design walked only top-level keys
and planned one sabotage, and both choices would have passed review while missing. The
page's own comment names `store.myGame.assign` as the slot that must never restore
undefined, a nested path the flat check skipped by construction. And the two mutations
anyone reaches for first, adding a slot to the literal and deleting a handler from the
normaliser, both land on the SAME arm, so the other arm would have shipped never once red.

**Why it came up:** PR #27, the analysis-layer gates. A design review ran both mutations and
got the identical error message from each, then tried a forgotten `myGame.tags` handler
against the flat check and got no error at all.

**Takeaway:** before counting a sabotage as coverage of a two-way comparison, write down
which arm it exercises; and test the gate against the exact case its motivating comment or
bug report names, because that example is the one a clean design most easily abstracts away.

## A gate that counts its own fixtures goes in before the fixtures, and the docs go last
The validator now fails the build when the sabotage count quoted in CLAUDE.md or README
differs from the number of sabotage fixtures. The PR that added that rule also added four
fixtures, so the rule changes the number it checks. There is exactly one safe order. Add
the comparison first: fixtures and docs both say 43, so it passes, which proves the rule
accepts a correct tree. Add the fixtures next: 47 against 43 goes red, which proves the rule
catches its own arrival. Update the docs last, and it goes green.

**Why it came up:** PR #27. Updating the doc number first would have produced a red build
whose message read like a typo in the doc, and the natural fix would have been reverting
the doc.

**Takeaway:** when a check measures something the same change is growing, sequence the
edits so every intermediate state is green for the right reason or red for the right
reason, and never leave the only red step looking like somebody else's mistake.

## A coverage floor has to be measured under the evidence rule that will feed it
The verb pass planned two gates: every tag must quote its own row, and every verb must carry
at least three mechanics. Each was reasonable alone. Together they could not both pass: the
quote rule dropped 25 of the 74 seeded tags, and two verbs, *The fleeing rare* and *Vista
sketch*, ended on one and two rows with no further support anywhere in 281 rows. The only
ways left to meet the floor were stretching a quote or inventing a tag, which is exactly what
the first gate exists to stop.

**Why it came up:** PR 1 of the analysis layer. The review surfaced the conflict before the
floor was written, and the owner chose to ship without the floor rather than loosen the
evidence.

**Takeaway:** before promising a minimum-count gate over data another gate filters, run the
filter and count what survives. If the floor then fails, the choice is the owner's (more
data, a lower floor, or no floor), never a quietly looser filter.

## A filter needs one spelling per thing, and a closed list turns a new spelling into a build failure
Clicking "Square" should list every Square game. GameFAQs writes SquareSoft, the hand-written
rows say Squaresoft and Wikipedia says Square, so a filter on the raw string lists a fraction
of the games under each spelling. Every value therefore goes through one fold table that the
filter and the validator both read. Case, spacing and punctuation are normalised away without
an entry, and the table holds only true spellings of one entity: Square is not Square Enix.
Platforms and genres are closed. A value the table does not list fails the build and names
the game. Studios and series stay open, since an unlisted studio name is still one studio.
Every entry must be used by some game, so the table cannot fill up with guesses.

**Why it came up:** the facets work (#30 and the Wikipedia infobox PR). The first infobox
harvest refused 20 platform strings and 10 genre strings in one printed list, and the
vocabulary grew by hand from that list instead of from memory.

**Takeaway:** before making free-text labels filterable, fold them through one table the
filter and the gate share. Close the table wherever its values are few and meaningful, and
hold every entry to being used.

## A mutant that also breaks the real data blinds the selftest
`--selftest` runs its sabotages only after the unmutated page validates. Removing the line
that reads Wikipedia's platforms makes Linux, macOS and Windows dead vocabulary. Base
validation then fails, no sabotage runs, and a harness reading the MISSED lines sees an empty
list. Read naively, that says the sabotage aimed at that line was still caught. An in-memory
check told the truth: with the source gone, the planted "Linux 2" raised no error at all.

**Why it came up:** the infobox PR's fail-first run. 31 of 32 mutants showed their expected
failure, and the 32nd showed exit 1 with nothing MISSED.

It happened again one PR later, from the other side. The category sabotages went in before the
docs caught up, on purpose, so the base run failed on the quoted sabotage count and ran nothing,
which read as "red for the right reason". Once the counts matched, one sabotage turned out to be
MISSED: a misspelled kind in the category table made the page's `facetsOf` throw instead of
letting the validator name it, and on the live site that would have broken every game page.

**Takeaway:** before believing an empty "missed" list, confirm the judge ran its cases. An exit
code cannot tell "caught everything" from "never started", and a base run that is red for a
planned reason is exactly that kind of run: read the sabotage results again once it is green.

## `toISOString()` gives the UTC day, which is not the owner's today
Cutting `new Date().toISOString()` to its first ten characters reads like "today's date" and is
the date in UTC. East of Greenwich it still says yesterday from local midnight until the offset
has passed; west of it, the evening already says tomorrow.

**Why it came up:** Persona 4 was spliced at 01:09 CEST on 2026-09-14. The splicer dated its
changelog entry that way, found an entry already dated 2026-09-13, and merged the new rows into
the previous day's facets entry, under a title that described none of them. Nothing failed: the
dates were still strictly decreasing, and two other scripts defaulted their `--today` the same way.

**Takeaway:** a date meaning "the day this happened, for the person using it" comes from the local
clock, and the tool that writes one takes a `--today` flag so a run can be pinned. Test the
conversion in a child process with `TZ` set to a zone where the two readings differ, and scan for
the pattern so the next script cannot copy it.

## Two sources that agree because one copied the other are one source
A wiki and a guide can agree on a number only because one copied the other, and then the agreement
proves only that the number was written down once.

**Why it came up:** Ni no Kuni's Crypt Casino prize prices matched between the Ni no Kuni wiki and
noz3r0's walkthrough, which looked like two confirmations of all sixteen prices. The wiki's
introduction to the casino turned out to be noz3r0's paragraph almost word for word, so the
individual prices rest on one reading. A third guide, independent of both, confirmed only the four
tickets' 75,000-chip total and which prize ranks open when, and the digest records exactly that.

**Takeaway:** before counting a second source, compare a sentence of the prose around the fact. If
the wording matches, treat the two as one source, look for a third that words it differently, and
write down which parts of the claim that third source actually covers.

## A summary of a research session is recall, not a source
When a long session's context is compacted, its facts carry forward as a paraphrase, and anything
written from that paraphrase inherits its gaps without showing where they are.

**Why it came up:** Final Fantasy X's reward digest was written straight after a compaction. Checked
against the session's raw tool results before the commit, most of it held: every guide's size,
date and version, and all 114 triage ids. But three pointer section names had been made up, one
claim (a sigil game called "the hardest of the three") appeared in no guide, two table rows cited a
source that said something narrower, and a title the probe had cut at 40 characters had been
quietly completed.

**Takeaway:** after a compaction, take every pointer, section name and number from the recorded tool
output, never from the summary. Copy a section name from the probe's own `sec` or `head` field,
narrow a row to what its sources actually say, and drop a claim no passage carries.

## A difference of unions forgets which record said what
Subtracting everything logged before from everything logged now cannot tell a row logged again in
a new record from one still sitting in its old record.

**Why it came up:** `check_changes.mjs` took the union of every changelog entry's `updated` list at
the PR's base and in the working copy, and counted a row as newly logged only if the base's union
lacked it. That correctly refused a re-edit covered by an old entry, but it also refused a row named
again in a brand-new entry, so the 85 rows logged at least once could never be logged again. It
surfaced when Final Fantasy XIV's three rows, logged that morning, were given a second source, and
a probe with a next-day entry was still refused.

**Takeaway:** when a gate asks "is this new since the base?", diff each record against its own
counterpart (here each changelog entry, matched by date) rather than the pooled contents, and test
the case where one item appears in two records.

## A class named like a label is a styling hook, not the label
A CSS class that shares a word with a badge can sit on more elements than the badge does.

**Why it came up:** the GameFAQs probe read a guide's `rec` class as "recommended". On live
listings (2026-09-14) Persona 4's two *Most Recommended* guides carried it, and so did every one of
The Witcher 3's *Highest Rated* guides, a listing with no Most Recommended guide at all. The flag the
owner asked for exists only in the flair's text, so a pick built on the class would have read a
Highest Rated walkthrough as the recommended one.

**Takeaway:** read the label the user sees, and keep the class for styling. Before building on a
class, list which elements carry it on a real page.

## A rule that breaks ties by position needs the position kept in every copy it runs over
When "the first flagged item wins", re-sorting the list changes the answer without changing any
item.

**Why it came up:** Suikoden V's listing flags two walkthroughs *Most Recommended*, Golden Sun's
three and Final Fantasy VI's seven. The probe's `pick()` takes the first one GameFAQs lists. The
digest linter runs the same pick over each digest's Triage table, and those tables are sorted by
score, where the flagged walkthroughs tie. Sorted that way, Golden Sun's table put Telago's 39216
above ElectroSpecter's 31453, so the linter would have demanded a different guide from the one
actually read. The tables keep listing order among the tied rows, and swapping Suikoden V's two
tied rows in memory made the linter name the other guide (2026-09-15).

**Takeaway:** when a selection rule is "first match", write down which order counts, and keep that
order in every sorted copy the rule is run over, or break the tie on a key the copies share.

## A default written into shipped data reads as the user's own choice
A field that means "the user decided this" has no room for a guess. Once a guess ships in it, the
interface shows it exactly like a real decision, and everything downstream counts it as one.

**Why it came up:** early research sessions wrote `want:"Yes"` or `"Maybe"` into 179 of the 294
mechanics, and a 5-star rating into six, as stand-ins for the owner's taste. The page merges the
owner's saved choices over the data, so those marks lit the same Yes and Maybe buttons as a real click,
filled the My Game board and the "In my game" tally, and a memory file later cited them as about a
hundred confirmed picks. On 2026-09-15 the owner said they had made none of them. A reset of saved
choices alone would have changed nothing, because the marks were never saved choices: they were data.
The data now ships `want:""` and `rating:0` on every row, and the validator refuses anything else.

**Takeaway:** ship user-decision fields empty and gate that they stay empty; put an inference in a
field named for what it is, and never quote a stored choice back as someone's preference without
knowing who wrote it.

## A sabotage anchored on a field's absence rots the day the field arrives
A mutation test that BUILDS the fault it wants to catch — by matching a shape that exists only
while some field is missing — stops testing anything once that field exists, and it does not
necessarily say so.

**Why it came up:** two validator sabotages injected a `refs` field into M001 with the pattern
`{id:"M001",[^}]*}`, which matches only while the row has no nested braces. The comment above them
stated that a real `refs` on M001 would break the anchor LOUDLY, as a parse error. On 2026-09-16 the
sources pass gave M001 its refs; the pattern stopped at the inner brace, the injected text landed
somewhere harmless, and both checks passed while proving nothing. What caught it was `--selftest`
counting the checks that fired: "2 check(s) did not fire — the gate is weaker than it looks".

**Takeaway:** mutate what the data HAS rather than what it lacks, and trust a mutation suite only as
far as its count of checks that actually fired — a prediction in a comment about how an anchor will
fail is itself untested.

## The flourishes in a description are where it goes wrong
A summary written from memory usually gets a system's core right and its decorations wrong: the
superlative, the universal and the vivid example are the most specific claims in it and the least
checked.

**Why it came up:** batch 2 of the sources pass checked 43 mechanics rows written in July against two
sources each. The core of almost every row held: Final Fantasy VII's mastered materia does copy itself,
Chrono Cross does grow by boss stars. What failed were the flourishes: "the game's best materia",
"famously breaks the game", "a pop idol", "heavy hidden RNG", "running is always allowed", "each rescue
reopens shops", and enemies frozen into platforms. Three rows had to be renamed because the claim sat
in the title.

**Takeaway:** when verifying a description, split out every superlative ("best", "famously"), every
universal ("every", "always", "only", "no levels") and every concrete example, and give each its own
two sources. Keep a name to what the core claim supports, since a flourish in a title takes a rename to
remove.

## A citation format with a length limit silently rewards the sources whose headings are short
A pointer grammar that caps a section name will not fail on a long one — it stops matching, so the
pointer either disappears from the check or parses as a different, shorter section.

**Why it came up:** batch 3 of the sources pass hit it in three games out of nine. A_I_e_x's Legend
of Legaia guide heads its six top-level sections with 78-character rules; PhamtonPain's Alundra
lists use 92; a Final Fantasy Tactics table's own column row is 49. The digest linter's pointer
regex allows a section of 1 to 40 characters, so a 69-character heading — "CHARACTERS: HUAN,
LEKNAAT, LUC, VIKTOR, …" — still matched, by reading "CHARACTERS: HUAN" as the section and the rest
as the author. It looked like a valid citation and pointed at nothing.

**Takeaway:** when a citation format bounds a field, check what a too-long value does — dropped,
truncated, or re-parsed as the next field — and make the tool say which. Until it does, cite the
facts to whichever source's headings fit and record in the coverage note that the other one
corroborates but cannot be pointed at; never shorten a heading to make it fit, because a shortened
name is a name that does not exist.

## A reference that covers every edition of a thing answers about the newest one
A wiki article, a manual or a docs page that spans all versions of its subject will quietly answer
with the newest version's names and behaviour, because that is the version its editors are playing.

**Why it came up:** the PS1 expansion pass wrote two Final Fantasy Tactics rows from the Final
Fantasy Wiki, which now documents the 2025 remaster on the same pages. Move-Find Item is filed
under Treasure Hunter, Propositions under Errands, and the Brave Story under Chronicles, and the
mechanics sections mix in behaviour that exists only in the remaster: chemists with the ability
innately, cancelling a move after a find, enemy chemists taking the treasure first. A row written
from that page alone would have described a game released twenty-eight years after the one in the
codex, under names no PlayStation player has seen. The same shape, one game earlier: the Suikoden
Wiki's Weapons page is series-wide, so its account of the four hammers and the level-16 ceiling is
written across six games, with the exceptions belonging to the first one.

**Takeaway:** when a source covers several editions, treat every name and number in it as
belonging to the newest until an edition-specific source confirms otherwise — and make the
edition-specific source the one that sets the vocabulary, not just the one that checks the facts.
The tell is cheap to look for: a page that names a release you are not researching anywhere in its
text is covering that release everywhere in its text.
