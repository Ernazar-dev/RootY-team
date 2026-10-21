"use server";

// Every export of a "use server" file is a public endpoint. Keep only
// actions here that resolve the user from the session themselves; helpers
// that take a userId live in progress.ts.
import { sql } from "drizzle-orm";
import { db, schema } from "@/backend/db";
import { readSession } from "@/backend/auth/session";
import { getLesson } from "@/backend/lessons/catalog";

const { checkAttempts, lessonProgress } = schema;

// Called from lesson pages. Anonymous visitors are ignored (nothing to
// save), and every input is checked against the lesson itself, never
// trusted from the browser.

async function signedInUserId() {
  return (await readSession())?.user.id ?? null;
}

export async function startLesson(slug: string) {
  const userId = await signedInUserId();
  if (!userId || !(await getLesson(slug))) return { ok: false as const };
  await db.insert(lessonProgress).values({ userId, lessonSlug: slug }).onConflictDoNothing();
  return { ok: true as const };
}

export async function completeLesson(slug: string) {
  const userId = await signedInUserId();
  if (!userId || !(await getLesson(slug))) return { ok: false as const };
  await db
    .insert(lessonProgress)
    .values({ userId, lessonSlug: slug, status: "completed", completedAt: new Date() })
    .onConflictDoUpdate({
      target: [lessonProgress.userId, lessonProgress.lessonSlug],
      // Keep the first completion time if the lesson is completed again.
      set: { status: "completed", completedAt: sql`coalesce(${lessonProgress.completedAt}, excluded.completed_at)` },
    });
  return { ok: true as const };
}

export async function recordCheck(slug: string, checkIndex: number, picked: number) {
  const userId = await signedInUserId();
  if (!userId || !Number.isInteger(checkIndex) || !Number.isInteger(picked)) return { ok: false as const };
  const lesson = await getLesson(slug);
  const check = lesson?.blocks.filter((b) => b.kind === "check")[checkIndex];
  if (!check || check.kind !== "check" || picked < 0 || picked >= check.options.length) return { ok: false as const };

  await db.insert(checkAttempts).values({ userId, lessonSlug: slug, checkIndex, picked, correct: picked === check.answer });
  // Answering a check counts as having opened the lesson.
  await db.insert(lessonProgress).values({ userId, lessonSlug: slug }).onConflictDoNothing();
  return { ok: true as const };
}
