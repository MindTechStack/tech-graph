---
id: graphql
name: "GraphQL"
kind: concept
status: learned
tags: [graphql, schema, query-language, api, type-system]
what: "Query language and server-side runtime for APIs that lets clients request exactly the shape and fields of data they need through a strongly typed schema."
why: "Eliminates over-fetching and under-fetching by fetching and consolidating data from multiple resources into a single HTTP POST round-trip."
problem: "REST APIs often require multiple round-trips to assemble related resources (waterfall queries) or send megabytes of unused payload fields to bandwidth-constrained clients."
relations:
  - { to: "rest-api", label: "alternative to" }
  - { to: "express-graphql", label: "executed by" }
links:
  - { title: "GraphQL Official Documentation", url: "https://graphql.org/learn/" }
  - { title: "GraphQL Specification", url: "https://spec.graphql.org/" }
alsoIn: []
source: course
---

## Example
```graphql
# Schema Definition Language (SDL)
type Author {
  id: ID!
  name: String!
  books: [Book!]!
}

type Book {
  id: ID!
  title: String!
  price: Float!
  author: Author!
}

type Query {
  book(id: ID!): Book
  authors: [Author!]!
}

# Client Query Example:
# query {
#   book(id: "10") {
#     title
#     author {
#       name
#     }
#   }
# }
```

## Key points
- **Strongly typed contract**: the schema (SDL) is the authoritative single source of truth shared between client and server, enabling auto-generated types and compile-time query validation.
- **Single HTTP endpoint**: all queries, mutations, and subscriptions are dispatched to a single `/graphql` endpoint (usually via HTTP POST).
- **The N+1 problem**: nested field resolvers fetching relational records can execute repetitive database queries for each child row; mitigate using batching and caching tools like DataLoader.
