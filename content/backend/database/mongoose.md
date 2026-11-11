---
id: mongoose
name: "Mongoose"
kind: library
status: learned
tags: [mongoose, odm, mongodb, schemas, models, validation]
what: "Schema-based Object Document Modeling (ODM) library for MongoDB and Node.js with built-in validation, hooks, and relation population."
why: "Brings structure, type casting, validation rules, and business logic middleware to inherently schemaless MongoDB collections."
problem: "Using raw MongoDB without schema enforcement leads to inconsistent document shapes, unvalidated inputs, and boilerplate code for document relationships."
relations:
  - { to: mongodb, label: "ODM for" }
  - { to: orm, label: "implements" }
  - { to: nodejs, label: "runs on" }
  - { to: express, label: "commonly used in" }
links:
  - { title: "Mongoose Official Documentation", url: "https://mongoosejs.com/docs/" }
  - { title: "Mongoose Guide on Schemas", url: "https://mongoosejs.com/docs/guide.html" }
alsoIn: []
source: course
---

## Example
```js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    price: { type: Number, required: true, min: [0, "Price cannot be negative"] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

// Pre-save lifecycle middleware
productSchema.pre("save", function () {
  this.title = this.title.toUpperCase();
});

const Product = mongoose.model("Product", productSchema);

// Population simulates relational joins across MongoDB collections
const product = await Product.findOne({ price: { $lte: 50 } })
  .populate("userId", "email name")
  .exec();

console.log(product.userId.email);
```

## Key points
- **Schema & Validation**: Enforces field types, required constraints, enum restrictions, custom regex validators, and virtual properties before documents touch the database.
- **Population (`.populate()`)**: Resolves references (`ref`) to other collections in a separate query, providing a relational-like developer experience within a document database.
- **Middleware & Hooks**: Supports `pre` and `post` lifecycle hooks for `save`, `validate`, `remove`, and `find` operations to handle tasks like password hashing or cascading cleanup.
- **Today**: In modern TypeScript environments, teams often prefer Typegoose or the official MongoDB driver with Zod schemas to achieve strict compile-time type safety without Mongoose model overhead.
