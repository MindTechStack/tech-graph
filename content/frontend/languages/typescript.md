---
id: typescript
name: TypeScript
kind: language
status: work
core: true
tags: [types, static-analysis, generics, discriminated-unions, dx]
what: "Statically typed superset of JavaScript that adds a structural type system, generics, and compile-time soundness checks before erasing types to standard JS."
why: "Catches nullability bugs, mismatched API payloads, and unhandled union cases in the editor and CI long before code reaches production."
problem: "In plain JavaScript, refactoring a property name or changing a function signature silently leaves callers broken until that specific code path runs at runtime."
relations:
  - { to: javascript, label: "compiles to" }
  - { to: vite, label: "bundled by" }
  - { to: react, label: "types components in" }
  - { to: vue, label: "types components in" }
links:
  - { title: "TypeScript Handbook", url: https://www.typescriptlang.org/docs/handbook/intro.html }
  - { title: "TSConfig Reference", url: https://www.typescriptlang.org/tsconfig/ }
alsoIn: []
source: work
---

## Example
```ts
export type AsyncState<T, E = string> =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "success"; readonly data: T }
  | { readonly status: "error"; readonly error: E };

export function formatResult<T>(
  state: AsyncState<T>,
  render: (data: T) => string,
): string {
  switch (state.status) {
    case "idle":
    case "loading":
      return "Loading...";
    case "success":
      return render(state.data);
    case "error":
      return `Failed: ${state.error}`;
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}
```

## Key points
- **Discriminated unions + `never` exhaustiveness**: model state machines with a literal tag (`status: "loading" | "success" | "error"`) instead of optional boolean flags (`isLoading?`, `isError?`) so impossible states cannot be constructed.
- **`unknown` over `any`**: `any` disables the type checker completely; `unknown` forces you to narrow or validate external data (JSON, `catch (err)`) before accessing properties.
- **Strict mode flags**: always enable `"strict": true`, `"noUncheckedIndexedAccess": true`, and `"exactOptionalPropertyTypes": true` so array lookups (`arr[0]`) and missing keys are typed as `T | undefined`.

