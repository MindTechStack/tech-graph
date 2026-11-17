import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CORE_SCOPE_LABEL, type KnowledgeGraph } from "../content/graph";
import type { TechNodeData } from "../content/parse";
import { useAppState } from "../state/useAppState";
import { NodeRowContent } from "./NodeRow";

export interface SearchModalProps {
  readonly graph: KnowledgeGraph;
}

interface ScoredNode {
  readonly node: TechNodeData;
  readonly score: number;
}

interface ResultSection {
  readonly title: string | null;
  readonly nodes: readonly TechNodeData[];
}

const MAX_RESULTS = 25;
const RESULTS_ID = "search-results";
const RECENT_KEY = "tech-graph:recent-nodes";
const RECENT_LIMIT = 5;

function readRecentIds(): readonly string[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(stored) ? stored.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function useRecentNodeIds(selectedNodeId: string | null): readonly string[] {
  const [recentIds, setRecentIds] = useState(readRecentIds);

  useEffect(() => {
    if (selectedNodeId) {
      setRecentIds((prev) =>
        [selectedNodeId, ...prev.filter((id) => id !== selectedNodeId)].slice(0, RECENT_LIMIT),
      );
    }
  }, [selectedNodeId]);

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recentIds));
    } catch {}
  }, [recentIds]);

  return recentIds;
}

function buildSuggestions(graph: KnowledgeGraph, recentIds: readonly string[]): ResultSection[] {
  const recent = recentIds.flatMap((id) => graph.nodesById.get(id) ?? []);
  const recentIdSet = new Set(recent.map((node) => node.id));
  const mainStack = graph.nodes
    .filter((node) => node.core && !recentIdSet.has(node.id))
    .toSorted((a, b) => a.name.localeCompare(b.name));
  return [
    { title: "Recently opened", nodes: recent },
    { title: CORE_SCOPE_LABEL, nodes: mainStack },
  ].filter((section) => section.nodes.length > 0);
}

function optionId(node: TechNodeData): string {
  return `search-option-${node.id}`;
}

function matchesAtWordStart(text: string, query: string): boolean {
  for (let index = text.indexOf(query); index !== -1; index = text.indexOf(query, index + 1)) {
    if (index === 0 || !/[a-z0-9]/.test(text.charAt(index - 1))) {
      return true;
    }
  }
  return false;
}

export function scoreNodeMatch(node: TechNodeData, rawQuery: string, activeMap: string): number {
  const q = rawQuery.trim().toLowerCase();
  const inActiveMapBonus = activeMap === "all" || node.map === activeMap ? 5 : 0;

  if (!q) {
    return 0;
  }

  if (q.startsWith("#")) {
    const tagQuery = q.slice(1);
    return node.tags.some((t) => t.toLowerCase().startsWith(tagQuery)) ? 50 + inActiveMapBonus : 0;
  }

  const nameLower = node.name.toLowerCase();
  const idLower = node.id.toLowerCase();
  const whatLower = node.what.toLowerCase();
  const catLower = node.category.toLowerCase();

  if (nameLower === q || idLower === q) {
    return 100 + inActiveMapBonus;
  }
  if (nameLower.startsWith(q) || idLower.startsWith(q)) {
    return 80 + inActiveMapBonus;
  }
  const tagsLower = node.tags.map((t) => t.toLowerCase());

  if (matchesAtWordStart(nameLower, q) || matchesAtWordStart(idLower, q)) {
    return 70 + inActiveMapBonus;
  }
  if (tagsLower.some((t) => matchesAtWordStart(t, q))) {
    return 60 + inActiveMapBonus;
  }
  if (nameLower.includes(q) || idLower.includes(q)) {
    return 45 + inActiveMapBonus;
  }
  if (catLower.includes(q)) {
    return 35 + inActiveMapBonus;
  }
  if (matchesAtWordStart(whatLower, q)) {
    return 32 + inActiveMapBonus;
  }
  if (whatLower.includes(q)) {
    return 30 + inActiveMapBonus;
  }

  return 0;
}

