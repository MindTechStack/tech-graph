---
id: zustand
name: Zustand
kind: library
status: planned
tags: [react, state-management, store, lightweight, hooks]
what: "Small React state library: a store is a hook created from one function, with no providers or reducers."
why: "Provides global stores without React Context provider nesting, boilerplate reducers, or unnecessary component re-renders."
problem: "Prop-drilling creates maintainability headaches, while React Context causes widespread re-renders across consumers on any state slice update."
relations:
  - { to: react, label: "state store for" }
  - { to: react-hooks, label: "accessed via" }
  - { to: redux-toolkit, label: "minimal alternative to" }
links:
  - { title: "Zustand Documentation", url: https://zustand.docs.pmnd.rs }
alsoIn: []
source: self-study
---

## Example
```tsx
import { create } from "zustand";

interface BearState {
  readonly bears: number;
  readonly increasePopulation: () => void;
  readonly removeAllBears: () => void;
}

export const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));

export function BearCounter(): JSX.Element {
  // Subscribes only to the bears count slice
  const bears = useBearStore((state) => state.bears);
  const increasePopulation = useBearStore((state) => state.increasePopulation);

  return (
    <div>
      <h1>Bears: {bears}</h1>
      <button onClick={increasePopulation}>Add Bear</button>
    </div>
  );
}
```

## Key points
- **Selective subscription**: Components select only the slice of state they need (`useStore(state => state.bears)`), preventing re-renders when other properties change.
- **No context wrapper required**: Stores exist outside the React component tree and can be accessed or updated from imperative vanilla JS functions.
- **Middleware ecosystem**: Easily extendable with built-in middlewares like `persist` (syncing with `localStorage`), `devtools`, and `immer`.
