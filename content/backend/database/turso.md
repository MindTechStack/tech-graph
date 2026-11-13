---
id: turso
name: "Turso / libSQL (SQLite)"
kind: service
status: practiced
tags: [turso, libsql, sqlite, edge, serverless, database]
what: "Hosted database built on libSQL, an open fork of SQLite, with replicas close to edge and serverless functions."
why: "Provides sub-millisecond read latencies through global replication, instantaneous connection establishment over HTTP/WebSockets, and lightweight SQLite simplicity."
problem: "Traditional relational databases introduce high network latency when queried from global edge runtimes and require heavyweight persistent TCP connection pools."
relations:
  - { to: sql, label: "implements" }
  - { to: drizzle, label: "queried with" }
  - { to: nodejs, label: "client runs on" }
links:
  - { title: "Turso Official Documentation", url: "https://docs.turso.tech/" }
  - { title: "libSQL GitHub Repository", url: "https://github.com/tursodatabase/libsql" }
alsoIn: []
source: personal
---

## Example
```ts
import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "libsql://my-db.turso.io",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Execute parameterized query over HTTP/WebSocket without persistent TCP pooling
const result = await db.execute({
  sql: "SELECT id, title, price FROM products WHERE category = ? ORDER BY price ASC LIMIT ?",
  args: ["books", 5],
});

for (const row of result.rows) {
  console.log(`${row.title}: $${row.price}`);
}
```

## Key points
- **SQLite at the Edge**: Operates over HTTP and WebSockets, making it ideal for stateless serverless functions (Vercel, Cloudflare Workers) where opening traditional TCP connections is slow.
- **Embedded Replicas**: Allows running a local SQLite database file on server disk that automatically syncs writes back to the primary cloud Turso database, achieving zero-latency reads.
- **Schema Migrations**: Seamlessly integrates with Drizzle ORM and Drizzle Kit using the SQLite dialect, offering full compile-time type safety with zero runtime binary overhead.
