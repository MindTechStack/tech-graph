---
id: docker
name: Docker
kind: tool
status: work
core: true
tags: [containers, devops, dockerfile, image, deployment]
what: "Tool for packaging an application with its OS and runtime into reproducible, isolated containers."
why: Guarantees that an app runs identically on a developer's laptop, in CI pipelines, and in production servers.
problem: "'Works on my machine' bugs caused by mismatched Node versions, missing native OS libraries, or conflicting local database installs."
relations:
  - { to: docker-compose, label: "orchestrated by" }
  - { to: nodejs, label: "packages" }
  - { to: mysql, label: "runs" }
  - { to: github-actions, label: "built in" }
links:
  - { title: Docker Docs, url: https://docs.docker.com/ }
  - { title: Node.js Docker Best Practices, url: https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md }
alsoIn: []
source: personal
---

## Example
```dockerfile
# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Minimal production runtime
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
USER node
COPY --from=build --chown=node:node /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build --chown=node:node /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

## Key points
- **Layer caching**: copy `package.json` and `package-lock.json` and run `npm ci` *before* `COPY . .` so Docker reuses the dependency layer whenever source files change.
- **Multi-stage builds**: compile TypeScript/frontend assets in a build stage and copy only the compiled artifacts and production dependencies into a slim runtime image.
- **Run as non-root**: switch to `USER node` in production containers to limit the blast radius of container escapes.
- **Always add `.dockerignore`**: exclude `node_modules`, `.git`, `.env`, and `dist` from the build context.

