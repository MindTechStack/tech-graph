import { useMemo, useSyncExternalStore } from "react";
import { isNodeDirectlyInMap, type KnowledgeGraph, matchesNodeFilters } from "../content/graph";
import { NODE_STATUSES } from "../content/schema";
import { useAppState } from "../state/useAppState";
import { Icon } from "./Icon";
import { NodeRowContent } from "./NodeRow";
import { STATUS_META, StatusSwatch } from "./TechNode";

const PHONE_LAYOUT_QUERY = "(max-width: 640px), (max-height: 480px) and (pointer: coarse)";

function subscribeToPhoneLayout(onChange: () => void) {
  const query = window.matchMedia(PHONE_LAYOUT_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function useIsPhoneLayout(): boolean {
  return useSyncExternalStore(
    subscribeToPhoneLayout,
    () => window.matchMedia(PHONE_LAYOUT_QUERY).matches,
    () => false,
  );
}

export function useIsPhoneCardOpen(): boolean {
  const { selectedNodeId } = useAppState();
  return useIsPhoneLayout() && selectedNodeId !== null;
}

function StatusKey() {
  return (
    <details className="phone-index__key">
      <summary className="phone-index__key-summary">
        <span className="phone-index__key-label">Status</span>
        <span className="phone-index__key-ramp" aria-hidden="true">
          {NODE_STATUSES.map((status) => (
            <span key={status} className="phone-index__key-value">
              <StatusSwatch status={status} />
              {status}
            </span>
          ))}
        </span>
        <span className="phone-index__key-toggle phone-index__key-toggle--closed">
          <Icon name="plus" />
        </span>
        <span className="phone-index__key-toggle phone-index__key-toggle--open">
          <Icon name="minus" />
        </span>
      </summary>
      <dl className="phone-index__key-rows">
        {NODE_STATUSES.map((status) => (
          <div key={status} className="phone-index__key-row">
            <dt className="phone-index__key-value">
              <StatusSwatch status={status} />
              {status}
            </dt>
            <dd className="phone-index__key-definition">{STATUS_META[status].definition}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

export function PhoneIndex({ graph }: { readonly graph: KnowledgeGraph }) {
  const {
    activeMap,
    filters,
    hasActiveFilters,
    resetFilters,
    setSelectedNodeId,
    requestCenterNode,
  } = useAppState();

  const groups = useMemo(() => {
    const visibleNodes = graph.nodes
      .filter(
        (node) =>
          isNodeDirectlyInMap(node, activeMap) && matchesNodeFilters(node, activeMap, filters),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
    const activeMapFirst = [...graph.maps].sort(
      (a, b) => Number(b.id === activeMap) - Number(a.id === activeMap),
    );

    return activeMapFirst
      .flatMap((mapCfg) =>
        mapCfg.categories.map((category) => ({
          key: `${mapCfg.id}:${category.id}`,
          label: mapCfg.id === activeMap ? category.name : `${mapCfg.name} · ${category.name}`,
          color: category.color,
          nodes: visibleNodes.filter(
            (node) => node.map === mapCfg.id && node.category === category.id,
          ),
        })),
      )
      .filter((group) => group.nodes.length > 0);
  }, [graph.nodes, graph.maps, activeMap, filters]);

  const openNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    requestCenterNode(nodeId);
  };

  return (
    <div className="phone-index">
      <div className="phone-index__sheet">
        <StatusKey />

        {groups.length === 0 ? (
          <div className="phone-index__empty">
            <p>
              {hasActiveFilters
                ? "No nodes match the current filters on this map."
                : "This map has no nodes yet."}
            </p>
            {hasActiveFilters ? (
              <button type="button" className="graph-canvas__empty-btn" onClick={resetFilters}>
                Clear filters
              </button>
            ) : null}
          </div>
        ) : (
          groups.map((group) => (
            <section
              key={group.key}
              className="phone-index__group"
              aria-labelledby={`index-${group.key}`}
            >
              <h2 id={`index-${group.key}`} className="phone-index__group-head">
                <span className="sidebar__swatch" style={{ backgroundColor: group.color }} />
                <span className="phone-index__group-name">{group.label}</span>
                <span className="phone-index__group-count">{group.nodes.length}</span>
              </h2>
              {group.nodes.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  className="node-row"
                  onClick={() => openNode(node.id)}
                >
                  <NodeRowContent node={node} />
                </button>
              ))}
            </section>
          ))
        )}
      </div>
    </div>
  );
}
