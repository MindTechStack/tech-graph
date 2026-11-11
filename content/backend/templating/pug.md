---
id: pug
name: "Pug"
kind: library
status: learned
tags: [pug, templating, ssr, indentation-based, views]
what: "High-performance server-side templating engine (formerly Jade) for Node.js featuring whitespace-sensitive indentation and concise HTML shorthand."
why: "Drastically reduces HTML boilerplate, enforces clean markup nesting through indentation, and includes powerful template inheritance."
problem: "Standard HTML requires tedious closing tags, verbose angle brackets, and repetitive boilerplate across every page view."
relations:
  - { to: "server-side-templating", label: "engine for" }
  - { to: "express", label: "integrated with" }
links:
  - { title: "Pug Official Documentation", url: "https://pugjs.org/api/getting-started.html" }
  - { title: "Pug GitHub Repository", url: "https://github.com/pugjs/pug" }
alsoIn: []
source: course
---

## Example
```pug
//- views/shop/index.pug
extends ../layouts/main.pug

block content
  main.container
    h1 #{pageTitle}
    if products.length > 0
      .grid
        each product in products
          article.card
            header.card__header
              h2.card__title #{product.title}
            .card__content
              p $#{product.price}
    else
      p No products found.
```

## Key points
- **Whitespace sensitivity**: uses indentation (spaces or tabs) rather than closing HTML tags (`</div>`), catching nesting errors early.
- **Template inheritance**: supports `extends layout.pug` and `block <name>` overrides, providing clean layout composition without duplicating navigation or head tags.
- **Syntactic shorthand**: tag names default to `div` when using classes (e.g. `.card` outputs `<div class="card"></div>`), keeping markup extremely compact.
