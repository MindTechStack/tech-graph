---
id: morgan
name: "Morgan"
kind: library
status: learned
tags: [logging, middleware, express, http, debugging]
what: "HTTP request logger middleware for Node.js that formats and logs incoming HTTP requests and response status codes."
why: "Offers predefined standard formats (dev, combined, common, tiny) for instant visibility of request method, path, response status, content length, and response time."
problem: "Manually attaching listeners to request and response events to calculate response duration and status codes across every endpoint is repetitive and error-prone."
relations:
  - { to: "logging", label: "specializes" }
  - { to: "express", label: "middleware for" }
  - { to: "middleware", label: "built as" }
  - { to: "winston", label: "streamed to" }
links:
  - { title: "Morgan Documentation", url: https://github.com/expressjs/morgan }
alsoIn: []
source: course
---

## Example
```js
import express from "express";
import morgan from "morgan";

const app = express();

// Use concise color-coded output in development
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  // Use standard Apache combined format in production
  app.use(morgan("combined"));
}

// Custom Morgan token example
morgan.token("body-summary", (req) => {
  return req.body ? JSON.stringify(req.body).slice(0, 50) : "-";
});

app.use(
  morgan(":date[iso] :method :url :status :response-time ms - body: :body-summary")
);

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(3000);
```

## Key points
- **Core mental model**: Express middleware lifecycle hook — Morgan intercepts the request initiation, listens for the response `finish` event, and formats telemetry (method, URL, status code, latency) into an output stream.
- **Common pitfall**: Using the colorized `dev` format in production; ANSI color codes corrupt JSON log ingestion pipelines in Elasticsearch, CloudWatch, and Datadog.
- **Today**: While Morgan is ubiquitous in Express course materials, modern high-performance microservices typically use `pino-http` for zero-overhead structured JSON logging and native trace correlation.
