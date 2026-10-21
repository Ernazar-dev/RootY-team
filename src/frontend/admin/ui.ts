// Shared class names for the admin panel, so every form and table matches.
export const ui = {
  card: "rounded-card border border-border bg-surface",
  cardHead: "flex items-center justify-between gap-4 border-b border-border px-5 py-4",
  label: "mb-1.5 block text-xs font-medium text-muted",
  input:
    "h-10 w-full rounded-lg border border-border-strong bg-bg px-3 text-sm outline-none transition-colors placeholder:text-faint focus:border-accent focus:ring-4 focus:ring-accent/15",
  btn: "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-60",
  primary: "bg-signal text-white hover:brightness-110",
  ghost: "border border-border-strong hover:border-text",
  danger: "border border-danger/40 text-danger hover:bg-danger-soft",
  th: "px-5 py-3 text-left text-xs font-medium tracking-wide text-muted uppercase",
  td: "px-5 py-3.5 align-middle",
  badge: "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
} as const;
