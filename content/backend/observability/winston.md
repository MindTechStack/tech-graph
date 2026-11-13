---
id: winston
name: "Winston"
kind: library
status: planned
tags: [logging, loggers, transports, formatted-logs, nodejs]
what: "Node.js logging library with custom levels, composable formats and several transports at once."
why: "Enables routing log messages to multiple destinations simultaneously (console, rotating files, MongoDB, HTTP endpoints) with customizable timestamp and color formats."
problem: "Directing error logs to a critical error tracker while sending general audit trails to rotating files requires building custom multi-stream routing logic."
relations:
  - { to: "logging", label: "implements" }
  - { to: "pino", label: "alternative to" }
  - { to: "morgan", label: "ingests from" }
  - { to: "nodejs", label: "logger for" }
links:
  - { title: "Winston Documentation", url: https://github.com/winstonjs/winston }
  - { title: "Winston Daily Rotate File", url: https://github.com/winstonjs/winston-daily-rotate-file }
alsoIn: []
source: self-study
---

## Example
```js
import winston from "winston";

const { combine, timestamp, json, errors, colorize, simple } = winston.format;

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    json()
  ),
  defaultMeta: { service: "order-service" },
  transports: [
    // Send warnings and errors to console with colors in dev
    new winston.transports.Console({
      format: process.env.NODE_ENV === "production"
        ? json()
        : combine(colorize(), simple()),
    }),
    // Route errors specifically to an error log file
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});
```

## Key points
- **Core mental model**: Transport & Format pipeline — log entries pass through a chain of formatters (`format.combine`) and are dispatched to an array of independent `transports` (Console, File, Http).
- **Common pitfall**: Logging unhandled exceptions directly to file transports in high-load scenarios without managing disk space and buffer backpressure, which can degrade process stability.
- **Today**: While Winston remains popular in enterprise Node.js codebases for its versatile transports, newer performance-sensitive cloud-native systems often prefer Pino's lightweight 12-factor stdout approach.
