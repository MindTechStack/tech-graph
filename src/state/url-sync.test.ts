import { describe, expect, it } from "vitest";
import type { KnowledgeGraph } from "../content/graph";
import type { TechNodeData } from "../content/parse";
import { formatUrlHash, parseUrlHash, planHashUpdate, resolveDeepLink } from "./url-sync";

function graphWith(nodes: ReadonlyArray<Pick<TechNodeData, "id" | "map" | "alsoIn">>) {
  return { nodesById: new Map(nodes.map((n) => [n.id, n])) } as unknown as KnowledgeGraph;
}

describe("url-sync", () => {
  it("parses empty or root hash using defaults", () => {
    expect(parseUrlHash("")).toEqual({ activeMap: "backend", selectedNodeId: null });
    expect(parseUrlHash("#/")).toEqual({ activeMap: "backend", selectedNodeId: null });
  });

  it("parses map and nodeId from hash, ignoring old query params", () => {
    expect(parseUrlHash("#/backend/express?view=network")).toEqual({
      activeMap: "backend",
      selectedNodeId: "express",
    });
    expect(parseUrlHash("#/all/docker")).toEqual({ activeMap: "all", selectedNodeId: "docker" });
  });

  it("falls back to the default map on an invalid map", () => {
    expect(parseUrlHash("#/unknown-map/express")).toEqual({
      activeMap: "backend",
      selectedNodeId: "express",
    });
  });

  it("keeps malformed percent-encoding instead of throwing", () => {
    expect(parseUrlHash("#/frontend/%E0%A4%A").selectedNodeId).toBe("%E0%A4%A");
  });

  it("resolves deep links against the graph", () => {
    const graph = graphWith([
      { id: "vue", map: "frontend", alsoIn: [] },
      { id: "docker", map: "devops", alsoIn: ["backend"] },
    ]);
    const link = (activeMap: "frontend" | "backend" | "all", selectedNodeId: string) =>
      resolveDeepLink({ activeMap, selectedNodeId }, graph);

    expect(link("backend", "vue").activeMap).toBe("frontend");
    expect(link("backend", "docker").activeMap).toBe("backend");
    expect(link("all", "vue").activeMap).toBe("all");
    expect(link("frontend", "renamed-node").selectedNodeId).toBeNull();
    expect(link("frontend", "renamed-node").unknownNodeId).toBe("renamed-node");
    expect(link("frontend", "vue").unknownNodeId).toBeUndefined();
  });

  it("formats URL hash symmetrically", () => {
    expect(formatUrlHash("backend", "express")).toBe("#/backend/express");
    expect(formatUrlHash("frontend", null)).toBe("#/frontend");
  });

  it("pushes history only when the state moved away from the URL", () => {
    const parse = (hash: string) => parseUrlHash(hash, { defaultMap: "frontend" });
    const at = (selectedNodeId: string | null) =>
      ({ activeMap: "frontend", selectedNodeId }) as const;

    expect(planHashUpdate("#/frontend/vue", at("vue"), parse)).toBe("none");
    expect(planHashUpdate("", at(null), parse)).toBe("replace");
    expect(planHashUpdate("#/frontend/vue?view=network", at("vue"), parse)).toBe("replace");
    expect(planHashUpdate("#/frontend/vue", at("react"), parse)).toBe("push");
    expect(planHashUpdate("#/frontend/vue", at(null), parse)).toBe("push");
  });
});
