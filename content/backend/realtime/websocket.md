---
id: websocket
name: "WebSocket protocol"
kind: concept
status: work
tags: [realtime, networking, sockets, duplex, protocol]
what: "Full-duplex, bidirectional communication protocol over a single, persistent TCP connection standardized in RFC 6455."
why: "Enables instant server-to-client push notifications and continuous low-latency data streaming without the high bandwidth and latency overhead of repetitive HTTP request headers."
problem: "Short polling and long polling flood servers with repetitive HTTP headers, waste bandwidth, induce latency, and exhaust server connection limits under high concurrent traffic."
relations:
  - { to: "nodejs", label: "implemented on" }
  - { to: "socket-io", label: "underlying protocol of" }
  - { to: "javascript", label: "supported by" }
links:
  - { title: "MDN WebSocket API", url: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket }
  - { title: "RFC 6455 — The WebSocket Protocol", url: https://www.rfc-editor.org/rfc/rfc6455 }
alsoIn: []
source: work
---

## Example
```js
import http from "node:http";
import { WebSocketServer } from "ws";

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log(`Client connected from ${ip}`);

  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("message", (data, isBinary) => {
    // Broadcast received payload to all connected active clients
    for (const client of wss.clients) {
      if (client !== ws && client.readyState === client.OPEN) {
        client.send(data, { binary: isBinary });
      }
    }
  });

  ws.on("close", () => {
    console.log(`Client disconnected`);
  });
});

// Periodic heartbeat ping to detect dropped client sockets
const interval = setInterval(() => {
  for (const ws of wss.clients) {
    if (!ws.isAlive) {
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  }
}, 30000);

server.listen(8080);
```

## Key points
- **Core mental model**: HTTP Upgrade handshake — starts as standard HTTP `GET` with `Upgrade: websocket` and `Connection: Upgrade` headers; once the server responds with status `101 Switching Protocols`, both sides switch to a lightweight, framed TCP socket.
- **Common pitfall**: Omitting heartbeat ping/pong keepalives; intermediate reverse proxies (Nginx, AWS ALB, Cloudflare) automatically close idle TCP connections after 60 seconds without data exchange.
- **Today**: Native `WebSocket` client is supported universally across all browsers and Node.js 21+ (`globalThis.WebSocket`); for horizontal scaling across multi-instance clusters, WebSocket servers publish messages via Redis Pub/Sub channels.
