---
id: oxfmt
name: "oxfmt"
kind: tool
status: work
tags: [code-formatter, rust-tool, ultra-fast, oxc, code-style]
what: "Rust code formatter from the Oxc project, built as a Prettier-compatible replacement."
why: "Formats entire codebases in milliseconds with consistent rules and zero configuration, eliminating code formatting bottlenecks in CI."
problem: "Node-based formatters like Prettier can take minutes on large monorepos during pre-commit hooks or continuous integration checks."
relations:
  - { to: oxlint, label: "complements" }
  - { to: typescript, label: "formats" }
  - { to: javascript, label: "formats" }
links:
  - { title: "Oxc Formatter Project", url: "https://oxc.rs/" }
alsoIn: []
source: work
---

## Example
```json
{
  "scripts": {
    "format": "oxfmt src scripts",
    "format:check": "oxfmt --check src scripts"
  }
}
```

## Key points
- **Prettier compatibility**: aims for output consistency with Prettier conventions so teams can migrate without mass Git diff churn.
- **Instant pre-commit execution**: formats staged files in milliseconds, making pre-commit git hooks imperceptible to engineers.
- **Unified toolchain**: works hand-in-hand with `oxlint` and the broader Rust-based Oxc JavaScript tooling stack.
