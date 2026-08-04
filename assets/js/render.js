/* render.js — renders projects, pinned repos and activity into the DOM.
   Uses live GitHub data (window.Portfolio.live) when available, else fallbacks. */
(function () {
  "use strict";

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var ICONS = {
    star: '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.6l-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95z"/></svg>',
    fork: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M12 8v3a3 3 0 0 0 3 3h3M6 8v2a2 2 0 0 0 2 2h3"/></svg>',
    external: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
    github: '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M12 .3C5.4.3 0 5.7 0 12.3c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.2 1.9 1.2 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11 11 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.8-1.6 8.2-6.1 8.2-11.4C24 5.7 18.6.3 12 .3Z"/></svg>',
    repo: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18V9l-6-6H5a2 2 0 0 0-2 2Z"/><path d="M15 3v6h6"/></svg>',
  };

  var COVER_DARK = "#1a1a1a";
  var COVER_LIGHT = "#343434";

  function coverSvg(id, colors, letter) {
    var c1 = colors[0];
    var c2 = colors[1];
    var gid = "cover-" + id;
    return (
      '<svg viewBox="0 0 480 270" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">' +
      '<defs>' +
      '<linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/>' +
      "</linearGradient>" +
      "</defs>" +
      '<rect width="480" height="270" fill="url(#' + gid + ')"/>' +
      '<g fill="none" stroke="#ffffff" stroke-opacity=".1">' +
      '<path d="M0 54h480M0 108h480M0 162h480M0 216h480"/>' +
      '<path d="M60 0v270M120 0v270M180 0v270M240 0v270M300 0v270M360 0v270M420 0v270"/>' +
      "</g>" +
      '<circle cx="400" cy="52" r="70" fill="#ffffff" fill-opacity=".05"/>' +
      '<circle cx="60" cy="230" r="48" fill="#ffffff" fill-opacity=".04"/>' +
      '<text x="240" y="168" font-family="Inter, sans-serif" font-size="120" font-weight="800" fill="#ffffff" fill-opacity=".8" text-anchor="middle">' +
      letter +
      "</text>" +
      '<rect x="24" y="24" width="432" height="222" rx="14" fill="none" stroke="#ffffff" stroke-opacity=".16" stroke-width="2"/>' +
      "</svg>"
    );
  }

  function hasLive() {
    return !!(window.Portfolio.live && window.Portfolio.live.repos);
  }

  /* ---------- Projects ---------- */

  function repoToProject(r) {
    var name = r.name || "untitled";
    var letter = (name.charAt(0) || "?").toUpperCase();
    var tags = [];
    if (r.language) tags.push(r.language.toLowerCase());
    if (!tags.length) tags.push("other");
    return {
      id: "repo-" + name,
      name: name,
      desc: r.description || "No description yet — first project, more to come.",
      lang: r.language || "Other",
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
      tags: tags,
      url: r.html_url || "https://github.com/barnynicholas",
      demo: r.homepage || null,
      cover: [COVER_DARK, COVER_LIGHT, letter],
    };
  }

  function currentProjects() {
    if (hasLive()) {
      var liveRepos = window.Portfolio.live.repos.slice(0, 6).map(repoToProject);
      var fallback = window.Portfolio.data.PROJECTS || [];
      var soon = fallback.filter(function (p) { return /^soon-/.test(p.id); });
      var max = 6;
      var result = [];
      for (var i = 0; i < liveRepos.length && result.length < max; i++) result.push(liveRepos[i]);
      for (var j = 0; j < soon.length && result.length < max; j++) result.push(soon[j]);
      return result;
    }
    return window.Portfolio.data.PROJECTS || [];
  }

  function renderProjects() {
    var grid = document.getElementById("projectGrid");
    if (!grid) return;
    var data = currentProjects();

    grid.innerHTML = data
      .map(function (p) {
        var links =
          '<div class="project__links">' +
          '<a href="' + escapeHtml(p.url) + '" target="_blank" rel="noopener" aria-label="View source on GitHub">' + ICONS.github + "</a>" +
          (p.demo
            ? '<a href="' + escapeHtml(p.demo) + '" target="_blank" rel="noopener" aria-label="Open live demo">' + ICONS.external + "</a>"
            : "") +
          "</div>";

        return (
          '<article class="project card card--hover reveal" data-tags="' +
          escapeHtml((p.tags || []).join(" ")) +
          '">' +
          '<div class="project__cover">' +
          coverSvg(p.id, p.cover, p.cover[2]) +
          links +
          "</div>" +
          '<div class="project__body">' +
          '<h3 class="project__title"><a href="' + escapeHtml(p.url) + '" target="_blank" rel="noopener">' + escapeHtml(p.name) + '</a><span class="pin" title="Featured"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h6v2.3l-1 2v4l1.6 2H8.4L10 11.3v-4l-1-2z"/><path d="M12 16v5"/></svg></span></h3>' +
          '<p class="project__desc">' + escapeHtml(p.desc) + "</p>" +
          '<div class="project__meta">' +
          '<span class="lang"><span class="lang-dot"></span>' + escapeHtml(p.lang) + "</span>" +
          '<span class="meta-stat">' + ICONS.star + p.stars.toLocaleString() + "</span>" +
          '<span class="meta-stat">' + ICONS.fork + p.forks.toLocaleString() + "</span>" +
          "</div>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderFilters() {
    var bar = document.querySelector(".filterbar");
    if (!bar) return;

    var projects = currentProjects();
    var langs = [];
    projects.forEach(function (p) {
      (p.tags || []).forEach(function (t) {
        if (langs.indexOf(t) === -1) langs.push(t);
      });
    });

    var html = '<button class="filter chip chip--filter is-active" type="button" data-filter="all">All</button>';
    langs.forEach(function (t) {
      html += '<button class="filter chip chip--filter" type="button" data-filter="' + escapeHtml(t) + '">' + escapeHtml(t) + "</button>";
    });
    bar.innerHTML = html;
  }

  function initFilters() {
    var bar = document.querySelector(".filterbar");
    if (!bar) return;

    bar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter");
      if (!btn) return;
      bar.querySelectorAll(".filter").forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");

      var filter = btn.getAttribute("data-filter");
      var cards = document.querySelectorAll("#projectGrid .project");
      cards.forEach(function (card) {
        var tags = card.getAttribute("data-tags") || "";
        var show = filter === "all" || tags.split(" ").indexOf(filter) !== -1;
        card.style.display = show ? "" : "none";
        if (show) {
          card.classList.add("is-visible");
          card.classList.remove("reveal");
        }
      });
    });
  }

  /* ---------- Repositories ---------- */

  function repoToRow(r) {
    return {
      name: r.name || "untitled",
      desc: r.description || "No description yet — more to come soon.",
      lang: r.language || "Other",
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
    };
  }

  function currentRepos() {
    if (hasLive()) {
      var rows = window.Portfolio.live.repos.slice(0, 6).map(repoToRow);
      var placeholders = [
        { name: "coming-soon", desc: "The first real project is being built. Check back soon.", lang: "TBD", stars: 0, forks: 0 },
        { name: "coming-soon-2", desc: "Another idea is in the pipeline. Watch the GitHub feed.", lang: "TBD", stars: 0, forks: 0 },
      ];
      while (rows.length < 2 && placeholders.length) {
        rows.push(placeholders.shift());
      }
      return rows;
    }
    return window.Portfolio.data.REPOS || [];
  }

  function renderRepos() {
    var grid = document.getElementById("repoGrid");
    if (!grid) return;
    var data = currentRepos();
    var gh = window.Portfolio.data.github;

    grid.innerHTML = data
      .map(function (r) {
        var href = r.name === "coming-soon" ? gh : gh + "/" + encodeURIComponent(r.name);
        return (
          '<a class="repo" href="' + href + '" target="_blank" rel="noopener">' +
          '<div class="repo__head">' + ICONS.repo + '<span class="repo__name">' + escapeHtml(r.name) + "</span></div>" +
          '<p class="repo__desc">' + escapeHtml(r.desc) + "</p>" +
          '<div class="repo__meta">' +
          '<span class="lang"><span class="lang-dot"></span>' + escapeHtml(r.lang) + "</span>" +
          '<span class="meta-stat">' + ICONS.star + escapeHtml(String(r.stars)) + "</span>" +
          '<span class="meta-stat">' + ICONS.fork + r.forks.toLocaleString() + "</span>" +
          "</div>" +
          "</a>"
        );
      })
      .join("");
  }

  /* ---------- Activity ---------- */

  var ACTIVITY_ICONS = {
    star: '<path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.6l-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95z"/>',
    "git-commit": '<path d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z"/><path d="M4 12h2m12 0h2"/>',
    "git-merge": '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M12 8v3a3 3 0 0 0 3 3h3M6 8v2a2 2 0 0 0 2 2h3"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8-.8-.7-2.2-.7-3 .8Z"/><path d="m12 15 3-3a22 22 0 0 0 3-8 22 22 0 0 0-8 3l-3 3"/><path d="M9 12H4s.6-3.5 3-5.5c2.3-1.9 5-2 5-2s-.1 2.7-2 5c-2 2.3-5.5 3-5.5 3Z"/><path d="M12 15 9 12"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    heart: '<path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z"/>',
  };

  function relativeTime(iso) {
    var then = new Date(iso).getTime();
    if (isNaN(then)) return "recently";
    var diff = Date.now() - then;
    var sec = Math.floor(diff / 1000);
    if (sec < 60) return "just now";
    var min = Math.floor(sec / 60);
    if (min < 60) return min + (min === 1 ? " minute ago" : " minutes ago");
    var hr = Math.floor(min / 60);
    if (hr < 24) return hr + (hr === 1 ? " hour ago" : " hours ago");
    var day = Math.floor(hr / 24);
    if (day < 30) return day + (day === 1 ? " day ago" : " days ago");
    var mo = Math.floor(day / 30);
    if (mo < 12) return mo + (mo === 1 ? " month ago" : " months ago");
    return Math.floor(mo / 12) + " year(s) ago";
  }

  function repoHref(name) {
    return "https://github.com/" + escapeHtml(name);
  }

  function eventToActivity(e) {
    var type = e.type;
    var repo = (e.repo && e.repo.name) || "";
    var payload = e.payload || {};

    function link() {
      return '<a href="' + repoHref(repo) + '" target="_blank" rel="noopener">' + escapeHtml(repo) + "</a>";
    }

    if (type === "CreateEvent") {
      var refType = payload.ref_type || "ref";
      if (refType === "repository") {
        return { type: "create", icon: "plus", text: "Created repository " + link(), time: relativeTime(e.created_at) };
      }
      return { type: "create", icon: "plus", text: "Created " + escapeHtml(refType) + " in " + link(), time: relativeTime(e.created_at) };
    }
    if (type === "PushEvent") {
      var n = (payload.size || 1);
      return { type: "push", icon: "git-commit", text: "Pushed " + n + (n === 1 ? " commit" : " commits") + " to " + link(), time: relativeTime(e.created_at) };
    }
    if (type === "WatchEvent" || type === "StarEvent") {
      return { type: "star", icon: "star", text: "Starred " + link(), time: relativeTime(e.created_at) };
    }
    if (type === "ForkEvent") {
      return { type: "push", icon: "git-merge", text: "Forked " + link(), time: relativeTime(e.created_at) };
    }
    if (type === "PullRequestEvent") {
      var action = payload.action || "opened";
      var pr = payload.number ? "#" + payload.number : "";
      return { type: "merge", icon: "git-merge", text: (action === "closed" ? "Merged PR " : "Opened PR ") + pr + " in " + link(), time: relativeTime(e.created_at) };
    }
    if (type === "IssuesEvent") {
      var num = payload.number ? "#" + payload.number : "";
      return { type: "create", icon: "plus", text: "Opened issue " + num + " in " + link(), time: relativeTime(e.created_at) };
    }
    if (type === "ReleaseEvent") {
      return { type: "release", icon: "rocket", text: "Released " + escapeHtml(payload.release ? (payload.release.tag_name || "a version") : "a version") + " of " + link(), time: relativeTime(e.created_at) };
    }
    if (type === "PublicEvent") {
      return { type: "create", icon: "plus", text: "Made " + link() + " public", time: relativeTime(e.created_at) };
    }
    return null;
  }

  function currentActivity() {
    var live = window.Portfolio.live;
    if (live && Array.isArray(live.events) && live.events.length) {
      var mapped = live.events.map(eventToActivity).filter(Boolean);
      if (mapped.length) return mapped.slice(0, 8);
    }
    return window.Portfolio.data.ACTIVITY || [];
  }

  function renderActivity() {
    var list = document.getElementById("activityList");
    if (!list) return;
    var data = currentActivity();

    if (!data.length) {
      list.innerHTML =
        '<li class="activity__item activity__item--create">' +
        '<span class="activity__icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        ACTIVITY_ICONS.plus +
        "</svg></span>" +
        '<div class="activity__body"><p class="activity__text">No recent public activity yet — check back soon.</p><p class="activity__time">Live feed</p></div>' +
        "</li>";
      return;
    }

    list.innerHTML = data
      .map(function (a) {
        var inner = ACTIVITY_ICONS[a.icon] || ACTIVITY_ICONS.plus;
        return (
          '<li class="activity__item activity__item--' + a.type + ' reveal">' +
          '<span class="activity__icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          inner +
          "</svg></span>" +
          '<div class="activity__body"><p class="activity__text">' + a.text + '</p><p class="activity__time">' + escapeHtml(a.time) + "</p></div>" +
          "</li>"
        );
      })
      .join("");
  }

  /* ---------- Profile / avatar ---------- */

  function applyAvatar() {
    var img = document.getElementById("avatarImg");
    var live = window.Portfolio.live;
    if (img && live && live.profile && live.profile.avatar_url) {
      img.src = live.profile.avatar_url;
    }
  }

  /* ---------- Stats wiring ---------- */

  function applyStats() {
    var live = window.Portfolio.live;
    if (!live) return;
    var stats = {
      repos: live.profile ? live.profile.public_repos : null,
      followers: live.profile ? live.profile.followers : null,
      following: live.profile ? live.profile.following : null,
      days: live.daysOnGitHub,
    };
    document.querySelectorAll(".count[data-stat]").forEach(function (el) {
      var key = el.getAttribute("data-stat");
      var v = stats[key];
      if (v === null || v === undefined) return;
      el.setAttribute("data-count", v);
    });
  }

  /* ---------- Public API ---------- */

  function refresh() {
    renderFilters();
    renderProjects();
    renderRepos();
    renderActivity();
    applyAvatar();
    applyStats();
    if (window.Portfolio.ui && window.Portfolio.ui.refreshReveal) {
      window.Portfolio.ui.refreshReveal();
    }
  }

  function init() {
    renderFilters();
    renderProjects();
    renderRepos();
    renderActivity();
    initFilters();
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.render = { init: init, refresh: refresh };
})();
