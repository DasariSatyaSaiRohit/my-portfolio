# Assets (open `index.html` locally — no server required)

Place these files next to `index.html`:

1. **`Dasari Satya Sai Rohit Resume BE.pdf`** — resume download (exact filename).
2. **`rohit_photo.jpg`** — optional hero portrait.

Project covers live under `assets/projects/` as `.jpg` (see `gallery` in `index.html` for case-study carousel slides).

Regenerate covers after UI changes:

```bash
cd my-portfolio
npm install --no-save playwright
node scripts/capture-project-screens.mjs
```

Requires cloned repos at `../_repo-clones/` (QueryMind, Resume-Based-Jobs) and Chrome or Edge installed.
