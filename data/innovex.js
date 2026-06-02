/* =========================================================================
   InnoVEX 2026 · 資料層 — composite 區段(由 app.js 依 type 渲染)。
   數據整理自官方公開資訊與本站抓取的參展名錄;確切資訊以官方公告為準。
   ========================================================================= */
window.SITE_META = {
  title:    { en: "InnoVEX 2026", zh: "InnoVEX 2026" },
  subtitle: { en: "Asia's innovation hub · TaiNEX 2 · June 2–5, 2026",
              zh: "亞洲創新樞紐 · 南港二館 · 2026 年 6 月 2–5 日" }
};

window.SITE_SECTIONS = [
  {
    type: "hero", id: "overview",
    title:    { en: "InnoVEX", zh: "InnoVEX" },
    subtitle: { en: "COMPUTEX's startup arena at TaiNEX 2 — startups, investors, accelerators and national pavilions converge to turn ideas into the next wave of tech.",
                zh: "COMPUTEX 的新創舞台,座落南港二館 —— 新創、投資人、加速器與各國主題館齊聚,把點子推向下一波科技浪潮。" },
    stats: [
      { label: { en: "Exhibitors", zh: "參展單位" }, value: 383 },
      { label: { en: "Startups", zh: "新創" },       value: 251 },
      { label: { en: "Countries", zh: "參展國家" },   value: 21 },
      { label: { en: "Pavilions", zh: "主題館" },     value: 32 }
    ]
  },

  {
    type: "cards", id: "highlights",
    title:    { en: "What to Expect", zh: "看點一覽" },
    subtitle: { en: "Tap a card for what each part of InnoVEX offers.",
                zh: "點一張卡片看 InnoVEX 各區塊的內容。" },
    items: [
      {
        slug: "startups",
        title:   { en: "Startup Ecosystem", zh: "新創生態系" },
        summary: { en: "251 startups across AI, health-tech, IoT, semiconductors and more.",
                   zh: "251 家新創,橫跨 AI、健康科技、IoT、半導體等領域。" },
        tags: ["startups", "AI", "deep tech"],
        overview: { en: "InnoVEX gathers 251 startups (of 383 total exhibitors) alongside corporations, accelerators, investors and research labs. AI leads the field (122 exhibitors), followed by Healthcare & Biotech (41), IoT (23) and Semiconductor Application (22) — a cross-section of where founders see the next opportunity.",
                    zh: "InnoVEX 匯聚 251 家新創(全展 383 家參展單位),並有企業、加速器、投資人與研究單位同場。AI 為最大宗(122 家),其次是健康科技與生技(41)、IoT(23)、半導體應用(22)—— 正是創業者眼中的下一個機會所在。" }
      },
      {
        slug: "pavilions",
        title:   { en: "National & Theme Pavilions", zh: "國家與主題館" },
        summary: { en: "32 pavilions — Canada, France, Korea, J-NET, NVIDIA Inception, AI×Innovation…",
                   zh: "32 個主題館 —— 加拿大、法國、韓國、J-NET、NVIDIA Inception、AI×Innovation…" },
        tags: ["pavilions", "global"],
        overview: { en: "Startups cluster into 32 pavilions: country pavilions (Canada, France, Korea, Japan's J-NET) and theme pavilions such as NVIDIA Inception Startups, the AI×Innovation Pavilion, SMESA, NYCU×HSP and the IC Taiwan Grand Challenge — a fast way to scan an entire region or theme in one aisle.",
                    zh: "新創依 32 個主題館分群:國家館(加拿大、法國、韓國、日本 J-NET)與主題館,如 NVIDIA Inception、AI×Innovation、SMESA、陽明交大×新竹科學園區、IC Taiwan Grand Challenge —— 一條走道就能快速掃過一個區域或主題。" }
      },
      {
        slug: "pitch",
        title:   { en: "Pitch Contest", zh: "創新競賽 Pitch Contest" },
        summary: { en: "Startups pitch on stage to investors and judges for awards.",
                   zh: "新創登台向投資人與評審 pitch,角逐獎項。" },
        tags: ["pitch", "awards", "investors"],
        overview: { en: "The InnoVEX Pitch Contest puts selected startups on stage in front of investors and an expert panel, competing for awards and visibility. It's the headline moment for fundraising-stage founders and a curated shortlist of what the organisers consider the most promising teams.",
                    zh: "InnoVEX Pitch Contest 讓入選新創登上舞台,面對投資人與專家評審,角逐獎項與曝光。對募資階段的創業者而言是年度重頭戲,也是主辦方眼中最具潛力團隊的精選名單。" }
      },
      {
        slug: "connect",
        title:   { en: "Matchmaking & InnoVEX Night", zh: "媒合與 InnoVEX Night" },
        summary: { en: "1-on-1 matchmaking by day, networking party by night.",
                   zh: "白天一對一媒合,夜晚交流派對。" },
        tags: ["matchmaking", "networking"],
        overview: { en: "Beyond the booths, InnoVEX runs structured 1-on-1 matchmaking between startups, corporates and investors, plus side events and the InnoVEX Night networking party — the deal-making and relationship layer that turns a visit into partnerships.",
                    zh: "除了攤位,InnoVEX 安排新創、企業與投資人之間的一對一媒合,並有周邊活動與 InnoVEX Night 交流派對 —— 這是把一次參觀變成合作的「成交與人脈」層。" }
      }
    ]
  },

  {
    type: "timeline", id: "program",
    title:    { en: "Show Week", zh: "展會週程" },
    subtitle: { en: "InnoVEX runs alongside COMPUTEX, June 2–5 at TaiNEX 2. Details follow official announcements.",
                zh: "InnoVEX 與 COMPUTEX 同期,6 月 2–5 日於南港二館登場。細節以官方公告為準。" },
    events: [
      { date: "Jun 2", title: { en: "Doors Open · Stage Programs Begin", zh: "開展 · 舞台議程開跑" },
        body: { en: "The exhibition floor and InnoVEX Stage open with talks, demos and ecosystem sessions.",
                zh: "展場與 InnoVEX 舞台開放,展開演講、展示與生態系議程。" } },
      { date: "Jun 2–4", title: { en: "Pitch Contest & Matchmaking", zh: "Pitch Contest 與媒合" },
        body: { en: "Selected startups pitch to investors; 1-on-1 matchmaking runs throughout.",
                zh: "入選新創向投資人 pitch;一對一媒合全程進行。" } },
      { date: "Jun 3", title: { en: "InnoVEX Night", zh: "InnoVEX Night 交流之夜" },
        body: { en: "The flagship networking party for founders, investors and partners.",
                zh: "為創業者、投資人與夥伴舉辦的旗艦交流派對。" } },
      { date: "Jun 5", title: { en: "Award Winners & Close", zh: "得獎名單與閉幕" },
        body: { en: "Pitch winners announced; the show wraps alongside COMPUTEX.",
                zh: "公布 Pitch 得獎名單;與 COMPUTEX 同步閉幕。" } }
    ]
  },

  {
    type: "bars", id: "industries",
    title:    { en: "Top Industries", zh: "主要產業分布" },
    subtitle: { en: "Exhibitor count by industry (from the official directory).",
                zh: "依官方名錄統計的各產業參展數。" },
    series: [
      { label: { en: "AI", zh: "AI" }, value: 122 },
      { label: { en: "Health & Biotech", zh: "健康生技" }, value: 41 },
      { label: { en: "IoT", zh: "IoT" }, value: 23 },
      { label: { en: "Semiconductor", zh: "半導體" }, value: 22 },
      { label: { en: "5G / Comms", zh: "5G/通訊" }, value: 16 },
      { label: { en: "Manufacturing", zh: "製造" }, value: 14 }
    ]
  },

  {
    type: "accordion", id: "visit",
    title:    { en: "Visiting InnoVEX", zh: "參觀資訊" },
    subtitle: { en: "Practical notes for planning your visit.",
                zh: "規劃參觀的實用提醒。" },
    qa: [
      { q: { en: "Where is InnoVEX?", zh: "InnoVEX 在哪裡?" },
        a: { en: "At TaiNEX 2 (Taipei Nangang Exhibition Center, Hall 2), part of COMPUTEX 2026. A COMPUTEX badge typically covers InnoVEX — check official registration.",
             zh: "位於南港二館(台北南港展覽館二館),為 COMPUTEX 2026 的一環。COMPUTEX 證件通常涵蓋 InnoVEX —— 報名細節以官方為準。" } },
      { q: { en: "How is it different from COMPUTEX?", zh: "和 COMPUTEX 有什麼不同?" },
        a: { en: "COMPUTEX spans the whole tech supply chain; InnoVEX is its startup zone — earlier-stage teams, national pavilions, pitch and matchmaking.",
             zh: "COMPUTEX 涵蓋整條科技供應鏈;InnoVEX 是其中的新創專區 —— 更早期的團隊、國家館、pitch 與媒合。" } },
      { q: { en: "I'm looking for medical AI — where do I start?", zh: "我想找醫療 AI,從哪開始?" },
        a: { en: "See this site's InnoVEX Medical AI page: 63 medical-AI startups grouped into 10 sub-categories with profiles, plus ready-made visiting routes.",
             zh: "可看本站的「InnoVEX 醫療 AI」頁:63 家醫療 AI 新創,依 10 類次分類整理並附介紹,還有現成的參觀路線。" } },
      { q: { en: "How do I plan an efficient walk?", zh: "怎麼安排有效率的動線?" },
        a: { en: "Pavilions cluster startups by country/theme, so walking pavilion-by-pavilion is efficient. For medical AI, use the Routes page to get a booth-ordered itinerary.",
             zh: "主題館已依國家/主題把新創分群,逐館走最有效率。醫療 AI 可用本站「推薦路線」頁產生依攤位排序的動線。" } }
    ]
  },

  {
    type: "prose", id: "about",
    title:    { en: "About InnoVEX", zh: "關於 InnoVEX" },
    blocks: [
      { type: "p", text: { en: "InnoVEX is the startup exhibition of COMPUTEX — the place where the supply-chain giants of the main show meet the founders building what comes next. Each year it brings hundreds of startups from across Asia and beyond into one connected space at TaiNEX 2.",
                            zh: "InnoVEX 是 COMPUTEX 的新創展區 —— 主展場的供應鏈巨頭,在這裡遇見打造未來的創業者。每年於南港二館匯聚來自亞洲與世界各地的數百家新創,聚成一個彼此連結的空間。" } },
      { type: "h3", text: { en: "Why it matters", zh: "它為什麼重要" } },
      { type: "ul", items: {
          en: ["A single venue to scan global early-stage tech by theme and region",
               "National & theme pavilions make whole ecosystems walkable in one aisle",
               "Pitch, matchmaking and InnoVEX Night turn browsing into partnerships",
               "A strong health-tech presence — 41 Health & Biotech exhibitors, many AI-driven"],
          zh: ["一個場地就能依主題與區域掃過全球早期科技",
               "國家與主題館讓整個生態系在一條走道內走完",
               "Pitch、媒合與 InnoVEX Night 把瀏覽變成合作",
               "強勁的健康科技陣容 —— 41 家健康生技參展,許多以 AI 驅動"] } }
    ]
  },

  {
    type: "cta", id: "register",
    title: { en: "Plan your InnoVEX", zh: "開始規劃你的 InnoVEX" },
    text:  { en: "Browse all 383 exhibitors, dive into 63 medical-AI startups, or build a medical-AI visiting route — all on this site. For official registration and the latest agenda, visit InnoVEX.",
             zh: "在本站瀏覽全部 383 家參展單位、深入 63 家醫療 AI 新創,或產生醫療 AI 參觀路線。官方報名與最新議程請見 InnoVEX 官網。" },
    link: { url: "https://innovex.computex.biz/", label: { en: "Official InnoVEX site", zh: "InnoVEX 官方網站" } }
  }
];
