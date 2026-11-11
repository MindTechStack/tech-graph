---
id: multer
name: "Multer (file uploads)"
kind: library
status: learned
tags: [file-upload, multipart, form-data, storage, express]
what: "Node.js middleware for handling multipart/form-data requests, primarily used for uploading files and images in Express applications."
why: "Parses raw streaming multipart HTTP payloads into accessible req.file and req.files metadata objects and saves files to disk or memory storage."
problem: "Standard body parsers like express.json() and express.urlencoded() cannot parse binary multi-part file payloads, dropping uploaded files entirely."
relations:
  - { to: "express", label: "file upload middleware for" }
  - { to: "node-fs", label: "stores files on disk via" }
  - { to: "streams-buffers", label: "handles binary multipart data with" }
links:
  - { title: "Multer Documentation", url: "https://github.com/expressjs/multer" }
  - { title: "MDN multipart/form-data", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type" }
alsoIn: []
source: course
---

## Example
```js
import express from "express";
import multer from "multer";
import path from "node:path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WebP images are allowed."));
    }
  },
});

const app = express();
app.post("/api/avatar", upload.single("avatar"), (req, res) => {
  res.json({ message: "Upload successful", file: req.file });
});
```

## Key points
- **Storage options**: `diskStorage` streams uploads directly to the local filesystem; `memoryStorage` keeps files in a `Buffer` (`req.file.buffer`) for forwarding directly to S3 or Cloudinary.
- **Strict limits**: always set `limits: { fileSize: ... }` to prevent malicious clients from filling server disk space or triggering Out-Of-Memory errors.
- **MIME type verification**: validate `file.mimetype` and inspect magic bytes on sensitive uploads rather than trusting client-provided file extensions.
