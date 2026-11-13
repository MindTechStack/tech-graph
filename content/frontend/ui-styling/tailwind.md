---
id: tailwind
name: "Tailwind CSS"
kind: library
status: work
core: true
tags: [utility-first, atomic-css, design-system, responsive, postcss]
what: "Utility-first CSS framework: single-purpose classes like `flex`, `pt-4` and `text-center` are composed directly in markup."
why: "Enables rapid UI development without writing custom CSS files or inventing arbitrary class names, while purging unused rules in production."
problem: "Traditional CSS stylesheets grow monotonically with every new feature, resulting in bloated bundles, dead styles, and frequent specificity conflicts."
relations:
  - { to: css, label: "compiles to" }
  - { to: vite, label: "integrated into" }
  - { to: shadcn-ui, label: "styling foundation of" }
links:
  - { title: "Tailwind CSS Documentation", url: "https://tailwindcss.com/docs" }
alsoIn: []
source: work
---

## Example
```html
<!-- Responsive card component styled with Tailwind utility classes -->
<div class="max-w-md mx-auto bg-slate-900 rounded-xl shadow-md overflow-hidden md:max-w-2xl border border-slate-800">
  <div class="p-6 flex flex-col gap-3">
    <div class="text-sm font-semibold tracking-wide text-indigo-400 uppercase">Architecture</div>
    <h3 class="text-xl font-bold text-white hover:text-indigo-300 transition-colors">Reactive State Machine</h3>
    <p class="text-slate-400 text-sm leading-relaxed">Deterministic state management with typed action dispatchers.</p>
    <button class="mt-2 w-fit px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow transition">
      Explore Node
    </button>
  </div>
</div>
```

## Key points
- **JIT compiler engine**: scans source code for class patterns and generates only the exact CSS rules needed at build time.
- **Design tokens via theme**: defines unified spacing, color palettes, breakpoints, and typography scales across the entire engineering team.
- **Arbitrary values**: allows one-off values via bracket syntax like `top-[117px]` while encouraging standard theme tokens for consistency.
