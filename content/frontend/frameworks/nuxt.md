---
id: nuxt
name: Nuxt 3/4
kind: framework
status: work
tags: [vue, ssr, ssg, nitro, file-routing, fullstack]
what: "Full-stack Vue meta-framework powered by Vite and the Nitro server engine, supporting SSR, SSG, hybrid route rules, and auto-imported composables."
why: "Delivers fast initial HTML rendering, SEO metadata, file-based routing, and type-safe `/server/api` endpoints in a single unified Vue project."
problem: "Assembling SSR hydration, route-level code splitting, head management, and server API routes manually on top of a raw Vue SPA requires brittle custom bundler setups."
relations:
  - { to: vue, label: "built on" }
  - { to: composition-api, label: "uses" }
  - { to: vite, label: "bundled by" }
  - { to: nodejs, label: "runs server on" }
links:
  - { title: "Nuxt Documentation", url: https://nuxt.com/docs }
alsoIn: []
source: work
---

## Example
```vue
<script setup lang="ts">
const route = useRoute();

// Runs on server during SSR and serializes payload to avoid double-fetching on hydration
const { data: project, status, error } = await useFetch(
  () => `/api/projects/${route.params.slug}`,
  { key: `project-${route.params.slug}` },
);

useSeoMeta({
  title: () => project.value?.name ?? "Project",
  description: () => project.value?.summary ?? "",
});
</script>

<template>
  <article v-if="status === 'pending'">Loading...</article>
  <article v-else-if="error">Not found</article>
  <article v-else-if="project">
    <h1>{{ project.name }}</h1>
    <p>{{ project.summary }}</p>
  </article>
</template>
```

## Key points
- **`useFetch` / `useAsyncData` over raw `fetch`**: calling raw `fetch()` in `<script setup>` runs twice (once on server, once on client hydration); `useFetch` deduplicates via serialized SSR payload.
- **Hybrid rendering via `routeRules`**: configure per-route caching and rendering (`ssr: false` for `/admin/**`, `swr: 3600` for catalog pages, `prerender: true` for marketing pages) in `nuxt.config.ts`.
- **SSR hydration mismatches**: browser-only APIs (`window`, `localStorage`, random IDs, locale dates) must run inside `onMounted`, `<ClientOnly>`, or `useId()` so server HTML matches the initial client render.

