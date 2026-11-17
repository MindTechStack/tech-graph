import { useEffect, useRef } from "react";
import { isNodeDirectlyInMap, type KnowledgeGraph } from "../content/graph";
import { MAP_IDS } from "../content/vocabulary";
import type { ActiveMapTab } from "./useAppState";

export interface ParsedUrlState {
  readonly activeMap: ActiveMapTab;
  readonly selectedNodeId: string | null;
  readonly unknownNodeId?: string;
}

const VALID_MAPS = new Set<string>([...MAP_IDS, "all", "core"]);

export function isValidActiveMap(value: string): value is ActiveMapTab {
  return VALID_MAPS.has(value);
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
    return { ...parsed, selectedNodeId: null, unknownNodeId: parsed.selectedNodeId };
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
 */
export function parseUrlHash(
  rawHash: string,
  defaults: { readonly defaultMap?: ActiveMapTab } = {},
): ParsedUrlState {
  const fallbackMap: ActiveMapTab = defaults.defaultMap ?? "backend";

  const trimmed = rawHash.trim();
  const withoutHash = trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;

  if (!withoutHash || withoutHash === "/") {
    return { activeMap: fallbackMap, selectedNodeId: null };
  }

  const [pathPart = ""] = withoutHash.split("?");
  const segments = pathPart
    .split("/")
    .map((s) => decodeSegment(s.trim()))
    .filter(Boolean);

  const mapCandidate = segments[0] ?? "";
  const activeMap: ActiveMapTab = isValidActiveMap(mapCandidate) ? mapCandidate : fallbackMap;

  const rawNodeId = segments[1] ?? "";
  const selectedNodeId = rawNodeId.length > 0 ? rawNodeId : null;

  return { activeMap, selectedNodeId };
}

/**
 * Formats state into `#/<map>[/<nodeId>]`
 */
export function formatUrlHash(activeMap: ActiveMapTab, selectedNodeId: string | null): string {
  return selectedNodeId
    ? `#/${encodeURIComponent(activeMap)}/${encodeURIComponent(selectedNodeId)}`
    : `#/${encodeURIComponent(activeMap)}`;
}

export type HashUpdate = "none" | "replace" | "push";

export function planHashUpdate(
  currentHash: string,
  state: ParsedUrlState,
  parseHash: (rawHash: string) => ParsedUrlState,
): HashUpdate {
  if (currentHash === formatUrlHash(state.activeMap, state.selectedNodeId)) {
    return "none";
  }
  const current = parseHash(currentHash);
  const urlAlreadyShowsState =
    current.activeMap === state.activeMap && current.selectedNodeId === state.selectedNodeId;
  return urlAlreadyShowsState ? "replace" : "push";
}

export interface UseUrlSyncOptions {
  readonly activeMap: ActiveMapTab;
  readonly selectedNodeId: string | null;
  readonly parseHash: (rawHash: string) => ParsedUrlState;
  readonly onUrlStateChange: (next: ParsedUrlState) => void;
}

/**
 * Two-way synchronization between React state and `window.location.hash`.
 */
export function useUrlSync({
  activeMap,
  selectedNodeId,
  parseHash,
  onUrlStateChange,
}: UseUrlSyncOptions): void {
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
      latestCallbackRef.current(latestParseRef.current(window.location.hash));
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

    const state = { activeMap, selectedNodeId };
    const update = planHashUpdate(window.location.hash, state, latestParseRef.current);
    if (update === "none") {
      return;
    }
    const nextHash = formatUrlHash(activeMap, selectedNodeId);
    if (update === "push") {
      window.history.pushState(null, "", nextHash);
    } else {
      window.history.replaceState(null, "", nextHash);
    }
  }, [activeMap, selectedNodeId]);
}
