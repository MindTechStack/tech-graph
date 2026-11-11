---
id: vuex
name: Vuex
kind: library
status: work
tags: [vue, state-management, mutations, legacy-store, actions]
what: "Centralized state management library for Vue 2 and Vue 3 apps inspired by Flux and Elm architectures."
why: "Enforces unidirectional data flow where state changes must be committed via synchronous mutations for predictable debugging."
problem: "Uncontrolled cross-component state mutations make bugs hard to trace and reproduce in large legacy codebases."
relations:
  - { to: vue, label: "state store for" }
  - { to: pinia, label: "superseded by" }
  - { to: typescript, label: "typed with" }
links:
  - { title: "Vuex Documentation", url: https://vuex.vuejs.org }
alsoIn: []
source: work
---

## Example
```ts
import { type InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";

export interface RootState {
  count: number;
}

export const key: InjectionKey<Store<RootState>> = Symbol("vuex-key");

export const store = createStore<RootState>({
  state: {
    count: 0,
  },
  getters: {
    doubleCount(state): number {
      return state.count * 2;
    },
  },
  mutations: {
    increment(state, amount = 1): void {
      state.count += amount;
    },
  },
  actions: {
    incrementAsync({ commit }, amount: number): Promise<void> {
      return new Promise((resolve) => {
        setTimeout(() => {
          commit("increment", amount);
          resolve();
        }, 100);
      });
    },
  },
});

export function useStore(): Store<RootState> {
  return baseUseStore(key);
}
```

## Key points
- **Strict mutation boundary**: State can only be mutated synchronously through `mutations`; asynchronous operations must be dispatched through `actions`.
- **TypeScript friction**: Complex module namespacing and string-based action/mutation dispatching require extensive boilerplate for proper TypeScript typing.
- **Today**: Pinia is now the official default store for Vue 3; Vuex remains in maintenance mode for legacy Vue 2 and Vue 3 codebases.
