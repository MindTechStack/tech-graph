const ICON_PATHS = {
  language: "M5.5 4 2 8l3.5 4M10.5 4 14 8l-3.5 4",
  framework: "M2 2h12v12H2zM2 6h12M6 6v8",
  library: "M2 5 8 2l6 3v6l-6 3-6-3zM2 5l6 3 6-3M8 8v6",
  tool: "M2 3h12v10H2zM5 6l2 2-2 2M8.5 10H11",
  service: "M4.5 12.5h7a2.5 2.5 0 0 0 0-5h-.2A3.5 3.5 0 0 0 4.6 7a2.75 2.75 0 0 0-.1 5.5z",
  concept: "M6 14h4M8 2a4 4 0 0 0-2.5 7.1v2.4h5V9.1A4 4 0 0 0 8 2z",
  platform: "M8 2 2 5l6 3 6-3zM2 8l6 3 6-3M2 11l6 3 6-3",
  graph: "M2 2h4v4H2zM10 2h4v4h-4zM10 10h4v4h-4zM6 4h4M12 6v4",
  search: "M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10zM10.5 10.5 14 14",
  menu: "M2 4h12M2 8h12M2 12h12",
  close: "M3.5 3.5l9 9M12.5 3.5l-9 9",
  target: "M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 1v3M8 12v3M1 8h3M12 8h3",
  link: "M9 2h5v5M14 2 7.5 8.5M12 9.5V14H2V4h4.5",
  check: "M2.5 8.5 6 12l7.5-8",
  alert: "M8 1.5 1 14h14zM8 6v4M8 11.5V13",
} as const;

export type IconName = keyof typeof ICON_PATHS;

export function Icon({ name, size = 16 }: { readonly name: IconName; readonly size?: number }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}
