#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lightweight web search via multiple engines (no API key needed)."""
import sys, re, html, json, urllib.parse, urllib.request, gzip, io

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")

def fetch(url, data=None, timeout=30):
    headers = {"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8",
               "Accept": "text/html,application/xhtml+xml", "Accept-Encoding": "gzip"}
    req = urllib.request.Request(url, data=data, headers=headers)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        raw = r.read()
        if r.headers.get("Content-Encoding") == "gzip":
            raw = gzip.decompress(raw)
        return raw.decode("utf-8", "replace")

def strip(s):
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", html.unescape(s)).strip()

def ddg_html(q):
    body = urllib.parse.urlencode({"q": q, "kl": "wt-wt"}).encode()
    page = fetch("https://html.duckduckgo.com/html/", data=body)
    out = []
    for m in re.finditer(r'<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)</a>', page, re.S):
        href, title = m.group(1), strip(m.group(2))
        if href.startswith("//duckduckgo.com/l/"):
            qs = urllib.parse.parse_qs(urllib.parse.urlparse("https:" + href).query)
            href = qs.get("uddg", [href])[0]
        out.append({"title": title, "url": href})
    snips = [strip(m.group(1)) for m in re.finditer(r'class="result__snippet"[^>]*>(.*?)</a>', page, re.S)]
    for i, s in enumerate(snips):
        if i < len(out): out[i]["snippet"] = s[:260]
    return out

def bing(q):
    page = fetch("https://www.bing.com/search?" + urllib.parse.urlencode({"q": q, "setlang": "en"}))
    out = []
    for m in re.finditer(r'<li class="b_algo".*?<h2[^>]*>\s*<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>(.*?)(?=<li class="b_algo"|</ol>)', page, re.S):
        out.append({"title": strip(m.group(2)), "url": m.group(1), "snippet": strip(m.group(3))[:240]})
    return out

def search(q):
    import os
    engines = [("ddg", ddg_html)] if os.environ.get("ENGINE","ddg")=="ddg" else [("ddg", ddg_html), ("bing", bing)]
    for name, fn in engines:
        try:
            r = fn(q)
            if r: return name, r
        except Exception as e:
            sys.stderr.write("[%s failed: %s]\n" % (name, str(e)[:100]))
    return None, []

if __name__ == "__main__":
    import os, time
    topn = int(os.environ.get("TOPN", "7")); snip = int(os.environ.get("SNIP", "180"))
    for q in sys.argv[1:]:
        try:
            eng, res = search(q)
        except Exception as e:
            eng, res = "ERR:" + str(e)[:60], []
        print("== QUERY: %s  [%s n=%d]" % (q, eng, len(res)))
        for i, r in enumerate(res[:topn], 1):
            print("%d. %s | %s" % (i, r["title"][:95], r["url"]))
            if snip: print("   %s" % r.get("snippet", "")[:snip])
        print()
        time.sleep(1.5)
