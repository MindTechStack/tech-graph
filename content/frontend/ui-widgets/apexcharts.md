---
id: apexcharts
name: "ApexCharts"
kind: library
status: work
tags: [charts, svg-visualization, time-series, dashboard, interactive]
what: "SVG charting library with animated, interactive charts, tooltips and zoom."
why: "Simplifies building production-ready financial and telemetry dashboards with built-in time-series handling, panning, and theme modes."
problem: "Raw D3.js requires extensive boilerplate to build responsive axes, interactive legends, and crosshair tooltips for standard chart types."
relations:
  - { to: vue, label: "integrates with" }
  - { to: react, label: "integrates with" }
  - { to: javascript, label: "written in" }
links:
  - { title: "ApexCharts Documentation", url: "https://apexcharts.com/docs/" }
alsoIn: []
source: work
---

## Example
```ts
import ApexCharts from "apexcharts";

const options = {
  chart: {
    type: "area",
    height: 350,
    animations: { enabled: true },
    toolbar: { show: false },
  },
  series: [
    {
      name: "Request Latency (ms)",
      data: [45, 52, 38, 24, 33, 26, 21],
    },
  ],
  xaxis: {
    categories: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
  },
  colors: ["#3b82f6"],
  stroke: { curve: "smooth", width: 2 },
};

const chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();
```

## Key points
- **SVG rendering**: renders crystal-clear vector graphics at any screen DPI with smooth CSS transitions and crisp text rendering.
- **Time-series and datetime axes**: features native support for Unix timestamps with automatic tick labeling and range zooming/panning.
- **Reactive updates**: provides `.updateSeries()` and `.updateOptions()` methods for updating chart data without triggering a full canvas re-render.
