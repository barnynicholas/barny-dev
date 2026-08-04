/* typing.js — animated typing intro */
(function () {
  "use strict";

  var PHRASES = [
    "building in public.",
    "clean interfaces.",
    "learning out loud.",
    "open-source tools.",
    "side projects.",
    "writing honest code.",
  ];

  var TYPE_SPEED = 55;
  var DELETE_SPEED = 28;
  var HOLD_MS = 2100;

  function init() {
    var target = document.getElementById("typeTarget");
    if (!target) return;

    var phraseIndex = 0;
    var charIndex = 0;
    var deleting = false;
    var timer = null;

    function typeLoop() {
      var phrase = PHRASES[phraseIndex];

      if (!deleting) {
        charIndex++;
        target.textContent = phrase.slice(0, charIndex);

        if (charIndex === phrase.length) {
          deleting = true;
          timer = setTimeout(typeLoop, HOLD_MS);
          return;
        }
        timer = setTimeout(typeLoop, TYPE_SPEED);
      } else {
        charIndex--;
        target.textContent = phrase.slice(0, charIndex);

        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % PHRASES.length;
        }
        timer = setTimeout(typeLoop, DELETE_SPEED);
      }
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      target.textContent = PHRASES[0];
      return;
    }

    timer = setTimeout(typeLoop, 600);
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.typing = { init: init };
})();
