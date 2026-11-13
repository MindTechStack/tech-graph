---
id: bootstrap
name: "Bootstrap"
kind: library
status: work
tags: [responsive-grid, ui-components, scss, mobile-first, classic-css]
what: "CSS framework with a 12-column flexbox grid, prebuilt components and JavaScript plugins."
why: "Provides an ubiquitous, well-documented foundation for rapid prototyping and responsive layouts that work reliably across all browser versions."
problem: "Custom responsive styling often suffers from inconsistent browser breakpoints, table layout quirks, and fragile hand-rolled modal logic."
relations:
  - { to: css, label: "built with" }
  - { to: scss, label: "customized via" }
  - { to: javascript, label: "powered by" }
links:
  - { title: "Bootstrap Documentation", url: "https://getbootstrap.com/docs/5.3/getting-started/introduction/" }
alsoIn: []
source: work
---

## Example
```html
<!-- Responsive navbar and card layout using Bootstrap 5 utility classes -->
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">TechGraph</a>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link active" href="#">Overview</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Nodes</a></li>
      </ul>
    </div>
  </div>
</nav>

<div class="container py-4">
  <div class="row g-4">
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card h-100 shadow-sm border-0">
        <div class="card-body">
          <h5 class="card-title">Responsive Grid</h5>
          <p class="card-text text-muted">12-column flexbox grid with five responsive breakpoint tiers.</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

## Key points
- **No jQuery dependency**: modern Bootstrap 5 uses vanilla JavaScript with native ES modules, eliminating legacy jQuery baggage.
- **CSS custom properties**: heavily utilizes native CSS variables alongside SCSS for runtime dynamic theme adjustments without rebuilding styles.
- **Today**: while widely used in enterprise backoffices, modern greenfield projects increasingly prefer Tailwind CSS or shadcn/ui for granular design control.
