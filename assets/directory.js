/* =========================================================================
   directory.js — one engine, both exhibitor directories.
   A page calls Directory.init(config) describing which dataset + facets to
   use. Filtering runs in-memory over the full array; rendering is capped at
   PAGE_SIZE with a "load more" button so 1,473 COMPUTEX cards stay smooth.
   All interpolated exhibitor data is passed through Core.escapeHtml().
   ========================================================================= */
window.Directory = (function () {
  "use strict";
  var t = Core.t, esc = Core.escapeHtml;
  var PAGE_SIZE = 60;

  /* ISO code -> bilingual country name (COMPUTEX uses codes; InnoVEX uses names) */
  var COUNTRY = {
    AE: { zh: "阿聯", en: "UAE" }, AU: { zh: "澳洲", en: "Australia" },
    BE: { zh: "比利時", en: "Belgium" }, CA: { zh: "加拿大", en: "Canada" },
    CH: { zh: "瑞士", en: "Switzerland" }, CN: { zh: "中國", en: "China" },
    CZ: { zh: "捷克", en: "Czechia" }, DE: { zh: "德國", en: "Germany" },
    DK: { zh: "丹麥", en: "Denmark" }, DZ: { zh: "阿爾及利亞", en: "Algeria" },
    EE: { zh: "愛沙尼亞", en: "Estonia" }, ES: { zh: "西班牙", en: "Spain" },
    FR: { zh: "法國", en: "France" }, GB: { zh: "英國", en: "UK" },
    HK: { zh: "香港", en: "Hong Kong" }, IL: { zh: "以色列", en: "Israel" },
    IN: { zh: "印度", en: "India" }, IT: { zh: "義大利", en: "Italy" },
    JP: { zh: "日本", en: "Japan" }, KR: { zh: "韓國", en: "Korea" },
    LV: { zh: "拉脫維亞", en: "Latvia" }, MY: { zh: "馬來西亞", en: "Malaysia" },
    NL: { zh: "荷蘭", en: "Netherlands" }, PL: { zh: "波蘭", en: "Poland" },
    SA: { zh: "沙烏地阿拉伯", en: "Saudi Arabia" }, SE: { zh: "瑞典", en: "Sweden" },
    SG: { zh: "新加坡", en: "Singapore" }, TH: { zh: "泰國", en: "Thailand" },
    TR: { zh: "土耳其", en: "Turkey" }, TW: { zh: "台灣", en: "Taiwan" },
    UM: { zh: "美國", en: "USA" }, US: { zh: "美國", en: "USA" },
    VN: { zh: "越南", en: "Vietnam" }
  };
  function countryName(code) {
    var m = COUNTRY[code];
    return m ? t(m) : (code || "");
  }

  /* logo error fallback -> initial letter */
  window.__logoFail = function (img, init) {
    var box = img.parentNode;
    box.classList.add("is-empty");
    box.innerHTML = '<span class="ph">' + esc(init) + "</span>";
  };
  function logoHtml(name, url) {
    var init = (name || "?").trim().charAt(0).toUpperCase();
    if (!url) return '<span class="ph">' + esc(init) + "</span>";
    return '<img loading="lazy" alt="" src="' + esc(url) + '" ' +
      'onerror="__logoFail(this,&quot;' + esc(init) + '&quot;)">';
  }

  var cfg, items, filtered, shown, els, sel = {}, q = "";

  function init(config) {
    cfg = config;
    items = (config.data && config.data.items) || [];
    els = {
      bar: document.getElementById("filterbar"),
      grid: document.getElementById("exhGrid"),
      more: document.getElementById("loadmoreWrap"),
      count: document.getElementById("filterCount"),
      total: document.getElementById("pageCount"),
      dialog: document.getElementById("dialog"),
      dbody: document.getElementById("dialogBody")
    };
    if (els.total) els.total.textContent = items.length.toLocaleString();
    buildBar();
    apply();
    wireDialog();
    Core.onLang(function () { buildBar(true); render(); });
  }

  function buildBar(keep) {
    if (!els.bar) return;
    var html = '<label class="search">' +
      '<span class="material-symbols-rounded">search</span>' +
      '<input id="q" type="search" autocomplete="off" placeholder="' +
        esc(t({ zh: "搜尋公司 / 產品…", en: "Search company / product…" })) + '" value="' + esc(q) + '">' +
      "</label>";

    cfg.filters.forEach(function (f) {
      var opts = '<option value="">' + esc(t(f.label)) + " · " +
        esc(t({ zh: "全部", en: "All" })) + "</option>";
      f.options.forEach(function (o) {
        var val = o.id != null ? o.id : o.code;
        var lbl = f.optLabel ? f.optLabel(o) : String(val);
        var s = (sel[f.key] === String(val)) ? " selected" : "";
        opts += '<option value="' + esc(val) + '"' + s + ">" + esc(lbl) + " (" + o.n + ")</option>";
      });
      html += '<span class="fsel"><select data-key="' + esc(f.key) + '" ' +
        'aria-label="' + esc(t(f.label)) + '">' + opts + "</select></span>";
    });

    html += '<button class="btn-ghost" id="resetBtn" type="button">' +
      '<span class="material-symbols-rounded">restart_alt</span>' +
      '<span class="i18n-zh">重設</span><span class="i18n-en">Reset</span></button>';
    html += '<span class="filter-count" id="filterCount"></span>';

    els.bar.innerHTML = html;
    els.count = document.getElementById("filterCount");

    document.getElementById("q").addEventListener("input", function (e) {
      q = e.target.value.toLowerCase().trim();
      apply();
    });
    [].forEach.call(els.bar.querySelectorAll("select"), function (s) {
      s.addEventListener("change", function () {
        sel[s.dataset.key] = s.value;
        apply();
      });
    });
    document.getElementById("resetBtn").addEventListener("click", function () {
      sel = {}; q = "";
      buildBar(); apply();
    });
  }

  function apply() {
    filtered = items.filter(function (it) {
      for (var k in sel) {
        if (sel[k] && String(cfg.valueOf(it, k)) !== sel[k]) return false;
      }
      if (q && cfg.search(it).indexOf(q) === -1) return false;
      return true;
    });
    shown = PAGE_SIZE;
    render();
  }

  function render() {
    if (!els.grid) return;
    if (els.count) {
      els.count.innerHTML = "<b>" + filtered.length.toLocaleString() + "</b> / " +
        items.length.toLocaleString();
    }
    if (!filtered.length) {
      els.grid.innerHTML = '<div class="exh-empty">' +
        '<span class="material-symbols-rounded">search_off</span>' +
        '<span class="i18n-zh">找不到符合條件的廠商</span>' +
        '<span class="i18n-en">No exhibitors match your filters</span></div>';
      els.more.innerHTML = "";
      return;
    }
    var slice = filtered.slice(0, shown);
    els.grid.innerHTML = slice.map(function (it, i) { return cfg.card(it, i); }).join("");
    [].forEach.call(els.grid.querySelectorAll(".exh-card"), function (c) {
      c.addEventListener("click", function () { openDialog(filtered[+c.dataset.i]); });
    });
    Core.setupReveal(els.grid);

    if (shown < filtered.length) {
      els.more.innerHTML = '<div class="loadmore-wrap"><button class="loadmore" type="button">' +
        '<span class="material-symbols-rounded">expand_more</span>' +
        '<span class="i18n-zh">載入更多(剩 ' + (filtered.length - shown) + ')</span>' +
        '<span class="i18n-en">Load more (' + (filtered.length - shown) + ' left)</span></button></div>';
      els.more.querySelector(".loadmore").addEventListener("click", function () {
        shown += PAGE_SIZE; render();
      });
    } else {
      els.more.innerHTML = "";
    }
  }

  /* ---------- dialog ---------- */
  function openDialog(it) {
    if (!it) return;
    els.dbody.innerHTML = cfg.dialog(it);
    if (!els.dialog.open) els.dialog.showModal();
  }
  function wireDialog() {
    var close = document.getElementById("dialogClose");
    if (close) close.addEventListener("click", function () { els.dialog.close(); });
    els.dialog.addEventListener("click", function (e) {
      if (e.target === els.dialog) els.dialog.close();
    });
  }

  return {
    init: init, countryName: countryName, logoHtml: logoHtml,
    esc: esc, t: t
  };
})();
