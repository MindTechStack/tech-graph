---
id: vueuse
name: VueUse
kind: library
status: work
tags: [composables, vue, utilities, hooks, browser-apis]
what: "Collection of essential Vue Composition API utility functions and composables."
why: "Provides standardized, reactive wrappers for browser APIs, sensors, state management, animations, and async operations."
problem: "Reimplementing boilerplate event listeners, resize observers, and local storage synchronization across every Vue project leads to bugs and duplicate code."
relations:
  - { to: composition-api, label: "extends" }
  - { to: vue, label: "ecosystem for" }
  - { to: browser-apis, label: "reactive wrappers for" }
links:
  - { title: "VueUse Documentation", url: https://vueuse.org }
alsoIn: []
source: work
---

## Example
```vue
<script setup lang="ts">
import { useDebounceFn, useLocalStorage, useWindowSize } from "@vueuse/core";

// Synchronized reactive local storage
const theme = useLocalStorage<"light" | "dark">("app-theme", "light");

// Reactive window dimensions with automatic resize listeners
const { width, height } = useWindowSize();

// Debounced handler with automatic cleanup
const onSearch = useDebounceFn((query: string) => {
  console.log("Searching for:", query);
}, 300);

function toggleTheme(): void {
  theme.value = theme.value === "light" ? "dark" : "light";
}
</script>

<template>
  <div :class="['container', theme]">
    <p>Window size: {{ width }}px × {{ height }}px</p>
    <button type="button" @click="toggleTheme">Toggle Theme ({{ theme }})</button>
    <input type="text" placeholder="Type to search..." @input="onSearch(($event.target as HTMLInputElement).value)" />
  </div>
</template>
```

## Key points
- **Automatic cleanup lifecycle**: Event listeners and observer handles registered by VueUse composables are automatically unregistered when the host component unmounts.
- **Ref/reactive flexibility**: Most composables accept both raw values and reactive refs (`MaybeRefOrGetter`), normalizing inputs internally for reactive binding.
- **Modular add-ons**: Includes sub-packages for integrations such as `@vueuse/core`, `@vueuse/router`, `@vueuse/integrations`, and `@vueuse/motion`.
