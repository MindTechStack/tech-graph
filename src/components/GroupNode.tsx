import { type Node, type NodeProps } from "@xyflow/react";
import { memo } from "react";

export interface GroupNodeFlowData extends Record<string, unknown> {
  readonly label: string;
  readonly description?: string;
  readonly color: string;
  readonly nodeCount: number;
  readonly isGhostGroup?: boolean;
}

export type GroupFlowNode = Node<GroupNodeFlowData, "categoryGroup">;

const TINT_FIELD_ALPHA_HEX = "4d";

function GroupNodeComponent({ data }: NodeProps<GroupFlowNode>) {
  const { label, color, nodeCount, isGhostGroup } = data;

  return (
    <div
      className={`group-node ${isGhostGroup ? "group-node--ghost" : ""}`}
      style={isGhostGroup ? undefined : { backgroundColor: `${color}${TINT_FIELD_ALPHA_HEX}` }}
    >
      <div className="group-node__header">
        <span className="group-node__title">{label}</span>
        <span className="group-node__count">{nodeCount}</span>
      </div>
    </div>
  );
}

export const GroupNode = memo(GroupNodeComponent);
