import { type Edge, MarkerType } from "@xyflow/react";
import ELK, { type ElkExtendedEdge, type ElkNode } from "elkjs/lib/elk.bundled.js";
import type { GroupFlowNode } from "../components/GroupNode";
import type { TechFlowNode } from "../components/TechNode";
import {
  isCrossMapScope,
  type KnowledgeGraph,
  type MapGraphSlice,
  type MapSliceNode,
} from "../content/graph";
import type { LayoutMode } from "../state/useAppState";

export type AppFlowNode = GroupFlowNode | TechFlowNode;
export type AppFlowEdge = Edge<{ readonly rawLabel: string }>;

export interface PositionedGraph {
  readonly cacheKey: string;
  readonly nodes: readonly AppFlowNode[];
  readonly edges: readonly AppFlowEdge[];
}

export const TECH_NODE_WIDTH = 224;
export const TECH_NODE_HEIGHT = 64;

const GROUP_PADDING_X = 16;
const GROUP_MIN_HEIGHT = TECH_NODE_HEIGHT + 64;
const FAR_TITLE_CHAR_WIDTH = 15;

export function groupMinWidth(label: string): number {
  const titleWidth = Math.ceil(label.length * FAR_TITLE_CHAR_WIDTH) + 2 * GROUP_PADDING_X;
  return Math.max(TECH_NODE_WIDTH + 2 * GROUP_PADDING_X, titleWidth);
}

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
          label: `↗ ${homeMapConfig?.name ?? node.map}`,
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
    const spansMaps = isCrossMapScope(slice.mapId);
    const groupKey = spansMaps ? `group--${node.map}--${node.category}` : `group--${node.category}`;
    const label = spansMaps
      ? `${mapConfig?.name ?? node.map} / ${categoryConfig?.name ?? node.category}`
      : (categoryConfig?.name ?? node.category);
    const color = categoryConfig?.color ?? "#94a3b8";
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
  graph: KnowledgeGraph,
  sliceNode: MapSliceNode,
  position: { readonly x: number; readonly y: number },
  parentId?: string,
): TechFlowNode {
  const { node, isGhost, categoryConfig } = sliceNode;
  const categoryName = categoryConfig?.name ?? node.category;
  const homeMapName = graph.mapsById.get(node.map)?.name ?? node.map;
  return {
    id: node.id,
    type: "tech",
    ariaLabel: [node.name, isGhost ? `on the ${homeMapName} map` : categoryName, node.status].join(
      ", ",
    ),
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
      categoryName,
      homeMapName,
      categoryColor: categoryConfig?.color ?? "#94a3b8",
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
    type: "straight",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 16,
      height: 16,
      color: "rgba(17, 17, 17, 0.3)",
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
    const groupIdByNodeId = new Map<string, string>(
      buckets.flatMap((bucket) =>
        bucket.items.map((item) => [item.node.id, bucket.groupId] as const),
      ),
    );

    const elkGroupChildren: ElkNode[] = buckets.map((bucket) => ({
      id: bucket.groupId,
      layoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": "RIGHT",
        "elk.padding": "[top=48,left=16,bottom=16,right=16]",
        "elk.spacing.nodeNode": "16",
        "elk.layered.spacing.nodeNodeBetweenLayers": "96",
        "elk.nodeSize.constraints": "MINIMUM_SIZE",
        "elk.nodeSize.minimum": `(${groupMinWidth(bucket.label)}, ${GROUP_MIN_HEIGHT})`,
      },
      children: bucket.items.map((item) => ({
        id: item.node.id,
        width: TECH_NODE_WIDTH,
        height: TECH_NODE_HEIGHT,
      })),
      edges: elkEdges.filter(
        (edge) =>
          groupIdByNodeId.get(edge.sources[0]!) === bucket.groupId &&
          groupIdByNodeId.get(edge.targets[0]!) === bucket.groupId,
      ),
    }));

    const rootElkGraph: ElkNode = {
      id: "root",
      layoutOptions: {
        "elk.algorithm": "rectpacking",
        "elk.aspectRatio": "1.5",
        "elk.spacing.nodeNode": "32",
        "elk.padding": "[top=32,left=32,bottom=32,right=32]",
      },
      children: elkGroupChildren,
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

      const groupWidth = Math.max(elkGroup.width ?? 0, groupMinWidth(bucket.label));
      const groupHeight = Math.max(elkGroup.height ?? 0, GROUP_MIN_HEIGHT);

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
        focusable: false,
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
            graph,
            sliceNode,
            {
              x: Math.round(elkChild.x ?? 16),
              y: Math.round(elkChild.y ?? 48),
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
        "elk.algorithm": "force",
        "elk.force.iterations": "60",
        "elk.spacing.nodeNode": "96",
        "elk.spacing.componentComponent": "112",
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
    const pts = (laidOut.children ?? []).map((child, idx) => ({
      id: child.id,
      x: Math.round(child.x ?? idx * 12),
      y: Math.round(child.y ?? idx * 12),
    }));

    const minSepX = TECH_NODE_WIDTH + 32;
    const minSepY = TECH_NODE_HEIGHT + 16;
    for (let iter = 0; iter < 80; iter++) {
      let moved = false;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i]!;
          const b = pts[j]!;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const ox = minSepX - Math.abs(dx);
          const oy = minSepY - Math.abs(dy);
          if (ox > 0 && oy > 0) {
            moved = true;
            if (ox / minSepX < oy / minSepY) {
              const push = Math.ceil(ox / 2) + 1;
              const dir = dx >= 0 ? 1 : -1;
              a.x -= dir * push;
              b.x += dir * push;
            } else {
              const push = Math.ceil(oy / 2) + 1;
              const dir = dy >= 0 ? 1 : -1;
              a.y -= dir * push;
              b.y += dir * push;
            }
          }
        }
      }
      if (!moved) {
        break;
      }
    }

    const posById = new Map<string, { readonly x: number; readonly y: number }>(
      pts.map((pt) => [pt.id, { x: pt.x, y: pt.y }]),
    );

    positionedNodes = slice.nodes.map((sn) =>
      createTechFlowNode(graph, sn, posById.get(sn.node.id) ?? { x: 0, y: 0 }),
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
