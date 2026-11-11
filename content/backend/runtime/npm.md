---
id: npm
name: "npm & package.json"
kind: tool
status: learned
tags: [package-manager, dependencies, cli, scripts, nodejs]
what: "Default package manager and dependency registry for Node.js, tracking project dependencies, metadata, and lifecycle scripts via package.json."
why: "Enables installing, sharing, updating, and versioning reusable JavaScript libraries across developer environments and CI/CD pipelines."
problem: "Without a package manager, developers must manually download, vendor, and resolve complex dependency graphs and security vulnerability patches."
relations:
  - { to: "nodejs", label: "shipped with" }
  - { to: "node-modules", label: "installs packages into" }
links:
  - { title: "npm Documentation", url: "https://docs.npmjs.com/" }
  - { title: "package.json Specification", url: "https://docs.npmjs.com/cli/v10/configuring-npm/package-json" }
alsoIn: []
source: course
---

## Example
```json
{
  "name": "my-express-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "node --watch src/index.js",
    "build": "tsc",
    "test": "node --test"
  },
  "dependencies": {
    "express": "^4.21.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "typescript": "^5.6.0"
  }
}
```

## Key points
- **package.json vs package-lock.json**: `package.json` declares allowed version ranges (`^` for minor, `~` for patch), while `package-lock.json` pins exact resolved URLs and content hashes for reproducible builds.
- **npm scripts**: lifecycle commands defined in `"scripts"` execute with local `node_modules/.bin` automatically added to `PATH` (e.g. `npm run dev` or `npm test`).
- **Clean installs**: always use `npm ci` in continuous integration pipelines instead of `npm install` to enforce strict lockfile fidelity and avoid unwanted upgrades.
