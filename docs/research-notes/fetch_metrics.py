#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fetch GitHub repo metrics without the REST API (HTML + Atom feeds)."""
import json, re, sys, time
from concurrent.futures import ThreadPoolExecutor
import urllib.request

REPOS = [
 # --- SSG engines ---
 "hexojs/hexo","gohugoio/hugo","withastro/astro","jekyll/jekyll","11ty/eleventy",
 "getzola/zola","vuejs/vitepress","facebook/docusaurus","YunYouJun/valaxy",
 "squidfunk/mkdocs-material","shuding/nextra","gatsbyjs/gatsby","jackyzha0/quartz",
 "timlrx/tailwind-nextjs-starter-blog","nuxt/content",
 # --- Hexo themes ---
 "next-theme/hexo-theme-next","jerryc127/hexo-theme-butterfly","fluid-dev/hexo-theme-fluid",
 "anzhiyu-c/hexo-theme-anzhiyu","everfu/hexo-theme-solitude","XPoet/hexo-theme-keep",
 "xaoxuu/hexo-theme-stellar","liuyib/hexo-theme-stun",
 # --- Hugo themes ---
 "adityatelange/hugo-PaperMod","CaiJimmy/hugo-theme-stack","nunocoracao/blowfish",
 "hugo-fixit/FixIt","luizdepra/hugo-coder",
 # --- Astro themes ---
 "saicaca/fuwari","CuteLeaf/Firefly","satnaing/astro-paper","moeyua/astro-theme-typography",
 "radishzzz/astro-theme-retypeset",
 # --- Jekyll themes ---
 "cotes2020/jekyll-theme-chirpy","alshedivat/al-folio",
 # --- Platforms / self-hosted blog systems ---
 "WordPress/WordPress","WordPress/wordpress-develop","TryGhost/Ghost","halo-dev/halo",
 "88250/solo","b3log/pipe","getgridea/gridea","tangly1024/NotionNext","craigary/nobelium",
 "microdotblog/microblog","writefreely/writefreely","GetPublii/Publii",
]

UA = {"User-Agent":"Mozilla/5.0 (research-script; contact: local)"}

def get(url, timeout=30):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")

def stars_and_desc(html):
    stars = None
    m = re.search(r'id="repo-stars-counter-star"[^>]*title="([0-9,]+)"', html)
    if not m:
        m = re.search(r'title="([0-9,]+)"[^>]*id="repo-stars-counter-star"', html)
    if m: stars = int(m.group(1).replace(",",""))
    desc = None
    m = re.search(r'<meta name="description" content="([^"]*)"', html)
    if m: desc = m.group(1)[:300]
    archived = 'This repository has been archived' in html or 'Public archive' in html
    lic = None
    m = re.search(r'([A-Za-z0-9\-. ]{2,40}) license', html)
    if m: lic = m.group(1).strip()
    return stars, desc, archived, lic

def atom_entries(xml, n=1):
    out = []
    for m in re.finditer(r'<entry>(.*?)</entry>', xml, re.S):
        e = m.group(1)
        t = re.search(r'<title[^>]*>(.*?)</title>', e, re.S)
        u = re.search(r'<updated>(.*?)</updated>', e, re.S)
        out.append(((t.group(1).strip() if t else ""), (u.group(1) if u else "")))
        if len(out) >= n: break
    return out

def fetch(repo):
    rec = {"repo": repo}
    try:
        html = get("https://github.com/" + repo)
        s, d, a, lic = stars_and_desc(html)
        rec.update(stars=s, description=d, archived=a, license=lic)
    except Exception as ex:
        rec["html_error"] = str(ex)[:120]
    try:
        xml = get("https://github.com/%s/commits.atom" % repo)
        es = atom_entries(xml, 1)
        rec["last_commit"] = es[0][1] if es else None
        rec["last_commit_msg"] = es[0][0][:90] if es else None
    except Exception as ex:
        rec["commits_error"] = str(ex)[:120]
    try:
        xml = get("https://github.com/%s/releases.atom" % repo)
        es = atom_entries(xml, 1)
        rec["latest_release"] = es[0][0] if es else None
        rec["release_date"] = es[0][1] if es else None
    except Exception as ex:
        rec["releases_error"] = str(ex)[:120]
    return rec

with ThreadPoolExecutor(max_workers=6) as ex:
    rows = list(ex.map(fetch, REPOS))

with open("docs/research-notes/github-metrics.json","w",encoding="utf-8") as f:
    json.dump(rows, f, ensure_ascii=False, indent=1)

def cell(v): return "-" if v in (None,"") else str(v)
print("%-45s %8s %-11s %-30s %-16s %s" % ("repo","stars","last_commit","latest_release","release_date","archived"))
for r in rows:
    print("%-45s %8s %-11s %-30s %-16s %s" % (
        r["repo"], cell(r.get("stars")), cell(r.get("last_commit"))[:10],
        cell(r.get("latest_release"))[:30], cell(r.get("release_date"))[:10],
        "ARCHIVED" if r.get("archived") else ""))
print()
print("errors:", [(r["repo"], r.get("html_error") or r.get("commits_error")) for r in rows if r.get("html_error")])
