import {
  Background,
  BackgroundVariant,
  Controls,
  type EdgeMouseHandler,
  MarkerType,
  type NodeMouseHandler,
  type NodeTypes,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  useStore,
  useStoreApi,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { buildFilterSignature, getMapGraphSlice, type KnowledgeGraph } from "../content/graph";
import {
  type AppFlowEdge,
  type AppFlowNode,
  buildLayoutCacheKey,
  computeGraphLayout,
  type PositionedGraph,
} from "../layout/elk";
import { useAppState } from "../state/useAppState";
import { GroupNode } from "./GroupNode";
import { Icon } from "./Icon";
import { TechNode } from "./TechNode";

const NODE_TYPES: NodeTypes = {
  tech: TechNode,
  categoryGroup: GroupNode,
};

const OVERVIEW_MIN_ZOOM = 0.4;
const FAR_VIEW_ZOOM = 0.75;
const FOCUS_ZOOM = 1.15;
const FIT_INSET = { top: 72, right: 72, bottom: 32, left: 32 };

const NODE_KEYBOARD_HINT = "Press Enter or Space to open its card.";
const ARIA_LABEL_CONFIG = {
  "node.a11yDescription.default": NODE_KEYBOARD_HINT,
  "node.a11yDescription.keyboardDisabled": NODE_KEYBOARD_HINT,
};

function motionDuration(ms: number): number {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : ms;
}

function detailPanelOverlap(pane: HTMLElement): number {
  const panel = document.querySelector(".detail-panel");
  if (!panel) {
    return 0;
  }
  const paneBox = pane.getBoundingClientRect();
  const overlap = paneBox.right - panel.getBoundingClientRect().left;
  return overlap > 0 && overlap < paneBox.width ? overlap : 0;
}

function flowBox(nodes: readonly AppFlowNode[], nodeId: string) {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) {
    return null;
  }
  const parent = node.parentId ? nodes.find((n) => n.id === node.parentId) : undefined;
  return {
    x: node.position.x + (parent?.position.x ?? 0),
    y: node.position.y + (parent?.position.y ?? 0),
    width: node.width ?? 0,
    height: node.height ?? 0,
  };
}

