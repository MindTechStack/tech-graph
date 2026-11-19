---
id: logging
name: "Logging (concepts)"
kind: concept
status: learned
tags: [observability, logs, structured-logging, monitoring, debugging]
what: "Systematic recording of application runtime events, state changes, performance metrics, and errors into machine-readable output streams."
why: "Provides visibility into production behavior, enables rapid root-cause diagnosis during outages, and correlates distributed transactions across microservices."
problem: "Without structured logging, debugging production incidents relies on guesswork, unsearchable multi-line console dumps, and unstructured text that log aggregators cannot parse or filter."
relations:
  - { to: "pino", label: "implemented by" }
  - { to: "winston", label: "implemented by" }
  - { to: "morgan", label: "specialized by" }
  - { to: "nodejs", label: "runtime standard for" }
links:
  - { title: "12-Factor App: Logs", url: https://12factor.net/logs }
  - { title: "OWASP Logging Cheat Sheet", url: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html }
alsoIn: []
source: self-study
---

## Log Levels & When to Use Them

Log levels categorize the urgency and granularity of events, allowing production environments to filter out noisy messages while retaining critical telemetry.

| Level | Severity | Meaning & When to Use | Example Scenario |
|---|---|---|---|
| **`fatal`** | Highest (60) | The application encountered an unrecoverable failure and must terminate immediately. | Database connection pool cannot start; missing mandatory environment secrets on startup; unhandled process crash. |
| **`error`** | High (50) | An operation failed, but the overall service continues running. Demands developer investigation. | Payment processing failed; 500 Internal Server Error in route handler; third-party webhook failure. |
| **`warn`** | Medium (40) | Unexpected behavior or recoverable anomaly that does not yet break the application, but might indicate impending failure. | Database connection took >2s; API rate limit threshold reached (85%); deprecated route or argument accessed. |
| **`info`** | Normal (30) | High-level milestones confirming expected system operation. Default production log level. | Server listening on port 3000; user signup completed; scheduled cron job finished; order #123 created. |
| **`debug`** | Low (20) | Detailed diagnostics for developers investigating issues in staging or targeted local debugging. | Parsed SQL query string; middleware execution order; internal state transitions; payload sizes. |
| **`trace`** | Lowest (10) | Extremely granular step-by-step program execution flow, function inputs/outputs, and packet traces. | Raw socket packet chunks; individual loop iterations; full serialized cache keys before evaluation. |

## Structured JSON Logs & Request Correlation

### Why Structured JSON Over Plain Text

Traditional string logging (`console.log("User " + id + " failed login at " + Date.now())`) creates unindexed, arbitrary text strings. In production fleets processing millions of requests:
- **Searchability & Filtering**: Log aggregators (Datadog, Elasticsearch, Loki) can instantly index and filter JSON keys (e.g. `query: { "user.id": 42, "status": 500 }`) without fragile regular expressions.
- **Consistent Schema**: Every log line contains uniform top-level fields: `time`, `level`, `pid`, `hostname`, `msg`, and contextual metadata.
- **Metric Extraction**: Aggregators can derive numerical metrics directly from JSON attributes (e.g., average `responseTimeMs`).

### Request Correlation & `requestId` Propagation

In asynchronous and distributed systems, logs from concurrent operations interleave. To trace a single user action through middleware, database calls, external services, and background jobs:
1. **Assign Correlation ID**: At the API boundary (Express middleware or API Gateway), generate or extract a unique identifier (e.g. `X-Request-Id: crypto.randomUUID()`).
2. **Context Propagation**: Use `AsyncLocalStorage` or child loggers to attach the `requestId` to every subsequent log entry in that asynchronous execution tree.
3. **Downstream Forwarding**: Pass the correlation ID in outgoing HTTP headers (`X-Request-Id` or W3C `traceparent`) when invoking microservices or queueing background workers.

## Morgan vs Pino vs Winston

| Feature | Morgan | Pino | Winston |
|---|---|---|---|
| **Primary Purpose** | HTTP request/response access logging middleware | High-performance, low-overhead general application and JSON logger | Versatile multi-transport application logger with rich formatting pipelines |
| **Performance** | Fast (Express-specific hook) | **Extremely fast** (minimal CPU overhead, offloads parsing to worker threads) | Moderate (in-process format chaining and multi-transport overhead) |
| **Log Format** | Formatted string lines (`dev`, `combined`, `common`, `tiny`) or custom strings | **Strict single-line JSON** by default (colorized via `pino-pretty` in CLI) | Highly configurable (JSON, printf strings, colorized text, custom formats) |
| **Transports** | Stream output (usually piped to `process.stdout` or a file stream) | External process / thread worker transports (keeps Node event loop unblocked) | In-process transports (Console, DailyRotateFile, Http, Datadog, MongoDB) |
| **Best Use Case** | Classic Express educational apps and simple HTTP access logging | **Modern cloud-native Node.js microservices**, Fastify, and high-throughput APIs | Enterprise monoliths requiring complex log formatting and simultaneous local file rotation |

## Security: What NEVER to Log & Where Logs Go

### What NEVER to Log
Application logs are routinely forwarded to third-party dashboards, indexed in databases, and accessible to development and support teams. To comply with GDPR, HIPAA, and PCI-DSS, **never log sensitive data**:
- **Credentials & Tokens**: Passwords, password hashes, API keys, bearer JWT tokens, OAuth access/refresh tokens.
- **Payment Card Data (PCI-DSS)**: Full credit/debit card numbers (PAN), CVV/CVC verification codes, expiration dates.
- **Personally Identifiable Information (PII)**: Social Security numbers, government national IDs, driver license numbers, health records.
- **Sanitization Strategy**: Configure logger redaction rules (`redact: ['req.headers.authorization', 'req.body.password', 'card.cvv']`) to automatically mask sensitive fields with `"[REDACTED]"` before output.

### Where Logs Go (The 12-Factor Rule)
According to the **12-Factor App methodology (XI. Logs)**, an application should never concern itself with routing or storing its own log files:
1. **Standard Output**: The application writes all event streams directly to `process.stdout` (and errors to `process.stderr`) as unbuffered JSON streams.
2. **Container Runtime & Log Shippers**: The execution environment (Docker, Kubernetes, AWS ECS) captures stdout. Dedicated host-level log shippers (Datadog Agent, Fluent Bit, Promtail, Filebeat) tail the container output asynchronously.
3. **Centralized Log Aggregators**: Shippers ingest the streams into centralized storage and indexing platforms:
   - **Datadog / New Relic**: Full-stack APM, log indexing, and distributed tracing.
   - **Grafana Loki**: Cost-efficient, label-indexed log aggregation paired with Prometheus and Grafana.
   - **ELK Stack (Elasticsearch, Logstash, Kibana)**: Full-text indexing and enterprise log analytics.
   - **Sentry**: Dedicated error tracking and stack trace triage (triggered for uncaught exceptions).

## Example
```js
import express from "express";
import crypto from "node:crypto";
import pino from "pino";
import pinoHttp from "pino-http";

// 1. Initialize Pino with security redaction and JSON output
export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.body.password",
      "req.body.confirmPassword",
      "req.body.creditCard",
    ],
    censor: "[REDACTED]",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

const app = express();
app.use(express.json());

// 2. Attach HTTP request logger with correlation ID generation
app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.headers["x-request-id"] || crypto.randomUUID(),
    customLogLevel: (_req, res, err) => {
      if (res.statusCode >= 500 || err) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
    customSuccessMessage: (req, res) => `${req.method} ${req.url} completed with status ${res.statusCode}`,
  })
);

app.post("/api/login", (req, res) => {
  // req.log is a child logger carrying the unique requestId and request context
  req.log.info({ userEmail: req.body.email }, "User login attempt received");

  if (!req.body.email || !req.body.password) {
    req.log.warn({ userEmail: req.body.email }, "Login rejected: missing credentials");
    return res.status(400).json({ error: "Missing email or password" });
  }

  // Simulated authentication success
  req.log.info({ userEmail: req.body.email }, "User authenticated successfully");
  return res.status(200).json({ status: "authenticated" });
});

app.listen(3000, () => {
  logger.info("Server started on port 3000");
});
```

## Key points
- **Core mental model**: Logs as continuous event streams — apps emit timestamped structured events to `stdout`; log shippers collect, batch, and route them to search engines without blocking the runtime.
- **Common pitfall**: Using `console.log()` with string concatenation or object dumps in production; it blocks the single-threaded event loop during synchronous stringification and produces unindexable multiline output.
- **Security imperative**: Always enable automated redaction for sensitive payload paths (passwords, tokens, card details) before sending logs to centralized aggregators.
