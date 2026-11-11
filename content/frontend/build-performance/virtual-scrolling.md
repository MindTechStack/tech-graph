---
id: virtual-scrolling
name: "Virtual Scrolling"
kind: concept
status: work
tags: [dom-recycling, long-lists, performance, windowing, viewport]
what: "Technique that renders only visible DOM elements within the user's viewport, dynamically recycling container elements as the user scrolls."
why: "Maintains smooth 60 FPS scrolling and predictable memory consumption when displaying tens of thousands of items."
problem: "Rendering thousands of actual DOM nodes overwhelms the browser layout engine, leading to sluggish scrolling, high memory usage, and UI crashes."
relations:
  - { to: browser-apis, label: "interacts with" }
  - { to: vue, label: "used in" }
  - { to: react, label: "used in" }
links:
  - { title: "TanStack Virtual", url: "https://tanstack.com/virtual/latest" }
  - { title: "Web.dev Virtualize Lists", url: "https://web.dev/virtualize-long-lists-react-window/" }
alsoIn: []
source: work
---

## Example
```ts
// Virtual list offset calculation core model
export function calculateVisibleRange(
  scrollTop: number,
  viewportHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan = 3,
) {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + viewportHeight) / itemHeight) + overscan,
  );

  return {
    startIndex,
    endIndex,
    offsetTop: startIndex * itemHeight,
    totalHeight: totalItems * itemHeight,
  };
}
```

## Key points
- **DOM element recycling**: keeps total DOM node count constant regardless of dataset size (100 items vs 1,000,000 items).
- **Overscan buffer**: rendering a few items above and below the visible window prevents blank flashes during rapid scrolling.
- **Dynamic item heights**: variable height items require measuring rendered elements and maintaining an offset cache or binary search tree.
