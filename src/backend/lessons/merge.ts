// How code lessons and admin-panel edits combine. Pure, so it is tested
// directly (tests/lesson-merge.test.ts).
import { createHash } from "node:crypto";
import type { Lesson } from "@/frontend/lessons/types";
import { parseLesson } from "@/frontend/lessons/schema";

export type LessonEditRow = {
  slug: string;
  data: unknown;
  published: boolean;
  codeHash: string | null;
};

export type LessonSource =
  | "code" // only in code
  | "override" // in code, replaced by an admin edit
  | "admin"; // exists only in the admin panel

export type LessonEntry = {
  lesson: Lesson;
  source: LessonSource;
  published: boolean;
  /** The code version changed after the admin edit was made. */
  codeChanged: boolean;
  /** The stored edit failed validation and is being ignored. */
  invalid: boolean;
};

/** Short fingerprint of a code lesson, stored with an override. */
export function codeHashOf(lesson: Lesson) {
  return createHash("sha256").update(JSON.stringify(lesson)).digest("hex").slice(0, 16);
}

const byOrder = (a: LessonEntry, b: LessonEntry) => a.lesson.order - b.lesson.order || a.lesson.slug.localeCompare(b.lesson.slug);

/**
 * Every lesson with where it comes from. An edit wins over code for the
 * same slug; an edit that no longer validates is ignored (code stays live).
 */
export function mergeLessons(code: Lesson[], edits: LessonEditRow[]): LessonEntry[] {
  const entries = new Map<string, LessonEntry>();
  for (const lesson of code) {
    entries.set(lesson.slug, { lesson, source: "code", published: true, codeChanged: false, invalid: false });
  }
  for (const edit of edits) {
    const fromCode = entries.get(edit.slug);
    const parsed = parseLesson(edit.data);
    if (!parsed.ok || parsed.lesson.slug !== edit.slug) {
      if (fromCode) fromCode.invalid = true;
      continue;
    }
    entries.set(edit.slug, {
      lesson: parsed.lesson,
      source: fromCode && fromCode.source === "code" ? "override" : "admin",
      published: edit.published,
      codeChanged: Boolean(fromCode && edit.codeHash && edit.codeHash !== codeHashOf(fromCode.lesson)),
      invalid: false,
    });
  }
  return [...entries.values()].sort(byOrder);
}

/** What visitors see: published lessons in course order. */
export function publishedLessons(entries: LessonEntry[]) {
  return entries.filter((e) => e.published).map((e) => e.lesson);
}
