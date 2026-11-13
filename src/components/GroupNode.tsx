import { type Node, type NodeProps, ViewportPortal } from "@xyflow/react";
import { memo } from "react";

export interface GroupNodeFlowData extends Record<string, unknown> {
  readonly label: string;
  readonly description?: string;
  readonly color: string;
  readonly nodeCount: number;
  readonly isGhostGroup?: boolean;
}

export type GroupFlowNode = Node<GroupNodeFlowData, "categoryGroup">;

const TINT_FIELD_PERCENT = 30;

function tintField(color: string): string {
  return `color-mix(in srgb, ${color} ${TINT_FIELD_PERCENT}%, transparent)`;
}

function tintPlate(color: string): string {
  return `color-mix(in srgb, ${color} ${TINT_FIELD_PERCENT}%, var(--paper))`;
}

function GroupNodeComponent({ data }: NodeProps<GroupFlowNode>) {
  const { color, isGhostGroup } = data;

  return (
    <div
      className={`group-node ${isGhostGroup ? "group-node--ghost" : ""}`}
      style={isGhostGroup ? undefined : { backgroundColor: tintField(color) }}
    />
  );
}

export const GroupNode = memo(GroupNodeComponent);

export function GroupHeaders({ groups }: { readonly groups: readonly GroupFlowNode[] }) {
  return (
    <ViewportPortal>
      {groups.map(({ id, position, style, data }) => (
        <div
          key={id}
          className="group-node__header"
          style={{ left: position.x, top: position.y, width: style?.width }}
        >
          <span
            className="group-node__plate"
            style={data.isGhostGroup ? undefined : { backgroundColor: tintPlate(data.color) }}
          >
            <span className="group-node__title">{data.label}</span>
            <span className="group-node__count">{data.nodeCount}</span>
          </span>
        </div>
      ))}
    </ViewportPortal>
  );
}
