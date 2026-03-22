# Qwerty Learner Design System

## Positioning

Qwerty Learner is not a marketing site and not a general education app.
It should feel like a focused desktop training console for keyboard workers.

Core product traits:

- Focused
- Precise
- Calm
- Technical
- Feedback-driven

Avoid these directions:

- Cute learning app
- Generic SaaS dashboard
- Colorful growth-product landing page
- Heavy glassmorphism everywhere
- Over-decorated gamification

Design principle:

> Build the product like a quiet, high-performance typing workstation.

## Visual Language

The product should combine three qualities:

1. A calm reading/training surface
2. A compact control console
3. A lightweight analytics layer

This means:

- The typing page should be the quietest page
- The data pages should be denser and more structured
- High-level overlays should feel premium but still restrained

## Brand Keywords

- Focus mode
- Keyboard craft
- Cool precision
- Low-noise UI
- Soft technical atmosphere
- Structured feedback

## Color System

Use one primary family, one cool data accent, and one warm action accent.
Do not mix `indigo`, `cyan`, `amber`, `gray`, `stone`, and `slate` ad hoc inside the same flow.

### Light Tokens

```css
:root {
  --bg-canvas: #edf4f5;
  --bg-subtle: #f7fbfb;
  --bg-elevated: rgba(255, 255, 255, 0.82);
  --bg-panel: rgba(255, 255, 255, 0.92);

  --text-strong: #0f1f24;
  --text-main: #18323a;
  --text-muted: #607780;
  --text-faint: #8da0a8;

  --border-soft: rgba(18, 50, 58, 0.08);
  --border-main: rgba(18, 50, 58, 0.14);

  --accent-primary: #0d9488;
  --accent-primary-hover: #0f766e;
  --accent-primary-soft: rgba(13, 148, 136, 0.14);

  --accent-cool: #22d3ee;
  --accent-cool-soft: rgba(34, 211, 238, 0.14);

  --accent-warn: #f97316;
  --accent-warn-soft: rgba(249, 115, 22, 0.14);

  --state-success: #16a34a;
  --state-error: #dc2626;
  --state-info: #0284c7;
}
```

### Dark Tokens

```css
html.dark {
  --bg-canvas: #071216;
  --bg-subtle: #0b171c;
  --bg-elevated: rgba(12, 24, 29, 0.82);
  --bg-panel: rgba(13, 27, 33, 0.94);

  --text-strong: #ecfeff;
  --text-main: #d7f4f7;
  --text-muted: #8aa7af;
  --text-faint: #5f7a82;

  --border-soft: rgba(117, 220, 228, 0.08);
  --border-main: rgba(117, 220, 228, 0.14);

  --accent-primary: #14b8a6;
  --accent-primary-hover: #2dd4bf;
  --accent-primary-soft: rgba(20, 184, 166, 0.18);

  --accent-cool: #67e8f9;
  --accent-cool-soft: rgba(103, 232, 249, 0.16);

  --accent-warn: #fb923c;
  --accent-warn-soft: rgba(251, 146, 60, 0.18);

  --state-success: #4ade80;
  --state-error: #f87171;
  --state-info: #38bdf8;
}
```

### Usage Rules

- `accent-primary`: main action, active state, progress, selected state
- `accent-cool`: charts, highlights, info badges, premium detail
- `accent-warn`: start, next step, skip, important attention
- `state-success/error/info`: semantic feedback only
- neutral text and borders should always come from tokens, not random Tailwind shades

## Typography

The product should feel more like a tool than a publication.
Use `Sans + Mono`, not serif.

### Recommended Families

- UI Sans: `IBM Plex Sans`, `Public Sans`, or `Fira Sans`
- Mono: `IBM Plex Mono`, `JetBrains Mono`, or `Fira Code`

### Role Mapping

- App UI, labels, Chinese text: Sans
- Word display, timer, WPM, chapter index, shortcuts, scores: Mono

