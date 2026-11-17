import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type GraphFilterCriteria, isNodeDirectlyInMap, type MapScope } from "../content/graph";
import type { TechNodeData } from "../content/parse";
import type { NodeKind, NodeStatus } from "../content/schema";
import { type ParsedUrlState, parseUrlHash, useUrlSync } from "./url-sync";

export type ActiveMapTab = MapScope;

export interface FocusRequest {
  readonly nodeId: string;
  readonly seq: number;
}

export interface AppStateValue {
  readonly activeMap: ActiveMapTab;
  readonly selectedNodeId: string | null;
  readonly hoveredNodeId: string | null;
  readonly showAllEdgeLabels: boolean;
  readonly filters: Required<GraphFilterCriteria>;
  readonly hasActiveFilters: boolean;
  readonly focusRequest: FocusRequest | null;
  readonly isSearchOpen: boolean;
  readonly isSidebarOpen: boolean;
  readonly isErrorPanelOpen: boolean;
  readonly isPhoneMapShown: boolean;
  readonly unknownNodeId: string | null;
  readonly setActiveMap: (map: ActiveMapTab) => void;
  readonly setSelectedNodeId: (nodeId: string | null) => void;
  readonly setHoveredNodeId: (nodeId: string | null) => void;
  readonly toggleShowAllEdgeLabels: () => void;
  readonly toggleCategoryFilter: (categoryKey: string) => void;
  readonly toggleStatusFilter: (status: NodeStatus) => void;
  readonly toggleKindFilter: (kind: NodeKind) => void;
  readonly setIncludeGhosts: (include: boolean) => void;
  readonly resetFilters: () => void;
  readonly handleNodeClick: (node: TechNodeData, isGhost: boolean) => void;
  readonly navigateToNode: (node: TechNodeData) => void;
  readonly requestCenterNode: (nodeId: string) => void;
  readonly setIsSearchOpen: (open: boolean) => void;
  readonly toggleSidebar: () => void;
  readonly setIsErrorPanelOpen: (open: boolean) => void;
  readonly setIsPhoneMapShown: (shown: boolean) => void;
  readonly dismissUnknownNode: () => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export interface AppStateProviderProps {
  readonly children: ReactNode;
  readonly initialMap?: ActiveMapTab;
  readonly hasInitialErrors?: boolean;
  readonly resolveUrlState?: (parsed: ParsedUrlState) => ParsedUrlState;
}

function isSidebarWide(): boolean {
  return typeof window === "undefined" || window.matchMedia("(min-width: 1025px)").matches;
}

function isCanvasTightBesideCard(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 1679px)").matches;
}

function toggleSetItem<T>(set: ReadonlySet<T>, item: T): ReadonlySet<T> {
  const next = new Set(set);
  if (next.has(item)) {
    next.delete(item);
  } else {
    next.add(item);
  }
  return next;
}