export function SearchModal({ graph }: SearchModalProps) {
  const { isSearchOpen, setIsSearchOpen, activeMap, navigateToNode, selectedNodeId } =
    useAppState();
  const recentIds = useRecentNodeIds(selectedNodeId);
  const [query, setQuery] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }
    const previouslyFocused = document.activeElement;
    setQuery("");
    setActiveIndex(0);
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => {
      cancelAnimationFrame(frame);
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [isSearchOpen]);

  const { sections, results, matchCount } = useMemo(() => {
    if (!query.trim()) {
      const suggestions = buildSuggestions(graph, recentIds);
      const suggested = suggestions.flatMap((section) => section.nodes);
      return { sections: suggestions, results: suggested, matchCount: suggested.length };
    }
    const scored: ScoredNode[] = [];
    for (const node of graph.nodes) {
      const score = scoreNodeMatch(node, query, activeMap);
      if (score > 0) {
        scored.push({ node, score });
      }
    }
    scored.sort((a, b) => b.score - a.score || a.node.name.localeCompare(b.node.name));
    if (scored.length === 0) {
      const suggestions = buildSuggestions(graph, recentIds);
      return {
        sections: suggestions,
        results: suggestions.flatMap((section) => section.nodes),
        matchCount: 0,
      };
    }
    const matches = scored.slice(0, MAX_RESULTS).map((item) => item.node);
    return {
      sections: [{ title: null, nodes: matches }],
      results: matches,
      matchCount: scored.length,
    };
  }, [graph, query, activeMap, recentIds]);

  const hasNoMatches = query.trim() !== "" && matchCount === 0;

  useEffect(() => {
    setActiveIndex(hasNoMatches ? -1 : 0);
  }, [query, hasNoMatches]);

  const activeOptionId = results[activeIndex] ? optionId(results[activeIndex]) : undefined;

  useEffect(() => {
    if (activeOptionId) {
      document.getElementById(activeOptionId)?.scrollIntoView({ block: "nearest" });
    }
  }, [activeOptionId]);

  if (!isSearchOpen) {
    return null;
  }

  const renderOption = (node: TechNodeData, idx: number) => {
    const isHighlighted = idx === activeIndex;
    const mapName = graph.mapsById.get(node.map)?.name ?? node.map;

    return (
      <button
        key={node.id}
        id={optionId(node)}
        type="button"
        role="option"
        tabIndex={-1}
        aria-selected={isHighlighted}
        className={`node-row ${isHighlighted ? "node-row--active" : ""}`}
        onMouseMove={() => setActiveIndex(idx)}
        onClick={() => handleSelect(node)}
      >
        <NodeRowContent node={node} mapName={mapName} showTags />
      </button>
    );
  };

  const renderSections = () => {
    let offset = 0;
    return sections.map((section) => {
      const start = offset;
      offset += section.nodes.length;
      const options = section.nodes.map((node, i) => renderOption(node, start + i));
      if (!section.title) {
        return options;
      }
      const headId = `${RESULTS_ID}-${start}`;
      return (
        <div key={section.title} role="group" aria-labelledby={headId}>
          <div id={headId} role="presentation" className="search-modal__section-head">
            {section.title}
          </div>
          {options}
        </div>
      );
    });
  };

  const handleSelect = (node: TechNodeData) => {
    navigateToNode(node);
    setIsSearchOpen(false);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (results.length > 0) {
        setActiveIndex((prev) => (prev + 1) % results.length);
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (results.length > 0) {
        setActiveIndex((prev) => (prev <= 0 ? results.length : prev) - 1);
      }
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const target = results[activeIndex];
      if (target) {
        handleSelect(target);
      }
    }
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Search nodes"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          setIsSearchOpen(false);
        }
      }}
    >
      <div className="search-modal">
        <div className="search-modal__input-row">
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-label="Search nodes"
            aria-expanded={results.length > 0}
            aria-controls={RESULTS_ID}
            aria-autocomplete="list"
            aria-activedescendant={activeOptionId}
            autoComplete="off"
            spellCheck={false}
            className="search-modal__input"
            placeholder="Name, #tag, or description…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="search-modal__close"
            onClick={() => setIsSearchOpen(false)}
          >
            Cancel
          </button>
        </div>

        <div className="search-modal__results" id={RESULTS_ID} role="listbox">
          {hasNoMatches ? (
            <div className="search-modal__empty">
              <p>
                No nodes match <strong>"{query.trim()}"</strong>. Try part of a name or a #tag
                {results.length > 0 ? ", or open one of the topics below" : ""}.
              </p>
              <button
                type="button"
                className="search-modal__clear"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
              >
                Clear search
              </button>
            </div>
          ) : null}
          {results.length > 0 ? (
            renderSections()
          ) : query.trim() ? null : (
            <div className="search-modal__empty">No nodes loaded.</div>
          )}
          {matchCount > results.length ? (
            <p className="search-modal__more">
              Showing {results.length} of {matchCount}. Keep typing to narrow it down.
            </p>
          ) : null}
        </div>

        <footer className="search-modal__footer">
          <span>
            <kbd>↑ ↓</kbd> move
          </span>
          <span>
            <kbd>Enter</kbd> open
          </span>
          <span>
            <kbd>Esc</kbd> close
          </span>
        </footer>
      </div>
    </div>
  );
}
