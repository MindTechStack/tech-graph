---
id: vite
name: Vite
kind: tool
status: work
core: true
tags: [bundler, esm, hmr, rollup, dev-server]
what: Next-generation frontend build tool featuring an native-ESM dev server with instant HMR and an optimized Rollup/Rolldown production build.
why: Starts the dev server in milliseconds regardless of app size by serving native ES modules on demand instead of bundling the entire application upfront.
problem: Traditional bundle-based dev servers (Webpack) had to rebuild the whole module graph before serving a page, resulting in slow cold starts and sluggish HMR.
relations:
  - { to: nodejs, label: "runs on" }
  - { to: typescript, label: "transpiles" }
  - { to: vue, label: "bundles" }
  - { to: react, label: "bundles" }
  - { to: vitest, label: "powers" }
  - { to: code-splitting, label: "performs" }
links:
  - { title: Vite Guide, url: https://vite.dev/guide/ }
alsoIn: []
source: work
---

## Example
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: true,
    target: "es2022",
  },
});
```

## Key points
- **Two-phase architecture**: in development, Vite pre-bundles `node_modules` with esbuild and serves source code as native ESM; in production, it bundles and tree-shakes via Rollup.
- **Static asset & glob imports**: `import.meta.glob('./content/**/*.md', { query: '?raw', eager: true })` lets you load entire directories of files at build time with zero runtime FS dependencies.
- **Environment variables**: only variables prefixed with `VITE_` (`import.meta.env.VITE_API_URL`) are exposed to client code to prevent leaking server secrets.

