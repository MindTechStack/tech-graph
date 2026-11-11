---
id: sql
name: "SQL (relational databases)"
kind: concept
status: learned
tags: [sql, relational, database, acid, queries]
what: "Standard declarative query language for managing, querying, and enforcing constraints on structured relational data."
why: "Provides strong schema integrity, relational joins, ACID transactions, and declarative query optimization across relational databases."
problem: "Storing structured relational business data without a standard declarative language leads to brittle manual filtering, data anomalies, and lack of transaction guarantees."
relations:
  - { to: mysql, label: "dialect implemented by" }
  - { to: postgresql, label: "dialect implemented by" }
  - { to: orm, label: "abstracted by" }
  - { to: nosql, label: "contrasted with" }
links:
  - { title: "ISO SQL Language Overview", url: "https://en.wikipedia.org/wiki/SQL" }
  - { title: "PostgreSQL SQL Tutorial", url: "https://www.postgresql.org/docs/current/tutorial-sql.html" }
alsoIn: []
source: course
---

## Example
```sql
-- DDL: Defining schema constraints and relational foreign keys
CREATE TABLE users (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  status VARCHAR(50) DEFAULT 'pending'
);

-- DML: Relational query with JOIN and aggregation
SELECT
  u.email,
  COUNT(o.id) AS order_count,
  COALESCE(SUM(o.total_amount), 0) AS lifetime_value
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.email
HAVING COUNT(o.id) > 0
ORDER BY lifetime_value DESC;
```

## Key points
- **ACID Guarantees**: Relational databases guarantee Atomicity, Consistency, Isolation, and Durability, ensuring multi-table operations (e.g. money transfers) commit completely or safely roll back.
- **Declarative Querying**: You specify *what* data you need (`SELECT ... JOIN ... WHERE`), allowing the database engine's cost-based query optimizer to pick the optimal execution plan.
- **Normalization vs Joins**: Schemas are normalized into separate tables to eliminate data redundancy and anomalies; foreign keys enforce referential integrity across related entities.
