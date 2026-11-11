---
id: express-graphql
name: "GraphQL server (express-graphql / graphql-http)"
kind: library
status: learned
tags: [graphql, express, middleware, api, graphiql]
what: "HTTP middleware for mounting a GraphQL schema and execution engine onto an Express server with interactive GraphiQL IDE exploration."
why: "Allows existing Express applications to serve GraphQL queries and mutations alongside standard REST endpoints within the same process."
problem: "Without an HTTP integration layer, executing GraphQL queries requires manually parsing POST request bodies, validating documents, and formatting execution results."
relations:
  - { to: "graphql", label: "server implementation of" }
  - { to: "express", label: "mounted as middleware on" }
links:
  - { title: "express-graphql GitHub", url: "https://github.com/graphql/express-graphql" }
  - { title: "graphql-http Documentation", url: "https://github.com/graphql/graphql-http" }
alsoIn: []
source: course
---

## Example
```js
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Query {
    greeting(name: String): String
  }
`);

const root = {
  greeting: ({ name }) => `Hello, ${name || "World"}!`,
};

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true, // Enables interactive in-browser IDE
  })
);

app.listen(4000);
```

## Key points
- **Resolver resolution**: resolvers receive arguments `(parent, args, context, info)` and resolve requested fields asynchronously from databases or microservices.
- **Context injection**: the `context` parameter passes authenticated user tokens, database pools, and DataLoader batch instances down into all nested field resolvers.
- **GraphiQL explorer**: setting `graphiql: true` provides an in-browser graphical interface to inspect schema docs, autocomplete queries, and execute mutations in development.
- **Today**: The legacy `express-graphql` package is deprecated; modern applications use `graphql-http` (the official community specification transport), Apollo Server (`@apollo/server`), or GraphQL Yoga (`graphql-yoga`), with GraphiQL or Apollo Studio as the interactive playground.
