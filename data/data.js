/* =========================================================================
   COMPUTEX 2026 · 資料層 (data layer)
   lazy-data2web · composite — 一頁多區段,app.js 依 type 渲染。

   資料整理自 COMPUTEX 官方網站與公開報導(見 README 的資料來源)。
   本網站為非官方整理,僅供瀏覽參考;確切資訊以官方公告為準。

   Contract:
     window.SITE_META     = { title:{en,zh}, subtitle:{en,zh} }
     window.SITE_SECTIONS = [ { type, id, title:{en,zh}, subtitle:{en,zh}, ... } ]
   ========================================================================= */

window.SITE_META = {
  title:    { en: "COMPUTEX 2026", zh: "COMPUTEX 2026" },
  subtitle: { en: "AI Together · Taipei · June 2–5, 2026",
              zh: "AI Together · 台北 · 2026 年 6 月 2–5 日" }
};

window.SITE_SECTIONS = [

  /* ---------------------------------------------------------------- HERO */
  {
    type: "hero",
    id: "overview",
    title:    { en: "AI Together", zh: "AI Together" },
    subtitle: { en: "The world's largest AI exhibition returns to Taipei, June 2–5, 2026 — uniting the global AI ecosystem across AI computing, robotics, and next-generation technologies.",
                zh: "「AI Together,攜手共創 AI」——全球最大 AI 展會 2026 年 6 月 2–5 日重返台北,匯聚全球 AI 生態系,橫跨 AI 運算、機器人與次世代科技三大主軸。" },
    stats: [
      { label: { en: "Exhibitors", zh: "參展商" },        value: 1500 },
      { label: { en: "Booths", zh: "攤位數" },            value: 6000 },
      { label: { en: "Countries", zh: "參展國家" },        value: 33 },
      { label: { en: "Show days", zh: "展覽天數" },        value: 4 }
    ]
  },

  /* --------------------------------------------------- CARDS · 3 PILLARS */
  {
    type: "cards",
    id: "themes",
    title:    { en: "Three Core Themes", zh: "三大核心主軸" },
    subtitle: { en: "COMPUTEX 2026 is organized around three pillars. Tap a card for what each covers.",
                zh: "COMPUTEX 2026 圍繞三大主軸策展。點一張卡片看各主軸涵蓋的範疇。" },
    items: [
      {
        slug: "ai-computing",
        title:   { en: "AI & Computing", zh: "AI 與運算" },
        summary: { en: "Accelerators, HPC, NPUs and the infrastructure powering enterprise AI inference.",
                   zh: "加速器、高效能運算、NPU,以及驅動企業級 AI 推論的基礎設施。" },
        tags: ["AI", "HPC", "NPU", "inference"],
        overview: { en: "The computing backbone of the AI era: AI accelerators and GPUs, high-performance computing (HPC), neural processing units (NPUs), AI servers and data-center infrastructure, AI PCs, and enterprise inference platforms. This is where the silicon, systems, and software that train and run large models come together.",
                    zh: "AI 時代的運算骨幹:AI 加速器與 GPU、高效能運算(HPC)、神經處理器(NPU)、AI 伺服器與資料中心基礎設施、AI PC,以及企業級推論平台。訓練與執行大型模型所需的晶片、系統與軟體都匯聚於此。" }
      },
      {
        slug: "robotics-mobility",
        title:   { en: "Robotics & Mobility", zh: "機器人與智慧移動" },
        summary: { en: "Autonomous mobile robots, collaborative arms, physical AI and smart logistics.",
                   zh: "自主移動機器人、協作型機械手臂、實體 AI 與智慧物流。" },
        tags: ["robotics", "physical AI", "AMR", "mobility"],
        overview: { en: "Robotics is moving beyond the factory floor into healthcare, logistics, retail and everyday environments. Expect autonomous mobile robots (AMRs), collaborative robotic arms, embodied / physical AI, machine vision, and smart-mobility systems — showcased in the new Robotics Zone and TechXperience Zone at TWTC Hall 1.",
                    zh: "機器人正從工廠走進醫療、物流、零售與日常場景。可預期看到自主移動機器人(AMR)、協作型機械手臂、具身/實體 AI、機器視覺與智慧移動系統 —— 並於南港世貿一館全新的「機器人專區」與「TechXperience 體驗專區」展出。" }
      },
      {
        slug: "next-gen-tech",
        title:   { en: "Next-Gen Tech", zh: "次世代科技" },
        summary: { en: "6G / B5G, edge computing, quantum, cybersecurity and sustainability.",
                   zh: "6G／B5G、邊緣運算、量子、資安與永續。" },
        tags: ["6G", "edge", "quantum", "security", "sustainability"],
        overview: { en: "The frontier technologies that will define the next decade of connected computing: 6G and beyond-5G connectivity, edge computing, quantum technologies, cybersecurity, and sustainable / green tech. These themes connect the AI core to the networks, devices and responsible practices that scale it to the real world.",
                    zh: "定義下一個十年連網運算的前沿技術:6G 與超越 5G 連線、邊緣運算、量子技術、資訊安全,以及永續/綠色科技。這些主題把 AI 核心連結到能將其推向真實世界的網路、裝置與負責任的實踐。" }
      }
    ]
  },

  /* ------------------------------------------------------------ TIMELINE */
  {
    type: "timeline",
    id: "schedule",
    title:    { en: "Show Week at a Glance", zh: "展會週程一覽" },
    subtitle: { en: "Key moments across the multi-venue week. Times and details follow official announcements.",
                zh: "多場館展會週的重點時刻。時間與細節以官方公告為準。" },
    events: [
      { date: "Jun 1",
        title: { en: "NVIDIA GTC Taipei Keynote", zh: "NVIDIA GTC Taipei 主題演講" },
        body:  { en: "NVIDIA founder & CEO Jensen Huang delivers the opening keynote, spotlighting the latest AI advances and the partners building the AI ecosystem.",
                 zh: "NVIDIA 創辦人暨執行長黃仁勳發表開幕主題演講,聚焦最新 AI 進展與打造 AI 生態系的合作夥伴。" } },
      { date: "Jun 1–4",
        title: { en: "GTC Taipei Sessions · TICC", zh: "GTC Taipei 技術議程 · TICC" },
        body:  { en: "Keynotes, technical sessions, demos and ecosystem meetups on physical AI, AI factories, agentic systems and inference.",
                 zh: "在台北國際會議中心(TICC)登場的主題演講、技術議程、展示與生態系交流,涵蓋實體 AI、AI 工廠、代理式系統與推論。" } },
      { date: "Jun 2",
        title: { en: "COMPUTEX Opens · Forum", zh: "COMPUTEX 開展 · 主題論壇" },
        body:  { en: "The exhibition opens across all venues. The expanded COMPUTEX Keynote & Forum convenes industry leaders at 7F, TaiNEX 2 (paid registration).",
                 zh: "展覽於各場館開幕。擴大舉辦的 COMPUTEX 主題演講與論壇於南港二館 7 樓集結產業領袖(需付費報名)。" } },
      { date: "Jun 2–5",
        title: { en: "Exhibition & Highlight Zones", zh: "主題展區與亮點專區" },
        body:  { en: "1,500 exhibitors across TaiNEX 1 & 2 and TWTC Hall 1 — including the new Robotics Zone and TechXperience Zone.",
                 zh: "1,500 家參展商分布於南港一館、二館與世貿一館 —— 含全新的機器人專區與 TechXperience 體驗專區。" } },
      { date: "Jun 2–5",
        title: { en: "InnoVEX · Startup Pavilion", zh: "InnoVEX · 新創展區" },
        body:  { en: "Global startups at TaiNEX 2, with Meet-a-VC matchmaking (800+ investors), buyer networking and pitch contests.",
                 zh: "全球新創匯聚南港二館,搭配 Meet-a-VC 投資媒合(逾 800 位投資人)、買主交流與新創競賽。" } },
      { date: "Jun 5",
        title: { en: "Final Day", zh: "展會最後一天" },
        body:  { en: "Closing day of the four-day show — last chance for sourcing meetings and guided tours.",
                 zh: "為期四天展會的最後一天 —— 採購洽談與導覽行程的最後機會。" } }
    ]
  },

  /* ---------------------------------------------------------------- BARS */
  {
    type: "bars",
    id: "scale",
    title:    { en: "Scaling Up · 2025 → 2026", zh: "規模躍升 · 2025 → 2026" },
    subtitle: { en: "Exhibitors and booths both grow in 2026 (2025 actuals vs 2026 plan). Source: COMPUTEX.",
                zh: "2026 年參展商與攤位數雙雙成長(2025 實績 vs 2026 規劃)。資料來源:COMPUTEX。" },
    series: [
      { label: { en: "Exhibitors '25", zh: "參展商 '25" }, value: 1400 },
      { label: { en: "Exhibitors '26", zh: "參展商 '26" }, value: 1500 },
      { label: { en: "Booths '25", zh: "攤位 '25" },       value: 4800 },
      { label: { en: "Booths '26", zh: "攤位 '26" },       value: 6000 }
    ]
  },

  /* ----------------------------------------------------------- ACCORDION */
  {
    type: "accordion",
    id: "visit",
    title:    { en: "Visitor FAQ", zh: "參觀常見問題" },
    subtitle: { en: "Dates, venues, registration and the programs you can join.",
                zh: "展期、場館、報名,以及你可以參加的活動。" },
    qa: [
      { q: { en: "When and where is COMPUTEX 2026?",
             zh: "COMPUTEX 2026 何時、在哪裡舉辦?" },
        a: { en: "June 2–5, 2026 in Taipei, across four venues: Taipei Nangang Exhibition Center Hall 1 & 2 (TaiNEX 1 & 2), TWTC Hall 1, and the Taipei International Convention Center (TICC).",
             zh: "2026 年 6 月 2 日至 5 日於台北舉行,橫跨四個場館:台北南港展覽館一館、二館(TaiNEX 1 & 2)、台北世貿一館(TWTC Hall 1),以及台北國際會議中心(TICC)。" } },
      { q: { en: "How do I register or buy a ticket?",
             zh: "我要如何報名或購票?" },
        a: { en: "Visitor pre-registration is available online via the official COMPUTEX registration site. Pre-registering ahead of the show is the fastest way to get your badge and skip on-site queues.",
             zh: "可透過 COMPUTEX 官方報名網站進行線上預先登記。展前預先登記是最快取得識別證、免去現場排隊的方式。" } },
      { q: { en: "What are the three core themes?",
             zh: "三大核心主軸是什麼?" },
        a: { en: "AI & Computing, Robotics & Mobility, and Next-Gen Tech. Together they trace the AI stack from silicon and servers, through robots and smart mobility, out to 6G, edge, quantum, security and sustainability.",
             zh: "AI 與運算、機器人與智慧移動、次世代科技。三者串起完整的 AI 技術鏈:從晶片與伺服器,到機器人與智慧移動,再延伸到 6G、邊緣運算、量子、資安與永續。" } },
      { q: { en: "What's new at the show this year?",
             zh: "今年展會有什麼新看點?" },
        a: { en: "Two new highlight zones debut at TWTC Hall 1 — the Robotics Zone and the TechXperience Zone — showing how robotics and physical AI are expanding into healthcare, logistics, retail and daily life.",
             zh: "世貿一館推出兩個全新亮點專區 —— 機器人專區與 TechXperience 體驗專區 —— 呈現機器人與實體 AI 如何擴展到醫療、物流、零售與日常生活。" } },
      { q: { en: "What is InnoVEX?",
             zh: "InnoVEX 是什麼?" },
        a: { en: "InnoVEX is COMPUTEX's dedicated startup pavilion at TaiNEX 2. It connects early-stage companies with investors through the Meet-a-VC program (800+ investors), plus global buyer networking events and startup pitch contests.",
             zh: "InnoVEX 是 COMPUTEX 於南港二館的專屬新創展區,透過 Meet-a-VC 計畫(逾 800 位投資人)媒合早期新創與投資人,並舉辦全球買主交流與新創競賽。" } },
      { q: { en: "Is the COMPUTEX Forum free?",
             zh: "COMPUTEX Forum 論壇免費嗎?" },
        a: { en: "The COMPUTEX Keynote & Forum executive sessions (7F, TaiNEX 2) require paid registration. The main exhibition halls are accessed with a visitor badge.",
             zh: "COMPUTEX 主題演講與論壇的高峰會議(南港二館 7 樓)需付費報名。主要展館則以參觀識別證入場。" } },
      { q: { en: "How can I join NVIDIA GTC Taipei?",
             zh: "我要怎麼參加 NVIDIA GTC Taipei?" },
        a: { en: "NVIDIA hosts GTC Taipei alongside COMPUTEX (keynote on June 1; sessions June 1–4 at TICC). Registration and the session catalog are on NVIDIA's GTC Taipei site.",
             zh: "NVIDIA 於 COMPUTEX 期間舉辦 GTC Taipei(6 月 1 日主題演講;6 月 1–4 日於 TICC 進行議程)。報名與議程目錄請見 NVIDIA GTC Taipei 官網。" } }
    ]
  },

  /* --------------------------------------------------------------- PROSE */
  {
    type: "prose",
    id: "about",
    title:    { en: "About COMPUTEX", zh: "關於 COMPUTEX" },
    subtitle: { en: "Asia's premier ICT and AI tradeshow, and a global meeting point for the technology industry.",
                zh: "亞洲指標性的 ICT 與 AI 專業展,也是全球科技產業的交會點。" },
    blocks: [
      { type: "p",
        text: { en: "Founded in 1981, COMPUTEX Taipei has grown into one of the world's largest and most influential information and communications technology (ICT) shows. It is co-organized by TAITRA (Taiwan External Trade Development Council) and TCA (Taipei Computer Association).",
                zh: "COMPUTEX 台北國際電腦展創辦於 1981 年,如今已成為全球規模最大、最具影響力的資通訊(ICT)展會之一,由外貿協會(TAITRA)與台北市電腦公會(TCA)共同主辦。" } },
      { type: "h3",
        text: { en: "Why it matters", zh: "為什麼重要" } },
      { type: "ul",
        items: {
          en: ["A platform where the global AI ecosystem — chipmakers, system builders, startups and buyers — meets in one place",
               "Home to NVIDIA GTC Taipei and the InnoVEX startup pavilion under one show week",
               "A bellwether for where AI computing, robotics and connectivity are heading next"],
          zh: ["全球 AI 生態系(晶片商、系統廠、新創與買主)齊聚一堂的平台",
               "同一展會週內涵蓋 NVIDIA GTC Taipei 與 InnoVEX 新創展區",
               "觀察 AI 運算、機器人與連網技術下一步走向的風向球"]
        } },
      { type: "h3",
        text: { en: "By the numbers (2025)", zh: "數字回顧(2025)" } },
      { type: "p",
        text: { en: "The 2025 edition drew a record 86,521 visitors from 152 countries, with roughly 1,400 exhibitors filling about 4,800 booths across 80,000 m² — the momentum COMPUTEX 2026 builds on.",
                zh: "2025 年展會吸引創紀錄的 86,521 名來自 152 國的訪客,約 1,400 家參展商於 80,000 平方公尺的場地設置約 4,800 個攤位 —— 這正是 COMPUTEX 2026 接續放大的動能。" } }
    ]
  },

  /* ----------------------------------------------------------------- CTA */
  {
    type: "cta",
    id: "register",
    title: { en: "Join AI Together", zh: "一起加入 AI Together" },
    text:  { en: "Pre-register, plan your visit, and explore the full exhibitor list and program on the official COMPUTEX site.",
             zh: "上 COMPUTEX 官方網站完成預先登記、規劃行程,並瀏覽完整的參展商名單與活動議程。" },
    link:  { label: { en: "Visit the official site", zh: "前往官方網站" },
             url: "https://www.computextaipei.com.tw/" }
  }
];
