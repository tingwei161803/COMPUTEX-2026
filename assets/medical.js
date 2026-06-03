/* =========================================================================
   medical.js — renderer for the two Medical-AI deep pages.
   Companies have MULTI-membership across the 10 sub-categories, so filtering
   is "belongs-to category" (not single-value). Each card opens a dialog with
   the multi-faceted bilingual profile (summary / angle / tech / use-case).
   ========================================================================= */
window.Medical = (function () {
  "use strict";
  var t = Core.t, esc = Core.escapeHtml;
  var kind, items, tax, taxById = {}, activeCat = "", q = "";
  var els = {};

  var COUNTRY = { TW:{zh:"台灣",en:"Taiwan"}, JP:{zh:"日本",en:"Japan"}, US:{zh:"美國",en:"USA"},
    KR:{zh:"韓國",en:"Korea"}, CN:{zh:"中國",en:"China"}, HK:{zh:"香港",en:"Hong Kong"},
    SG:{zh:"新加坡",en:"Singapore"}, FR:{zh:"法國",en:"France"}, DE:{zh:"德國",en:"Germany"},
    IL:{zh:"以色列",en:"Israel"}, CA:{zh:"加拿大",en:"Canada"}, GB:{zh:"英國",en:"UK"},
    IT:{zh:"義大利",en:"Italy"}, NL:{zh:"荷蘭",en:"Netherlands"}, IN:{zh:"印度",en:"India"} };
  function cname(c) { return COUNTRY[c] ? t(COUNTRY[c]) : (c || ""); }

  // 實體展館代碼 -> 雙語名稱(短名給卡片、全名給詳情)
  var VENUE = {
    T1:   { zh: "南港展覽館 1 館", en: "TaiNEX Hall 1",     sz: "南港 1 館", se: "Hall 1" },
    T2:   { zh: "南港展覽館 2 館", en: "TaiNEX Hall 2",     sz: "南港 2 館", se: "Hall 2" },
    TWTC: { zh: "台北世貿中心 1 館", en: "Taipei WTC Hall 1", sz: "世貿 1 館", se: "TWTC" }
  };
  // 各展官方會場平面圖
  var FLOORPLAN = {
    cpx: "https://booth.e-taitra.com.tw/map/v2/zh-TW/2026CP/h/19?cad=0",
    inx: "https://innovex.computex.biz/show/floorplan.aspx"
  };
  // 卡片位置小標:📍 短館名 · 攤位
  function venueChip(it) {
    var V = VENUE[it.v];
    if (!V) return "";
    var booth = it.b ? '<span class="med-loc__booth">' + esc(it.b) + "</span>" : "";
    return '<div class="med-card__loc"><span class="material-symbols-rounded">location_on</span>' +
      "<span>" + esc(t({ zh: V.sz, en: V.se })) + "</span>" + booth + "</div>";
  }
  // 詳情展館列:全名 · 攤位 + 會場平面圖連結
  function venueRowHtml(it) {
    var V = VENUE[it.v];
    if (!V) return "";
    var txt = esc(t({ zh: V.zh, en: V.en }));
    if (it.b) txt += " · " + t({ zh: "攤位 ", en: "Booth " }) + esc(it.b);
    var fp = FLOORPLAN[kind];
    var plan = fp ? ' <a class="med-loc__plan" href="' + esc(fp) + '" target="_blank" rel="noopener">' +
      t({ zh: "平面圖", en: "Floor plan" }) + '<span class="material-symbols-rounded">open_in_new</span></a>' : "";
    return txt + plan;
  }

  window.__logoFail = window.__logoFail || function (img, init) {
    var b = img.parentNode; b.classList.add("is-empty"); b.innerHTML = '<span class="ph">' + esc(init) + "</span>";
  };
  function logo(name, url) {
    var i = (name || "?").trim().charAt(0).toUpperCase();
    if (!url) return '<span class="ph">' + esc(i) + "</span>";
    return '<img loading="lazy" alt="" src="' + esc(url) + '" onerror="__logoFail(this,&quot;' + esc(i) + '&quot;)">';
  }

  function catCount(id) {
    var n = 0;
    items.forEach(function (it) { if (it.subcats.indexOf(id) !== -1) n++; });
    return n;
  }

  function init(config) {
    kind = config.kind;
    items = (window.MED && window.MED[kind]) || [];
    tax = (window.MED && window.MED.taxonomy) || [];
    tax.forEach(function (c) { taxById[c.id] = c; });
    els = {
      cat: document.getElementById("catbar"),
      grid: document.getElementById("exhGrid"),
      count: document.getElementById("filterCount"),
      total: document.getElementById("pageCount"),
      q: document.getElementById("q"),
      dialog: document.getElementById("dialog"),
      dbody: document.getElementById("dialogBody")
    };
    if (els.total) els.total.textContent = items.length;
    paintCats();
    wireSearch();
    render();
    wireDialog();
    Core.onLang(function () { paintCats(); render(); });
  }

  function paintCats() {
    if (!els.cat) return;
    var all = '<button class="catpill' + (activeCat === "" ? " is-active" : "") + '" data-cat="" type="button">' +
      '<span class="material-symbols-rounded">apps</span>' +
      '<span class="i18n-zh">全部</span><span class="i18n-en">All</span>' +
      '<span class="catpill__n">' + items.length + "</span></button>";
    var pills = tax.map(function (c) {
      var n = catCount(c.id);
      if (!n) return "";
      return '<button class="catpill' + (activeCat === c.id ? " is-active" : "") + '" data-cat="' + esc(c.id) + '" type="button">' +
        '<span class="catpill__ico" aria-hidden="true">' + c.icon + "</span>" +
        "<span>" + esc(t(c.name)) + "</span>" +
        '<span class="catpill__n">' + n + "</span></button>";
    }).join("");
    els.cat.innerHTML = all + pills;
    [].forEach.call(els.cat.querySelectorAll(".catpill"), function (b) {
      b.addEventListener("click", function () { activeCat = b.dataset.cat; paintCats(); render(); });
    });
  }

  function wireSearch() {
    if (!els.q) return;
    els.q.addEventListener("input", function (e) { q = e.target.value.toLowerCase().trim(); render(); });
  }

  function matches(it) {
    if (activeCat && it.subcats.indexOf(activeCat) === -1) return false;
    if (q) {
      var p = it.profile || {};
      var hay = (it.ne + " " + it.nz + " " + (it.industry || "") + " " +
        (p.summary ? p.summary.zh + p.summary.en : "") + " " +
        (p.tech ? p.tech.zh + p.tech.en : "")).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  }

  function subTags(it) {
    return it.subcats.map(function (id) {
      var c = taxById[id];
      if (!c) return "";
      return '<span class="subcat-tag">' + c.icon + " " + esc(t(c.name)) + "</span>";
    }).join("");
  }

  function render() {
    if (!els.grid) return;
    var list = items.filter(matches);
    if (els.count) els.count.innerHTML = "<b>" + list.length + "</b> / " + items.length;
    if (!list.length) {
      els.grid.innerHTML = '<div class="exh-empty"><span class="material-symbols-rounded">search_off</span>' +
        '<span class="i18n-zh">沒有符合的廠商</span><span class="i18n-en">No matches</span></div>';
      return;
    }
    els.grid.innerHTML = list.map(function (it, i) {
      var p = it.profile || {};
      var hl = p.highlight ? t(p.highlight) : "";
      return '<button class="exh-card med-card" data-item data-i="' + i + '" type="button">' +
        '<span class="exh-card__logo' + (it.logo ? "" : " is-empty") + '">' + logo(it.ne, it.logo) + "</span>" +
        '<h3 class="exh-card__name">' + esc(t({ zh: it.nz, en: it.ne })) + "</h3>" +
        venueChip(it) +
        (hl ? '<p class="med-card__hl">' + esc(hl) + "</p>" : "") +
        '<div class="exh-card__meta">' + subTags(it) + "</div>" +
      "</button>";
    }).join("");
    var filtered = list;
    [].forEach.call(els.grid.querySelectorAll(".med-card"), function (c) {
      c.addEventListener("click", function () { openDialog(filtered[+c.dataset.i]); });
    });
    Core.setupReveal(els.grid);
  }

  function sect(icon, label, val) {
    if (!val) return "";
    return '<div class="prof-sect"><div class="prof-sect__h"><span class="material-symbols-rounded">' + icon + "</span>" + label + "</div>" +
      '<p>' + esc(val) + "</p></div>";
  }
  function row(k, v) {
    return v ? '<div class="exh-row"><span class="exh-row__k">' + k + '</span><span class="exh-row__v">' + v + "</span></div>" : "";
  }

  function openDialog(it) {
    if (!it) return;
    var p = it.profile || {};
    var meta = row(t({ zh: "國家", en: "Country" }), esc(cname(it.c)));
    var vrow = venueRowHtml(it);
    if (vrow) meta += row(t({ zh: "展館", en: "Venue" }), vrow);
    if (kind === "cpx") meta += row(t({ zh: "展區", en: "Zone" }), esc(it.zone || "—"));
    else meta += row(t({ zh: "產業", en: "Industry" }), esc(it.industry || "—")) +
      row(t({ zh: "類型", en: "Type" }), esc(it.type || "")) +
      row(t({ zh: "館別", en: "Pavilion" }), esc(it.pavilion || "—"));

    els.dbody.innerHTML =
      '<div class="exh-dlg__head">' +
        '<span class="exh-dlg__logo' + (it.logo ? "" : " is-empty") + '">' + logo(it.ne, it.logo) + "</span>" +
        '<div><h2 id="dialogTitle" class="exh-dlg__title">' + esc(t({ zh: it.nz, en: it.ne })) + "</h2>" +
          (it.nz !== it.ne ? '<p class="exh-dlg__sub">' + esc(t({ zh: it.ne, en: it.nz })) + "</p>" : "") +
        "</div></div>" +
      '<div class="subcat-row">' + subTags(it) + "</div>" +
      '<div class="prof">' +
        sect("info", t({ zh: "公司簡介", en: "About" }), p.summary ? t(p.summary) : "") +
        sect("medical_services", t({ zh: "醫療 AI 切入點", en: "Medical-AI angle" }), p.angle ? t(p.angle) : "") +
        sect("memory", t({ zh: "技術與產品", en: "Tech & products" }), p.tech ? t(p.tech) : "") +
        sect("stethoscope", t({ zh: "應用場景", en: "Use cases" }), p.usecase ? t(p.usecase) : "") +
      "</div>" +
      '<div class="exh-dlg__rows">' + meta + "</div>" +
      (it.url ? '<a class="cta-btn" style="font-size:.95rem" href="' + esc(it.url) + '" target="_blank" rel="noopener">' +
        '<span class="i18n-zh">官方廠商頁面</span><span class="i18n-en">Official page</span>' +
        '<span class="material-symbols-rounded">open_in_new</span></a>' : "");
    if (!els.dialog.open) els.dialog.showModal();
  }
  function wireDialog() {
    var c = document.getElementById("dialogClose");
    if (c) c.addEventListener("click", function () { els.dialog.close(); });
    els.dialog.addEventListener("click", function (e) { if (e.target === els.dialog) els.dialog.close(); });
  }

  return { init: init };
})();
