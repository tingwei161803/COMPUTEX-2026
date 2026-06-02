#!/usr/bin/env python3
"""
Phase 3 step 2 — fetch ALL InnoVEX detail pages (exhaustive) and extract the
real company intro + product descriptions, so the LLM stage judges medical-AI
relevance from official text rather than guessing.

Detail URL: /show/exhibitor.aspx?companyId=<fid>&exhibitorID=<exhibitId>
  intro    -> <meta name="description">
  products -> substantial body text blocks (boilerplate filtered)

Run: uv run --no-project python _tools/fetch_inx_details.py
Out: raw/innovex_details.json   { fid: {intro, body} }
"""
import json, os, re, subprocess, time
from concurrent.futures import ThreadPoolExecutor, as_completed

HERE = os.path.dirname(__file__); RAW = os.path.join(HERE, "raw")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
URL = "https://innovex.computex.biz/show/exhibitor.aspx?companyId={fid}&exhibitorID={ex}"
BOILER = ("cookie", "privacy policy", "exhibitor search", "press enter", "copyright",
          "all rights reserved", "新增至", "加入收藏", "本網站", "搜尋")


def fetch(url):
    for i in range(3):
        try:
            o = subprocess.run(["curl", "-sL", "--max-time", "30", "-A", UA, url],
                               capture_output=True, timeout=40)
            if o.returncode == 0 and o.stdout:
                return o.stdout.decode("utf-8", errors="ignore")
        except Exception:
            pass
        time.sleep(1)
    return ""


def extract(html):
    intro = ""
    m = re.search(r'<meta name="description" content="([^"]*)"', html)
    if m:
        intro = re.sub(r"\s+", " ", m.group(1)).strip()
    # body prose: strip script/style, take substantial non-boilerplate lines
    body = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", html, flags=re.S)
    body = re.sub(r"<[^>]+>", "\n", body)
    seen, blocks = set(), []
    for ln in body.split("\n"):
        ln = re.sub(r"\s+", " ", ln).strip()
        if len(ln) < 50 or ln in seen:
            continue
        low = ln.lower()
        if any(b in low for b in BOILER):
            continue
        seen.add(ln)
        blocks.append(ln)
    blocks.sort(key=len, reverse=True)
    return intro, " │ ".join(blocks[:8])[:2000]


def one(r):
    html = fetch(URL.format(fid=r["fid"], ex=r["exhibitId"]))
    if not html:
        return r["fid"], {"intro": "", "body": ""}
    intro, body = extract(html)
    return r["fid"], {"intro": intro, "body": body}


def main():
    inx = json.load(open(os.path.join(RAW, "innovex.json")))
    out, done = {}, 0
    with ThreadPoolExecutor(max_workers=8) as ex:
        futs = [ex.submit(one, r) for r in inx]
        for f in as_completed(futs):
            fid, d = f.result()
            out[str(fid)] = d
            done += 1
            if done % 50 == 0:
                print(f"  {done}/{len(inx)}")
    json.dump(out, open(os.path.join(RAW, "innovex_details.json"), "w"), ensure_ascii=False, indent=1)
    have = sum(1 for d in out.values() if d["intro"] or d["body"])
    print(f"InnoVEX details: {have}/{len(inx)} with text -> raw/innovex_details.json")


if __name__ == "__main__":
    main()