export function AppStateProvider({
  children,
  initialMap = "backend",
  hasInitialErrors = false,
  resolveUrlState,
}: AppStateProviderProps) {
  const parseHash = useCallback(
    (rawHash: string) => {
      const parsed = parseUrlHash(rawHash, { defaultMap: initialMap });
      return resolveUrlState ? resolveUrlState(parsed) : parsed;
    },
    [initialMap, resolveUrlState],
  );

  const initialFromUrl = useMemo<ParsedUrlState>(() => {
    if (typeof window === "undefined") {
      return { activeMap: initialMap, selectedNodeId: null };
    }
    return parseHash(window.location.hash);
  }, [initialMap, parseHash]);

  const [activeMap, setActiveMapState] = useState<ActiveMapTab>(initialFromUrl.activeMap);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    initialFromUrl.selectedNodeId,
  );
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [showAllEdgeLabels, setShowAllEdgeLabels] = useState<boolean>(false);

  const [categories, setCategories] = useState<ReadonlySet<string>>(() => new Set());
  const [statuses, setStatuses] = useState<ReadonlySet<NodeStatus>>(() => new Set());
  const [kinds, setKinds] = useState<ReadonlySet<NodeKind>>(() => new Set());
  const [includeGhosts, setIncludeGhosts] = useState<boolean>(true);

  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(() =>
    initialFromUrl.selectedNodeId ? { nodeId: initialFromUrl.selectedNodeId, seq: 1 } : null,
  );

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const isCardOpen = selectedNodeId !== null;
  const [isSidebarAutoCollapsed, setIsSidebarAutoCollapsed] = useState<boolean>(
    () => isCardOpen && isSidebarWide() && isCanvasTightBesideCard(),
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(
    () => isSidebarWide() && !isSidebarAutoCollapsed && initialFromUrl.activeMap !== "core",
  );
  const [wasCardOpen, setWasCardOpen] = useState<boolean>(isCardOpen);
  if (isCardOpen !== wasCardOpen) {
    setWasCardOpen(isCardOpen);
    if (isCardOpen && isSidebarOpen && isCanvasTightBesideCard()) {
      setIsSidebarOpen(false);
      setIsSidebarAutoCollapsed(true);
    } else if (!isCardOpen && isSidebarAutoCollapsed) {
      setIsSidebarOpen(true);
      setIsSidebarAutoCollapsed(false);
    }
  }
  const [isErrorPanelOpen, setIsErrorPanelOpen] = useState<boolean>(hasInitialErrors);
  const [isPhoneMapShown, setIsPhoneMapShown] = useState<boolean>(false);
  const [unknownNodeId, setUnknownNodeId] = useState<string | null>(
    initialFromUrl.unknownNodeId ?? null,
  );

  const requestCenterNode = useCallback((nodeId: string) => {
    setFocusRequest((prev) => ({
      nodeId,
      seq: (prev?.seq ?? 0) + 1,
    }));
  }, []);

  const handleUrlStateChange = useCallback(
    (next: ParsedUrlState) => {
      setActiveMapState((prevMap) => {
        if (prevMap !== next.activeMap) {
          setCategories(new Set());
        }
        return next.activeMap;
      });
      setSelectedNodeId(next.selectedNodeId);
      setUnknownNodeId(next.unknownNodeId ?? null);
      if (next.selectedNodeId) {
        requestCenterNode(next.selectedNodeId);
      }
    },
    [requestCenterNode],
  );

  useUrlSync({
    activeMap,
    selectedNodeId,
    parseHash,
    onUrlStateChange: handleUrlStateChange,
  });

  // Global keyboard shortcuts: Ctrl+K / Cmd+K for search, Escape to close active overlay
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing) {
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }

      if (event.key === "Escape") {
        if (isSearchOpen) {
          setIsSearchOpen(false);
          return;
        }
        if (isErrorPanelOpen) {
          setIsErrorPanelOpen(false);
          return;
        }
        if (selectedNodeId) {
          setSelectedNodeId(null);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isSearchOpen, isErrorPanelOpen, selectedNodeId]);

  const setActiveMap = useCallback((nextMap: ActiveMapTab) => {
    setActiveMapState((prev) => {
      if (prev !== nextMap) {
        setCategories(new Set());
      }
      return nextMap;
    });
    setHoveredNodeId(null);
  }, []);

  const toggleShowAllEdgeLabels = useCallback(() => {
    setShowAllEdgeLabels((prev) => !prev);
  }, []);

  const toggleCategoryFilter = useCallback((categoryKey: string) => {
    setCategories((prev) => toggleSetItem(prev, categoryKey));
  }, []);

  const toggleStatusFilter = useCallback((status: NodeStatus) => {
    setStatuses((prev) => toggleSetItem(prev, status));
  }, []);

  const toggleKindFilter = useCallback((kind: NodeKind) => {
    setKinds((prev) => toggleSetItem(prev, kind));
  }, []);

  const resetFilters = useCallback(() => {
    setCategories(new Set());
    setStatuses(new Set());
    setKinds(new Set());
    setIncludeGhosts(true);
  }, []);

  const handleNodeClick = useCallback(
    (node: TechNodeData, isGhost: boolean) => {
      if (isGhost) {
        setActiveMapState((prev) => {
          if (prev !== node.map) {
            setCategories(new Set());
          }
          return node.map;
        });
        setSelectedNodeId(node.id);
        setHoveredNodeId(null);
        requestCenterNode(node.id);
        return;
      }
      setSelectedNodeId((prev) => (prev === node.id ? null : node.id));
    },
    [requestCenterNode],
  );

  const navigateToNode = useCallback(
    (node: TechNodeData) => {
      setActiveMapState((prev) => {
        if (isNodeDirectlyInMap(node, prev)) {
          return prev;
        }
        setCategories(new Set());
        return node.map;
      });
      // Ensure filters don't hide the target node when explicitly navigating to it
      setCategories((prev) => {
        if (prev.size === 0) {
          return prev;
        }
        return new Set();
      });
      setStatuses((prev) => (prev.size > 0 && !prev.has(node.status) ? new Set() : prev));
      setKinds((prev) => (prev.size > 0 && !prev.has(node.kind) ? new Set() : prev));
      setSelectedNodeId(node.id);
      setHoveredNodeId(null);
      requestCenterNode(node.id);
    },
    [requestCenterNode],
  );

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
    setIsSidebarAutoCollapsed(false);
  }, []);

  const dismissUnknownNode = useCallback(() => setUnknownNodeId(null), []);

  const filters = useMemo<Required<GraphFilterCriteria>>(
    () => ({
      categories,
      statuses,
      kinds,
      includeGhosts,
    }),
    [categories, statuses, kinds, includeGhosts],
  );

  const hasActiveFilters =
    categories.size > 0 || statuses.size > 0 || kinds.size > 0 || !includeGhosts;

  const value = useMemo<AppStateValue>(
    () => ({
      activeMap,
      selectedNodeId,
      hoveredNodeId,
      showAllEdgeLabels,
      filters,
      hasActiveFilters,
      focusRequest,
      isSearchOpen,
      isSidebarOpen,
      isErrorPanelOpen,
      isPhoneMapShown,
      unknownNodeId,
      setActiveMap,
      setSelectedNodeId,
      setHoveredNodeId,
      toggleShowAllEdgeLabels,
      toggleCategoryFilter,
      toggleStatusFilter,
      toggleKindFilter,
      setIncludeGhosts,
      resetFilters,
      handleNodeClick,
      navigateToNode,
      requestCenterNode,
      setIsSearchOpen,
      toggleSidebar,
      setIsErrorPanelOpen,
      setIsPhoneMapShown,
      dismissUnknownNode,
    }),
    [
      activeMap,
      selectedNodeId,
      hoveredNodeId,
      showAllEdgeLabels,
      filters,
      hasActiveFilters,
      focusRequest,
      isSearchOpen,
      isSidebarOpen,
      isErrorPanelOpen,
      isPhoneMapShown,
      unknownNodeId,
      setActiveMap,
      toggleShowAllEdgeLabels,
      toggleCategoryFilter,
      toggleStatusFilter,
      toggleKindFilter,
      resetFilters,
      handleNodeClick,
      navigateToNode,
      requestCenterNode,
      toggleSidebar,
      dismissUnknownNode,
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
