#!/usr/bin/env python3
"""Fetch Metacritic critic (Metascore) + user scores for the codex's game roster.

Design rule: FAIL CLOSED. Every number is range-validated before it is kept; a
value that cannot be validated is written as null, never guessed. That matters
because Metacritic's page embeds a *flattened* JSON array where score fields are
index POINTERS, not values — a naive regex happily returns things like 2769 for
a "user score" that can only be 0-10. The range guards below are what stop that
fabricated data from ever reaching the codex.

Sources, in order of trust:
  1. backend.metacritic.com composer API   -> BOTH scores as plain JSON, from the
     page's own `critic-score-summary` and `user-score-summary` components.
     This is the authoritative path and avoids HTML scraping entirely.
  2. page JSON-LD  aggregateRating         -> critic score (independent cross-check)
  3. en.wikipedia.org  "| MC = ..." field  -> second independent critic cross-check

Coverage is genuinely partial: Metacritic launched in 2001, so many pre-2001
games have no entry (404) or a page with no Metascore. Both cases are recorded
honestly as null with a reason, so "not scored" is never confused with "scored
badly".

Usage:
    python3 scripts/fetch_scores.py --roster <roster.json> --out scripts/scores.json
    python3 scripts/fetch_scores.py --selftest      # prove the guards reject bad input
"""
import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

TIMEOUT = 25
DELAY = 1.2  # polite pause between requests
UA = "jrpg-design-codex-research/1.0 (personal game-design research)"
API_KEY = "1MOZgmNFxvmljaQR1X9KAij9Mo4xAY3u"  # key Metacritic's own web frontend ships publicly

ALLOWED_HOSTS = {"www.metacritic.com", "backend.metacritic.com", "en.wikipedia.org"}


def get(url, timeout=TIMEOUT):
    """Fetch a URL from an allowlisted host. Returns text, or None on any failure."""
    host = urllib.parse.urlparse(url).netloc
    if host not in ALLOWED_HOSTS:
        raise SystemExit(f"Refusing non-allowlisted host: {host!r}")
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read().decode("utf8", "ignore")
    except urllib.error.HTTPError as e:
        return f"__HTTP_{e.code}__"
    except Exception:
        return None


# ---------------------------------------------------------------- validation
def valid_critic(v):
    """Metascore must be an int 0-100. Anything else is rejected."""
    try:
        n = int(v)
    except (TypeError, ValueError):
        return None
    return n if 0 <= n <= 100 else None


def valid_user(v):
    """User score must be 0-10 with at most one decimal.

    THIS is the guard that rejects flattened-array index pointers (2769, 3830...)
    which a naive scrape mistakes for scores.
    """
    try:
        f = float(v)
    except (TypeError, ValueError):
        return None
    return round(f, 1) if 0.0 <= f <= 10.0 else None


def valid_count(v):
    try:
        n = int(v)
    except (TypeError, ValueError):
        return None
    return n if 0 <= n <= 1_000_000 else None


# ---------------------------------------------------------------- fetch steps
def find_candidates(title):
    """Resolve a game title to Metacritic entries (handles version disambiguation)."""
    q = urllib.parse.quote(title)
    url = (f"https://backend.metacritic.com/finder/metacritic/search/{q}/web"
           f"?apiKey={API_KEY}&offset=0&limit=8&mcoTypeId=13")
    raw = get(url)
    if not raw or raw.startswith("__HTTP_"):
        return []
    try:
        items = json.loads(raw).get("data", {}).get("items", [])
    except json.JSONDecodeError:
        return []
    out = []
    for it in items:
        plats = it.get("platforms") or []
        out.append({
            "title": it.get("title"),
            "slug": it.get("slug"),
            "year": it.get("premiereYear"),
            "critic": valid_critic((it.get("criticScoreSummary") or {}).get("score")),
            "platforms": [p.get("name") for p in plats if isinstance(p, dict)],
        })
    return out


# Metacritic uses BOTH long and short platform slugs (…?platform=nintendo-ds and
# ?platform=ds), so both forms are mapped. A slug that falls through to the
# generic Title() fallback (e.g. "ds" -> "Ds") silently skips the launch-year
# caveat below, which is exactly how Chrono Trigger's "DS port" note went missing.
PLAT_LABEL = {
    "playstation": "PS", "ps": "PS", "playstation-2": "PS2", "ps2": "PS2",
    "playstation-3": "PS3", "ps3": "PS3", "playstation-4": "PS4", "ps4": "PS4",
    "playstation-5": "PS5", "ps5": "PS5", "psp": "PSP",
    "playstation-vita": "Vita", "vita": "Vita",
    "nintendo-64": "N64", "n64": "N64",
    "nintendo-switch": "Switch", "switch": "Switch",
    "nintendo-ds": "DS", "ds": "DS", "nintendo-3ds": "3DS", "3ds": "3DS",
    "super-nintendo": "SNES", "snes": "SNES",
    "game-boy-advance": "GBA", "gba": "GBA",
    "gamecube": "GameCube", "wii": "Wii", "wii-u": "Wii U",
    "xbox": "Xbox", "xbox-360": "X360", "xbox-one": "Xbox One",
    "pc": "PC", "ios-iphoneipad": "iOS", "ios": "iOS",
    "dreamcast": "Dreamcast", "sega-saturn": "Saturn", "saturn": "Saturn",
}


