import { type ReactNode, useMemo } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import type { KnowledgeGraph } from "../content/graph";
import type { TechNodeData } from "../content/parse";
import { useAppState } from "../state/useAppState";
import { ErrorBoundary } from "./ErrorBoundary";
import { Icon } from "./Icon";
import { STATUS_META, StatusSwatch } from "./TechNode";

export interface DetailPanelProps {
  readonly graph: KnowledgeGraph;
}

const VISIBLE_RELATION_ROWS = 6;
const MARKDOWN_COMPONENTS = { h2: "h3" } as const;

function lowercaseFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

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
  readonly node: TechNodeData;
}

interface RelationTableProps {
  readonly direction: "outgoing" | "incoming";
  readonly rows: readonly RelationRowData[];
  readonly homeMap: string;
  readonly graph: KnowledgeGraph;
}

function RelationTable({ direction, rows, homeMap, graph }: RelationTableProps) {
  const { navigateToNode, setHoveredNodeId } = useAppState();

  if (rows.length === 0) {
    return null;
  }

  const visibleRows = rows.slice(0, VISIBLE_RELATION_ROWS);
  const hiddenRows = rows.slice(VISIBLE_RELATION_ROWS);

  const renderRow = (row: RelationRowData) => {
    const verb = (
      <span className="relation-row__verb">
        {direction === "outgoing" ? `${row.verb} →` : `← ${row.verb}`}
      </span>
    );
    const name = (
      <span className="relation-row__name">
        <StatusSwatch status={row.node.status} />
        <span className="relation-row__name-text">{row.node.name}</span>
      </span>
    );
    return (
      <li key={row.key}>
        <button
          type="button"
          className={`relation-row relation-row--${direction}`}
          onClick={() => navigateToNode(row.node)}
          onMouseEnter={() => setHoveredNodeId(row.node.id)}
          onMouseLeave={() => setHoveredNodeId(null)}
        >
          {direction === "outgoing" ? verb : name}
          {direction === "outgoing" ? name : verb}
          <span className="relation-row__map">
            {row.node.map !== homeMap
              ? (graph.mapsById.get(row.node.map)?.name ?? row.node.map)
              : ""}
          </span>
        </button>
      </li>
    );
  };

  return (
    <div className="relation-table">
      <p className="relation-table__caption">
        {direction === "outgoing" ? "Outgoing" : "Backlinks"}{" "}
        <span className="detail-panel__count">{rows.length}</span>
      </p>
      <ul className="relation-table__rows">{visibleRows.map(renderRow)}</ul>
      {hiddenRows.length > 0 ? (
        <details className="relation-table__more">
          <summary>{hiddenRows.length} more</summary>
          <ul className="relation-table__rows">{hiddenRows.map(renderRow)}</ul>
        </details>
      ) : null}
    </div>
  );
}

function EntryRow({ label, children }: { readonly label: string; readonly children: ReactNode }) {
  return (
    <section className="entry-row">
      <h3 className="entry-row__label">{label}</h3>
      <div className="entry-row__body">{children}</div>
    </section>
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
  const mapName = mapConfig?.name ?? node.map;

  const outgoing: readonly RelationRowData[] = (graph.outgoingByNodeId.get(node.id) ?? []).map(
    (rel) => ({
      key: `${rel.label}--${rel.to}`,
      verb: rel.label,
      node: rel.targetNode,
    }),
  );
  const incoming: readonly RelationRowData[] = (graph.incomingByNodeId.get(node.id) ?? []).map(
    (rel) => ({
      key: `${rel.from}--${rel.label}`,
      verb: rel.label,
      node: rel.sourceNode,
    }),
  );

  return (
    <aside className="detail-panel" aria-label={`Details for ${node.name}`}>
      <header className="detail-panel__header">
        <div className="detail-panel__top-row">
          <h2 className="detail-panel__title">{node.name}</h2>
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

        <p className="detail-panel__place">
          <span
            className="detail-panel__swatch"
            style={categoryConfig ? { backgroundColor: categoryConfig.color } : undefined}
          />
          <span>{categoryConfig?.name ?? node.category}</span>
          <span className="detail-panel__place-sep">·</span>
          <button
            type="button"
            className="detail-panel__map-link"
            onClick={() => setActiveMap(node.map)}
            title={`Switch to the ${mapName} map`}
          >
            {mapName}
          </button>
        </p>

        <p className="detail-panel__status">
          <span className={`status-swatch status-swatch--${node.status}`} aria-hidden="true" />
          <span className="detail-panel__status-value">{node.status}</span>
          <span className="detail-panel__place-sep" aria-hidden="true">
            ·
          </span>
          <span>{lowercaseFirst(STATUS_META[node.status].definition)}</span>
        </p>

        <p className="detail-panel__values">
          {node.kind} · {node.id}
        </p>
      </header>

      <div key={node.id} className="detail-panel__scroll">
        <EntryRow label="What">
          <p className="entry-row__prose">
            <InlineCodeText text={node.what} />
          </p>
        </EntryRow>
        <EntryRow label="Why">
          <p className="entry-row__prose">
            <InlineCodeText text={node.why} />
          </p>
        </EntryRow>
        <EntryRow label="Problem">
          <p className="entry-row__prose">
            <InlineCodeText text={node.problem} />
          </p>
        </EntryRow>

        {node.body ? (
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
        ) : null}

        {outgoing.length > 0 || incoming.length > 0 ? (
          <EntryRow label="Connections">
            <RelationTable direction="outgoing" rows={outgoing} homeMap={node.map} graph={graph} />
            <RelationTable direction="incoming" rows={incoming} homeMap={node.map} graph={graph} />
          </EntryRow>
        ) : null}

        {node.links.length > 0 ? (
          <EntryRow label="Links">
            <ul className="detail-panel__links">
              {node.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail-panel__link"
                  >
                    <span>{link.title}</span>
                    <Icon name="link" size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </EntryRow>
        ) : null}

        {node.alsoIn.length > 0 ? (
          <EntryRow label="Also in">
            <p className="detail-panel__also-in">
              {node.alsoIn.map((mapId) => (
                <button
                  key={mapId}
                  type="button"
                  className="detail-panel__map-link"
                  onClick={() => setActiveMap(mapId)}
                >
                  ↗ {graph.mapsById.get(mapId)?.name ?? mapId}
                </button>
              ))}
            </p>
          </EntryRow>
        ) : null}

        {node.tags.length > 0 ? (
          <EntryRow label="Tags">
            <p className="detail-panel__tags">{node.tags.map((tag) => `#${tag}`).join(" ")}</p>
          </EntryRow>
        ) : null}
      </div>
    </aside>
  );
}
