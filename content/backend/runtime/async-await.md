---
id: async-await
name: "Promises & async/await"
kind: concept
status: learned
tags: [javascript, asynchronous, promises, async-await, control-flow]
what: "Asynchronous JavaScript syntax and primitives built on Promises, allowing asynchronous non-blocking operations to be written and reasoned about sequentially."
why: "Eliminates deeply nested callback pyramids (callback hell) and unifies error propagation through standard try/catch blocks and Promise combinators."
problem: "Nested callback structures make error handling, parallel branch coordination, and sequential step ordering difficult to maintain and prone to unhandled exceptions."
relations:
  - { to: "nodejs", label: "asynchronous foundation for" }
  - { to: "event-loop", label: "microtasks scheduled on" }
  - { to: "error-handling", label: "handled using try catch in" }
links:
  - { title: "MDN async function", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function" }
  - { title: "MDN Promises Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises" }
alsoIn: []
source: course
---

## Example
```js
async function fetchUserDashboard(userId) {
  try {
    // Parallel fetching for independent queries
    const [profile, orders] = await Promise.all([
      fetchUserProfile(userId),
      fetchUserOrders(userId),
    ]);

    // Dependent sequential step
    const invoice = await generateInvoiceSummary(orders);

    return { profile, orders, invoice };
  } catch (err) {
    console.error(`Failed to load dashboard for user ${userId}:`, err);
    throw err;
  }
}
```

## Key points
- **Implicit Promise return**: any function declared with `async` returns a Promise, and any unhandled exception inside rejects that returned Promise.
- **Avoid serial await traps**: avoid awaiting independent tasks inside loops sequentially; use `Promise.all()` (fail-fast) or `Promise.allSettled()` (inspect every outcome) for concurrency.
- **Unhandled rejections crash**: modern Node.js treats unhandled Promise rejections as fatal errors, terminating the process with an `unhandledRejection` exit code.
