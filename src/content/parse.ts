import { parse as parseYaml } from "yaml";
import {
  MAP_IDS,
  type MapId,
  type MapsFile,
  type NodeFrontmatter,
  validateFrontmatter,
  validateMapsFile,
} from "./schema";

export interface ParsedPathInfo {
  readonly map: MapId;
  readonly category: string;
  readonly fileId: string;
  readonly normalizedPath: string;
}

export interface TechNodeData extends NodeFrontmatter {
  readonly map: MapId;
  readonly category: string;
  readonly body: string;
  readonly filePath: string;
}

export interface ContentDiagnostic {
  readonly severity: "error" | "warning";
  readonly code: "INVALID_PATH" | "MISSING_FRONTMATTER" | "YAML_SYNTAX_ERROR" | "SCHEMA_ERROR" | "ID_FILENAME_MISMATCH" | "DUPLICATE_ID" | "UNKNOWN_CATEGORY" | "BROKEN_RELATION" | "SELF_RELATION" | "REDUNDANT_ALSO_IN" | "ORPHAN_NODE";
  readonly filePath: string;
  readonly nodeId?: string;
  readonly message: string;
}

export type ParseNodeResult = {
  readonly ok: true;
  readonly node: TechNodeData;
} | { readonly ok: false; readonly error: ContentDiagnostic };

export type ParseMapsResult = {
  readonly ok: true;
  readonly mapsFile: MapsFile;
} | { readonly ok: false; readonly error: ContentDiagnostic };

const CONTENT_PATH_REGEX = /(?:^|\/)content\/([^/]+)\/([^/]+)\/([^/]+)\.md$/;
const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n([\s\S]*))?$/;

export function parseNodeFilePath(
  filePath: string,
): ValidationOrDiagnostic<ParsedPathInfo> {
  const normalizedPath = filePath.replace(/\\/g, "/");
  const match = CONTENT_PATH_REGEX.exec(normalizedPath);
  if (!match) {
    return {
      ok: false,
      error: {
        severity: "error",
        code: "INVALID_PATH",
        filePath: normalizedPath,
        message: `File path must match 'content/<map>/<category>/<id>.md', got '${normalizedPath}'`,
      },
    };
  }

  const [, rawMap, category, fileId] = match;
  if (!rawMap || !category || !fileId) {
    return {
      ok: false,
      error: {
        severity: "error",
        code: "INVALID_PATH",
        filePath: normalizedPath,
        message: `Could not extract map, category, and id from '${normalizedPath}'`,
      },
    };
  }

  if (!isMapId(rawMap)) {
    return {
      ok: false,
      error: {
        severity: "error",
        code: "INVALID_PATH",
        filePath: normalizedPath,
        message: `Unknown map '${rawMap}' in path '${normalizedPath}'. Expected one of: ${MAP_IDS.join(", ")}`,
      },
    };
  }

  return {
    ok: true,
    value: {
      map: rawMap,
      category,
      fileId,
      normalizedPath,
    },
  };
}

type ValidationOrDiagnostic<T,> = { readonly ok: true; readonly value: T } | {
  readonly ok: false;
  readonly error: ContentDiagnostic;
};

function isMapId(value: string): value is MapId {
  return (MAP_IDS as readonly string[]).includes(value);
}

export function splitFrontmatter(
  rawContent: string,
  filePath: string,
): ValidationOrDiagnostic<{
  readonly yamlText: string;
  readonly body: string;
}> {
  const normalized = rawContent.replace(/^\uFEFF/, "");
  const match = FRONTMATTER_REGEX.exec(normalized);
  if (!match || match[1] === undefined) {
    return {
      ok: false,
      error: {
        severity: "error",
        code: "MISSING_FRONTMATTER",
        filePath,
        message:
          "Markdown file must start with a YAML frontmatter block delimited by '---'",
      },
    };
  }

  return {
    ok: true,
    value: {
      yamlText: match[1],
      body: (match[2] ?? "").trim(),
    },
  };
}

export function parseNodeMarkdown(
  filePath: string,
  rawContent: string,
): ParseNodeResult {
  const pathResult = parseNodeFilePath(filePath);
  if (!pathResult.ok) {
    return pathResult;
  }

  const { map, category, fileId, normalizedPath } = pathResult.value;

  const splitResult = splitFrontmatter(rawContent, normalizedPath);
  if (!splitResult.ok) {
    return splitResult;
  }

  let parsedYaml: unknown;
  try {
    parsedYaml = parseYaml(splitResult.value.yamlText);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      error: {
        severity: "error",
        code: "YAML_SYNTAX_ERROR",
        filePath: normalizedPath,
        nodeId: fileId,
        message: `YAML syntax error: ${message}`,
      },
    };
  }

  const schemaResult = validateFrontmatter(parsedYaml);
  if (!schemaResult.ok) {
    return {
      ok: false,
      error: {
        severity: "error",
        code: "SCHEMA_ERROR",
        filePath: normalizedPath,
        nodeId: fileId,
        message: `Frontmatter schema validation failed:\n${schemaResult.error}`,
      },
    };
  }

  const frontmatter = schemaResult.value;
  if (frontmatter.id !== fileId) {
    return {
      ok: false,
      error: {
        severity: "error",
        code: "ID_FILENAME_MISMATCH",
        filePath: normalizedPath,
        nodeId: frontmatter.id,
        message: `Frontmatter id '${frontmatter.id}' does not match filename '${fileId}.md'`,
      },
    };
  }

  return {
    ok: true,
    node: {
      ...frontmatter,
      map,
      category,
      body: splitResult.value.body,
      filePath: normalizedPath,
    },
  };
}

export function parseMapsYaml(
  filePath: string,
  rawYaml: string,
): ParseMapsResult {
  const normalizedPath = filePath.replace(/\\/g, "/");
  let parsed: unknown;
  try {
    parsed = parseYaml(rawYaml);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      error: {
        severity: "error",
        code: "YAML_SYNTAX_ERROR",
        filePath: normalizedPath,
        message: `YAML syntax error in maps.yaml: ${message}`,
      },
    };
  }

  const validated = validateMapsFile(parsed);
  if (!validated.ok) {
    return {
      ok: false,
      error: {
        severity: "error",
        code: "SCHEMA_ERROR",
        filePath: normalizedPath,
        message: `maps.yaml schema validation failed:\n${validated.error}`,
      },
    };
  }

  return {
    ok: true,
    mapsFile: validated.value,
  };
}
