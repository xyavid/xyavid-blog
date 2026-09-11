#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fetch a URL and print text blocks matching keywords, for primary-source citation."""
import sys, re, html, urllib.request, gzip

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")

def fetch(url, timeout=35):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "gzip",
                                               "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        raw = r.read()
        if r.headers.get("Content-Encoding") == "gzip":
            raw = gzip.decompress(raw)
        return raw.decode("utf-8", "replace")

def text_of(page):
    page = re.sub(r"(?is)<(script|style|svg|nav|footer|head)[^>]*>.*?</\1>", " ", page)
    page = re.sub(r"(?i)<br\s*/?>|</p>|</li>|</h[1-6]>|</div>|</tr>", "\n", page)
    page = re.sub(r"<[^>]+>", " ", page)
    page = html.unescape(page)
    lines = [re.sub(r"[ \t\u00a0]+", " ", l).strip() for l in page.split("\n")]
    return [l for l in lines if len(l) > 2]

def main(url, kws, limit=14):
    try:
        page = fetch(url)
    except Exception as e:
        print("FETCH-ERROR %s :: %s" % (url, str(e)[:120])); return
    t = re.search(r"(?is)<title[^>]*>(.*?)</title>", page)
    print("### URL: %s\n### TITLE: %s" % (url, html.unescape(t.group(1)).strip() if t else "?"))
    lines = text_of(page)
    kws = [k.lower() for k in kws]
    hits, seen = 0, set()
    for i, l in enumerate(lines):
        low = l.lower()
        if any(k in low for k in kws) and len(l) < 700:
            key = l[:80]
            if key in seen: continue
            seen.add(key)
            print("  * " + l[:520])
            hits += 1
            if hits >= limit: break
    if hits == 0: print("  (no keyword match; page chars=%d)" % len(page))
    print()

if __name__ == "__main__":
    url = sys.argv[1]
    kws = sys.argv[2].split("|") if len(sys.argv) > 2 else ["math"]
    lim = int(sys.argv[3]) if len(sys.argv) > 3 else 14
    main(url, kws, lim)
