---
id: github-actions
name: "GitHub Actions"
kind: service
status: work
tags: [github-actions, ci-cd, automation, devops, testing]
what: "A continuous integration and continuous delivery (CI/CD) platform natively integrated into GitHub for automating build, test, and deployment workflows."
why: "Automates test suites on pull requests, enforces linting gates, and deploys production builds automatically upon merging to release branches."
problem: "Manual testing and manual deployments lead to human error, untested code merged into main, inconsistent production builds, and delayed releases."
relations:
  - { to: git, label: "integrates with" }
  - { to: vitest, label: "tests" }
  - { to: docker, label: "integrates with" }
  - { to: vercel, label: "deploys to" }
links:
  - { title: "GitHub Actions Documentation", url: "https://docs.github.com/en/actions" }
  - { title: "GitHub Actions Workflow Syntax", url: "https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions" }
alsoIn: []
source: work
---

## Example
```yaml
# .github/workflows/ci.yml
name: CI & Quality Gate

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run linter and typecheck
        run: |
          pnpm run lint
          pnpm run typecheck

      - name: Run unit & integration tests
        run: pnpm test

      - name: Build application bundle
        run: pnpm run build
```

## Key points
- **Cancel in-progress runs**: use `concurrency: { cancel-in-progress: true }` to automatically cancel outdated CI runs when new commits are pushed to the same pull request, saving runner minutes.
- **Dependency caching**: leverage official setup actions (`actions/setup-node` with `cache: 'pnpm'`) to avoid downloading `node_modules` from scratch on every run.
- **Environment secrets protection**: store sensitive tokens (API keys, deployment credentials) in GitHub Repository Secrets and inject them into steps via `env: { KEY: ${{ secrets.KEY }} }`.
