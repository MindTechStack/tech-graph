---
id: cloudflare-r2
name: "Cloudflare R2"
short: R2
kind: service
status: practiced
tags: [cloudflare, r2, object-storage, s3, storage, cdn]
what: "S3-compatible object storage from Cloudflare with zero egress fees."
why: "Stores user uploads, images and static assets behind the standard S3 API, so existing AWS SDK code works while bandwidth stays free."
problem: "Serving files from S3 gets expensive fast because every downloaded byte is billed as egress, and self-hosted file storage does not scale or replicate."
relations:
  - { to: cloudflare, label: "part of" }
  - { to: aws, label: "S3-compatible with" }
  - { to: nodejs, label: "accessed from" }
links:
  - { title: "Cloudflare R2 Docs", url: "https://developers.cloudflare.com/r2/" }
  - { title: "R2 S3 API compatibility", url: "https://developers.cloudflare.com/r2/api/s3/api/" }
alsoIn: []
source: personal
---

## Example
```ts
// Upload a file to R2 with the regular AWS S3 SDK
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

await r2.send(
  new PutObjectCommand({
    Bucket: "uploads",
    Key: `avatars/${userId}.webp`,
    Body: fileBuffer,
    ContentType: "image/webp",
  }),
);
```

## Key points
- **S3 API, `region: "auto"`**: any S3 client works once the endpoint points at the account's R2 URL.
- **Zero egress**: you pay for storage and operations, not for bandwidth, which makes it cheap for public media.
- **Public access**: expose a bucket through a custom domain or `r2.dev`, or hand out short-lived presigned URLs for private files.
