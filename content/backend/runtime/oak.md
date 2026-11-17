---
id: oak
name: "Oak (Deno web framework)"
short: Oak
kind: framework
status: learned
tags: [deno, oak, web-framework, middleware, router]
what: "Koa-style middleware framework for HTTP servers on Deno."
why: "Brings familiar Express/Koa-style middleware composition, routing, and error cascades to the modern Deno runtime with first-class TypeScript support."
problem: "Building complex multi-route applications using only raw Deno.serve requires manually parsing URL paths, matching HTTP verbs, and chaining async middleware."
relations:
  - { to: "deno", label: "framework for" }
  - { to: "middleware", label: "architected around" }
  - { to: "rest-api", label: "used to build" }
links:
  - { title: "Oak Documentation", url: "https://oakserver.github.io/oak/" }
  - { title: "Oak on Deno Land", url: "https://deno.land/x/oak" }
alsoIn: []
source: course
---

## Example
```ts
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();
router.get("/api/books/:id", (ctx) => {
  const bookId = ctx.params.id;
  ctx.response.body = { id: bookId, title: "Deno in Action" };
});

const app = new Application();

// Centralized error handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = { error: (err as Error).message };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
```

## Key points
- **Context abstraction (`ctx`)**: groups `ctx.request`, `ctx.response`, `ctx.state`, and `ctx.params` into a single object passed through middleware functions.
- **Async onion middleware**: downstream middleware is called via `await next()`, allowing responses and execution times to be intercepted as execution bubbles back up.
- **Router capabilities**: `Router` supports dynamic URL parameters, route-specific middleware, and automatic HTTP 405 Method Not Allowed handling via `router.allowedMethods()`.
