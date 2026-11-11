---
id: scalar
name: "Scalar / OpenAPI"
kind: tool
status: planned
tags: [scalar, openapi, swagger, api-documentation, api-client]
what: "A modern, interactive OpenAPI documentation and API testing client designed as a fast, beautiful replacement for Swagger UI."
why: "Generates interactive API reference documentation with an embedded API client, code generation in multiple languages, and instant schema validation."
problem: "Legacy Swagger UI is visually dated, clunky on mobile devices, difficult to theme, and provides a poor interactive request-testing experience."
relations:
  - { to: api-clients, label: "part of" }
  - { to: hono, label: "integrates with" }
  - { to: express, label: "integrates with" }
links:
  - { title: "Scalar Documentation", url: "https://github.com/scalar/scalar" }
  - { title: "Scalar Official Site", url: "https://scalar.com/" }
alsoIn: []
source: self-study
---

## Example
```ts
// Embedding Scalar interactive API reference directly in an Express or Hono server
import express from "express";
import { apiReference } from "@scalar/express-api-reference";

const app = express();

// Serve interactive API documentation and testing UI at /reference
app.use(
  "/reference",
  apiReference({
    theme: "purple",
    spec: {
      url: "/openapi.json", // Path to OpenAPI 3.1 specification
    },
    defaultHttpClient: {
      targetKey: "node",
      clientKey: "fetch",
    },
  })
);

app.get("/openapi.json", (req, res) => {
  res.sendFile("./openapi.json", { root: "." });
});
```

## Key points
- **Modern Swagger replacement**: renders clean, responsive, dark-mode-ready documentation with keyboard shortcuts and search navigation.
- **Embedded API client**: consumers can test endpoints directly in the docs interface, select authentications, and view formatted responses.
- **Multi-language code snippets**: automatically generates copy-pasteable client code snippets in cURL, JavaScript, TypeScript, Python, Go, Ruby, and PHP.
