---
id: nodemon
name: "nodemon"
kind: tool
status: learned
tags: [developer-tools, hot-reload, file-watcher, cli, nodejs]
what: "Command-line utility that monitors the source code of a Node.js application and automatically restarts the process when file changes are detected."
why: "Accelerates backend development workflow by eliminating the need to manually stop and re-execute the node command after every code edit."
problem: "Without an automatic file watcher, developers frequently test outdated code in development because they forgot to restart the running server process."
relations:
  - { to: "nodejs", label: "monitors process for" }
  - { to: "node-debugging", label: "used with" }
links:
  - { title: "Nodemon Documentation", url: "https://nodemon.io/" }
  - { title: "Nodemon GitHub Repository", url: "https://github.com/remy/nodemon" }
alsoIn: []
source: course
---

## Example
```json
{
  "watch": ["src"],
  "ext": "ts,js,json",
  "ignore": ["src/**/*.spec.ts", "node_modules"],
  "exec": "node --inspect=0.0.0.0:9229 -r ts-node/register src/server.ts",
  "delay": 200
}
```

## Key points
- **Configuration flexibility**: configured via `nodemon.json`, command-line arguments, or the `"nodemonConfig"` field inside `package.json`.
- **Ignore paths**: always exclude output build directories, test files, and database dump folders from watching to prevent restart loops.
- **Graceful restart**: sends `SIGUSR2` on restarts, allowing applications to catch the signal, close open database connections, and shut down cleanly.
- **Today**: Modern Node.js (v18.11+) provides built-in file watching via `node --watch` and `node --watch-path`, eliminating the need for nodemon as an external dependency in many projects.
