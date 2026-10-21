import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/shared/i18n/config";
import type { Messages } from "@/shared/i18n/messages/uz";
import { lessonPath } from "@/frontend/lessons/tracks";
import type { Lesson } from "@/frontend/lessons/types";

export function LessonCard({ lesson, locale, t }: { lesson: Lesson; locale: Locale; t: Messages }) {
  return (
    <Link
      href={lessonPath(locale, lesson)}
      data-spot
      className="group flex h-full min-h-56 flex-col overflow-hidden rounded-card border border-border bg-surface/60 p-6 transition-colors hover:border-border-strong"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-faint">#{String(lesson.order).padStart(2, "0")}</span>
        <span className="stamp rounded-full border border-border px-2.5 py-1 text-[0.625rem] text-muted">
          {t.level[lesson.level]}
        </span>
      </div>
      <h3 className="mt-8 text-xl leading-snug font-medium tracking-tight">{lesson.title[locale]}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{lesson.summary[locale]}</p>
      <div className="mt-auto flex items-center justify-end pt-6 text-xs text-muted">
        <span className="grid size-8 place-items-center rounded-full border border-border transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
          <ArrowUpRight aria-hidden className="size-4" />
        </span>
      </div>
    </Link>
  );
}
