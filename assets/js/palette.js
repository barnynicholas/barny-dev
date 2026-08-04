/* palette.js — ⌘K / Ctrl+K command palette with keyboard navigation */
(function () {
  "use strict";

  var ICONS = {
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    bar: '<path d="M3 3v18h18"/><path d="M7 14v4M12 10v8M17 6v12"/>',
    code: '<path d="m8 6-6 6 6 6M16 6l6 6-6 6"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    repo: '<path d="M3 3v18h18V9l-6-6H5a2 2 0 0 0-2 2Z"/><path d="M15 3v6h6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m3 6 9 7 9-7"/>',
    github: '<path d="M12 .3C5.4.3 0 5.7 0 12.3c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.2 1.9 1.2 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11 11 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.8-1.6 8.2-6.1 8.2-11.4C24 5.7 18.6.3 12 .3Z"/>',
    linkedin: '<path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>',
    x: '<path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z"/>',
    download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  };

  function buildItems() {
    var base = (window.Portfolio.data.PALETTE_ITEMS || []).filter(function (i) {
      return i.group !== "Projects";
    });

    var live = window.Portfolio.live;
    if (live && Array.isArray(live.repos) && live.repos.length) {
      live.repos.slice(0, 8).forEach(function (r) {
        base.push({ group: "Projects", label: r.name, target: r.html_url, icon: "repo" });
      });
    }
    return base;
  }

  function init() {
    var palette = document.getElementById("palette");
    var trigger = document.getElementById("paletteTrigger");
    var input = document.getElementById("paletteInput");
    var results = document.getElementById("paletteResults");

    if (!palette || !trigger || !input || !results) return;

    var selectedIndex = 0;
    var currentResults = [];

    function open() {
      palette.hidden = false;
      input.value = "";
      render("");
      input.focus();
      document.body.style.overflow = "hidden";
    }

    function close() {
      palette.hidden = true;
      document.body.style.overflow = "";
    }

    function triggerAction(action) {
      if (action === "theme") {
        document.getElementById("themeToggle").click();
        close();
      } else if (action === "copy-email") {
        if (window.Portfolio.copy) {
          window.Portfolio.copy.copyEmail();
        }
        close();
      } else if (action === "resume") {
        if (window.Portfolio.copy) {
          window.Portfolio.copy.buildResume();
        }
        close();
      }
    }

    function openTarget(item) {
      if (item.action) {
        triggerAction(item.action);
        return;
      }
      close();
      if (item.target.charAt(0) === "#") {
        var el = document.querySelector(item.target);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.open(item.target, "_blank", "noopener");
      }
    }

    function render(query) {
      var q = query.trim().toLowerCase();
      currentResults = buildItems().filter(function (item) {
        if (!q) return true;
        return (item.label + " " + item.group).toLowerCase().indexOf(q) !== -1;
      });
      selectedIndex = 0;

      if (!currentResults.length) {
        results.innerHTML = '<li class="palette__empty">No matches for &ldquo;' + escapeHtml(query) + "&rdquo;</li>";
        return;
      }

      results.innerHTML = currentResults
        .map(function (item, i) {
          var iconPath = ICONS[item.icon] || ICONS.search;
          var href = item.action ? "#" : item.target;
          return (
            '<li><button class="palette__result" role="option" aria-selected="' +
            (i === 0 ? "true" : "false") +
            '" data-index="' + i + '" data-href="' + href + '">' +
            '<span class="palette__result-icon"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            iconPath + "</svg></span>" +
            '<span class="palette__result-label">' + escapeHtml(item.label) + "</span>" +
            '<span class="palette__result-group">' + escapeHtml(item.group) + "</span>" +
            "</button></li>"
          );
        })
        .join("");

      setActive(0);
    }

    function setActive(index) {
      var buttons = results.querySelectorAll(".palette__result");
      buttons.forEach(function (btn, i) {
        var active = i === index;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-selected", active ? "true" : "false");
      });
      var activeBtn = buttons[index];
      if (activeBtn) activeBtn.scrollIntoView({ block: "nearest" });
    }

    function selectCurrent() {
      var buttons = results.querySelectorAll(".palette__result");
      var btn = buttons[selectedIndex];
      if (!btn) return;
      var item = currentResults[selectedIndex];
      if (item) openTarget(item);
    }

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    /* Events */
    trigger.addEventListener("click", open);

    document.addEventListener("keydown", function (e) {
      var mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (palette.hidden) open();
        else close();
        return;
      }
      if (palette.hidden) return;

      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (currentResults.length) {
          selectedIndex = (selectedIndex + 1) % currentResults.length;
          setActive(selectedIndex);
        }
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (currentResults.length) {
          selectedIndex = (selectedIndex - 1 + currentResults.length) % currentResults.length;
          setActive(selectedIndex);
        }
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        selectCurrent();
      }
    });

    input.addEventListener("input", function () {
      render(input.value);
    });

    results.addEventListener("click", function (e) {
      var btn = e.target.closest(".palette__result");
      if (!btn) return;
      selectedIndex = parseInt(btn.getAttribute("data-index"), 10);
      selectCurrent();
    });

    palette.addEventListener("mousedown", function (e) {
      if (e.target.closest(".palette__panel")) return;
      close();
    });
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.palette = { init: init };
})();