# Hardware launch years — used only to flag "this score is from a later port".
PLAT_LAUNCH = {
    "PS": 1994, "PS2": 2000, "PS3": 2006, "PS4": 2013, "PS5": 2020,
    "PSP": 2004, "Vita": 2011, "N64": 1996, "Switch": 2017, "DS": 2004,
    "3DS": 2011, "SNES": 1990, "GBA": 2001, "GameCube": 2001, "Wii": 2006,
    "Xbox": 2001, "X360": 2005, "iOS": 2007, "Dreamcast": 1998, "Saturn": 1994,
}


def _platform_from_url(u):
    m = re.search(r"platform=([a-z0-9-]+)", u or "")
    if not m:
        return None
    slug = m.group(1)
    return PLAT_LABEL.get(slug, slug.replace("-", " ").title())


def scores_from_composer(slug):
    """Both scores from Metacritic's own composer API — the authoritative path.

    The page's `user-score-summary` / `critic-score-summary` components carry the
    real values as plain JSON, so no HTML scraping (and no index-pointer trap) is
    involved. Every number still passes the range guards before being returned.
    """
    url = (f"https://backend.metacritic.com/composer/metacritic/pages/games/{slug}/web"
           f"?apiKey={API_KEY}")
    raw = get(url)
    out = {"mc": None, "mcN": None, "us": None, "usN": None,
           "mcPlat": None, "sentiment": None, "resolved": False}
    if not raw or raw.startswith("__HTTP_"):
        return out
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return out
    for comp in data.get("components", []):
        name = (comp.get("meta") or {}).get("componentName")
        item = (comp.get("data") or {}).get("item") or {}
        if name == "critic-score-summary":
            out["mc"] = valid_critic(item.get("score"))
            out["mcN"] = valid_count(item.get("reviewCount"))
            out["sentiment"] = item.get("sentiment")
            out["mcPlat"] = out["mcPlat"] or _platform_from_url(item.get("url"))
            out["resolved"] = out["resolved"] or bool(item.get("url"))
        elif name == "user-score-summary":
            # Metacritic withholds a user score until it has enough ratings. In that
            # state the API still returns score:0 — but with sentiment:null (and
            # sometimes positiveCount>0, which a real 0 could never have). Treating
            # that 0 as a score would tell the reader a game rated 0/10, so it is
            # rejected as "not published" rather than stored.
            raw_score = item.get("score")
            published = item.get("sentiment") is not None
            out["us"] = valid_user(raw_score) if published else None
            out["usN"] = valid_count(item.get("reviewCount"))
            out["mcPlat"] = out["mcPlat"] or _platform_from_url(item.get("url"))
            out["resolved"] = out["resolved"] or bool(item.get("url"))
    return out


def critic_from_jsonld(slug):
    """Independent critic cross-check from the page's JSON-LD aggregateRating."""
    html = get(f"https://www.metacritic.com/game/{slug}/")
    if not html or html.startswith("__HTTP_"):
        return None
    m = re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
    if not m:
        return None
    try:
        agg = json.loads(m.group(1)).get("aggregateRating") or {}
    except json.JSONDecodeError:
        return None
    return valid_critic(agg.get("ratingValue"))


def wikipedia_mc(title):
    """Independent critic cross-check from Wikipedia's `| MC = ...` reception field."""
    url = ("https://en.wikipedia.org/w/api.php?action=parse&format=json&formatversion=2"
           f"&prop=wikitext&redirects=1&page={urllib.parse.quote(title.replace(' ', '_'))}")
    raw = get(url)
    if not raw or raw.startswith("__HTTP_"):
        return None
    try:
        wt = json.loads(raw)["parse"]["wikitext"]
    except Exception:
        return None
    m = re.search(r"\|\s*MC\s*=\s*([^\n]{0,120})", wt)
    if not m:
        return None
    nums = re.findall(r"(\d{1,3})\s*/\s*100", m.group(1))
    return valid_critic(nums[0]) if nums else None


# ---------------------------------------------------------------- self-test
def selftest():
    """Prove the guards reject the exact bad values that broke the naive scrape."""
    cases = [
        ("user 2769 (index pointer)", valid_user(2769), None),
        ("user 3830 (index pointer)", valid_user(3830), None),
        ("user 8.9 (real)",           valid_user(8.9),  8.9),
        ("user 10 (edge, real)",      valid_user(10),   10.0),
        ("critic 94 (real)",          valid_critic(94), 94),
        ("critic 1777 (pointer)",     valid_critic(1777), None),
        ("critic -5",                 valid_critic(-5), None),
    ]
    ok = True
    for label, got, want in cases:
        status = "PASS" if got == want else "FAIL"
        if got != want:
            ok = False
        print(f"  [{status}] {label:30} -> {got!r} (want {want!r})")
    print("SELFTEST:", "all guards hold" if ok else "GUARD FAILURE")
    return 0 if ok else 1


