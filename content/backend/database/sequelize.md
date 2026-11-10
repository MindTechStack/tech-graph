---
id: sequelize
name: Sequelize
kind: library
status: learned
tags: [orm, sql, mysql, postgresql, models]
what: Promise-based ORM for Node.js that maps SQL tables and relations (MySQL, PostgreSQL, SQLite, MariaDB) to JavaScript models.
why: Lets you define schemas, associations (1:1, 1:N, N:M), and queries in JavaScript without writing repetitive SQL strings by hand.
problem: Raw SQL queries scattered across controllers are verbose, vulnerable to SQL injection when interpolated improperly, and tedious to map into nested objects.
relations:
  - { to: mysql, label: "ORM for" }
  - { to: nodejs, label: "runs on" }
links:
  - { title: Sequelize v6 Docs, url: https://sequelize.org/docs/v6/ }
alsoIn: []
source: course
---

## Example
```js
import { DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize("shop", "root", process.env.DB_PASS, {
  dialect: "mysql",
  host: "localhost",
});

const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
});

const User = sequelize.define("User", {
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
});

// Associations automatically generate foreign keys and helper methods (e.g. user.createProduct())
User.hasMany(Product, { onDelete: "CASCADE" });
Product.belongsTo(User);

await sequelize.sync();
```

## Key points
- **Associations**: `hasOne`, `belongsTo`, `hasMany`, and `belongsToMany({ through: CartItem })` automatically inject magic methods onto model instances (`user.getProducts()`, `user.addProduct()`).
- **Eager vs Lazy Loading**: pass `{ include: [Product] }` in `findAll()` to fetch relations in a single `JOIN` instead of triggering the N+1 query problem.
- **`sequelize.sync()` vs Migrations**: `sync({ alter: true })` is fine in courses and prototypes, but production databases should always use explicit CLI migrations (`umzug` / `sequelize-cli`).
- **Today**: For new TypeScript projects, **Drizzle ORM** or **Prisma** are usually preferred over Sequelize v6 because of first-class static type inference.
