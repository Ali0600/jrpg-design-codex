#!/usr/bin/env python3
"""Fetch UI screenshots for the codex's gallery, through the MediaWiki API.

Sibling of wiki_fetch.py and bound by the same host allowlist. Two modes:

    # See what images a wiki page actually holds (with sizes, so UI shots
    # can be told apart from character art before downloading anything):
    python3 scripts/fetch_ui_shots.py --list kingdomhearts.fandom.com "Drive Form"

    # Download one image, post-process it, and record its provenance:
    python3 scripts/fetch_ui_shots.py --get kingdomhearts.fandom.com "File:Drive Gauge KHII.png" \
        --out shots/kingdom-hearts-ii/battle-drive-gauge --page "Drive Form"

--out is given WITHOUT an extension; the script appends .png or .jpg after
post-processing. Rules: the CDN's bytes are identified by MAGIC NUMBERS, never the
filename (Fandom serves WebP under .png names); sources <= 512px wide stay PNG
(JPEG smears pixel art), anything wider is resized to <= 960px and saved as JPEG.
Every download appends an attribution line to shots/SOURCES.md.

Fails closed on unknown hosts, missing pages, oversized downloads, and any sips
error, so a bad fetch can never silently land a broken file in the gallery.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from wiki_fetch import ALLOWED_HOST_RE, USER_AGENT, api_base  # noqa: E402

TIMEOUT = 30
MAX_DOWNLOAD = 15 * 1024 * 1024  # bound the untrusted response
# Image bytes must come from the wiki's own CDN or the wiki itself.
ALLOWED_IMAGE_HOST_RE = re.compile(
    r"(^|\.)wikia\.nocookie\.net$|(^|\.)wikimedia\.org$", re.IGNORECASE
)

PNG = b"\x89PNG\r\n\x1a\n"
JPG = b"\xff\xd8\xff"


def die(msg):
    sys.exit(f"fetch_ui_shots: {msg}")


def api_get(host, params):
    if not ALLOWED_HOST_RE.match(host):
        die(f"refusing host {host!r}: not on the wiki allowlist (see wiki_fetch.py)")
    url = api_base(host) + "?" + urllib.parse.urlencode({**params, "format": "json"})
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        return json.load(r)


def list_images(host, page):
    data = api_get(host, {"action": "query", "titles": page, "prop": "images", "imlimit": "50"})
    pages = data.get("query", {}).get("pages", {})
    titles = [i["title"] for p in pages.values() for i in p.get("images", [])]
    if not titles:
        die(f"no images found on {page!r} (missing page, or an image-free page)")
    # One batched imageinfo call for sizes, so the listing shows what is worth taking.
    info = api_get(host, {
        "action": "query", "titles": "|".join(titles[:50]),
        "prop": "imageinfo", "iiprop": "url|size|mime",
    })
    rows = []
    for p in info.get("query", {}).get("pages", {}).values():
        for ii in p.get("imageinfo", []):
            rows.append((p["title"], ii.get("width", 0), ii.get("height", 0), ii.get("mime", "?"), ii.get("url", "")))
    rows.sort(key=lambda r: -(r[1] * r[2]))
    for title, w, h, mime, _url in rows:
        print(f"{w:5}x{h:<5} {mime:12} {title}")
    return rows


def resolve_url(host, file_title):
    data = api_get(host, {"action": "query", "titles": file_title, "prop": "imageinfo", "iiprop": "url|size"})
    for p in data.get("query", {}).get("pages", {}).values():
        for ii in p.get("imageinfo", []):
            return ii["url"], ii.get("width", 0)
    die(f"{file_title!r} has no imageinfo — wrong File: title? (--list shows the real ones)")


def download(url):
    host = urllib.parse.urlparse(url).hostname or ""
    if not ALLOWED_IMAGE_HOST_RE.search(host):
        die(f"refusing image host {host!r}: not a recognized wiki CDN")
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        blob = r.read(MAX_DOWNLOAD + 1)
    if len(blob) > MAX_DOWNLOAD:
        die(f"download exceeds {MAX_DOWNLOAD} bytes — not a screenshot")
    return blob


def magic_ext(blob):
    if blob.startswith(PNG):
        return "png"
    if blob.startswith(JPG):
        return "jpg"
    if blob[:4] == b"RIFF" and blob[8:12] == b"WEBP":
        return "webp"
    if blob[:6] in (b"GIF87a", b"GIF89a"):
        return "gif"
    die("downloaded bytes are not PNG/JPEG/WebP/GIF — refusing to keep them")


def sips(*args):
    r = subprocess.run(["sips", *args], capture_output=True, text=True)
    if r.returncode != 0:
        die(f"sips failed: {r.stderr.strip() or r.stdout.strip()}")
    return r.stdout


def post_process(blob, out_base):
    """Write the final .png or .jpg next to out_base; return the path written."""
    ext = magic_ext(blob)
    with tempfile.NamedTemporaryFile(suffix=f".{ext}", delete=False) as tf:
        tf.write(blob)
        tmp = tf.name
    try:
        width = int(sips("-g", "pixelWidth", tmp).splitlines()[-1].split()[-1])
        os.makedirs(os.path.dirname(out_base), exist_ok=True)
        if width <= 512:
            out = out_base + ".png"           # pixel art stays crisp
            sips("-s", "format", "png", tmp, "--out", out)
        elif width <= 960:
            # sips -Z resamples in BOTH directions — never upscale a small source.
            out = out_base + ".jpg"
            sips("-s", "format", "jpeg", "-s", "formatOptions", "82", tmp, "--out", out)
        else:
            out = out_base + ".jpg"
            sips("-s", "format", "jpeg", "-s", "formatOptions", "82", "-Z", "960", tmp, "--out", out)
        return out, width
    finally:
        os.unlink(tmp)


def record_source(out_path, host, page, file_title):
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ledger = os.path.join(root, "shots", "SOURCES.md")
    os.makedirs(os.path.dirname(ledger), exist_ok=True)
    if not os.path.exists(ledger):
        with open(ledger, "w", encoding="utf-8") as f:
            f.write("# Screenshot sources\n\nEvery gallery image, its source wiki page, "
                    "and the original file it was derived from. Screenshots are the "
                    "property of their respective publishers, reproduced at reduced "
                    "resolution for design study and commentary.\n\n")
    rel = os.path.relpath(out_path, root)
    page_url = f"https://{host}/wiki/{urllib.parse.quote(page.replace(' ', '_'))}"
    with open(ledger, "a", encoding="utf-8") as f:
        f.write(f"- `{rel}` — [{page}]({page_url}) ({file_title}, {host})\n")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--list", nargs=2, metavar=("HOST", "PAGE"))
    ap.add_argument("--get", nargs=2, metavar=("HOST", "FILE_TITLE"))
    ap.add_argument("--out", help="output path WITHOUT extension (shots/<slug>/<name>)")
    ap.add_argument("--page", help="the wiki page the image was chosen from (for SOURCES.md)")
    args = ap.parse_args()

    if args.list:
        list_images(*args.list)
        return
    if args.get:
        if not args.out or not args.page:
            die("--get needs --out and --page")
        if not re.match(r"^shots/[a-z0-9-]+/[a-z0-9-]+$", args.out):
            die(f"--out must look like shots/<game-slug>/<name> (no extension), got {args.out!r}")
        host, file_title = args.get
        url, width = resolve_url(host, file_title)
        blob = download(url)
        out, orig_w = post_process(blob, args.out)
        record_source(out, host, args.page, file_title)
        print(f"wrote {out} ({orig_w}px source, {os.path.getsize(out)} bytes)")
        return
    ap.print_help()


if __name__ == "__main__":
    main()
