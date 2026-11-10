import { Either, ParseResult, Schema } from "effect";

export const MAP_IDS = [
  "frontend",
  "backend",
  "fundamentals",
  "devops",
] as const;
export const MapIdSchema = Schema.Literal(...MAP_IDS);
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
export const NodeKindSchema = Schema.Literal(...NODE_KINDS);
export type NodeKind = typeof NodeKindSchema.Type;

export const NODE_STATUSES = [
  "work",
  "practiced",
  "learned",
  "learning",
  "planned",
] as const;
export const NodeStatusSchema = Schema.Literal(...NODE_STATUSES);
export type NodeStatus = typeof NodeStatusSchema.Type;

export const NODE_SOURCES = [
  "course",
  "work",
  "personal",
  "self-study",
] as const;
export const NodeSourceSchema = Schema.Literal(...NODE_SOURCES);
export type NodeSource = typeof NodeSourceSchema.Type;

export const KebabIdSchema = Schema.String.pipe(
  Schema.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: () =>
      "Expected kebab-case identifier (lowercase letters, digits, hyphens)",
  }),
);

export const HttpUrlSchema = Schema.String.pipe(
  Schema.pattern(/^https?:\/\/\S+$/, {
    message: () => "Expected a valid http:// or https:// URL",
  }),
);

export const HexColorSchema = Schema.String.pipe(
  Schema.pattern(/^#[0-9a-fA-F]{6}$/, {
    message: () => "Expected a 6-digit hex color (e.g. #3b82f6)",
  }),
);

export const RelationSchema = Schema.Struct({
  to: KebabIdSchema,
  label: Schema.NonEmptyTrimmedString,
});
export type NodeRelation = typeof RelationSchema.Type;

export const LinkSchema = Schema.Struct({
  title: Schema.NonEmptyTrimmedString,
  url: HttpUrlSchema,
});
export type NodeLink = typeof LinkSchema.Type;

export const NodeFrontmatterSchema = Schema.Struct({
  id: KebabIdSchema,
  name: Schema.NonEmptyTrimmedString,
  kind: NodeKindSchema,
  status: NodeStatusSchema,
  tags: Schema.optionalWith(Schema.Array(KebabIdSchema), { default: () => [] }),
  what: Schema.NonEmptyTrimmedString,
  why: Schema.NonEmptyTrimmedString,
  problem: Schema.NonEmptyTrimmedString,
  relations: Schema.optionalWith(Schema.Array(RelationSchema), {
    default: () => [],
  }),
  links: Schema.optionalWith(Schema.Array(LinkSchema), { default: () => [] }),
  alsoIn: Schema.optionalWith(Schema.Array(MapIdSchema), { default: () => [] }),
  source: Schema.optionalWith(NodeSourceSchema, {
    default: () => "self-study" as const,
  }),
});
export type NodeFrontmatter = typeof NodeFrontmatterSchema.Type;

export const CategoryConfigSchema = Schema.Struct({
  id: KebabIdSchema,
  name: Schema.NonEmptyTrimmedString,
  description: Schema.NonEmptyTrimmedString,
  color: HexColorSchema,
  order: Schema.Number.pipe(Schema.int(), Schema.positive()),
});
export type CategoryConfig = typeof CategoryConfigSchema.Type;

export const MapConfigSchema = Schema.Struct({
  id: MapIdSchema,
  name: Schema.NonEmptyTrimmedString,
  description: Schema.NonEmptyTrimmedString,
  order: Schema.Number.pipe(Schema.int(), Schema.positive()),
  categories: Schema.NonEmptyArray(CategoryConfigSchema),
});
export type MapConfig = typeof MapConfigSchema.Type;

export const MapsFileSchema = Schema.Struct({
  maps: Schema.NonEmptyArray(MapConfigSchema),
});
export type MapsFile = typeof MapsFileSchema.Type;

export type ValidationResult<T,> = { readonly ok: true; readonly value: T } | {
  readonly ok: false;
  readonly error: string;
};

const decodeFrontmatterEither = Schema.decodeUnknownEither(
  NodeFrontmatterSchema,
  {
    errors: "all",
  },
);

const decodeMapsFileEither = Schema.decodeUnknownEither(MapsFileSchema, {
  errors: "all",
});

export function validateFrontmatter(
  input: unknown,
): ValidationResult<NodeFrontmatter> {
  const result = decodeFrontmatterEither(input);
  if (Either.isRight(result)) {
    return { ok: true, value: result.right };
  }
  return {
    ok: false,
    error: ParseResult.TreeFormatter.formatErrorSync(result.left),
  };
}

export function validateMapsFile(input: unknown): ValidationResult<MapsFile> {
  const result = decodeMapsFileEither(input);
  if (Either.isRight(result)) {
    return { ok: true, value: result.right };
  }
  return {
    ok: false,
    error: ParseResult.TreeFormatter.formatErrorSync(result.left),
  };
}
