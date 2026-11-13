---
id: pwa
name: "Progressive Web Apps"
kind: concept
status: work
tags: [web-manifest, offline-first, mobile-web, installability, caching]
what: "Web app that uses a manifest and a service worker to become installable and work offline."
why: "Enables single-codebase web applications to be installed on desktop and mobile home screens with background sync and offline resilience."
problem: "Standard web apps fail immediately without network connectivity and lack native OS features like app icons, splash screens, and push alerts."
relations:
  - { to: service-workers, label: "powered by" }
  - { to: browser-apis, label: "relies on" }
  - { to: lighthouse, label: "audited by" }
links:
  - { title: "MDN Progressive Web Apps", url: "https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps" }
  - { title: "Web.dev PWA Guide", url: "https://web.dev/explore/progressive-web-apps" }
alsoIn: []
source: work
---

## Example
```json
{
  "name": "Tech Graph Dashboard",
  "short_name": "TechGraph",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

## Key points
- **Web App Manifest**: a JSON file defining app name, icons, display mode (`standalone`), and theme colors required for browser installation prompts.
- **HTTPS prerequisite**: service workers and modern PWA APIs require a secure TLS/HTTPS context for execution (except on `localhost`).
- **Progressive enhancement**: core functionality remains fully accessible on standard browsers while modern clients gain offline caching and home screen installation.
