---
id: vercel
name: "Vercel"
kind: platform
status: practiced
tags: [vercel, serverless, hosting, edge, frontend, nextjs]
what: "A cloud deployment platform optimized for modern frontend frameworks and serverless functions, featuring instant preview deployments and global edge CDN."
why: "Delivers automated CI/CD branch preview deployments, zero-configuration framework detection, and optimal edge routing for Next.js, Astro, Nuxt, and SvelteKit."
problem: "Setting up custom CDN invalidation, serverless function packaging, and per-PR preview environments manually requires extensive DevOps engineering."
relations:
  - { to: astro, label: "deploys to" }
  - { to: nextjs, label: "deploys to" }
  - { to: git, label: "integrates with" }
links:
  - { title: "Vercel Documentation", url: "https://vercel.com/docs" }
  - { title: "Vercel CLI Reference", url: "https://vercel.com/docs/cli" }
alsoIn: []
source: personal
---

## Example
```json
// vercel.json - Custom routing, headers, and redirects configuration
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/proxy/:path*",
      "destination": "https://backend-service.internal/:path*"
    }
  ]
}
```

## Key points
- **Automatic branch preview URLs**: every Git pull request automatically generates an isolated, live preview deployment with a unique shareable URL for QA and stakeholder reviews.
- **Serverless execution limits**: API routes and SSR functions run as ephemeral serverless lambdas with duration limits (typically 10-60 seconds) and potential cold-start latency.
- **Zero-config framework integration**: automatically detects Next.js, Astro, Vite, Nuxt, and SvelteKit, applying optimal build output caching and routing rules automatically.
