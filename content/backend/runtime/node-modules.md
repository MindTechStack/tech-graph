---
id: node-modules
name: "Modules (CommonJS vs ES Modules)"
short: CommonJS vs ESM
kind: concept
status: learned
tags: [modules, commonjs, esm, imports, modularity]
what: "Code modularity standards in Node.js, contrasting legacy CommonJS (require and module.exports) with standard ECMAScript Modules (import and export)."
why: "Provides encapsulation, dependency scoping, and explicit API boundaries across backend source files and third-party packages."
problem: "Without an isolated module system, all script files pollute the global execution scope, creating naming collisions and preventing static tree-shaking."
relations:
  - { to: "nodejs", label: "module systems in" }
  - { to: "node-typescript", label: "compiled target of" }
links:
  - { title: "Node.js ECMAScript Modules", url: "https://nodejs.org/api/esm.html" }
  - { title: "Node.js CommonJS Modules", url: "https://nodejs.org/api/modules.html" }
alsoIn: []
source: course
---

## Example
```js
// ECMAScript Module (ESM) — modern standard (package.json "type": "module" or .mjs)
import path from "node:path";
import { fileURLToPath } from "node:url";

export const currentDir = path.dirname(fileURLToPath(import.meta.url));

export async function loadConfig(configName) {
  const fullPath = path.join(currentDir, `${configName}.json`);
  const module = await import(fullPath, { with: { type: "json" } });
  return module.default;
}

// CommonJS (CJS) — legacy equivalent (.cjs)
// const path = require("node:path");
// module.exports = { currentDir: __dirname };
```

## Key points
- **Static vs dynamic loading**: ESM `import` statements are parsed and analyzed statically before execution (enabling tree-shaking), whereas CJS `require()` is a synchronous runtime function call.
- **Missing CJS globals in ESM**: `__dirname`, `__filename`, and `require` do not exist in ES Modules; use `import.meta.url` with `node:url` helpers or `createRequire` when needed.
- **Interoperability**: ESM can import CommonJS default exports, but CommonJS cannot synchronously `require()` an ES Module; it must use asynchronous `import()`.
