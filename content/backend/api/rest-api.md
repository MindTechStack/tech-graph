---
id: rest-api
name: "REST API"
kind: concept
status: learned
tags: [rest, api, http, crud, json]
what: "Architectural style for network APIs based on stateless communication, standard HTTP methods (GET, POST, PUT, PATCH, DELETE), and resource-oriented URIs."
why: "Provides a predictable, uniform, and widely adopted contract for communication between web frontends, mobile apps, and microservices."
problem: "Ad-hoc remote procedure protocols invent custom endpoints and verbs, causing codebase fragmentation and breaking standard HTTP caching and proxy behaviors."
relations:
  - { to: "express", label: "implemented with" }
  - { to: "http-methods", label: "uses standard" }
  - { to: "http-status-codes", label: "returns meaningful" }
links:
  - { title: "RESTful API Design Best Practices", url: "https://restfulapi.net/" }
  - { title: "MDN HTTP Methods", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods" }
alsoIn: []
source: course
---

## Example
```js
import express from "express";

const router = express.Router();

// GET /api/v1/articles - list resources with filtering
router.get("/", async (req, res) => {
  const articles = await Article.findAll({ where: req.query });
  res.status(200).json({ data: articles });
});

// POST /api/v1/articles - create resource
router.post("/", async (req, res) => {
  const newArticle = await Article.create(req.body);
  res.status(201).json({ data: newArticle });
});

// DELETE /api/v1/articles/:id - delete resource
router.delete("/:id", async (req, res) => {
  await Article.destroy({ where: { id: req.params.id } });
  res.status(204).send();
});
```

## Key points
- **Nouns over verbs**: endpoints represent resource collections and items (`/api/v1/users`, `/api/v1/users/42`), while HTTP verbs define actions (`GET`, `POST`, `PATCH`, `DELETE`).
- **Statelessness**: every HTTP request contains all necessary authentication and parameter state; no client session state is stored on the server between requests.
- **Accurate status codes**: return `200 OK` for reads/updates, `201 Created` for creations, `204 No Content` for deletions, `400 Bad Request` for validation failures, and `404 Not Found` for missing items.
