---
id: typed-errors
name: "Typed Errors"
kind: concept
status: planned
tags: [error-handling, typescript, domain-errors, type-safety, functional-programming]
what: "Architectural pattern where recoverable domain and system failures are modeled as explicit, strongly typed values in function signatures rather than untyped thrown exceptions."
why: "Forces developers to handle known failure modes at compile time, eliminating unhandled runtime crashes and self-documenting API behavior."
problem: "JavaScript throw new Error() is untyped (catch (e) is unknown), allowing unexpected errors to bubble up unchecked and crash servers in production."
relations:
  - { to: "typescript", label: "type system feature in" }
  - { to: "effect", label: "first-class in" }
  - { to: "effect-schema", label: "modeled by" }
links:
  - { title: "TypeScript Handbook: Narrowing & Discriminated Unions", url: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions }
  - { title: "Effect Documentation: Error Management", url: https://effect.website/docs/error-management/two-error-types }
alsoIn: []
source: self-study
---

## Example
```ts
// 1. Define discriminated union domain error types
export interface UserNotFoundError {
  readonly _tag: "UserNotFoundError";
  readonly userId: string;
}

export interface AccountSuspendedError {
  readonly _tag: "AccountSuspendedError";
  readonly reason: string;
}

export type LoginError = UserNotFoundError | AccountSuspendedError;

// 2. Return Result type representing explicit Success or Failure
export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export function authenticate(userId: string): Result<{ token: string }, LoginError> {
  if (userId === "unknown") {
    return { ok: false, error: { _tag: "UserNotFoundError", userId } };
  }
  if (userId === "banned") {
    return { ok: false, error: { _tag: "AccountSuspendedError", reason: "TOS violation" } };
  }
  return { ok: true, value: { token: "jwt_token_123" } };
}

// 3. Exhaustive compile-time error handling
const authResult = authenticate("unknown");
if (authResult.ok) {
  console.log("Token:", authResult.value.token);
} else {
  switch (authResult.error._tag) {
    case "UserNotFoundError":
      console.warn(`User ${authResult.error.userId} does not exist`);
      break;
    case "AccountSuspendedError":
      console.error(`Account suspended: ${authResult.error.reason}`);
      break;
  }
}
```

## Key points
- **Core mental model**: Expected Failures vs Defects — treat domain errors (UserNotFound, InvalidPassword) as return values in the type signature; reserve thrown exceptions only for unrecoverable defects (Out of memory, syntax bug).
- **Common pitfall**: Throwing generic strings or raw `Error` instances inside utility functions; without a discriminant property (`_tag` or `code`), callers cannot reliably narrow and handle specific failure conditions.
- **Today**: Modern TypeScript architectures avoid throwing exceptions in domain layers, using discriminated unions (`Result<T, E>`) or Effect's typed error channel (`Effect<A, E>`) to enforce compile-time exhaustiveness.
