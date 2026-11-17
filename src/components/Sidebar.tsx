import { type CSSProperties, useMemo } from "react";
import {
  CORE_SCOPE_LABEL,
  getNodeCategoryKey,
  isCrossMapScope,
  isNodeDirectlyInMap,
  type KnowledgeGraph,
} from "../content/graph";
import type { NodeKind, NodeStatus } from "../content/schema";
import { NODE_KINDS, NODE_STATUSES } from "../content/vocabulary";
import { useAppState } from "../state/useAppState";
import { Icon } from "./Icon";
import { useIsPhoneCardOpen } from "./PhoneIndex";
import { STATUS_META, StatusSwatch } from "./Status";

export interface SidebarProps {
  readonly graph: KnowledgeGraph;
}

interface CategoryGroup {
  readonly mapId: string;
  readonly mapName: string | null;
  readonly items: readonly CategoryStatItem[];
}

interface CategoryStatItem {
  readonly key: string;
  readonly id: string;
  readonly label: string;
  readonly color: string;
  readonly total: number;
  readonly statusCounts: Record<NodeStatus, number>;
}

function countByStatus(nodes: readonly { readonly status: NodeStatus }[]) {
  const counts: Record<NodeStatus, number> = {
    work: 0,
    practiced: 0,
    learned: 0,
    learning: 0,
    planned: 0,
  };
  for (const node of nodes) {
    counts[node.status] += 1;
  }
  return counts;
}

function statusSegments(counts: Record<NodeStatus, number>) {
  return NODE_STATUSES.filter((status) => counts[status] > 0).map((status) => (
    <span
      key={status}
      className={`sidebar__progress-segment status-fill--${status}`}
      style={{ flexGrow: counts[status] }}
      title={`${STATUS_META[status].label}: ${counts[status]}`}
    />
  ));
}

