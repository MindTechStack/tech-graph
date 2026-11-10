import { describe, expect, it } from "vitest";
import { buildKnowledgeGraph, getMapGraphSlice } from "./graph";
import { loadGraphFromGlob, loadGraphFromRawSources } from "./load";
import { loadGraphFromFs } from "./load-fs";
import { parseMapsYaml, parseNodeFilePath, parseNodeMarkdown } from "./parse";
import { validateFrontmatter, validateMapsFile } from "./schema";

describe("Effect Schema validation (schema.ts)", () => {
  it("accepts valid node frontmatter and fills defaults", () => {
    const result = validateFrontmatter({
      id: "express-validator",
      name: "express-validator",
      kind: "library",
      status: "learned",
      what: "Middleware wrapper around validator.js for Express.",
      why: "Validates and sanitizes incoming request fields declaratively.",
      problem: "Manual if/else validation in controllers is repetitive and error-prone.",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.tags).toEqual([]);
      expect(result.value.relations).toEqual([]);
      expect(result.value.links).toEqual([]);
      expect(result.value.alsoIn).toEqual([]);
      expect(result.value.source).toBe("self-study");
    }
  });

  it("rejects non-kebab id, invalid kind/status, and invalid URLs with readable errors", () => {
    const badId = validateFrontmatter({
      id: "Not_Kebab",
      name: "Bad",
      kind: "library",
      status: "learned",
      what: "a",
      why: "b",
      problem: "c",
    });
    expect(badId.ok).toBe(false);
    if (!badId.ok) {
      expect(badId.error).toContain("kebab-case");
    }

    const badUrl = validateFrontmatter({
      id: "valid-id",
      name: "Valid",
      kind: "library",
      status: "learned",
      what: "a",
      why: "b",
      problem: "c",
      links: [{ title: "Docs", url: "ftp://invalid.example.com" }],
    });
    expect(badUrl.ok).toBe(false);
    if (!badUrl.ok) {
      expect(badUrl.error).toContain("http:// or https://");
    }
  });

  it("validates maps.yaml structure and hex colors", () => {
    const invalidColor = validateMapsFile({
      maps: [
        {
          id: "frontend",
          name: "Frontend",
          description: "Desc",
          order: 1,
          categories: [
            {
              id: "languages",
              name: "Languages",
              description: "Desc",
              color: "blue",
              order: 1,
            },
          ],
        },
      ],
    });
    expect(invalidColor.ok).toBe(false);
  });
});

describe("Markdown and path parser (parse.ts)", () => {
  it("extracts map, category, and fileId from path", () => {
    const res = parseNodeFilePath("C:\\repo\\content\\backend\\database\\sequelize.md");
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value.map).toBe("backend");
      expect(res.value.category).toBe("database");
      expect(res.value.fileId).toBe("sequelize");
    }
  });

  it("fails when frontmatter id does not match filename", () => {
    const md = `---
id: wrong-id
name: Sequelize
kind: library
status: learned
what: ORM
why: Easy queries
problem: Raw SQL
---
Body text`;

    const res = parseNodeMarkdown("content/backend/database/sequelize.md", md);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error.code).toBe("ID_FILENAME_MISMATCH");
    }
  });

  it("parses valid markdown into TechNodeData with body", () => {
    const md = `---
id: sequelize
name: Sequelize
kind: library
status: learned
tags: [orm, sql]
what: ORM for Node.js
why: Models and queries
problem: Raw SQL is verbose
---

## Example
\`\`\`js
console.log("ok");
\`\`\``;

    const res = parseNodeMarkdown("content/backend/database/sequelize.md", md);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.node.map).toBe("backend");
      expect(res.node.category).toBe("database");
      expect(res.node.body).toContain("## Example");
    }
  });
});

