import { type Node, type NodeProps, ViewportPortal } from "@xyflow/react";
import { memo } from "react";

export interface GroupNodeFlowData extends Record<string, unknown> {
  readonly label: string;
  readonly description?: string;
  readonly color: string;
  readonly nodeCount: number;
  readonly isGhostGroup?: boolean;
  readonly isFilteredOut: boolean;
}

export type GroupFlowNode = Node<GroupNodeFlowData, "categoryGroup">;

const TINT_PERCENT = 30;
const FILTERED_OUT_TINT_PERCENT = 10;

function tintPercent(data: GroupNodeFlowData): number {
  return data.isFilteredOut ? FILTERED_OUT_TINT_PERCENT : TINT_PERCENT;
}

function tintField(data: GroupNodeFlowData): string {
  return `color-mix(in srgb, ${data.color} ${tintPercent(data)}%, transparent)`;
}

function tintPlate(data: GroupNodeFlowData): string {
  return `color-mix(in srgb, ${data.color} ${tintPercent(data)}%, var(--paper))`;
}

function GroupNodeComponent({ data }: NodeProps<GroupFlowNode>) {
  return (
    <div
      className={`group-node ${data.isGhostGroup ? "group-node--ghost" : ""}`}
      style={data.isGhostGroup ? undefined : { backgroundColor: tintField(data) }}
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
          className={`group-node__header ${data.isFilteredOut ? "group-node__header--filtered-out" : ""}`}
          style={{ left: position.x, top: position.y, width: style?.width }}
        >
          <span
            className="group-node__plate"
            style={data.isGhostGroup ? undefined : { backgroundColor: tintPlate(data) }}
          >
            <span className="group-node__title">{data.label}</span>
            <span className="group-node__count">{data.nodeCount}</span>
          </span>
        </div>
      ))}
    </ViewportPortal>
  );
}
