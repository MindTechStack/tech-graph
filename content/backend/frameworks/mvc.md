---
id: mvc
name: "MVC pattern"
kind: concept
status: learned
tags: [architecture, design-pattern, separation-of-concerns, controllers, models]
what: "Architectural design pattern that separates backend applications into Models (data and business logic), Views (presentation and templates), and Controllers (request dispatching and coordination)."
why: "Prevents bloated monolithic handlers and tangled codebases by establishing a clear separation of concerns, making code easier to test, refactor, and maintain."
problem: "Without architectural boundaries, routing, database queries, validation rules, and HTML or JSON generation collide in giant unstructured request functions."
relations:
  - { to: "express", label: "structured within" }
  - { to: "server-side-templating", label: "renders views using" }
  - { to: "orm", label: "implements models via" }
links:
  - { title: "MDN MVC Architecture", url: "https://developer.mozilla.org/en-US/docs/Glossary/MVC" }
  - { title: "Express Application Structure", url: "https://expressjs.com/en/starter/generator.html" }
alsoIn: []
source: course
---

## Example
```js
// controllers/productController.js
import { Product } from "../models/product.js";

export async function getProducts(req, res, next) {
  try {
    const products = await Product.findAll();
    res.render("shop/product-list", {
      products,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (err) {
    next(err);
  }
}

// routes/shop.js
// router.get('/products', getProducts);
```

## Key points
- **Model owns data and rules**: encapsulates schema definitions, validation logic, and database operations without knowing anything about HTTP or rendering.
- **Controller coordinates flow**: extracts input from `req.params`, `req.query`, and `req.body`, delegates to models, and selects views or formats JSON responses.
- **View presents results**: renders HTML templates or structured JSON; in modern SPA architectures, views are decoupled into separate frontend clients.
