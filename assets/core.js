/* =========================================================================
   core.js — shared chrome for every page EXCEPT the composite home.
   Manages bilingual + theme state (same localStorage keys as app.js so the
   preference carries across pages), exposes t()/escapeHtml(), wires the
   appbar toggles, runs scroll-reveal, and fires a "langchange" event so each
   page can repaint its data-driven content in the new language.

   Static chrome (site-nav labels, hard-coded copy) does NOT go through JS:
   it uses paired .i18n-zh / .i18n-en spans toggled by html[lang] in CSS.
   ========================================================================= */
window.Core = (function () {
  "use strict";

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var state = {
    lang: lsGet("lang") || "zh",
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

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.theme);
    var icon = $("themeIcon");
    if (icon) icon.textContent = state.theme === "dark" ? "light_mode" : "dark_mode";
    lsSet("theme", state.theme);
  }
  function applyLang() {
    document.documentElement.setAttribute("lang", state.lang);
    var label = $("langLabel");
    if (label) label.textContent = state.lang === "en" ? "EN" : "中";
    lsSet("lang", state.lang);
  }

  var langCbs = [];
  function onLang(cb) { langCbs.push(cb); }
  function fireLang() {
    langCbs.forEach(function (cb) { try { cb(state.lang); } catch (e) {} });
    document.dispatchEvent(new CustomEvent("langchange", { detail: state.lang }));
  }

  function wireChrome() {
    var th = $("themeToggle");
    if (th) th.addEventListener("click", function () {
      state.theme = state.theme === "dark" ? "light" : "dark";
      applyTheme();
    });
    var lg = $("langToggle");
    if (lg) lg.addEventListener("click", function () {
      state.lang = state.lang === "en" ? "zh" : "en";
      applyLang();
      fireLang();
    });
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
    applyLang();
    wireChrome();
  }

  return {
    state: state, t: t, escapeHtml: escapeHtml,
    onLang: onLang, setupReveal: setupReveal, init: init,
    lsGet: lsGet, lsSet: lsSet
  };
})();
