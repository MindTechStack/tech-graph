import { useMemo } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import type { KnowledgeGraph } from "../content/graph";
import type { TechNodeData } from "../content/parse";
import { useAppState } from "../state/useAppState";
import { KIND_ICONS, STATUS_META } from "./TechNode";

export interface DetailPanelProps {
  readonly graph: KnowledgeGraph;
}

const VISIBLE_RELATIONS = 6;

interface RelationRowData {
  readonly key: string;
  readonly verb: string;
  readonly direction: "outgoing" | "incoming";
  readonly node: TechNodeData;
}

interface RelationListProps {
  readonly title: string;
  readonly rows: readonly RelationRowData[];
  readonly homeMap: string;
  readonly graph: KnowledgeGraph;
}

function RelationList({ title, rows, homeMap, graph }: RelationListProps) {
  const { navigateToNode, setHoveredNodeId } = useAppState();

  if (rows.length === 0) {
    return null;
  }

  const renderRow = (row: RelationRowData) => {
    const status = STATUS_META[row.node.status];
    const verbLabel = row.direction === "outgoing" ? `${row.verb} →` : `→ ${row.verb}`;
    const verb = <span className="detail-panel__relation-verb">{verbLabel}</span>;
    return (
      <button
        key={row.key}
        type="button"
        className="detail-panel__relation-item"
        onClick={() => navigateToNode(row.node)}
        onMouseEnter={() => setHoveredNodeId(row.node.id)}
        onMouseLeave={() => setHoveredNodeId(null)}
      >
        {row.direction === "outgoing" ? verb : null}
        <span className="detail-panel__relation-target">
          <span aria-hidden="true">{KIND_ICONS[row.node.kind]}</span>
          <span className="detail-panel__relation-name">{row.node.name}</span>
          {row.node.map !== homeMap ? (
            <span className="detail-panel__relation-map">
              {graph.mapsById.get(row.node.map)?.name ?? row.node.map}
            </span>
          ) : null}
          <span
            className="detail-panel__relation-dot"
            style={{ backgroundColor: status.color }}
            title={status.label}
          />
        </span>
        {row.direction === "incoming" ? verb : null}
      </button>
    );
  };

  return (
    <div className="detail-panel__relation-group">
      <h4 className="detail-panel__relation-subtitle">
        {title} ({rows.length})
      </h4>
      <div className="detail-panel__relation-list">
        {rows.slice(0, VISIBLE_RELATIONS).map(renderRow)}
      </div>
      {rows.length > VISIBLE_RELATIONS ? (
        <details className="detail-panel__relation-more">
          <summary>{rows.length - VISIBLE_RELATIONS} more</summary>
          <div className="detail-panel__relation-list">
            {rows.slice(VISIBLE_RELATIONS).map(renderRow)}
          </div>
        </details>
      ) : null}
    </div>
  );
}

const SOURCE_LABELS: Readonly<Record<string, string>> = {
  course: "🎓 Node.js Course",
  work: "💼 Commercial Work",
  personal: "🚀 Personal Project",
  "self-study": "📚 Self-Study",
};

