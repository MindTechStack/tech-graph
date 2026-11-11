---
id: node-http
name: "Node http module"
kind: library
status: learned
tags: [http, server, networking, low-level, built-in]
what: "Built-in Node.js module (node:http and node:https) providing low-level primitives to create HTTP web servers and perform outgoing network requests."
why: "Forms the foundational networking layer upon which higher-level web frameworks like Express, Fastify, and Koa are constructed."
problem: "Relying entirely on high-level abstractions hides stream lifecycle events, raw TCP socket behavior, and header serialization mechanics."
relations:
  - { to: "nodejs", label: "built-in module of" }
  - { to: "node-fs", label: "pairs with for static file serving" }
  - { to: "streams-buffers", label: "implements request and response as" }
links:
  - { title: "Node.js HTTP API", url: "https://nodejs.org/api/http.html" }
  - { title: "Node.js HTTPS API", url: "https://nodejs.org/api/https.html" }
alsoIn: []
source: course
---

## Example
```js
import http from "node:http";

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === "POST" && url === "/api/messages") {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ received: body, timestamp: Date.now() }));
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(3000, () => console.log("HTTP server running on port 3000"));
```

## Key points
- **Streaming req and res**: `req` is an `IncomingMessage` (Readable stream) and `res` is a `ServerResponse` (Writable stream); bodies must be streamed or buffered from chunks.
- **Header lifecycle**: headers must be set via `res.setHeader()` or written with `res.writeHead()` before the first byte of body content is written to avoid `ERR_HTTP_HEADERS_SENT`.
- **Low-level nature**: lacks built-in route pattern matching, query string parsing, or middleware pipelines, making direct usage verbose for complex production APIs.
