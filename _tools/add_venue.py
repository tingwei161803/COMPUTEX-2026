#!/usr/bin/env python3
"""
Back-fill venue (v) + booth (b) onto every company in data/medical.js by matching
against the full COMPUTEX directory (data/exhibitors-computex.js).

Idempotent: re-running just refreshes v/b. Use this when the raw LLM pipeline
inputs (_tools/raw/) are unavailable so build_medical.py cannot be re-run.

Run: uv run --no-project python _tools/add_venue.py
"""
import collections
import json
import os

from venue_match import build_cpx_index, load_js_obj, match_venue

HERE = os.path.dirname(__file__)
DATA = os.path.normpath(os.path.join(HERE, "..", "data"))

HEADER = (
    "/* 醫療 AI taxonomy + COMPUTEX/InnoVEX 醫療廠商(LLM 判定+撰寫,grounded)\n"
    "   展館/攤位(v,b)由 _tools/add_venue.py 從 exhibitors-computex.js 比對補上。\n"
    "   AUTO-GENERATED — do not hand-edit. */\n"
)


def main():
    cpx = load_js_obj(os.path.join(DATA, "exhibitors-computex.js"))["items"]
    index = build_cpx_index(cpx)

    path = os.path.join(DATA, "medical.js")
    med = load_js_obj(path)

    stats = collections.Counter()
    for kind in ("cpx", "inx"):
        for it in med.get(kind, []):
            v, b = match_venue(index, it.get("ne", ""), it.get("nz", ""), it.get("url", ""))
            it["v"] = v
            it["b"] = b
            stats[(kind, v, "booth" if b else "no-booth")] += 1

    with open(path, "w", encoding="utf-8") as f:
        f.write(HEADER)
        f.write("window.MED = ")
        json.dump(med, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")

    for kind in ("cpx", "inx"):
        total = len(med.get(kind, []))
        venues = collections.Counter()
        booths = 0
        for it in med.get(kind, []):
            venues[it["v"]] += 1
            booths += 1 if it["b"] else 0
        print(f"[{kind}] {total} 家 · venue {dict(venues)} · 有攤位號 {booths}")
    print(f"file {os.path.getsize(path) // 1024} KB")


if __name__ == "__main__":
    main()
