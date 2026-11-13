import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import { type CSSProperties, memo } from "react";
import type { TechNodeData } from "../content/parse";
import type { NodeStatus } from "../content/schema";
import { Icon } from "./Icon";

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
    {
      readonly label: string;
      readonly color: string;
      readonly bg: string;
      readonly borderStyle: "solid" | "dashed";
    }
  >
> = {
  work: {
    label: "Work",
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.16)",
    borderStyle: "solid",
  },
  practiced: {
    label: "Practiced",
    color: "#a855f7",
    bg: "rgba(168, 85, 247, 0.16)",
    borderStyle: "solid",
  },
  learned: {
    label: "Learned",
    color: "#22c55e",
    bg: "rgba(34, 197, 94, 0.16)",
    borderStyle: "solid",
  },
  learning: {
    label: "Learning",
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.18)",
    borderStyle: "solid",
  },
  planned: {
    label: "Planned",
    color: "#64748b",
    bg: "rgba(100, 116, 139, 0.14)",
    borderStyle: "dashed",
  },
};

function TechNodeComponent({ data }: NodeProps<TechFlowNode>) {
  const { tech, isGhost, categoryName, homeMapName, categoryColor, isSelected, isDimmed } = data;
  const statusMeta = STATUS_META[tech.status];

  const classNames = [
    "tech-node",
    `tech-node--status-${tech.status}`,
    isGhost ? "tech-node--ghost" : "",
    isSelected ? "tech-node--selected" : "",
    isDimmed ? "tech-node--dimmed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classNames}
      style={{ "--status-color": statusMeta.color } as CSSProperties}
      title={
        isGhost
          ? `${tech.name} — open it on the ${homeMapName} map`
          : `${tech.name} (${statusMeta.label}) — ${tech.what.replaceAll("`", "")}`
      }
    >
      <Handle
        type="target"
        position={Position.Left}
        className="tech-node__handle"
        isConnectable={false}
      />

      <div className="tech-node__category-bar" style={{ backgroundColor: categoryColor }} />

      <div className="tech-node__body">
        <div className="tech-node__header">
          <span className="tech-node__icon">
            <Icon name={tech.kind} />
          </span>
          <span className="tech-node__title">{tech.name}</span>
        </div>

        <div className="tech-node__meta">
          {isGhost ? (
            <span className="tech-node__ghost-badge">↗ {homeMapName}</span>
          ) : (
            <span className="tech-node__category-label" style={{ color: categoryColor }}>
              {categoryName}
            </span>
          )}
          <span className="tech-node__status">{tech.status}</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="tech-node__handle"
        isConnectable={false}
      />
    </div>
  );
}

export const TechNode = memo(TechNodeComponent);
