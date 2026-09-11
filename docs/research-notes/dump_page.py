#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Dump readable lines from a page (for pricing pages where layout matters)."""
import sys, re, html, gzip, urllib.request
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36")
def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "gzip", "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8"})
    with urllib.request.urlopen(req, timeout=35) as r:
        raw = r.read()
        if r.headers.get("Content-Encoding") == "gzip": raw = gzip.decompress(raw)
        return raw.decode("utf-8", "replace")
def lines(page):
    page = re.sub(r"(?is)<(script|style|svg|noscript|head)[^>]*>.*?</\1>", " ", page)
    page = re.sub(r"(?i)<br\s*/?>|</p>|</li>|</h[1-6]>|</div>|</tr>|</td>|</section>|</span>|</a>|</button>", "\n", page)
    page = re.sub(r"<[^>]+>", " ", page)
    page = html.unescape(page)
    out, seen = [], set()
    for l in page.split("\n"):
        l = re.sub(r"[ \t\u00a0]+", " ", l).strip()
        if 1 < len(l) < 160 and l not in seen:
            seen.add(l); out.append(l)
    return out
url = sys.argv[1]; n = int(sys.argv[2]) if len(sys.argv) > 2 else 60
start = int(sys.argv[3]) if len(sys.argv) > 3 else 0
try:
    ls = lines(fetch(url))
except Exception as e:
    print("ERROR", e); sys.exit()
m = re.search(r"(?is)<title[^>]*>(.*?)</title>", "")
print("### %s  (%d lines)" % (url, len(ls)))
for l in ls[start:start+n]: print("  | " + l)
