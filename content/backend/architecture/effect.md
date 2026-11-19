---
id: effect
name: "Effect"
kind: library
status: practiced
tags: [functional-programming, typescript, effects, concurrency, runtime]
what: "TypeScript library that models programs as typed effects, tracking errors, dependencies and concurrency in the type system."
why: "Models computations as typed data structures Effect<Success, Error, Requirements>, turning runtime errors into trackable types and offering structured concurrency, retries, and dependency injection."
problem: "Standard JavaScript Promise<T> erases error types to any, offers no built-in cancellation or interruption, and makes managing async resource lifetimes and dependency injection brittle."
relations:
  - { to: "typescript", label: "built for" }
  - { to: "effect-schema", label: "ecosystem companion of" }
  - { to: "typed-errors", label: "embodies" }
  - { to: "nodejs", label: "runtime for" }
links:
  - { title: "Effect Official Website", url: https://effect.website/ }
  - { title: "Effect Documentation", url: https://effect.website/docs/introduction }
alsoIn: [frontend]
source: self-study
---

## Example
```ts
import { Effect, Console, Schedule } from "effect";

// Define a strongly typed error
class NetworkError {
  readonly _tag = "NetworkError";
  constructor(readonly message: string) {}
}

// Effect pipeline with automatic retry policy and typed error handling
const fetchWithRetry = (url: string) =>
  Effect.tryPromise({
    try: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      return (await res.json()) as { status: string };
    },
    catch: (err) => new NetworkError(String(err)),
  }).pipe(
    Effect.retry(Schedule.exponential("100 millis").pipe(Schedule.compose(Schedule.recurs(3)))),
    Effect.timeout("5 seconds"),
    Effect.catchTag("NetworkError", (err) =>
      Console.warn(`Recovering from network failure: ${err.message}`).pipe(
        Effect.as({ status: "fallback" })
      )
    )
  );

// Run the effect description
Effect.runPromise(fetchWithRetry("https://api.example.com/health")).then((result) => {
  console.log("Result:", result);
});
```

## Key points
- **Core mental model**: `Effect<Success, Error, Requirements>` represents a pure data description of a computation that produces `Success`, may fail with typed `Error`, and requires environment dependencies `Requirements` (Context / Layers).
- **Common pitfall**: Forgetting that Effect programs are lazy descriptions; calling `Effect.succeed()` or `Effect.tryPromise()` does not execute anything until handed to an Effect runtime runner (`Effect.runPromise` or `Effect.runFork`).
- **Today**: Effect brings Scala ZIO and Haskell-grade functional reliability to TypeScript, increasingly adopted for mission-critical Node.js backends and complex frontend client applications.
