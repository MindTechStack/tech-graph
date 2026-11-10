import type { ContentDiagnostic, TechNodeData } from "./parse";
import type { CategoryConfig, MapConfig, MapId, MapsFile } from "./schema";

export interface GraphEdge {
  readonly id: string;
  readonly source: string;
  readonly target: string;
  readonly label: string;
}

export interface ResolvedRelation {
  readonly to: string;
  readonly label: string;
  readonly targetNode: TechNodeData;
}

export interface BacklinkRelation {
  readonly from: string;
  readonly label: string;
  readonly sourceNode: TechNodeData;
}

export interface KnowledgeGraph {
  readonly maps: readonly MapConfig[];
  readonly mapsById: ReadonlyMap<MapId, MapConfig>;
  readonly categoriesByMap: ReadonlyMap<MapId, ReadonlyMap<string, CategoryConfig>>;
  readonly nodes: readonly TechNodeData[];
  readonly nodesById: ReadonlyMap<string, TechNodeData>;
  readonly edges: readonly GraphEdge[];
  readonly outgoingByNodeId: ReadonlyMap<string, readonly ResolvedRelation[]>;
  readonly incomingByNodeId: ReadonlyMap<string, readonly BacklinkRelation[]>;
  readonly diagnostics: readonly ContentDiagnostic[];
  readonly errors: readonly ContentDiagnostic[];
  readonly warnings: readonly ContentDiagnostic[];
}

export interface MapSliceNode {
  readonly node: TechNodeData;
  readonly isGhost: boolean;
  readonly categoryConfig: CategoryConfig | undefined;
}

export interface MapGraphSlice {
  readonly mapId: MapId | "all";
  readonly nodes: readonly MapSliceNode[];
  readonly edges: readonly GraphEdge[];
}

export function buildKnowledgeGraph(
  mapsFile: MapsFile,
  rawNodes: readonly TechNodeData[],
  initialDiagnostics: readonly ContentDiagnostic[] = [],
): KnowledgeGraph {
  const diagnostics: ContentDiagnostic[] = [...initialDiagnostics];

  const maps = [...mapsFile.maps].sort((a, b) => a.order - b.order);
  const mapsById = new Map<MapId, MapConfig>();
  const categoriesByMap = new Map<MapId, ReadonlyMap<string, CategoryConfig>>();

  for (const mapConfig of maps) {
    mapsById.set(mapConfig.id, mapConfig);
    const catMap = new Map<string, CategoryConfig>();
    for (const cat of mapConfig.categories) {
      catMap.set(cat.id, cat);
    }
    categoriesByMap.set(mapConfig.id, catMap);
  }

  const nodesById = new Map<string, TechNodeData>();
  const sortedRaw = [...rawNodes].sort((a, b) => a.filePath.localeCompare(b.filePath));

  for (const node of sortedRaw) {
    const existing = nodesById.get(node.id);
    if (existing) {
      diagnostics.push({
        severity: "error",
        code: "DUPLICATE_ID",
        filePath: node.filePath,
        nodeId: node.id,
        message: `Duplicate node id '${node.id}' found in '${node.filePath}' (already defined in '${existing.filePath}')`,
      });
      continue;
    }

    const mapCategories = categoriesByMap.get(node.map);
    if (!mapCategories || !mapCategories.has(node.category)) {
      diagnostics.push({
        severity: "error",
        code: "UNKNOWN_CATEGORY",
        filePath: node.filePath,
        nodeId: node.id,
        message: `Unknown category '${node.category}' for map '${node.map}' in '${node.filePath}'`,
      });
    }

    if (node.alsoIn.includes(node.map)) {
      diagnostics.push({
        severity: "warning",
        code: "REDUNDANT_ALSO_IN",
        filePath: node.filePath,
        nodeId: node.id,
        message: `Node '${node.id}' lists its own home map '${node.map}' in alsoIn`,
      });
    }

    nodesById.set(node.id, node);
  }

  const nodes = [...nodesById.values()].sort((a, b) => a.name.localeCompare(b.name));
  const edges: GraphEdge[] = [];
  const outgoingByNodeId = new Map<string, ResolvedRelation[]>();
  const incomingByNodeId = new Map<string, BacklinkRelation[]>();

  for (const node of nodes) {
    outgoingByNodeId.set(node.id, []);
    incomingByNodeId.set(node.id, []);
  }

  const seenEdgeIds = new Set<string>();

  for (const node of nodes) {
    const outgoing = outgoingByNodeId.get(node.id)!;

    for (const rel of node.relations) {
      if (rel.to === node.id) {
        diagnostics.push({
          severity: "error",
          code: "SELF_RELATION",
          filePath: node.filePath,
          nodeId: node.id,
          message: `Node '${node.id}' has a relation pointing to itself`,
        });
        continue;
      }

      const targetNode = nodesById.get(rel.to);
      if (!targetNode) {
        diagnostics.push({
          severity: "error",
          code: "BROKEN_RELATION",
          filePath: node.filePath,
          nodeId: node.id,
          message: `Node '${node.id}' references unknown target node '${rel.to}' (${rel.label})`,
        });
        continue;
      }

      outgoing.push({
        to: rel.to,
        label: rel.label,
        targetNode,
      });

      const incoming = incomingByNodeId.get(rel.to);
      if (incoming) {
        incoming.push({
          from: node.id,
          label: rel.label,
          sourceNode: node,
        });
      }

      const edgeId = `${node.id}--${rel.label}-->${rel.to}`;
      if (!seenEdgeIds.has(edgeId)) {
        seenEdgeIds.add(edgeId);
        edges.push({
          id: edgeId,
          source: node.id,
          target: rel.to,
          label: rel.label,
        });
      }
    }
  }

  if (nodes.length > 1) {
    for (const node of nodes) {
      const outCount = outgoingByNodeId.get(node.id)?.length ?? 0;
      const inCount = incomingByNodeId.get(node.id)?.length ?? 0;
      if (outCount === 0 && inCount === 0) {
        diagnostics.push({
          severity: "warning",
          code: "ORPHAN_NODE",
          filePath: node.filePath,
          nodeId: node.id,
          message: `Node '${node.id}' has no outgoing or incoming relations (orphan node)`,
        });
      }
    }
  }

  const errors = diagnostics.filter((d) => d.severity === "error");
  const warnings = diagnostics.filter((d) => d.severity === "warning");

  return {
    maps,
    mapsById,
    categoriesByMap,
    nodes,
    nodesById,
    edges,
    outgoingByNodeId,
    incomingByNodeId,
    diagnostics,
    errors,
    warnings,
  };
}

