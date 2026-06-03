#!/usr/bin/env python3
"""
Phase 3 step 5 — merge LLM verdicts (raw/out/out_*.json) with candidate display
fields (raw/candidates_all.json) into the enriched medical dataset.

Run: uv run --no-project python _tools/build_medical.py
Out: data/medical.js   window.MED = { taxonomy, cpx:[...], inx:[...], generated }
"""
import json, os, glob
from venue_match import build_cpx_index, load_js_obj, match_venue

HERE = os.path.dirname(__file__); RAW = os.path.join(HERE, "raw")
DATA = os.path.normpath(os.path.join(HERE, "..", "data"))
TAX = json.load(open(os.path.join(HERE, "taxonomy.json")))
VALID = {c["id"] for c in TAX["categories"]}


def profile_obj(p):
    if not p:
        return None
    def pair(k):
        return {"zh": (p.get(k + "_zh") or "").strip(), "en": (p.get(k + "_en") or "").strip()}
    return {"summary": pair("summary"), "angle": pair("angle"),
            "tech": pair("tech"), "usecase": pair("usecase"), "highlight": pair("highlight")}


def main():
    cand = {c["id"]: c for c in json.load(open(os.path.join(RAW, "candidates_all.json")))}
    verdicts = {}
    for f in sorted(glob.glob(os.path.join(RAW, "out", "out_*.json"))):
        try:
            for v in json.load(open(f)):
                verdicts[v["id"]] = v
        except Exception as e:
            print("  ! skip", f, e)

    vindex = build_cpx_index(load_js_obj(os.path.join(DATA, "exhibitors-computex.js")).get("items", []))
    cpx, inx = [], []
    missing = 0
    for cid, c in cand.items():
        v = verdicts.get(cid)
        if not v:
            missing += 1
            continue
        if not v.get("medical"):
            continue
        subcats = [s for s in (v.get("subcats") or []) if s in VALID] or ["digital-health"]
        item = {
            "ne": c["name_en"], "nz": c["name_zh"], "c": c["country"],
            "logo": c.get("logo", ""), "url": c.get("url", ""),
            "subcats": subcats, "conf": v.get("confidence", ""),
            "profile": profile_obj(v.get("profile"))
        }
        venue, booth = match_venue(vindex, c["name_en"], c["name_zh"], c.get("url", ""))
        if c["show"] == "computex":
            item["zone"] = c.get("zone", "")
            item["v"], item["b"] = venue, booth
            cpx.append(item)
        else:
            item["industry"] = c.get("industry", "")
            item["type"] = c.get("type", "")
            item["pavilion"] = c.get("pavilion", "")
            item["acc"] = bool(c.get("accelerator"))
            item["v"], item["b"] = venue, booth
            inx.append(item)

    cpx.sort(key=lambda x: x["ne"].lower())
    inx.sort(key=lambda x: x["ne"].lower())
    tax = [{"id": c["id"], "icon": c["icon"], "name": c["name"], "desc": c["desc"]}
           for c in TAX["categories"]]

    obj = {"taxonomy": tax, "cpx": cpx, "inx": inx}
    path = os.path.join(DATA, "medical.js")
    with open(path, "w") as f:
        f.write("/* 醫療 AI taxonomy + COMPUTEX/InnoVEX 醫療廠商(LLM 判定+撰寫,grounded)\n")
        f.write("   展館/攤位(v,b)由 venue_match 從 exhibitors-computex.js 比對補上。\n")
        f.write("   AUTO-GENERATED — do not hand-edit. */\n")
        f.write("window.MED = ")
        json.dump(obj, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")

    import collections
    def stats(name, arr):
        c = collections.Counter()
        for it in arr:
            for s in it["subcats"]:
                c[s] += 1
        print(f"[{name}] medical: {len(arr)}")
        for cat in tax:
            print(f"   {cat['icon']} {cat['id']:<18} {c.get(cat['id'],0)}")
    stats("COMPUTEX", cpx)
    stats("InnoVEX", inx)
    print(f"verdicts missing for {missing} candidates · file {os.path.getsize(path)//1024} KB")


if __name__ == "__main__":
    main()
