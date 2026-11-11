---
id: socket-io
name: "Socket.IO"
kind: library
status: work
tags: [realtime, websockets, events, polling, rooms]
what: "Event-based bidirectional communication library featuring automatic fallback to HTTP long-polling, connection recovery, and room abstractions."
why: "Provides robust high-level primitives (named event listeners, rooms, acknowledgments, broadcasts) and auto-reconnection where raw WebSockets require manual implementation."
problem: "Raw WebSockets lack built-in reconnection logic, event multiplexing, packet acknowledgments, room-based multicasting, and fallback when WebSockets are blocked by corporate proxies."
relations:
  - { to: "websocket", label: "abstracts" }
  - { to: "nodejs", label: "server runs on" }
  - { to: "express", label: "attaches to" }
links:
  - { title: "Socket.IO Documentation", url: https://socket.io/docs/v4/ }
  - { title: "Socket.IO Redis Adapter", url: https://socket.io/docs/v4/redis-adapter/ }
alsoIn: [frontend]
source: work
---

## Example
```js
import http from "node:http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "https://example.com" },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Join a dedicated chat room
  socket.on("room:join", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user:joined", { userId: socket.id });
  });

  // Handle message with client acknowledgment callback
  socket.on("message:send", ({ roomId, text }, callback) => {
    const payload = { senderId: socket.id, text, timestamp: Date.now() };

    // Broadcast to everyone in room except sender
    socket.to(roomId).emit("message:received", payload);

    // Acknowledge receipt back to the sender
    if (typeof callback === "function") {
      callback({ status: "delivered", timestamp: payload.timestamp });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client ${socket.id} disconnected: ${reason}`);
  });
});

server.listen(3000);
```

## Key points
- **Core mental model**: Engine.IO transport abstraction — Socket.IO initiates connections via HTTP long-polling to guarantee connectivity across restricted proxies, then transparently upgrades to WebSocket once supported.
- **Common pitfall**: Scaling horizontally across multiple server instances without sticky sessions or a cluster adapter; load balancers must enable cookie-based sticky sessions for the HTTP polling handshake, and servers need `@socket.io/redis-adapter` to distribute broadcasts across processes.
- **Today**: Socket.IO v4 provides full TypeScript end-to-end typing for client-to-server and server-to-client events, plus connection state recovery that restores missed packets during brief network disconnections.
