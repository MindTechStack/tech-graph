---
id: eslint
name: "ESLint"
kind: tool
status: work
tags: [static-analysis, code-standards, linter, javascript, typescript]
what: "Pluggable and configurable static analysis tool that identifies problematic patterns and enforces code conventions across JavaScript and TypeScript."
why: "Catches syntax bugs, type errors, dead code, and security vulnerabilities automatically in the editor and in CI before runtime execution."
problem: "Without automated linting, teams waste code review cycles debating stylistic choices while subtle bugs slip undetected into production."
relations:
  - { to: javascript, label: "analyzes" }
  - { to: typescript, label: "analyzes" }
  - { to: oxlint, label: "complemented by" }
links:
  - { title: "ESLint Documentation", url: "https://eslint.org/" }
alsoIn: []
source: work
---

## Example
```js
// eslint.config.js - Modern Flat Config format
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-floating-promises": "error",
    },
  },
);
```

## Key points
- **Flat Config migration**: ESLint v9 replaced legacy `.eslintrc` with modern `eslint.config.js` using standard ES modules and explicit composability.
- **Type-aware linting**: `typescript-eslint` inspects the TypeScript compiler AST to catch unhandled promises, unsafe `any` casts, and logic flaws.
- **Rule fixers**: many stylistic and standard lint rules support automatic code fixing (`eslint --fix`) directly during editor save or pre-commit hooks.
