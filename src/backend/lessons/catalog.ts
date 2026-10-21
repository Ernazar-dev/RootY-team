import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { lessons as codeLessons } from "@/frontend/lessons";
import type { Lesson } from "@/frontend/lessons/types";
import { db, hasDatabase, schema } from "@/backend/db";
import { mergeLessons, publishedLessons } from "./merge";

/** Cache tag for the lesson list; admin lesson actions call updateTag with it. */
export const LESSONS_TAG = "lessons";

/**
 * Published lessons: code lessons merged with admin-panel edits. Cached
 * until an admin saves a lesson, so lesson pages stay static.
 */
export async function getLessons(): Promise<Lesson[]> {
  "use cache";
  cacheTag(LESSONS_TAG);
  if (!hasDatabase) {
    cacheLife("max");
    return codeLessons;
  }
  try {
    const edits = await db.select().from(schema.lessonEdits);
    cacheLife("max");
    return publishedLessons(mergeLessons(codeLessons, edits));
  } catch (error) {
    // Database down: serve the code lessons, and retry soon instead of
    // freezing this fallback into the cache.
    console.error("[lessons] could not read lesson edits, using code lessons", error);
    cacheLife("minutes");
    return codeLessons;
  }
}

export async function getLesson(slug: string) {
  return (await getLessons()).find((lesson) => lesson.slug === slug);
}

/** Published lessons of one track, in course order. */
export async function getTrackLessons(track: string) {
  return (await getLessons()).filter((lesson) => lesson.track === track);
}

/** Previous and next lesson within the lesson's own track. */
export async function getNeighbours(slug: string) {
  const lesson = await getLesson(slug);
  const lessons = lesson ? await getTrackLessons(lesson.track) : [];
  const i = lessons.findIndex((l) => l.slug === slug);
  return {
    previous: i > 0 ? lessons[i - 1] : undefined,
    next: i >= 0 && i < lessons.length - 1 ? lessons[i + 1] : undefined,
  };
}
