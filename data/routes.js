/* =========================================================================
   醫療 AI 推薦參觀路線 — 預設組合。
   每條路線只是「焦點(show) + 次分類(subcats)」的組合;routes.js 會即時從
   醫療資料(window.MED)挑出符合的廠商,依場館/攤位排出可走的動線。
   使用者也能用 builder 自由組合,故實際組合遠超下列預設。
   focus: "both" | "cpx" | "inx"   subcats: [] = 全部次分類
   ========================================================================= */
window.ROUTES = [
  { id: "imaging", icon: "🩻", focus: "both", subcats: ["medical-imaging"],
    name: { en: "Medical Imaging Trail", zh: "醫療影像 AI 路線" },
    desc: { en: "Radiology, pathology and endoscopy AI across both shows.", zh: "橫跨兩展的放射、病理、內視鏡影像 AI。" },
    tip:  { en: "Best for radiologists & imaging vendors.", zh: "適合放射科與影像廠商。" } },

  { id: "voice-text", icon: "🗣️", focus: "both", subcats: ["voice-speech", "clinical-nlp"],
    name: { en: "Clinical Voice & Text", zh: "臨床語音與文字路線" },
    desc: { en: "Speech transcription, medical LLMs and report generation.", zh: "語音轉錄、醫療 LLM 與報告生成。" },
    tip:  { en: "For documentation-burden & scribe solutions.", zh: "聚焦病歷負擔與 AI 書寫助理。" } },

  { id: "records-systems", icon: "🏥", focus: "both", subcats: ["emr-ehr", "clinical-systems"],
    name: { en: "EMR & Clinical Systems", zh: "電子病歷與臨床系統路線" },
    desc: { en: "Record platforms, CDSS, HIS and workflow tools.", zh: "病歷平台、CDSS、醫院資訊系統與流程工具。" },
    tip:  { en: "For CIOs & hospital IT.", zh: "適合醫院資訊長與 IT。" } },

  { id: "devices", icon: "🩺", focus: "both", subcats: ["medical-devices"],
    name: { en: "Smart Devices & Sensing", zh: "智慧醫材與感測路線" },
    desc: { en: "Wearables, biosensors, IVD and point-of-care.", zh: "穿戴、生理感測、IVD 與定點檢測。" },
    tip:  { en: "Lots of hardware demos to try on-site.", zh: "現場有大量硬體可實際體驗。" } },

  { id: "drug-bio", icon: "🧬", focus: "both", subcats: ["drug-biotech"],
    name: { en: "Drug Discovery & Biotech", zh: "藥物與生技路線" },
    desc: { en: "AI drug discovery, genomics and precision medicine.", zh: "AI 藥物發現、基因體與精準醫療。" },
    tip:  { en: "Deep science; allow time per booth.", zh: "科學含量高,每攤多留點時間。" } },

  { id: "digital", icon: "📲", focus: "both", subcats: ["digital-health"],
    name: { en: "Digital Health & Telecare", zh: "遠距與健康管理路線" },
    desc: { en: "Telemedicine, monitoring, chronic & elderly care.", zh: "遠距醫療、健康監測、慢病與長照。" },
    tip:  { en: "Strong startup presence at InnoVEX.", zh: "InnoVEX 新創在此特別多。" } },

  { id: "robotics", icon: "🦾", focus: "both", subcats: ["surgical-robotics"],
    name: { en: "Surgical & Rehab Robotics", zh: "手術與復健機器人路線" },
    desc: { en: "Surgical navigation, rehab robots, exoskeletons.", zh: "手術導航、復健機器人、外骨骼。" },
    tip:  { en: "Pair with the COMPUTEX Robotics zone.", zh: "可搭配 COMPUTEX 機器人專區。" } },

  { id: "compute", icon: "⚙️", focus: "both", subcats: ["medical-compute"],
    name: { en: "Medical-AI Compute & Privacy", zh: "醫療 AI 算力與隱私路線" },
    desc: { en: "Edge inference, federated learning, privacy & security.", zh: "邊緣推論、聯邦學習、隱私與資安。" },
    tip:  { en: "Infra layer behind clinical AI.", zh: "臨床 AI 背後的基礎設施層。" } },

  { id: "clinic-deploy", icon: "🎯", focus: "both", subcats: ["clinical-systems", "emr-ehr", "medical-imaging"],
    name: { en: "Clinical Deployment Express", zh: "臨床落地半日精華" },
    desc: { en: "The fastest path to deployable hospital AI: systems + records + imaging.", zh: "最快看到可落地醫院 AI:系統 + 病歷 + 影像。" },
    tip:  { en: "Half-day, decision-maker friendly.", zh: "半日行程,適合決策者。" } },

  { id: "care-wear", icon: "💗", focus: "both", subcats: ["digital-health", "medical-devices"],
    name: { en: "Care & Wearables", zh: "照護與穿戴路線" },
    desc: { en: "Where consumer health meets clinical-grade sensing.", zh: "消費健康與臨床級感測的交會。" },
    tip:  { en: "Great for product & partnership scouting.", zh: "適合產品與合作探索。" } },

  { id: "inx-first", icon: "🚀", focus: "inx", subcats: [],
    name: { en: "InnoVEX-First (All Medical)", zh: "以 InnoVEX 為主(全醫療)" },
    desc: { en: "Every medical-AI startup at InnoVEX, across all 10 sub-categories.", zh: "InnoVEX 全部醫療 AI 新創,涵蓋 10 類次分類。" },
    tip:  { en: "For investors & early-stage scouting.", zh: "適合投資人與早期探勘。" } },

  { id: "cpx-first", icon: "🏢", focus: "cpx", subcats: [],
    name: { en: "COMPUTEX-First (All Medical)", zh: "以 COMPUTEX 為主(全醫療)" },
    desc: { en: "Medical-AI players on the main COMPUTEX floor.", zh: "COMPUTEX 主展場上的醫療 AI 廠商。" },
    tip:  { en: "For supply-chain & enterprise buyers.", zh: "適合供應鏈與企業採購。" } },

  { id: "everything", icon: "🗺️", focus: "both", subcats: [],
    name: { en: "Full Medical-AI Sweep", zh: "COMPUTEX + InnoVEX 全覽" },
    desc: { en: "Every medical-AI exhibitor across both shows — the complete map.", zh: "兩展全部醫療 AI 廠商 —— 完整地圖。" },
    tip:  { en: "Full day; use sub-category chips to narrow.", zh: "全日行程,可用次分類晶片收斂。" } },

  { id: "investor-pick", icon: "💎", focus: "inx", subcats: ["drug-biotech", "medical-imaging", "digital-health"],
    name: { en: "Investor's Shortlist", zh: "投資人視角:新創亮點" },
    desc: { en: "High-interest InnoVEX startups in biotech, imaging and digital health.", zh: "生技、影像、數位健康中高關注度的 InnoVEX 新創。" },
    tip:  { en: "Curated for deal-flow.", zh: "為 deal-flow 精選。" } }
];
