# barny.dev — Developer Portfolio

A premium, fully responsive developer portfolio in a strict black & white monochrome
aesthetic — inspired by the layout of a GitHub profile. It personalises itself with
**live data from your GitHub account** (avatar, repos, stats and activity), with a
static fallback when you're offline. Zero build tools, zero dependencies.

![theme](https://img.shields.io/badge/theme-black%20%2F%20white-0a0a0a) ![deps](https://img.shields.io/badge/dependencies-none-e5e5e5) ![stack](https://img.shields.io/badge/stack-HTML%20%2F%20CSS%20%2F%20JS-f5f5f5)

## What's inside

- **Live GitHub integration** — pulls your avatar, public repositories, follower stats
  and recent activity straight from the GitHub API. The site updates itself as your
  profile grows.
- **Two-column profile layout** — sticky sidebar (avatar, status, links, socials, CTA) + main content column, GitHub-profile style.
- **Command palette** — press `Ctrl K` / `⌘K` to search sections, projects and links from anywhere.
- **Animated typing intro**, count-up stats (live values), scroll-reveal animations and proficiency bars.
- **Interactive featured projects** with dynamic category filtering, hover covers and 3D tilt.
- **Pinned repositories** grid, a build-in-public **timeline**, and a **live activity** feed.
- **Black & white theme** toggle (dark is default; both themes are monochrome), glassmorphism cards, subtle grain texture and a soft glow cursor.
- **Copy-email button**, toast notifications, a generated one-page résumé PDF (built in-browser from your real GitHub data).
- **Accessible & responsive** — semantic landmarks, skip link, `aria` labels, keyboard-navigable palette, reduced-motion support, and fluid layouts for phone, tablet and desktop.

## Run it

No dependencies and no install step. Any of these work:

```bash
# Option 1 — open directly
open index.html

# Option 2 — Python
python -m http.server 8000

# Option 3 — Node
npx serve .
```

Then visit <http://localhost:8000> (or just the opened file).

## Personalise

Everything content-driven lives in `assets/js/data.js` — name, email, location,
timezone, fallback projects/repos/activity and palette entries.

- **Change the GitHub username**: update the `github` field in `assets/js/data.js`
  (and the social links + avatar links in `index.html`).
- **Change the email**: update `email` in `assets/js/data.js` and the two occurrences
  of `hello@barny.dev` in `index.html`.
- **Themes/colors**: the monochrome palette lives in `assets/css/tokens.css`.

## Project structure

```
.
├── index.html                 # Single page, semantic structure
├── README.md
└── assets/
    ├── css/
    │   ├── tokens.css         # Design tokens (monochrome palette, both themes)
    │   ├── base.css           # Reset, typography, focus/reduced-motion
    │   ├── layout.css         # Nav, shell grid, sidebar, footer, noise, ambient
    │   ├── components.css     # Cards, buttons, hero, projects, palette, toast…
    │   └── responsive.css     # Tablet + mobile breakpoints
    └── js/
        ├── theme.js           # Light/dark theme manager
        ├── data.js            # Persona + fallback content
        ├── api.js             # Live GitHub data fetcher
        ├── render.js          # Renders projects/repos/activity + filters
        ├── typing.js          # Animated typing intro
        ├── ui.js              # Mobile nav, reveals, tilt, clock, cursor glow
        ├── stats.js           # Count-up stat counters (live values)
        ├── palette.js         # Ctrl-K command palette
        ├── copy.js            # Copy email, toasts, generated résumé PDF
        └── main.js            # Boot sequence
```

## Licence

MIT — feel free to use it as a starting point for your own portfolio.
