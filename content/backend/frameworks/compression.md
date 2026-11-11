---
id: compression
name: "compression middleware"
kind: library
status: learned
tags: [compression, gzip, deflate, performance, express]
what: "HTTP middleware for Node.js servers that compresses outgoing response bodies on the fly using Gzip or Deflate based on client Accept-Encoding."
why: "Dramatically decreases network payload transfer sizes (often 60–80% for JSON and HTML), speeding up client load times and reducing bandwidth costs."
problem: "Sending uncompressed JSON arrays or HTML documents wastes server egress bandwidth and increases network latency on slow or mobile connections."
relations:
  - { to: "express", label: "middleware for" }
  - { to: "streams-buffers", label: "compresses chunks via" }
links:
  - { title: "Express compression Middleware", url: "https://github.com/expressjs/compression" }
  - { title: "MDN HTTP Compression", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Compression" }
alsoIn: []
source: course
---

## Example
```js
import express from "express";
import compression from "compression";

const app = express();

// Custom filter to skip already-compressed files or small responses
app.use(
  compression({
    level: 6, // balanced compression level vs CPU usage
    threshold: 1024, // only compress responses >= 1KB
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) return false;
      return compression.filter(req, res);
    },
  })
);

app.get("/api/large-dataset", (req, res) => {
  res.json({ data: Array.from({ length: 1000 }, (_, i) => ({ id: i, text: "Sample text" })) });
});
```

## Key points
- **Threshold setting**: small responses (< 1KB) should skip compression because the gzip framing headers overhead can outweigh size savings.
- **Reverse proxy offloading**: in high-scale production architectures, compression is often offloaded to edge proxies (Nginx, Cloudflare, AWS CloudFront) to save server CPU cycles.
- **Streaming caveats**: responses that stream Server-Sent Events (SSE) or binary assets (JPEG, PNG, MP4) should bypass compression middleware to avoid buffering latency.
