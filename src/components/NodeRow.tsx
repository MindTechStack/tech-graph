import type { TechNodeData } from "../content/parse";
import { InlineCodeText } from "./DetailPanel";
import { STATUS_META, StatusSwatch } from "./Status";

export interface NodeRowContentProps {
  readonly node: TechNodeData;
  readonly mapName?: string;
  readonly showTags?: boolean;
}

export function NodeRowContent({ node, mapName, showTags = false }: NodeRowContentProps) {
  return (
    <>
      <span className="node-row__title">{node.name}</span>
      <span className="node-row__what">
        <InlineCodeText text={node.what} />
      </span>
      <span className="node-row__meta">
        <StatusSwatch status={node.status} />
        {mapName ? `${mapName.toLowerCase()} · ` : null}
        {node.kind} ·{" "}
        <span title={`status: ${node.status} — ${STATUS_META[node.status].definition}`}>
          {node.status}
        </span>
        {showTags && node.tags.length > 0 ? (
          <span className="node-row__tags">{node.tags.map((tag) => `#${tag}`).join(" ")}</span>
        ) : null}
      </span>
    </>
  );
}
