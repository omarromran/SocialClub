# The Social Club — Design System

> **Single source of truth for all UI decisions.**
> Every page, partial, modal, form, and email in TheSocialClub must follow this file.
> If something is not covered here, extend this file first, then build. Never invent a one-off style in a page.

---

## 0. How to use this document

1. **Before creating or editing any page**, read this file fully and complete the checklist in [§14](#14-page-checklist).
2. **Never hardcode** colors, font sizes, spacing, radii, or shadows in a page. Use the tokens in [§2](#2-design-tokens-css).
3. **Never duplicate a component.** If a component exists in [§8](#8-components), reuse it. If it doesn't exist, add it to the shared component layer and document it here.
4. Light and dark themes, RTL/LTR, keyboard use, and mobile are **required** for every page, not extras.

---

## 1. Design direction

A premium, minimal, modern, playful social experience with a black-and-white foundation. Small blue accents add direction and recognition without dominating the interface.

It must **not** look like a generic admin dashboard, an Instagram clone, or a template.

**Principles**
- **Monochrome minimalism** — black, white, and grey do most of the work; blue is reserved for small accents.
- **Content first** — posts, people, and media are the stars; chrome stays quiet.
- **One product** — the admin area and the user area share the same identity (admin may be denser, never different).
- **Clarity over decoration** — no decorative element may compete with content.

**Avoid:** random gradients, glassmorphism, heavy shadows, excessive rounded containers, oversized headings, unnecessary borders, generic "AI-looking" layouts.

---

## 2. Design tokens (CSS)

All tokens live in **one** shared stylesheet (`assets/css/tokens.css`) and are loaded on every page. Components use **semantic** tokens only (e.g. `--color-surface`), never raw hex values.

```css
:root {
  /* ---------- Brand palette (raw) ---------- */
  --blue-500:       #3B82F6;
  --blue-600:       #2563EB;
  --blue-700:       #1D4ED8;   /* pressed / strong text on light */
  --gray-300:       #D1D5DB;
  --gray-500:       #6B7280;
  --gray-700:       #374151;

  /* ---------- Semantic colors: LIGHT (default) ---------- */
  --color-bg:             #FFFFFF;  /* app background */
  --color-surface:        #FFFFFF;  /* cards, panels, inputs */
  --color-surface-muted:  #F3F4F6;  /* subtle fills, hover rows, skeletons */
  --color-surface-raised: #FFFFFF;  /* menus, dialogs, popovers */
  --color-text:           #111827;  /* near-black */
  --color-text-secondary: #4B5563;  /* AA-safe */
  --color-border:         #D1D5DB;

  --color-primary:        #111827;  /* filled buttons, selected states */
  --color-primary-hover:  #374151;
  --color-primary-brand:  #2563EB;  /* small accents, icons, focus ring */
  --color-on-primary:     #FFFFFF;
  --color-primary-soft:   #EFF6FF;  /* small selected backgrounds */
  --color-link:           #2563EB;

  --color-accent-blue:   #3B82F6;  /* sparing: highlights and selected accents */
  --color-accent-gray:   #6B7280;  /* neutral metadata */

  --color-error:          #111827;
  --color-error-soft:     #F3F4F6;
  --color-success:        #111827;
  --color-success-soft:   #F3F4F6;
  --color-focus-ring:     #2563EB;

  /* ---------- Typography ---------- */
  --font-heading: "Space Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-body:    "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-arabic:  "IBM Plex Sans Arabic", "Segoe UI", Tahoma, sans-serif;

  --fs-display: clamp(2.25rem, 1.6rem + 2.4vw, 2.75rem); /* 36–44 */
  --fs-h1: 1.875rem;   /* 30 */
  --fs-h2: 1.5rem;     /* 24 */
  --fs-h3: 1.25rem;    /* 20 */
  --fs-body: 0.9375rem;/* 15 (16 on mobile inputs, see §3) */
  --fs-small: 0.8125rem;/* 13–14 */
  --fs-caption: 0.75rem;/* 12 */

  --lh-tight: 1.2;
  --lh-snug: 1.35;
  --lh-body: 1.55;

  /* ---------- Spacing (4px scale) ---------- */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;

  /* ---------- Radii ---------- */
  --radius-sm: 8px;      /* small controls, chips */
  --radius-md: 12px;     /* buttons, inputs */
  --radius-lg: 16px;     /* cards, panels */
  --radius-xl: 20px;     /* dialogs */
  --radius-full: 9999px; /* avatars, pills */

  /* ---------- Elevation (floating things ONLY) ---------- */
  --shadow-popover: 0 4px 16px rgba(36, 26, 23, 0.10);
  --shadow-dialog:  0 12px 32px rgba(36, 26, 23, 0.16);

  /* ---------- Layout ---------- */
  --app-max-width: 1440px;
  --feed-max-width: 640px;
  --nav-width: 260px;
  --nav-width-compact: 72px;
  --sidebar-width: 320px;
  --tap-target: 44px;

  /* ---------- Motion ---------- */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --dur-fast: 120ms;
  --dur-base: 200ms;
}

/* ---------- DARK THEME ---------- */
:root[data-theme="dark"] {
  --color-bg:             #000000;
  --color-surface:        #111111;
  --color-surface-muted:  #222222;
  --color-surface-raised: #222222;
  --color-text:           #FFFFFF;
  --color-text-secondary: #D1D5DB;
  --color-border:         #374151;

  --color-primary:        #FFFFFF;
  --color-primary-hover:  #D1D5DB;
  --color-primary-brand:  #60A5FA;
  --color-on-primary:     #000000;   /* dark text on the lighter button */
  --color-primary-soft:   #172554;
  --color-link:           #60A5FA;

  --color-error:          #FFFFFF;
  --color-error-soft:     #222222;
  --color-success:        #FFFFFF;
  --color-success-soft:   #222222;
  --color-focus-ring:     #60A5FA;

  --shadow-popover: 0 4px 16px rgba(0, 0, 0, 0.45);
  --shadow-dialog:  0 12px 32px rgba(0, 0, 0, 0.55);
}

/* Follow OS preference when the user hasn't chosen */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* Repeat the dark token block above, or generate it from one source. */
  }
}
```

> **Contrast note — deliberate deviations from the original palette.**
> Black, white, and grey provide the main contrast system. Blue is reserved for links, focus rings, selected indicators, and small icons. Filled buttons use `--color-primary`, while secondary text uses `--color-text-secondary`.

**Theme switching:** set `data-theme="light|dark"` on `<html>`, persist the choice (localStorage and/or user setting), and apply it **before first paint** with a tiny inline script in `<head>` to avoid a flash.

---

## 3. Typography

| Role | Font | Size | Weight | Line height |
|---|---|---|---|---|
| Display | Space Grotesk | 36–44px | 700 | 1.2 |
| H1 | Space Grotesk | 30px | 700 | 1.2 |
| H2 | Space Grotesk | 24px | 600 | 1.25 |
| H3 | Space Grotesk | 20px | 600 | 1.3 |
| Body / UI | Inter | 15–16px | 400 / 500 | 1.55 |
| Small | Inter | 13–14px | 400 / 500 | 1.45 |
| Caption | Inter | 12px | 500 | 1.4 |
| Arabic (all roles) | IBM Plex Sans Arabic | same scale | 400 / 500 / 600 | 1.7 |

Rules:
- Load fonts via a single shared `<head>` partial with `font-display: swap` and the fallbacks defined in the tokens. Don't load fonts per page.
- Apply Arabic font via `:lang(ar)` / `[dir="rtl"]`, not per component.
- **Form inputs are 16px on mobile** (prevents iOS zoom).
- One `<h1>` per page. Don't skip heading levels for styling; use classes.
- Use Display sparingly (landing/auth hero only). No oversized headings inside the app.

---

## 4. Spacing, shapes and elevation

- Spacing only from the scale: **4, 8, 12, 16, 24, 32, 48, 64**. No arbitrary values (no 10px, 14px, 18px…).
- Radii: controls 8 · buttons/inputs 12 · cards 16 · dialogs 20 · avatars/pills full.
- Borders: `1px solid var(--color-border)`.
- **Shadows are for floating layers only** (dropdowns, popovers, dialogs, toasts). Cards in the feed use a border, not a shadow.
- Dividers: 1px `--color-border`. Prefer spacing over lines when separation is already clear.

---

## 5. Layout and responsive design

```
Desktop (≥1100px)   [ Left nav 260 ] [ Feed ≤640 ] [ Right discovery 320 ]
Tablet  (700–1099)  [ Compact nav 72 ] [ Feed ≤640 ]        (right sidebar hidden)
Mobile  (<700)      [ Feed full width ] + bottom tab bar + top app bar
```

- App container: centered, `max-width: var(--app-max-width)`, horizontal padding 16px (mobile) / 24px (desktop).
- Feed column: `max-width: var(--feed-max-width)`.
- Mobile: bottom navigation (5 items max), touch targets ≥ `--tap-target` (44px), **no horizontal overflow**, dialogs become full-width bottom sheets or full-screen.
- Use CSS grid/flex with logical properties (see RTL).
- Admin area uses the same shell; the content region may be wider (tables, charts) but keeps the same header, nav, tokens, and components.

### RTL / Arabic
- Set `<html lang="ar" dir="rtl">` for Arabic; `dir="ltr"` otherwise.
- **Use logical CSS properties only:** `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `text-align: start`, `border-start-start-radius`… Never `left/right` for layout.
- Mirror directional icons (arrows, chevrons, back); don't mirror logos, media, or play buttons.
- Numbers, handles, and URLs remain LTR inside RTL text (`<bdi>` / `unicode-bidi: isolate`).

---

## 6. Iconography and imagery

- One icon set, one stroke weight (1.5–2px), 20px default, 24px in nav. Do not mix sets or use emoji as UI icons.
- Icons inherit `currentColor`.
- Icon-only buttons need an accessible name (`aria-label`).
- Avatars: circular, sizes 24 / 32 / 40 / 56 / 96; fall back to initials on `--color-surface-muted`.
- Media in posts keeps its aspect ratio (max height ~560px), rounded `--radius-lg`, with `loading="lazy"` and `alt` text.
- The product character comes from the monochrome palette, typography, and restrained blue accents. If a subtle pattern is used, keep it ≤ 6% opacity and out of the feed.

---

## 7. Interaction states

**Every** interactive element must define all of these:

| State | Requirement |
|---|---|
| Default | Clear affordance |
| Hover | Subtle shift (`--color-surface-muted` or `--color-primary-hover`); never layout shift |
| Focus-visible | `outline: 2px solid var(--color-focus-ring); outline-offset: 2px` — never removed |
| Active / selected | Blue (`--color-primary` / `--color-primary-soft`) **plus** a non-color cue (filled icon, bold, underline, check) |
| Disabled | 50% opacity, `cursor: not-allowed`, `aria-disabled` / `disabled` |
| Loading | Inline spinner or skeleton; control disabled to **prevent duplicate submissions** |
| Success | Brief confirmation (toast / inline check) |
| Error | `--color-error` + icon + message text; field linked with `aria-describedby` |

**Social actions (like, follow, bookmark, share, comment):**
- Respond immediately. Optimistic UI is fine for like/bookmark/follow; **roll back and show an error toast on failure**.
- Debounce / lock the control while the request is in flight.
- Show counts with `aria-live="polite"` updates; state is conveyed by icon fill + label (`aria-pressed="true"`), not color alone.
- Destructive actions (delete post, block, suspend user) require a confirmation dialog.

---

## 8. Components

Build each once in the shared layer (`assets/css/components.css` + reusable PHP partials in `includes/components/`). Pages **compose**; they don't re-implement. Class prefix: `sc-` (e.g. `sc-btn`, `sc-card`).

### Buttons
| Variant | Use | Style |
|---|---|---|
| `sc-btn--primary` | One main action per view | `--color-primary` bg, `--color-on-primary` text |
| `sc-btn--secondary` | Alternate actions | Surface bg, 1px border, text color |
| `sc-btn--ghost` | Low-emphasis, toolbars | Transparent, hover `--color-surface-muted` |
| `sc-btn--icon` | Icon-only (44×44 hit area) | Round or 12px radius; **needs `aria-label`** |
| `sc-btn--danger` | Destructive | `--color-error` bg or outline |

Sizes: sm 32px · md 40px · lg 48px height. Radius 12px (icon buttons may be full).

### Form controls
Text input, textarea, search field, select, checkbox, radio, toggle, file/media upload.
- Height 44px (inputs), radius 12px, 1px border, `--color-surface` bg.
- Persistent visible `<label>` (placeholder is never the label).
- Helper text below; error text replaces it, with icon and `role="alert"` on submit.
- Focus: border `--color-primary-brand` + focus ring.

### Identity
- **Avatar** (sizes above), **Profile header** (cover, avatar, name, handle, bio, stats, follow/message actions), **Badge** (pill, monochrome or small blue-accent variants), **Status indicator** (dot + text label, never dot alone).

### Content
- **Post card:** `--color-surface`, 1px border, radius 16, padding 16 (mobile) / 20–24 (desktop). Structure: header (avatar, name, handle, time, overflow menu) → body → media → **action bar** (like, comment, share, bookmark) → comments preview.
- **Post composer:** avatar + textarea, media attachment preview chips, audience/privacy selector, primary "Post" button (disabled when empty, loading while submitting).
- **Media attachments:** grid (1–4 items), remove button, upload progress, error state.
- **Comments:** threaded one level, avatar 32px, reply/like actions, inline composer.
- **Reaction / bookmark / share controls:** shared `sc-action` pattern (icon + count, `aria-pressed`).

### Navigation
- **Left nav** (desktop), **compact rail** (tablet), **bottom tab bar** (mobile), **top app bar** (mobile).
- Authenticated application navigation uses the shared `sc-app-tab` pattern: icon, text label on desktop, compact icon rail on tablet, and labeled bottom tabs on mobile.
- **Tabs** (profile, feed filters): underline in blue + bold for selected.
- **Dropdowns / popovers:** `--color-surface-raised`, radius 12–16, `--shadow-popover`, keyboard navigable (arrow keys, Esc to close, focus return).
- **Notification indicator:** dot or count badge, with text equivalent for screen readers.

### Feedback
- **Modal / confirmation dialog:** radius 20, `--shadow-dialog`, focus trapped, Esc closes, focus returns to trigger, scrim `rgba(36,26,23,.5)`. Bottom sheet on mobile.
- **Toast:** bottom-center (mobile) / bottom-left (desktop), `role="status"`, auto-dismiss 4–6s, errors persist until dismissed.
- **Skeleton:** `--color-surface-muted` shimmer (static if reduced motion).
- **Empty state:** icon/illustration (simple, calm), one-line explanation, one primary action.

### Admin-specific (same tokens, same components)
- **Data table:** header on `--color-surface-muted`, row hover, sticky header, 40–44px rows, horizontal scroll *inside* its container on mobile (never the page).
- **Stat card:** number in Space Grotesk, label in secondary text, trend with icon + text.
- **Moderation actions:** suspend/delete use `sc-btn--danger` + confirmation dialog.
- Charts use black, white, greys, and small blue highlights only. Don't introduce new hues.

### Demo-only additions
- **`sc-switch`**: labelled feature toggle with a visible checkbox control.
- **`sc-bar-row`**: simple CSS bar chart row using a small blue accent and accessible text values.
- **`sc-demo-label`**: subtle page-footer label identifying static demonstration data.

---

## 9. Accessibility (target: WCAG 2.2 AA)

- Semantic HTML: `header`, `nav`, `main`, `aside`, `article` (posts), `button` for actions, `a` for navigation. No clickable `div`s.
- Public landing and authentication pages intentionally omit the skip link for the minimal shell; authenticated content pages should include one when their navigation expands.
- Full keyboard operability; logical tab order; visible focus on every control.
- Contrast: 4.5:1 normal text, 3:1 large text and UI boundaries, in **both themes**.
- Never use color alone for status (add icon, text, pattern, or weight).
- Accessible names for all icon-only buttons; `alt` on meaningful images, `alt=""` on decorative ones.
- Form errors: specific, human, linked to fields; focus moves to the first error on submit.
- Target size ≥ 24px (WCAG 2.2) — we use **44px** as our standard.
- Respect `prefers-reduced-motion`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
  }
  ```
- Declare `lang` and `dir` on `<html>`.

---

## 10. Motion

- Purposeful and short: 120–200ms, `--ease`. Used for hover, press, menu open, toast in, like feedback.
- No parallax, looping decoration, or large animated backgrounds.
- A like may animate the icon (scale pulse); it must also work with motion disabled.

---

## 11. Voice and microcopy

- Friendly, concise. Plain language; no jargon in user-facing errors.
- Buttons are verbs ("Post", "Follow", "Save changes").
- Errors say what happened and how to fix it. Empty states invite action.
- All strings must be translatable (EN/AR); no text baked into images.

---

## 12. Project structure (PHP)

Adapt to the existing layout — **do not restructure working code**. The target shape:

```
assets/
  css/
    tokens.css        ← all design tokens (light + dark)
    base.css          ← reset, typography, html/body, focus, reduced motion
    layout.css        ← app shell, grid, responsive breakpoints
    components.css    ← sc-* components and states
    pages/            ← page-specific CSS ONLY for layout glue (no new colors/sizes)
  js/
    theme.js          ← theme toggle + persistence
    components/       ← dialog, dropdown, toast, like/follow handlers
includes/
  head.php            ← meta, fonts, CSS links, theme-init script
  header.php / nav.php / footer.php
  components/         ← post-card.php, avatar.php, button.php, modal.php, toast.php, empty-state.php …
```

- Every page includes `head.php` (tokens, fonts, theme init) and the shared shell.
- Page CSS may position and arrange components but must **not** define colors, font sizes, radii, or shadows outside the tokens.
- Escape all output (`htmlspecialchars`) in components; preserve existing business logic, sessions/auth, DB queries, and API contracts.

---

## 13. Do / Don't

| Do | Don't |
|---|---|
| Use `var(--token)` everywhere | Hardcode hex, px font sizes, or random spacing |
| Reuse `sc-*` components | Copy-paste a card/button into a page and tweak it |
| Use black/white for primary actions and blue only for small accents | Use blue for large surfaces or primary fills |
| Use blue accents sparingly | Add new accent colors |
| Use borders for cards, shadows for floating layers | Put shadows on every card |
| Use logical properties for RTL | Use `left/right`, `margin-left`, `float` |
| Test light, dark, mobile, RTL, keyboard | Ship a page tested in one theme |
| Add new patterns to this file first | Invent a style for one page |

---

## 14. Page checklist

Complete this **before** creating a new page and **again** before calling a page done.

- [ ] Read this file; identified which existing components cover the page
- [ ] Page includes shared `head.php` (tokens, fonts, theme init) and the app shell
- [ ] Zero hardcoded colors, font sizes, radii, shadows, or off-scale spacing
- [ ] Only shared `sc-*` components used; any new component added to `components.css` + documented in §8
- [ ] Headings: one `<h1>`, correct order; correct fonts (Space Grotesk / Inter / IBM Plex Sans Arabic)
- [ ] All interactive elements have default, hover, focus-visible, active/selected, disabled, loading, success, error states
- [ ] Forms: visible labels, validation messages, duplicate-submit prevention
- [ ] Social actions give immediate feedback and handle failure
- [ ] Light **and** dark theme verified; contrast OK
- [ ] Desktop, tablet, mobile verified; **no horizontal overflow**; touch targets ≥ 44px
- [ ] RTL verified (logical properties, mirrored icons)
- [ ] Keyboard-only walkthrough passes; icon buttons have accessible names; skip link policy matches the page shell
- [ ] Reduced-motion respected
- [ ] Empty, loading, and error states exist
- [ ] Existing functionality, auth, API contracts, and DB logic untouched

---

*When uncertain, choose cool minimalism, clear hierarchy, usability, accessibility, and consistency with these tokens. Every screen must feel like the same product.*
