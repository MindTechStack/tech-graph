---
id: knip
name: "Knip"
kind: tool
status: work
tags: [dead-code, unused-exports, dependency-hygiene, static-analysis, clean-code]
what: "Automated command-line tool that finds unused files, unused exports, dead types, and unlisted dependencies in JavaScript and TypeScript projects."
why: "Keeps codebases and package.json files lean by identifying and eliminating orphaned code and forgotten NPM dependencies."
problem: "Over time, projects accumulate dead files, obsolete utility functions, and ghost packages that bloat bundle sizes and confuse contributors."
relations:
  - { to: typescript, label: "analyzes" }
  - { to: code-splitting, label: "optimizes" }
links:
  - { title: "Knip Documentation", url: "https://knip.dev/" }
alsoIn: []
source: work
---

## Example
```json
{
  "$schema": "https://unpkg.com/knip@5/overview.json",
  "entry": ["src/main.ts", "scripts/**/*.ts"],
  "project": ["src/**/*.ts", "scripts/**/*.ts"],
  "ignoreDependencies": ["@types/*"],
  "rules": {
    "files": "error",
    "dependencies": "error",
    "unlisted": "error",
    "exports": "warn",
    "types": "warn"
  }
}
```

## Key points
- **Comprehensive sweep**: detects unused files, unused exports, unused enum members, unused class members, and unused types.
- **Dependency audit**: detects both unused packages listed in `package.json` and packages imported in code but missing from `dependencies`.
- **Framework plugin awareness**: includes built-in knowledge of Next.js, Vite, Nuxt, Vitest, and ESLint configs so framework entry points are not falsely flagged.
