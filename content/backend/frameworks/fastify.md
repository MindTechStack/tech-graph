---
id: fastify
name: "Fastify"
kind: framework
status: planned
tags: [fastify, http, nodejs, routing, performance, json-schema]
what: "Highly performant, low-overhead web framework for Node.js focused on speed, modular plugin architecture, and schema-based JSON serialization."
why: "Delivers 2x-4x the throughput of Express using `fast-json-stringify` and `find-my-way` router, while enforcing built-in JSON Schema validation and encapsulated plugin scopes."
problem: "Express has higher per-request overhead, unencapsulated global middleware, and relies on slower generic `JSON.stringify` serialization under high traffic."
relations:
  - { to: nodejs, label: "runs on" }
  - { to: express, label: "high-performance alternative to" }
  - { to: rest-api, label: "builds high-speed" }
  - { to: pino, label: "logs with" }
links:
  - { title: "Fastify Documentation", url: "https://fastify.dev/" }
  - { title: "Fastify GitHub", url: "https://github.com/fastify/fastify" }
alsoIn: []
source: self-study
---

## Example
```ts
import Fastify from "fastify";

interface CreateUserBody {
  name: string;
  email: string;
}

const fastify = Fastify({ logger: true });

// Declare route with JSON Schema for automatic validation and fast serialization
fastify.post<{ Body: CreateUserBody }>(
  "/api/users",
  {
    schema: {
      body: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: { type: "string", minLength: 2 },
          email: { type: "string", format: "email" },
        },
      },
      response: {
        201: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
          },
        },
      },
    },
  },
  async (request, reply) => {
    const { name, email } = request.body;
    return reply.status(201).send({ id: "usr_123", name, email });
  },
);

await fastify.listen({ port: 3000 });
```

## Key points
- **Schema-driven serialization**: compiling response schemas with `fast-json-stringify` skips generic `JSON.stringify` overhead, dramatically improving response times and throughput.
- **Encapsulated plugin architecture**: `fastify-plugin` provides hierarchical scopes where decorators, hooks, and middleware only apply to children, avoiding leaky global state.
- **Zero-overhead logging**: integrated with Pino by default (`Fastify({ logger: true })`), serializing structured JSON logs asynchronously without blocking the event loop.
