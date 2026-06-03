/* ghstar.js — self-contained GitHub star button for COMPUTEX 2026
   Injects a <style>, prepends the button to .appbar__actions, then
   fetches the live star count with a 1-hour localStorage cache.
   No dependencies; safe in private mode, offline, and rate-limited. */
(function () {
  "use strict";

  /* ---- 1. Inject styles -------------------------------------------------- */
  var STYLE = [
    ".ghstar {",
    "  display: inline-flex;",
    "  align-items: center;",
    "  gap: 0.4rem;",
    "  padding: 0.36rem 0.8rem;",
    "  border-radius: 999px;",
    "  background: var(--surface-container);",
    "  border: 1px solid var(--hairline);",
    "  font-size: 0.82rem;",
    "  font-weight: 600;",
    "  letter-spacing: 0.01em;",
    "  color: var(--on-surface);",
    "  text-decoration: none;",
    "  transition: border-color 0.18s ease, background 0.18s ease;",
    "  white-space: nowrap;",
    "}",
    ".ghstar:hover {",
    "  border-color: var(--primary);",
    "  background: color-mix(in srgb, var(--primary) 10%, var(--surface-container));",
    "}",
    ".ghstar__logo {",
    "  width: 16px;",
    "  height: 16px;",
    "  flex: none;",
    "}",
    ".ghstar__star {",
    "  color: #F5C451;",
    "  transition: transform 0.18s ease;",
    "}",
    ".ghstar:hover .ghstar__star {",
    "  transform: scale(1.2) rotate(-8deg);",
    "}",
    ".ghstar__count {",
    "  font-variant-numeric: tabular-nums;",
    "  font-weight: 600;",
    "  padding-left: 0.5rem;",
    "  border-left: 1px solid color-mix(in srgb, var(--on-surface-variant) 30%, transparent);",
    "}",
    ".ghstar__count[hidden] { display: none; }",
    "@media (max-width: 600px) {",
    "  .ghstar__text { display: none; }",
    "}"
  ].join("\n");

  var styleEl = document.createElement("style");
  styleEl.textContent = STYLE;
  document.head.appendChild(styleEl);

  /* ---- 2. Inject button -------------------------------------------------- */
  var REPO_URL = "https://github.com/tingwei161803/COMPUTEX-2026";
  var GITHUB_LOGO_SVG =
    '<svg class="ghstar__logo" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">' +
    '<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38' +
    " 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13" +
    "-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66" +
    ".07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15" +
    "-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27" +
    " 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15" +
    ' 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2' +
    ' 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>' +
    "</svg>";

  function injectButton() {
    var actions = document.querySelector(".appbar__actions");
    if (!actions) return;
    // Guard against double-injection
    if (actions.querySelector(".ghstar")) return;

    var a = document.createElement("a");
    a.className = "ghstar";
    a.href = REPO_URL;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", "Star COMPUTEX 2026 on GitHub");
    a.innerHTML =
      GITHUB_LOGO_SVG +
      '<span class="ghstar__text">' +
        '<span class="i18n-zh">給星</span>' +
        '<span class="i18n-en">Star</span>' +
      "</span>" +
      '<span class="ghstar__star" aria-hidden="true">&#9733;</span>' +
      '<span class="ghstar__count" hidden></span>';

    actions.insertBefore(a, actions.firstChild);
  }

  /* ---- 3. Load star count ------------------------------------------------ */
  var REPO_API = "tingwei161803/COMPUTEX-2026";
  var CACHE_KEY = "cx_gh_stars";
  var TTL = 60 * 60 * 1000; // 1 hour

  function formatCount(n) {
    if (n >= 1000) {
      return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return String(n);
  }

  function renderCount(n) {
    var el = document.querySelector(".ghstar__count");
    if (!el) return;
    el.textContent = formatCount(n);
    el.removeAttribute("hidden");
  }

  function loadStarCount() {
    // Try cache first
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        var cached = JSON.parse(raw);
        if (cached && typeof cached.n === "number" && Date.now() - cached.t < TTL) {
          renderCount(cached.n);
        }
      }
    } catch (e) { /* private mode or bad JSON — ignore */ }

    // Always fetch fresh in background
    fetch("https://api.github.com/repos/" + REPO_API, {
      headers: { Accept: "application/vnd.github+json" }
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || typeof data.stargazers_count !== "number") return;
        renderCount(data.stargazers_count);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            n: data.stargazers_count,
            t: Date.now()
          }));
        } catch (e) { /* storage unavailable — count still shows this session */ }
      })
      .catch(function () { /* offline or rate-limited — leave button without count */ });
  }

  /* ---- Run --------------------------------------------------------------- */
  function run() {
    injectButton();
    loadStarCount();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
