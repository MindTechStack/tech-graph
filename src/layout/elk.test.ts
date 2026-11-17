import { beforeEach, describe, expect, it } from "vitest";
import { getMapGraphSlice } from "../content/graph";
import { loadGraphFromFs } from "../content/load-fs";
import {
  clearLayoutCache,
  computeGraphLayout,
  facingSides,
  groupMinWidth,
  TECH_NODE_HEIGHT,
  TECH_NODE_WIDTH,
} from "./elk";

describe("ELK layout engine (src/layout/elk.ts)", () => {
  beforeEach(() => {
    clearLayoutCache();
  });

  it("lays out compound category groups and tech nodes in grouped mode without overlap", async () => {
    const graph = await loadGraphFromFs(process.cwd());
    const backendSlice = getMapGraphSlice(graph, "backend");
    const positioned = await computeGraphLayout(graph, backendSlice);

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

  it("sizes every group to fit its far-view title without overlapping other groups", async () => {
    const graph = await loadGraphFromFs(process.cwd());
    const positioned = await computeGraphLayout(graph, getMapGraphSlice(graph, "all"));
    const boxes = positioned.nodes
      .filter((n) => n.type === "categoryGroup")
      .map((n) => ({
        label: n.data.label,
        x: n.position.x,
        y: n.position.y,
        width: Number(n.style?.width),
        height: Number(n.style?.height),
      }));

    for (const box of boxes) {
      expect(box.width).toBeGreaterThanOrEqual(groupMinWidth(box.label));
    }
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i]!;
        const b = boxes[j]!;
        const overlapX = a.x < b.x + b.width && b.x < a.x + a.width;
        const overlapY = a.y < b.y + b.height && b.y < a.y + a.height;
        expect(overlapX && overlapY, `${a.label} overlaps ${b.label}`).toBe(false);
      }
    }
  });

  it("caches layouts and marks which edges stay inside one group", async () => {
    const graph = await loadGraphFromFs(process.cwd());
    const allSlice = getMapGraphSlice(graph, "all");

    const firstRun = await computeGraphLayout(graph, allSlice);
    expect(await computeGraphLayout(graph, allSlice)).toBe(firstRun);

    const parentOf = new Map(firstRun.nodes.map((n) => [n.id, n.parentId]));
    const withinGroup = firstRun.edges.filter((e) => e.data?.isWithinGroup);
    expect(withinGroup.length).toBeGreaterThan(0);
    expect(withinGroup.length).toBeLessThan(firstRun.edges.length);
    for (const edge of firstRun.edges) {
      expect(edge.data?.isWithinGroup).toBe(parentOf.get(edge.source) === parentOf.get(edge.target));
    }
  });
});

describe("facing edge sides", () => {
  const box = (x: number, y: number) => ({ x, y, width: 224, height: 64 });

  it("joins the sides that face each other", () => {
    expect(facingSides(box(0, 0), box(400, 0))).toEqual(["right", "left"]);
    expect(facingSides(box(400, 0), box(0, 0))).toEqual(["left", "right"]);
    expect(facingSides(box(0, 0), box(40, 200))).toEqual(["bottom", "top"]);
    expect(facingSides(box(40, 200), box(0, 0))).toEqual(["top", "bottom"]);
  });
});
