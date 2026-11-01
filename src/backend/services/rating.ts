import "server-only";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/backend/db";
import { getLessons } from "@/backend/lessons/catalog";
import { getChallenge } from "@/frontend/ctf/catalog";
import { buildStandings, type Standing } from "@/frontend/rating/standings";

const { ctfSolves, groups, lessonProgress, users } = schema;

const student = and(eq(users.role, "student"), eq(users.active, true));

/**
 * The overall rating: CTF points plus completed lessons, for every active
 * student. Computed from saved rows only, so browser storage cannot move
 * anyone. Solves of removed challenges and completions of removed lessons
 * do not count.
 */
export async function getStandings(meId: string | null): Promise<Standing[]> {
  try {
    const [students, solves, completions, lessons] = await Promise.all([
      db
        .select({ id: users.id, name: users.name, group: groups.name })
        .from(users)
        .leftJoin(groups, eq(groups.id, users.groupId))
        .where(student),
      db
        .select({ userId: ctfSolves.userId, challengeId: ctfSolves.challengeId, hintsUsed: ctfSolves.hintsUsed, at: ctfSolves.solvedAt })
        .from(ctfSolves)
        .innerJoin(users, eq(users.id, ctfSolves.userId))
        .where(student),
      db
        .select({ userId: lessonProgress.userId, slug: lessonProgress.lessonSlug, at: lessonProgress.completedAt })
        .from(lessonProgress)
        .innerJoin(users, eq(users.id, lessonProgress.userId))
        .where(and(student, eq(lessonProgress.status, "completed"))),
      getLessons(),
    ]);
    const slugs = new Set(lessons.map((l) => l.slug));
    return buildStandings({
      students,
      solves: solves.flatMap((s) => {
        const challenge = getChallenge(s.challengeId);
        return challenge ? [{ userId: s.userId, points: challenge.points, hintsUsed: s.hintsUsed, at: s.at }] : [];
      }),
      completions: completions.filter((c) => slugs.has(c.slug)).map((c) => ({ userId: c.userId, at: c.at ?? new Date(0) })),
      meId,
    });
  } catch (err) {
    // DB down or tables missing: an empty board rather than no page.
    console.warn("[rating] could not load standings:", err);
    return [];
  }
}
