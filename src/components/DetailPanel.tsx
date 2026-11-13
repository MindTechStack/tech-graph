import { useMemo } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import type { KnowledgeGraph } from "../content/graph";
import type { TechNodeData } from "../content/parse";
import { useAppState } from "../state/useAppState";
import { ErrorBoundary } from "./ErrorBoundary";
import { Icon } from "./Icon";
import { STATUS_META } from "./TechNode";

export interface DetailPanelProps {
  readonly graph: KnowledgeGraph;
}

const VISIBLE_RELATION_NAMES = 12;
const MARKDOWN_COMPONENTS = { h2: "h3" } as const;

export function InlineCodeText({ text }: { readonly text: string }) {
  const parts = text.split("`");
  if (parts.length % 2 === 0) {
    return text;
  }
  return parts.map((part, index) => (index % 2 === 1 ? <code key={index}>{part}</code> : part));
}

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

interface VerbGroup {
  readonly verb: string;
  readonly rows: RelationRowData[];
}

function groupByVerb(rows: readonly RelationRowData[]): VerbGroup[] {
  const groups = new Map<string, RelationRowData[]>();
  for (const row of rows) {
    const group = groups.get(row.verb);
    if (group) {
      group.push(row);
    } else {
      groups.set(row.verb, [row]);
    }
  }
  return [...groups].map(([verb, groupRows]) => ({ verb, rows: groupRows }));
}

function splitAtNameBudget(groups: readonly VerbGroup[], budget: number) {
  let used = 0;
  let cut = 0;
  for (const group of groups) {
    if (cut > 0 && used + group.rows.length > budget) {
      break;
    }
    used += group.rows.length;
    cut += 1;
  }
  return { visible: groups.slice(0, cut), hidden: groups.slice(cut) };
}

function RelationList({ title, rows, homeMap, graph }: RelationListProps) {
  const { navigateToNode, setHoveredNodeId } = useAppState();

  if (rows.length === 0) {
    return null;
  }

  const { visible, hidden } = splitAtNameBudget(groupByVerb(rows), VISIBLE_RELATION_NAMES);
  const hiddenNameCount = hidden.reduce((sum, group) => sum + group.rows.length, 0);

  const renderName = (row: RelationRowData) => {
    const status = STATUS_META[row.node.status];
    return (
      <button
        key={row.key}
        type="button"
        className="detail-panel__relation-item"
        onClick={() => navigateToNode(row.node)}
        onMouseEnter={() => setHoveredNodeId(row.node.id)}
        onMouseLeave={() => setHoveredNodeId(null)}
      >
        <span
          className="detail-panel__relation-dot"
          style={{ backgroundColor: status.color }}
          title={status.label}
          role="img"
          aria-label={status.label}
        />
        <span className="detail-panel__relation-name">{row.node.name}</span>
        {row.node.map !== homeMap ? (
          <span className="detail-panel__relation-map">
            {graph.mapsById.get(row.node.map)?.name ?? row.node.map}
          </span>
        ) : null}
      </button>
    );
  };

  const renderGroups = (groups: readonly VerbGroup[]) => (
    <dl className="detail-panel__relation-list">
      {groups.map((group) => (
        <div key={group.verb} className="detail-panel__relation-row">
          <dt className="detail-panel__relation-verb">
            {group.rows[0]?.direction === "incoming" ? `← ${group.verb}` : `${group.verb} →`}
          </dt>
          <dd className="detail-panel__relation-targets">{group.rows.map(renderName)}</dd>
        </div>
      ))}
    </dl>
  );

  return (
    <div className="detail-panel__relation-group">
      <h4 className="detail-panel__relation-subtitle">
        {title} <span className="detail-panel__count">{rows.length}</span>
      </h4>
      {renderGroups(visible)}
      {hidden.length > 0 ? (
        <details className="detail-panel__relation-more">
          <summary>{hiddenNameCount} more</summary>
          {renderGroups(hidden)}
        </details>
      ) : null}
    </div>
  );
}

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
  const categoryColor = categoryConfig?.color ?? "#94a3b8";
  const mapName = mapConfig?.name ?? node.map;

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
          <p className="detail-panel__meta">
            <span className="detail-panel__place">
              <span className="detail-panel__swatch" style={{ backgroundColor: categoryColor }} />
              <button
                type="button"
                className="detail-panel__map-link"
                onClick={() => setActiveMap(node.map)}
                title={`Switch to ${mapName} map`}
              >
                {mapName}
              </button>
              {" / "}
              {categoryConfig?.name ?? node.category}
            </span>
            <span className="detail-panel__values">
              · {node.kind} · {node.status}
            </span>
          </p>

          <button
            type="button"
            className="detail-panel__icon-btn detail-panel__center-btn"
            onClick={() => requestCenterNode(node.id)}
            aria-label="Center this node on canvas"
            title="Center on canvas"
          >
            <Icon name="target" />
          </button>
          <button
            type="button"
            className="detail-panel__icon-btn"
            onClick={() => setSelectedNodeId(null)}
            aria-label="Close detail panel"
            title="Close (Esc)"
          >
            <Icon name="close" />
          </button>
        </div>

        <h2 className="detail-panel__title">{node.name}</h2>
      </header>

      <div key={node.id} className="detail-panel__scroll">
        {/* Core Trio: What / Why / Problem */}
        <dl className="detail-panel__trio">
          <div className="detail-panel__trio-row">
            <dt className="detail-panel__trio-label">What</dt>
            <dd className="detail-panel__trio-text">
              <InlineCodeText text={node.what} />
            </dd>
          </div>

          <div className="detail-panel__trio-row">
            <dt className="detail-panel__trio-label">Why</dt>
            <dd className="detail-panel__trio-text">
              <InlineCodeText text={node.why} />
            </dd>
          </div>

          <div className="detail-panel__trio-row">
            <dt className="detail-panel__trio-label">Problem</dt>
            <dd className="detail-panel__trio-text">
              <InlineCodeText text={node.problem} />
            </dd>
          </div>
        </dl>

        {/* Markdown Body */}
        {node.body ? (
          <section className="detail-panel__section">
            <div className="detail-panel__markdown">
              <ErrorBoundary
                fallback={() => (
                  <p role="alert">
                    Couldn't render the notes in <code>{node.filePath}</code>.
                  </p>
                )}
              >
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={MARKDOWN_COMPONENTS}
                >
                  {node.body}
                </Markdown>
              </ErrorBoundary>
            </div>
          </section>
        ) : null}

        {/* Outgoing & Incoming Relations */}
        {outgoing.length > 0 || incoming.length > 0 ? (
          <section className="detail-panel__section">
            <h3 className="detail-panel__section-title">
              Connections{" "}
              <span className="detail-panel__count">{outgoing.length + incoming.length}</span>
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
                  <span>{link.title}</span>
                  <Icon name="link" />
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
