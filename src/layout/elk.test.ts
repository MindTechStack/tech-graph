import { beforeEach, describe, expect, it } from "vitest";
import { getMapGraphSlice } from "../content/graph";
import { loadGraphFromFs } from "../content/load-fs";
import { clearLayoutCache, computeGraphLayout, TECH_NODE_HEIGHT, TECH_NODE_WIDTH } from "./elk";

describe("ELK layout engine (src/layout/elk.ts)", () => {
  beforeEach(() => {
    clearLayoutCache();
  });

  it("lays out compound category groups and tech nodes in layers mode without overlap", async () => {
    const graph = await loadGraphFromFs(process.cwd());
    const backendSlice = getMapGraphSlice(graph, "backend");
    const positioned = await computeGraphLayout(graph, backendSlice, "layers");

    const groups = positioned.nodes.filter((n) => n.type === "categoryGroup");
    const techNodes = positioned.nodes.filter((n) => n.type === "tech");

    expect(groups.length).toBeGreaterThan(0);
    expect(techNodes.length).toBe(backendSlice.nodes.length);

    // Verify all group nodes appear before any tech child node
    const lastGroupIndex = positioned.nodes.findLastIndex((n) => n.type === "categoryGroup");
    const firstTechIndex = positioned.nodes.findIndex((n) => n.type === "tech");
    expect(lastGroupIndex).toBeLessThan(firstTechIndex);

    // Verify siblings inside the same group do not overlap
    for (let i = 0; i < techNodes.length; i++) {
      for (let j = i + 1; j < techNodes.length; j++) {
        const a = techNodes[i]!;
        const b = techNodes[j]!;
        if (a.parentId !== b.parentId) {
          continue;
        }
        const overlapX = Math.abs(a.position.x - b.position.x) < TECH_NODE_WIDTH;
        const overlapY = Math.abs(a.position.y - b.position.y) < TECH_NODE_HEIGHT;
        expect(overlapX && overlapY).toBe(false);
      }
    }
  });

  it("lays out flat graph in network (stress) mode without node overlaps and caches result", async () => {
    const graph = await loadGraphFromFs(process.cwd());
    const allSlice = getMapGraphSlice(graph, "all");

    const firstRun = await computeGraphLayout(graph, allSlice, "network");
    const secondRun = await computeGraphLayout(graph, allSlice, "network");

    // Cache hit returns the exact same object reference
    expect(secondRun).toBe(firstRun);
    expect(firstRun.nodes.every((n) => n.type === "tech")).toBe(true);

    for (let i = 0; i < firstRun.nodes.length; i++) {
      for (let j = i + 1; j < firstRun.nodes.length; j++) {
        const a = firstRun.nodes[i]!;
        const b = firstRun.nodes[j]!;
        const overlapX = Math.abs(a.position.x - b.position.x) < TECH_NODE_WIDTH;
        const overlapY = Math.abs(a.position.y - b.position.y) < TECH_NODE_HEIGHT;
        expect(overlapX && overlapY).toBe(false);
      }
    }
  });
});
