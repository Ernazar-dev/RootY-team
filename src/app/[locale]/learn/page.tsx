import type { Metadata } from "next";
import { isLocale } from "@/shared/i18n/config";
import { messagesFor } from "@/shared/i18n/server";
import { format } from "@/shared/i18n/format";
import { getLessons } from "@/backend/lessons/catalog";
import { tracks } from "@/frontend/lessons/tracks";
import { TrackCard } from "@/frontend/components/track-card";

export async function generateMetadata({ params }: PageProps<"/[locale]/learn">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = messagesFor(locale);
  return { title: t.learn.title, description: t.learn.lead };
}

// Step one of the course: pick a track. Its lessons are on /learn/<track>.
export default async function LearnPage({ params }: PageProps<"/[locale]/learn">) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const t = messagesFor(locale);
  const lessons = await getLessons();

  return (
    <div className="mx-auto max-w-site px-4 pt-16 sm:px-6 lg:px-10 sm:pt-24">
      <p className="stamp text-[0.6875rem] text-muted">{format(t.learn.tracks, { n: tracks.length })}</p>
      <h1 className="stamp-xl mt-6">{t.learn.title}</h1>
      <p className="mt-8 max-w-2xl text-lg leading-relaxed font-light text-muted">{t.learn.lead}</p>

      <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tracks.map((track) => (
          <li key={track.slug}>
            <TrackCard
              track={track}
              lessons={lessons.filter((lesson) => lesson.track === track.slug).length}
              locale={locale}
              t={t}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
