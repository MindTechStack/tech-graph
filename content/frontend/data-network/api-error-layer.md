---
id: api-error-layer
name: Centralized API & Error Layer
kind: concept
status: work
tags: [architecture, error-handling, http, interceptors, client]
what: "Pattern that puts the HTTP client, request and response mapping and error normalization in one client-side module."
why: "Shields UI components from raw HTTP details, status codes, and backend schema shifts while guaranteeing consistent error notifications and auth recovery."
problem: "Scattering raw fetch or axios calls throughout UI components causes duplicated authorization headers, inconsistent error alerts, and unhandled session expirations."
relations:
  - { to: axios, label: "implemented with" }
  - { to: fetch-api, label: "wraps" }
  - { to: pinia, label: "updates auth state in" }
  - { to: typescript, label: "structured with" }
links:
  - { title: "Bulletproof React API Architecture Guide", url: https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md }
alsoIn: []
source: work
---

## Example
```ts
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: "NETWORK_ERROR" | "UNAUTHORIZED" | "FORBIDDEN" | "VALIDATION" | "UNKNOWN",
    public readonly status?: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export async function requestWrapper<T>(requestFn: () => Promise<Response>): Promise<T> {
  try {
    const res = await requestFn();

    if (res.status === 401) {
      throw new AppError("Session expired. Please log in again.", "UNAUTHORIZED", 401);
    }
    if (res.status === 403) {
      throw new AppError("You lack permission for this action.", "FORBIDDEN", 403);
    }
    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      throw new AppError(payload?.message ?? "API request failed.", "VALIDATION", res.status, payload);
    }

    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError("Network failure. Check internet connection.", "NETWORK_ERROR");
  }
}
```

## Key points
- **Normalized application error model**: Transform varied HTTP, network, and validation errors into a predictable typed error class (`AppError`) with user-friendly messages.
- **Token refresh & replay queues**: On `401 Unauthorized`, pause pending outgoing requests, execute token refresh once, and replay queued requests with the new credentials.
- **UI layer decoupling**: UI components call semantic domain methods (`api.users.getProfile()`) rather than constructing URLs, query strings, or parsing headers directly.
