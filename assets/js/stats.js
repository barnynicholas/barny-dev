/* stats.js — animated count-up for stat cards.
   Uses live GitHub values (window.Portfolio.live) when present,
   otherwise falls back to data-count attributes. */
(function () {
  "use strict";

  function liveStatValue(key) {
    var live = window.Portfolio.live;
    if (!live) return null;
    if (key === "repos") return live.profile ? live.profile.public_repos : null;
    if (key === "followers") return live.profile ? live.profile.followers : null;
    if (key === "following") return live.profile ? live.profile.following : null;
    if (key === "days") return live.daysOnGitHub;
    return null;
  }

  function animate(el, from, to) {
    var duration = 1600;
    var start = null;

    function frame(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(from + (to - from) * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(frame);
      else el.textContent = to.toLocaleString();
    }
    requestAnimationFrame(frame);
  }

  function targetFor(el) {
    var key = el.getAttribute("data-stat");
    var live = liveStatValue(key);
    if (live !== null && live !== undefined) return live;
    return parseInt(el.getAttribute("data-count"), 10) || 0;
  }

  function init() {
    var counters = document.querySelectorAll(".count[data-count]");
    if (!counters.length) return;

    if (!("IntersectionObserver" in window)) {
      counters.forEach(function (el) {
        el.textContent = targetFor(el).toLocaleString();
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target, 0, targetFor(entry.target));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* Re-animate from the current displayed value after live data arrives. */
  function refresh() {
    var counters = document.querySelectorAll(".count[data-count][data-stat]");
    counters.forEach(function (el) {
      var to = targetFor(el);
      var current = parseInt((el.textContent || "").replace(/[^\d]/g, ""), 10) || 0;
      if (to !== current) {
        animate(el, current, to);
      }
    });
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.stats = { init: init, refresh: refresh };
})();
