import { buildKnowledgeGraph, type KnowledgeGraph } from "./graph";
import {
  type ContentDiagnostic,
  parseMapsYaml,
  parseNodeMarkdown,
  type TechNodeData,
} from "./parse";
import type { MapsFile } from "./schema";

export interface RawContentSources {
  readonly mapsYamlPath: string;
  readonly mapsYamlContent: string;
  readonly markdownFiles: Readonly<Record<string, string>>;
}

const FALLBACK_MAPS_FILE: MapsFile = {
  maps: [
    {
      id: "frontend",
      name: "Frontend",
      description: "Fallback map",
      order: 1,
      categories: [
        {
          id: "general",
          name: "General",
          description: "Fallback category",
          color: "#94a3b8",
          order: 1,
        },
      ],
    },
  ],
};

export function isIgnoredContentFile(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, "/");
  const fileName = normalized.split("/").pop() ?? "";
  return fileName.startsWith("_");
}

export function normalizeContentRelativePath(filePath: string): string {
  const normalized = filePath.replace(/\\/g, "/");
  const idx = normalized.indexOf("content/");
  if (idx !== -1) {
    return normalized.slice(idx);
  }
  return normalized.replace(/^\/+/, "");
}

export function loadGraphFromRawSources(sources: RawContentSources): KnowledgeGraph {
  const diagnostics: ContentDiagnostic[] = [];
  const mapsPath = normalizeContentRelativePath(sources.mapsYamlPath);

  const mapsResult = parseMapsYaml(mapsPath, sources.mapsYamlContent);
  let mapsFile: MapsFile;
  if (mapsResult.ok) {
    mapsFile = mapsResult.mapsFile;
  } else {
    diagnostics.push(mapsResult.error);
    mapsFile = FALLBACK_MAPS_FILE;
  }

  const parsedNodes: TechNodeData[] = [];
  const sortedEntries = Object.entries(sources.markdownFiles).sort(([a], [b]) =>
    normalizeContentRelativePath(a).localeCompare(normalizeContentRelativePath(b)),
  );

  for (const [rawPath, rawMarkdown] of sortedEntries) {
    const normalizedPath = normalizeContentRelativePath(rawPath);
    if (isIgnoredContentFile(normalizedPath)) {
      continue;
    }

    const parsed = parseNodeMarkdown(normalizedPath, rawMarkdown);
    if (parsed.ok) {
      parsedNodes.push(parsed.node);
    } else {
      diagnostics.push(parsed.error);
    }
  }

  return buildKnowledgeGraph(mapsFile, parsedNodes, diagnostics);
}

export function loadGraphFromGlob(): KnowledgeGraph {
  const mapsModules = import.meta.glob<string>("/content/maps.yaml", {
    query: "?raw",
    import: "default",
    eager: true,
  });

  const mdModules = import.meta.glob<string>("/content/**/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  });

  const mapsEntry = Object.entries(mapsModules)[0];
  const mapsYamlPath = mapsEntry ? mapsEntry[0] : "content/maps.yaml";
  const mapsYamlContent = mapsEntry ? mapsEntry[1] : "";

  return loadGraphFromRawSources({
    mapsYamlPath,
    mapsYamlContent,
    markdownFiles: mdModules,
  });
}
