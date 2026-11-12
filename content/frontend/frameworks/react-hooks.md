---
id: react-hooks
name: React Hooks
kind: concept
status: practiced
tags: [react, state, effects, memoization, custom-hooks]
what: "Special functions (`useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, `useContext`) that hook functional React components into state, lifecycle synchronization, and context."
why: "Lets you compose and share stateful behavior across components using plain functions (`use*`) without class hierarchies or wrapper hell."
problem: "Without understanding hook call-order rules, closure captures, and effect cleanup, components suffer from infinite render loops, stale closures, and memory leaks."
relations:
  - { to: react, label: "core primitive of" }
  - { to: composition-api, label: "inspired" }
  - { to: browser-apis, label: "synchronizes with" }
links:
  - { title: "Built-in React Hooks Reference", url: https://react.dev/reference/react/hooks }
  - { title: "You Might Not Need an Effect", url: https://react.dev/learn/you-might-not-need-an-effect }
alsoIn: []
source: personal
---

## Example
```tsx
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
```

## Key points
- **Rules of Hooks**: only call hooks unconditionally at the top level of a React component or custom hook because React tracks hook state by call index across renders.
- **`useEffect` is for external synchronization**: use effects only to synchronize with external systems (DOM listeners, timers, WebSockets)—never to transform data for rendering or handle user click events.
- **Dependency arrays & stale closures**: every reactive value read inside an effect (`props`, `state`, local functions) must be declared in its dependency array, and effects that subscribe or start async work must return a cleanup function.

