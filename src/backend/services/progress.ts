import "server-only";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/backend/db";

const { lessonProgress } = schema;

/** A user's status for one lesson. Callers pass the id from the session. */
export async function lessonStatus(userId: string, slug: string) {
  const [row] = await db
    .select({ status: lessonProgress.status })
    .from(lessonProgress)
    .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonSlug, slug)));
  return row?.status ?? null;
}
