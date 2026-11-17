---
id: node-fs
name: "File System & Path (fs, fs/promises, path)"
short: "File System & Path"
kind: library
status: learned
tags: [file-system, path, io, asynchronous, promises]
what: "Built-in Node.js modules (node:fs, node:fs/promises, and node:path) for reading, writing, and manipulating files, directories, and cross-platform file paths."
why: "Provides asynchronous, non-blocking file I/O operations and path resolution essential for server configuration, file uploads, static asset serving, and CLI tools."
problem: "Synchronous file operations freeze the entire Node.js event loop, preventing all concurrent network requests from being processed until the disk read finishes."
relations:
  - { to: "nodejs", label: "built-in module of" }
  - { to: "streams-buffers", label: "provides streaming file io via" }
  - { to: "multer", label: "persists uploaded files with" }
links:
  - { title: "Node.js File System API", url: "https://nodejs.org/api/fs.html" }
  - { title: "Node.js Path API", url: "https://nodejs.org/api/path.html" }
alsoIn: []
source: course
---

## Example
```js
import fs from "node:fs/promises";
import path from "node:path";

async function saveReport(directory, filename, data) {
  const targetDir = path.resolve(directory);
  const targetPath = path.join(targetDir, filename);

  // Safely ensure nested directory exists
  await fs.mkdir(targetDir, { recursive: true });

  // Write file asynchronously using Promises
  await fs.writeFile(targetPath, JSON.stringify(data, null, 2), "utf8");

  const stat = await fs.stat(targetPath);
  return { path: targetPath, size: stat.size };
}
```

## Key points
- **Always use `node:fs/promises`**: prefer promise-based APIs with `async/await` over callbacks, and strictly avoid `*Sync` methods (`readFileSync`) in request-handling server code.
- **Cross-platform path resolution**: never concatenate paths with manual slashes (`/` or `\`); always use `path.join()` or `path.resolve()` to maintain Windows and POSIX compatibility.
- **Streams for large files**: for files exceeding a few megabytes, avoid buffering full content into RAM with `fs.readFile()`; use `fs.createReadStream()` with streaming pipelines.
