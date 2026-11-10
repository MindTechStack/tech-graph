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
import { KIND_ICONS, STATUS_META } from "./TechNode";

export interface SearchModalProps {
  readonly graph: KnowledgeGraph;
}

interface ScoredNode {
  readonly node: TechNodeData;
  readonly score: number;
}

function scoreNodeMatch(node: TechNodeData, rawQuery: string, activeMap: string): number {
  const q = rawQuery.trim().toLowerCase();
  const inActiveMapBonus = activeMap === "all" || node.map === activeMap ? 5 : 0;

  if (!q) {
    return 10 + inActiveMapBonus;
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
  if (nameLower.includes(q) || idLower.includes(q)) {
    return 65 + inActiveMapBonus;
  }
  if (node.tags.some((t) => t.toLowerCase().includes(q))) {
    return 50 + inActiveMapBonus;
  }
  if (catLower.includes(q)) {
    return 40 + inActiveMapBonus;
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
    if (isSearchOpen) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isSearchOpen]);

  const results = useMemo<readonly TechNodeData[]>(() => {
    const scored: ScoredNode[] = [];
    for (const node of graph.nodes) {
      const score = scoreNodeMatch(node, query, activeMap);
      if (score > 0) {
        scored.push({ node, score });
      }
    }
    scored.sort((a, b) => b.score - a.score || a.node.name.localeCompare(b.node.name));
    return scored.slice(0, 25).map((item) => item.node);
  }, [graph.nodes, query, activeMap]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!isSearchOpen) {
    return null;
  }

  const handleSelect = (node: TechNodeData) => {
    navigateToNode(node);
    setIsSearchOpen(false);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
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
          <span className="search-modal__icon" aria-hidden="true">
            🔍
          </span>
          <input
            ref={inputRef}
            type="text"
            className="search-modal__input"
            placeholder="Search by name, tag (#orm), or description…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <kbd className="search-modal__kbd">Esc</kbd>
        </div>

        <div className="search-modal__results" role="listbox">
          {results.length === 0 ? (
            <div className="search-modal__empty">
              No nodes matching <strong>"{query}"</strong>
            </div>
          ) : (
            results.map((node, idx) => {
              const isHighlighted = idx === activeIndex;
              const statusMeta = STATUS_META[node.status];
              const categoryConfig = graph.categoriesByMap.get(node.map)?.get(node.category);

              return (
                <button
                  key={node.id}
                  type="button"
                  role="option"
                  aria-selected={isHighlighted}
                  className={`search-modal__item ${isHighlighted ? "search-modal__item--active" : ""}`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => handleSelect(node)}
                >
                  <div className="search-modal__item-top">
                    <span className="search-modal__item-title">
                      <span>{KIND_ICONS[node.kind]}</span>
                      <strong>{node.name}</strong>
                      <code className="search-modal__item-id">{node.id}</code>
                    </span>

                    <div className="search-modal__item-badges">
                      <span className="search-modal__map-badge">
                        {node.map} / {categoryConfig?.name ?? node.category}
                      </span>
                      <span
                        className="search-modal__status-badge"
                        style={{
                          color: statusMeta.color,
                          backgroundColor: statusMeta.bg,
                          borderColor: statusMeta.color,
                        }}
                      >
                        {statusMeta.label}
                      </span>
                    </div>
                  </div>

                  <p className="search-modal__item-what">{node.what}</p>

                  {node.tags.length > 0 ? (
                    <div className="search-modal__item-tags">
                      {node.tags.map((tag) => (
                        <span key={tag} className="search-modal__tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </button>
              );
            })
          )}
        </div>

        <footer className="search-modal__footer">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> to navigate
          </span>
          <span>
            <kbd>Enter</kbd> to select & focus
          </span>
          <span>
            <kbd>Esc</kbd> to close
          </span>
        </footer>
      </div>
    </div>
  );
}
