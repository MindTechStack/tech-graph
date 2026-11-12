---
id: hono
name: "Hono"
kind: framework
status: practiced
core: true
tags: [hono, edge, typescript, web-standards, ultrafast]
what: "Ultrafast, lightweight, web-standards-based web framework designed to run anywhere: Cloudflare Workers, Fastly, Deno, Bun, Node.js, and AWS Lambda."
why: "Offers phenomenal performance, zero third-party dependencies, first-class TypeScript inference (RPC client), and unified cross-runtime portability."
problem: "Traditional Node.js frameworks like Express rely on Node-specific APIs (IncomingMessage, ServerResponse), making them incompatible with modern Edge and serverless runtimes."
relations:
  - { to: "express", label: "modern alternative to" }
  - { to: "rest-api", label: "builds high-speed" }
  - { to: "deno", label: "runs natively on" }
links:
  - { title: "Hono Official Documentation", url: "https://hono.dev/" }
  - { title: "Hono GitHub Repository", url: "https://github.com/honojs/hono" }
alsoIn: []
source: personal
---

## Example
```ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const app = new Hono();

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

app.post("/api/users", zValidator("json", userSchema), (c) => {
  const validated = c.req.valid("json");
  return c.json({ success: true, user: validated }, 201);
});

export default app;
```

## Key points
- **Web Standards native**: built entirely on standard `Request`, `Response`, and `Fetch API`, enabling identical application code to deploy across Cloudflare Workers, Deno, Bun, and Node.js.
- **End-to-end typed RPC**: using `hc<AppType>()`, frontend applications can consume backend endpoints with full TypeScript type inference and autocompletion without code generation.
- **Blazing fast routing**: employs RegExpRouter and SmartRouter algorithms that optimize route dispatching down to nanoseconds with zero memory allocations per request.
