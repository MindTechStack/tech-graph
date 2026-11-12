import { Effect, Result, Schema } from "effect";

export const MAP_IDS = ["frontend", "backend", "fundamentals", "devops", "ai"] as const;
export const MapIdSchema = Schema.Literals(MAP_IDS);
export type MapId = typeof MapIdSchema.Type;

export const NODE_KINDS = [
  "language",
  "framework",
  "library",
  "tool",
  "service",
  "concept",
  "platform",
] as const;
export const NodeKindSchema = Schema.Literals(NODE_KINDS);
export type NodeKind = typeof NodeKindSchema.Type;

export const NODE_STATUSES = ["work", "practiced", "learned", "learning", "planned"] as const;
export const NodeStatusSchema = Schema.Literals(NODE_STATUSES);
export type NodeStatus = typeof NodeStatusSchema.Type;

export const NODE_SOURCES = ["course", "work", "personal", "self-study"] as const;
export const NodeSourceSchema = Schema.Literals(NODE_SOURCES);
export type NodeSource = typeof NodeSourceSchema.Type;

export const NonEmptyTrimmedStringSchema = Schema.String.check(
  Schema.isTrimmed({ message: "Expected string without leading or trailing whitespace" }),
  Schema.isNonEmpty({ message: "Expected a non-empty string" }),
);

export const PositiveIntSchema = Schema.Int.check(
  Schema.isGreaterThan(0, { message: "Expected a positive integer (> 0)" }),
);

export const KebabIdSchema = Schema.String.check(
  Schema.isPattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Expected kebab-case identifier (lowercase letters, digits, hyphens)",
  }),
);

export const HttpUrlSchema = Schema.String.check(
  Schema.isPattern(/^https?:\/\/\S+$/, {
    message: "Expected a valid http:// or https:// URL",
  }),
);

export const HexColorSchema = Schema.String.check(
  Schema.isPattern(/^#[0-9a-fA-F]{6}$/, {
    message: "Expected a 6-digit hex color (e.g. #3b82f6)",
  }),
);

export const RelationSchema = Schema.Struct({
  to: KebabIdSchema,
  label: NonEmptyTrimmedStringSchema,
});
export type NodeRelation = typeof RelationSchema.Type;

export const LinkSchema = Schema.Struct({
  title: NonEmptyTrimmedStringSchema,
  url: HttpUrlSchema,
});
export type NodeLink = typeof LinkSchema.Type;

export const NodeFrontmatterSchema = Schema.Struct({
  id: KebabIdSchema,
  name: NonEmptyTrimmedStringSchema,
  kind: NodeKindSchema,
  status: NodeStatusSchema,
  core: Schema.Boolean.pipe(Schema.withDecodingDefault(Effect.succeed(false))),
  tags: Schema.Array(KebabIdSchema).pipe(
    Schema.withDecodingDefault(Effect.succeed([] as readonly string[])),
  ),
  what: NonEmptyTrimmedStringSchema,
  why: NonEmptyTrimmedStringSchema,
  problem: NonEmptyTrimmedStringSchema,
  relations: Schema.Array(RelationSchema).pipe(
    Schema.withDecodingDefault(Effect.succeed([] as readonly NodeRelation[])),
  ),
  links: Schema.Array(LinkSchema).pipe(
    Schema.withDecodingDefault(Effect.succeed([] as readonly NodeLink[])),
  ),
  alsoIn: Schema.Array(MapIdSchema).pipe(
    Schema.withDecodingDefault(Effect.succeed([] as readonly MapId[])),
  ),
  source: NodeSourceSchema.pipe(Schema.withDecodingDefault(Effect.succeed("self-study" as const))),
});
export type NodeFrontmatter = typeof NodeFrontmatterSchema.Type;

export const CategoryConfigSchema = Schema.Struct({
  id: KebabIdSchema,
  name: NonEmptyTrimmedStringSchema,
  description: NonEmptyTrimmedStringSchema,
  color: HexColorSchema,
  order: PositiveIntSchema,
});
export type CategoryConfig = typeof CategoryConfigSchema.Type;

export const MapConfigSchema = Schema.Struct({
  id: MapIdSchema,
  name: NonEmptyTrimmedStringSchema,
  description: NonEmptyTrimmedStringSchema,
  order: PositiveIntSchema,
  categories: Schema.NonEmptyArray(CategoryConfigSchema),
});
export type MapConfig = typeof MapConfigSchema.Type;

export const MapsFileSchema = Schema.Struct({
  maps: Schema.NonEmptyArray(MapConfigSchema),
});
export type MapsFile = typeof MapsFileSchema.Type;

export type ValidationResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: string };

const decodeFrontmatterResult = Schema.decodeUnknownResult(NodeFrontmatterSchema, {
  errors: "all",
});

const decodeMapsFileResult = Schema.decodeUnknownResult(MapsFileSchema, {
  errors: "all",
});

export function validateFrontmatter(input: unknown): ValidationResult<NodeFrontmatter> {
  const result = decodeFrontmatterResult(input);
  if (Result.isSuccess(result)) {
    return { ok: true, value: result.success };
  }
  return {
    ok: false,
    error: result.failure.message,
  };
}

export function validateMapsFile(input: unknown): ValidationResult<MapsFile> {
  const result = decodeMapsFileResult(input);
  if (Result.isSuccess(result)) {
    return { ok: true, value: result.success };
  }
  return {
    ok: false,
    error: result.failure.message,
  };
}
