---
id: leaflet
name: "Leaflet / Google Maps"
kind: library
status: work
tags: [interactive-maps, gis, tile-layer, markers, geojson]
what: "Leading lightweight open-source JavaScript library for mobile-friendly interactive maps, tile rendering, and geospatial data visualization."
why: "Provides an easy-to-use API for rendering interactive vector markers, popups, and GeoJSON layers on top of OpenStreetMap or Google Maps tiles."
problem: "Rendering interactive geospatial maps and handling custom projections manually on HTML5 canvas is exceptionally complex and error-prone."
relations:
  - { to: javascript, label: "built with" }
  - { to: browser-apis, label: "uses" }
links:
  - { title: "Leaflet Documentation", url: "https://leafletjs.com/reference.html" }
  - { title: "Google Maps JavaScript API", url: "https://developers.google.com/maps/documentation/javascript/overview" }
alsoIn: []
source: work
---

## Example
```ts
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Initialize map centered at coordinates [lat, lng]
const map = L.map("map-container").setView([50.4501, 30.5234], 13);

// Add OpenStreetMap raster tile layer
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Add custom marker with popup
L.marker([50.4501, 30.5234])
  .addTo(map)
  .bindPopup("<b>Tech Node HQ</b><br />Kyiv Engineering Center")
  .openPopup();
```

## Key points
- **Tile layer architecture**: renders maps as a grid of 256x256 image tiles fetched asynchronously according to zoom level and bounding box.
- **GeoJSON integration**: native `L.geoJSON()` parsing converts standard GeoJSON geometry objects directly into interactive vector layers and click listeners.
- **Lifecycle cleanup**: always call `map.remove()` during component unmount in Vue or React to prevent memory leaks and orphaned DOM event listeners.