function layoutBounds(nodes: readonly AppFlowNode[]) {
  const topLevel = nodes.filter((n) => !n.parentId);
  if (topLevel.length === 0) {
    return null;
  }
  const minX = Math.min(...topLevel.map((n) => n.position.x));
  const minY = Math.min(...topLevel.map((n) => n.position.y));
  const maxX = Math.max(
    ...topLevel.map((n) => n.position.x + (n.width ?? Number(n.style?.width ?? 0))),
  );
  const maxY = Math.max(
    ...topLevel.map((n) => n.position.y + (n.height ?? Number(n.style?.height ?? 0))),
  );
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function overviewViewport(
  bounds: { x: number; y: number; width: number; height: number },
  paneWidth: number,
  paneHeight: number,
  rightInset: number,
) {
  const availableWidth = paneWidth - FIT_INSET.left - rightInset;
  const availableHeight = paneHeight - FIT_INSET.top - FIT_INSET.bottom;
  const zoom = Math.min(
    1,
    Math.max(
      OVERVIEW_MIN_ZOOM,
      Math.min(availableWidth / bounds.width, availableHeight / bounds.height),
    ),
  );
  const slackX = Math.max(0, availableWidth - bounds.width * zoom);
  const slackY = Math.max(0, availableHeight - bounds.height * zoom);
  return {
    x: FIT_INSET.left + slackX / 2 - bounds.x * zoom,
    y: FIT_INSET.top + slackY / 2 - bounds.y * zoom,
    zoom,
  };
}

function pluralWord(count: number, word: string): string {
  return count === 1 ? word : `${word}s`;
}

function focusedNodeId(target: EventTarget): string | undefined {
  return target instanceof HTMLElement && target.classList.contains("react-flow__node")
    ? target.dataset.id
    : undefined;
}

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

  const store = useStoreApi<AppFlowNode, AppFlowEdge>();
  const { setViewport, setCenter, getViewport } = useReactFlow<AppFlowNode, AppFlowEdge>();
  const isFarView = useStore((state) => state.transform[2] < FAR_VIEW_ZOOM);
  const [positioned, setPositioned] = useState<PositionedGraph | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const [failedLayoutKey, setFailedLayoutKey] = useState<string | null>(null);
  const [layoutAttempt, setLayoutAttempt] = useState(0);
  const handledFocusSeqRef = useRef<number>(0);
  const fittedLayoutRef = useRef<PositionedGraph | null>(null);
  const revealedNodeIdRef = useRef<string | null>(null);

  const filterSignature = useMemo(() => buildFilterSignature(filters), [filters]);
  const slice = useMemo(
    () => getMapGraphSlice(graph, activeMap, filters),
    [graph, activeMap, filters],
  );
  const layoutKey = useMemo(
    () => buildLayoutCacheKey(slice, layoutMode, filterSignature),
    [slice, layoutMode, filterSignature],
  );
  const hasLayoutFailed = failedLayoutKey === layoutKey;
  const isLayoutPending = !hasLayoutFailed && positioned?.cacheKey !== layoutKey;

  useEffect(() => {
    let cancelled = false;

    computeGraphLayout(graph, slice, layoutMode, filterSignature)
      .then((result) => {
        if (!cancelled) {
          setPositioned(result);
        }
      })
      .catch((err: unknown) => {
        console.error("[GraphCanvas] ELK layout failed:", err);
        if (!cancelled) {
          setPositioned(null);
          setFailedLayoutKey(layoutKey);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [graph, slice, layoutMode, filterSignature, layoutKey, layoutAttempt]);

  const retryLayout = useCallback(() => {
    setFailedLayoutKey(null);
    setLayoutAttempt((n) => n + 1);
  }, []);

  const syncPaneSize = useCallback((): HTMLElement | null => {
    const { domNode, width, height } = store.getState();
    if (domNode && (domNode.offsetWidth !== width || domNode.offsetHeight !== height)) {
      store.setState({ width: domNode.offsetWidth, height: domNode.offsetHeight });
    }
    return domNode;
  }, [store]);

  const centreOnNode = useCallback(
    (nodeId: string, zoom: number, duration: number): boolean => {
      const pane = syncPaneSize();
      const box = positioned ? flowBox(positioned.nodes, nodeId) : null;
      if (!pane || !box) {
        return false;
      }
      const shiftPastPanel = detailPanelOverlap(pane) / 2 / zoom;
      void setCenter(box.x + box.width / 2 + shiftPastPanel, box.y + box.height / 2, {
        zoom,
        duration,
      });
      return true;
    },
    [positioned, syncPaneSize, setCenter],
  );

  const isNodeOutOfView = useCallback(
    (nodeId: string): boolean => {
      const pane = syncPaneSize();
      const box = positioned ? flowBox(positioned.nodes, nodeId) : null;
      if (!pane || !box) {
        return false;
      }
      const { x, zoom } = getViewport();
      const left = box.x * zoom + x;
      const right = left + box.width * zoom;
      return left < 0 || right > pane.offsetWidth - detailPanelOverlap(pane);
    },
    [positioned, syncPaneSize, getViewport],
  );

  useEffect(() => {
    if (!positioned || isLayoutPending) {
      return;
    }

    const pendingFocus =
      focusRequest &&
      focusRequest.seq !== handledFocusSeqRef.current &&
      positioned.nodes.some((n) => n.id === focusRequest.nodeId)
        ? focusRequest
        : null;

    if (pendingFocus && centreOnNode(pendingFocus.nodeId, FOCUS_ZOOM, motionDuration(340))) {
      handledFocusSeqRef.current = pendingFocus.seq;
    } else if (fittedLayoutRef.current !== positioned) {
      const pane = syncPaneSize();
      const bounds = layoutBounds(positioned.nodes);
      if (pane && bounds) {
        const rightInset = FIT_INSET.right + detailPanelOverlap(pane);
        void setViewport(
          overviewViewport(bounds, pane.offsetWidth, pane.offsetHeight, rightInset),
          { duration: motionDuration(260) },
        );
      }
    } else if (
      selectedNodeId &&
      selectedNodeId !== revealedNodeIdRef.current &&
      isNodeOutOfView(selectedNodeId)
    ) {
      centreOnNode(selectedNodeId, getViewport().zoom, motionDuration(260));
    }
    fittedLayoutRef.current = positioned;
    revealedNodeIdRef.current = selectedNodeId;
  }, [
    positioned,
    isLayoutPending,
    focusRequest,
    selectedNodeId,
    setViewport,
    syncPaneSize,
    centreOnNode,
    isNodeOutOfView,
    getViewport,
  ]);

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
        hidden: isFarView && !isHighlighted,
        label: showLabel ? edge.data?.rawLabel : undefined,
        className: isHighlighted ? "is-highlighted" : undefined,
        zIndex: isHighlighted ? 10 : 0,
        style: {
          stroke: strokeColor,
          strokeWidth: isHighlighted ? 2.2 : 1.5,
        },
        labelStyle: {
          fill: isHighlighted ? "#e2e8f0" : "#94a3b8",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fontWeight: 400,
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
  }, [positioned, activeFocusNodeId, hoveredEdgeId, showAllEdgeLabels, isFarView]);

  const onNodeClick = useCallback<NodeMouseHandler<AppFlowNode>>(
    (_event, node) => {
      if (node.type === "tech") {
        handleNodeClick(node.data.tech, node.data.isGhost);
      }
    },
    [handleNodeClick],
  );

  const onCanvasKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      const nodeId = focusedNodeId(event.target);
      const node = nodeId ? positioned?.nodes.find((n) => n.id === nodeId) : undefined;
      if (node?.type === "tech") {
        event.preventDefault();
        handleNodeClick(node.data.tech, node.data.isGhost);
      }
    },
    [positioned, handleNodeClick],
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
    <div
      className={isFarView ? "graph-canvas graph-canvas--far" : "graph-canvas"}
      onKeyDown={onCanvasKeyDown}
    >
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        nodeTypes={NODE_TYPES}
        edgesFocusable={false}
        ariaLabelConfig={ARIA_LABEL_CONFIG}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
        onPaneClick={onPaneClick}
        minZoom={0.15}
        maxZoom={2}
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.2} color="#262b38" />
        <Controls position="bottom-right" showInteractive={false} />

        <Panel position="top-left" className="graph-canvas__info-pill">
          <span>
            Showing <strong>{primaryCount}</strong> {pluralWord(primaryCount, "node")}
            {ghostCount > 0 ? (
              <>
                {" "}
                + <strong>{ghostCount}</strong> from other maps
              </>
            ) : null}{" "}
            · <strong>{slice.edges.length}</strong> {pluralWord(slice.edges.length, "relation")}
          </span>
          {hasActiveFilters ? (
            <button
              type="button"
              className="graph-canvas__pill-btn"
              onClick={resetFilters}
              title="Reset active filters"
            >
              Clear filters <Icon name="close" size={12} />
            </button>
          ) : null}
          {isLayoutPending ? <span className="graph-canvas__layout-badge">Layouting…</span> : null}
        </Panel>

        {hasLayoutFailed ? (
          <Panel position="top-center" className="graph-canvas__empty" role="alert">
            <p>Couldn't arrange the nodes on this map.</p>
            <button type="button" className="graph-canvas__empty-btn" onClick={retryLayout}>
              Try again
            </button>
          </Panel>
        ) : null}

        {!isLayoutPending && slice.nodes.length === 0 ? (
          <Panel position="top-center" className="graph-canvas__empty">
            <p>
              {hasActiveFilters
                ? "No nodes match the current filters on this map."
                : "This map has no nodes yet."}
            </p>
            {hasActiveFilters ? (
              <button type="button" className="graph-canvas__empty-btn" onClick={resetFilters}>
                Clear filters
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
