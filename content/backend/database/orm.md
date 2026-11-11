---
id: orm
name: "ORM / ODM"
kind: concept
status: learned
tags: [orm, odm, data-mapping, database, models, abstraction]
what: "Object-Relational Mapping (ORM) and Object-Document Mapping (ODM) patterns that translate between database records and application-level objects."
why: "Accelerates backend development by providing programmatic query builders, schema validation, relationship management, and protection against injection."
problem: "Writing raw query strings manually across controllers causes repetitive boilerplate, subtle syntax typos, tedious object hydration, and SQL injection risks."
relations:
  - { to: sql, label: "abstracts" }
  - { to: nosql, label: "odm abstracts" }
  - { to: sequelize, label: "exemplified by" }
  - { to: drizzle, label: "modern type-safe orm" }
  - { to: mongoose, label: "odm implementation" }
links:
  - { title: "Martin Fowler: ORM Hatred", url: "https://martinfowler.com/bliki/OrmHate.html" }
  - { title: "Prisma What is an ORM", url: "https://www.prisma.io/dataguide/types/relational/what-is-an-orm" }
alsoIn: []
source: course
---

## Example
```ts
// Conceptual representation: Active Record vs Data Mapper patterns
// 1. Active Record (models wrap both state and database operations):
// const user = await User.findByPk(1);
// user.name = "Alice";
// await user.save();

// 2. Data Mapper / Schema-first Query Builder (entities are decoupled from persistence):
// const user = await db.query.users.findFirst({
//   where: eq(users.id, 1),
//   with: { orders: true },
// });
// await db.update(users).set({ name: "Alice" }).where(eq(users.id, 1));
```

## Key points
- **Impedance Mismatch**: Addresses the structural mismatch between relational tables (foreign keys, joins, scalar columns) and object-oriented models (references, nested graphs, methods).
- **The N+1 Query Problem**: Naively looping through parent models and accessing related children triggers N separate database queries; always use eager loading (`include` or `with`) or batch queries.
- **Modern Shift to Type Safety**: Heavy class-based ORMs with magic prototype methods are increasingly replaced by schema-first, type-safe query builders (Drizzle, Kysely) that compile directly to predictable SQL.
