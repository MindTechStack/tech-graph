---
id: composition-api
name: Vue Composition API & Composables
short: Composition API
kind: concept
status: work
tags: [vue, composables, reactivity, ref, computed, watch]
what: "Function-based API (`ref`, `computed`, `watch`, lifecycle hooks, `<script setup>`) for authoring and extracting reusable stateful logic in Vue 3."
why: "Groups code by logical concern rather than option type (`data`, `methods`, `computed`) and lets you extract typed `use*()` composables with clear inputs and outputs."
problem: "In the legacy Options API, a single feature's state, watchers, and methods were split across a 500-line file, and mixins caused implicit naming collisions and unclear data sources."
relations:
  - { to: vue, label: "core pattern of" }
  - { to: typescript, label: "first-class inference in" }
  - { to: react-hooks, label: "conceptually similar to" }
links:
  - { title: "Vue Guide: Composables", url: https://vuejs.org/guide/reusability/composables.html }
  - { title: "Vue Reactivity API Reference", url: https://vuejs.org/api/reactivity-core.html }
alsoIn: []
source: work
---

## Example
```ts
import { onScopeDispose, ref, watch, type MaybeRefOrGetter, toValue } from "vue";

export function useDebouncedValue<T>(source: MaybeRefOrGetter<T>, delayMs = 250) {
  const debounced = ref(toValue(source)) as { value: T };
  let timer: ReturnType<typeof setTimeout> | undefined;

  watch(
    () => toValue(source),
    (next) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        debounced.value = next;
      }, delayMs);
    },
  );

  onScopeDispose(() => clearTimeout(timer));

  return debounced;
}
```

## Key points
- **`MaybeRefOrGetter<T>` + `toValue()`**: accept plain values, `Ref<T>`, or getter functions `() => T` in composables and normalize them with `toValue()` (Vue 3.3+) for flexible ergonomics.
- **Preserve reactivity on destructuring**: destructuring a `reactive()` object loses reactivity unless wrapped in `toRefs()`; returning an object of `ref`s from a composable is safer so callers can destructure freely.
- **`computed` vs `watch`**: always prefer `computed` for derived state; reserve `watch` / `watchEffect` strictly for side effects like network calls, DOM sync, or storage persistence.

