#!/usr/bin/env python3
"""
Transform raw scrape + classification into front-end data files (data/*.js).
Each file assigns a window.* global consumed by the static pages.

Run: uv run --no-project python _tools/build_data.py
Emits:
  data/exhibitors-computex.js   window.CPX_EXH = {facets, items}
  data/exhibitors-innovex.js    window.INX_EXH = {facets, items}
  data/medical.js               window.MED     = {taxonomy, cpx, inx}  (Phase-1 seed)
"""
import json
import os
import re
import collections

HERE = os.path.dirname(__file__)
RAW = os.path.join(HERE, "raw")
DATA = os.path.normpath(os.path.join(HERE, "..", "data"))
TAX = json.load(open(os.path.join(HERE, "taxonomy.json")))

CPX_DETAIL = "https://www.computextaipei.com.tw/{lang}/exhibitor/{h}/info.html"
INX_LOGO = "https://innovex.computex.biz"

# ---------- COMPUTEX booth parsing ----------
VENUE_EN = [("TaiNEX 1", "T1"), ("TaiNEX 2", "T2"),
            ("TWTC", "TWTC"), ("Semiconductors & Hospitality", "SEMI")]


def parse_booth_en(s):
    """-> (venue_code, zone_en, boothno)"""
    if not s:
        return "", "", ""
    venue = ""
    for needle, code in VENUE_EN:
        if needle in s:
            venue = code
            break
    booth = ""
    m = re.search(r'\b([A-Z]\d{2,4}[a-z]?)\s*$', s.strip())
    if m:
        booth = m.group(1)
    # zone: text after venue marker, before booth no
    zone = s
    zone = re.sub(r'^Booth No\.\:?\s*', '', zone)
    zone = re.sub(r'Taipei Nangang Exhibition Center,\s*Hall \d \(TaiNEX \d\)\s*', '', zone)
    zone = re.sub(r'TWTC Exhibition Hall \d\s*', '', zone)
    if booth:
        zone = zone[:zone.rfind(booth)]
    return venue, zone.strip(), booth


def parse_booth_zh(s):
    if not s:
        return "", "", ""
    venue = ""
    for needle, code in [("南港一館", "T1"), ("南港二館", "T2"),
                         ("世貿一館", "TWTC"), ("世貿", "TWTC")]:
        if needle in s:
            venue = code
            break
    booth = ""
    m = re.search(r'\b([A-Z]\d{2,4}[a-z]?)\s*$', s.strip())
    if m:
        booth = m.group(1)
    zone = re.sub(r'^(南港一館|南港二館|世貿一館)\s*', '', s)
    if booth:
        zone = zone[:zone.rfind(booth)]
    return venue, zone.strip(), booth


def products_list(s):
    if not s:
        return []
    parts = re.split(r'[,/、]', s)
    return [p.strip() for p in parts if p.strip()][:6]


# ---------- builders ----------
def build_computex():
    d = json.load(open(os.path.join(RAW, "computex.json")))
    items = []
    zones = collections.Counter()
    zones_zh = {}
    countries = collections.Counter()
    venues = collections.Counter()
    for r in d:
        v_en, z_en, b_en = parse_booth_en(r.get("booth_en", ""))
        v_zh, z_zh, b_zh = parse_booth_zh(r.get("booth_zh", ""))
        venue = v_en or v_zh
        zone_en = z_en or z_zh
        zone_zh = z_zh or z_en
        booth = b_en or b_zh
        if zone_en:
            zones[zone_en] += 1
            zones_zh[zone_en] = zone_zh
        countries[r["country"]] += 1
        if venue:
            venues[venue] += 1
        items.append({
            "ne": r["name_en"], "nz": r["name_zh"], "c": r["country"],
            "ze": zone_en, "zz": zone_zh, "v": venue, "b": booth,
            "pe": products_list(r.get("products_en", "")),
            "logo": r.get("logo", ""),
            "ue": CPX_DETAIL.format(lang="en", h=r["hash_en"]) if r.get("hash_en") else "",
            "uz": CPX_DETAIL.format(lang="zh-tw", h=r["hash_zh"]) if r.get("hash_zh") else "",
        })
    items.sort(key=lambda x: x["ne"].lower())
    facets = {
        "zones": [{"id": z, "en": z, "zh": zones_zh.get(z, z), "n": n}
                  for z, n in zones.most_common()],
        "countries": [{"code": c, "n": n} for c, n in countries.most_common()],
        "venues": [{"code": v, "n": n} for v, n in venues.most_common()],
        "total": len(items),
    }
    return {"facets": facets, "items": items}


