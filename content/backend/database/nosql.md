---
id: nosql
name: "NoSQL"
kind: concept
status: learned
tags: [nosql, document-store, database, unstructured, schema-free]
what: "Non-relational database paradigm designed for flexible schemas, horizontal scaling, and high-throughput document, key-value, or graph storage."
why: "Ideal for rapidly iterating schemas, hierarchical JSON documents, caching, and distributed workloads where relational join overhead is undesirable."
problem: "Strict relational table schemas require extensive migration ceremonies and multiple table joins to represent polymorphic, deeply nested, or rapidly changing domain data."
relations:
  - { to: sql, label: "contrasted with" }
  - { to: mongodb, label: "exemplified by" }
  - { to: orm, label: "abstracted by odm" }
links:
  - { title: "MongoDB NoSQL Explained", url: "https://www.mongodb.com/nosql-explained" }
  - { title: "AWS What is NoSQL", url: "https://aws.amazon.com/nosql/" }
alsoIn: []
source: course
---

## Example
```json
// Example of a single denormalized document in a NoSQL document database
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "orderNumber": "ORD-2026-9041",
  "customer": {
    "name": "Alice Smith",
    "email": "alice@example.com"
  },
  "items": [
    { "productId": "PROD-101", "name": "Mechanical Keyboard", "quantity": 1, "price": 120.00 },
    { "productId": "PROD-204", "name": "USB-C Braided Cable", "quantity": 2, "price": 15.00 }
  ],
  "shippingAddress": {
    "street": "100 Tech Way",
    "city": "Austin",
    "zip": "78701"
  },
  "status": "processing",
  "createdAt": "2026-11-10T08:30:00Z"
}
```

## Key points
- **NoSQL Data Models**: Spans Document databases (MongoDB), Key-Value caches (Redis), Wide-Column stores (Cassandra), and Graph databases (Neo4j), each optimized for specific access patterns.
- **Embedding vs Referencing**: In document databases, embed data that is always read and written together (`order.items`), but reference separate collections for entities with independent lifecycles (`customer.id`).
- **Horizontal Scaling & CAP Theorem**: Designed to partition easily across multiple nodes (sharding), often choosing high availability and partition tolerance (AP) or tunable eventual consistency.
