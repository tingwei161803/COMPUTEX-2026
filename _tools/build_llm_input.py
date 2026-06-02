#!/usr/bin/env python3
"""
Phase 3 step 3 — assemble the LLM-judging input and split into batch files.

InnoVEX screening is now EXHAUSTIVE: the keyword net runs over each company's
fetched intro+body (not just name/industry), so description-only medical signals
are caught. COMPUTEX uses listing products/zone/name (detail pages carry no prose).

Each candidate record carries both display fields (for the page) and text (for
the LLM). Output batch files are read by parallel agents in the next step.

Run: uv run --no-project python _tools/build_llm_input.py
Out: raw/batches/batch_XX.json , raw/candidates_all.json
"""
import json, os, re, math
from candidates import NET, hits  # reuse the wide net

HERE = os.path.dirname(__file__); RAW = os.path.join(HERE, "raw")
BATCHDIR = os.path.join(RAW, "batches")
os.makedirs(BATCHDIR, exist_ok=True)
CPX_DETAIL = "https://www.computextaipei.com.tw/en/exhibitor/{h}/info.html"
INX_LOGO = "https://innovex.computex.biz"
BATCH = 12


def main():
    cpx = json.load(open(os.path.join(RAW, "computex.json")))
    inx = json.load(open(os.path.join(RAW, "innovex.json")))
    det = json.load(open(os.path.join(RAW, "innovex_details.json")))

    recs = []

    # COMPUTEX: net over listing text
    for r in cpx:
        listing = " ".join([r.get("products_en", ""), r.get("products_zh", ""),
                             r.get("booth_en", ""), r.get("booth_zh", ""),
                             r.get("name_en", ""), r.get("name_zh", "")])
        h = hits(listing)
        if not h:
            continue
        zone = ""
        m = re.search(r"\(TaiNEX [12]\)\s*(.*?)\s+[A-Z]\d", r.get("booth_en", ""))
        if m:
            zone = m.group(1).strip()
        recs.append({
            "id": "cpx-" + (r["applyId"] or r["hash_en"][:8]), "show": "computex",
            "name_en": r["name_en"], "name_zh": r["name_zh"], "country": r["country"],
            "logo": r.get("logo", ""), "zone": zone,
            "url": CPX_DETAIL.format(h=r["hash_en"]) if r.get("hash_en") else "",
            "text": ("Products: " + r.get("products_en", "") + " | Zone: " + zone).strip(),
            "hits": h
        })

    # InnoVEX: net over listing + fetched intro/body (exhaustive)
    for r in inx:
        d = det.get(str(r.get("fid")), {})
        intro, body = d.get("intro", ""), d.get("body", "")
        blob = " ".join([r.get("name_en", ""), r.get("name_zh", ""), r.get("abbrev", ""),
                         r.get("industry") or "", r.get("pavilion") or "", intro, body])
        h = hits(blob)
        force = (r.get("industry") == "Healthcare & Biotech")
        if not h and not force:
            continue
        logo = r.get("logo") or ""
        if logo.startswith("/"):
            logo = INX_LOGO + logo
        recs.append({
            "id": "inx-" + str(r.get("fid")), "show": "innovex",
            "name_en": r["name_en"], "name_zh": r["name_zh"], "country": r.get("country", ""),
            "logo": logo, "industry": r.get("industry", ""), "type": r.get("type", ""),
            "pavilion": r.get("pavilion", ""), "accelerator": bool(r.get("accelerator")),
            "url": "https://innovex.computex.biz/show/exhibitor.aspx?companyId=%s&exhibitorID=%s" % (r.get("fid"), r.get("exhibitId")),
            "text": (intro + " | " + body)[:1800].strip(),
            "hits": h
        })

    json.dump(recs, open(os.path.join(RAW, "candidates_all.json"), "w"), ensure_ascii=False, indent=1)

    # clear old batches, write new
    for f in os.listdir(BATCHDIR):
        os.remove(os.path.join(BATCHDIR, f))
    nb = math.ceil(len(recs) / BATCH)
    for i in range(nb):
        chunk = recs[i * BATCH:(i + 1) * BATCH]
        json.dump(chunk, open(os.path.join(BATCHDIR, f"batch_{i:02d}.json"), "w"),
                  ensure_ascii=False, indent=1)

    cpx_n = sum(1 for r in recs if r["show"] == "computex")
    inx_n = sum(1 for r in recs if r["show"] == "innovex")
    print(f"candidates: COMPUTEX {cpx_n}, InnoVEX {inx_n}, total {len(recs)}")
    print(f"batches: {nb} files of <= {BATCH} in {BATCHDIR}")


if __name__ == "__main__":
    main()
