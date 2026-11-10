import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import type { TechNodeData } from "../content/parse";
import type { MapId } from "../content/schema";

export type ActiveMapTab = MapId | "all";
export type LayoutMode = "layers" | "network";

export interface AppStateValue {
  readonly activeMap: ActiveMapTab;
  readonly layoutMode: LayoutMode;
  readonly selectedNodeId: string | null;
  readonly hoveredNodeId: string | null;
  readonly showAllEdgeLabels: boolean;
  readonly setActiveMap: (map: ActiveMapTab) => void;
  readonly setLayoutMode: (mode: LayoutMode) => void;
  readonly setSelectedNodeId: (nodeId: string | null) => void;
  readonly setHoveredNodeId: (nodeId: string | null) => void;
  readonly toggleShowAllEdgeLabels: () => void;
  readonly handleNodeClick: (node: TechNodeData, isGhost: boolean) => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export interface AppStateProviderProps {
  readonly children: ReactNode;
  readonly initialMap?: ActiveMapTab;
  readonly initialMode?: LayoutMode;
}

export function AppStateProvider({
  children,
  initialMap = "backend",
  initialMode = "layers",
}: AppStateProviderProps) {
  const [activeMap, setActiveMapState] = useState<ActiveMapTab>(initialMap);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(initialMode);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [showAllEdgeLabels, setShowAllEdgeLabels] = useState<boolean>(false);

  const setActiveMap = useCallback((nextMap: ActiveMapTab) => {
    setActiveMapState(nextMap);
    setHoveredNodeId(null);
  }, []);

  const toggleShowAllEdgeLabels = useCallback(() => {
    setShowAllEdgeLabels((prev) => !prev);
  }, []);

  const handleNodeClick = useCallback((node: TechNodeData, isGhost: boolean) => {
    if (isGhost) {
      // Navigate to the ghost node's home map and select it
      setActiveMapState(node.map);
      setSelectedNodeId(node.id);
      setHoveredNodeId(null);
      return;
    }
    setSelectedNodeId((prev) => (prev === node.id ? null : node.id));
  }, []);

  const value = useMemo<AppStateValue>(
    () => ({
      activeMap,
      layoutMode,
      selectedNodeId,
      hoveredNodeId,
      showAllEdgeLabels,
      setActiveMap,
      setLayoutMode,
      setSelectedNodeId,
      setHoveredNodeId,
      toggleShowAllEdgeLabels,
      handleNodeClick,
    }),
    [
      activeMap,
      layoutMode,
      selectedNodeId,
      hoveredNodeId,
      showAllEdgeLabels,
      setActiveMap,
      handleNodeClick,
      toggleShowAllEdgeLabels,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return ctx;
}

