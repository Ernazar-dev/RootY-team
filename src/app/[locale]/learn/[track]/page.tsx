import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isLocale } from "@/shared/i18n/config";
import { messagesFor } from "@/shared/i18n/server";
import { format } from "@/shared/i18n/format";
import { getLesson, getTrackLessons } from "@/backend/lessons/catalog";
import { getTrack, lessonPath, tracks } from "@/frontend/lessons/tracks";
import { LessonCard } from "@/frontend/components/lesson-card";

// Every track is prerendered; an unknown segment waits for the full render
// so it gets a real 404 (or redirect) instead of a streamed 200.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return tracks.map((track) => ({ track: track.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/learn/[track]">): Promise<Metadata> {
  const { locale, track: slug } = await params;
  const track = getTrack(slug);
  if (!isLocale(locale) || !track) return {};
  return { title: track.title[locale], description: track.summary[locale] };
}

export default async function TrackPage({ params }: PageProps<"/[locale]/learn/[track]">) {
  const { locale, track: slug } = await params;
  if (!isLocale(locale)) notFound();
  const track = getTrack(slug);
  if (!track) {
    // Lessons used to live at /learn/<lesson>; keep those links working.
    const lesson = await getLesson(slug);
    if (lesson) permanentRedirect(lessonPath(locale, lesson));
    notFound();
  }
  const t = messagesFor(locale);
  const lessons = await getTrackLessons(track.slug);

  return (
    <div className="mx-auto max-w-site px-4 pt-10 sm:px-6 lg:px-10">
      <Link href={`/${locale}/learn`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
        <ArrowLeft aria-hidden className="size-4" /> {t.learn.allTracks}
      </Link>
      <p className="stamp mt-12 text-[0.6875rem] text-muted">{format(t.learn.lessons, { n: lessons.length })}</p>
      <h1 className="stamp-xl mt-6">{track.title[locale]}</h1>
      <p className="mt-8 max-w-2xl text-lg leading-relaxed font-light text-muted">{track.summary[locale]}</p>

      {lessons.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-muted">
          {t.learn.empty}
        </p>
      ) : (
        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <li key={lesson.slug}>
              <LessonCard lesson={lesson} locale={locale} t={t} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
