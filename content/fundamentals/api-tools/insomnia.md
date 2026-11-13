---
id: insomnia
name: "Insomnia"
kind: tool
status: planned
tags: [insomnia, api-client, rest, graphql, kong]
what: "Kong's desktop API client for REST, GraphQL and gRPC, with OpenAPI design support."
why: "Offers a clean, distraction-free UI with first-class GraphQL schema auto-completion, environment templating, and native OpenAPI design linting."
problem: "Bloated API tools with complex collaboration features introduce significant visual clutter and slow down straightforward request inspection."
relations:
  - { to: api-clients, label: "part of" }
  - { to: postman, label: "alternative to" }
  - { to: graphql, label: "tests" }
links:
  - { title: "Insomnia Documentation", url: "https://docs.insomnia.rest/" }
  - { title: "Kong Insomnia", url: "https://insomnia.rest/" }
alsoIn: []
source: self-study
---

## Example
```json
{
  "_type": "export",
  "__export_format": 4,
  "resources": [
    {
      "_id": "env_dev",
      "_type": "environment",
      "name": "Local Development",
      "data": {
        "baseUrl": "http://localhost:4000/graphql",
        "apiSecret": "dev-secret-key-123"
      }
    },
    {
      "_id": "req_graphql_query",
      "_type": "request",
      "method": "POST",
      "url": "{{ _.baseUrl }}",
      "body": {
        "mimeType": "application/graphql",
        "text": "query GetProducts($limit: Int!) { products(limit: $limit) { id title price inStock } }"
      }
    }
  ]
}
```

## Key points
- **First-class GraphQL**: automatic schema fetching via introspection, real-time query syntax highlighting, auto-completion, and dedicated variables pane.
- **Inso CLI automation**: run automated collection tests and lint OpenAPI design specifications inside CI/CD workflows using `inso run test "Collection Name"`.
- **Response chaining**: use template tags (`{% response 'body', 'req_login', 'b64::...::46' %}`) to dynamically inject extracted values from prior responses into header or body fields.
