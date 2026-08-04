/* data.js — persona, fallback content and palette items.
   Live GitHub data (api.js) overrides the fallbacks when available. */
(function () {
  "use strict";

  var PORTFOLIO = {
    name: "Barny Nicholas",
    handle: "barnynicholas",
    email: "hello@barny.dev",
    github: "https://github.com/barnynicholas",
    location: "United Kingdom",
    timezone: "Europe/London",
    since: "2026-07-08T10:39:43Z",
  };

  /* Fallback projects used when the GitHub API is unreachable. */
  var PROJECTS = [
    {
      id: "barnynicholas",
      name: "barnynicholas",
      desc: "Personal GitHub profile README — the story of a developer starting out, one commit at a time.",
      lang: "Markdown",
      langColor: "var(--text-2)",
      stars: 0,
      forks: 0,
      tags: ["profile"],
      url: "https://github.com/barnynicholas/barnynicholas",
      demo: null,
      cover: ["#181818", "#3a3a3a", "B"],
    },
    {
      id: "soon-1",
      name: "Coming soon",
      desc: "The next project is on its way. Watch this space — something honest and useful is being built.",
      lang: "TBD",
      langColor: "var(--text-2)",
      stars: 0,
      forks: 0,
      tags: [],
      url: "https://github.com/barnynicholas",
      demo: null,
      cover: ["#101010", "#2a2a2a", "?"],
    },
    {
      id: "soon-2",
      name: "Coming soon",
      desc: "Another idea in the pipeline. Follow the build-in-public journey on GitHub to see it land.",
      lang: "TBD",
      langColor: "var(--text-2)",
      stars: 0,
      forks: 0,
      tags: [],
      url: "https://github.com/barnynicholas",
      demo: null,
      cover: ["#0d0d0d", "#262626", "+"],
    },
  ];

  var REPOS = [
    {
      name: "barnynicholas",
      desc: "Personal profile README — building in public.",
      lang: "Markdown",
      langColor: "var(--text-2)",
      stars: 0,
      forks: 0,
    },
    {
      name: "coming-soon",
      desc: "The first real project is being built. Check back soon.",
      lang: "TBD",
      langColor: "var(--text-2)",
      stars: 0,
      forks: 0,
    },
  ];

  var ACTIVITY = [
    {
      type: "create",
      icon: "plus",
      text: 'Created repository <a href="https://github.com/barnynicholas/barnynicholas" target="_blank" rel="noopener">barnynicholas/barnynicholas</a>',
      time: "Jul 16, 2026",
    },
    {
      type: "push",
      icon: "git-commit",
      text: 'Started the <a href="https://github.com/barnynicholas" target="_blank" rel="noopener">barnynicholas</a> journey on GitHub — profile created and first repository shipped.',
      time: "Jul 8, 2026",
    },
    {
      type: "star",
      icon: "star",
      text: "Starred projects across the community while learning the ropes.",
      time: "Jul 2026",
    },
  ];

  var PALETTE_ITEMS = [
    { group: "Navigate", label: "About me", target: "#about", icon: "user" },
    { group: "Navigate", label: "Highlights", target: "#stats", icon: "bar" },
    { group: "Navigate", label: "Skills", target: "#skills", icon: "code" },
    { group: "Navigate", label: "Projects", target: "#projects", icon: "grid" },
    { group: "Navigate", label: "Repositories", target: "#pinned", icon: "repo" },
    { group: "Navigate", label: "Journey", target: "#timeline", icon: "clock" },
    { group: "Navigate", label: "Activity", target: "#activity", icon: "zap" },
    { group: "Navigate", label: "Contact", target: "#contact", icon: "mail" },
    { group: "Links", label: "GitHub profile", target: "https://github.com/barnynicholas", icon: "github" },
    { group: "Links", label: "LinkedIn", target: "https://linkedin.com/in/barnynicholas", icon: "linkedin" },
    { group: "Links", label: "X (Twitter)", target: "https://x.com/barnynicholas", icon: "x" },
    { group: "Actions", label: "Copy email address", action: "copy-email", icon: "mail" },
    { group: "Actions", label: "Download résumé", action: "resume", icon: "download" },
    { group: "Actions", label: "Toggle theme", action: "theme", icon: "sun" },
  ];

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.data = {
    PROJECTS: PROJECTS,
    REPOS: REPOS,
    ACTIVITY: ACTIVITY,
    PALETTE_ITEMS: PALETTE_ITEMS,
    github: PORTFOLIO.github,
    email: PORTFOLIO.email,
    name: PORTFOLIO.name,
    handle: PORTFOLIO.handle,
    location: PORTFOLIO.location,
    timezone: PORTFOLIO.timezone,
    since: PORTFOLIO.since,
  };
})();
