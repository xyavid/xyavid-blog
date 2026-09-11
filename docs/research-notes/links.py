#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Extract links (text + href) from a page."""
import sys, re, html, gzip, urllib.request
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "gzip", "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8"})
    with urllib.request.urlopen(req, timeout=35) as r:
        raw = r.read()
        if r.headers.get("Content-Encoding") == "gzip": raw = gzip.decompress(raw)
        return raw.decode("utf-8", "replace")
url = sys.argv[1]; kws = [k.lower() for k in (sys.argv[2].split("|") if len(sys.argv) > 2 else [""])]
n = int(sys.argv[3]) if len(sys.argv) > 3 else 25
page = fetch(url); out, seen = [], set()
for m in re.finditer(r'(?is)<a\s[^>]*href="([^"]+)"[^>]*>(.*?)</a>', page):
    href, txt = m.group(1), re.sub(r"<[^>]+>", " ", m.group(2))
    txt = re.sub(r"\s+", " ", html.unescape(txt)).strip()
    if not txt or len(txt) < 4: continue
    if any(k and k not in txt.lower() and k not in href.lower() for k in kws): continue
    key = (txt[:60], href[:80])
    if key in seen: continue
    seen.add(key); out.append((txt[:80], href[:150]))
print("### LINKS %s (%d)" % (url, len(out)))
for t, h in out[:n]: print("  - %s :: %s" % (t, h))
