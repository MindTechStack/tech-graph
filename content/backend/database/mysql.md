---
id: mysql
name: MySQL
kind: platform
status: learned
tags: [sql, relational, database, acid, innodb]
what: Open-source relational database management system (RDBMS) based on structured tables, foreign keys, and ACID transactions.
why: Enforces strict data integrity, relational constraints, and predictable transactional guarantees for structured domain data (users, orders, products).
problem: Storing relational business data in flat files or unvalidated schemas leads to orphaned records, race conditions, and inconsistent state.
relations:
  - { to: sequelize, label: "integrates with" }
links:
  - { title: MySQL 8.4 Reference Manual, url: https://dev.mysql.com/doc/refman/8.4/en/ }
  - { title: mysql2 Node.js Driver, url: https://sidorares.github.io/node-mysql2/docs }
alsoIn: []
source: course
---

## Example
```js
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "shop",
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
});

// Always use parameterized queries (?) to prevent SQL Injection
const [rows] = await pool.execute(
  "SELECT id, title, price FROM products WHERE price <= ? ORDER BY price ASC",
  [50.0],
);
```

## Key points
- **Connection Pooling**: use `mysql.createPool()` rather than single connections so concurrent HTTP requests reuse open TCP connections.
- **Prepared Statements (`?` placeholders)**: `pool.execute('SELECT * FROM users WHERE email = ?', [email])` separates SQL structure from data, preventing SQL Injection.
- **Indexes & Foreign Keys**: index columns used in `WHERE`, `JOIN`, and `ORDER BY` clauses; use foreign keys (`ON DELETE CASCADE` / `RESTRICT`) to keep references valid.

