---
id: supertest
name: "Supertest"
kind: library
status: planned
tags: [testing, http-testing, integration-testing, api-testing, express]
what: "High-level HTTP assertion library built on SuperAgent for testing Node.js HTTP servers without binding to network ports."
why: "Enables fast, end-to-end integration tests of Express and Connect routes, status codes, headers, and JSON response bodies via in-memory ephemeral listeners."
problem: "Testing HTTP endpoints with raw fetch or axios requires managing real port conflicts, starting background servers, and cleaning up hanging TCP connections."
relations:
  - { to: "express", label: "tests HTTP endpoints of" }
  - { to: "jest", label: "executed in" }
  - { to: "mocha", label: "executed in" }
  - { to: "http-status-codes", label: "verifies" }
links:
  - { title: "Supertest Documentation", url: https://github.com/ladjs/supertest }
alsoIn: []
source: self-study
---

## Example
```js
import request from "supertest";
import { describe, it } from "@jest/globals";
import express from "express";

const app = express();
app.use(express.json());

app.post("/api/users", (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({ error: "Email is required" });
  }
  return res.status(201).json({ id: 1, email: req.body.email });
});

describe("POST /api/users", () => {
  it("creates user and returns 201 with created record", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ email: "newuser@example.com" })
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toEqual({
      id: 1,
      email: "newuser@example.com",
    });
  });

  it("returns 400 when email is omitted", async () => {
    await request(app)
      .post("/api/users")
      .send({})
      .expect(400, { error: "Email is required" });
  });
});
```

## Key points
- **Core mental model**: Ephemeral server abstraction — pass the Express `app` instance directly to `request(app)`; Supertest automatically creates an in-memory HTTP server on an ephemeral port and tears it down after the request.
- **Common pitfall**: Passing an already listening `app.listen()` server instance instead of the raw `app` export; if `app.listen()` is called inside the app module, parallel test runners will crash with `EADDRINUSE`.
- **Today**: Supertest remains the gold standard for HTTP integration testing in Express and Fastify apps, commonly combined with Jest or Vitest for automated API test suites.
