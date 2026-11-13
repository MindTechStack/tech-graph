---
id: chartjs
name: "Chart.js"
kind: library
status: work
tags: [canvas-charts, data-visualization, lightweight, animations, responsive]
what: "Open-source JavaScript library that draws charts on HTML canvas."
why: "Draws lightweight, smooth charts that scale effortlessly on mobile devices and lower-powered hardware via hardware-accelerated canvas."
problem: "Rendering hundreds of SVG elements in complex multi-series charts degrades DOM performance and causes noticeable frame rate drops."
relations:
  - { to: javascript, label: "built with" }
  - { to: browser-apis, label: "renders on" }
links:
  - { title: "Chart.js Documentation", url: "https://www.chartjs.org/docs/latest/" }
alsoIn: []
source: work
---

## Example
```ts
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip } from "chart.js";

// Register only needed modules for tree-shaking
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip);

const ctx = (document.getElementById("myCanvas") as HTMLCanvasElement).getContext("2d")!;
const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [{
      label: "Node Additions",
      data: [12, 19, 25, 40, 58],
      borderColor: "#10b981",
      backgroundColor: "rgba(16, 185, 129, 0.2)",
      tension: 0.3,
    }],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
});
```

## Key points
- **Canvas-based rendering**: achieves high frame rates and low DOM overhead by drawing directly onto an HTML5 `<canvas>` element.
- **Tree-shakable v3/v4 architecture**: allows importing only required controllers, elements, and scales to keep bundle footprint under 20 KB.
- **Plugin ecosystem**: extensible lifecycle hooks permit custom drawing operations, watermark annotations, and data labels.
