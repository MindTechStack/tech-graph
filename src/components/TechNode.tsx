import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import { memo } from "react";
import type { TechNodeData } from "../content/parse";
import type { NodeKind, NodeStatus } from "../content/schema";

export interface TechNodeFlowData extends Record<string, unknown> {
  readonly tech: TechNodeData;
  readonly isGhost: boolean;
  readonly categoryName: string;
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

export const KIND_ICONS: Readonly<Record<NodeKind, string>> = {
  language: "🔤",
  framework: "🏗️",
  library: "📦",
  tool: "🛠️",
  service: "☁️",
  concept: "💡",
  platform: "⚙️",
};

function TechNodeComponent({ data }: NodeProps<TechFlowNode>) {
  const { tech, isGhost, categoryName, categoryColor, isSelected, isDimmed } = data;
  const statusMeta = STATUS_META[tech.status];
  const kindIcon = KIND_ICONS[tech.kind];

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
      style={{
        borderColor: isSelected ? "#f8fafc" : statusMeta.color,
        borderStyle: isGhost ? "dashed" : statusMeta.borderStyle,
        boxShadow: isSelected
          ? `0 0 0 2px ${statusMeta.color}, 0 8px 24px rgba(0, 0, 0, 0.55)`
          : undefined,
      }}
      title={
        isGhost
          ? `${tech.name} — Click to jump to ${tech.map} map`
          : `${tech.name} (${statusMeta.label}) — ${tech.what}`
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
          <span className="tech-node__icon" aria-hidden="true">
            {kindIcon}
          </span>
          <span className="tech-node__title">{tech.name}</span>
        </div>

        <div className="tech-node__meta">
          {isGhost ? (
            <span className="tech-node__ghost-badge">↗ {tech.map}</span>
          ) : (
            <span className="tech-node__category-label" style={{ color: categoryColor }}>
              {categoryName}
            </span>
          )}

          <span
            className="tech-node__status-badge"
            style={{
              color: statusMeta.color,
              backgroundColor: statusMeta.bg,
              borderColor: statusMeta.color,
            }}
          >
            {statusMeta.label}
          </span>
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
