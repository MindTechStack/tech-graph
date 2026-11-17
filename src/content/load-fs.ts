import fs from "node:fs/promises";
import path from "node:path";
import { buildGraphFromParsedContent, type KnowledgeGraph, type ParsedContent } from "./graph";
import { isIgnoredContentFile, parseContentSources, type RawContentSources } from "./load";

export async function readContentSources(
  rootDir: string = process.cwd(),
): Promise<RawContentSources> {
  const contentDir = path.resolve(rootDir, "content");
  const mapsYamlContent = await fs.readFile(path.join(contentDir, "maps.yaml"), "utf8");

  const markdownFiles: Record<string, string> = {};

  async function walk(dir: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        const relPath = path.relative(rootDir, fullPath).replace(/\\/g, "/");
        if (!isIgnoredContentFile(relPath)) {
          markdownFiles[relPath] = await fs.readFile(fullPath, "utf8");
        }
      }
    }
  }

  await walk(contentDir);

  return { mapsYamlPath: "content/maps.yaml", mapsYamlContent, markdownFiles };
}

export async function parseContentFromFs(rootDir: string = process.cwd()): Promise<ParsedContent> {
  return parseContentSources(await readContentSources(rootDir));
}

export async function loadGraphFromFs(rootDir: string = process.cwd()): Promise<KnowledgeGraph> {
  return buildGraphFromParsedContent(await parseContentFromFs(rootDir));
}
