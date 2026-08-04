/* copy.js — copy email to clipboard + toast notifications + resume guard */
(function () {
  "use strict";

  var toastTimer = null;

  function showToast(message) {
    var toast = document.getElementById("toast");
    if (!toast) return;
    toast.innerHTML =
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>' +
      message;
    toast.hidden = false;
    requestAnimationFrame(function () {
      toast.classList.add("is-visible");
    });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
      setTimeout(function () {
        toast.hidden = true;
      }, 300);
    }, 2400);
  }

  function copyEmail() {
    var email = window.Portfolio.data.email;
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = email;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        showToast("Email copied to clipboard");
      } catch (e) {
        showToast("Couldn't copy — email is " + email);
      }
      document.body.removeChild(ta);
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(
        function () { showToast("Email copied to clipboard"); },
        fallback
      );
    } else {
      fallback();
    }
  }

  function init() {
    var buttons = [
      document.getElementById("copyEmail"),
      document.getElementById("copyEmail2"),
    ];
    var labels = [
      document.getElementById("copyEmailLabel"),
    ];

    buttons.forEach(function (btn, i) {
      if (!btn) return;
      btn.addEventListener("click", function () {
        copyEmail();
        if (labels[i]) {
          var original = labels[i].textContent;
          labels[i].textContent = "Copied!";
          setTimeout(function () { labels[i].textContent = original; }, 1800);
        }
      });
    });

    /* Primary CTA opens contact + copies nothing, just smooth-scrolls */
    var ctas = [
      document.getElementById("contactBtn"),
      document.getElementById("contactBtn2"),
    ];
    ctas.forEach(function (btn) {
      if (!btn) return;
      btn.addEventListener("click", function () {
        var contact = document.getElementById("contact");
        if (contact) contact.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    /* Resume link guard: generate a placeholder PDF on first use */
    var resumeLinks = document.querySelectorAll('a[href="assets/resume.pdf"][download]');
    resumeLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        if (!window.Portfolio.data.resumeReady) {
          e.preventDefault();
          window.Portfolio.copy.buildResume();
        }
      });
    });
  }

  function buildResume() {
    var data = window.Portfolio.data;
    var live = window.Portfolio.live;
    var name = data.name || "Barny Nicholas";
    var email = data.email;
    var github = data.github;
    var location = data.location || "United Kingdom";
    var repoCount = live && live.profile ? live.profile.public_repos : 1;
    var topRepos = live && Array.isArray(live.repos)
      ? live.repos.slice(0, 3).map(function (r) { return r.name; }).join(", ")
      : "barnynicholas";
    var since = live && live.profile && live.profile.created_at
      ? "GitHub since " + new Date(live.profile.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
      : "GitHub since July 2026";

    /* Minimal, dependency-free one-page PDF generated in-browser */
    var page =
      "%PDF-1.4\n" +
      "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n" +
      "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n" +
      "3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Resources<</Font<</F1 4 0 R>> >>/Contents 5 0 R>>endobj\n" +
      "4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n" +
      "5 0 obj<</Length 560>>stream\n" +
      "BT /F1 26 Tf 60 720 Td (" + name + ") Tj ET\n" +
      "BT /F1 12 Tf 60 694 Td (Developer - " + location + ") Tj ET\n" +
      "BT /F1 11 Tf 60 664 Td (Email: " + email + "  |  GitHub: " + github.replace("https://", "") + ") Tj ET\n" +
      "BT /F1 12 Tf 60 600 Td (Highlights) Tj ET\n" +
      "BT /F1 11 Tf 72 574 Td ( - " + since + ") Tj ET\n" +
      "BT /F1 11 Tf 72 554 Td ( - " + repoCount + " public repositories on GitHub) Tj ET\n" +
      "BT /F1 11 Tf 72 534 Td ( - Repositories: " + topRepos + ") Tj ET\n" +
      "BT /F1 11 Tf 72 514 Td ( - Building in public - one commit at a time) Tj ET\n" +
      "endstream\nendobj\n" +
      "trailer<</Size 6/Root 1 0 R>>\n" +
      "%%EOF";

    var blob = new Blob([page], { type: "application/pdf" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "barny-nicholas-resume.pdf";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    window.Portfolio.data.resumeReady = true;
    showToast("Résumé downloaded");
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.copy = { init: init, copyEmail: copyEmail, buildResume: buildResume };
})();
