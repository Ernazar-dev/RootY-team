import type { ComponentType, ReactNode } from "react";
import type { LessonSource } from "@/backend/lessons/merge";

// Small server-rendered building blocks shared by admin pages.

/** Where a lesson comes from, as shown in the lesson list and editor. */
export const sourceBadge: Record<LessonSource, { label: string; className: string }> = {
  code: { label: "Kod", className: "border-border-strong text-muted" },
  override: { label: "Kod + tuzatish", className: "border-accent/40 text-accent-text" },
  admin: { label: "Admin paneldan", className: "border-accent-2/40 text-accent-2" },
};

export function PageHeader({ title, lead, actions }: { title: string; lead?: string; actions?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {lead && <p className="mt-2 max-w-2xl text-sm text-muted">{lead}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function Stat({ icon: Icon, label, value, hint }: { icon: ComponentType<{ className?: string }>; label: string; value: number | string; hint?: string }) {
  return (
    <div className="rounded-card border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        <span className="grid size-8 place-items-center rounded-lg bg-accent-soft">
          <Icon className="size-4 text-accent" />
        </span>
      </div>
      <p className="mt-3 font-mono text-3xl font-light tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-faint">{hint}</p>}
    </div>
  );
}
