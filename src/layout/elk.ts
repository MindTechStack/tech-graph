import { type Edge, MarkerType } from "@xyflow/react";
import ELK, { type ElkExtendedEdge, type ElkNode } from "elkjs/lib/elk.bundled.js";
import type { GroupFlowNode } from "../components/GroupNode";
import type { TechFlowNode } from "../components/TechNode";
import type { KnowledgeGraph, MapGraphSlice, MapSliceNode } from "../content/graph";
import type { LayoutMode } from "../state/useAppState";

export type AppFlowNode = GroupFlowNode | TechFlowNode;
export type AppFlowEdge = Edge<{ readonly rawLabel: string }>;

export interface PositionedGraph {
  readonly cacheKey: string;
  readonly nodes: readonly AppFlowNode[];
  readonly edges: readonly AppFlowEdge[];
}

export const TECH_NODE_WIDTH = 220;
export const TECH_NODE_HEIGHT = 68;

const elk = new ELK();
const layoutCache = new Map<string, PositionedGraph>();

export function clearLayoutCache(): void {
  layoutCache.clear();
}

export function buildLayoutCacheKey(
  slice: MapGraphSlice,
  mode: LayoutMode,
  filterSignature: string = "",
): string {
  const nodeKey = slice.nodes
    .map((n) => `${n.node.id}:${n.isGhost ? "g" : "p"}`)
    .sort()
    .join(",");
  const edgeKey = slice.edges
    .map((e) => e.id)
    .sort()
    .join(",");
  return `${slice.mapId}|${mode}|${filterSignature}|N:${nodeKey}|E:${edgeKey}`;
}

interface GroupBucket {
  readonly groupId: string;
  readonly label: string;
  readonly color: string;
  readonly order: number;
  readonly isGhostGroup: boolean;
  readonly items: MapSliceNode[];
}

function buildGroupBuckets(graph: KnowledgeGraph, slice: MapGraphSlice): readonly GroupBucket[] {
  const buckets = new Map<string, GroupBucket>();

  for (const sliceNode of slice.nodes) {
    const { node, isGhost, categoryConfig } = sliceNode;

    if (isGhost) {
      const homeMapConfig = graph.mapsById.get(node.map);
      const groupId = `group--ghost--${node.map}`;
      let bucket = buckets.get(groupId);
      if (!bucket) {
        bucket = {
          groupId,
          label: `External · ${homeMapConfig?.name ?? node.map}`,
          color: "#64748b",
          order: 1000 + (homeMapConfig?.order ?? 99),
          isGhostGroup: true,
          items: [],
        };
        buckets.set(groupId, bucket);
      }
      bucket.items.push(sliceNode);
      continue;
    }

    const mapConfig = graph.mapsById.get(node.map);
    const groupKey =
      slice.mapId === "all" ? `group--${node.map}--${node.category}` : `group--${node.category}`;
    const label =
      slice.mapId === "all"
        ? `${mapConfig?.name ?? node.map} / ${categoryConfig?.name ?? node.category}`
        : (categoryConfig?.name ?? node.category);
    const color = categoryConfig?.color ?? "#3b82f6";
    const order = (mapConfig?.order ?? 1) * 100 + (categoryConfig?.order ?? 1);

    let bucket = buckets.get(groupKey);
    if (!bucket) {
      bucket = {
        groupId: groupKey,
        label,
        color,
        order,
        isGhostGroup: false,
        items: [],
      };
      buckets.set(groupKey, bucket);
    }
    bucket.items.push(sliceNode);
  }

  return [...buckets.values()].sort((a, b) => a.order - b.order);
}

function createTechFlowNode(
  sliceNode: MapSliceNode,
  position: { readonly x: number; readonly y: number },
  parentId?: string,
): TechFlowNode {
  const { node, isGhost, categoryConfig } = sliceNode;
  return {
    id: node.id,
    type: "tech",
    position,
    width: TECH_NODE_WIDTH,
    height: TECH_NODE_HEIGHT,
    ...(parentId
      ? {
          parentId,
          extent: "parent" as const,
        }
      : {}),
    data: {
      tech: node,
      isGhost,
      categoryName: categoryConfig?.name ?? node.category,
      categoryColor: categoryConfig?.color ?? "#3b82f6",
      isSelected: false,
      isDimmed: false,
    },
  };
}

function createFlowEdges(slice: MapGraphSlice): AppFlowEdge[] {
  return slice.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    type: "default",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 16,
      height: 16,
      color: "#64748b",
    },
    data: {
      rawLabel: edge.label,
    },
  }));
}

