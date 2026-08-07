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
