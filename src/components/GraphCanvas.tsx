import {
  Background,
  BackgroundVariant,
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
import { distanceBetween, edgeLabelPlate, type Rect, rectsOverlap, unionOf } from "../layout/rect";
import { useAppState } from "../state/useAppState";
import { type GroupFlowNode, GroupHeaders, GroupNode } from "./GroupNode";
import { Icon } from "./Icon";
import { TechNode } from "./TechNode";

const NODE_TYPES: NodeTypes = {
  tech: TechNode,
  categoryGroup: GroupNode,
};

const EDGE_INK = {
  rest: "rgba(17, 17, 17, 0.3)",
  dimmed: "rgba(17, 17, 17, 0.1)",
  highlighted: "#1f3bd6",
  label: "#5c5c58",
  labelHighlighted: "#111111",
  plate: "#f6f6f3",
} as const;

const MODULE_PITCH = 80;
const LIFTED_NODE_Z = 20;
const LABELLED_FOCUS_MAX_DEGREE = 6;
const HUB_MIN_DEGREE = 9;

const OVERVIEW_MIN_ZOOM = 0.2;
const FAR_VIEW_ZOOM = 0.75;
const FOCUS_ZOOM = 1.15;
const FIT_PADDING = 48;

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
  const availableWidth = paneWidth - FIT_PADDING * 2 - rightInset;
  const availableHeight = paneHeight - FIT_PADDING * 2;
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
    x: FIT_PADDING + slackX / 2 - bounds.x * zoom,
    y: FIT_PADDING + slackY / 2 - bounds.y * zoom,
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
  const { setViewport, setCenter, getViewport, zoomIn, zoomOut } = useReactFlow<
    AppFlowNode,
    AppFlowEdge
  >();
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

  const focusNeighbourhood = useCallback(
    (nodeId: string, duration: number): boolean => {
      const pane = syncPaneSize();
      if (!pane || !positioned) {
        return false;
      }
      const neighbourIds = new Set<string>([nodeId]);
      for (const edge of positioned.edges) {
        if (edge.source === nodeId) {
          neighbourIds.add(edge.target);
        }
        if (edge.target === nodeId) {
          neighbourIds.add(edge.source);
        }
      }
      const focusBox = flowBox(positioned.nodes, nodeId);
      if (!focusBox) {
        return false;
      }
      neighbourIds.delete(nodeId);
      const neighbourBoxes = [...neighbourIds]
        .map((id) => flowBox(positioned.nodes, id))
        .filter((box) => box !== null)
        .sort((a, b) => distanceBetween(focusBox, a) - distanceBetween(focusBox, b));

      const availableWidth = pane.offsetWidth - detailPanelOverlap(pane) - FIT_PADDING * 2;
      const availableHeight = pane.offsetHeight - FIT_PADDING * 2;
      const zoomToFit = (bounds: Rect) =>
        Math.min(availableWidth / bounds.width, availableHeight / bounds.height);

      let shown: Rect = focusBox;
      for (const box of neighbourBoxes) {
        const grown = unionOf(shown, box);
        if (zoomToFit(grown) < FAR_VIEW_ZOOM) {
          break;
        }
        shown = grown;
      }

      const zoom = Math.min(FOCUS_ZOOM, zoomToFit(shown));
      void setViewport(
        {
          x: FIT_PADDING + (availableWidth - shown.width * zoom) / 2 - shown.x * zoom,
          y: FIT_PADDING + (availableHeight - shown.height * zoom) / 2 - shown.y * zoom,
          zoom,
        },
        { duration },
      );
      return true;
    },
    [positioned, syncPaneSize, setViewport],
  );

  const fitOverview = useCallback(
    (duration: number) => {
      const pane = syncPaneSize();
      const bounds = positioned ? layoutBounds(positioned.nodes) : null;
      if (pane && bounds) {
        void setViewport(
          overviewViewport(bounds, pane.offsetWidth, pane.offsetHeight, detailPanelOverlap(pane)),
          { duration },
        );
      }
    },
    [positioned, syncPaneSize, setViewport],
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

    if (pendingFocus && focusNeighbourhood(pendingFocus.nodeId, motionDuration(340))) {
      handledFocusSeqRef.current = pendingFocus.seq;
    } else if (fittedLayoutRef.current !== positioned) {
      fitOverview(motionDuration(260));
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
    fitOverview,
    focusNeighbourhood,
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

  const isHubFocus = connectedNodeIds !== null && connectedNodeIds.size - 1 >= HUB_MIN_DEGREE;

  const onScreenNeighbourKey = useStore((state) => {
    if (!isHubFocus || !positioned || !connectedNodeIds) {
      return "";
    }
    const [x, y, zoom] = state.transform;
    const view: Rect = {
      x: -x / zoom,
      y: -y / zoom,
      width: state.width / zoom,
      height: state.height / zoom,
    };
    return [...connectedNodeIds]
      .filter((id) => {
        const box = flowBox(positioned.nodes, id);
        return box !== null && rectsOverlap(box, view);
      })
      .join(" ");
  });

  const onScreenNeighbourIds = useMemo(
    () => new Set(onScreenNeighbourKey.split(" ")),
    [onScreenNeighbourKey],
  );

  const labelledFocusEdgeIds = useMemo(() => {
    const labelled = new Set<string>();
    if (!positioned || !connectedNodeIds || connectedNodeIds.size - 1 > LABELLED_FOCUS_MAX_DEGREE) {
      return labelled;
    }
    const placed: Rect[] = positioned.nodes
      .filter((node) => node.type === "tech")
      .map((node) => flowBox(positioned.nodes, node.id))
      .filter((box) => box !== null);
    for (const edge of positioned.edges) {
      if (edge.source !== activeFocusNodeId && edge.target !== activeFocusNodeId) {
        continue;
      }
      const source = flowBox(positioned.nodes, edge.source);
      const target = flowBox(positioned.nodes, edge.target);
      const text = edge.data?.rawLabel;
      if (!source || !target || !text) {
        continue;
      }
      const plate = edgeLabelPlate(source, target, text);
      if (placed.every((obstacle) => !rectsOverlap(plate, obstacle))) {
        labelled.add(edge.id);
        placed.push(plate);
      }
    }
    return labelled;
  }, [positioned, connectedNodeIds, activeFocusNodeId]);

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
      const isLifted = connectedNodeIds !== null && !isDimmed;

      if (
        node.data.isSelected === isSelected &&
        node.data.isDimmed === isDimmed &&
        (node.zIndex === LIFTED_NODE_Z) === isLifted
      ) {
        return node;
      }

      return {
        ...node,
        zIndex: isLifted ? LIFTED_NODE_Z : undefined,
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
      const otherEnd = edge.source === activeFocusNodeId ? edge.target : edge.source;
      const leadsOffScreen =
        isConnectedToFocus && isHubFocus && !onScreenNeighbourIds.has(otherEnd);
      const isHoveredEdge = edge.id === hoveredEdgeId;
      const isHighlighted = (isConnectedToFocus && !leadsOffScreen) || isHoveredEdge;
      const isDimmed =
        !isHighlighted && !leadsOffScreen && (activeFocusNodeId !== null || isFarView);

      const showLabel = showAllEdgeLabels || isHoveredEdge || labelledFocusEdgeIds.has(edge.id);
      const strokeColor = isHighlighted
        ? EDGE_INK.highlighted
        : isDimmed
          ? EDGE_INK.dimmed
          : EDGE_INK.rest;

      return {
        ...edge,
        label: showLabel ? edge.data?.rawLabel : undefined,
        className: isHighlighted ? "is-highlighted" : isDimmed ? "is-dimmed" : undefined,
        zIndex: isHighlighted ? 1 : 0,
        style: {
          stroke: strokeColor,
          strokeWidth: isHighlighted ? 2 : 1,
        },
        labelStyle: {
          fill: isHighlighted ? EDGE_INK.labelHighlighted : EDGE_INK.label,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fontWeight: 400,
        },
        labelBgStyle: {
          fill: EDGE_INK.plate,
        },
        labelBgPadding: [4, 2] as [number, number],
        labelBgBorderRadius: 0,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: strokeColor,
        },
      };
    });
  }, [
    positioned,
    activeFocusNodeId,
    isHubFocus,
    onScreenNeighbourIds,
    labelledFocusEdgeIds,
    hoveredEdgeId,
    showAllEdgeLabels,
    isFarView,
  ]);

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

  const groupNodes = useMemo(
    () =>
      (positioned?.nodes ?? []).filter(
        (node): node is GroupFlowNode => node.type === "categoryGroup",
      ),
    [positioned],
  );

  const ghostCount = useMemo(() => slice.nodes.filter((n) => n.isGhost).length, [slice.nodes]);
  const primaryCount = slice.nodes.length - ghostCount;

  return (
    <div
      className={isFarView ? "graph-canvas graph-canvas--far" : "graph-canvas"}
      onKeyDown={onCanvasKeyDown}
    >
      <div className="graph-canvas__pane">
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
          colorMode="light"
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Lines}
            gap={MODULE_PITCH}
            lineWidth={1}
            color="rgba(17, 17, 17, 0.05)"
          />

          <GroupHeaders groups={groupNodes} />

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

      <footer className="graph-canvas__status">
        <div className="graph-canvas__zoom" role="group" aria-label="Zoom">
          <button
            type="button"
            className="graph-canvas__zoom-btn"
            onClick={() => void zoomOut({ duration: motionDuration(160) })}
            aria-label="Zoom out"
            title="Zoom out"
          >
            <Icon name="minus" />
          </button>
          <button
            type="button"
            className="graph-canvas__zoom-btn"
            onClick={() => void zoomIn({ duration: motionDuration(160) })}
            aria-label="Zoom in"
            title="Zoom in"
          >
            <Icon name="plus" />
          </button>
          <button
            type="button"
            className="graph-canvas__zoom-btn"
            onClick={() => fitOverview(motionDuration(260))}
            aria-label="Fit the whole map in view"
            title="Fit map"
          >
            <Icon name="fit" />
          </button>
        </div>
        <span className="graph-canvas__counts">
          <strong>{primaryCount}</strong> {pluralWord(primaryCount, "node")}
          {ghostCount > 0 ? (
            <>
              {" "}
              + <strong>{ghostCount}</strong> from other maps
            </>
          ) : null}{" "}
          · <strong>{slice.edges.length}</strong> {pluralWord(slice.edges.length, "relation")}
        </span>
        {isLayoutPending ? <span className="graph-canvas__layout-badge">Arranging…</span> : null}
        {hasActiveFilters ? (
          <button type="button" className="graph-canvas__status-btn" onClick={resetFilters}>
            Clear filters <Icon name="close" size={12} />
          </button>
        ) : null}
      </footer>
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
