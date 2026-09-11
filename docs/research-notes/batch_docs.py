#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fetch multiple doc URLs in parallel; print title + keyword-matched lines + price-like strings."""
import sys, re, json, html, gzip, urllib.request
from concurrent.futures import ThreadPoolExecutor

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")

def fetch(url, timeout=35):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "gzip",
          "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        raw = r.read()
        if r.headers.get("Content-Encoding") == "gzip":
            raw = gzip.decompress(raw)
        return r.geturl(), raw.decode("utf-8", "replace")

def to_lines(page):
    page = re.sub(r"(?is)<(script|style|svg|noscript|head)[^>]*>.*?</\1>", " ", page)
    page = re.sub(r"(?i)<br\s*/?>|</p>|</li>|</h[1-6]>|</div>|</tr>|</td>|</section>", "\n", page)
    page = re.sub(r"<[^>]+>", " ", page)
    page = html.unescape(page)
    out = []
    for l in page.split("\n"):
        l = re.sub(r"[ \t\u00a0]+", " ", l).strip()
        if len(l) > 2: out.append(l)
    return out

def one(item):
    url, kws = item["url"], [k.lower() for k in item.get("kws", ["math"]).split("|")]
    lim = item.get("limit", 10)
    res = {"url": url}
    try:
        final, page = fetch(url)
        res["final"] = final
        m = re.search(r"(?is)<title[^>]*>(.*?)</title>", page)
        res["title"] = html.unescape(m.group(1)).strip()[:140] if m else "?"
        lines = to_lines(page)
        hits, seen = [], set()
        for l in lines:
            low = l.lower()
            if any(k in low for k in kws) and len(l) < 600:
                k = l[:70]
                if k in seen: continue
                seen.add(k); hits.append(l[:400])
                if len(hits) >= lim: break
        res["hits"] = hits
        prices = []
        for l in lines:
            for pm in re.finditer(r"(?:US\$|\$|€|£|¥)\s?\d[\d,.]*(?:\s?/\s?(?:mo|month|year|yr))?", l):
                s = l[max(0, pm.start()-70):pm.end()+70].strip()
                if s not in prices: prices.append(s[:190])
                break
            if len(prices) >= 6: break
        res["prices"] = prices
    except Exception as e:
        res["error"] = str(e)[:140]
    return res

if __name__ == "__main__":
    items = json.load(open(sys.argv[1], encoding="utf-8"))
    with ThreadPoolExecutor(max_workers=8) as ex:
        rows = list(ex.map(one, items))
    json.dump(rows, open(sys.argv[2], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    for r in rows:
        print("### %s" % r["url"])
        if r.get("error"): print("  ERROR: %s" % r["error"]); print(); continue
        print("  TITLE: %s" % r.get("title"))
        for h in r.get("hits", []): print("  * %s" % h)
        if r.get("prices"):
            print("  PRICES:")
            for p in r["prices"]: print("    $ %s" % p)
        print()
