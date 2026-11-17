import type { ContentDiagnostic, TechNodeData } from "./parse";
import type { CategoryConfig, MapConfig, MapId, MapsFile, NodeKind, NodeStatus } from "./schema";

export type MapScope = MapId | "all" | "core";

export const CORE_SCOPE_LABEL = "Main stack";
export const NEUTRAL_CATEGORY_COLOR = "var(--ink-muted)";

export function isCrossMapScope(scope: MapScope): scope is "all" | "core" {
  return scope === "all" || scope === "core";
}

export interface GraphFilterCriteria {
  readonly categories?: ReadonlySet<string>;
  readonly statuses?: ReadonlySet<NodeStatus>;
  readonly kinds?: ReadonlySet<NodeKind>;
  readonly includeGhosts?: boolean;
}

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
  readonly mapId: MapScope;
  readonly nodes: readonly MapSliceNode[];
  readonly edges: readonly GraphEdge[];
}

export interface ParsedContent {
  readonly mapsFile: MapsFile;
  readonly nodes: readonly TechNodeData[];
  readonly diagnostics: readonly ContentDiagnostic[];
}

export function buildGraphFromParsedContent(content: ParsedContent): KnowledgeGraph {
  return buildKnowledgeGraph(content.mapsFile, content.nodes, content.diagnostics);
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

export function isNodeDirectlyInMap(node: TechNodeData, mapId: MapScope): boolean {
  if (mapId === "all") {
    return true;
  }
  if (mapId === "core") {
    return node.core;
  }
  return node.map === mapId || node.alsoIn.includes(mapId);
}

export function getNodeCategoryKey(node: TechNodeData, activeMap: MapScope): string {
  return isCrossMapScope(activeMap) ? `${node.map}:${node.category}` : node.category;
}

export function matchesNodeFilters(
  node: TechNodeData,
  activeMap: MapScope,
  filters?: GraphFilterCriteria,
  ignoreCategory: boolean = false,
): boolean {
  if (!filters) {
    return true;
  }
  if (!ignoreCategory && filters.categories && filters.categories.size > 0) {
    const catKey = getNodeCategoryKey(node, activeMap);
    if (!filters.categories.has(catKey) && !filters.categories.has(node.category)) {
      return false;
    }
  }
  if (filters.statuses && filters.statuses.size > 0 && !filters.statuses.has(node.status)) {
    return false;
  }
  if (filters.kinds && filters.kinds.size > 0 && !filters.kinds.has(node.kind)) {
    return false;
  }
  return true;
}

export function buildFilterSignature(filters?: GraphFilterCriteria): string {
  if (!filters) {
    return "all";
  }
  const cats = filters.categories ? [...filters.categories].sort().join(",") : "";
  const statuses = filters.statuses ? [...filters.statuses].sort().join(",") : "";
  const kinds = filters.kinds ? [...filters.kinds].sort().join(",") : "";
  const ghosts = filters.includeGhosts !== false ? "g1" : "g0";
  return `c:[${cats}]|s:[${statuses}]|k:[${kinds}]|${ghosts}`;
}

export function getMapGraphSlice(
  graph: KnowledgeGraph,
  mapId: MapScope,
  filters?: GraphFilterCriteria,
): MapGraphSlice {
  const includeGhosts = filters?.includeGhosts !== false;

  if (isCrossMapScope(mapId)) {
    const keptIds = new Set<string>();
    const sliceNodes: MapSliceNode[] = [];

    for (const node of graph.nodes) {
      if (isNodeDirectlyInMap(node, mapId) && matchesNodeFilters(node, mapId, filters)) {
        keptIds.add(node.id);
        sliceNodes.push({
          node,
          isGhost: false,
          categoryConfig: graph.categoriesByMap.get(node.map)?.get(node.category),
        });
      }
    }

    const sliceEdges = graph.edges.filter(
      (edge) => keptIds.has(edge.source) && keptIds.has(edge.target),
    );

    return {
      mapId,
      nodes: sliceNodes,
      edges: sliceEdges,
    };
  }

  const primaryNodeIds = new Set<string>();
  for (const node of graph.nodes) {
    if (isNodeDirectlyInMap(node, mapId) && matchesNodeFilters(node, mapId, filters)) {
      primaryNodeIds.add(node.id);
    }
  }

  const ghostNodeIds = new Set<string>();
  const sliceEdges: GraphEdge[] = [];

  for (const edge of graph.edges) {
    const sourceInMap = primaryNodeIds.has(edge.source);
    const targetInMap = primaryNodeIds.has(edge.target);

    if (sourceInMap && targetInMap) {
      sliceEdges.push(edge);
    } else if (includeGhosts && (sourceInMap || targetInMap)) {
      const externalId = sourceInMap ? edge.target : edge.source;
      const externalNode = graph.nodesById.get(externalId);
      // External ghost node respects status/kind filters if set, but ignores current map's category filter
      if (externalNode && matchesNodeFilters(externalNode, mapId, filters, true)) {
        sliceEdges.push(edge);
        ghostNodeIds.add(externalId);
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
