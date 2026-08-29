#!/usr/bin/env python3
"""Fetch wiki page content through the MediaWiki API — the front door for bots.

Fandom (and other MediaWiki wikis) return HTTP 403 to automated requests for
their normal HTML pages, even with a browser User-Agent. But every MediaWiki
site exposes api.php for programmatic access, and that endpoint is NOT blocked.
So instead of scraping HTML and getting walled, we ask the API for the page —
sanctioned, stable, and it returns the raw wikitext with tables intact (exactly
what reward research needs).

This is the "fix", not a "bypass": no fingerprint spoofing, no challenge solving,
no arms race — just the interface the wiki publishes for machines. See the
"Research playbook" section of CLAUDE.md.

Usage:
    python3 scripts/wiki_fetch.py finalfantasy.fandom.com "Frog catching"
    python3 scripts/wiki_fetch.py finalfantasy.fandom.com "Chocobo Hot & Cold" --plain
    python3 scripts/wiki_fetch.py strategywiki.org "Final Fantasy IX"

Exits non-zero on any failure (missing page, network error, blocked host) so it
can gate a research script rather than silently returning nothing.
"""
import argparse
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

TIMEOUT = 20  # seconds — bound the outbound request

# Allowlist of recognized MediaWiki hosts. Keeps this from becoming a general
# open fetcher (SSRF-safe): an unexpected host is refused, not requested.
ALLOWED_HOST_RE = re.compile(
    r"^[a-z0-9-]+\.(fandom\.com|gamepedia\.com|wiki\.gg)$"
    r"|^(strategywiki\.org|www\.mariowiki\.com|nintendo\.fandom\.com|wikibound\.info)$",
    re.IGNORECASE,
)

# A descriptive User-Agent is good API citizenship (MediaWiki asks for one).
USER_AGENT = "jrpg-design-codex-research/1.0 (personal game-design research)"


def api_base(host: str) -> str:
    # Fandom serves the API at /api.php; most other MediaWiki installs use /w/api.php.
    if host.endswith("fandom.com"):
        return f"https://{host}/api.php"
    return f"https://{host}/w/api.php"


def fetch_parse(host: str, page: str, prop: str) -> dict:
    if not ALLOWED_HOST_RE.match(host):
        sys.exit(
            f"Refusing host {host!r}: not a recognized MediaWiki wiki host.\n"
            f"Add it to ALLOWED_HOST_RE in scripts/wiki_fetch.py if it is one."
        )
    params = {
        "action": "parse",
        "page": page,
        "format": "json",
        "formatversion": "2",
        "prop": prop,
        "redirects": "1",
    }
    url = api_base(host) + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            data = json.load(resp)
    except urllib.error.HTTPError as e:
        sys.exit(f"HTTP {e.code} from {host} API for {page!r}: {e.reason}")
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as e:
        sys.exit(f"Fetch failed for {host}/{page!r}: {e}")

    if "error" in data:
        info = data["error"].get("info", "unknown error")
        sys.exit(f"API error for {page!r}: {info}")
    parse = data.get("parse")
    if not parse:
        sys.exit(f"No content returned for {page!r} (page may not exist).")
    return parse


_TAG_RE = re.compile(r"<[^>]+>")
_WS_RE = re.compile(r"\n{3,}")


def html_to_text(html: str) -> str:
    # Light, dependency-free readability pass on the API's parsed HTML.
    text = re.sub(r"(?is)<(script|style|table).*?</\1>", "", html)  # drop noisy blocks
    text = _TAG_RE.sub("", text)
    text = (text.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
                .replace("&quot;", '"').replace("&#39;", "'").replace("&nbsp;", " "))
    return _WS_RE.sub("\n\n", text).strip()


def main() -> None:
    ap = argparse.ArgumentParser(description="Fetch a wiki page via the MediaWiki API.")
    ap.add_argument("host", help="wiki host, e.g. finalfantasy.fandom.com")
    ap.add_argument("page", help='page title, e.g. "Frog catching"')
    ap.add_argument("--plain", action="store_true",
                    help="strip to readable prose (drops tables) instead of raw wikitext")
    args = ap.parse_args()

    if args.plain:
        parse = fetch_parse(args.host, args.page, prop="text")
        print(f"# {parse.get('title', args.page)}\n")
        print(html_to_text(parse["text"]))
    else:
        parse = fetch_parse(args.host, args.page, prop="wikitext")
        print(f"# {parse.get('title', args.page)}  (raw wikitext — tables preserved)\n")
        print(parse["wikitext"])


if __name__ == "__main__":
    main()
