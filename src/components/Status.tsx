import type { NodeStatus } from "../content/schema";

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
