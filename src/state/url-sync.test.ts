import { describe, expect, it } from "vitest";
import { formatUrlHash, parseUrlHash } from "./url-sync";

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

  it("formats URL hash symmetrically", () => {
    expect(formatUrlHash("backend", "express", "layers")).toBe("#/backend/express?mode=layers");
    expect(formatUrlHash("frontend", null, "network")).toBe("#/frontend?mode=network");
  });
});
