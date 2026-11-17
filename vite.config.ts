import path from "node:path";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";
import { parseContentFromFs } from "./src/content/load-fs";

const BUILT_CONTENT_ID = "virtual:tech-graph-content";
const RESOLVED_BUILT_CONTENT_ID = `\0${BUILT_CONTENT_ID}`;
const CONTENT_DIR = path.resolve(import.meta.dirname, "content");

function isContentFile(file: string): boolean {
  return path.resolve(file).startsWith(CONTENT_DIR + path.sep);
}

function builtContent(): Plugin {
  return {
    name: "tech-graph:built-content",
    resolveId(id) {
      return id === BUILT_CONTENT_ID ? RESOLVED_BUILT_CONTENT_ID : undefined;
    },
    async load(id) {
      if (id !== RESOLVED_BUILT_CONTENT_ID) {
        return undefined;
      }
      const content = await parseContentFromFs(import.meta.dirname);
      return `export default JSON.parse(${JSON.stringify(JSON.stringify(content))});`;
    },
    configureServer(server) {
      const reloadOnContentChange = (file: string) => {
        if (!isContentFile(file)) {
          return;
        }
        const builtModule = server.moduleGraph.getModuleById(RESOLVED_BUILT_CONTENT_ID);
        if (builtModule) {
          server.moduleGraph.invalidateModule(builtModule);
        }
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.add(CONTENT_DIR);
      server.watcher.on("add", reloadOnContentChange);
      server.watcher.on("change", reloadOnContentChange);
      server.watcher.on("unlink", reloadOnContentChange);
    },
  };
}

export default defineConfig({
  plugins: [react(), builtContent()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    alias: [
      {
        find: /^\.\/elk-engine$/,
        replacement: path.resolve(import.meta.dirname, "src/layout/elk-engine.node.ts"),
      },
    ],
  },
});
