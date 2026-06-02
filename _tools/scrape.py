#!/usr/bin/env python3
"""
COMPUTEX 2026 + InnoVEX 2026 exhibitor scraper.

Data sources (cracked via recon — see project notes):
  COMPUTEX : https://www.computextaipei.com.tw/{lang}/exhibitor/country-list-data/<CC>/list.html?currentPage=<N>
             - server-rendered, 10 exhibitors / page, paginated via doPage()
             - join EN + ZH lists by applyId (language-independent registration id)
  InnoVEX  : https://innovex.computex.biz/show/exhibitors.aspx
             - full exhibitor JSON array embedded inline in the HTML

Run:  uv run --no-project python _tools/scrape.py [--test]
Output: _tools/raw/computex.json , _tools/raw/innovex.json
"""
import json
import re
import sys
import time
import os
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
RAW = os.path.join(os.path.dirname(__file__), "raw")
os.makedirs(RAW, exist_ok=True)

COUNTRIES = ["AE","AU","BE","CA","CH","CN","CZ","DE","DK","DZ","EE","ES","FR","GB",
             "HK","IL","IN","IT","JP","KR","LV","MY","NL","PL","SA","SE","SG","TH",
             "TR","TW","UM","US","VN"]

CPX_BASE = "https://www.computextaipei.com.tw/{lang}/exhibitor/country-list-data/{cc}/list.html?currentPage={n}"
INX_URL  = "https://innovex.computex.biz/show/exhibitors.aspx"


def fetch(url, retries=3, timeout=30):
    """Fetch via system curl — its trust store accepts both hosts' certs,
    whereas Python's bundled CA check trips on innovex's strict-SKI cert."""
    for i in range(retries):
        try:
            out = subprocess.run(
                ["curl", "-sL", "--max-time", str(timeout), "-A", UA, url],
                capture_output=True, timeout=timeout + 10,
            )
            if out.returncode == 0 and out.stdout:
                return out.stdout.decode("utf-8", errors="ignore")
        except Exception as e:
            if i == retries - 1:
                print(f"  ! fail {url} : {e}", file=sys.stderr)
                return ""
        time.sleep(1.5 * (i + 1))
    return ""


# ---------------------------------------------------------------- COMPUTEX

LI_RE = re.compile(r'<li id="([0-9A-F]{32})"[^>]*>(.*?)</li>\s*(?=<li id="[0-9A-F]{32}"|</ul>)', re.S)
NAME_RE = re.compile(r'/info\.html\?[^"]*">([^<]+)</a>')
APPLYID_RE = re.compile(r'name="applyId"\s+value="(\d+)"')
LOGO_RE = re.compile(r'<img data-src="([^"]+)"')
LASTPAGE_RE = re.compile(r'doPage\((\d+)\)')


def parse_cpx_page(html, cc):
    """Return list of dicts: applyId, hash, name, logo, products, venue, area, booth."""
    out = []
    for m in re.finditer(r'<li id="([0-9A-F]{32})"\s+class="[^"]*">(.*?)(?=<li id="[0-9A-F]{32}"\s+class=|</ul>\s*</div>\s*<div class="page|\Z)', html, re.S):
        hsh, blk = m.group(1), m.group(2)
        nm = NAME_RE.search(blk)
        if not nm:
            continue
        name = re.sub(r'\s+', ' ', nm.group(1)).strip()
        aid = APPLYID_RE.search(blk)
        logo = LOGO_RE.search(blk)
        # inner field list
        fields = {}
        inner = re.search(r'<ul>(.*?)</ul>', blk, re.S)
        if inner:
            for li in re.findall(r'<li>(.*?)</li>', inner.group(1), re.S):
                txt = re.sub(r'<[^>]+>', '\x01', li)
                parts = [re.sub(r'\s+', ' ', p).strip() for p in txt.split('\x01') if re.sub(r'\s+', ' ', p).strip()]
                if not parts:
                    continue
                key = parts[0].rstrip('：:').strip()
                val = ' '.join(parts[1:]).strip()
                fields[key] = val
        products = fields.get('Products', '') or fields.get('產品', '')
        # booth / venue / area parsing
        venue = area = booth = ''
        booth_blob = ''
        for k, v in fields.items():
            if 'Booth' in k or '攤位' in k or 'Physical Show' in k or k == '':
                booth_blob = (booth_blob + ' ' + v).strip()
        booth_blob = fields.get('Physical Show', '') or booth_blob
        out.append({
            "applyId": aid.group(1) if aid else "",
            "hash": hsh,
            "name": name,
            "logo": logo.group(1) if logo else "",
            "products": products,
            "boothRaw": re.sub(r'\s+', ' ', booth_blob).strip(),
            "country": cc,
        })
    return out


