/* =========================================================================
   core.js — shared chrome for every page EXCEPT the composite home.
   Manages theme state (same localStorage key as app.js so the preference
   carries across pages), exposes t()/escapeHtml(), wires the appbar toggles
   and runs scroll-reveal. Language is NOT state: each language has its own
   URL, so a page paints once in the language it declares and never switches
   in place.

   Static chrome (site-nav labels, hard-coded copy) does NOT go through JS:
   it uses paired .i18n-zh / .i18n-en spans toggled by html[lang] in CSS.
   ========================================================================= */
window.Core = (function () {
  "use strict";

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* The URL decides the language: each language version is its own page and
     says so in <html lang>. Never read it back from storage — someone opening
     /en/ must get English even if they once picked 中文 here, and crawlers
     have no storage at all. */
  var pageLang = (document.documentElement.getAttribute("lang") || "en")
    .toLowerCase().indexOf("zh") === 0 ? "zh" : "en";

  var state = {
    lang: pageLang,
    theme: lsGet("theme") || "light"
  };

  function t(obj) {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    return obj[state.lang] || obj.en || obj.zh || "";
  }
  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }
  function $(id) { return document.getElementById(id); }

  /* ---- 展館位置(醫療頁 + 路線頁共用) -------------------------------------
     實體展館 v: T1=南港 1 館 / T2=南港 2 館 / TWTC=台北世貿;攤位號 b。
     樓層依官方展區/floor plan 推得:InnoVEX 在南港 2 館 4 樓(S 區),
     南港 1 館 M 區 4 樓、K 區 1 樓。InnoVEX 醫療廠商皆在南港 2 館 4 樓。 */
  var VENUE = {
    T1:   { zh: "南港展覽館 1 館", en: "TaiNEX Hall 1",     sz: "南港 1 館", se: "Hall 1" },
    T2:   { zh: "南港展覽館 2 館", en: "TaiNEX Hall 2",     sz: "南港 2 館", se: "Hall 2" },
    TWTC: { zh: "台北世貿中心 1 館", en: "Taipei WTC Hall 1", sz: "世貿 1 館", se: "TWTC" }
  };
  var FLOOR = { "T2|S": "4", "T1|M": "4", "T1|K": "1" };
  var FLOORPLAN = {
    cpx: "https://booth.e-taitra.com.tw/map/v2/zh-TW/2026CP/h/19?cad=0",
    inx: "https://innovex.computex.biz/show/floorplan.aspx"
  };
  function boothPrefix(b) {
    var m = String(b || "").match(/^[A-Za-z]+/);
    return m ? m[0].toUpperCase() : "";
  }
  function venueFloor(it) {
    var f = FLOOR[(it.v || "") + "|" + boothPrefix(it.b)];
    if (f) return f;
    if (it.v === "T2") return "4";   // InnoVEX 區皆在南港 2 館 4 樓
    return "";
  }
  /* 回傳結構化展館資訊,或 null(無 venue)。full 含館別+樓層、short 給卡片。 */
  function venue(it) {
    if (!it) return null;
    var V = VENUE[it.v];
    if (!V) return null;
    var fl = venueFloor(it);
    var fz = fl ? " " + fl + " 樓" : "";
    var fe = fl ? " " + fl + "F" : "";
    return {
      code: it.v, booth: it.b || "", floor: fl,
      hall: { zh: V.zh, en: V.en },
      full: { zh: V.zh + fz, en: V.en + fe },
      short: { zh: V.sz + fe, en: V.se + fe }
    };
  }
  function floorplan(k) { return FLOORPLAN[k] || ""; }

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.theme);
    var icon = $("themeIcon");
    if (icon) icon.textContent = state.theme === "dark" ? "light_mode" : "dark_mode";
    lsSet("theme", state.theme);
  }
  function wireChrome() {
    var th = $("themeToggle");
    if (th) th.addEventListener("click", function () {
      state.theme = state.theme === "dark" ? "light" : "dark";
      applyTheme();
    });
    /* #langToggle needs no handler: it is a link to the other language's URL,
       so switching language is a navigation, not a repaint. */
  }

  /* gentle fade-up as elements enter view; targets [data-item] within root */
  var obs = null;
  function setupReveal(root) {
    root = root || document;
    if (obs) { obs.disconnect(); obs = null; }
    var targets = [].slice.call(root.querySelectorAll("[data-item]:not(.reveal-done)"));
    if (!targets.length) return;
    var reduce = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("reveal", "is-visible", "reveal-done"); });
      return;
    }
    targets.forEach(function (el, i) {
      el.classList.add("reveal", "reveal-done");
      el.style.transitionDelay = (Math.min(i % 8, 7) * 45) + "ms";
    });
    obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); obs.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.04 });
    targets.forEach(function (el) { obs.observe(el); });
  }

  function init() {
    applyTheme();
    wireChrome();
  }

  return {
    state: state, t: t, escapeHtml: escapeHtml,
    setupReveal: setupReveal, init: init,
    lsGet: lsGet, lsSet: lsSet,
    venue: venue, floorplan: floorplan
  };
})();
