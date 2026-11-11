---
id: heroku
name: "Heroku"
kind: platform
status: learned
tags: [heroku, paas, deployment, hosting, cloud]
what: "A pioneering cloud Platform as a Service (PaaS) that manages containerized application dynos, routing, and add-on databases via Git push deployments."
why: "Abstracts away infrastructure and OS management, allowing developers to deploy production web apps by simply pushing to a remote Git repository."
problem: "Provisioning and maintaining bare Linux virtual machines (SSH, Nginx, systemd, SSL) is time-consuming and error-prone for application developers."
relations:
  - { to: git, label: "integrates with" }
  - { to: nodejs, label: "runs on" }
  - { to: env-variables, label: "uses" }
links:
  - { title: "Heroku Node.js Support", url: "https://devcenter.heroku.com/articles/nodejs-support" }
  - { title: "Heroku Procfile Documentation", url: "https://devcenter.heroku.com/articles/procfile" }
alsoIn: []
source: course
---

## Example
```text
# Procfile in repository root
web: node dist/server.js
```

```json
// package.json engine and script specification for Heroku
{
  "name": "my-express-app",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "engines": {
    "node": "22.x",
    "npm": "10.x"
  }
}
```

```bash
# Deploying to Heroku via Git CLI
heroku create my-app-prod
heroku config:set NODE_ENV=production DATABASE_URL=postgres://...
git push heroku main
```

## Key points
- **Dyno model & ephemeral filesystem**: Heroku dynos reset their local disk upon restart or deploy; file uploads and persistent assets must be written to external object storage (e.g., AWS S3).
- **Procfile declaration**: explicit `Procfile` at the repository root tells Heroku which process types to launch (such as `web:` for HTTP servers and `worker:` for background queues).
- **Today**: Heroku eliminated its popular free tier in November 2022; modern web projects and learning stacks typically deploy to Render, Fly.io, Railway, or Cloudflare, which provide modern developer ergonomics and active free or usage-based pricing models.
