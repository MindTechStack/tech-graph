import { useMemo } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import type { KnowledgeGraph } from "../content/graph";
import { useAppState } from "../state/useAppState";
import { KIND_ICONS, STATUS_META } from "./TechNode";

export interface DetailPanelProps {
  readonly graph: KnowledgeGraph;
}

const SOURCE_LABELS: Readonly<Record<string, string>> = {
  course: "🎓 Node.js Course",
  work: "💼 Commercial Work",
  personal: "🚀 Personal Project",
  "self-study": "📚 Self-Study",
};

export function DetailPanel({ graph }: DetailPanelProps) {
  const {
    selectedNodeId,
    setSelectedNodeId,
    setHoveredNodeId,
    navigateToNode,
    requestCenterNode,
    setActiveMap,
  } = useAppState();

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

  const outgoing = graph.outgoingByNodeId.get(node.id) ?? [];
  const incoming = graph.incomingByNodeId.get(node.id) ?? [];

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

        {/* Outgoing & Incoming Relations */}
        {outgoing.length > 0 || incoming.length > 0 ? (
          <section className="detail-panel__section">
            <h3 className="detail-panel__section-title">
              Connections ({outgoing.length + incoming.length})
            </h3>

            {outgoing.length > 0 ? (
              <div className="detail-panel__relation-group">
                <h4 className="detail-panel__relation-subtitle">Outgoing ({outgoing.length})</h4>
                <div className="detail-panel__relation-list">
                  {outgoing.map((rel) => {
                    const targetStatus = STATUS_META[rel.targetNode.status];
                    const isExternalMap = rel.targetNode.map !== node.map;
                    return (
                      <button
                        key={`${rel.label}--${rel.to}`}
                        type="button"
                        className="detail-panel__relation-item"
                        onClick={() => navigateToNode(rel.targetNode)}
                        onMouseEnter={() => setHoveredNodeId(rel.targetNode.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                      >
                        <span className="detail-panel__relation-verb">{rel.label} →</span>
                        <span className="detail-panel__relation-target">
                          <span>{KIND_ICONS[rel.targetNode.kind]}</span>
                          <span className="detail-panel__relation-name">{rel.targetNode.name}</span>
                          {isExternalMap ? (
                            <span className="detail-panel__relation-map">{rel.targetNode.map}</span>
                          ) : null}
                          <span
                            className="detail-panel__relation-dot"
                            style={{ backgroundColor: targetStatus.color }}
                            title={targetStatus.label}
                          />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {incoming.length > 0 ? (
              <div className="detail-panel__relation-group">
                <h4 className="detail-panel__relation-subtitle">
                  Referenced by / Backlinks ({incoming.length})
                </h4>
                <div className="detail-panel__relation-list">
                  {incoming.map((rel) => {
                    const sourceStatus = STATUS_META[rel.sourceNode.status];
                    const isExternalMap = rel.sourceNode.map !== node.map;
                    return (
                      <button
                        key={`${rel.from}--${rel.label}`}
                        type="button"
                        className="detail-panel__relation-item"
                        onClick={() => navigateToNode(rel.sourceNode)}
                        onMouseEnter={() => setHoveredNodeId(rel.sourceNode.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                      >
                        <span className="detail-panel__relation-target">
                          <span>{KIND_ICONS[rel.sourceNode.kind]}</span>
                          <span className="detail-panel__relation-name">{rel.sourceNode.name}</span>
                          {isExternalMap ? (
                            <span className="detail-panel__relation-map">{rel.sourceNode.map}</span>
                          ) : null}
                          <span
                            className="detail-panel__relation-dot"
                            style={{ backgroundColor: sourceStatus.color }}
                            title={sourceStatus.label}
                          />
                        </span>
                        <span className="detail-panel__relation-verb">→ {rel.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
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
      </div>
    </aside>
  );
}
