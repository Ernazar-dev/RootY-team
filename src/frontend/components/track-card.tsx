import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/shared/i18n/config";
import type { Messages } from "@/shared/i18n/messages/uz";
import { format } from "@/shared/i18n/format";
import type { Track } from "@/frontend/lessons/tracks";

/** A track on /[locale]/learn. Without lessons it is shown, but not linked. */
export function TrackCard({
  track,
  lessons,
  locale,
  t,
}: {
  track: Track;
  lessons: number;
  locale: Locale;
  t: Messages;
}) {
  const soon = lessons === 0;
  const body = (
    <>
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-faint">{String(track.order).padStart(2, "0")}</span>
        <span className="stamp rounded-full border border-border px-2.5 py-1 text-[0.625rem] text-muted">
          {soon ? t.learn.soon : format(t.learn.lessons, { n: lessons })}
        </span>
      </div>
      <h2 className="mt-10 text-2xl leading-snug font-medium tracking-tight">{track.title[locale]}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">{track.summary[locale]}</p>
      {!soon && (
        <div className="mt-auto flex justify-end pt-8 text-muted">
          <span className="grid size-8 place-items-center rounded-full border border-border transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
            <ArrowUpRight aria-hidden className="size-4" />
          </span>
        </div>
      )}
    </>
  );

  const box = "flex h-full min-h-64 flex-col overflow-hidden rounded-card border p-6";
  if (soon) return <div className={`${box} border-dashed border-border bg-surface/30 opacity-70`}>{body}</div>;
  return (
    <Link
      href={`/${locale}/learn/${track.slug}`}
      data-spot
      className={`group ${box} border-border bg-surface/60 transition-colors hover:border-border-strong`}
    >
      {body}
    </Link>
  );
}
