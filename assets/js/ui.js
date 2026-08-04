/* ui.js — mobile nav, scroll reveal, active section, back-to-top, cursor glow, tilt, local clock */
(function () {
  "use strict";

  function initNav() {
    var menuToggle = document.getElementById("menuToggle");
    var mobileMenu = document.getElementById("mobileMenu");
    if (!menuToggle || !mobileMenu) return;

    function close() {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.classList.remove("is-open");
      mobileMenu.hidden = true;
      mobileMenu.classList.remove("is-open");
    }

    menuToggle.addEventListener("click", function () {
      var open = mobileMenu.classList.contains("is-open");
      if (open) {
        close();
      } else {
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.classList.add("is-open");
        mobileMenu.hidden = false;
        mobileMenu.classList.add("is-open");
      }
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  function initNavbarScroll() {
    var navbar = document.querySelector(".navbar");
    var backToTop = document.getElementById("backToTop");
    if (!navbar) return;

    function onScroll() {
      navbar.classList.toggle("is-scrolled", window.scrollY > 8);
      if (backToTop) {
        backToTop.classList.toggle("is-visible", window.scrollY > 600);
        backToTop.hidden = window.scrollY <= 600;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (backToTop) {
      backToTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  /* ---------- Scroll reveal ---------- */
  var revealed = new Set();

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealed.add(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );

    items.forEach(function (el) {
      if (!revealed.has(el)) {
        observer.observe(el);
      }
    });
  }

  /* Re-observe anything rendered after live data arrives. */
  function refreshReveal() {
    if (!("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealed.add(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );

    document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
      if (!revealed.has(el)) observer.observe(el);
    });
  }

  function initActiveSection() {
    var sections = document.querySelectorAll("main section[id]");
    if (!sections.length) return;

    var links = {
      about: null, stats: null, skills: null,
      projects: null, pinned: null, timeline: null, activity: null, contact: null,
    };

    document.querySelectorAll(".mobile-menu__link").forEach(function (a) {
      var id = (a.getAttribute("href") || "").replace("#", "");
      if (id in links) links[id] = a;
    });

    if (!("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            Object.keys(links).forEach(function (id) {
              if (links[id]) links[id].style.color = id === entry.target.id ? "var(--accent-2)" : "";
            });
          }
        });
      },
      { threshold: 0.35 }
    );
    sections.forEach(function (s) { observer.observe(s); });
  }

  function initCursorGlow() {
    var glow = document.querySelector(".cursor-glow");
    if (!glow) return;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;

    var x = 0;
    var y = 0;
    var cx = 0;
    var cy = 0;
    var raf = null;

    function render() {
      cx += (x - cx) * 0.12;
      cy += (y - cy) * 0.12;
      glow.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      raf = requestAnimationFrame(render);
    }

    document.addEventListener("mousemove", function (e) {
      x = e.clientX;
      y = e.clientY;
      glow.classList.add("is-visible");
      if (!raf) render();
    });
    document.addEventListener("mouseleave", function () {
      glow.classList.remove("is-visible");
    });
  }

  /* Delegated 3D tilt — works for content rendered after load too. */
  function initTilt() {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.addEventListener("mousemove", function (e) {
      var card = e.target.closest(".project.card, .repo");
      if (!card) return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        "translateY(-3px) perspective(900px) rotateX(" + (-py * 4) + "deg) rotateY(" + px * 4 + "deg)";
    });

    document.addEventListener("mouseleave", function (e) {
      var card = e.target.closest(".project.card, .repo");
      if (card) card.style.transform = "";
    });
  }

  function initProficiency() {
    var bars = document.querySelectorAll(".bar__fill[data-width]");
    if (!bars.length) return;

    function fill() {
      bars.forEach(function (bar) {
        bar.style.width = bar.getAttribute("data-width") + "%";
      });
    }

    if (!("IntersectionObserver" in window)) {
      fill();
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            fill();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(document.getElementById("skills"));
  }

  /* Live local clock in the sidebar. */
  function initClock() {
    var el = document.getElementById("localTime");
    if (!el) return;
    var tz = (window.Portfolio.data && window.Portfolio.data.timezone) || "Europe/London";

    function tick() {
      try {
        el.textContent =
          new Intl.DateTimeFormat("en-GB", {
            timeZone: tz,
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date()) + " local";
      } catch (e) {
        el.textContent = "UTC";
      }
    }
    tick();
    setInterval(tick, 30000);
  }

  function init() {
    initNav();
    initNavbarScroll();
    initReveal();
    initActiveSection();
    initCursorGlow();
    initTilt();
    initProficiency();
    initClock();
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.ui = { init: init, refreshReveal: refreshReveal };
})();
