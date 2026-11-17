import { useEffect, useMemo, useRef } from "react";
import { CORE_SCOPE_LABEL, isNodeDirectlyInMap, type KnowledgeGraph } from "../content/graph";
import { type ActiveMapTab, useAppState } from "../state/useAppState";
import { Icon } from "./Icon";
import { useIsPhoneCardOpen } from "./PhoneIndex";

const SEARCH_SHORTCUT =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent)
    ? "⌘ K"
    : "Ctrl K";

function countLabel(count: number, noun: string): string {
  return `${count} ${count === 1 ? noun : `${noun}s`}`;
}

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
    isPhoneMapShown,
    setActiveMap,
    setLayoutMode,
    toggleShowAllEdgeLabels,
    setIsSearchOpen,
    toggleSidebar,
    setIsErrorPanelOpen,
    setIsPhoneMapShown,
  } = useAppState();
  const isPhoneCardOpen = useIsPhoneCardOpen();

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

  const tabStripRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const strip = tabStripRef.current;
    if (!strip) {
      return;
    }
    const markHiddenEdges = () => {
      strip.dataset.hiddenStart = String(strip.scrollLeft > 1);
      strip.dataset.hiddenEnd = String(
        strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 1,
      );
    };
    markHiddenEdges();
    void document.fonts.ready.then(markHiddenEdges);
    strip.addEventListener("scroll", markHiddenEdges, { passive: true });
    const resizeObserver = new ResizeObserver(markHiddenEdges);
    resizeObserver.observe(strip);
    return () => {
      strip.removeEventListener("scroll", markHiddenEdges);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const revealActiveTab = () =>
      tabStripRef.current
        ?.querySelector('[aria-current="page"]')
        ?.scrollIntoView({ block: "nearest", inline: "nearest" });
    revealActiveTab();
    void document.fonts.ready.then(revealActiveTab);
  }, [activeMap]);

  const errorCount = graph.errors.length;
  const warningCount = graph.warnings.length;

  return (
    <header className="toolbar" inert={isSearchOpen || isErrorPanelOpen || isPhoneCardOpen}>
      <div className="toolbar__left">
        <button
          id="filters-toggle"
          type="button"
          className={`toolbar__icon-btn ${isSidebarOpen ? "toolbar__icon-btn--active" : ""}`}
          onClick={toggleSidebar}
          title={isSidebarOpen ? "Hide filters sidebar" : "Show filters sidebar"}
          aria-label={hasActiveFilters ? "Filters, some active" : "Filters"}
          aria-expanded={isSidebarOpen}
          aria-controls={isSidebarOpen ? "filters-sidebar" : undefined}
        >
          <Icon name="menu" />
          <span className="toolbar__btn-label">Filters</span>
          {hasActiveFilters ? <span className="toolbar__filter-dot" aria-hidden="true" /> : null}
        </button>

        <div className="toolbar__brand">
          <h1 className="toolbar__title">Tech Graph</h1>
          <p className="toolbar__subtitle">
            {graph.nodes.length} nodes · {graph.edges.length} relations
          </p>
        </div>
      </div>

      <nav ref={tabStripRef} className="toolbar__tabs" aria-label="Knowledge maps">
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
          className="toolbar__icon-btn toolbar__map-toggle"
          aria-pressed={isPhoneMapShown}
          onClick={() => setIsPhoneMapShown(!isPhoneMapShown)}
          title={isPhoneMapShown ? "Back to the node list" : "Show the graph"}
        >
          <Icon name="graph" />
          Map
        </button>

        <button
          type="button"
          className="toolbar__search-btn"
          onClick={() => setIsSearchOpen(true)}
          title={`Search nodes (${SEARCH_SHORTCUT})`}
          aria-haspopup="dialog"
        >
          <Icon name="search" />
          <span>Search</span>
          <kbd className="toolbar__kbd">{SEARCH_SHORTCUT}</kbd>
        </button>

        {import.meta.env.DEV ? (
          <div className="toolbar__segmented" role="group" aria-label="Arrange nodes">
            <button
              type="button"
              className={`toolbar__segment ${layoutMode === "grouped" ? "toolbar__segment--active" : ""}`}
              aria-pressed={layoutMode === "grouped"}
              onClick={() => setLayoutMode("grouped")}
            >
              Grouped
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
        ) : null}

        <button
          type="button"
          className="toolbar__toggle"
          aria-pressed={showAllEdgeLabels}
          onClick={toggleShowAllEdgeLabels}
          aria-label="Always show edge labels"
          title={
            showAllEdgeLabels
              ? "Edge labels always shown. Click to show them only on hover and selection"
              : "Edge labels shown on hover and selection. Click to always show them"
          }
        >
          Edge labels{" "}
          <span className="toolbar__toggle-value" aria-hidden="true">
            {showAllEdgeLabels ? "always" : "on hover"}
          </span>
        </button>

        {import.meta.env.DEV ? (
          <button
            type="button"
            className={`toolbar__diag-btn ${errorCount > 0 ? "toolbar__diag-btn--error" : ""}`}
            onClick={() => setIsErrorPanelOpen(true)}
            title="Open content validation diagnostics"
          >
            {errorCount > 0
              ? countLabel(errorCount, "error")
              : warningCount > 0
                ? countLabel(warningCount, "warning")
                : "0 issues"}
          </button>
        ) : null}
      </div>
    </header>
  );
}
