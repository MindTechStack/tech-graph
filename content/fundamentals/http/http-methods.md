---
id: http-methods
name: "HTTP Methods"
kind: concept
status: learned
tags: [http, rest, crud, api, idempotency]
what: "Standard request verbs (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS) that indicate the desired action to be performed on a target resource."
why: "Provides semantic clarity for CRUD operations, enabling HTTP caches, proxies, and web frameworks to apply correct safety and idempotency rules."
problem: "Using GET for state mutations risks unintended side effects from link prefetching or crawler indexing, while using POST for everything breaks HTTP caching."
relations:
  - { to: http, label: "part of" }
  - { to: rest-api, label: "uses" }
  - { to: express, label: "integrates with" }
links:
  - { title: "MDN HTTP Request Methods", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods" }
  - { title: "RFC 9110 — Method Definitions", url: "https://www.rfc-editor.org/rfc/rfc9110#name-method-definitions" }
alsoIn: []
source: course
---

## Safe & Idempotent Methods Matrix

| Method | Safe | Idempotent | Request Body | Purpose / Semantics |
|---|---|---|---|---|
| `GET` | Yes | Yes | No | Retrieve representation of a resource without side effects. |
| `HEAD` | Yes | Yes | No | Retrieve identical response headers as `GET` without the body payload. |
| `POST` | No | No | Yes | Create subordinate resource or submit data for server processing. |
| `PUT` | No | Yes | Yes | Replace the entire target resource state with the request payload. |
| `PATCH` | No | No | Yes | Apply partial modifications or delta updates to a resource. |
| `DELETE` | No | Yes | Optional | Remove the identified target resource. |
| `OPTIONS` | Yes | Yes | No | Describe communication options/methods supported by the target resource (CORS preflight). |

## Example
```ts
import express, { type Request, type Response } from "express";

const router = express.Router();

// GET: Safe and idempotent - read operation
router.get("/articles/:id", async (req: Request, res: Response) => {
  const article = await findArticle(req.params.id);
  res.json(article);
});

// POST: Not idempotent - creates a new article each time
router.post("/articles", async (req: Request, res: Response) => {
  const newArticle = await createArticle(req.body);
  res.status(201).json(newArticle);
});

// PUT: Idempotent - completely replaces the article
router.put("/articles/:id", async (req: Request, res: Response) => {
  const updated = await replaceArticle(req.params.id, req.body);
  res.json(updated);
});

// PATCH: Partial update - updates only specified fields
router.patch("/articles/:id", async (req: Request, res: Response) => {
  const patched = await updateArticleFields(req.params.id, req.body);
  res.json(patched);
});

// DELETE: Idempotent - deleting an already deleted resource returns success or 404
router.delete("/articles/:id", async (req: Request, res: Response) => {
  await deleteArticle(req.params.id);
  res.status(204).send();
});
```

## Key points
- **Safe vs Idempotent**: a *safe* method does not alter server state (`GET`, `HEAD`, `OPTIONS`); an *idempotent* method can be executed multiple times with the exact same side-effect outcome as a single execution (`PUT`, `DELETE`).
- **PUT vs PATCH**: `PUT` requires transmitting the complete new resource state (omitted fields are replaced/cleared); `PATCH` sends only the fields to be modified.
- **Never mutate state via GET**: web crawlers, browser link prefetching, and network retries assume `GET` requests are safe to invoke at will.
