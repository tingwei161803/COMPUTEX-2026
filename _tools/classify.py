#!/usr/bin/env python3
"""
Two-stage medical-AI classifier for COMPUTEX + InnoVEX exhibitors.

Stage 1 (gate): is the company medical-relevant at all?
  - InnoVEX industry == "Healthcare & Biotech"  -> yes
  - OR any taxonomy `gate` term appears in the searchable text blob
Stage 2 (sub-categories): within the gated subset, assign 1..n of the 10
  taxonomy categories by matching each category's `kw` against the blob.

Output: raw/{computex,innovex}_medical.json  (gated subset + subcats + score)
Run:    uv run --no-project python _tools/classify.py
"""
import json
import os
import re

HERE = os.path.dirname(__file__)
RAW = os.path.join(HERE, "raw")
TAX = json.load(open(os.path.join(HERE, "taxonomy.json")))
GATE = [t.lower() for t in TAX["gate"]]
CATS = TAX["categories"]


def _j(r, *keys):
    return " ".join((r.get(k) or "") for k in keys).lower()


# Gate blob may use the industry label; sub-category blob must NOT (the label
# "Healthcare & Biotech" contains "biotech" and would wrongly match drug-biotech kw).
def blob_cpx_gate(r):
    return _j(r, "name_en", "name_zh", "products_en", "products_zh", "booth_en", "booth_zh")


def blob_cpx_sub(r):
    return blob_cpx_gate(r)


def blob_inx_gate(r):
    return _j(r, "name_en", "name_zh", "abbrev", "industry", "pavilion")


def blob_inx_sub(r):
    return _j(r, "name_en", "name_zh", "abbrev", "pavilion")


def gated(blob, force=False):
    if force:
        return True
    return any(g in blob for g in GATE)


def subcats(blob):
    hits = []
    for c in CATS:
        matched = [k for k in c["kw"] if k.lower() in blob]
        if matched:
            hits.append({"id": c["id"], "matched": matched, "n": len(matched)})
    hits.sort(key=lambda h: -h["n"])
    return hits


def classify(records, gatefn, subfn, forcefn=lambda r: False):
    out = []
    for r in records:
        if not gated(gatefn(r), forcefn(r)):
            continue
        sc = subcats(subfn(r))
        rec = dict(r)
        rec["medical"] = True
        rec["subcats"] = [h["id"] for h in sc]
        rec["subcat_detail"] = sc
        rec["needs_review"] = len(sc) == 0  # resolved later via detail pages + LLM
        out.append(rec)
    return out


def main():
    cpx = json.load(open(os.path.join(RAW, "computex.json")))
    inx = json.load(open(os.path.join(RAW, "innovex.json")))

    cpx_med = classify(cpx, blob_cpx_gate, blob_cpx_sub)
    inx_med = classify(inx, blob_inx_gate, blob_inx_sub,
                       forcefn=lambda r: r.get("industry") == "Healthcare & Biotech")

    json.dump(cpx_med, open(os.path.join(RAW, "computex_medical.json"), "w"),
              ensure_ascii=False, indent=1)
    json.dump(inx_med, open(os.path.join(RAW, "innovex_medical.json"), "w"),
              ensure_ascii=False, indent=1)

    def stats(name, med, total):
        import collections
        c = collections.Counter()
        for r in med:
            for s in r["subcats"]:
                c[s] += 1
        review = sum(1 for r in med if r["needs_review"])
        print(f"\n[{name}] medical: {len(med)} / {total}  (needs_review={review})")
        for cat in CATS:
            print(f"   {cat['icon']} {cat['id']:<18} {c.get(cat['id'],0)}")

    stats("COMPUTEX", cpx_med, len(cpx))
    stats("InnoVEX", inx_med, len(inx))


if __name__ == "__main__":
    main()
