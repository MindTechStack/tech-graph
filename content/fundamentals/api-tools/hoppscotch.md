---
id: hoppscotch
name: "Hoppscotch"
kind: tool
status: planned
tags: [hoppscotch, api-client, open-source, web-based, graphql]
what: "A lightweight, open-source web-based API development ecosystem built with Vue, accessible directly from the browser or as a desktop application."
why: "Allows zero-install, instant API testing from any web browser while supporting self-hosting, WebSockets, SSE, MQTT, and GraphQL."
problem: "Traditional API desktop clients require heavy Electron installs and multi-gigabyte memory footprints just to test a few HTTP endpoints."
relations:
  - { to: api-clients, label: "part of" }
  - { to: postman, label: "alternative to" }
  - { to: websocket, label: "tests" }
links:
  - { title: "Hoppscotch Web App", url: "https://hoppscotch.io/" }
  - { title: "Hoppscotch Docs", url: "https://docs.hoppscotch.io/" }
alsoIn: []
source: self-study
---

## Example
```bash
# Run a self-hosted Hoppscotch instance via Docker on private infrastructure
docker run -d \
  --name hoppscotch \
  -p 3000:3000 \
  -e VITE_BACKEND_FIREBASE_VAULT_ENABLED=false \
  hoppscotch/hoppscotch:latest

# Or test directly in any browser with the Hoppscotch browser extension
# to bypass cross-origin browser CORS restrictions on localhost
```

```js
// Hoppscotch Pre-request Script (JavaScript)
pw.env.set("requestTimestamp", new Date().toISOString());
pw.env.set("nonce", Math.random().toString(36).substring(2));
```

## Key points
- **Zero-installation access**: opens in seconds in any browser tab (`hoppscotch.io`) without downloading multi-gigabyte desktop software packages.
- **Protocol versatility**: native UI support for REST, GraphQL (with schema explorer), real-time WebSockets, Server-Sent Events (SSE), and Socket.IO.
- **Browser extension for CORS**: install the official Hoppscotch browser extension to bypass CORS restrictions when calling local development APIs (`localhost:3000`) from the browser tab.
