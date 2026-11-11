---
id: service-workers
name: "Service Workers"
kind: concept
status: work
tags: [background-worker, cache-api, offline, fetch-interception, proxy]
what: "Programmable client-side network proxy running in a separate background thread that can intercept network requests, manage caches, and handle push notifications."
why: "Provides complete programmatic control over network requests and caching strategies, enabling true offline operation and instant repeat visits."
problem: "Without service workers, the browser cannot intercept failed HTTP requests or serve cached assets when the device loses network connectivity."
relations:
  - { to: pwa, label: "core engine of" }
  - { to: browser-apis, label: "part of" }
  - { to: javascript, label: "written in" }
links:
  - { title: "MDN Service Worker API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API" }
  - { title: "Google Chrome Workbox", url: "https://developer.chrome.com/docs/workbox/" }
alsoIn: []
source: work
---

## Example
```ts
// sw.ts - Stale-while-revalidate caching strategy
const CACHE_NAME = "app-cache-v1";

self.addEventListener("fetch", (event: FetchEvent) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      const networkFetch = fetch(event.request).then((networkResponse) => {
        if (networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      });
      return cachedResponse || networkFetch;
    }),
  );
});
```

## Key points
- **Independent lifecycle**: service workers install, activate, and update independently from the active window, requiring explicit cache cleanup on activation.
- **No direct DOM access**: runs on a separate worker thread and communicates with UI documents exclusively via `postMessage` or Broadcast Channel.
- **Caching strategies**: choose between Cache First (static hashed assets), Network First (dynamic API data), or Stale-While-Revalidate (frequently updated content).
