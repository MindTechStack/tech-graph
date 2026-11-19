---
id: cors
name: "CORS"
kind: concept
status: work
tags: [cors, security, http, browser-apis, express]
what: "Cross-Origin Resource Sharing is an HTTP-header-based browser security mechanism that restricts web applications from loading resources from a different origin."
why: "Enables secure cross-origin API calls between client frontends (e.g., localhost:5173 or spa.com) and separate backend APIs (e.g., localhost:3000 or api.com)."
problem: "Without CORS, malicious scripts running on evil.com could use the user's ambient credentials (cookies) to execute unauthorized authenticated API requests."
relations:
  - { to: http, label: "part of" }
  - { to: express, label: "integrates with" }
  - { to: browser-apis, label: "protects against" }
  - { to: rest-api, label: "integrates with" }
links:
  - { title: "MDN Cross-Origin Resource Sharing (CORS)", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" }
  - { title: "Express cors middleware", url: "https://expressjs.com/en/resources/middleware/cors.html" }
alsoIn: []
source: course
---

## Example
```ts
import cors from "cors";
import express from "express";

const app = express();

const whitelist = new Set([
  "http://localhost:5173",
  "https://app.example.com",
]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or tools without origin (Postman/curl)
      if (!origin || whitelist.has(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked origin: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true, // Allow cookies and Authorization headers
    maxAge: 86400, // Cache preflight response for 24 hours (in seconds)
  })
);

app.get("/api/profile", (req, res) => {
  res.json({ user: "Alice", role: "admin" });
});
```

## Key points
- **Browser-only enforcement**: CORS is enforced exclusively by web browsers; server-to-server HTTP calls, cURL, and mobile apps ignore CORS headers completely.
- **Preflight `OPTIONS` request**: browsers automatically send an `OPTIONS` probe before non-simple requests (methods other than GET/POST/HEAD, custom headers like `Authorization`, or non-form content types like `application/json`).
- **Credentials and wildcards conflict**: when `credentials: true` is enabled (for cookies/tokens), the response header `Access-Control-Allow-Origin` cannot be wildcard `*`; it must match the specific requesting origin explicitly.
