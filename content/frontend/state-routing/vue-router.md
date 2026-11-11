---
id: vue-router
name: Vue Router
kind: library
status: work
tags: [routing, vue, navigation, history-api, spa]
what: "The official client-side routing library for Vue.js, mapping URLs to nested component trees."
why: "Enables deep linking, browser history navigation, dynamic routing, and transition-rich Single Page Applications."
problem: "Building multi-view web applications without a router forces manual URL parsing, history state manipulation, and broken browser back-button behavior."
relations:
  - { to: vue, label: "official router for" }
  - { to: browser-apis, label: "uses history api of" }
  - { to: pinia, label: "guards integrate with" }
links:
  - { title: "Vue Router Documentation", url: https://router.vuejs.org }
alsoIn: []
source: work
---

## Example
```ts
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { useAuthStore } from "./stores/auth";

const routes: readonly RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("./views/HomeView.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("./views/DashboardView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/users/:id",
    name: "user-details",
    component: () => import("./views/UserDetailView.vue"),
    props: true,
  },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: "home", query: { redirect: to.fullPath } };
  }
});
```

## Key points
- **Navigation guards pipeline**: Global (`beforeEach`), per-route (`beforeEnter`), and in-component guards control authentication checks and async route transitions.
- **Nested route hierarchies**: `<RouterView>` components can be nested to match hierarchical URL segments with layout reuse.
- **Lazy route chunks**: Dynamic `import()` in route component declarations automatically splits bundles into separate on-demand JS chunks with Vite.
