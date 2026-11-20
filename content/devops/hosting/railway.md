---
id: railway
name: "Railway"
kind: platform
status: practiced
tags: [railway, paas, deployment, hosting, databases]
what: "Platform as a Service that deploys apps, workers and databases from a Git repo or Dockerfile with usage-based pricing."
why: "Runs long-lived backend services and managed Postgres/Redis/MongoDB side by side in one project, with preview environments and no server management."
problem: "Serverless hosts can't run persistent processes, websockets or background workers, while raw VPS setups need manual provisioning, SSL and deploy scripts."
relations:
  - { to: git, label: "integrates with" }
  - { to: docker, label: "builds from" }
  - { to: nodejs, label: "runs on" }
  - { to: postgresql, label: "provisions" }
  - { to: env-variables, label: "uses" }
links:
  - { title: "Railway Docs", url: "https://docs.railway.com/" }
  - { title: "Railway Config as Code", url: "https://docs.railway.com/reference/config-as-code" }
alsoIn: []
source: personal
---

## Example
```toml
# railway.toml - build and deploy settings kept in the repo
[build]
builder = "RAILPACK"
buildCommand = "pnpm build"

[deploy]
startCommand = "node dist/server.js"
healthcheckPath = "/health"
restartPolicyType = "ON_FAILURE"
```

## Key points
- **Long-running services**: unlike serverless platforms, a Railway service is a persistent container, fine for websockets, queues and cron workers.
- **Reference variables**: `${{Postgres.DATABASE_URL}}` wires a service to a database in the same project without copying secrets.
- **Usage-based billing**: you pay for CPU/RAM actually used, so idle hobby services stay cheap but set limits to avoid surprises.
