/* =========================================================================
   site-nav.js — the cross-page rail shared by every page (incl. the home).
   Renders into #siteRail, highlights the current page, and shows bilingual
   labels via paired .i18n-zh/.i18n-en spans (toggled by html[lang] in CSS),
   so it needs no JS language state and works regardless of which page script
   (app.js or core.js) owns the language toggle.

   `built:false` items render disabled until their page exists — flip to true
   as each page lands so all pages' rails update from this one file.
   ========================================================================= */
(function () {
  "use strict";

  var NAV = [
    { href: "index.html",              icon: "hub",              built: true,  zh: "COMPUTEX 介紹", en: "COMPUTEX" },
    { href: "news.html",               icon: "insights",         built: true,  zh: "新聞風向",       en: "Market Pulse" },
    { href: "innovex.html",            icon: "rocket_launch",    built: true,  zh: "InnoVEX 介紹",  en: "InnoVEX" },
    { href: "exhibitors-computex.html", icon: "storefront",      built: true,  zh: "COMPUTEX 廠商", en: "COMPUTEX Exhibitors" },
    { href: "exhibitors-innovex.html",  icon: "storefront",      built: true,  zh: "InnoVEX 廠商",  en: "InnoVEX Exhibitors" },
    { href: "medical-computex.html",   icon: "medical_services", built: true,  zh: "COMPUTEX 醫療 AI", en: "COMPUTEX Medical AI" },
    { href: "medical-innovex.html",    icon: "medical_services", built: true,  zh: "InnoVEX 醫療 AI",  en: "InnoVEX Medical AI" },
    { href: "routes.html",             icon: "route",            built: true,  zh: "醫療 AI 路線",     en: "Medical AI Routes" }
  ];

  function currentFile() {
    var p = location.pathname.split("/").pop();
    return (!p || p === "") ? "index.html" : p;
  }

  function render() {
    var host = document.getElementById("siteRail");
    if (!host) return;
    var cur = currentFile();
    var inner = document.createElement("div");
    inner.className = "siterail__inner";

    NAV.forEach(function (item) {
      var active = item.href === cur;
      var label =
        '<span class="material-symbols-rounded" aria-hidden="true">' + item.icon + "</span>" +
        '<span class="i18n-zh">' + item.zh + "</span>" +
        '<span class="i18n-en">' + item.en + "</span>";

      var el;
      if (!item.built && !active) {
        el = document.createElement("span");
        el.className = "siterail__link is-soon";
        el.setAttribute("aria-disabled", "true");
        el.title = "Coming soon · 建置中";
        el.innerHTML = label + '<span class="siterail__soon">soon</span>';
      } else {
        el = document.createElement("a");
        el.className = "siterail__link" + (active ? " is-active" : "");
        el.href = item.href;
        if (active) el.setAttribute("aria-current", "page");
        el.innerHTML = label;
      }
      inner.appendChild(el);
    });

    host.innerHTML = "";
    host.appendChild(inner);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
