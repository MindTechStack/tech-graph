---
id: handlebars
name: "Handlebars"
kind: library
status: learned
tags: [handlebars, hbs, templating, logicless, mustache]
what: "Logic-less server-side templating engine for Node.js built on Mustache syntax, enforcing separation of business logic from views through helper functions."
why: "Prevents bloated view files by disallowing arbitrary JavaScript expressions, keeping templates declarative and predictable."
problem: "Template engines that allow arbitrary JavaScript encourage developers to embed complex business calculations and database calls directly inside presentation views."
relations:
  - { to: "server-side-templating", label: "engine for" }
  - { to: "express", label: "integrated with" }
links:
  - { title: "Handlebars Documentation", url: "https://handlebarsjs.com/" }
  - { title: "Handlebars GitHub Repository", url: "https://github.com/handlebars-lang/handlebars.js" }
alsoIn: []
source: course
---

## Example
```handlebars
{{!-- views/shop/index.hbs --}}
<main class="container">
  <h1>{{pageTitle}}</h1>
  {{#if hasProducts}}
    <div class="grid">
      {{#each products}}
        <article class="card">
          <h2>{{this.title}}</h2>
          <p>{{formatCurrency this.price}}</p>
        </article>
      {{/each}}
    </div>
  {{else}}
    <p>No products found.</p>
  {{/if}}
</main>
```

## Key points
- **Logic-less philosophy**: templates only permit basic blocks (`{{#if}}`, `{{#unless}}`, `{{#each}}`); complex calculations must be passed pre-computed from the controller or computed via registered helpers (`hbs.registerHelper`).
- **Mustache curly braces**: `{{value}}` automatically HTML-escapes content to guard against XSS; triple braces `{{{rawHtml}}}` bypass escaping when trusted HTML must be injected.
- **Express integration**: commonly integrated via `express-handlebars`, which supports default master layouts (`views/layouts/main.handlebars`) and partial directories (`views/partials/`).