export function Sidebar({ graph }: SidebarProps) {
  const {
    activeMap,
    filters,
    hasActiveFilters,
    isSidebarOpen,
    showAllEdgeLabels,
    toggleShowAllEdgeLabels,
    toggleCategoryFilter,
    toggleStatusFilter,
    toggleKindFilter,
    setIncludeGhosts,
    resetFilters,
    toggleSidebar,
  } = useAppState();
  const isPhoneCardOpen = useIsPhoneCardOpen();

  const mapNodes = useMemo(
    () => graph.nodes.filter((node) => isNodeDirectlyInMap(node, activeMap)),
    [graph.nodes, activeMap],
  );

  const statusCounts = useMemo(() => countByStatus(mapNodes), [mapNodes]);
  const allMapsStatusCounts = useMemo(() => countByStatus(graph.nodes), [graph.nodes]);
  const isAllMapsScope = activeMap === "all";

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

  const categoryGroups = useMemo<readonly CategoryGroup[]>(() => {
    if (isCrossMapScope(activeMap)) {
      const groups: CategoryGroup[] = [];
      for (const mapCfg of graph.maps) {
        const items: CategoryStatItem[] = [];
        for (const cat of mapCfg.categories) {
          const key = `${mapCfg.id}:${cat.id}`;
          const matching = mapNodes.filter((n) => n.map === mapCfg.id && n.category === cat.id);
          if (activeMap === "core" && matching.length === 0) {
            continue;
          }
          items.push({
            key,
            id: cat.id,
            label: cat.name,
            color: cat.color,
            total: matching.length,
            statusCounts: countByStatus(matching),
          });
        }
        if (items.length > 0) {
          groups.push({ mapId: mapCfg.id, mapName: mapCfg.name, items });
        }
      }
      return groups;
    }

    const mapCfg = graph.mapsById.get(activeMap);
    if (!mapCfg) {
      return [];
    }

    const items = mapCfg.categories.map((cat) => {
      const key = cat.id;
      const matching = mapNodes.filter((n) => getNodeCategoryKey(n, activeMap) === key);
      return {
        key,
        id: cat.id,
        label: cat.name,
        color: cat.color,
        total: matching.length,
        statusCounts: countByStatus(matching),
      };
    });
    return [{ mapId: mapCfg.id, mapName: null, items }];
  }, [activeMap, graph.maps, graph.mapsById, mapNodes]);

  const largestCategoryTotal = Math.max(
    0,
    ...categoryGroups.flatMap((group) => group.items.map((cat) => cat.total)),
  );

  if (!isSidebarOpen) {
    return null;
  }

  const statusBreakdown = NODE_STATUSES.filter((status) => statusCounts[status] > 0)
    .map((status) => `${statusCounts[status]} ${STATUS_META[status].countPhrase}`)
    .join(" · ");
  const scopeName =
    activeMap === "all"
      ? "All maps"
      : activeMap === "core"
        ? CORE_SCOPE_LABEL
        : (graph.mapsById.get(activeMap)?.name ?? activeMap);

  return (
    <aside
      id="filters-sidebar"
      className="sidebar"
      aria-label="Filters and progress"
      inert={isPhoneCardOpen}
    >
      <div className="sidebar__header">
        <h2 className="sidebar__title">{scopeName}</h2>
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
          onClick={() => {
            toggleSidebar();
            document.getElementById("filters-toggle")?.focus();
          }}
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
        >
          <Icon name="collapse" />
        </button>
      </div>

      <div className="sidebar__scroll">
        <section className="sidebar__section" aria-labelledby="sidebar-status">
          <div className="sidebar__section-header">
            <h3 id="sidebar-status" className="sidebar__section-title">
              Status
            </h3>
            {filters.statuses.size > 0 ? (
              <span className="sidebar__active-count">{filters.statuses.size} active</span>
            ) : null}
          </div>

          <div className="sidebar__rows">
            {NODE_STATUSES.map((status) => {
              const meta = STATUS_META[status];
              const isSelected = filters.statuses.has(status);
              const count = statusCounts[status];
              return (
                <button
                  key={status}
                  type="button"
                  className={`sidebar__filter-row sidebar__filter-row--status ${isSelected ? "sidebar__filter-row--active" : ""}`}
                  onClick={() => toggleStatusFilter(status)}
                  aria-pressed={isSelected}
                  disabled={count === 0 && !isSelected}
                >
                  <StatusSwatch status={status} />
                  <span className="sidebar__filter-label">
                    <span className="sidebar__status-name">{meta.label}</span>
                    <span className="sidebar__status-definition">{meta.definition}</span>
                  </span>
                  <span className="sidebar__filter-count">
                    <span className="sidebar__filter-count-scope">{count}</span>
                    {isAllMapsScope ? null : (
                      <span
                        className="sidebar__filter-count-all"
                        title={`${allMapsStatusCounts[status]} across all maps`}
                      >
                        {" "}
                        of {allMapsStatusCounts[status]}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="sidebar__section" aria-labelledby="sidebar-categories">
          <div className="sidebar__section-header">
            <h3 id="sidebar-categories" className="sidebar__section-title">
              Categories
            </h3>
            {filters.categories.size > 0 ? (
              <span className="sidebar__active-count">{filters.categories.size} active</span>
            ) : null}
          </div>

          {categoryGroups.map((group) => {
            const headId = `sidebar-categories-${group.mapId}`;
            return (
              <div
                key={group.mapId}
                className="sidebar__rows"
                role={group.mapName ? "group" : undefined}
                aria-labelledby={group.mapName ? headId : undefined}
              >
                {group.mapName ? (
                  <h4 id={headId} className="sidebar__group-title">
                    {group.mapName}
                  </h4>
                ) : null}
                {group.items.map((cat) => {
                  const isSelected = filters.categories.has(cat.key);
                  const share = largestCategoryTotal > 0 ? cat.total / largestCategoryTotal : 1;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      className={`sidebar__filter-row sidebar__filter-row--category ${isSelected ? "sidebar__filter-row--active" : ""}`}
                      onClick={() => toggleCategoryFilter(cat.key)}
                      aria-pressed={isSelected}
                      disabled={cat.total === 0 && !isSelected}
                    >
                      <span className="sidebar__swatch" style={{ backgroundColor: cat.color }} />
                      <span className="sidebar__filter-label">{cat.label}</span>
                      <span className="sidebar__filter-count">{cat.total}</span>
                      <span
                        className="sidebar__mini-bar"
                        style={{ "--category-share": share } as CSSProperties}
                        aria-hidden="true"
                      >
                        {statusSegments(cat.statusCounts)}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </section>

        <section className="sidebar__section" aria-labelledby="sidebar-kinds">
          <div className="sidebar__section-header">
            <h3 id="sidebar-kinds" className="sidebar__section-title">
              Kinds
            </h3>
            {filters.kinds.size > 0 ? (
              <span className="sidebar__active-count">{filters.kinds.size} active</span>
            ) : null}
          </div>

          <div className="sidebar__rows">
            {NODE_KINDS.map((kind) => {
              const isSelected = filters.kinds.has(kind);
              const count = kindCounts[kind];
              return (
                <button
                  key={kind}
                  type="button"
                  className={`sidebar__filter-row ${isSelected ? "sidebar__filter-row--active" : ""}`}
                  onClick={() => toggleKindFilter(kind)}
                  aria-pressed={isSelected}
                  disabled={count === 0 && !isSelected}
                >
                  <span className="sidebar__filter-label sidebar__filter-label--mono">{kind}</span>
                  <span className="sidebar__filter-count">{count}</span>
                </button>
              );
            })}
          </div>

          {!isCrossMapScope(activeMap) ? (
            <label className="sidebar__checkbox-label">
              <input
                type="checkbox"
                checked={filters.includeGhosts}
                onChange={(e) => setIncludeGhosts(e.target.checked)}
              />
              <span>Show linked nodes from other maps</span>
            </label>
          ) : null}
        </section>

        <section
          className="sidebar__section sidebar__section--compact-only"
          aria-labelledby="sidebar-view"
        >
          <div className="sidebar__section-header">
            <h3 id="sidebar-view" className="sidebar__section-title">
              View
            </h3>
          </div>
          <div className="sidebar__rows">
            <button
              type="button"
              className={`sidebar__filter-row ${showAllEdgeLabels ? "sidebar__filter-row--active" : ""}`}
              aria-pressed={showAllEdgeLabels}
              onClick={toggleShowAllEdgeLabels}
            >
              <span className="sidebar__filter-label">Always show edge labels</span>
            </button>
          </div>
        </section>

        <section className="sidebar__section" aria-labelledby="sidebar-progress">
          <div className="sidebar__section-header">
            <h3 id="sidebar-progress" className="sidebar__section-title">
              Progress
            </h3>
          </div>

          <div className="sidebar__progress-bar" role="img" aria-label={statusBreakdown}>
            {statusSegments(statusCounts)}
          </div>

          <ul className="sidebar__progress-legend" aria-hidden="true">
            {NODE_STATUSES.filter((status) => statusCounts[status] > 0).map((status) => (
              <li key={status} className="sidebar__progress-item">
                <span className="sidebar__progress-count">{statusCounts[status]}</span>
                {STATUS_META[status].countPhrase}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
}
