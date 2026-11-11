---
id: alchemy
name: "Alchemy"
kind: tool
status: planned
tags: [alchemy, iac, typescript, cloudflare, infrastructure]
what: "A modern TypeScript-first Infrastructure as Code framework designed for defining and deploying cloud infrastructure using native TypeScript constructs."
why: "Brings full TypeScript type-safety, IDE autocompletion, refactoring, and code reuse to cloud resource provisioning without learning proprietary DSLs."
problem: "Writing infrastructure in HCL or raw YAML lacks compile-time type validation, requires custom DSL learning curves, and makes programmatic logic clunky."
relations:
  - { to: iac, label: "part of" }
  - { to: typescript, label: "written in" }
  - { to: cloudflare, label: "deploys to" }
  - { to: terraform, label: "alternative to" }
links:
  - { title: "Alchemy Documentation", url: "https://alchemy.run/" }
  - { title: "Alchemy GitHub", url: "https://github.com/alchemy-run/alchemy" }
alsoIn: []
source: self-study
---

## Example
```ts
// Defining cloud infrastructure using type-safe TypeScript with Alchemy
import { CloudflareWorker, D1Database, KVNamespace } from "@alchemy/cloudflare";

// Define an edge database with type-safe schema bindings
export const mainDatabase = new D1Database("production-db", {
  name: "myapp-prod-d1",
});

export const sessionCache = new KVNamespace("session-cache", {
  title: "myapp-session-kv",
});

// Deploy Worker with automatically bound cloud resources
export const apiWorker = new CloudflareWorker("api-gateway", {
  entrypoint: "./src/worker.ts",
  bindings: {
    DB: mainDatabase,
    SESSIONS: sessionCache,
  },
  routes: ["api.example.com/*"],
});
```

## Key points
- **Pure TypeScript developer experience**: provision infrastructure using standard TypeScript functions, classes, and loops with full IDE autocomplete and type-checking.
- **Npm package ecosystem**: distribute reusable infrastructure patterns and components as standard npm packages across projects and organization repositories.
- **Zero DSL friction**: eliminates the need to learn HashiCorp Configuration Language (HCL) or complex YAML templating engines for application developers.
