---
id: css
name: CSS3
kind: language
status: work
tags: [styling, layout, flexbox, grid, custom-properties, responsive]
what: "Declarative stylesheet language that controls layout, visual presentation, animations, and responsive adaptation of HTML documents."
why: "Modern CSS (Flexbox, Grid, custom properties, container queries, `:has()`) handles complex responsive layouts and theming natively on the browser compositor thread."
problem: "Using JavaScript resize listeners or rigid pixel positioning for layout causes layout thrashing, janky scrolling, and brittle code across screen sizes."
relations:
  - { to: html, label: "styles" }
  - { to: scss, label: "extended by" }
links:
  - { title: "MDN: CSS Reference", url: https://developer.mozilla.org/en-US/docs/Web/CSS }
  - { title: "web.dev Learn CSS", url: https://web.dev/learn/css }
alsoIn: []
source: work
---

## Example
```css
:root {
  --surface: #0f172a;
  --accent: #3b82f6;
  --space-md: clamp(0.75rem, 1.5vw, 1.25rem);
}

.card-grid {
  container-type: inline-size;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
  gap: var(--space-md);
}

.card {
  background: var(--surface);
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  transition: transform 150ms ease, border-color 150ms ease;

  &:hover,
  &:has(:focus-visible) {
    transform: translateY(-2px);
    border-color: var(--accent);
  }
}

@container (min-width: 480px) {
  .card {
    display: flex;
    align-items: center;
  }
}
```

## Key points
- **1D vs 2D layout**: use Flexbox for single-axis alignment and distribution; use CSS Grid when controlling rows and columns simultaneously (`auto-fill` + `minmax` eliminates most media-query breakpoints).
- **Cascade, specificity, and variables**: CSS Custom Properties (`--var`) inherit through the DOM tree at runtime, enabling zero-JS dark mode and component-scoped overrides.
- **Compositor-friendly animations**: animate `transform` and `opacity` rather than `top`, `left`, `width`, or `height` to avoid triggering expensive layout and paint passes every frame.

