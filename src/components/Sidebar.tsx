import { useMemo } from "react";
import {
  CORE_SCOPE_LABEL,
  getNodeCategoryKey,
  isCrossMapScope,
  isNodeDirectlyInMap,
  type KnowledgeGraph,
} from "../content/graph";
import { NODE_KINDS, NODE_STATUSES, type NodeKind, type NodeStatus } from "../content/schema";
import { useAppState } from "../state/useAppState";
import { Icon } from "./Icon";
import { STATUS_META } from "./TechNode";

export interface SidebarProps {
  readonly graph: KnowledgeGraph;
}

interface CategoryStatItem {
  readonly key: string;
  readonly id: string;
  readonly label: string;
  readonly color: string;
  readonly total: number;
  readonly completed: number;
}

function isCompletedStatus(status: NodeStatus): boolean {
  return status === "work" || status === "practiced" || status === "learned";
}

export function Sidebar({ graph }: SidebarProps) {
  const {
    activeMap,
    filters,
    hasActiveFilters,
    isSidebarOpen,
    toggleCategoryFilter,
    toggleStatusFilter,
    toggleKindFilter,
    setIncludeGhosts,
    resetFilters,
    toggleSidebar,
  } = useAppState();

  const mapNodes = useMemo(
    () => graph.nodes.filter((node) => isNodeDirectlyInMap(node, activeMap)),
    [graph.nodes, activeMap],
  );

  const statusCounts = useMemo(() => {
    const counts: Record<NodeStatus, number> = {
      work: 0,
      practiced: 0,
      learned: 0,
      learning: 0,
      planned: 0,
    };
    for (const node of mapNodes) {
      counts[node.status] += 1;
    }
    return counts;
  }, [mapNodes]);

  const kindCounts = useMemo(() => {
    const counts: Record<NodeKind, number> = {
      language: 0,
      framework: 0,
      library: 0,
      tool: 0,
      service: 0,
      concept: 0,
      platform: 0,
    };
    for (const node of mapNodes) {
      counts[node.kind] += 1;
    }
    return counts;
  }, [mapNodes]);

  const categoryStats = useMemo<readonly CategoryStatItem[]>(() => {
    if (isCrossMapScope(activeMap)) {
      const items: CategoryStatItem[] = [];
      for (const mapCfg of graph.maps) {
        for (const cat of mapCfg.categories) {
          const key = `${mapCfg.id}:${cat.id}`;
          const matching = mapNodes.filter((n) => n.map === mapCfg.id && n.category === cat.id);
          if (activeMap === "core" && matching.length === 0) {
            continue;
          }
          const completed = matching.filter((n) => isCompletedStatus(n.status)).length;
          items.push({
            key,
            id: cat.id,
            label: `${mapCfg.name} · ${cat.name}`,
            color: cat.color,
            total: matching.length,
            completed,
          });
        }
      }
      return items;
    }

    const mapCfg = graph.mapsById.get(activeMap);
    if (!mapCfg) {
      return [];
    }

    return mapCfg.categories.map((cat) => {
      const key = cat.id;
      const matching = mapNodes.filter((n) => getNodeCategoryKey(n, activeMap) === key);
      const completed = matching.filter((n) => isCompletedStatus(n.status)).length;
      return {
        key,
        id: cat.id,
        label: cat.name,
        color: cat.color,
        total: matching.length,
        completed,
      };
    });
  }, [activeMap, graph.maps, graph.mapsById, mapNodes]);

  if (!isSidebarOpen) {
    return null;
  }

  const totalNodes = mapNodes.length;
  const completedNodes = statusCounts.work + statusCounts.practiced + statusCounts.learned;
  const completionPct = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

  return (
    <aside className="sidebar" aria-label="Filters and progress">
      <div className="sidebar__header">
        <div>
          <h2 className="sidebar__title">Filters & Progress</h2>
          <p className="sidebar__subtitle">
            {activeMap === "all"
              ? "All Maps"
              : activeMap === "core"
                ? CORE_SCOPE_LABEL
                : (graph.mapsById.get(activeMap)?.name ?? activeMap)}
          </p>
        </div>

        <div className="sidebar__header-actions">
          {hasActiveFilters ? (
            <button
              type="button"
              className="sidebar__reset-btn"
              onClick={resetFilters}
              title="Clear all active filters"
            >
              Reset
            </button>
          ) : null}
          <button
            type="button"
            className="sidebar__collapse-btn"
            onClick={toggleSidebar}
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            ◀
          </button>
        </div>
      </div>

      <div className="sidebar__scroll">
        {/* Progress Summary */}
        <section className="sidebar__section">
          <div className="sidebar__progress-header">
            <span className="sidebar__section-title">Progress</span>
            <span className="sidebar__progress-summary">
              <strong>{completedNodes}</strong> / {totalNodes} ({completionPct}%)
            </span>
          </div>

          <div className="sidebar__progress-bar" aria-label="Status distribution">
            {NODE_STATUSES.map((status) => {
              const count = statusCounts[status];
              if (count === 0 || totalNodes === 0) {
                return null;
              }
              const widthPct = (count / totalNodes) * 100;
              return (
                <div
                  key={status}
                  className="sidebar__progress-segment"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: STATUS_META[status].color,
                  }}
                  title={`${STATUS_META[status].label}: ${count}`}
                />
              );
            })}
          </div>
        </section>

        {/* Status Filters + Legend */}
        <section className="sidebar__section">
          <div className="sidebar__section-header">
            <span className="sidebar__section-title">Status</span>
            {filters.statuses.size > 0 ? (
              <span className="sidebar__active-count">{filters.statuses.size} active</span>
            ) : null}
          </div>

          <div className="sidebar__status-list">
            {NODE_STATUSES.map((status) => {
              const meta = STATUS_META[status];
              const isSelected = filters.statuses.has(status);
              const count = statusCounts[status];
              return (
                <button
                  key={status}
                  type="button"
                  className={`sidebar__filter-row ${isSelected ? "sidebar__filter-row--active" : ""}`}
                  onClick={() => toggleStatusFilter(status)}
                  aria-pressed={isSelected}
                  disabled={count === 0 && !isSelected}
                >
                  <span
                    className="sidebar__status-dot"
                    style={{
                      backgroundColor: status === "planned" ? "transparent" : meta.color,
                      borderColor: meta.color,
                      borderStyle: meta.borderStyle,
                    }}
                  />
                  <span className="sidebar__filter-label">{meta.label}</span>
                  <span className="sidebar__filter-count">{count}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Category Filters + Progress */}
        <section className="sidebar__section">
          <div className="sidebar__section-header">
            <span className="sidebar__section-title">Categories</span>
            {filters.categories.size > 0 ? (
              <span className="sidebar__active-count">{filters.categories.size} active</span>
            ) : null}
          </div>

          <div className="sidebar__category-list">
            {categoryStats.map((cat) => {
              const isSelected = filters.categories.has(cat.key);
              const pct = cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0;
              return (
                <button
                  key={cat.key}
                  type="button"
                  className={`sidebar__category-item ${isSelected ? "sidebar__category-item--active" : ""}`}
                  onClick={() => toggleCategoryFilter(cat.key)}
                  aria-pressed={isSelected}
                  disabled={cat.total === 0 && !isSelected}
                >
                  <div className="sidebar__category-top">
                    <span
                      className="sidebar__category-dot"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="sidebar__category-name">{cat.label}</span>
                    <span className="sidebar__filter-count">
                      {cat.completed}/{cat.total}
                    </span>
                  </div>
                  <div className="sidebar__category-mini-bar">
                    <div
                      className="sidebar__category-mini-fill"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Kind Filters */}
        <section className="sidebar__section">
          <div className="sidebar__section-header">
            <span className="sidebar__section-title">Node Kind</span>
            {filters.kinds.size > 0 ? (
              <span className="sidebar__active-count">{filters.kinds.size} active</span>
            ) : null}
          </div>

          <div className="sidebar__kind-chips">
            {NODE_KINDS.map((kind) => {
              const isSelected = filters.kinds.has(kind);
              const count = kindCounts[kind];
              return (
                <button
                  key={kind}
                  type="button"
                  className={`sidebar__kind-chip ${isSelected ? "sidebar__kind-chip--active" : ""}`}
                  onClick={() => toggleKindFilter(kind)}
                  aria-pressed={isSelected}
                  disabled={count === 0 && !isSelected}
                >
                  <Icon name={kind} />
                  <span>{kind}</span>
                  <span className="sidebar__chip-count">{count}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Cross-map Ghost Nodes Toggle */}
        {!isCrossMapScope(activeMap) ? (
          <section className="sidebar__section">
            <label className="sidebar__checkbox-label">
              <input
                type="checkbox"
                checked={filters.includeGhosts}
                onChange={(e) => setIncludeGhosts(e.target.checked)}
              />
              <span>Show external ghost nodes</span>
            </label>
          </section>
        ) : null}
      </div>
    </aside>
  );
}
