---
id: netlify
name: "Netlify"
kind: platform
status: practiced
tags: [netlify, jamstack, hosting, serverless, frontend, cdn]
what: "Hosting platform for static sites and frontend frameworks with Git-based deploys, serverless functions and a global CDN."
why: "Ships a site from a Git push with deploy previews per pull request, plus built-in forms, redirects and functions without a backend server."
problem: "Hosting a static or SSR frontend by hand means wiring up a CDN, cache invalidation, SSL and preview environments yourself."
relations:
  - { to: git, label: "integrates with" }
  - { to: nuxt, label: "deploys to" }
  - { to: astro, label: "deploys to" }
links:
  - { title: "Netlify Docs", url: "https://docs.netlify.com/" }
  - { title: "netlify.toml reference", url: "https://docs.netlify.com/configure-builds/file-based-configuration/" }
alsoIn: []
source: personal
---

## Example
```toml
# netlify.toml - build settings, redirects and headers
[build]
command = "pnpm build"
publish = "dist"

[[redirects]]
from = "/api/*"
to = "/.netlify/functions/:splat"
status = 200

[[headers]]
for = "/assets/*"
[headers.values]
Cache-Control = "public, max-age=31536000, immutable"
```

## Key points
- **Deploy previews**: every pull request gets its own URL, and any past deploy can be rolled back instantly.
- **SPA fallback**: client-side routers need a `/* /index.html 200` redirect, or deep links return 404.
- **Functions limits**: Netlify Functions are short-lived serverless handlers; long jobs belong on a persistent host like Railway.
