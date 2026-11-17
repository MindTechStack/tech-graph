---
id: event-loop
name: "Event Loop & Non-blocking I/O"
short: Event Loop
kind: concept
status: learned
tags: [event-loop, concurrency, libuv, asynchronous, non-blocking]
what: "Runtime orchestration mechanism in Node.js powered by libuv that coordinates asynchronous callbacks across distinct phases on a single JavaScript execution thread."
why: "Enables Node.js to achieve massive I/O throughput with minimal memory footprint without dedicating an operating system thread to each incoming connection."
problem: "Traditional thread-per-request concurrency models allocate megabytes of stack per thread, exhausting operating system memory under thousands of idle or waiting connections."
relations:
  - { to: "nodejs", label: "core runtime engine of" }
  - { to: "async-await", label: "schedules callbacks for" }
  - { to: "streams-buffers", label: "drives non-blocking data for" }
links:
  - { title: "Node.js Event Loop Guide", url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick" }
  - { title: "libuv Design Overview", url: "https://docs.libuv.org/en/v1.x/design.html" }
alsoIn: []
source: course
---

## Example
```js
import fs from "node:fs";

console.log("1: Synchronous start");

setTimeout(() => console.log("5: Timers phase (setTimeout)"), 0);
setImmediate(() => console.log("6: Check phase (setImmediate)"));

Promise.resolve().then(() => console.log("3: Microtask (Promise)"));
process.nextTick(() => console.log("2: Microtask (process.nextTick)"));

fs.readFile(new URL(import.meta.url), () => {
  console.log("4: Poll phase (I/O callback)");
});

console.log("1b: Synchronous end");
// Output order: 1, 1b, 2, 3, 5 (or 6 depending on tick), 4, 6
```

## Key points
- **Six distinct phases**: Timers (`setTimeout`), Pending callbacks, Idle/prepare, Poll (retrieves new I/O events), Check (`setImmediate`), and Close callbacks (`socket.on('close')`).
- **Microtask queue draining**: `process.nextTick` and `Promise` microtask queues execute immediately after current synchronous JavaScript completes, before the event loop advances to the next phase.
- **Never block the event loop**: synchronous CPU-heavy work (`fs.readFileSync`, heavy regex, `crypto.pbkdf2Sync`, complex JSON parsing) blocks all concurrent client requests.
