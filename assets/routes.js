/* =========================================================================
   routes.js — Medical-AI visiting routes.
   A route = a focus (both/cpx/inx) + a set of sub-categories. Presets just
   pre-fill those; the builder lets you make any combination. The itinerary is
   generated live from window.MED, grouped by show and ordered by venue so it's
   actually walkable. Clicking a stop opens its multi-faceted profile.
   ========================================================================= */
window.Routes = (function () {
  "use strict";
  var t = Core.t, esc = Core.escapeHtml;
  var MED, ROUTES, tax, taxById = {};
  var focus = "both", picked = {};   // picked = set of subcat ids
  var els = {};

  window.__logoFail = window.__logoFail || function (img, init) {
    var b = img.parentNode; b.classList.add("is-empty"); b.innerHTML = '<span class="ph">' + esc(init) + "</span>";
  };
  function logo(name, url) {
    var i = (name || "?").trim().charAt(0).toUpperCase();
    if (!url) return '<span class="ph">' + esc(i) + "</span>";
    return '<img loading="lazy" alt="" src="' + esc(url) + '" onerror="__logoFail(this,&quot;' + esc(i) + '&quot;)">';
  }

  function init() {
    MED = window.MED || { cpx: [], inx: [], taxonomy: [] };
    ROUTES = window.ROUTES || [];
    tax = MED.taxonomy || [];
    tax.forEach(function (c) { taxById[c.id] = c; });
    els = {
      presets: document.getElementById("presets"),
      seg: document.getElementById("focusSeg"),
      chips: document.getElementById("subChips"),
      summary: document.getElementById("routeSummary"),
      list: document.getElementById("routeList"),
      dialog: document.getElementById("dialog"),
      dbody: document.getElementById("dialogBody")
    };
    paintPresets();
    paintControls();
    render();
    wireDialog();
    Core.onLang(function () { paintPresets(); paintControls(); render(); });
  }

  /* ---------- presets ---------- */
  function paintPresets() {
    if (!els.presets) return;
    els.presets.innerHTML = ROUTES.map(function (r, i) {
      var foc = r.focus === "cpx" ? "COMPUTEX" : r.focus === "inx" ? "InnoVEX" : (t({ zh: "兩展", en: "Both" }));
      return '<article class="route-card" tabindex="0" role="button" data-r="' + i + '" data-item>' +
        '<div class="route-card__ico">' + r.icon + "</div>" +
        '<h3 class="route-card__name">' + esc(t(r.name)) + "</h3>" +
        '<p class="route-card__desc">' + esc(t(r.desc)) + "</p>" +
        '<div class="route-card__foot"><span class="minitag minitag--zone">' + esc(foc) + "</span>" +
          '<span class="route-card__tip">' + esc(t(r.tip)) + "</span></div>" +
      "</article>";
    }).join("");
    function apply(i) {
      var r = ROUTES[i];
      focus = r.focus; picked = {};
      (r.subcats || []).forEach(function (s) { picked[s] = true; });
      paintControls(); render();
      if (els.summary && els.summary.scrollIntoView)
        els.summary.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    [].forEach.call(els.presets.querySelectorAll(".route-card"), function (c) {
      c.addEventListener("click", function () { apply(+c.dataset.r); });
      c.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); apply(+c.dataset.r); }
      });
    });
  }

  /* ---------- builder controls ---------- */
  function paintControls() {
    if (els.seg) {
      var opts = [["both", { zh: "兩展", en: "Both" }], ["cpx", { zh: "COMPUTEX 為主", en: "COMPUTEX" }], ["inx", { zh: "InnoVEX 為主", en: "InnoVEX" }]];
      els.seg.innerHTML = opts.map(function (o) {
        return '<button class="seg__btn' + (focus === o[0] ? " is-active" : "") + '" data-f="' + o[0] + '" type="button">' + esc(t(o[1])) + "</button>";
      }).join("");
      [].forEach.call(els.seg.querySelectorAll(".seg__btn"), function (b) {
        b.addEventListener("click", function () { focus = b.dataset.f; paintControls(); render(); });
      });
    }
    if (els.chips) {
      var all = '<button class="catpill' + (Object.keys(picked).length === 0 ? " is-active" : "") + '" data-s="" type="button">' +
        '<span class="material-symbols-rounded">apps</span><span class="i18n-zh">全部次分類</span><span class="i18n-en">All</span></button>';
      var chips = tax.map(function (c) {
        return '<button class="catpill' + (picked[c.id] ? " is-active" : "") + '" data-s="' + esc(c.id) + '" type="button">' +
          '<span class="catpill__ico">' + c.icon + "</span><span>" + esc(t(c.name)) + "</span></button>";
      }).join("");
      els.chips.innerHTML = all + chips;
      [].forEach.call(els.chips.querySelectorAll(".catpill"), function (b) {
        b.addEventListener("click", function () {
          var s = b.dataset.s;
          if (!s) picked = {};
          else if (picked[s]) delete picked[s];
          else picked[s] = true;
          paintControls(); render();
        });
      });
    }
  }

  /* ---------- itinerary ---------- */
  function pool() {
    var arr = [];
    if (focus !== "inx") arr = arr.concat(MED.cpx.map(function (x) { return Object.assign({ show: "cpx" }, x); }));
    if (focus !== "cpx") arr = arr.concat(MED.inx.map(function (x) { return Object.assign({ show: "inx" }, x); }));
    var keys = Object.keys(picked);
    if (keys.length) {
      arr = arr.filter(function (it) {
        return it.subcats.some(function (s) { return picked[s]; });
      });
    }
    return arr;
  }

  // 排序用:同館 -> 同樓 -> 同攤位區相鄰,實際動線才順
  function venueSortKey(it) {
    var V = Core.venue(it);
    if (!V) return "~";   // 無位置者排最後
    return (V.code || "") + "|" + (V.floor || "") + "|" + (it.b || "");
  }
  // 顯示用:短館名 + 樓層(無實體展館時退回展區/主題館)
  function venueLabel(it) {
    var V = Core.venue(it);
    if (V) return t(V.short);
    return it.show === "cpx" ? (it.zone || "—") : (it.pavilion || t({ zh: "InnoVEX 區", en: "InnoVEX" }));
  }

  function render() {
    var list = pool();
    var cpxN = list.filter(function (x) { return x.show === "cpx"; }).length;
    var inxN = list.length - cpxN;

    if (els.summary) {
      els.summary.innerHTML = '<span class="route-summary__n">' + list.length + "</span>" +
        '<span class="route-summary__lbl"><span class="i18n-zh">站 · 推薦停留</span><span class="i18n-en">stops on this route</span></span>' +
        '<span class="route-summary__split">COMPUTEX ' + cpxN + " · InnoVEX " + inxN + "</span>";
    }
    if (!els.list) return;
    if (!list.length) {
      els.list.innerHTML = '<div class="exh-empty"><span class="material-symbols-rounded">explore_off</span>' +
        '<span class="i18n-zh">這個組合目前沒有對應廠商,換個次分類試試。</span>' +
        '<span class="i18n-en">No exhibitors for this combination — try other sub-categories.</span></div>';
      return;
    }

    var groups = [];
    if (focus !== "inx" && cpxN) groups.push(["COMPUTEX", list.filter(function (x) { return x.show === "cpx"; })]);
    if (focus !== "cpx" && inxN) groups.push(["InnoVEX", list.filter(function (x) { return x.show === "inx"; })]);

    var refs = [];
    var html = groups.map(function (g) {
      var label = g[0], items = g[1];
      items.sort(function (a, b) { return venueSortKey(a).localeCompare(venueSortKey(b)) || a.ne.localeCompare(b.ne); });
      var stops = items.map(function (it) {
        var idx = refs.push(it) - 1;
        var tags = it.subcats.map(function (s) {
          var c = taxById[s]; return c ? '<span class="subcat-tag">' + c.icon + " " + esc(t(c.name)) + "</span>" : "";
        }).join("");
        var hl = it.profile && it.profile.highlight ? t(it.profile.highlight) : "";
        return '<button class="route-stop" data-ref="' + idx + '" type="button" data-item>' +
          '<span class="route-stop__logo' + (it.logo ? "" : " is-empty") + '">' + logo(it.ne, it.logo) + "</span>" +
          '<span class="route-stop__main">' +
            '<span class="route-stop__name">' + esc(t({ zh: it.nz, en: it.ne })) + "</span>" +
            (hl ? '<span class="route-stop__hl">' + esc(hl) + "</span>" : "") +
            '<span class="route-stop__tags">' + tags + "</span>" +
          "</span>" +
          '<span class="route-stop__venue"><span class="route-stop__hall">' + esc(venueLabel(it)) + "</span>" +
            (it.b ? '<span class="route-stop__booth">' + esc(it.b) + "</span>" : "") + "</span>" +
        "</button>";
      }).join("");
      return '<div class="route-group"><div class="route-group__h">' +
        '<span class="route-group__badge">' + label + "</span>" +
        '<span class="route-group__n">' + items.length + '<span class="i18n-zh"> 站</span><span class="i18n-en"> stops</span></span>' +
        "</div>" + stops + "</div>";
    }).join("");
    els.list.innerHTML = html;
    [].forEach.call(els.list.querySelectorAll(".route-stop"), function (b) {
      b.addEventListener("click", function () { openDialog(refs[+b.dataset.ref]); });
    });
    Core.setupReveal(els.list);
  }

  /* ---------- profile dialog (shared shape with medical.js) ---------- */
  function sect(icon, label, val) {
    if (!val) return "";
    return '<div class="prof-sect"><div class="prof-sect__h"><span class="material-symbols-rounded">' + icon + "</span>" + label + "</div><p>" + esc(val) + "</p></div>";
  }
  function openDialog(it) {
    if (!it) return;
    var p = it.profile || {};
    var tags = it.subcats.map(function (s) { var c = taxById[s]; return c ? '<span class="subcat-tag">' + c.icon + " " + esc(t(c.name)) + "</span>" : ""; }).join("");
    var V = Core.venue(it);
    var showName = it.show === "cpx" ? "COMPUTEX" : "InnoVEX";
    var vtxt = V ? esc(t(V.full)) + (it.b ? " · " + t({ zh: "攤位 ", en: "Booth " }) + esc(it.b) : "")
                 : esc(venueLabel(it));
    var fp = Core.floorplan(it.show);
    var plan = fp ? ' <a class="med-loc__plan" href="' + esc(fp) + '" target="_blank" rel="noopener">' +
      t({ zh: "平面圖", en: "Floor plan" }) + '<span class="material-symbols-rounded">open_in_new</span></a>' : "";
    var venueRow = '<div class="exh-row"><span class="exh-row__k">' + t({ zh: "位置", en: "Where" }) +
      '</span><span class="exh-row__v">' + showName + " · " + vtxt + plan + "</span></div>";
    els.dbody.innerHTML =
      '<div class="exh-dlg__head"><span class="exh-dlg__logo' + (it.logo ? "" : " is-empty") + '">' + logo(it.ne, it.logo) + "</span>" +
        '<div><h2 id="dialogTitle" class="exh-dlg__title">' + esc(t({ zh: it.nz, en: it.ne })) + "</h2>" +
        (it.nz !== it.ne ? '<p class="exh-dlg__sub">' + esc(t({ zh: it.ne, en: it.nz })) + "</p>" : "") + "</div></div>" +
      '<div class="subcat-row">' + tags + "</div>" +
      '<div class="prof">' +
        sect("info", t({ zh: "公司簡介", en: "About" }), p.summary ? t(p.summary) : "") +
        sect("medical_services", t({ zh: "醫療 AI 切入點", en: "Medical-AI angle" }), p.angle ? t(p.angle) : "") +
        sect("memory", t({ zh: "技術與產品", en: "Tech & products" }), p.tech ? t(p.tech) : "") +
        sect("stethoscope", t({ zh: "應用場景", en: "Use cases" }), p.usecase ? t(p.usecase) : "") +
      "</div><div class=\"exh-dlg__rows\">" + venueRow + "</div>" +
      (it.url ? '<a class="cta-btn" style="font-size:.95rem" href="' + esc(it.url) + '" target="_blank" rel="noopener">' +
        '<span class="i18n-zh">官方廠商頁面</span><span class="i18n-en">Official page</span><span class="material-symbols-rounded">open_in_new</span></a>' : "");
    if (!els.dialog.open) els.dialog.showModal();
  }
  function wireDialog() {
    var c = document.getElementById("dialogClose");
    if (c) c.addEventListener("click", function () { els.dialog.close(); });
    els.dialog.addEventListener("click", function (e) { if (e.target === els.dialog) els.dialog.close(); });
  }

  return { init: init };
})();
