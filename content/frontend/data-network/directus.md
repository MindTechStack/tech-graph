---
id: directus
name: Directus (headless CMS)
kind: service
status: work
tags: [headless-cms, rest-api, graphql, backend-as-a-service, sql]
what: "Open-source headless CMS and data platform providing auto-generated REST and GraphQL APIs on top of any SQL database."
why: "Instantly turns existing relational databases into accessible, documented APIs with built-in auth, granular permissions, and an intuitive admin app."
problem: "Developing custom CRUD backends, asset storage handlers, and admin dashboards for content-heavy applications consumes immense engineering time."
relations:
  - { to: typescript, label: "sdk typed with" }
  - { to: fetch-api, label: "consumed via rest and" }
  - { to: vue, label: "admin app built with" }
  - { to: api-error-layer, label: "handles queries and auth in" }
links:
  - { title: "Directus Documentation", url: https://docs.directus.io }
alsoIn: []
source: work
---

## Example
```ts
import { authentication, createDirectus, readItems, rest } from "@directus/sdk";

interface Article {
  readonly id: number;
  readonly title: string;
  readonly status: "draft" | "published";
  readonly date_created: string;
}

interface Schema {
  articles: Article[];
}

export const directus = createDirectus<Schema>("https://cms.example.com")
  .with(authentication())
  .with(rest());

export async function getPublishedArticles(): Promise<Article[]> {
  return directus.request(
    readItems("articles", {
      filter: {
        status: { _eq: "published" },
      },
      sort: ["-date_created"],
      fields: ["id", "title", "status", "date_created"],
      limit: 10,
    }),
  );
}
```

## Key points
- **No database lock-in**: Wraps directly around your SQL database (PostgreSQL, MySQL, SQLite) without proprietary schema wrappers, keeping raw data pristine.
- **Type-safe SDK**: Directus TypeScript SDK can be typed with your schema interface to provide autocomplete on collections, filter operators, and nested relations.
- **Granular role-based access control**: Configurable permissions per role down to collection fields, filter rules, and public read-only access.
