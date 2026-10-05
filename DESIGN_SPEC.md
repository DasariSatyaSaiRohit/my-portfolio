# Design Spec — Reference: Danny Montoya Portfolio

Observed from [danny-portfolio-zeta.vercel.app](https://danny-portfolio-zeta.vercel.app/) (HTML shell, compiled CSS/JS, and metadata). Principles only — no copied assets or copy.

## 1. Section order and content

| Order | Section | Contents |
|------|---------|----------|
| 1 | **Header** | Name/home link, primary nav (Work, About, Experience, Education, Contact), theme toggle, Resume CTA |
| 2 | **Hero** | Display headline + role line, personal intro, status chips (location, availability), primary CTAs, portrait or illustration |
| 3 | **Work / Projects** | Intro line; **featured** large card + grid of secondary cards; each card: visual, title, year, short summary, tag chips (capped), link to case study |
| 4 | **About** | Short first-person paragraph + categorized skills (grouped columns) |
| 5 | **Experience** | Timeline-style cards with role, company, dates, bullets with metrics |
| 6 | **Education** | Degree card, GPA, coursework chips |
| 7 | **Contact** | “Let’s talk” heading, email + social links, resume download |
| 8 | **Footer** | Copyright, back-to-top |

**Detail view:** Project case studies open in a **modal** (or dedicated hash route) with Problem → Approach → Result → Stack; not a separate fake full-page swap.

Reference also includes **Writing** and creative work; omitted for Rohit unless content is provided.

## 2. Type system

| Role | Family | Notes |
|------|--------|--------|
| Display | **Fraunces** (variable opsz) | Headlines, section titles, hero name |
| Body | **Crimson Pro** | Paragraphs, cards, nav (reference pairing) |
| UI / labels | **Source Sans 3** | Buttons, chips, meta (legibility for dense UI) |

| Token | Size (fluid) | Weight | Line height |
|-------|----------------|--------|-------------|
| Hero display | `clamp(2.5rem, 5vw, 3.75rem)` | 700 | 1.08 |
| Section title | `clamp(1.75rem, 3vw, 2.25rem)` | 600 | 1.15 |
| Card title | `1.25rem` | 600 | 1.25 |
| Body | `clamp(1rem, 1.1vw, 1.0625rem)` | 400 | 1.65 |
| Small / meta | `0.875rem` | 400–500 | 1.5 |
| Nav links | `0.9375rem` | 500 | 1 |

Letter-spacing: display titles slightly tight (`-0.02em`); labels uppercase optional at `0.06em`.

## 3. Color tokens

### Light

| Token | Value | Use |
|-------|--------|-----|
| `--bg` | `#f7f2ea` | Page background |
| `--bg-alt` | `#efe6d9` | Alternating sections |
| `--surface` | `#fffcf7` | Cards, header |
| `--text` | `#2b261f` | Primary text |
| `--text-muted` | `#5c534a` | Secondary |
| `--accent` | `#9a3412` | Links, emphasis (warm rust) |
| `--accent-hover` | `#7c2d12` | Hover |
| `--accent-soft` | `#78350f26` | Chip backgrounds |
| `--border` | `#e0d5c8` | Dividers, card edges |
| `--focus` | `#b87a3d` | Focus ring |

### Dark

| Token | Value | Use |
|-------|--------|-----|
| `--bg` | `#1f1916` | Page (reference `theme-color`) |
| `--bg-alt` | `#2b261f` | Alternating sections |
| `--surface` | `#322c27` | Cards, header |
| `--text` | `#f5ebe0` | Primary |
| `--text-muted` | `#b8a99a` | Secondary |
| `--accent` | `#d4a574` | Links, CTAs |
| `--accent-hover` | `#e8bc8a` | Hover |
| `--accent-soft` | `#78350f40` | Chips |
| `--border` | `#4a423c` | Borders |
| `--focus` | `#d4a574` | Focus ring |

Status chip (open to relocation): green-tinted surface, distinct from accent.

## 4. Layout and shape

- **Container:** `max-width: 72rem` (1152px), horizontal padding `clamp(1rem, 4vw, 2rem)`
- **Grid:** 12-column mental model; project grid `repeat(auto-fit, minmax(min(100%, 18rem), 1fr))`; featured project spans full width on mobile, 2-column split on `≥1024px`
- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64, 96 px
- **Radius:** cards `12px`, buttons `8px`, chips `999px`, photo `16px`
- **Shadows:** light mode soft `0 4px 24px #2b261f12`; hover lift + slightly deeper shadow; dark mode lower opacity

## 5. Navigation

- **Sticky** header with `backdrop-filter: blur(12px)` and semi-transparent `--surface`
- Does **not** hide on scroll (reference keeps persistent nav)
- **Active section:** IntersectionObserver on `#work`, `#about`, `#experience`, `#education`, `#contact` → `aria-current="page"` on nav link
- **Mobile:** hamburger → full-width panel, focus trap, `Escape` closes
- Smooth scroll to anchors; offset for sticky header (`scroll-margin-top`)

## 6. Project cards

- **Featured:** large preview (16:9 or 2:1), title, 2–3 line summary, max 5 tags, “View case study” text link with animated underline
- **Secondary:** image top, title + year, clamped description, tags, hover: translateY(-4px), image scale 1.03 inside overflow hidden
- **Case study modal:** full Problem / Approach / Result / Stack; GitHub + Live demo buttons; close + hash sync `#project/<slug>`

## 7. Motion

| Interaction | Behavior | Duration | Easing |
|-------------|----------|----------|--------|
| Scroll reveal | opacity 0→1, translateY 16px→0, stagger 60ms | 350ms | ease-out |
| Hero entrance | same, on load | 400ms | ease-out |
| Card hover | lift + shadow | 200ms | ease-out |
| Link underline | scaleX 0→1 from left | 200ms | ease-out |
| Theme change | background/color on `html` | 200ms | ease |
| Modal | fade + scale 0.98→1 | 250ms | ease-out |

**`prefers-reduced-motion: reduce`:** disable transforms, stagger, and scroll animations; keep instant state changes.

Reference uses IntersectionObserver (confirmed in bundle).

## 8. Footer and contact

- Contact: centered or left-aligned block, large email button, row of icon links (GitHub, LinkedIn), secondary resume link
- Footer: single line copyright + “Back to top” text button
- Phone **not** in header (privacy); email in contact only

## 9. Theme toggle

- `color-scheme: light dark` on root
- Default: `prefers-color-scheme`
- Toggle persists in `localStorage` key `theme` (try/catch)
- Inline script in `<head>` sets `data-theme` before first paint
- `<meta name="theme-color">` updated via JS for light/dark

## Implementation mapping (Rohit)

- Vanilla HTML + split CSS/JS (no build step; GitHub Pages / Vercel static)
- Warm palette + Fraunces/Crimson Pro aligned to reference warmth, not Bootstrap blue
- Single scroll page + project modal with hash routing
- SVG project covers and icons instead of emojis
