import fs from "node:fs/promises";
import path from "node:path";
import type { KnowledgeGraph } from "./graph";
import { isIgnoredContentFile, loadGraphFromRawSources } from "./load";

export async function loadGraphFromFs(
  rootDir: string = process.cwd(),
): Promise<KnowledgeGraph> {
  const contentDir = path.resolve(rootDir, "content");
  const mapsYamlFullPath = path.join(contentDir, "maps.yaml");
  const mapsYamlContent = await fs.readFile(mapsYamlFullPath, "utf8");

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

  return loadGraphFromRawSources({
    mapsYamlPath: "content/maps.yaml",
    mapsYamlContent,
    markdownFiles,
  });
}
