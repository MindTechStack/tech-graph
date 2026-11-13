import { useMemo } from "react";
import { CORE_SCOPE_LABEL, isNodeDirectlyInMap, type KnowledgeGraph } from "../content/graph";
import { NODE_STATUSES } from "../content/schema";
import { type ActiveMapTab, useAppState } from "../state/useAppState";
import { Icon } from "./Icon";
import { STATUS_META } from "./TechNode";

const SEARCH_SHORTCUT =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent)
    ? "⌘ K"
    : "Ctrl K";

export interface ToolbarProps {
  readonly graph: KnowledgeGraph;
}

export function Toolbar({ graph }: ToolbarProps) {
  const {
    activeMap,
    layoutMode,
    showAllEdgeLabels,
    hasActiveFilters,
    isSidebarOpen,
    isSearchOpen,
    isErrorPanelOpen,
    setActiveMap,
    setLayoutMode,
    toggleShowAllEdgeLabels,
    setIsSearchOpen,
    toggleSidebar,
    setIsErrorPanelOpen,
  } = useAppState();

  const mapTabs = useMemo(() => {
    const items: Array<{
      readonly id: ActiveMapTab;
      readonly name: string;
      readonly count: number;
    }> = graph.maps.map((m) => ({
      id: m.id,
      name: m.name,
      count: graph.nodes.filter((n) => isNodeDirectlyInMap(n, m.id)).length,
    }));

    items.unshift({
      id: "core",
      name: CORE_SCOPE_LABEL,
      count: graph.nodes.filter((n) => isNodeDirectlyInMap(n, "core")).length,
    });

    items.push({
      id: "all",
      name: "All",
      count: graph.nodes.length,
    });

    return items;
  }, [graph]);

  const errorCount = graph.errors.length;
  const warningCount = graph.warnings.length;

  return (
    <header className="toolbar" inert={isSearchOpen || isErrorPanelOpen}>
      <div className="toolbar__left">
        <button
          type="button"
          className={`toolbar__icon-btn ${isSidebarOpen ? "toolbar__icon-btn--active" : ""}`}
          onClick={toggleSidebar}
          title={isSidebarOpen ? "Hide filters sidebar" : "Show filters sidebar"}
          aria-label="Toggle filters sidebar"
        >
          <Icon name="menu" />
          <span className="toolbar__btn-label">Filters</span>
          {hasActiveFilters ? <span className="toolbar__filter-dot" /> : null}
        </button>

        <div className="toolbar__brand">
          <span className="toolbar__logo">
            <Icon name="graph" size={20} />
          </span>
          <div>
            <h1 className="toolbar__title">Tech Graph</h1>
            <p className="toolbar__subtitle">
              {graph.nodes.length} nodes · {graph.edges.length} relations
            </p>
          </div>
        </div>
      </div>

      <nav className="toolbar__tabs" aria-label="Knowledge maps">
        {mapTabs.map((tab) => {
          const isActive = activeMap === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`toolbar__tab ${isActive ? "toolbar__tab--active" : ""}`}
              aria-current={isActive ? "page" : undefined}
              onClick={() => setActiveMap(tab.id)}
            >
              <span>{tab.name}</span>
              <span className="toolbar__tab-count">{tab.count}</span>
            </button>
          );
        })}
      </nav>

      <div className="toolbar__controls">
        <button
          type="button"
          className="toolbar__search-btn"
          onClick={() => setIsSearchOpen(true)}
          title={`Search nodes (${SEARCH_SHORTCUT})`}
        >
          <Icon name="search" />
          <span>Search…</span>
          <kbd className="toolbar__kbd">{SEARCH_SHORTCUT}</kbd>
        </button>

        <div className="toolbar__segmented" role="group" aria-label="Layout mode">
          <button
            type="button"
            className={`toolbar__segment ${layoutMode === "layers" ? "toolbar__segment--active" : ""}`}
            aria-pressed={layoutMode === "layers"}
            onClick={() => setLayoutMode("layers")}
          >
            Layers
          </button>
          <button
            type="button"
            className={`toolbar__segment ${layoutMode === "network" ? "toolbar__segment--active" : ""}`}
            aria-pressed={layoutMode === "network"}
            onClick={() => setLayoutMode("network")}
          >
            Network
          </button>
        </div>

        <button
          type="button"
          className={`toolbar__toggle ${showAllEdgeLabels ? "toolbar__toggle--active" : ""}`}
          onClick={toggleShowAllEdgeLabels}
          title="Toggle between showing edge labels on hover/selection vs always"
        >
          Labels: {showAllEdgeLabels ? "Always" : "Hover"}
        </button>

        <button
          type="button"
          className={`toolbar__diag-btn ${
            errorCount > 0
              ? "toolbar__diag-btn--error"
              : warningCount > 0
                ? "toolbar__diag-btn--warning"
                : "toolbar__diag-btn--ok"
          }`}
          onClick={() => setIsErrorPanelOpen(true)}
          title="Open content validation diagnostics"
        >
          <Icon name={errorCount + warningCount > 0 ? "alert" : "check"} />
          {errorCount > 0
            ? `${errorCount} err`
            : warningCount > 0
              ? `${warningCount} warn`
              : "Valid"}
        </button>

        <div className="toolbar__legend" aria-label="Status legend">
          {NODE_STATUSES.map((status) => {
            const meta = STATUS_META[status];
            return (
              <span key={status} className="toolbar__legend-item">
                <span
                  className="toolbar__legend-dot"
                  style={{
                    backgroundColor: status === "planned" ? "transparent" : meta.color,
                    borderColor: meta.color,
                    borderStyle: meta.borderStyle,
                  }}
                />
                {meta.label}
              </span>
            );
          })}
        </div>
      </div>
    </header>
  );
}