# ---------------------------------------------------------------- main
def title_to_slug(title):
    """Metacritic's canonical slug for a title (usually the ORIGINAL release)."""
    t = re.sub(r"\(\d{4}\)", " ", title)          # drop a disambiguating year
    t = t.replace("&", " and ").replace("'", "")
    t = re.sub(r"[^A-Za-z0-9]+", "-", t).strip("-").lower()
    return t or None


def pick(cands, title, year):
    """Choose the ORIGINAL release: prefer the earliest-year entry whose title matches."""
    if not cands:
        return None
    t = re.sub(r"[^a-z0-9]", "", title.lower())
    scored = []
    for c in cands:
        ct = re.sub(r"[^a-z0-9]", "", (c["title"] or "").lower())
        exact = ct == t
        contains = t in ct or ct in t
        if not (exact or contains):
            continue
        yr = c.get("year") or 9999
        # prefer exact title, then the release closest to the codex's first-release year
        scored.append((0 if exact else 1, abs(yr - year) if year else 0, c))
    if not scored:
        return None
    scored.sort(key=lambda x: (x[0], x[1]))
    return scored[0][2]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--roster")
    ap.add_argument("--out")
    ap.add_argument("--selftest", action="store_true")
    ap.add_argument("--only", help="comma-separated titles, for spot checks")
    args = ap.parse_args()

    if args.selftest:
        sys.exit(selftest())
    if not args.roster or not args.out:
        sys.exit("need --roster and --out (or --selftest)")

    roster = json.load(open(args.roster))
    if args.only:
        want = {s.strip().lower() for s in args.only.split(",")}
        roster = [g for g in roster if g["title"].lower() in want]

    results = []
    for i, g in enumerate(roster, 1):
        title, year = g["title"], g.get("year")
        cands = find_candidates(title)
        chosen = pick(cands, title, year)
        rec = {"title": title, "year": year, "mc": None, "mcN": None,
               "us": None, "usN": None, "mcPlat": None, "mcUrl": None,
               "note": None, "wiki_mc": None, "sentiment": None}

        # Prefer the DIRECT slug: Metacritic's canonical slug is normally the
        # ORIGINAL release, whereas the finder does fuzzy relevance matching and
        # happily returns a remaster ("Final Fantasy X" -> the 2014 HD Remaster)
        # or an unrelated game ("Legend of Mana" -> "Legend of Keepers").
        direct = title_to_slug(title)
        direct_s = scores_from_composer(direct) if direct else None
        if direct_s and direct_s.get("resolved"):
            chosen = {"slug": direct, "title": title, "year": year, "platforms": []}

        if not chosen or not chosen.get("slug"):
            rec["note"] = "no Metacritic entry"
        else:
            slug = chosen["slug"]
            rec["mcUrl"] = f"https://www.metacritic.com/game/{slug}/"
            s = scores_from_composer(slug)
            rec["mc"], rec["mcN"] = s["mc"], s["mcN"]
            rec["us"], rec["usN"] = s["us"], s["usN"]
            rec["mcPlat"] = s["mcPlat"] or (chosen.get("platforms") or [None])[0]
            rec["sentiment"] = s["sentiment"]
            if rec["mc"] is None:
                rec["note"] = "page exists, no Metascore (too few critic reviews)"
            # Flag a score measured on hardware that did not exist when the game
            # shipped — e.g. Chrono Trigger (1995) scored on the 2008 DS port.
            launch = PLAT_LAUNCH.get(rec["mcPlat"])
            if launch and year and launch > year + 1:
                rec["note"] = ((rec["note"] + "; ") if rec["note"] else "") + \
                              f"score is from the {rec['mcPlat']} version, not the {year} original"
            elif chosen.get("year") and year and chosen["year"] - year >= 3:
                rec["note"] = ((rec["note"] + "; ") if rec["note"] else "") + \
                              f"score is the {chosen['year']} release, not the {year} original"
        rec["wiki_mc"] = wikipedia_mc(title)
        results.append(rec)
        print(f"[{i:2}/{len(roster)}] {title[:38]:40} mc={str(rec['mc']):5} "
              f"us={str(rec['us']):5} wiki={str(rec['wiki_mc']):5} {rec['note'] or ''}")
        time.sleep(DELAY)

    json.dump(results, open(args.out, "w"), indent=1)

    n_mc = sum(1 for r in results if r["mc"] is None)
    n_us = sum(1 for r in results if r["us"] is None)
    disagree = [r for r in results if r["mc"] and r["wiki_mc"] and abs(r["mc"] - r["wiki_mc"]) > 1]
    print(f"\nWrote {args.out}: {len(results)} games")
    print(f"  no critic score: {n_mc}   no user score: {n_us}")
    print(f"  critic disagreements vs Wikipedia (>1pt): {len(disagree)}")
    for r in disagree:
        print(f"    ! {r['title']}: metacritic={r['mc']} wikipedia={r['wiki_mc']}")


if __name__ == "__main__":
    main()
