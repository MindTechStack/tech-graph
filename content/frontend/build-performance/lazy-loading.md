---
id: lazy-loading
name: "Lazy Loading"
kind: concept
status: work
tags: [dynamic-import, route-splitting, deferred-loading, performance, intersection-observer]
what: "Design pattern that defers loading of non-critical UI components, routes, or assets until they are actually needed in the viewport or user workflow."
why: "Keeps initial bundle size minimal and saves bandwidth and compute for users who only interact with the entry page."
problem: "Eagerly importing every view and widget causes long main-thread compilation locks and slow page startup on mobile networks."
relations:
  - { to: code-splitting, label: "relies on" }
  - { to: vue, label: "supported in" }
  - { to: react, label: "supported in" }
  - { to: browser-apis, label: "uses" }
links:
  - { title: "Web.dev Lazy Loading", url: "https://web.dev/fast/#lazy-load-images-and-video" }
  - { title: "Vue Async Components", url: "https://vuejs.org/guide/components/async.html" }
alsoIn: []
source: work
---

## Example
```vue
<script setup lang="ts">
import { defineAsyncComponent } from "vue";

// Heavy chart component loaded only when rendered
const HeavyAnalyticsChart = defineAsyncComponent({
  loader: () => import("./HeavyAnalyticsChart.vue"),
  loadingComponent: () => h("div", { class: "skeleton" }, "Loading chart..."),
  delay: 200,
  timeout: 10000,
});
</script>

<template>
  <div class="dashboard">
    <Suspense>
      <HeavyAnalyticsChart />
      <template #fallback>
        <p>Loading analytics visualization...</p>
      </template>
    </Suspense>
  </div>
</template>
```

## Key points
- **Route-level vs component-level**: route-level lazy loading (`() => import('./views/Admin.vue')`) yields the highest return on investment with minimal complexity.
- **Loading states and skeletons**: always provide fallback states (skeletons or spinners) so users do not see jarring layout shifts when chunks arrive.
- **Preloading hints**: modern frameworks allow prefetching lazy chunks on link hover or viewport intersection via `<link rel="prefetch">` to eliminate click latency.
