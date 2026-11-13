---
id: gridstack
name: "GridStack"
kind: library
status: work
tags: [dashboard-grid, drag-and-drop, resizable, layout-engine, responsive]
what: "TypeScript library for dashboard grids with draggable, resizable widgets."
why: "Enables users to customize, rearrange, and persist widget dashboard layouts with automated collision detection and responsive breakpoints."
problem: "Implementing interactive drag-and-drop widget layouts with collision avoidance, auto-compacting, and column reflow from scratch is notoriously tricky."
relations:
  - { to: typescript, label: "written in" }
  - { to: browser-apis, label: "uses" }
links:
  - { title: "GridStack Documentation", url: "https://gridstackjs.com/" }
alsoIn: []
source: work
---

## Example
```ts
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";

// Initialize responsive 12-column grid
const grid = GridStack.init({
  column: 12,
  cellHeight: 100,
  animate: true,
  margin: 10,
  resizable: { handles: "e,se,s,sw,w" },
});

// Add dynamic widget programmatically
grid.addWidget({
  w: 4,
  h: 3,
  x: 0,
  y: 0,
  content: "<div class='widget-card'><h3>Active Metrics</h3><p>Live Chart</p></div>",
});

// Save layout configuration to localStorage
grid.on("change", () => {
  const serialized = grid.save();
  localStorage.setItem("dashboard_layout", JSON.stringify(serialized));
});
```

## Key points
- **Automated collision & compacting**: widgets push neighboring elements downward or float up into free spaces during drag operations.
- **Serialization support**: provides `.save()` and `.load()` APIs to persist widget coordinates (`x`, `y`, `w`, `h`) to databases or local storage.
- **Multi-framework compatibility**: works with pure TypeScript and includes wrappers/examples for Vue, React, and Angular components.
