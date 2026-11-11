---
id: streams-buffers
name: "Streams & Buffers"
kind: concept
status: learned
tags: [streams, buffers, binary-data, memory-management, backpressure]
what: "Node.js abstractions for handling continuous chunks of data (Readable, Writable, Transform streams) and fixed-size raw binary memory allocations (Buffer)."
why: "Enables processing multi-gigabyte files and continuous network streams chunk-by-chunk in small, constant memory footprints with automatic backpressure."
problem: "Buffering an entire large video, database export, or upload into RAM causes Out-Of-Memory (OOM) process crashes and high latency under concurrent loads."
relations:
  - { to: "nodejs", label: "core data handling in" }
  - { to: "node-fs", label: "streams files using" }
  - { to: "node-http", label: "streams requests and responses in" }
links:
  - { title: "Node.js Streams API", url: "https://nodejs.org/api/stream.html" }
  - { title: "Node.js Buffer API", url: "https://nodejs.org/api/buffer.html" }
alsoIn: []
source: course
---

## Example
```js
import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import zlib from "node:zlib";

async function compressLogFile(sourcePath, destPath) {
  const readStream = fs.createReadStream(sourcePath);
  const gzipTransform = zlib.createGzip();
  const writeStream = fs.createWriteStream(destPath);

  // pipeline handles error propagation and cleanup automatically
  await pipeline(readStream, gzipTransform, writeStream);
  console.log("Log compression completed successfully");
}
```

## Key points
- **Four stream types**: Readable (`fs.createReadStream`), Writable (`fs.createWriteStream`, HTTP response), Duplex (net socket), and Transform (`zlib.createGzip`, crypto cipher).
- **Backpressure and pipeline**: when data production outpaces consumption, streams signal to pause; always use `stream/promises` `pipeline()` rather than `.pipe()` to handle errors cleanly.
- **Buffers outside V8 heap**: `Buffer` instances represent raw binary memory allocated outside V8 garbage collection; convert to and from strings with explicit encodings (`utf8`, `base64`, `hex`).