export function DetailPanel({ graph }: DetailPanelProps) {
  const { selectedNodeId, setSelectedNodeId, requestCenterNode, setActiveMap } = useAppState();

  const node = useMemo(
    () => (selectedNodeId ? (graph.nodesById.get(selectedNodeId) ?? null) : null),
    [graph.nodesById, selectedNodeId],
  );

  if (!node) {
    return null;
  }

  const mapConfig = graph.mapsById.get(node.map);
  const categoryConfig = graph.categoriesByMap.get(node.map)?.get(node.category);
  const categoryColor = categoryConfig?.color ?? "#3b82f6";
  const statusMeta = STATUS_META[node.status];
  const kindIcon = KIND_ICONS[node.kind];

  const outgoing: readonly RelationRowData[] = (graph.outgoingByNodeId.get(node.id) ?? []).map(
    (rel) => ({
      key: `${rel.label}--${rel.to}`,
      verb: rel.label,
      direction: "outgoing",
      node: rel.targetNode,
    }),
  );
  const incoming: readonly RelationRowData[] = (graph.incomingByNodeId.get(node.id) ?? []).map(
    (rel) => ({
      key: `${rel.from}--${rel.label}`,
      verb: rel.label,
      direction: "incoming",
      node: rel.sourceNode,
    }),
  );

  return (
    <aside className="detail-panel" aria-label={`Details for ${node.name}`}>
      <header className="detail-panel__header">
        <div className="detail-panel__top-row">
          <div className="detail-panel__breadcrumbs">
            <button
              type="button"
              className="detail-panel__map-chip"
              onClick={() => setActiveMap(node.map)}
              title={`Switch to ${mapConfig?.name ?? node.map} map`}
            >
              {mapConfig?.name ?? node.map}
            </button>
            <span className="detail-panel__crumb-sep">/</span>
            <span
              className="detail-panel__category-chip"
              style={{
                borderColor: categoryColor,
                color: categoryColor,
              }}
            >
              {categoryConfig?.name ?? node.category}
            </span>
          </div>

          <div className="detail-panel__actions">
            <button
              type="button"
              className="detail-panel__action-btn"
              onClick={() => requestCenterNode(node.id)}
              title="Center this node on canvas"
            >
              🎯 Center
            </button>
            <button
              type="button"
              className="detail-panel__close-btn"
              onClick={() => setSelectedNodeId(null)}
              aria-label="Close detail panel"
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="detail-panel__title-row">
          <span className="detail-panel__kind-icon" aria-hidden="true">
            {kindIcon}
          </span>
          <div>
            <h2 className="detail-panel__title">{node.name}</h2>
            <code className="detail-panel__id">{node.id}</code>
          </div>
        </div>

        <div className="detail-panel__badges">
          <span
            className="detail-panel__status-badge"
            style={{
              color: statusMeta.color,
              backgroundColor: statusMeta.bg,
              borderColor: statusMeta.color,
              borderStyle: statusMeta.borderStyle,
            }}
          >
            ● {statusMeta.label}
          </span>

          <span className="detail-panel__meta-badge">
            {kindIcon} {node.kind}
          </span>

          {node.source ? (
            <span className="detail-panel__meta-badge">
              {SOURCE_LABELS[node.source] ?? node.source}
            </span>
          ) : null}
        </div>
      </header>

      <div key={node.id} className="detail-panel__scroll">
        {/* Core Trio: What / Why / Problem */}
        <section className="detail-panel__trio">
          <div className="detail-panel__trio-card detail-panel__trio-card--what">
            <h3 className="detail-panel__trio-label">What it is</h3>
            <p className="detail-panel__trio-text">{node.what}</p>
          </div>

          <div className="detail-panel__trio-card detail-panel__trio-card--why">
            <h3 className="detail-panel__trio-label">Why use it</h3>
            <p className="detail-panel__trio-text">{node.why}</p>
          </div>

          <div className="detail-panel__trio-card detail-panel__trio-card--problem">
            <h3 className="detail-panel__trio-label">Problem it solves</h3>
            <p className="detail-panel__trio-text">{node.problem}</p>
          </div>
        </section>

        {/* Markdown Body */}
        {node.body ? (
          <section className="detail-panel__section">
            <div className="detail-panel__markdown">
              <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {node.body}
              </Markdown>
            </div>
          </section>
        ) : null}

        {/* Outgoing & Incoming Relations */}
        {outgoing.length > 0 || incoming.length > 0 ? (
          <section className="detail-panel__section">
            <h3 className="detail-panel__section-title">
              Connections ({outgoing.length + incoming.length})
            </h3>
            <RelationList title="Outgoing" rows={outgoing} homeMap={node.map} graph={graph} />
            <RelationList
              title="Referenced by / Backlinks"
              rows={incoming}
              homeMap={node.map}
              graph={graph}
            />
          </section>
        ) : null}

        {/* External Links */}
        {node.links.length > 0 ? (
          <section className="detail-panel__section">
            <h3 className="detail-panel__section-title">Resources & Links</h3>
            <div className="detail-panel__links">
              {node.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail-panel__link"
                >
                  <span>🔗 {link.title}</span>
                  <span className="detail-panel__link-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </section>
        ) : null}

        {/* Tags & AlsoIn */}
        {node.tags.length > 0 || node.alsoIn.length > 0 ? (
          <section className="detail-panel__section">
            {node.tags.length > 0 ? (
              <div className="detail-panel__tags">
                {node.tags.map((tag) => (
                  <span key={tag} className="detail-panel__tag">
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}

            {node.alsoIn.length > 0 ? (
              <div className="detail-panel__also-in">
                <span className="detail-panel__also-label">Also in maps:</span>
                {node.alsoIn.map((mapId) => (
                  <button
                    key={mapId}
                    type="button"
                    className="detail-panel__map-chip"
                    onClick={() => setActiveMap(mapId)}
                  >
                    ↗ {graph.mapsById.get(mapId)?.name ?? mapId}
                  </button>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </aside>
  );
}
