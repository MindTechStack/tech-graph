---
id: code-splitting
name: "Code Splitting & Bundle Optimization"
short: Code Splitting
kind: concept
status: work
tags: [bundle-size, dynamic-import, chunking, tree-shaking, performance]
what: "Technique of dividing a frontend bundle into smaller chunks loaded on demand rather than sending a single monolithic JavaScript file to the client."
why: "Dramatically reduces initial JavaScript download and parse time, improving First Contentful Paint (FCP) and Time to Interactive (TTI)."
problem: "Without code splitting, users must download the entire codebase upfront including features, modals, and admin routes they may never visit."
relations:
  - { to: vite, label: "implemented via" }
  - { to: lazy-loading, label: "enables" }
  - { to: lighthouse, label: "measured by" }
links:
  - { title: "MDN Code Splitting", url: "https://developer.mozilla.org/en-US/docs/Glossary/Code_splitting" }
  - { title: "Vite Manual Chunks", url: "https://vite.dev/guide/build.html#chunking-strategy" }
alsoIn: []
source: work
---

## Example
```ts
// vite.config.ts - Manual chunking strategy for vendor isolation
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("vue") || id.includes("pinia")) {
              return "vue-core";
            }
            if (id.includes("chart.js") || id.includes("leaflet")) {
              return "widgets";
            }
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
```

## Key points
- **Dynamic imports**: syntax `import('./HeavyModal.vue')` tells the bundler to cut a chunk boundary and fetch it only when invoked.
- **Vendor caching**: separating third-party dependencies from application code ensures library chunks stay cached in the browser across deploys.
- **Granular chunking risk**: creating too many tiny chunks introduces HTTP/2 request multiplexing overhead and waterfall dependency chains.
