#!/usr/bin/env python3
"""
Phase 3 step 1 — exhaustive medical-AI candidate net.
Screens EVERY exhibitor (both shows) with a wide medical/health/bio + adjacent
keyword net (favour recall; the LLM stage is the precision filter). Emits
candidate lists with detail URLs for enrichment.

Run: uv run --no-project python _tools/candidates.py
Out: raw/candidates_cpx.json, raw/candidates_inx.json
"""
import json, os, re

HERE = os.path.dirname(__file__); RAW = os.path.join(HERE, "raw")
CPX_DETAIL = "https://www.computextaipei.com.tw/en/exhibitor/{h}/info.html"
INX_DETAIL = "https://innovex.computex.biz/show/exhibitor.aspx?companyId={fid}&exhibitorID={ex}"

# Wide net. Short/ambiguous tokens use spaces or are paired to cut obvious noise.
NET = [
    "medical", "medic", "health", "healthcare", "clinic", "clinical", "hospital",
    "patient", "diagnos", "therap", "treatment", "surgery", "surgical", "rehab",
    "prosthe", "dental", "ortho", "cardio", "neuro", "onco", "derma", "ophthal",
    "radiol", "patholog", "pharma", "drug", "biotech", "biomed", "biosensor",
    "genom", "genetic", "protein", "stem cell", "vaccine", "medical device",
    "wearable", "vital sign", "ecg", "eeg", "spo2", "glucose", "blood pressure",
    "sleep", "wellness", "elderly", "caregiv", "nursing", "telemedicine",
    "telehealth", "mhealth", "digital health", "medical imaging", "ultrasound",
    "endoscop", "mri", "x-ray", "fundus", "retina", "hearing aid", "assistive",
    "life science", "physiolog", "ai diagnos", "smart health", "long-term care",
    "醫療", "醫學", "醫院", "臨床", "病患", "病人", "診斷", "診療", "治療", "手術",
    "復健", "照護", "長照", "生技", "生醫", "製藥", "藥物", "基因", "細胞", "蛋白質",
    "穿戴", "生理訊號", "監測健康", "血壓", "睡眠", "輔具", "義肢", "聽力", "護理",
    "智慧醫", "精準醫療", "遠距醫療", "醫材"
]


def hits(text):
    tl = text.lower()
    return [k for k in NET if k.lower() in tl]


def main():
    cpx = json.load(open(os.path.join(RAW, "computex.json")))
    inx = json.load(open(os.path.join(RAW, "innovex.json")))

    cpx_c = []
    for r in cpx:
        blob = " ".join([r.get("name_en", ""), r.get("name_zh", ""),
                         r.get("products_en", ""), r.get("products_zh", ""),
                         r.get("booth_en", ""), r.get("booth_zh", "")])
        h = hits(blob)
        if h:
            cpx_c.append({
                "name_en": r["name_en"], "name_zh": r["name_zh"], "country": r["country"],
                "products_en": r.get("products_en", ""), "zone_en": r.get("booth_en", ""),
                "detail": CPX_DETAIL.format(h=r["hash_en"]) if r.get("hash_en") else "",
                "hits": h
            })

    inx_c = []
    for r in inx:
        blob = " ".join([r.get("name_en", ""), r.get("name_zh", ""), r.get("abbrev", ""),
                         r.get("industry") or "", r.get("pavilion") or ""])
        h = hits(blob)
        force = (r.get("industry") == "Healthcare & Biotech")
        if h or force:
            inx_c.append({
                "name_en": r["name_en"], "name_zh": r["name_zh"], "country": r.get("country", ""),
                "industry": r.get("industry", ""), "type": r.get("type", ""),
                "pavilion": r.get("pavilion", ""), "accelerator": bool(r.get("accelerator")),
                "fid": r.get("fid"), "exhibitId": r.get("exhibitId"),
                "detail": INX_DETAIL.format(fid=r.get("fid"), ex=r.get("exhibitId")),
                "hits": h, "force_healthcare": force
            })

    json.dump(cpx_c, open(os.path.join(RAW, "candidates_cpx.json"), "w"), ensure_ascii=False, indent=1)
    json.dump(inx_c, open(os.path.join(RAW, "candidates_inx.json"), "w"), ensure_ascii=False, indent=1)
    print(f"COMPUTEX candidates: {len(cpx_c)} / {len(cpx)}")
    print(f"InnoVEX candidates:  {len(inx_c)} / {len(inx)}")
    import collections
    print("CPX top hit terms:", dict(collections.Counter(k for c in cpx_c for k in c["hits"]).most_common(12)))


if __name__ == "__main__":
    main()
