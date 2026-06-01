# COMPUTEX 2026 · AI Together

> 把 COMPUTEX 2026 官網的內容,整理成一頁式、可互動、雙語的靜態導覽網站。

這個網站把 [COMPUTEX 2026](https://www.computextaipei.com.tw/) 的主題、三大核心主軸、展會週程、規模數據、參觀資訊與背景介紹,整理成一頁多區段的 atlas/landing 頁面。資料整理自 COMPUTEX 官方網站與公開報導,僅供瀏覽參考。純 HTML/CSS/JS、零 build,可直接部署到 GitHub Pages。

---

## 🔗 線上版 / Live

| | |
|---|---|
| 🌐 網站 | <https://tingwei161803.github.io/COMPUTEX2026/> |

> 直接點進去就能用,無需安裝。可用 `https://tingwei161803.github.io/COMPUTEX2026/#<slug>` 深連結到特定主軸卡片(例:`#ai-computing`、`#robotics-mobility`、`#next-gen-tech`)。

---

## ✨ 功能特色

- 🌏 **全頁雙語切換** — 中文 / English 一鍵切換,整頁(標題、卡片、時間軸、FAQ、圖表標籤、頁尾)同步切換,無語言殘留
- 🌗 **深色 / 淺色模式** — 近 OLED 深色與暖白淺色,手動切換並以 `localStorage` 記憶
- 🧭 **區段導覽 + scrollspy** — 頂部 sticky 導覽列自動高亮目前所在區段
- 🃏 **卡片詳情 + 深連結** — 點三大主軸卡片開啟 `<dialog>` 詳情,網址帶 `#<slug>` 可分享
- 📊 **inline SVG 長條圖** — 2025 vs 2026 規模對比,無圖表函式庫
- ✨ **滾動進場動畫** — 區塊進入視窗時淡入上移(尊重 `prefers-reduced-motion`)
- 📱 **響應式設計** — 手機、平板、桌機皆適配,375px 無水平溢出
- ⚡ **純靜態** — 無後端、載入快、可離線瀏覽;含 SEO / Open Graph / JSON-LD(Event)結構化資料

---

## 📂 內容結構 / 資料來源

本站內容整理自 **COMPUTEX 官方網站與公開報導**。

```
COMPUTEX2026/
├── index.html          # 入口頁(meta / OG / JSON-LD)
├── assets/
│   ├── styles.css       # 設計 token(淺/深)+ 全部元件樣式
│   ├── app.js           # 區段渲染、i18n、主題、dialog、scrollspy、進場動畫
│   └── og-image.png     # 社群分享預覽圖
├── data/
│   └── data.js          # window.SITE_META + window.SITE_SECTIONS(雙語資料)
├── .nojekyll            # 讓 GitHub Pages 跳過 Jekyll 處理
└── README.md
```

**主要資料來源:**

- COMPUTEX TAIPEI 官方網站 — <https://www.computextaipei.com.tw/>
- 官方新聞稿:COMPUTEX 2026 Brings the Global AI Ecosystem to Taipei — <https://www.computextaipei.com.tw/en/news/8F914C77B6AF77A5/info.html>
- NVIDIA GTC Taipei at COMPUTEX 2026 — <https://www.nvidia.com/en-tw/gtc/taipei/computex/>
- EE Times Asia:1,500-strong exhibitors to showcase AI & Computing, Robotics & Mobility, Next-Gen Tech — <https://www.eetasia.com/1500-strong-exhibitors-to-showcase-ai-computing-robotics-mobility-and-next-gen-tech-at-computex-2026/>
- COMPUTEX 2025 Post-Show Report(2025 規模數據)— <https://www.computex.biz/UploadFile/COMPUTEX_2025_PostShowReport_en.pdf>

> ⚠️ **非官方**:本網站為個人整理之非官方資源,與 COMPUTEX、TAITRA、TCA 無關。展期、場館、活動與報名等細節以官方公告為準;如有錯誤或出入,請以官方來源為準。

---

## 🛠 本機使用

```bash
# 1. clone 專案
git clone git@github.com:tingwei161803/COMPUTEX2026.git
cd COMPUTEX2026

# 2a. 最簡單:直接開啟 index.html
open index.html

# 2b. 或啟動本機伺服器(建議,深連結才正常)
uv run python -m http.server 4173
# 然後瀏覽 http://localhost:4173
```

> 本專案為純靜態網站,不需安裝任何依賴。若要跑本機伺服器,一律使用 `uv`。

---

## 📝 聲明 / License

- 本站為非官方整理,內容著作權歸原始來源(COMPUTEX / TAITRA / TCA 等)所有。
- 程式碼以 MIT 授權釋出。
- 如為權利人且希望調整或移除內容,請開 issue 聯絡。
