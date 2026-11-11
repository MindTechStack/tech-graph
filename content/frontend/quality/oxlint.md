---
id: oxlint
name: "oxlint"
kind: tool
status: work
tags: [rust-linter, ultra-fast, oxc, static-analysis, zero-config]
what: "Ultra-fast, Rust-based JavaScript and TypeScript linter from the Oxc toolchain designed to catch bugs with zero configuration."
why: "Runs 50 to 100 times faster than ESLint, allowing instant feedback on massive codebases without bogging down developer workflow or CI pipelines."
problem: "Heavy ESLint rule suites with many plugins become unbearably slow on large monorepos, discouraging frequent linting during local development."
relations:
  - { to: eslint, label: "faster alternative to" }
  - { to: oxfmt, label: "sibling tool to" }
  - { to: typescript, label: "analyzes" }
links:
  - { title: "Oxlint Documentation", url: "https://oxc.rs/docs/guide/usage/linter.html" }
alsoIn: []
source: work
---

## Example
```json
{
  "plugins": ["react", "typescript", "unicorn"],
  "categories": {
    "correctness": "error",
    "perf": "warn",
    "suspicious": "warn"
  },
  "rules": {
    "no-unused-vars": "error",
    "no-debugger": "error",
    "typescript/no-explicit-any": "warn"
  }
}
```

## Key points
- **Massive speedup**: written in Rust on top of the Oxc parser, executing full repository checks in tens of milliseconds rather than seconds.
- **Focused on correctness**: prioritizes detecting actual logic errors, unsafe types, and performance anti-patterns over subjective styling conventions.
- **Drop-in CI check**: can run alongside or ahead of ESLint in CI to fail broken builds immediately before expensive type-checking starts.
