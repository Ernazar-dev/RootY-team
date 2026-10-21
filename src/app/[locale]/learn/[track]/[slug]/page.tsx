import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { isLocale } from "@/shared/i18n/config";
import { messagesFor } from "@/shared/i18n/server";
import { getLesson, getLessons, getNeighbours, getTrackLessons } from "@/backend/lessons/catalog";
import { getTrack, lessonPath } from "@/frontend/lessons/tracks";
import { LessonBlocks } from "@/frontend/components/lesson/lesson-blocks";
import { LessonProgress } from "@/frontend/components/lesson/lesson-progress";

// Every lesson is prerendered. For an unknown slug this makes the first request
// wait for the full render, so it gets a real 404 instead of a streamed 200.
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  return (await getLessons()).map((lesson) => ({ track: lesson.track, slug: lesson.slug }));
}

/** The lesson, only when it really belongs to the track in the URL. */
async function lessonIn(track: string, slug: string) {
  const lesson = await getLesson(slug);
  return lesson?.track === track ? lesson : undefined;
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/learn/[track]/[slug]">): Promise<Metadata> {
  const { locale, track, slug } = await params;
  const lesson = await lessonIn(track, slug);
  if (!isLocale(locale) || !lesson) return {};
  return { title: lesson.title[locale], description: lesson.summary[locale] };
}

export default async function LessonPage({ params }: PageProps<"/[locale]/learn/[track]/[slug]">) {
  const { locale, track: trackSlug, slug } = await params;
  const lesson = await lessonIn(trackSlug, slug);
  const track = getTrack(trackSlug);
  if (!isLocale(locale) || !lesson || !track) notFound();
  const t = messagesFor(locale);
  const { previous, next } = await getNeighbours(slug);
  const trackLessons = await getTrackLessons(track.slug);
  const headings = lesson.blocks.flatMap((block) => (block.kind === "heading" ? [block] : []));

  // Same width as the header. The text column stays at a readable measure;
  // the side columns hold the track's lessons (xl) and the contents (lg).
  return (
    <div className="mx-auto grid max-w-site gap-10 px-4 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:px-10 xl:grid-cols-[15rem_minmax(0,1fr)_15rem]">
      <aside className="hidden xl:block">
        <nav aria-label={track.title[locale]} className="sticky top-24">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">{track.title[locale]}</p>
          <ol className="mt-3 space-y-1 text-sm">
            {trackLessons.map((item) => {
              const on = item.slug === lesson.slug;
              return (
                <li key={item.slug}>
                  <Link
                    href={lessonPath(locale, item)}
                    aria-current={on ? "page" : undefined}
                    className={`flex gap-2 rounded-lg px-3 py-2 ${on ? "bg-accent-soft font-medium text-accent-text" : "text-muted hover:bg-surface-2 hover:text-text"}`}
                  >
                    <span className="font-mono text-xs leading-5 opacity-70">{String(item.order).padStart(2, "0")}</span>
                    <span>{item.title[locale]}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>

      <article className="mx-auto w-full max-w-3xl min-w-0">
        <Link
          href={`/${locale}/learn/${track.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text"
        >
          <ArrowLeft aria-hidden className="size-4" /> {track.title[locale]}
        </Link>
        <header className="mt-6 border-b border-border pb-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <span className="font-mono">#{String(lesson.order).padStart(2, "0")}</span>
            <span className="rounded-md bg-surface-2 px-2 py-0.5 font-medium">{t.level[lesson.level]}</span>
          </div>
          <h1 className="mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
            {lesson.title[locale]}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{lesson.summary[locale]}</p>
        </header>

        <div className="mt-8">
          <LessonBlocks slug={lesson.slug} blocks={lesson.blocks} locale={locale} t={t} />
        </div>

        <LessonProgress slug={lesson.slug} href={lessonPath(locale, lesson)} locale={locale} t={t.progress} loginLabel={t.nav.login} />

        <nav aria-label={t.lesson.contents} className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
          {previous ? (
            <Link
              href={lessonPath(locale, previous)}
              className="rounded-2xl border border-border p-4 hover:border-accent"
            >
              <span className="flex items-center gap-1 text-sm text-muted">
                <ArrowLeft aria-hidden className="size-4" /> {t.lesson.previous}
              </span>
              <span className="mt-1 block font-medium">{previous.title[locale]}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={lessonPath(locale, next)}
              className="rounded-2xl border border-border p-4 text-right hover:border-accent"
            >
              <span className="flex items-center justify-end gap-1 text-sm text-muted">
                {t.lesson.next} <ArrowRight aria-hidden className="size-4" />
              </span>
              <span className="mt-1 block font-medium">{next.title[locale]}</span>
            </Link>
          )}
        </nav>
      </article>

      {headings.length > 0 && (
        <aside className="hidden lg:block">
          <nav aria-label={t.lesson.contents} className="sticky top-24">
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">{t.lesson.contents}</p>
            <ol className="mt-3 space-y-2 border-l border-border text-sm">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a href={`#${heading.id}`} className="-ml-px block border-l border-transparent pl-3 text-muted hover:border-accent hover:text-text">
                    {heading.text[locale]}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
      )}
    </div>
  );
}
