import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import { memo } from "react";
import type { TechNodeData } from "../content/parse";
import type { NodeStatus } from "../content/schema";

export interface TechNodeFlowData extends Record<string, unknown> {
  readonly tech: TechNodeData;
  readonly isGhost: boolean;
  readonly categoryName: string;
  readonly homeMapName: string;
  readonly categoryColor: string;
  readonly isSelected: boolean;
  readonly isDimmed: boolean;
}

export type TechFlowNode = Node<TechNodeFlowData, "tech">;

export const STATUS_META: Readonly<
  Record<
    NodeStatus,
    { readonly label: string; readonly definition: string; readonly countPhrase: string }
  >
> = {
  work: { label: "Work", definition: "Used in commercial projects", countPhrase: "at work" },
  practiced: {
    label: "Practiced",
    definition: "Built in personal projects",
    countPhrase: "in projects",
  },
  learned: { label: "Learned", definition: "Completed in a course", countPhrase: "from a course" },
  learning: {
    label: "Learning",
    definition: "Studying now, open questions",
    countPhrase: "learning now",
  },
  planned: { label: "Planned", definition: "Next on the study list", countPhrase: "planned" },
};

export function StatusSwatch({ status }: { readonly status: NodeStatus }) {
  return (
    <span
      className={`status-swatch status-swatch--${status}`}
      role="img"
      aria-label={STATUS_META[status].label}
      title={STATUS_META[status].definition}
    />
  );
}

const HANDLE_SIDES = [
  ["top", Position.Top],
  ["right", Position.Right],
  ["bottom", Position.Bottom],
  ["left", Position.Left],
] as const;

function TechNodeComponent({ data }: NodeProps<TechFlowNode>) {
  const { tech, isGhost, homeMapName, categoryColor, isSelected, isDimmed } = data;

  const classNames = [
    "tech-node",
    isGhost ? "tech-node--ghost" : `tech-node--status-${tech.status}`,
    isSelected ? "tech-node--selected" : "",
    isDimmed ? "tech-node--dimmed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classNames}
      title={
        isGhost
          ? `${tech.name} — open it on the ${homeMapName} map`
          : `${tech.name} (${STATUS_META[tech.status].label}) — ${tech.what.replaceAll("`", "")}`
      }
    >
      <span className="tech-node__band" style={{ backgroundColor: categoryColor }} />

      <span className="tech-node__body">
        <span className="tech-node__title">{tech.name}</span>
        <span className="tech-node__meta">
          {isGhost ? `↗ ${homeMapName.toLowerCase()}` : `${tech.kind} · ${tech.status}`}
        </span>
      </span>

      {HANDLE_SIDES.map(([id, position]) => (
        <Handle
          key={id}
          id={id}
          type="source"
          position={position}
          className="tech-node__handle"
          isConnectable={false}
        />
      ))}
    </div>
  );
}

export const TechNode = memo(TechNodeComponent);
