import {
  Background,
  BackgroundVariant,
  Controls,
  type EdgeMouseHandler,
  MarkerType,
  MiniMap,
  type NodeMouseHandler,
  type NodeTypes,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildFilterSignature, getMapGraphSlice, type KnowledgeGraph } from "../content/graph";
import {
  type AppFlowEdge,
  type AppFlowNode,
  computeGraphLayout,
  type PositionedGraph,
} from "../layout/elk";
import { useAppState } from "../state/useAppState";
import { GroupNode } from "./GroupNode";
import { STATUS_META, TechNode } from "./TechNode";

const NODE_TYPES: NodeTypes = {
  tech: TechNode,
  categoryGroup: GroupNode,
};

export interface GraphCanvasProps {
  readonly graph: KnowledgeGraph;
}

function GraphCanvasInner({ graph }: GraphCanvasProps) {
  const {
    activeMap,
    layoutMode,
    selectedNodeId,
    hoveredNodeId,
    showAllEdgeLabels,
    filters,
    hasActiveFilters,
    focusRequest,
    setSelectedNodeId,
    setHoveredNodeId,
    handleNodeClick,
    resetFilters,
  } = useAppState();

  const { fitView } = useReactFlow();
  const [positioned, setPositioned] = useState<PositionedGraph | null>(null);
  const [isLayoutPending, setIsLayoutPending] = useState<boolean>(true);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const lastHandledFocusSeqRef = useRef<number>(0);

  const filterSignature = useMemo(() => buildFilterSignature(filters), [filters]);
  const slice = useMemo(
    () => getMapGraphSlice(graph, activeMap, filters),
    [graph, activeMap, filters],
  );

  useEffect(() => {
    let cancelled = false;
    setIsLayoutPending(true);

    computeGraphLayout(graph, slice, layoutMode, filterSignature)
      .then((result) => {
        if (cancelled) {
          return;
        }
        setPositioned(result);
        setIsLayoutPending(false);

        requestAnimationFrame(() => {
          if (
            focusRequest &&
            focusRequest.seq !== lastHandledFocusSeqRef.current &&
            result.nodes.some((n) => n.id === focusRequest.nodeId)
          ) {
            lastHandledFocusSeqRef.current = focusRequest.seq;
            fitView({
              nodes: [{ id: focusRequest.nodeId }],
              duration: 340,
              maxZoom: 1.15,
              padding: 0.6,
            });
          } else {
            fitView({ padding: 0.16, duration: 260 });
          }
        });
      })
      .catch((err: unknown) => {
        console.error("[GraphCanvas] ELK layout failed:", err);
        if (!cancelled) {
          setIsLayoutPending(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [graph, slice, layoutMode, filterSignature, fitView, focusRequest]);

  // Also handle focus requests when layout hasn't changed (e.g. clicking a relation or search result within the same map)
  useEffect(() => {
    if (
      !positioned ||
      isLayoutPending ||
      !focusRequest ||
      focusRequest.seq === lastHandledFocusSeqRef.current
    ) {
      return;
    }

    const existsInCanvas = positioned.nodes.some((n) => n.id === focusRequest.nodeId);
    if (!existsInCanvas) {
      return;
    }

    lastHandledFocusSeqRef.current = focusRequest.seq;
    requestAnimationFrame(() => {
      fitView({
        nodes: [{ id: focusRequest.nodeId }],
        duration: 340,
        maxZoom: 1.15,
        padding: 0.6,
      });
    });
  }, [focusRequest, positioned, isLayoutPending, fitView]);

  const activeFocusNodeId = hoveredNodeId ?? selectedNodeId;

  const connectedNodeIds = useMemo(() => {
    if (!activeFocusNodeId || !positioned) {
      return null;
    }
    const set = new Set<string>([activeFocusNodeId]);
    for (const edge of positioned.edges) {
      if (edge.source === activeFocusNodeId) {
        set.add(edge.target);
      }
      if (edge.target === activeFocusNodeId) {
        set.add(edge.source);
      }
    }
    return set;
  }, [activeFocusNodeId, positioned]);

  const displayNodes = useMemo<AppFlowNode[]>(() => {
    if (!positioned) {
      return [];
    }
    return positioned.nodes.map((node) => {
      if (node.type !== "tech") {
        return node;
      }
      const isSelected = node.id === selectedNodeId;
      const isDimmed = connectedNodeIds !== null && !connectedNodeIds.has(node.id);

      if (node.data.isSelected === isSelected && node.data.isDimmed === isDimmed) {
        return node;
      }

      return {
        ...node,
        data: {
          ...node.data,
          isSelected,
          isDimmed,
        },
      };
    });
  }, [positioned, selectedNodeId, connectedNodeIds]);

  const displayEdges = useMemo<AppFlowEdge[]>(() => {
    if (!positioned) {
      return [];
    }
    return positioned.edges.map((edge) => {
      const isConnectedToFocus =
        activeFocusNodeId !== null &&
        (edge.source === activeFocusNodeId || edge.target === activeFocusNodeId);
      const isHoveredEdge = edge.id === hoveredEdgeId;
      const isHighlighted = isConnectedToFocus || isHoveredEdge;
      const isDimmed = activeFocusNodeId !== null && !isConnectedToFocus && !isHoveredEdge;

      const showLabel = showAllEdgeLabels || isHighlighted;
      const strokeColor = isHighlighted
        ? "#60a5fa"
        : isDimmed
          ? "rgba(100, 116, 139, 0.22)"
          : "rgba(148, 163, 184, 0.55)";

      return {
        ...edge,
        label: showLabel ? edge.data?.rawLabel : undefined,
        animated: isHighlighted,
        zIndex: isHighlighted ? 10 : 0,
        style: {
          stroke: strokeColor,
          strokeWidth: isHighlighted ? 2.2 : 1.5,
        },
        labelStyle: {
          fill: isHighlighted ? "#e2e8f0" : "#94a3b8",
          fontSize: 11,
          fontWeight: 500,
        },
        labelBgStyle: {
          fill: "rgba(15, 17, 23, 0.88)",
          stroke: isHighlighted ? "#3b82f6" : "#2a2f3d",
          strokeWidth: 1,
        },
        labelBgPadding: [6, 3] as [number, number],
        labelBgBorderRadius: 4,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: strokeColor,
        },
      };
    });
  }, [positioned, activeFocusNodeId, hoveredEdgeId, showAllEdgeLabels]);

  const onNodeClick = useCallback<NodeMouseHandler<AppFlowNode>>(
    (_event, node) => {
      if (node.type === "tech") {
        handleNodeClick(node.data.tech, node.data.isGhost);
      }
    },
    [handleNodeClick],
  );

  const onNodeMouseEnter = useCallback<NodeMouseHandler<AppFlowNode>>(
    (_event, node) => {
      if (node.type === "tech") {
        setHoveredNodeId(node.id);
      }
    },
    [setHoveredNodeId],
  );

  const onNodeMouseLeave = useCallback<NodeMouseHandler<AppFlowNode>>(() => {
    setHoveredNodeId(null);
  }, [setHoveredNodeId]);

  const onEdgeMouseEnter = useCallback<EdgeMouseHandler<AppFlowEdge>>((_event, edge) => {
    setHoveredEdgeId(edge.id);
  }, []);

  const onEdgeMouseLeave = useCallback<EdgeMouseHandler<AppFlowEdge>>(() => {
    setHoveredEdgeId(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  const ghostCount = useMemo(() => slice.nodes.filter((n) => n.isGhost).length, [slice.nodes]);
  const primaryCount = slice.nodes.length - ghostCount;

  return (
    <div className="graph-canvas">
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        nodeTypes={NODE_TYPES}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
        onPaneClick={onPaneClick}
        fitView
        minZoom={0.15}
        maxZoom={2}
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.2} color="#262b38" />
        <Controls position="bottom-right" showInteractive={false} />
        <MiniMap<AppFlowNode>
          position="bottom-left"
          pannable
          zoomable
          nodeColor={(node) => {
            if (node.type === "categoryGroup") {
              return "rgba(100, 116, 139, 0.12)";
            }
            if (node.type === "tech") {
              return STATUS_META[node.data.tech.status].color;
            }
            return "#475569";
          }}
          maskColor="rgba(10, 12, 18, 0.72)"
        />

        <Panel position="top-left" className="graph-canvas__info-pill">
          <span>
            Showing <strong>{primaryCount}</strong> primary
            {ghostCount > 0 ? (
              <>
                {" "}
                + <strong>{ghostCount}</strong> ghost
              </>
            ) : null}{" "}
            · <strong>{slice.edges.length}</strong> edges
          </span>
          {hasActiveFilters ? (
            <button
              type="button"
              className="graph-canvas__pill-btn"
              onClick={resetFilters}
              title="Reset active filters"
            >
              Clear filters ✕
            </button>
          ) : null}
          {isLayoutPending ? <span className="graph-canvas__layout-badge">Layouting…</span> : null}
        </Panel>

        {!isLayoutPending && slice.nodes.length === 0 ? (
          <Panel position="top-center" className="graph-canvas__empty">
            <p>No nodes match the current filters on this map.</p>
            {hasActiveFilters ? (
              <button
                type="button"
                className="graph-canvas__empty-btn"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            ) : null}
          </Panel>
        ) : null}
      </ReactFlow>
    </div>
  );
}

export function GraphCanvas(props: GraphCanvasProps) {
  return (
    <ReactFlowProvider>
      <GraphCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
