import { describe, expect, it } from "vitest";
import type { KnowledgeGraph } from "../content/graph";
import type { TechNodeData } from "../content/parse";
import { formatUrlHash, parseUrlHash, planHashUpdate, resolveDeepLink } from "./url-sync";

function graphWith(nodes: ReadonlyArray<Pick<TechNodeData, "id" | "map" | "alsoIn">>) {
  return { nodesById: new Map(nodes.map((n) => [n.id, n])) } as unknown as KnowledgeGraph;
}

describe("url-sync", () => {
  it("parses empty or root hash using defaults", () => {
    expect(parseUrlHash("")).toEqual({
      activeMap: "backend",
      selectedNodeId: null,
      layoutMode: "layers",
    });

    expect(parseUrlHash("#/")).toEqual({
      activeMap: "backend",
      selectedNodeId: null,
      layoutMode: "layers",
    });
  });

  it("parses map, nodeId, and layoutMode from hash", () => {
    expect(parseUrlHash("#/backend/express?mode=network")).toEqual({
      activeMap: "backend",
      selectedNodeId: "express",
      layoutMode: "network",
    });

    expect(parseUrlHash("#/frontend?mode=layers")).toEqual({
      activeMap: "frontend",
      selectedNodeId: null,
      layoutMode: "layers",
    });

    expect(parseUrlHash("#/all/docker")).toEqual({
      activeMap: "all",
      selectedNodeId: "docker",
      layoutMode: "layers",
    });
  });

  it("falls back to defaults on invalid map or mode", () => {
    expect(parseUrlHash("#/unknown-map/express?mode=invalid")).toEqual({
      activeMap: "backend",
      selectedNodeId: "express",
      layoutMode: "layers",
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
      resolveDeepLink({ activeMap, selectedNodeId, layoutMode: "layers" }, graph);

    expect(link("backend", "vue").activeMap).toBe("frontend");
    expect(link("backend", "docker").activeMap).toBe("backend");
    expect(link("all", "vue").activeMap).toBe("all");
    expect(link("frontend", "renamed-node").selectedNodeId).toBeNull();
  });

  it("formats URL hash symmetrically", () => {
    expect(formatUrlHash("backend", "express", "layers")).toBe("#/backend/express?mode=layers");
    expect(formatUrlHash("frontend", null, "network")).toBe("#/frontend?mode=network");
  });

  it("pushes history only when the state moved away from the URL", () => {
    const parse = (hash: string) => parseUrlHash(hash, { defaultMap: "frontend" });
    const at = (selectedNodeId: string | null) =>
      ({ activeMap: "frontend", selectedNodeId, layoutMode: "layers" }) as const;

    expect(planHashUpdate("#/frontend/vue?mode=layers", at("vue"), parse)).toBe("none");
    expect(planHashUpdate("", at(null), parse)).toBe("replace");
    expect(planHashUpdate("#/frontend/vue", at("vue"), parse)).toBe("replace");
    expect(planHashUpdate("#/frontend/vue?mode=layers", at("react"), parse)).toBe("push");
    expect(planHashUpdate("#/frontend/vue?mode=layers", at(null), parse)).toBe("push");
  });
});
