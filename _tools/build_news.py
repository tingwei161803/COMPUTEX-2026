#!/usr/bin/env python3
"""
Phase 5 — assemble data/news.js (composite SITE_SECTIONS) from the 5 research
JSON files in raw/news/. Maps research -> existing app.js block types, so the
news page needs no new front-end code.

Run: uv run --no-project python _tools/build_news.py
Out: data/news.js
"""
import json, os, re

HERE = os.path.dirname(__file__)
NEWS = os.path.join(HERE, "raw", "news")
DATA = os.path.normpath(os.path.join(HERE, "..", "data"))


def load(name):
    return json.load(open(os.path.join(NEWS, name)))


def first_sentence(s, lang):
    s = (s or "").strip()
    if lang == "zh":
        m = re.search(r"^(.*?[。!?])", s)
    else:
        m = re.search(r"^(.*?[.!?])(\s|$)", s)
    return (m.group(1) if m else s[:120]).strip()


def bi(zh, en):
    return {"zh": zh, "en": en}


def main():
    keynote = load("keynote.json")
    market = load("market.json")
    predictions = load("predictions.json")
    stocks = load("stocks.json")
    sentiment = load("sentiment.json")

    sections = []

    # ---- hero ----
    sections.append({
        "type": "hero", "id": "pulse",
        "title": bi("黃仁勳 keynote 與市場風向", "Jensen's Keynote & the Market"),
        "subtitle": bi(
            "COMPUTEX 2026 / NVIDIA GTC Taipei(6 月 1 日)黃仁勳主題演講的重點、市場風向與預測、黃仁勳概念股,以及輿情分析。整理自公開報導,非投資建議。",
            "Highlights from Jensen Huang's COMPUTEX 2026 / NVIDIA GTC Taipei keynote (June 1), the market read, forecasts, the 'Jensen Huang concept stocks,' and sentiment. Compiled from public reporting — not investment advice."),
        "stats": [
            {"label": bi("NVDA keynote 當日漲幅 %", "NVDA day move %"), "value": 6},
            {"label": bi("NVIDIA 在台年支出 (十億美元)", "NVIDIA Taiwan spend ($B/yr)"), "value": 150},
            {"label": bi("Vera Rubin NVL72 GPU 數", "Rubin GPUs / rack"), "value": 72},
            {"label": bi("台股盤中新高 (點)", "TAIEX intraday record (pts)"), "value": 45931},
        ]
    })

    # ---- keynote highlights -> cards ----
    kcards = []
    for i, h in enumerate(keynote["highlights"]):
        kcards.append({
            "slug": "k%d" % i,
            "title": bi(h["title_zh"], h["title_en"]),
            "summary": bi(first_sentence(h["body_zh"], "zh"), first_sentence(h["body_en"], "en")),
            "overview": bi(h["body_zh"], h["body_en"]),
            "tags": []
        })
    sections.append({
        "type": "cards", "id": "keynote",
        "title": bi("Keynote 重點", "Keynote Highlights"),
        "subtitle": bi("黃仁勳這場 keynote 的關鍵宣布。點卡片看完整內容。",
                       "The key announcements from Huang's keynote. Tap a card for the full take."),
        "items": kcards
    })

    # ---- quotes ----
    sections.append({
        "type": "quotes", "id": "quotes",
        "title": bi("黃仁勳金句", "In His Words"),
        "subtitle": bi("演講中被媒體廣為引用的話。", "Lines from the stage, as widely quoted by media."),
        "quotes": [{"text": bi(q["text_zh"], q["text_en"]), "by": q["by"]} for q in keynote["quotes"]]
    })

    # ---- market trends -> prose ----
    mblocks = []
    for tr in market["trends"]:
        mblocks.append({"type": "h3", "text": bi(tr["title_zh"], tr["title_en"])})
        mblocks.append({"type": "p", "text": bi(tr["body_zh"], tr["body_en"])})
    sections.append({
        "type": "prose", "id": "market",
        "title": bi("市場風向", "Market Read"),
        "subtitle": bi("keynote 之後,產業與資金往哪裡走。", "Where industry and capital are moving after the keynote."),
        "blocks": mblocks
    })

    # ---- predictions -> timeline ----
    sections.append({
        "type": "timeline", "id": "forecast",
        "title": bi("預測與展望", "Forecasts & Outlook"),
        "subtitle": bi("來自 NVIDIA、分析師與媒體的前瞻說法 —— 屬預測,實際可能變動。",
                       "Forward-looking claims from NVIDIA, analysts and media — predictions that may change."),
        "events": [{"date": p["label"], "title": bi(p["title_zh"], p["title_en"]),
                    "body": bi(p["body_zh"], p["body_en"])} for p in predictions["items"]]
    })

    # ---- concept stocks -> cards ----
    scards = []
    for s in stocks["stocks"]:
        title = "%s %s · %s" % (s["name_zh"], s["name_en"], s.get("ticker", ""))
        title_en = "%s · %s" % (s["name_en"], s.get("ticker", ""))
        scards.append({
            "slug": s.get("ticker", s["name_en"]).replace(" ", ""),
            "title": bi(title.strip(" ·"), title_en.strip(" ·")),
            "summary": bi(first_sentence(s["role_zh"], "zh"), first_sentence(s["role_en"], "en")),
            "overview": bi(s["role_zh"], s["role_en"]),
            "tags": s.get("tags", [])[:5]
        })
    sections.append({
        "type": "cards", "id": "stocks",
        "title": bi("黃仁勳概念股", "‘Jensen Huang’ Concept Stocks"),
        "subtitle": bi(stocks["note_zh"], stocks["note_en"]),
        "items": scards
    })

    # ---- sentiment -> prose (bull / bear / keywords) ----
    sblocks = [{"type": "p", "text": bi(sentiment["summary_zh"], sentiment["summary_en"])},
               {"type": "h3", "text": bi("看多敘事", "The Bull Case")},
               {"type": "ul", "items": bi([b["p_zh"] for b in sentiment["bull"]],
                                           [b["p_en"] for b in sentiment["bull"]])},
               {"type": "h3", "text": bi("看空 / 風險敘事", "The Bear Case")},
               {"type": "ul", "items": bi([b["p_zh"] for b in sentiment["bear"]],
                                           [b["p_en"] for b in sentiment["bear"]])},
               {"type": "h3", "text": bi("熱門關鍵字", "Hot Keywords")},
               {"type": "p", "text": bi(" · ".join(k["zh"] for k in sentiment["keywords"]),
                                        " · ".join(k["en"] for k in sentiment["keywords"]))}]
    sections.append({
        "type": "prose", "id": "sentiment",
        "title": bi("輿情分析", "Sentiment Analysis"),
        "subtitle": bi("市場怎麼看 —— 樂觀與質疑並陳。", "How the market reads it — optimism and skepticism side by side."),
        "blocks": sblocks
    })

    # ---- cta ----
    sources = sorted(set(sum([d.get("sources", []) for d in [keynote, market, predictions, stocks, sentiment]], [])))
    sections.append({
        "type": "cta", "id": "sources",
        "title": bi("看原始資料", "Go to the Source"),
        "text": bi("本頁整理自 %d+ 篇公開報導(NVIDIA、CNBC、SiliconANGLE、CRN Asia、Tom's Hardware、TradingKey、TechNews、鉅亨、Yahoo 奇摩股市等),僅供瀏覽參考,非投資建議。完整 keynote 請見 NVIDIA 官方頁。" % len(sources),
                    "Compiled from %d+ public reports (NVIDIA, CNBC, SiliconANGLE, CRN Asia, Tom's Hardware, TradingKey and more), for reference only — not investment advice. Watch the full keynote on NVIDIA's site." % len(sources)),
        "link": {"url": "https://www.nvidia.com/en-tw/gtc/taipei/keynote/",
                 "label": bi("NVIDIA GTC Taipei keynote", "NVIDIA GTC Taipei keynote")}
    })

    meta = {"title": bi("COMPUTEX 2026 風向", "COMPUTEX 2026 Market Pulse"),
            "subtitle": bi("黃仁勳 keynote · 市場 · 輿情", "Jensen's keynote · market · sentiment")}

    path = os.path.join(DATA, "news.js")
    with open(path, "w") as f:
        f.write("/* COMPUTEX 2026 新聞風向 — 整理自公開報導,非投資建議。\n")
        f.write("   AUTO-GENERATED by _tools/build_news.py from raw/news/*.json (research agents). */\n")
        f.write("window.SITE_META = ")
        json.dump(meta, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\nwindow.SITE_SECTIONS = ")
        json.dump(sections, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")
    print("news.js: %d sections, %d KB · keynote %d, stocks %d, sources %d" %
          (len(sections), os.path.getsize(path) // 1024, len(kcards), len(scards), len(sources)))


if __name__ == "__main__":
    main()
