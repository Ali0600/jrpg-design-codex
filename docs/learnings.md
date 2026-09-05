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
