---
id: ejs
name: "EJS"
kind: library
status: learned
tags: [ejs, templating, ssr, javascript-templates, express]
what: "Server-side templating engine for Node.js that embeds plain JavaScript in HTML with `<% %>` tags."
why: "Has zero learning curve for developers because templates are standard HTML with familiar JavaScript control structures (if/else, for loops)."
problem: "Specialized syntax templating engines require learning proprietary markup and converting existing HTML mockups or designer templates."
relations:
  - { to: "server-side-templating", label: "engine for" }
  - { to: "express", label: "integrated with" }
links:
  - { title: "EJS Documentation", url: "https://ejs.co/" }
  - { title: "EJS GitHub Repository", url: "https://github.com/mde/ejs" }
alsoIn: []
source: course
---

## Example
```html
<!-- views/shop/index.ejs -->
<%- include('../includes/head.ejs') %>
<main class="container">
  <h1><%= pageTitle %></h1>
  <% if (products.length > 0) { %>
    <div class="grid">
      <% for (const product of products) { %>
        <article class="card">
          <h2><%= product.title %></h2>
          <p>$<%= product.price.toFixed(2) %></p>
        </article>
      <% } %>
    </div>
  <% } else { %>
    <p>No products available.</p>
  <% } %>
</main>
<%- include('../includes/end.ejs') %>
```

## Key points
- **Scriptlet tags**: `<%= value %>` safely escapes HTML entities; `<%- value %>` outputs unescaped raw HTML (use carefully); `<% code %>` executes JavaScript logic without rendering.
- **Partial inclusions**: modularize reusable UI components (navbars, footers, card widgets) using `<%- include('includes/navbar', { user }) %>`.
- **Pure JavaScript execution**: permits arbitrary JavaScript expressions inside views; development discipline is needed to avoid placing heavy business or database logic inside templates.
