---
id: mongodb
name: "MongoDB"
kind: platform
status: practiced
tags: [mongodb, nosql, document-database, bson, collections]
what: "Document database that stores records as JSON-like BSON documents without a fixed schema."
why: "Enables developers to persist nested JavaScript objects naturally, query deep subdocument fields, and scale horizontally through replica sets and sharding."
problem: "Storing hierarchical nested business entities in normalized relational tables requires splitting them across multiple foreign-key tables and joining on every read."
relations:
  - { to: nosql, label: "implements" }
  - { to: mongoose, label: "modeled via" }
  - { to: nodejs, label: "connected from" }
  - { to: sessions, label: "persists sessions for" }
links:
  - { title: "MongoDB Documentation", url: "https://www.mongodb.com/docs/" }
  - { title: "MongoDB Node Driver Quick Start", url: "https://www.mongodb.com/docs/drivers/node/current/quick-start/" }
alsoIn: []
source: course
---

## Example
```js
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI ?? "mongodb://localhost:27017");
await client.connect();

const db = client.db("shop");
const products = db.collection("products");

// Insert a document with nested data
const insertResult = await products.insertOne({
  title: "Noise-Cancelling Headphones",
  price: 299.99,
  details: { brand: "Acoustic", wireless: true, batteryHours: 30 },
  tags: ["audio", "electronics"],
  createdAt: new Date(),
});

// Query by nested field and update document atomically
await products.updateOne(
  { _id: new ObjectId(insertResult.insertedId) },
  { $set: { "details.batteryHours": 35 }, $inc: { stock: -1 } },
);
```

## Key points
- **BSON and ObjectId**: Documents are stored in binary BSON format, supporting Date, binary data, and auto-generated 12-byte `ObjectId` primary keys with embedded creation timestamps.
- **Atomic Document Updates**: Single-document operations are ACID compliant; operators like `$set`, `$inc`, `$push`, and `$pull` mutate nested fields without replacing the whole document.
- **Rich Aggregation Pipelines**: Multi-stage aggregation framework (`$match`, `$group`, `$unwind`, `$lookup`) allows complex analytics and data transformations directly on the database engine.
- **Indexing Strategies**: Index single fields, compound keys, and nested subfields (`db.products.createIndex({ "details.brand": 1 })`) to prevent unindexed full collection scans.
