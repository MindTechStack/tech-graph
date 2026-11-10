---
id: express
name: Express.js
kind: framework
status: learned
tags: [http, routing, middleware, rest, mvc]
what: Minimalist, unopinionated web framework for Node.js built around routing and a composable middleware pipeline.
why: Eliminates boilerplate from raw node:http (URL parsing, method matching, body parsing, headers, and response helpers) while staying flexible for SSR or REST APIs.
problem: Writing raw node:http servers requires manually buffering request streams, matching URL patterns, setting headers, and chaining request handlers.
relations:
  - { to: nodejs, label: "runs on" }
  - { to: middleware, label: "built on" }
  - { to: sequelize, label: "integrates with" }
  - { to: http-status-codes, label: "uses" }
links:
  - { title: Express Docs, url: https://expressjs.com/ }
  - { title: Express 5 Migration Guide, url: https://expressjs.com/en/guide/migrating-5.html }
alsoIn: []
source: course
---

## Example
```js
import express from "express";

const app = express();
app.use(express.json());

app.get("/api/products/:id", async (req, res, next) => {
  try {
    const product = await findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
});

// Centralized 4-argument error-handling middleware
app.use((err, _req, res, _next) => {
  const status = err.statusCode ?? 500;
  res.status(status).json({ message: err.message ?? "Internal Server Error" });
});

app.listen(3000);
```

## Key points
- **Order matters**: Express evaluates `app.use()` and `app.METHOD()` registrations top-to-bottom; place 404 catch-all and 4-arg error middleware `(err, req, res, next)` at the very end.
- **Modular routers**: split feature routes into `express.Router()` modules and mount them with `app.use('/admin', adminRoutes)`.
- **Response termination**: always `return res.status(...).json(...)` on early branches to avoid `ERR_HTTP_HEADERS_SENT`.
- **Today**: Express 5 forwards rejected Promises from `async` route handlers to `next(err)` automatically; in Express 4, you had to wrap async handlers or call `next(err)` manually.
