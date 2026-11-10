---
id: middleware
name: Middleware
kind: concept
status: learned
tags: [pipeline, request-lifecycle, express, auth, validation]
what: Functions with access to the incoming request (req), outgoing response (res), and the next(err?) callback in the request-response pipeline.
why: Decouples cross-cutting concerns—logging, body parsing, CORS, authentication, validation, and error handling—from business route controllers.
problem: Without a composable pipeline, every route handler must duplicate authentication checks, payload parsing, logging, and error formatting.
relations:
  - { to: express, label: "part of" }
  - { to: http-status-codes, label: "uses" }
links:
  - { title: Using Middleware in Express, url: https://expressjs.com/en/guide/using-middleware.html }
alsoIn: []
source: course
---

## Example
```js
// 1. Application-level timing middleware
export function requestLogger(req, res, next) {
  const start = performance.now();
  res.on("finish", () => {
    const ms = (performance.now() - start).toFixed(1);
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
}

// 2. Route guard middleware
export function requireAuth(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

// 3. Error-handling middleware (must have 4 parameters!)
export function errorHandler(err, _req, res, _next) {
  res.status(err.statusCode || 500).json({ error: err.message });
}
```

## Key points
- **Two choices per middleware**: either end the request-response cycle (`res.json(...)`, `res.redirect(...)`) OR call `next()` to pass control downstream. Doing neither hangs the request; doing both causes `Cannot set headers after they are sent`.
- **Error shortcut**: calling `next(error)` skips all remaining regular middleware/routes and jumps directly to the first 4-argument `(err, req, res, next)` error handler.
- **Scoping**: mount globally via `app.use(fn)`, per router via `router.use(fn)`, or per route as `app.post('/orders', requireAuth, validateOrder, createOrder)`.
