---
id: drizzle
name: "Drizzle ORM"
kind: library
status: practiced
tags: [drizzle, orm, typescript, sql, database, type-safety]
what: "Lightweight, headless TypeScript ORM and query builder that brings end-to-end type safety while keeping queries as close to SQL as possible."
why: "Provides exact TypeScript type inference from schema definitions, zero engine binary overhead, and unified support for PostgreSQL, MySQL, and SQLite/Turso."
problem: "Traditional heavyweight ORMs hide underlying SQL execution behind magic abstraction layers, slow down cold starts, and suffer from out-of-sync type generation."
relations:
  - { to: orm, label: "implements" }
  - { to: postgresql, label: "supports" }
  - { to: turso, label: "supports" }
  - { to: typescript, label: "deeply leverages" }
  - { to: nodejs, label: "runs on" }
links:
  - { title: "Drizzle ORM Documentation", url: "https://orm.drizzle.team/" }
  - { title: "Drizzle Kit Overview", url: "https://orm.drizzle.team/docs/kit-overview" }
alsoIn: []
source: personal
---

## Example
```ts
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { Pool } from "pg";

// 1. Define schema as code
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Infer TypeScript models automatically
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// 2. Query with complete type safety
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const result: User[] = await db
  .select()
  .from(users)
  .where(eq(users.email, "alex@example.com"));
```

## Key points
- **If You Know SQL, You Know Drizzle**: The query API directly mirrors SQL structure (`db.select().from().where()`), avoiding opaque ORM query abstraction leaks and mental overhead.
- **Single Source of Truth**: Schema definitions written in TypeScript directly yield static types (`$inferSelect`, `$inferInsert`) and generate SQL migrations through Drizzle Kit.
- **Zero Binary & Serverless Friendly**: Unlike Prisma, Drizzle has no external C++/Rust engine binary, resulting in tiny bundle sizes and instantaneous cold starts on edge and serverless platforms.
