---
id: react
name: React
kind: framework
status: practiced
tags: [ui, components, jsx, hooks, virtual-dom]
what: Declarative JavaScript library for building user interfaces from composable, state-driven components.
why: Keeps the DOM in sync with application state automatically (`UI = f(state)`) and scales through unidirectional data flow and reusable hooks.
problem: Imperative DOM manipulation (`document.querySelector`, manual class/attribute toggling) quickly becomes brittle and out of sync as UI state grows.
relations:
  - { to: vite, label: "uses" }
links:
  - { title: React Docs (react.dev), url: https://react.dev/ }
alsoIn: []
source: personal
---

## Example
```tsx
import { useMemo, useState } from "react";

interface NodeFilterProps {
  readonly items: readonly { id: string; name: string; status: string }[];
}

export function NodeFilter({ items }: NodeFilterProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((item) => item.name.toLowerCase().includes(q)) : items;
  }, [items, query]);

  return (
    <section>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search nodes..."
      />
      <ul>
        {filtered.map((item) => (
          <li key={item.id}>
            {item.name} ({item.status})
          </li>
        ))}
      </ul>
    </section>
  );
}
```

## Key points
- **Pure rendering**: components should be pure functions of `props` and `state`; side effects (timers, subscriptions, DOM mutations) belong in `useEffect` or event handlers.
- **Derived state over duplicated state**: compute filtered lists or counts during render (or with `useMemo`) instead of syncing a second `useState` inside `useEffect`.
- **Stable keys**: always use stable domain IDs (`key={node.id}`) in lists—never array indices when items can reorder, insert, or delete.
