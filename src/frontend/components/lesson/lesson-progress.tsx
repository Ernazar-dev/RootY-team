"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, CircleDot, LoaderCircle, LogIn } from "lucide-react";
import { completeLesson, startLesson } from "@/backend/services/progress-actions";
import type { SessionInfo } from "@/app/api/session/route";
import type { Locale } from "@/shared/i18n/config";
import type { Messages } from "@/shared/i18n/messages/uz";

type Status = "anonymous" | "started" | "completed";

/**
 * Bottom-of-lesson card. Signed-in students get the lesson marked as
 * started on open and can mark it completed; visitors are invited to sign in.
 */
export function LessonProgress({ slug, href, locale, t, loginLabel }: { slug: string; /** The lesson page, to come back to after signing in. */ href: string; locale: Locale; t: Messages["progress"]; loginLabel: string }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/session?lesson=${encodeURIComponent(slug)}`, { signal: controller.signal, cache: "no-store" })
      .then((r) => r.json() as Promise<SessionInfo>)
      .then(async (info) => {
        if (!info.user) return setStatus("anonymous");
        // Best effort: a failed "started" mark must not hide the card.
        if (!info.lesson) await startLesson(slug).catch(() => {});
        setStatus(info.lesson === "completed" ? "completed" : "started");
      })
      .catch(() => {});
    return () => controller.abort();
  }, [slug]);

  if (status === null) return <div aria-hidden className="mt-16 h-24" />;

  const box = "mt-16 flex flex-col gap-4 rounded-card border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6";

  if (status === "anonymous") {
    return (
      <div className={`${box} border-dashed border-border-strong`}>
        <p className="flex items-center gap-3 text-sm text-muted">
          <CircleDot aria-hidden className="size-5 shrink-0 text-faint" />
          {t.signIn}
        </p>
        <Link
          href={`/${locale}/login?next=${encodeURIComponent(href)}`}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-border-strong px-4 text-sm font-medium hover:border-text"
        >
          <LogIn aria-hidden className="size-4" />
          {loginLabel}
        </Link>
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div role="status" className={`${box} border-success/30 bg-success-soft`}>
        <p className="flex items-center gap-3 font-medium text-success">
          <CheckCircle2 aria-hidden className="size-5 shrink-0" />
          {t.completed}
        </p>
      </div>
    );
  }

  return (
    <div className={`${box} border-border bg-surface`}>
      <p role={failed ? "alert" : undefined} className={`flex items-center gap-3 text-sm ${failed ? "text-danger" : "text-muted"}`}>
        <span className={`size-2 shrink-0 rounded-full ${failed ? "bg-danger" : "pulse-dot bg-accent"}`} />
        {failed ? t.failed : t.tracked}
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setFailed(false);
            // A failed save must not throw out of the transition (that would
            // replace the lesson with the error page); say so and allow a retry.
            const ok = await completeLesson(slug).then((r) => r.ok, () => false);
            if (ok) setStatus("completed");
            else setFailed(true);
          })
        }
        className="bg-signal inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-white transition-[filter] hover:brightness-110 disabled:opacity-70"
      >
        {pending ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : <CheckCircle2 aria-hidden className="size-4" />}
        {pending ? t.saving : t.complete}
      </button>
    </div>
  );
}