def build_innovex():
    d = json.load(open(os.path.join(RAW, "innovex.json")))
    items = []
    inds = collections.Counter()
    countries = collections.Counter()
    types = collections.Counter()
    pavilions = collections.Counter()
    pav_zh = {}
    for r in d:
        ind = r.get("industry") or "Others"
        inds[ind] += 1
        countries[r.get("country") or "?"] += 1
        types[r.get("type") or "Others"] += 1
        pav = r.get("pavilion") or ""
        if pav:
            pavilions[pav] += 1
            pav_zh[pav] = r.get("pavilion_zh") or pav
        logo = r.get("logo") or ""
        if logo and logo.startswith("/"):
            logo = INX_LOGO + logo
        items.append({
            "ne": r["name_en"], "nz": r["name_zh"], "ab": r.get("abbrev", ""),
            "ind": ind, "type": r.get("type") or "Others",
            "c": r.get("country") or "", "pav": pav, "pavz": r.get("pavilion_zh") or pav,
            "acc": bool(r.get("accelerator")), "logo": logo, "fid": r.get("fid"),
        })
    items.sort(key=lambda x: x["ne"].lower())
    facets = {
        "industries": [{"id": i, "n": n} for i, n in inds.most_common()],
        "countries": [{"code": c, "n": n} for c, n in countries.most_common()],
        "types": [{"id": t, "n": n} for t, n in types.most_common()],
        "pavilions": [{"id": p, "zh": pav_zh.get(p, p), "n": n} for p, n in pavilions.most_common()],
        "total": len(items),
    }
    return {"facets": facets, "items": items}


def build_medical():
    cpx = json.load(open(os.path.join(RAW, "computex_medical.json")))
    inx = json.load(open(os.path.join(RAW, "innovex_medical.json")))

    def slim_cpx(r):
        v, z, b = parse_booth_en(r.get("booth_en", ""))
        return {"ne": r["name_en"], "nz": r["name_zh"], "c": r["country"],
                "subcats": r["subcats"], "review": r["needs_review"],
                "zone": z, "v": v, "b": b,
                "pe": products_list(r.get("products_en", "")),
                "logo": r.get("logo", ""),
                "ue": CPX_DETAIL.format(lang="en", h=r["hash_en"]) if r.get("hash_en") else ""}

    def slim_inx(r):
        logo = r.get("logo") or ""
        if logo.startswith("/"):
            logo = INX_LOGO + logo
        return {"ne": r["name_en"], "nz": r["name_zh"], "c": r.get("country", ""),
                "ind": r.get("industry", ""), "type": r.get("type", ""),
                "subcats": r["subcats"], "review": r["needs_review"],
                "pav": r.get("pavilion", ""), "acc": bool(r.get("accelerator")),
                "logo": logo, "fid": r.get("fid")}

    tax = [{"id": c["id"], "icon": c["icon"], "name": c["name"], "desc": c["desc"]}
           for c in TAX["categories"]]
    return {"taxonomy": tax,
            "cpx": [slim_cpx(r) for r in cpx],
            "inx": [slim_inx(r) for r in inx]}


def emit(varname, obj, filename, note):
    path = os.path.join(DATA, filename)
    with open(path, "w") as f:
        f.write(f"/* {note}\n   AUTO-GENERATED by _tools/build_data.py — do not hand-edit. */\n")
        f.write(f"window.{varname} = ")
        json.dump(obj, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")
    print(f"  {filename}: {os.path.getsize(path)//1024} KB")


if __name__ == "__main__":
    print("building data/*.js ...")
    emit("CPX_EXH", build_computex(), "exhibitors-computex.js",
         "COMPUTEX 2026 全參展商名錄 + 篩選 facet")
    emit("INX_EXH", build_innovex(), "exhibitors-innovex.js",
         "InnoVEX 2026 全參展商名錄 + 篩選 facet")
    emit("MED", build_medical(), "medical.js",
         "醫療 AI taxonomy + COMPUTEX/InnoVEX 醫療候選(Phase 1 seed)")
    print("done.")
