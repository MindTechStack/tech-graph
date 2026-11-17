import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { KnowledgeGraph } from "../content/graph";
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

const MAX_RESULTS = 25;
const RESULTS_ID = "search-results";

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
    return 10 + inActiveMapBonus;
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
  if (tagsLower.some((t) => t.includes(q))) {
    return 40 + inActiveMapBonus;
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
  const { isSearchOpen, setIsSearchOpen, activeMap, navigateToNode } = useAppState();
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

  const { results, matchCount } = useMemo(() => {
    const scored: ScoredNode[] = [];
    for (const node of graph.nodes) {
      const score = scoreNodeMatch(node, query, activeMap);
      if (score > 0) {
        scored.push({ node, score });
      }
    }
    scored.sort((a, b) => b.score - a.score || a.node.name.localeCompare(b.node.name));
    return {
      results: scored.slice(0, MAX_RESULTS).map((item) => item.node),
      matchCount: scored.length,
    };
  }, [graph.nodes, query, activeMap]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const activeOptionId = results[activeIndex] ? optionId(results[activeIndex]) : undefined;

  useEffect(() => {
    if (activeOptionId) {
      document.getElementById(activeOptionId)?.scrollIntoView({ block: "nearest" });
    }
  }, [activeOptionId]);

  if (!isSearchOpen) {
    return null;
  }

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
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
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
          {results.length === 0 ? (
            <div className="search-modal__empty">
              {query.trim() ? (
                <>
                  No nodes match <strong>"{query.trim()}"</strong>. Try part of a name or a tag.
                </>
              ) : (
                "No nodes loaded."
              )}
            </div>
          ) : (
            results.map((node, idx) => {
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
            })
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
