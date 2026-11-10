---
id: html
name: HTML5
kind: language
status: work
tags: [markup, dom, semantics, accessibility, web-platform]
what: "The standard markup language that defines the structure, semantics, and accessibility tree of web documents."
why: "Semantic HTML gives browsers, screen readers, and search engines built-in structure, keyboard navigation, and form behavior before a single line of JavaScript runs."
problem: "Building everything out of generic `<div>` and `<span>` tags breaks keyboard navigation, strips screen-reader landmarks, and forces you to re-implement native browser controls in JS."
relations:
  - { to: css, label: "styled by" }
  - { to: javascript, label: "manipulated via" }
  - { to: browser-apis, label: "exposes DOM to" }
links:
  - { title: "MDN: HTML Reference", url: https://developer.mozilla.org/en-US/docs/Web/HTML }
  - { title: "WHATWG HTML Living Standard", url: https://html.spec.whatwg.org/multipage/ }
alsoIn: []
source: work
---

## Example
```html
<main>
  <article aria-labelledby="post-title">
    <header>
      <h1 id="post-title">Release Notes</h1>
      <time datetime="2026-11-10">November 10, 2026</time>
    </header>

    <form action="/subscribe" method="post">
      <label for="email">Work email</label>
      <input
        id="email"
        name="email"
        type="email"
        autocomplete="email"
        required
      />
      <button type="submit">Subscribe</button>
    </form>
  </article>

  <dialog id="confirm-modal">
    <p>Subscription saved.</p>
    <form method="dialog">
      <button>Close</button>
    </form>
  </dialog>
</main>
```

## Key points
- **Semantics first, ARIA second**: reach for `<button>`, `<nav>`, `<main>`, `<dialog>`, and `<details>` before adding `role` or `tabindex`—native elements carry focus management and keyboard handlers for free.
- **Forms are a runtime**: native validation (`required`, `type="email"`, `pattern`), `FormData`, and implicit Enter-to-submit work out of the box when inputs live inside a `<form>` with proper `<label for="...">` bindings.
- **Document head & resource hints**: `<meta name="viewport">`, `<link rel="preload">`, and `<script type="module">` directly control layout viewport, critical path loading, and ESM execution.

