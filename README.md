# ryanschill.co

Personal website for Ryan Schill — senior front-end engineer, journalist, author.

Built with vanilla HTML, CSS, and JavaScript. No frameworks. No build step. Deployed via GitHub Pages with a custom domain.

---

## Philosophy

> The site *is* the portfolio. Every technical decision is intentional and demonstrable.

This site showcases:
- **Advanced CSS architecture** — a three-layer design token system, fluid type scale, container queries, `:has()`, scroll-driven animations, and the View Transitions API
- **Semantic HTML** — proper landmark roles, accessible navigation, skip links, and meaningful document structure
- **AI-assisted development** — built in collaboration with Claude; the process is documented in `/about/#process`
- **Progressive enhancement** — works without JavaScript; JS adds cursor behavior, theme persistence, and reading progress

---

## CSS Architecture

CSS is organized in five files, imported in cascade order via `main.css`:

```
css/
├── tokens.css      Layer 1–3 design token system
├── reset.css       Modern CSS reset
├── typography.css  Type scale, fonts, prose styles
├── layout.css      Grid patterns, containers, nav, utilities
├── components.css  Cards, buttons, tags, animations
└── main.css        Root import (Google Fonts + all modules)
```

### Token Layers

| Layer | File | Description |
|-------|------|-------------|
| **1 — Primitives** | `tokens.css` | Raw palette values, scale numbers |
| **2 — Semantic** | `tokens.css` | What a value *means* (text, bg, border) |
| **3 — Component** | `tokens.css` | What a value does *in context* (nav, card, btn) |

**Rule:** Component CSS references Layer 2/3 tokens only. Never a Layer 1 primitive directly.

### Color Palette

| Name | Value | Use |
|------|-------|-----|
| Ink (scale) | `#0F0F0F` → `#FAF8F5` | Base neutrals |
| **Ember** | `#D85A30` | Primary accent — CTAs, links, hover states |
| **Vert** | `#1D9E75` | Secondary accent — code, technical content |
| **Terracotta** | `#C96035` | Writing/creative sections |

### Typography

| Role | Font | Use |
|------|------|-----|
| Display | Playfair Display | Hero headings, article titles |
| Body | Source Serif 4 | All prose, body copy |
| Mono | DM Mono | Labels, eyebrows, nav, code |

Type scale uses `clamp()` for fluid sizing — no breakpoint overrides needed.

---

## JavaScript

`js/main.js` is a single progressive enhancement file:

- **Navigation** — mobile toggle, active page marking
- **Custom cursor** — smooth-follow dot on hover-capable devices only
- **Theme toggle** — respects OS preference, persists to `localStorage`
- **Reading progress** — `<progress>`-like bar on article pages
- **Copy email** — clipboard API with fallback

No dependencies. No build tooling.

---

## File Structure

```
rpschill.github.io/
├── index.html          Home page
├── CNAME               ryanschill.co
├── css/
│   ├── main.css
│   ├── tokens.css
│   ├── reset.css
│   ├── typography.css
│   ├── layout.css
│   └── components.css
├── js/
│   └── main.js
├── work/
│   └── index.html      Portfolio / projects
├── writing/
│   └── index.html      Blog + journalism archive
├── about/
│   └── index.html      About + process
├── contact/
│   └── index.html      Contact
└── resume/
    └── index.html      Printable HTML resume
```

---

## CSS Highlights Worth Examining

- **Fluid type scale** — every font size is a `clamp()`, zero media queries for type
- **Scroll-driven animations** — `animation-timeline: view()` for reveal effects (progressively enhanced)
- **View Transitions API** — smooth cross-page fade (`@view-transition { navigation: auto }`)
- **Container queries** — project cards respond to their own container, not the viewport
- **`:has()` parent selection** — cards conditionally styled based on their contents
- **CSS `color-mix()`** — semantic tints without hardcoded alpha values
- **Print stylesheet** — the resume page produces a clean 1-page PDF via `@media print`

---

## Development

No build step. Open `index.html` in a browser, or use any static server:

```bash
# Python
python3 -m http.server 3000

# Node (npx)
npx serve .
```

Deploy: push to `master` branch → GitHub Pages auto-deploys to `ryanschill.co`.

---

## AI Development Process

This site was built using Claude as a development collaborator. The process is documented on the [About page](/about/#process).

Tools used: Claude Sonnet 4.6 via claude.ai.

---

## Images

Place these files in `/img/` before deploying:

| File | Source | Usage | CSS treatment |
|------|--------|-------|---------------|
| `headshot.jpg` | IMG_4398 (B&W, looking up) | Hero section | `grayscale(15%) contrast(1.05)` — light desaturation |
| `headshot-color.jpg` | IMG_5616 (color, direct gaze) | About strip | Ember duotone via `grayscale(100%) contrast(1.1) brightness(0.85)` + `::after` pseudo with `mix-blend-mode: multiply` in `--ember-400`. Hover reveals full color. |

Both treatments are pure CSS. Drop the originals in as-is, no image editing needed.