### Type Scale

- Display: 32-48px
- Page Heading: 24-28px
- Section Heading: 18-20px
- Body: 14-16px
- Meta: 12-13px

### Rules

- Numeric data should look deliberate and mechanical
- The main word on the typing screen should feel crisp, not decorative
- Avoid mixing many font weights in the same panel

## Spacing

Use a 4px spacing grid only.

Spacing scale:

- 4
- 8
- 12
- 16
- 20
- 24
- 32
- 40
- 48

Usage:

- control internals: 8-12
- normal cards: 16-20
- section separation: 24-32
- major page rhythm: 40-48

Avoid page-level magic values unless there is a layout reason.

## Radius

Only keep three radius sizes:

- `--radius-sm: 12px`
- `--radius-md: 20px`
- `--radius-lg: 28px`

Usage:

- buttons, pills, fields: `sm`
- cards, drawers, compact panels: `md`
- dialogs, result overlays, hero panels: `lg`

Do not mix many arbitrary radius values across pages.

## Shadows

Use only two shadow levels.

```css
:root {
  --shadow-soft:
    0 10px 30px rgba(15, 23, 42, 0.08),
    0 2px 10px rgba(15, 23, 42, 0.05);

  --shadow-panel:
    0 24px 72px rgba(15, 23, 42, 0.16),
    0 10px 28px rgba(15, 23, 42, 0.08);
}
```

Usage:

- regular cards: `shadow-soft`
- dialogs, drawers, floating summary panels: `shadow-panel`

Never make shadows the only source of hierarchy.
Use border + surface + shadow together.

## Surface Model

Use four layers consistently:

- `Canvas`: page background
- `Surface`: default component background
- `Panel`: emphasized floating container
- `Overlay`: modal mask and interaction freeze

Rules:

- page background should carry atmosphere
- content containers should stay cleaner than the page background
- elevated components should be visually denser, not noisier

## Motion

The interface should feel responsive but not busy.

Recommended timings:

- hover: 120ms
- press: 80ms
- panel open/close: 160-220ms

Rules:

- prefer color, border, and opacity transitions
- avoid scale-heavy hover effects
- avoid parallax and scroll-jacking
- keep loading motion calm and functional

Reduced motion support is required:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0ms !important;
    transition-duration: 0ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Focus and Accessibility

Keyboard support is a product-level requirement.

Rules:

- all interactive controls must have visible `focus-visible` styles
- never remove focus outlines without replacement
- color cannot be the only state signal
- chart colors should still be distinguishable without perfect color vision
- tooltips should not contain critical-only information

Suggested pattern:

```css
.focus-ring {
  outline: none;
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent-cool) 45%, transparent 55%);
}
```

## Component Patterns

### Buttons

Keep only these button types:

- Primary
- Secondary
- Ghost
- Danger
- Icon button

Rules:

- primary uses `accent-primary`
- warm accent is reserved for stronger action moments
- icon buttons should be visually quiet
- hover should not shift layout

### Inputs and Selects

Rules:

- consistent height across controls
- focus state must be obvious
- field chrome should match panel system
- dropdowns should feel like extensions of the control shell

### Cards

Rules:

- one card language across the app
- card emphasis comes from spacing and type hierarchy first
- hover = stronger border or slight surface lift
- avoid mixing frosted glass cards and flat admin cards in the same page

### Drawers and Dialogs

Rules:

- use `radius-lg` for major overlays
- overlay blur should stay subtle
- header, body, footer structure should be consistent
- dismiss actions should be visually secondary

### Tooltips

Rules:

- compact
- high contrast
- readable in both themes
- never oversized

### Charts

Rules:

- primary trend: `accent-cool`
- comparison series: `accent-primary`
- warning/failure: `accent-warn` or `state-error`
- gridlines must be weak
- chart containers should be standardized before chart colors are tuned

## Page Templates

### Typing Page

Purpose:

