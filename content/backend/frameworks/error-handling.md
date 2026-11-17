---
id: error-handling
name: "Error Handling (sync, async, global)"
short: Error Handling
kind: concept
status: learned
tags: [errors, exception-handling, middleware, express, reliability]
what: "Patterns and runtime mechanisms for catching, formatting, logging, and responding to synchronous and asynchronous exceptions across a backend server."
why: "Prevents servers from crashing unexpectedly, stops internal stack traces from leaking to clients, and ensures uniform HTTP error responses."
problem: "Uncaught asynchronous errors trigger unhandledRejection events that crash Node.js processes, while missing error middleware leaves client requests hanging indefinitely."
relations:
  - { to: "express", label: "centralized in" }
  - { to: "async-await", label: "handles rejected promises in" }
  - { to: "http-status-codes", label: "maps to appropriate" }
links:
  - { title: "Express Error Handling Guide", url: "https://expressjs.com/en/guide/error-handling.html" }
  - { title: "Node.js Error Handling Best Practices", url: "https://nodejs.org/en/learn/getting-started/error-handling" }
alsoIn: []
source: course
---

## Example
```js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Centralized 4-argument error middleware (must be registered last)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isDev = process.env.NODE_ENV === "development";

  res.status(statusCode).json({
    status: "error",
    message: err.isOperational ? err.message : "Internal Server Error",
    ...(isDev && { stack: err.stack }),
  });
});
```

## Key points
- **Express 4-argument signature**: error middleware MUST declare all four parameters `(err, req, res, next)` for Express to route thrown or `next(err)` errors to it.
- **Operational vs programmer errors**: distinguish expected operational errors (404 Not Found, 400 Bad Request, 401 Unauthorized) from unexpected system bugs (TypeError, null reference).
- **Process crash safeguards**: register process listeners for `uncaughtException` and `unhandledRejection` to record fatal diagnostics and gracefully restart worker processes.
