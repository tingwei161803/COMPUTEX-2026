# COMPUTEX 2026 × InnoVEX 2026 · AI Together

> 把 COMPUTEX 2026 與 InnoVEX 2026 的官方內容,整理成一個多頁、可互動、雙語的靜態導覽站 —— 從活動介紹、**全參展商名錄**,到**醫療 AI 廠商深度頁**與**推薦參觀路線**。

這個站把 [COMPUTEX 2026](https://www.computextaipei.com.tw/) 與 [InnoVEX 2026](https://innovex.computex.biz/) 的主題、參展商、醫療 AI 生態、參觀規劃與**新聞風向**整理成 8 個彼此串連的頁面。資料整理自官方網站與公開報導,純 HTML/CSS/JS、零 build,可直接部署到 GitHub Pages。

---

## 🔗 線上版 / Live

| | |
|---|---|
| 🌐 網站 | <https://tingwei161803.github.io/COMPUTEX-2026/> |

頂部的**跨頁導覽列**可在 7 頁之間切換;每頁皆支援中文 / English 與深 / 淺色。

---

## 📄 頁面 / Pages

| 頁面 | 檔案 | 內容 |
|------|------|------|
| COMPUTEX 介紹 | `index.html` | 主題、三大主軸、週程、規模、參觀、背景(composite 一頁式) |
| 新聞風向 | `news.html` | 黃仁勳 keynote 重點與金句、市場風向、預測、**黃仁勳概念股(含近一個月股價折線圖)**、輿情分析(整理自公開報導,非投資建議) |
| InnoVEX 介紹 | `innovex.html` | InnoVEX 新創展介紹、產業分布、週程、看點 |
| COMPUTEX 廠商 | `exhibitors-computex.html` | **全 1,473 家**參展商,可依國家 / 展區 / 館別篩選 + 搜尋 |
| InnoVEX 廠商 | `exhibitors-innovex.html` | **全 383 家**新創,可依產業 / 類型 / 國家 / 館別篩選 + 搜尋 |
| COMPUTEX 醫療 AI | `medical-computex.html` | 篩出的 **25 家**醫療 AI 廠商,10 類次分類 + 多面向雙語介紹 + **展館位置(館別 / 樓層 / 攤位)** |
| InnoVEX 醫療 AI | `medical-innovex.html` | 篩出的 **63 家**醫療 AI 新創,10 類次分類 + 多面向雙語介紹 + **展館位置(館別 / 樓層 / 攤位)** |
| 醫療 AI 路線 | `routes.html` | 14 種預設路線 + 自由組合(焦點 × 次分類),即時產生**依實體展館 / 樓層排序**的可走動線 |

> 醫療 AI 次分類:醫療影像、語音、臨床文字 NLP、電子病歷、臨床系統/CDSS、智慧醫材與感測、藥物與生技、遠距與健康管理、手術與復健機器人、醫療 AI 算力與隱私運算。

---

## ✨ 功能特色

- 🧭 **跨頁導覽列** — 7 頁一鍵切換,自動高亮目前頁(`assets/site-nav.js`)
- 🔎 **名錄篩選 + 搜尋** — 1,473 + 383 家廠商,facet 下拉篩選 + 即時搜尋 + 載入更多
- 🩺 **醫療 AI 深度頁** — 次分類篩選、卡片亮點、**展館位置(館別/樓層/攤位)**、點開看「公司簡介 / 醫療 AI 切入點 / 技術產品 / 應用場景」多面向雙語介紹
- 📍 **展館位置** — 從官方名錄回填南港 1/2 館、世貿與樓層、攤位號;醫療頁與路線頁皆標示,並連官方會場平面圖
- 🗺️ **推薦路線產生器** — 選焦點(COMPUTEX / InnoVEX / 兩展)× 次分類,即時產生**依實體展館 / 樓層排序**、可走的參觀動線
- 📈 **概念股股價** — 黃仁勳概念股近一個月日線收盤 inline SVG 折線圖 + 漲跌幅(漲紅跌綠;資料快照,非投資建議)
- 🌏 **全頁雙語** — 中文 / English,動態資料走 `t()`、靜態文字走 `html[lang]` CSS,整頁同步無殘留
- 🌗 **深 / 淺色模式** — 近 OLED 深色與暖白淺色,`localStorage` 記憶,跨頁延續
- 📊 **inline SVG 圖表** — 長條圖、股價 sparkline,皆零圖表函式庫
- ⭐ **GitHub star 按鈕** — 各頁 appbar 一鍵 star,顯示即時星數(`assets/ghstar.js`)
- 📱 **響應式** — 手機 / 平板 / 桌機皆適配,375px 無水平溢出
- ⚡ **純靜態** — 無後端、可離線、含 SEO / Open Graph / JSON-LD

---

## 📂 結構 / Structure

```
COMPUTEX-2026/
├── index.html / innovex.html / news.html    # 介紹/新聞頁(composite,app.js 渲染)
├── exhibitors-computex.html / -innovex.html # 全廠商名錄(directory.js)
├── medical-computex.html / -innovex.html    # 醫療 AI 深度頁(medical.js)
├── routes.html                              # 醫療 AI 路線(routes.js)
├── assets/
│   ├── styles.css      # 設計 token(淺/深)+ 全部元件樣式
│   ├── app.js          # composite 介紹頁渲染(hero/cards/timeline/bars/...)
│   ├── core.js         # 新頁共用:雙語/主題狀態、t()、scroll-reveal、展館位置(Core.venue)
│   ├── site-nav.js     # 跨頁導覽列(CSS i18n)
│   ├── directory.js    # 名錄引擎(搜尋 + facet 篩選 + 詳情 dialog)
│   ├── medical.js      # 醫療頁(次分類篩選 + 多面向 profile dialog)
│   ├── routes.js       # 路線(預設 + builder + 動線生成)
│   ├── ghstar.js       # 各頁 appbar 的 GitHub star 按鈕(自注入樣式+按鈕+星數)
│   └── og-image.png
├── data/
│   ├── data.js / innovex.js / news.js       # 介紹/新聞頁區段資料
│   ├── stocks.js                            # 概念股近一個月日線收盤(sparkline 快照)
│   ├── exhibitors-computex.js / -innovex.js # 全廠商名錄 + 篩選 facet
│   ├── medical.js                           # 醫療 taxonomy + 廠商 + 多面向介紹(含展館 v/b)
│   └── routes.js                            # 推薦路線預設
├── _tools/             # 資料管線(可重新產生 data/*.js;raw/ 為 gitignore 的中間檔)
│   ├── scrape.py            # 抓取 COMPUTEX/InnoVEX 全廠商
│   ├── candidates.py / build_llm_input.py / fetch_inx_details.py
│   ├── build_data.py / build_medical.py / build_news.py  # 轉成 data/*.js
│   ├── venue_match.py / add_venue.py        # 展館/攤位比對 + 回填 data/medical.js
│   ├── build_stocks.py      # 抓概念股近一個月股價 -> data/stocks.js
│   └── taxonomy.json        # 醫療 AI 10 類次分類定義
├── .nojekyll
└── README.md
```

---

## 🧱 資料管線 / Data pipeline

`data/*.js` 是 commit 的成品,可由 `_tools/` 重新產生(一律使用 `uv`):

```bash
uv run --no-project python _tools/scrape.py            # 抓全廠商 -> raw/{computex,innovex}.json
uv run --no-project python _tools/fetch_inx_details.py # 抓 InnoVEX 詳情頁全文
uv run --no-project python _tools/candidates.py        # 醫療關鍵字網篩候選
uv run --no-project python _tools/build_llm_input.py   # 切批給 LLM 分類
#   -> 以多個 agent 平行判定醫療相關性、10 類次分類、撰寫雙語介紹(寫入 raw/out/)
uv run --no-project python _tools/build_data.py         # -> data/exhibitors-*.js
uv run --no-project python _tools/build_medical.py      # -> data/medical.js(已含展館 v/b)
uv run --no-project python _tools/add_venue.py          # 回填展館到既有 medical.js(raw 不在時用)
uv run --no-project python _tools/build_stocks.py       # -> data/stocks.js(概念股近一月股價)
```

> 展館/樓層:`venue_match.py` 以 url-hash / 名稱把醫療廠商比對回 COMPUTEX 名錄,取得實體館別(南港 1/2 館、世貿)與攤位號;樓層依官方展區推得(InnoVEX S 區在南港 2 館 4 樓等)。
> 股價:`build_stocks.py` 從 Yahoo Finance chart API 抓近一個月日線收盤(上市抓不到自動退回上櫃 `.TWO`),為部署當下的快照,僅供瀏覽參考、非投資建議。

> 醫療 AI 的分類與介紹由 AI 依各公司**官方公開描述**整理(InnoVEX 取自官方詳情頁全文;COMPUTEX 取自產品/展區欄位),力求不捏造;資訊較薄時從簡。

---

## 📦 主要資料來源

- COMPUTEX TAIPEI 官方網站與參展商名錄 — <https://www.computextaipei.com.tw/>
- InnoVEX 官方網站與參展商名錄 — <https://innovex.computex.biz/>
- 官方新聞稿、NVIDIA GTC Taipei、EE Times Asia、COMPUTEX 2025 Post-Show Report 等公開報導

> ⚠️ **非官方**:本站為個人整理之非官方資源,與 COMPUTEX、InnoVEX、TAITRA、TCA 無關。展期、場館、攤位、活動與報名等細節以官方公告為準;如有錯誤或出入,請以官方來源為準。醫療 AI 分類與介紹由 AI 整理,僅供瀏覽參考。

---

## 🛠 本機使用

```bash
git clone git@github.com:tingwei161803/COMPUTEX-2026.git
cd COMPUTEX-2026

# 直接開啟,或啟動本機伺服器(建議,跨頁連結才正常)
uv run --no-project python -m http.server 4173
# 瀏覽 http://localhost:4173
```

> 純靜態網站,瀏覽不需安裝任何依賴;只有重跑資料管線時會用到 Python(透過 `uv`)。

---

## 📝 聲明 / License

- 本站為非官方整理,內容著作權歸原始來源(COMPUTEX / InnoVEX / TAITRA / TCA 與各參展公司)所有。
- 程式碼以 MIT 授權釋出。
- 如為權利人且希望調整或移除內容,請開 issue 聯絡。