def scrape_cpx_country(cc, lang, test=False):
    first = fetch(CPX_BASE.format(lang=lang, cc=cc, n=1))
    if not first:
        return []
    pages = max([int(x) for x in LASTPAGE_RE.findall(first)] or [1])
    if test:
        pages = min(pages, 2)
    recs = parse_cpx_page(first, cc)
    for n in range(2, pages + 1):
        html = fetch(CPX_BASE.format(lang=lang, cc=cc, n=n))
        recs += parse_cpx_page(html, cc)
        time.sleep(0.15)
    return recs


def scrape_computex(test=False):
    countries = (["TW"] if test else COUNTRIES)
    result = {}  # applyId -> record
    for lang in ("en", "zh-tw"):
        lg = "en" if lang == "en" else "zh"
        print(f"[COMPUTEX] lang={lang} ...")
        with ThreadPoolExecutor(max_workers=6) as ex:
            futs = {ex.submit(scrape_cpx_country, cc, lang, test): cc for cc in countries}
            for f in as_completed(futs):
                cc = futs[f]
                recs = f.result()
                print(f"   {lang} {cc}: {len(recs)}")
                for r in recs:
                    aid = r["applyId"] or (r["hash"][:16] + cc)
                    rec = result.setdefault(aid, {
                        "applyId": r["applyId"], "country": cc, "logo": "",
                        "name_en": "", "name_zh": "", "hash_en": "", "hash_zh": "",
                        "products_en": "", "products_zh": "", "booth_en": "", "booth_zh": "",
                    })
                    rec["name_" + lg] = r["name"]
                    rec["hash_" + lg] = r["hash"]
                    rec["products_" + lg] = r["products"]
                    rec["booth_" + lg] = r["boothRaw"]
                    if r["logo"]:
                        rec["logo"] = r["logo"]
    recs = list(result.values())
    for r in recs:
        r["name_zh"] = r["name_zh"] or r["name_en"]
        r["name_en"] = r["name_en"] or r["name_zh"]
        r["products_zh"] = r["products_zh"] or r["products_en"]
        r["products_en"] = r["products_en"] or r["products_zh"]
    return recs


# ---------------------------------------------------------------- InnoVEX

def scrape_innovex():
    html = fetch(INX_URL)
    objs = []
    for r in re.findall(r'\{[^{}]*"exhibitId"[^{}]*\}', html):
        try:
            objs.append(json.loads(r))
        except Exception:
            pass
    out = []
    for o in objs:
        out.append({
            "exhibitId": o.get("exhibitId"),
            "fid": o.get("fid"),
            "name_en": (o.get("bna_e") or "").strip(),
            "name_zh": (o.get("zhTwBna") or o.get("bna_e") or "").strip(),
            "abbrev": (o.get("bna_e_abbrev") or "").strip(),
            "type": o.get("CI", ""),
            "industry": o.get("companyIndustry", ""),
            "accelerator": bool(o.get("ifAccelerator")),
            "country": o.get("country", ""),
            "pavilion": o.get("groupThemeName", ""),
            "pavilion_zh": o.get("groupThemeNameZhTw", ""),
            "logo": o.get("companyLogo", ""),
        })
    # dedupe by fid (the company id; exhibitId is shared by co-located firms and
    # each row is also emitted twice in the page payload)
    seen = {}
    for o in out:
        seen[o["fid"]] = o
    return list(seen.values())


# ---------------------------------------------------------------- main

if __name__ == "__main__":
    test = "--test" in sys.argv
    only = None
    if "--only" in sys.argv:
        only = sys.argv[sys.argv.index("--only") + 1]

    if only in (None, "innovex"):
        print("=== InnoVEX ===")
        inx = scrape_innovex()
        json.dump(inx, open(os.path.join(RAW, "innovex.json"), "w"), ensure_ascii=False, indent=1)
        print(f"InnoVEX exhibitors: {len(inx)} -> raw/innovex.json")

    if only in (None, "computex"):
        print("=== COMPUTEX ===")
        t0 = time.time()
        cpx = scrape_computex(test=test)
        json.dump(cpx, open(os.path.join(RAW, "computex.json"), "w"), ensure_ascii=False, indent=1)
        print(f"COMPUTEX exhibitors: {len(cpx)} -> raw/computex.json  ({time.time()-t0:.0f}s)")
