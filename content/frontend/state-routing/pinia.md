---
id: pinia
name: Pinia
kind: library
status: work
core: true
tags: [vue, state-management, store, composition-api, typescript]
what: "Vue's official state management library: type-safe stores defined with the Composition or Options API."
why: "Provides modular stores with seamless TypeScript autocompletion, devtools time travel, and no mutations boilerplate."
problem: "Prop-drilling deeply nested state or sharing complex reactive data across distant components leads to tight coupling and synchronization bugs."
relations:
  - { to: vue, label: "official store for" }
  - { to: composition-api, label: "built with" }
  - { to: vuex, label: "succeeds" }
  - { to: typescript, label: "typed with" }
links:
  - { title: "Pinia Documentation", url: https://pinia.vuejs.org }
alsoIn: []
source: work
---

## Example
```ts
import { computed, ref } from "vue";
import { defineStore } from "pinia";

export interface CartItem {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly quantity: number;
}

export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItem[]>([]);

  const totalCount = computed(() =>
    items.value.reduce((acc, item) => acc + item.quantity, 0),
  );

  const totalPrice = computed(() =>
    items.value.reduce((acc, item) => acc + item.price * item.quantity, 0),
  );

  function addItem(product: Omit<CartItem, "quantity">): void {
    const existing = items.value.find((i) => i.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.value.push({ ...product, quantity: 1 });
    }
  }

  function clearCart(): void {
    items.value = [];
  }

  return { items, totalCount, totalPrice, addItem, clearCart };
});
```

## Key points
- **Setup stores & Composition API**: `defineStore` using a setup function mirrors `<script setup>`, allowing `ref()`, `computed()`, and custom composables inside stores.
- **Direct mutations**: Actions can be asynchronous or synchronous without Vuex mutation ceremonies, and `storeToRefs()` preserves reactivity when destructuring.
- **Devtools & SSR hydration**: Out-of-the-box support for Vue Devtools time-travel debugging and zero-config SSR state hydration in Nuxt.
