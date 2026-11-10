---
id: javascript
name: JavaScript
kind: language
status: work
tags: [ecmascript, esm, closures, async, prototypes]
what: "Dynamic, multi-paradigm programming language (ECMAScript) that powers interactive execution in web browsers and JavaScript server runtimes."
why: "Runs natively in every browser without compilation and supports first-class functions, closures, lexical scoping, ES modules, and non-blocking async I/O."
problem: "Without a client-side scripting language, every user interaction would require a full-page network round-trip to the server."
relations:
  - { to: html, label: "enhances" }
  - { to: browser-apis, label: "calls" }
  - { to: typescript, label: "typed by" }
  - { to: nodejs, label: "executed by" }
links:
  - { title: "MDN: JavaScript Guide", url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide }
  - { title: "The Modern JavaScript Tutorial (javascript.info)", url: https://javascript.info/ }
alsoIn: []
source: work
---

## Example
```js
export async function groupByStatus(items, signal) {
  const active = items.filter((item) => !item.archived);

  // ES2024 Object.groupBy + structuredClone for safe immutability
  const grouped = Object.groupBy(active, (item) => item.status ?? "unknown");

  if (signal?.aborted) {
    throw new DOMException("Operation aborted", "AbortError");
  }

  return structuredClone(grouped);
}
```

## Key points
- **Closures & lexical scope**: functions capture references to their surrounding lexical environment, which powers module encapsulation, callbacks, and framework state hooks—but can also trap stale values if dependencies aren't tracked.
- **Reference vs value**: primitives (`string`, `number`, `boolean`, `symbol`, `bigint`) compare and copy by value, while objects and arrays copy by reference; use spread (`{ ...obj }`, `[...arr]`) or `structuredClone()` for immutable updates.
- **Single-threaded concurrency**: JS executes synchronously on a single call stack and coordinates async work via the microtask queue (`Promise.then`, `await`) and macrotask queue (`setTimeout`, I/O events).

