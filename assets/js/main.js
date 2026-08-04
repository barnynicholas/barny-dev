/* main.js — boot sequence */
(function () {
  "use strict";

  function boot() {
    window.Portfolio.theme.init();
    window.Portfolio.render.init();
    window.Portfolio.typing.init();
    window.Portfolio.ui.init();
    window.Portfolio.stats.init();
    window.Portfolio.palette.init();
    window.Portfolio.copy.init();

    /* Pull live GitHub data; render/stats refresh automatically on success. */
    if (window.Portfolio.api) {
      window.Portfolio.api.load();
    }

    var root = document.documentElement;
    root.classList.remove("is-loading");
    root.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