export function isNodeDirectlyInMap(node: TechNodeData, mapId: MapId | "all"): boolean {
  if (mapId === "all") {
    return true;
  }
  return node.map === mapId || node.alsoIn.includes(mapId);
}

export function getMapGraphSlice(graph: KnowledgeGraph, mapId: MapId | "all"): MapGraphSlice {
  if (mapId === "all") {
    const sliceNodes: MapSliceNode[] = graph.nodes.map((node) => ({
      node,
      isGhost: false,
      categoryConfig: graph.categoriesByMap.get(node.map)?.get(node.category),
    }));
    return {
      mapId,
      nodes: sliceNodes,
      edges: graph.edges,
    };
  }

  const primaryNodeIds = new Set<string>();
  for (const node of graph.nodes) {
    if (isNodeDirectlyInMap(node, mapId)) {
      primaryNodeIds.add(node.id);
    }
  }

  const ghostNodeIds = new Set<string>();
  const sliceEdges: GraphEdge[] = [];

  for (const edge of graph.edges) {
    const sourceInMap = primaryNodeIds.has(edge.source);
    const targetInMap = primaryNodeIds.has(edge.target);

    if (sourceInMap || targetInMap) {
      sliceEdges.push(edge);
      if (!sourceInMap) {
        ghostNodeIds.add(edge.source);
      }
      if (!targetInMap) {
        ghostNodeIds.add(edge.target);
      }
    }
  }

  const sliceNodes: MapSliceNode[] = [];
  for (const node of graph.nodes) {
    if (primaryNodeIds.has(node.id)) {
      sliceNodes.push({
        node,
        isGhost: false,
        categoryConfig: graph.categoriesByMap.get(node.map)?.get(node.category),
      });
    } else if (ghostNodeIds.has(node.id)) {
      sliceNodes.push({
        node,
        isGhost: true,
        categoryConfig: graph.categoriesByMap.get(node.map)?.get(node.category),
      });
    }
  }

  return {
    mapId,
    nodes: sliceNodes,
    edges: sliceEdges,
  };
}
