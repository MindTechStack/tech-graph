---
id: vuetify
name: "Vuetify 3"
kind: library
status: work
tags: [material-design, vue-components, ui-kit, layout-system, accessible]
what: "Complete Material Design component library for Vue 3 featuring responsive grids, comprehensive form inputs, and dynamic theme switching."
why: "Delivers a cohesive, accessible Material Design system with minimal configuration for Vue applications."
problem: "Implementing responsive navigation drawers, dialogs, and validated inputs adhering to accessibility specs takes significant custom styling effort."
relations:
  - { to: vue, label: "built for" }
  - { to: vite, label: "bundled with" }
links:
  - { title: "Vuetify Documentation", url: "https://vuetifyjs.com/en/" }
alsoIn: []
source: work
---

## Example
```vue
<script setup lang="ts">
import { ref } from "vue";

const drawer = ref(false);
const search = ref("");
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="compact">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Tech Graph Explorer</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard" />
        <v-list-item prepend-icon="mdi-graph" title="Knowledge Map" value="map" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <v-text-field v-model="search" label="Search Nodes" prepend-inner-icon="mdi-magnify" clearable />
      </v-container>
    </v-main>
  </v-app>
</template>
```

## Key points
- **Material 3 specification**: provides standard elevation, typography, color roles, and motion curves matching Google Material Design.
- **Grid and layout system**: includes responsive 12-column grid components (`v-row`, `v-col`) and dynamic layout wrappers (`v-app`, `v-main`).
- **Tree-shaking via Vite plugin**: `vite-plugin-vuetify` automatically imports required components and SASS variables on demand.
