---
id: rendering-strategies
name: "Rendering: CSR / SSR / SSG / Islands"
short: Rendering Strategies
kind: concept
status: work
tags: [rendering, csr, ssr, ssg, islands, performance]
what: "Architectural strategies for generating and delivering HTML, CSS, and JavaScript to browsers: Client-Side Rendering (CSR), Server-Side Rendering (SSR), Static Site Generation (SSG), and Component Islands."
why: "Enables developers to balance initial page load performance (TTFB, FCP), SEO requirements, dynamic personalized content, and server computing costs."
problem: "Using pure CSR for content-heavy sites hurts SEO and first-paint metrics, while using SSR for static marketing pages incurs unnecessary server costs and latency."
relations:
  - { to: client-vs-server, label: "part of" }
  - { to: astro, label: "implements" }
  - { to: nuxt, label: "implements" }
  - { to: nextjs, label: "implements" }
  - { to: server-side-templating, label: "alternative to" }
links:
  - { title: "Web.dev Rendering on the Web", url: "https://web.dev/articles/rendering-on-the-web" }
  - { title: "Astro Rendering Strategies", url: "https://docs.astro.build/en/guides/on-demand-rendering/" }
alsoIn: []
source: self-study
---

## Architectural Comparison Matrix

| Strategy | When HTML is Generated | TTFB (Time to First Byte) | SEO & Social Crawlers | Hydration Overhead | Best Used For |
|---|---|---|---|---|---|
| **CSR** (Client-Side Rendering) | In browser via JS execution. Server sends empty shell (`<div id="root">`). | Fast (static HTML shell from CDN). | Poor without dynamic prerendering. | Heavy (entire DOM constructed by client framework). | Internal dashboards, SaaS apps, authenticated portals. |
| **SSR** (Server-Side Rendering) | On the server for every incoming HTTP request. | Slower (waits for server computation & DB queries). | Excellent (full HTML payload delivered). | Full page hydration required unless streaming. | E-commerce product pages, live dashboards, user feeds. |
| **SSG** (Static Site Generation) | At project build time (`npm run build`). HTML served from CDN. | Ultra-fast (cached static file delivered from edge CDN). | Excellent (static pre-baked semantic HTML). | Full page hydration required for React/Vue frameworks. | Blogs, documentation, marketing landing pages. |
| **Islands** (Astro Architecture) | Static HTML at build/request; isolated components hydrate independently. | Ultra-fast (CDN static HTML or edge SSR). | Excellent (pure HTML baseline). | Minimal (only interactive islands load framework JS). | Content-heavy sites needing occasional interactive widgets. |

## Example
```ts
// astro.config.mjs - Configuring Hybrid / Server-Side Rendering strategies
import { defineConfig } from "astro/config";
import node from "@astrojs/node";

export default defineConfig({
  output: "static", // Default: Static Site Generation (SSG) for all routes
  adapter: node({
    mode: "standalone",
  }),
});

// src/pages/blog/[slug].astro -> SSG by default: pre-rendered at build time
// export async function getStaticPaths() { ... }

// src/pages/dashboard.astro -> Opt into on-demand SSR per route
// export const prerender = false; // Renders on every request on the server
```

## Key points
- **The hydration tax**: traditional SSR renders HTML on the server but forces the browser to download and execute full framework bundles to attach event listeners (rehydrating the entire page); Islands architecture avoids this by hydrating only interactive widgets.
- **SSG + CDN is fastest**: when data does not change per user request, SSG with CDN caching delivers sub-50ms TTFB globally at negligible hosting cost.
- **Hybrid frameworks**: modern frameworks (Astro, Nuxt, Next.js) allow mixing SSG for public static pages and SSR for dynamic user-personalized routes in a single project.
