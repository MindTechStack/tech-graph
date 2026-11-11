---
id: effect-schema
name: "Effect Schema"
kind: library
status: planned
tags: [validation, schema, parsing, typescript, effect]
what: "High-performance schema modeling and data transformation library within the Effect ecosystem that derives TypeScript types, encoders, and decoders."
why: "Provides bidirectional parsing and encoding, custom transformations, automated JSON Schema generation, and deep integration with Effect's typed error handling."
problem: "Traditional validation libraries like Zod and Joi handle validation but lack bidirectional transformation pipelines, rich AST inspection, or first-class typed error propagation compatible with Effect workflows."
relations:
  - { to: "effect", label: "schema layer of" }
  - { to: "typescript", label: "derives types in" }
  - { to: "typed-errors", label: "produces" }
links:
  - { title: "Effect Schema Documentation", url: https://effect.website/docs/schema/introduction }
alsoIn: []
source: self-study
---

## Example
```ts
import { Schema } from "effect";

// 1. Define schema with field transforms and validations
export const UserSchema = Schema.Struct({
  id: Schema.Number,
  name: Schema.NonEmptyTrimmedString,
  email: Schema.String.check(
    Schema.isPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Invalid email address format" })
  ),
  roles: Schema.Array(Schema.Literals(["admin", "editor", "viewer"])),
});

// Infer static TypeScript types automatically
export type User = typeof UserSchema.Type;

// 2. Decode unknown payload safely with typed validation errors
const parseResult = Schema.decodeUnknownEither(UserSchema)({
  id: 101,
  name: " Jordan ",
  email: "jordan@example.com",
  roles: ["admin"],
});

if (parseResult._tag === "Right") {
  console.log("Decoded user with trimmed name:", parseResult.right);
} else {
  console.error("Validation failed:", parseResult.left);
}
```

## Key points
- **Core mental model**: Bidirectional Schema (`Schema<To, From>`) — unifies decoding (parsing unknown input into domain types), encoding (serializing domain types to JSON), and type generation in a single definition.
- **Common pitfall**: Mixing up `decodeUnknown` (which accepts `unknown` inputs) with `decode` (which expects already partially typed inputs matching the `From` type); use `decodeUnknownSync` or `decodeUnknown` for HTTP request boundaries.
- **Today**: In modern Effect projects, `@effect/schema` replaces Zod and ArkType, providing zero-overhead type derivation with full AST manipulation and JSON Schema export.
