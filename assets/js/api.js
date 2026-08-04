/* api.js — fetches live GitHub data for the portfolio.
   Results are cached in window.Portfolio.live and used by render.js.
   On any failure the site gracefully falls back to data.js content. */
(function () {
  "use strict";

  function get(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    });
  }

  function daysSince(iso) {
    var start = new Date(iso).getTime();
    if (isNaN(start)) return null;
    var now = Date.now();
    var days = Math.floor((now - start) / 86400000);
    return Math.max(days, 0);
  }

  function load() {
    var github = window.Portfolio.data.github;
    var user = (github || "").replace(/^https?:\/\/github\.com\//, "");
    if (!user) return Promise.resolve();

    var base = "https://api.github.com/users/" + user;

    return Promise.all([
      get(base).catch(function () { return null; }),
      get(base + "/repos?sort=updated&per_page=30").catch(function () { return null; }),
      get(base + "/events/public?per_page=20").catch(function () { return null; }),
    ])
      .then(function (results) {
        var profile = results[0];
        var repos = results[1];
        var events = results[2];

        var live = window.Portfolio.live = {};

        if (profile) {
          live.profile = profile;
          live.daysOnGitHub = daysSince(profile.created_at);
        }

        if (Array.isArray(repos)) {
          live.repos = repos
            .filter(function (r) { return !r.fork; })
            .sort(function (a, b) {
              return new Date(b.updated_at) - new Date(a.updated_at);
            });
          live.stars = live.repos.reduce(function (sum, r) {
            return sum + (r.stargazers_count || 0);
          }, 0);
        }

        if (Array.isArray(events)) {
          live.events = events;
        }

        if (window.Portfolio.render && window.Portfolio.render.refresh) {
          window.Portfolio.render.refresh();
        }
        if (window.Portfolio.stats && window.Portfolio.stats.refresh) {
          window.Portfolio.stats.refresh();
        }
      })
      .catch(function () {
        /* keep fallbacks */
      });
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.api = { load: load, daysSince: daysSince };
})();
