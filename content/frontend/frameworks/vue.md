---
id: vue
name: Vue 3
kind: framework
status: work
tags: [sfc, reactivity, proxy, virtual-dom, components]
what: "Progressive JavaScript framework built on fine-grained Proxy-based reactivity and Single-File Components (`.vue`)."
why: "Tracks reactive dependencies automatically at runtime so only the exact components and DOM bindings that depend on changed state re-render."
problem: "Managing manual render optimizations or scattering HTML, CSS, and state logic across separate files slows down feature development in complex SPAs."
relations:
  - { to: composition-api, label: "authored with" }
  - { to: pinia, label: "state managed with" }
  - { to: vue-router, label: "routed with" }
  - { to: nuxt, label: "powers" }
  - { to: typescript, label: "typed with" }
  - { to: vite, label: "built with" }
links:
  - { title: "Vue 3 Official Guide", url: https://vuejs.org/guide/introduction.html }
alsoIn: []
source: work
---

## Example
```vue
<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  readonly items: readonly { id: string; title: string; done: boolean }[];
}>();

const emit = defineEmits<{
  toggle: [id: string];
}>();

const hideCompleted = ref(false);

const visibleItems = computed(() =>
  hideCompleted.value ? props.items.filter((i) => !i.done) : props.items,
);
</script>

<template>
  <section class="task-list">
    <label>
      <input v-model="hideCompleted" type="checkbox" />
      Hide completed
    </label>
    <ul>
      <li v-for="item in visibleItems" :key="item.id">
        <button type="button" @click="emit('toggle', item.id)">
          {{ item.title }}
        </button>
      </li>
    </ul>
  </section>
</template>
```

## Key points
- **Proxy-based fine-grained reactivity**: `ref()` and `reactive()` track property reads inside `computed` and component templates automatically—no manual dependency arrays required.
- **Compiler-informed Virtual DOM**: the Vue template compiler marks static subtrees (hoisting) and dynamic binding flags (`patchFlags`) at build time so diffing skips unchanged DOM nodes.
- **Props down, events up**: never mutate a prop directly; derive local values with `computed` or use `defineModel()` / `defineEmits()` for two-way parent communication.