describe("Graph builder & diagnostics (graph.ts)", () => {
  const sampleMapsResult = parseMapsYaml(
    "content/maps.yaml",
    `maps:
  - id: frontend
    name: Frontend
    description: FE
    order: 1
    categories:
      - id: frameworks
        name: Frameworks
        description: FW
        color: "#10b981"
        order: 1
  - id: backend
    name: Backend
    description: BE
    order: 2
    categories:
      - id: runtime
        name: Runtime
        description: RT
        color: "#22c55e"
        order: 1
`,
  );

  if (!sampleMapsResult.ok) {
    throw new Error("Sample maps failed to parse");
  }
  const sampleMaps = sampleMapsResult.mapsFile;

  it("detects duplicate IDs, unknown categories, broken relations, and self relations", () => {
    const nodeA1 = parseNodeMarkdown(
      "content/backend/runtime/nodejs.md",
      `---
id: nodejs
name: Node.js
kind: platform
status: learned
what: Runtime
why: JS on server
problem: Blocking I/O
relations:
  - { to: nodejs, label: "runs on" }
  - { to: missing-node, label: "uses" }
---`,
    );
    const nodeA2 = parseNodeMarkdown(
      "content/frontend/frameworks/nodejs.md",
      `---
id: nodejs
name: Node.js Dup
kind: platform
status: learned
what: Runtime
why: JS on server
problem: Blocking I/O
---`,
    );
    const nodeUnknownCat = parseNodeMarkdown(
      "content/backend/non-existent/foo.md",
      `---
id: foo
name: Foo
kind: tool
status: planned
what: w
why: y
problem: p
---`,
    );

    if (!nodeA1.ok || !nodeA2.ok || !nodeUnknownCat.ok) {
      throw new Error("Unexpected parse failure in test setup");
    }

    const graph = buildKnowledgeGraph(sampleMaps, [nodeA1.node, nodeA2.node, nodeUnknownCat.node]);

    const codes = graph.errors.map((e) => e.code);
    expect(codes).toContain("DUPLICATE_ID");
    expect(codes).toContain("UNKNOWN_CATEGORY");
    expect(codes).toContain("SELF_RELATION");
    expect(codes).toContain("BROKEN_RELATION");
  });

  it("builds backlinks and computes ghost nodes across maps", () => {
    const raw = loadGraphFromRawSources({
      mapsYamlPath: "content/maps.yaml",
      mapsYamlContent: `maps:
  - id: frontend
    name: Frontend
    description: FE
    order: 1
    categories:
      - id: build-performance
        name: Build
        description: Build
        color: "#f59e0b"
        order: 1
  - id: backend
    name: Backend
    description: BE
    order: 2
    categories:
      - id: runtime
        name: Runtime
        description: RT
        color: "#22c55e"
        order: 1
`,
      markdownFiles: {
        "content/frontend/build-performance/vite.md": `---
id: vite
name: Vite
kind: tool
status: work
what: Bundler
why: Fast HMR
problem: Slow webpack
relations:
  - { to: nodejs, label: "runs on" }
---`,
        "content/backend/runtime/nodejs.md": `---
id: nodejs
name: Node.js
kind: platform
status: learned
what: Runtime
why: Server JS
problem: I/O
---`,
      },
    });

    expect(raw.errors).toEqual([]);
    expect(raw.incomingByNodeId.get("nodejs")?.map((b) => b.from)).toEqual(["vite"]);

    const frontendSlice = getMapGraphSlice(raw, "frontend");
    const viteInFe = frontendSlice.nodes.find((n) => n.node.id === "vite");
    const nodeInFe = frontendSlice.nodes.find((n) => n.node.id === "nodejs");
    expect(viteInFe?.isGhost).toBe(false);
    expect(nodeInFe?.isGhost).toBe(true);

    // Filter out ghost nodes
    const noGhostsSlice = getMapGraphSlice(raw, "frontend", { includeGhosts: false });
    expect(noGhostsSlice.nodes.map((n) => n.node.id)).toEqual(["vite"]);
    expect(noGhostsSlice.edges).toEqual([]);

    // Filter by status that excludes vite
    const plannedOnlySlice = getMapGraphSlice(raw, "frontend", {
      statuses: new Set(["planned"]),
    });
    expect(plannedOnlySlice.nodes).toEqual([]);
  });
});

describe("Environment parity: Vite glob vs Node fs (load.ts)", () => {
  it("loads identical pilot graph in both glob and fs modes with zero errors", async () => {
    const fromGlob = loadGraphFromGlob();
    const fromFs = await loadGraphFromFs(process.cwd());

    expect(fromFs.errors).toEqual([]);
    expect(fromGlob.errors).toEqual([]);
    expect(fromGlob.nodes.map((n) => n.id)).toEqual(fromFs.nodes.map((n) => n.id));
    expect(fromGlob.edges).toEqual(fromFs.edges);
    expect(fromFs.nodes.length).toBeGreaterThanOrEqual(9);
  });
});
