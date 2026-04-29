My Fitness Glow Up
===================

Short description
-----------------
A casual, student-made interactive visualization exploring personal workout logs (Jan 2025 - Apr 2026). It shows workout counts, duration, intensity, and a 16-month progress trend.

Demo video
----------
- (Add your YouTube demo URL here)

Live site
---------
- (Add your GitHub Pages URL here once deployed)

Run locally
-----------
Open `index.html` in a browser. For best results run a local server:

```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000
```

Files
-----
- `index.html` - main page with narrative and visualization containers
- `css/style.css` - styles
- `js/` - modular D3 scripts (chart logic)
- `data/workouts.csv` - source data

Interactive features
--------------------
- Filters: show All / Cardio / Strength / Rest
- Hover tooltips on bars, pie slices, and timeline points
- Clickable progress chart points for month details
- Clickable heatmap cells for daily details
- Current streak counter in stats

Data & provenance
-----------------
Data is a simulated/curated personal workout log recorded by the author. Columns: `date, type, duration, intensity, muscle_group, calories`.

Libraries / credits
-------------------
- D3.js v7 — data visualization library
- CSS + vanilla JavaScript
- Reference: "D3.js in Action" by Elijah Meeks & Anne-Marie Dufour

GitHub Pages setup
------------------
This project is prepared for GitHub Pages by placing the site files in the `docs/` folder. When you publish, point GitHub Pages at the `docs/` directory so the hosted site uses the same `index.html`, `css/`, `js/`, and `data/` files.

Submission checklist
--------------------
- [ ] Demo video link added
- [ ] GitHub Pages link added
- [ ] GitHub Pages source set to `docs/`
- [x] Code organized into `js/`, `css/`, and `data/`
- [x] All interactive features working locally