export async function computeGraphLayout(
  graph: KnowledgeGraph,
  slice: MapGraphSlice,
  mode: LayoutMode,
  filterSignature: string = "",
): Promise<PositionedGraph> {
  const cacheKey = buildLayoutCacheKey(slice, mode, filterSignature);
  const cached = layoutCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  if (slice.nodes.length === 0) {
    const emptyResult: PositionedGraph = { cacheKey, nodes: [], edges: [] };
    layoutCache.set(cacheKey, emptyResult);
    return emptyResult;
  }

  const elkEdges: ElkExtendedEdge[] = slice.edges.map((e) => ({
    id: e.id,
    sources: [e.source],
    targets: [e.target],
  }));

  let positionedNodes: AppFlowNode[];

  if (mode === "layers") {
    const buckets = buildGroupBuckets(graph, slice);
    const sliceNodeById = new Map<string, MapSliceNode>(slice.nodes.map((sn) => [sn.node.id, sn]));

    const elkGroupChildren: ElkNode[] = buckets.map((bucket) => ({
      id: bucket.groupId,
      layoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": "RIGHT",
        "elk.padding": "[top=54,left=20,bottom=20,right=20]",
        "elk.spacing.nodeNode": "28",
        "elk.layered.spacing.nodeNodeBetweenLayers": "48",
      },
      children: bucket.items.map((item) => ({
        id: item.node.id,
        width: TECH_NODE_WIDTH,
        height: TECH_NODE_HEIGHT,
      })),
    }));

    const rootElkGraph: ElkNode = {
      id: "root",
      layoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": "RIGHT",
        "elk.hierarchyHandling": "INCLUDE_CHILDREN",
        "elk.layered.spacing.nodeNodeBetweenLayers": "72",
        "elk.spacing.nodeNode": "44",
        "elk.spacing.componentComponent": "48",
        "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
        "elk.padding": "[top=24,left=24,bottom=24,right=24]",
      },
      children: elkGroupChildren,
      edges: elkEdges,
    };

    const laidOut = await elk.layout(rootElkGraph);
    const groupNodes: GroupFlowNode[] = [];
    const childNodes: TechFlowNode[] = [];

    const bucketById = new Map<string, GroupBucket>(buckets.map((b) => [b.groupId, b]));

    for (const elkGroup of laidOut.children ?? []) {
      const bucket = bucketById.get(elkGroup.id);
      if (!bucket) {
        continue;
      }

      const groupWidth = Math.max(elkGroup.width ?? 260, TECH_NODE_WIDTH + 40);
      const groupHeight = Math.max(elkGroup.height ?? 140, TECH_NODE_HEIGHT + 74);

      groupNodes.push({
        id: bucket.groupId,
        type: "categoryGroup",
        position: {
          x: Math.round(elkGroup.x ?? 0),
          y: Math.round(elkGroup.y ?? 0),
        },
        style: {
          width: groupWidth,
          height: groupHeight,
        },
        draggable: false,
        selectable: false,
        data: {
          label: bucket.label,
          color: bucket.color,
          nodeCount: bucket.items.length,
          isGhostGroup: bucket.isGhostGroup,
        },
      });

      for (const elkChild of elkGroup.children ?? []) {
        const sliceNode = sliceNodeById.get(elkChild.id);
        if (!sliceNode) {
          continue;
        }
        childNodes.push(
          createTechFlowNode(
            sliceNode,
            {
              x: Math.round(elkChild.x ?? 20),
              y: Math.round(elkChild.y ?? 54),
            },
            bucket.groupId,
          ),
        );
      }
    }

    // Parent group nodes MUST precede child nodes in React Flow
    positionedNodes = [...groupNodes, ...childNodes];
  } else {
    const rootElkGraph: ElkNode = {
      id: "root",
      layoutOptions: {
        "elk.algorithm": "stress",
        "elk.stress.desiredEdgeLength": "240",
        "elk.spacing.nodeNode": "96",
        "elk.spacing.componentComponent": "110",
        "elk.padding": "[top=32,left=32,bottom=32,right=32]",
      },
      children: slice.nodes.map((sn) => ({
        id: sn.node.id,
        width: TECH_NODE_WIDTH,
        height: TECH_NODE_HEIGHT,
      })),
      edges: elkEdges,
    };

    const laidOut = await elk.layout(rootElkGraph);
    const posById = new Map<string, { readonly x: number; readonly y: number }>();

    for (const child of laidOut.children ?? []) {
      posById.set(child.id, {
        x: Math.round(child.x ?? 0),
        y: Math.round(child.y ?? 0),
      });
    }

    positionedNodes = slice.nodes.map((sn) =>
      createTechFlowNode(sn, posById.get(sn.node.id) ?? { x: 0, y: 0 }),
    );
  }

  const result: PositionedGraph = {
    cacheKey,
    nodes: positionedNodes,
    edges: createFlowEdges(slice),
  };

  layoutCache.set(cacheKey, result);
  return result;
}
