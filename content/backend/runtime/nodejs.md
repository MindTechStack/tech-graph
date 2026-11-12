---
id: nodejs
name: Node.js
kind: platform
status: practiced
core: true
tags: [javascript, runtime, v8, backend, non-blocking]
what: Cross-platform JavaScript runtime built on Chrome's V8 engine and libuv for executing JavaScript outside the browser.
why: Enables building fast, scalable network servers, CLI tools, and build pipelines using a single event-driven, non-blocking I/O model.
problem: Browser JavaScript had no access to the OS file system, TCP sockets, or processes, and traditional thread-per-request servers struggled with high I/O concurrency.
relations:
  - { to: javascript, label: "executes" }
  - { to: event-loop, label: "built on" }
  - { to: npm, label: "packaged with" }
  - { to: express, label: "runs" }
  - { to: deno, label: "alternative to" }
links:
  - { title: Official Docs, url: https://nodejs.org/en/docs }
  - { title: Event Loop Guide, url: https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick }
alsoIn: []
source: personal
---

## Example
```js
import http from "node:http";

const server = http.createServer((req, res) => {
  if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, uptime: process.uptime() }));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
```

## Key points
- **Single-threaded JS execution + libuv thread pool**: CPU-light, I/O-heavy workloads scale well because file/network operations are offloaded asynchronously.
- **Never block the Event Loop**: heavy synchronous computation (`JSON.parse` on huge payloads, sync `fs.*Sync`, complex regex) stalls all concurrent requests.
- **Built-in modules (`node:*`)**: prefer `node:fs/promises`, `node:path`, `node:http`, `node:crypto`, and `node:stream` with explicit `node:` prefixes.
- **Today**: Modern Node (v20–24+) includes native `fetch`, `--watch`, `--env-file`, built-in test runner (`node:test`), and experimental/native TypeScript stripping.

