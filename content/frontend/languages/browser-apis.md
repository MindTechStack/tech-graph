---
id: browser-apis
name: Browser APIs (DOM, Storage, Events)
kind: concept
status: work
tags: [dom, web-storage, events, observers, abort-controller]
what: "Built-in host APIs provided by web browsers for DOM manipulation, event propagation, client storage, viewport observers, and background timers."
why: "Provides standardized, zero-dependency primitives (`localStorage`, `IntersectionObserver`, `AbortController`, `URLSearchParams`, `History`) that frameworks build upon."
problem: "Re-implementing scroll detection, URL parsing, or clipboard access in userland JavaScript bloats bundles and misses browser-level performance and security guarantees."
relations:
  - { to: javascript, label: "exposed to" }
  - { to: html, label: "operates on" }
  - { to: fetch-api, label: "includes" }
  - { to: service-workers, label: "includes" }
  - { to: lazy-loading, label: "enables via IntersectionObserver" }
links:
  - { title: "MDN: Web APIs Reference", url: https://developer.mozilla.org/en-US/docs/Web/API }
alsoIn: []
source: work
---

## Example
```ts
export function observeLazyImages(root: ParentNode = document): () => void {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        obs.unobserve(img);
      }
    },
    { rootMargin: "200px 0px" },
  );

  root.querySelectorAll<HTMLImageElement>("img[data-src]").forEach((img) => {
    observer.observe(img);
  });

  return () => observer.disconnect();
}
```

## Key points
- **Event bubbling & delegation**: DOM events travel capture → target → bubble; attaching a single listener on a parent container (`e.target.closest('[data-id]')`) scales better than binding hundreds of individual listeners.
- **Storage trade-offs**: `localStorage` and `sessionStorage` are synchronous and limited to ~5 MB of strings (vulnerable to XSS); use `IndexedDB` for large structured data and `HttpOnly` cookies for sensitive auth tokens.
- **Modern observers over scroll/resize polling**: use `IntersectionObserver` for visibility/infinite scroll, `ResizeObserver` for element dimensions, and `MutationObserver` for DOM tree changes.

