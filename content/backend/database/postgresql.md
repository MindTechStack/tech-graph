---
id: postgresql
name: "PostgreSQL"
kind: platform
status: practiced
tags: [postgresql, sql, relational, rdbms, database, jsonb]
what: "Advanced, open-source object-relational database management system known for reliability, standards compliance, and extensibility."
why: "Delivers enterprise-grade ACID transactions, complex analytical queries, native JSONB support, and rich extensions like PostGIS and pgvector."
problem: "Simpler databases struggle with complex queries, partial indexes, concurrent transactional workloads, or combining structured relational data with flexible JSON documents."
relations:
  - { to: sql, label: "implements" }
  - { to: drizzle, label: "queried via" }
  - { to: sequelize, label: "supported by" }
  - { to: nodejs, label: "accessed from" }
links:
  - { title: "PostgreSQL Documentation", url: "https://www.postgresql.org/docs/" }
  - { title: "node-postgres (pg) Docs", url: "https://node-postgres.com/" }
alsoIn: []
source: personal
---

## Example
```ts
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
});

// Parameterized query preventing SQL injection with native JSONB handling
interface UserProfile {
  id: number;
  email: string;
  metadata: { theme: string; notifications: boolean };
}

const { rows } = await pool.query<UserProfile>(
  `SELECT id, email, metadata
   FROM users
   WHERE metadata->>'theme' = $1
   ORDER BY id DESC
   LIMIT $2`,
  ["dark", 10],
);

console.log(`Found ${rows.length} dark-mode users`);
```

## Key points
- **Advanced Concurrency & MVCC**: Uses Multi-Version Concurrency Control (MVCC) so read queries never block writes and writes never block reads, maximizing throughput under load.
- **Native JSONB & GIN Indexes**: Combines relational tables with indexed binary JSON documents, allowing hybrid architectures without adopting a separate NoSQL database.
- **Connection Management**: In serverless or containerized Node.js environments, use connection poolers (PgBouncer, Neon, Supabase) to prevent opening thousands of short-lived direct PostgreSQL connections.
- **Parameterized Queries**: Always use numbered parameters (`$1`, `$2`) with database drivers to separate query structure from untrusted user input.
