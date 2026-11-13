---
id: deno
name: "Deno"
kind: platform
status: learned
tags: [deno, runtime, typescript, rust, v8]
what: "JavaScript and TypeScript runtime on V8 and Rust with built-in tooling, web-standard APIs and permissions that are off by default."
why: "Provides native TypeScript execution without transpilation steps, standard Web APIs (fetch, Request, Response), and granular command-line permission controls."
problem: "Node.js historically suffered from fragmented build toolchains (separate test, lint, format setups), complete lack of runtime security permissions, and CommonJS legacy quirks."
relations:
  - { to: "nodejs", label: "modern alternative to" }
  - { to: "oak", label: "host runtime for" }
  - { to: "typescript", label: "executes natively" }
links:
  - { title: "Deno Documentation", url: "https://docs.deno.com/" }
  - { title: "Deno Standard Library", url: "https://docs.deno.com/runtime/fundamentals/standard_library/" }
alsoIn: []
source: course
---

## Example
```ts
// server.ts — run with: deno run --allow-net server.ts
Deno.serve({ port: 8000 }, (req: Request): Response => {
  const url = new URL(req.url);

  if (url.pathname === "/health") {
    return Response.json({ status: "healthy", runtime: "Deno" });
  }

  return new Response("Not Found", { status: 404 });
});
```

## Key points
- **Explicit permissions**: by default, scripts run in a secure sandbox without disk, network, or environment access unless granted via flags (e.g. `--allow-net`, `--allow-read`).
- **Web standards first**: uses standard browser APIs (`fetch`, `Request`, `Response`, `URL`, `WebSocket`, `ReadableStream`) instead of proprietary runtime modules.
- **Batteries-included toolchain**: ships with native linter (`deno lint`), code formatter (`deno fmt`), test runner (`deno test`), and package manager supporting npm packages (`npm:express`).
