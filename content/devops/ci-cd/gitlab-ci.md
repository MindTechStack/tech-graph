---
id: gitlab-ci
name: "GitLab CI/CD"
kind: service
status: work
core: true
tags: [gitlab-ci, ci-cd, devops, pipelines, automation]
what: "A comprehensive built-in continuous integration and deployment engine configured through a single .gitlab-ci.yml file in the repository root."
why: "Provides structured pipeline stages (lint, test, build, deploy), container registry integration, and self-hosted runner flexibility for enterprise codebases."
problem: "Fragmented third-party CI systems require complex external webhooks, separate user management, and disjointed pipeline visibility across repositories."
relations:
  - { to: git, label: "integrates with" }
  - { to: docker, label: "integrates with" }
  - { to: github-actions, label: "alternative to" }
links:
  - { title: "GitLab CI/CD Documentation", url: "https://docs.gitlab.com/ee/ci/" }
  - { title: "GitLab CI YAML Reference", url: "https://docs.gitlab.com/ee/ci/yaml/" }
alsoIn: []
source: work
---

## Example
```yaml
# .gitlab-ci.yml
image: node:22-alpine

stages:
  - lint
  - test
  - build
  - deploy

cache:
  key:
    files:
      - pnpm-lock.yaml
  paths:
    - .pnpm-store/

before_script:
  - corepack enable
  - corepack prepare pnpm@latest --activate
  - pnpm config set store-dir .pnpm-store
  - pnpm install --frozen-lockfile

lint_and_types:
  stage: lint
  script:
    - pnpm run lint
    - pnpm run typecheck

unit_tests:
  stage: test
  script:
    - pnpm test

build_artifact:
  stage: build
  script:
    - pnpm run build
  artifacts:
    name: "dist-$CI_COMMIT_SHORT_SHA"
    paths:
      - dist/
    expire_in: 1 week

deploy_production:
  stage: deploy
  script:
    - echo "Deploying build artifacts to production server..."
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
  environment:
    name: production
```

## Key points
- **Explicit pipeline stages**: jobs execute sequentially through defined stages (`lint` -> `test` -> `build` -> `deploy`), where failure in an earlier stage halts subsequent deployment steps.
- **Artifacts vs Cache**: `cache` is used to speed up subsequent jobs across pipeline runs (e.g., dependency store); `artifacts` pass verified build outputs (`dist/`) reliably between stages in the same pipeline.
- **Self-hosted GitLab runners**: easily attach dedicated Docker or Kubernetes runners to your private VPC for compliance, custom hardware, and zero third-party network exposure.