- immersion
- instant feedback
- low noise

Structure:

1. lightweight top control bar
2. dominant central word panel
3. subtle bottom metrics rail
4. side access to word list

Rules:

- the current word is the visual center of gravity
- controls should not compete with the training area
- ambient background can exist, but the training panel must remain readable
- paused state should feel controlled, not disruptive

### Gallery Page

Purpose:

- browse dictionaries
- compare scope
- jump into practice

Structure:

1. page controls row
2. grouped dictionary sections
3. richer detail panel or dialog

Rules:

- this page is a library browser, not a landing page
- cards should express language, category, size, and progress
- category group headers must feel structural

### Analysis Page

Purpose:

- review performance
- summarize trends
- reveal problem areas

Structure:

1. KPI strip
2. trend charts
3. heatmaps
4. keyboard error analysis

Rules:

- summarize first, detail second
- do not place all charts with equal visual weight
- use one chart container style across the page

### Error Book

Purpose:

- inspect mistakes
- sort and act efficiently
- drill into details

Structure:

1. compact header with actions
2. data table or table-like list
3. side detail or modal detail

Rules:

- this page should feel denser than the typing page
- row states must be obvious
- exporting and sorting are utility actions, not visual focal points

### Result Screen

Purpose:

- celebrate progress
- summarize performance
- drive next action

Rules:

- keep the premium overlay style already introduced
- use this as the reference for high-level floating panels
- metric blocks should stay restrained and precise, not game-like

## Density Strategy

Different pages should not share the same density.

- Typing page: low density
- Gallery: medium density
- Analysis: medium-high density
- Error book: medium-high density
- Result overlay: medium density with high clarity

This is important.
If every page gets the same large-card treatment, the product loses focus.

## Implementation Rules

### Token First

New UI work should prefer CSS variables over hard-coded utility colors when the value is part of the system.

Good:

- `text-[var(--text-main)]`
- `border-[var(--border-main)]`
- `bg-[var(--accent-primary-soft)]`

Avoid:

- random `text-indigo-500`
- mixed `bg-gray-800` and `bg-slate-900` in nearby components
- local shadow recipes for every new component

### Tailwind Guidance

Allowed:

- layout utilities
- spacing utilities
- breakpoint utilities
- state utilities

Prefer tokens for:

- color
- border color
- surface color
- shadows
- special emphasis

### Existing Reference Components

Current best references in the codebase:

- `src/App.css`
- `src/features/typing/components/Speed/index.tsx`
- `src/features/typing/components/ResultScreen/index.tsx`

These should guide future work more than older `indigo + gray + white` components.

## Anti-Patterns

Do not introduce:

- random color families for each page
- heavy blur on low-level UI
- hover scale on dense controls
- marketing-style gradient cards in utility pages
- giant empty spaces inside data pages
- decorative motion unrelated to feedback
- emoji as functional icons

## Refactor Priorities

### Priority 1: Global Foundations

- normalize color tokens in `src/App.css`
- define radius tokens
- define shadow tokens
- define reusable panel/button/input patterns

### Priority 2: Main Shell

- unify `Header`
- align top-level layout widths and paddings
- standardize page headers and close/back actions

### Priority 3: Page Convergence

- migrate `Gallery` to the system
- migrate `Analysis` to the system
- migrate `Error Book` to the system

### Priority 4: Hard-Coded Cleanup

- remove stray `indigo-*`
- remove mixed `gray/stone/slate/zinc` usage where system tokens should apply
- replace page-specific shadow recipes where possible

## Definition of Done

A page is considered visually finished when:

- it uses the shared token system
- it does not introduce a conflicting color language
- focus states are visible
- density matches its product role
- light and dark mode both remain readable
- motion remains subtle and optional

## Working Rule

Whenever a future UI decision is unclear, ask:

> Does this make Qwerty Learner feel more like a focused training console, or more like a random styled webpage?

If the answer is the second one, reject the change.
