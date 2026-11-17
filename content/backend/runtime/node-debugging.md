---
id: node-debugging
name: "Debugging Node (VS Code debugger, inspect)"
short: Debugging Node
kind: concept
status: learned
tags: [debugging, inspector, vs-code, breakpoints, diagnostics]
what: "Diagnostic tools and protocols (V8 inspector protocol, node --inspect, and IDE debuggers) for setting breakpoints, stepping through execution, and inspecting memory state."
why: "Enables rapid root-cause analysis of asynchronous race conditions, memory leaks, uncaught exceptions, and logical bugs without relying on print statement trial and error."
problem: "Relying exclusively on console.log requires repeated code edits and restarts, clutters commit history, and cannot inspect closure scopes or stack traces interactively."
relations:
  - { to: "nodejs", label: "runtime debug protocol in" }
  - { to: "nodemon", label: "combined with for live debugging" }
links:
  - { title: "Node.js Debugging Guide", url: "https://nodejs.org/en/learn/getting-started/debugging" }
  - { title: "VS Code Node.js Debugging", url: "https://code.visualstudio.com/docs/nodejs/nodejs-debugging" }
alsoIn: []
source: course
---

## Example
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Server (Node / TS)",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npx",
      "runtimeArgs": ["tsx", "src/server.ts"],
      "restart": true,
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "sourceMaps": true,
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

## Key points
- **Inspector flags**: `node --inspect` starts the V8 debugger on port 9229; `node --inspect-brk` pauses execution on the very first statement before application code runs.
- **Chrome DevTools integration**: open `chrome://inspect` in any Chromium browser to attach full DevTools (Sources, Profiler, Memory Heap Snapshot) directly to a running Node process.
- **Source maps**: when running transpiled TypeScript or bundled JavaScript, ensure `sourceMap: true` is configured in `tsconfig.json` so breakpoints correctly bind to original source files.
