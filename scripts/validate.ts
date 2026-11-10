import { loadGraphFromFs } from "../src/content/load-fs";

async function main(): Promise<void> {
  const graph = await loadGraphFromFs(process.cwd());

  const totalCategories = graph.maps.reduce(
    (acc, m) => acc + m.categories.length,
    0,
  );

  console.log(
    `[validate] Loaded ${graph.maps.length} maps, ${totalCategories} categories, ${graph.nodes.length} nodes, ${graph.edges.length} edges.`,
  );

  if (graph.warnings.length > 0) {
    console.warn(`\nWarnings (${graph.warnings.length}):`);
    for (const warning of graph.warnings) {
      console.warn(
        `  WARN [${warning.code}] ${warning.filePath}: ${warning.message}`,
      );
    }
  }

  if (graph.errors.length > 0) {
    console.error(`\nErrors (${graph.errors.length}):`);
    for (const error of graph.errors) {
      console.error(
        `  ERROR [${error.code}] ${error.filePath}: ${error.message}`,
      );
    }
    process.exitCode = 1;
    return;
  }

  console.log("[validate] All content checks passed!");
}

main().catch((err: unknown) => {
  console.error("[validate] Fatal error:", err);
  process.exitCode = 1;
});
