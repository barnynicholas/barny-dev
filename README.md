# barny.dev 

My developer portfolio — a black & white site that personalises itself with live GitHub data. No build tools, no dependencies.

🔗 **Live:** https://barnynicholas.github.io/barny-dev/

## ✨ Features

- Live GitHub integration — avatar, repos, stats & activity
- Command palette (`Ctrl K`), typing intro, scroll reveals
- Black & white light/dark themes
- Résumé PDF generated in-browser

## 🚀 Run it

```bash
open index.html        # or
python -m http.server 8000
```

## 📁 Project structure

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

## 📄 Licence

MIT — feel free to use it as a starting point.
