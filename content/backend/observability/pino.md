---
id: pino
name: "Pino"
kind: library
status: planned
tags: [logging, json-logs, performance, fastify, nodejs]
what: "Extremely fast, low-overhead Node.js JSON logger designed to minimize CPU and event loop impact in production."
why: "Up to 5x faster than alternatives by serializing JSON directly to process.stdout and offloading formatting or log-shipping to worker threads or external transports."
problem: "Traditional loggers with synchronous in-process string manipulation and file-writing block the Node.js single-threaded event loop under heavy request load."
relations:
  - { to: "logging", label: "implements" }
  - { to: "winston", label: "alternative to" }
  - { to: "nodejs", label: "optimized for" }
  - { to: "express", label: "integrates with" }
links:
  - { title: "Pino Documentation", url: https://getpino.io/ }
  - { title: "Pino Benchmarks", url: https://getpino.io/#/docs/benchmarks }
alsoIn: []
source: self-study
---

## Example
```js
import pino from "pino";

// Initialize Pino with security redaction and custom base context
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  redact: ["req.headers.authorization", "password", "token"],
  base: {
    service: "billing-service",
    env: process.env.NODE_ENV || "development",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Creating a contextual child logger with fixed request scope
export function handlePayment(userId, orderId, amount) {
  const log = logger.child({ userId, orderId });

  log.info({ amount }, "Processing invoice payment");

  try {
    // Payment execution logic...
    log.info("Payment settled successfully");
  } catch (err) {
    log.error({ err }, "Payment settlement failed");
    throw err;
  }
}
```

## Key points
- **Core mental model**: Asynchronous worker-thread logging — Pino writes single-line raw JSON to `process.stdout` and uses worker threads (`pino/file` or `pino-pretty` in dev) so logging never stalls application throughput.
- **Common pitfall**: Running `pino-pretty` inside production containers; pretty-printing wastes substantial CPU cycles and should only be used in local development via CLI piping (`node app.js | pino-pretty`).
- **Today**: Pino is the default built-in logger in Fastify and the undisputed industry standard for high-throughput, cloud-native Node.js microservices.
