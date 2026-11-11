---
id: node-typescript
name: "Node.js + TypeScript (tsc, ts-node/tsx)"
kind: concept
status: learned
tags: [typescript, compiler, transpilation, tsx, type-safety]
what: "Toolchains and workflows for developing Node.js backend applications in TypeScript using tsc for builds and ts-node or tsx for development execution."
why: "Brings compile-time static type safety, intelligent autocompletion, refactoring confidence, and self-documenting data models to server-side codebases."
problem: "Plain JavaScript lacks static type checks, allowing runtime null references, misspelled properties, and mismatched function signatures to escape into production."
relations:
  - { to: "nodejs", label: "executed in" }
  - { to: "typescript", label: "extends with static types" }
  - { to: "node-modules", label: "transpiles into" }
links:
  - { title: "TypeScript Node Starter Guide", url: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html" }
  - { title: "tsx Documentation", url: "https://github.com/privatenumber/tsx" }
alsoIn: []
source: course
---

## Example
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "sourceMap": true
  },
  "include": ["src/**/*"]
}
```

## Key points
- **Compilation vs live execution**: `tsc` compiles TypeScript down to JavaScript files for production deployments; fast runtime wrappers (`tsx`, `ts-node`) compile in-memory on the fly during development.
- **NodeNext module resolution**: setting `"moduleResolution": "NodeNext"` enforces proper ES Module resolution rules, requiring explicit file extensions in relative imports.
- **Today**: Node.js 22.6+ includes experimental native type stripping (`node --experimental-strip-types`), allowing running TypeScript files directly without any compiler or transpiler in development.
