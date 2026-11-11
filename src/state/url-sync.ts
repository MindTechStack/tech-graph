import { useEffect, useRef } from "react";
import { isNodeDirectlyInMap, type KnowledgeGraph } from "../content/graph";
import { MAP_IDS } from "../content/schema";
import type { ActiveMapTab, LayoutMode } from "./useAppState";

export interface ParsedUrlState {
  readonly activeMap: ActiveMapTab;
  readonly selectedNodeId: string | null;
  readonly layoutMode: LayoutMode;
}

const VALID_MAPS = new Set<string>([...MAP_IDS, "all"]);
const VALID_MODES = new Set<string>(["layers", "network"]);

export function isValidActiveMap(value: string): value is ActiveMapTab {
  return VALID_MAPS.has(value);
}

export function isValidLayoutMode(value: string): value is LayoutMode {
  return VALID_MODES.has(value);
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function resolveDeepLink(parsed: ParsedUrlState, graph: KnowledgeGraph): ParsedUrlState {
  if (!parsed.selectedNodeId) {
    return parsed;
  }
  const node = graph.nodesById.get(parsed.selectedNodeId);
  if (!node) {
    return { ...parsed, selectedNodeId: null };
  }
  if (isNodeDirectlyInMap(node, parsed.activeMap)) {
    return parsed;
  }
  return { ...parsed, activeMap: node.map };
}

/**
 * Parses URL hashes like:
 * - `#/backend`
 * - `#/backend/express`
 * - `#/backend/express?mode=network`
 * - `#/all?mode=layers`
 */
export function parseUrlHash(
  rawHash: string,
  defaults: {
    readonly defaultMap?: ActiveMapTab;
    readonly defaultMode?: LayoutMode;
  } = {},
): ParsedUrlState {
  const fallbackMap: ActiveMapTab = defaults.defaultMap ?? "backend";
  const fallbackMode: LayoutMode = defaults.defaultMode ?? "layers";

  const trimmed = rawHash.trim();
  const withoutHash = trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;

  if (!withoutHash || withoutHash === "/") {
    return {
      activeMap: fallbackMap,
      selectedNodeId: null,
      layoutMode: fallbackMode,
    };
  }

  const [pathPart = "", queryPart = ""] = withoutHash.split("?");
  const segments = pathPart
    .split("/")
    .map((s) => decodeSegment(s.trim()))
    .filter(Boolean);

  const mapCandidate = segments[0] ?? "";
  const activeMap: ActiveMapTab = isValidActiveMap(mapCandidate) ? mapCandidate : fallbackMap;

  const rawNodeId = segments[1] ?? "";
  const selectedNodeId = rawNodeId.length > 0 ? rawNodeId : null;

  let layoutMode: LayoutMode = fallbackMode;
  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    const modeParam = params.get("mode");
    if (modeParam && isValidLayoutMode(modeParam)) {
      layoutMode = modeParam;
    }
  }

  return {
    activeMap,
    selectedNodeId,
    layoutMode,
  };
}

/**
 * Formats state into `#/<map>[/<nodeId>]?mode=<layoutMode>`
 */
export function formatUrlHash(
  activeMap: ActiveMapTab,
  selectedNodeId: string | null,
  layoutMode: LayoutMode,
): string {
  const path = selectedNodeId
    ? `#/${encodeURIComponent(activeMap)}/${encodeURIComponent(selectedNodeId)}`
    : `#/${encodeURIComponent(activeMap)}`;
  return `${path}?mode=${encodeURIComponent(layoutMode)}`;
}

export interface UseUrlSyncOptions {
  readonly activeMap: ActiveMapTab;
  readonly selectedNodeId: string | null;
  readonly layoutMode: LayoutMode;
  readonly parseHash: (rawHash: string) => ParsedUrlState;
  readonly onUrlStateChange: (next: ParsedUrlState) => void;
}

/**
 * Two-way synchronization between React state and `window.location.hash`.
 */
export function useUrlSync({
  activeMap,
  selectedNodeId,
  layoutMode,
  parseHash,
  onUrlStateChange,
}: UseUrlSyncOptions): void {
  const isApplyingFromHashRef = useRef(false);
  const latestCallbackRef = useRef(onUrlStateChange);
  latestCallbackRef.current = onUrlStateChange;
  const latestParseRef = useRef(parseHash);
  latestParseRef.current = parseHash;

  // Listen to browser Back/Forward or manual hash edits
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleHashChange = () => {
      const parsed = latestParseRef.current(window.location.hash);
      isApplyingFromHashRef.current = true;
      latestCallbackRef.current(parsed);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Push state updates into URL hash
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const nextHash = formatUrlHash(activeMap, selectedNodeId, layoutMode);
    if (window.location.hash === nextHash) {
      isApplyingFromHashRef.current = false;
      return;
    }

    if (isApplyingFromHashRef.current) {
      isApplyingFromHashRef.current = false;
      return;
    }

    window.history.replaceState(null, "", nextHash);
  }, [activeMap, selectedNodeId, layoutMode]);
}
