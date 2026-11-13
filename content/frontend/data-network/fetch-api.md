---
id: fetch-api
name: Fetch API
kind: concept
status: work
tags: [http, browser-apis, promises, networking, javascript]
what: "Built-in browser and runtime API for HTTP requests, returning Promises of Request and Response objects."
why: "Provides built-in, promise-based networking without external dependencies, supporting streaming, abort signals, and headers configuration."
problem: "Legacy XMLHttpRequest required clunky event-driven callback code, lacked streaming, and had no standard cross-platform Promise interface."
relations:
  - { to: browser-apis, label: "native standard of" }
  - { to: javascript, label: "implemented in" }
  - { to: axios, label: "native alternative to" }
  - { to: api-error-layer, label: "transport for" }
links:
  - { title: "MDN Fetch API Reference", url: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API }
alsoIn: []
source: work
---

## Example
```ts
interface UserResponse {
  readonly id: string;
  readonly name: string;
}

export async function fetchUserWithTimeout(
  userId: string,
  timeoutMs = 5000,
): Promise<UserResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`/api/users/${encodeURIComponent(userId)}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as UserResponse;
  } finally {
    clearTimeout(timeoutId);
  }
}
```

## Key points
- **HTTP error handling quirk**: `fetch()` promises only reject on network failure or request abortion; HTTP 4xx and 5xx responses resolve normally and require manual `response.ok` checks.
- **Stream body consumption**: The response body is a `ReadableStream` that can only be read once (`.json()`, `.text()`, or `.blob()`); reading twice throws a `TypeError`.
- **Request cancellation with AbortController**: Pass `signal: controller.signal` to `fetch()` options to abort running HTTP requests when components unmount or search inputs change.
