import { useMemo } from "react";
import { isNodeDirectlyInMap, type KnowledgeGraph } from "../content/graph";
import { NODE_STATUSES } from "../content/schema";
import { type ActiveMapTab, useAppState } from "../state/useAppState";
import { STATUS_META } from "./TechNode";

export interface ToolbarProps {
  readonly graph: KnowledgeGraph;
}

export function Toolbar({ graph }: ToolbarProps) {
  const {
    activeMap,
    layoutMode,
    showAllEdgeLabels,
    setActiveMap,
    setLayoutMode,
    toggleShowAllEdgeLabels,
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

    items.push({
      id: "all",
      name: "All",
      count: graph.nodes.length,
    });

    return items;
  }, [graph]);

  return (
    <header className="toolbar">
      <div className="toolbar__brand">
        <span className="toolbar__logo" aria-hidden="true">
          🕸️
        </span>
        <div>
          <h1 className="toolbar__title">Tech Graph</h1>
          <p className="toolbar__subtitle">
            {graph.nodes.length} nodes · {graph.edges.length} relations
          </p>
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
              onClick={() => setActiveMap(tab.id)}
            >
              <span>{tab.name}</span>
              <span className="toolbar__tab-count">{tab.count}</span>
            </button>
          );
        })}
      </nav>

      <div className="toolbar__controls">
        <div className="toolbar__segmented" role="group" aria-label="Layout mode">
          <button
            type="button"
            className={`toolbar__segment ${layoutMode === "layers" ? "toolbar__segment--active" : ""}`}
            onClick={() => setLayoutMode("layers")}
          >
            Layers
          </button>
          <button
            type="button"
            className={`toolbar__segment ${layoutMode === "network" ? "toolbar__segment--active" : ""}`}
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

