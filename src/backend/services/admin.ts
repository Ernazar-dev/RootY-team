import "server-only";
import { and, count, desc, eq, gt, isNotNull, sql } from "drizzle-orm";
import { db, schema } from "@/backend/db";
import { requireAdmin } from "@/backend/auth/dal";
import { lessons as codeLessons } from "@/frontend/lessons";
import { codeHashOf, mergeLessons, type LessonEntry } from "@/backend/lessons/merge";

const { authAttempts, checkAttempts, groups, lessonEdits, lessonProgress, users } = schema;

// Reads for the admin panel. Each one checks the caller is an admin first,
// so no page can forget to (Data Access Layer).

const WEEK_MS = 7 * 86_400_000;

async function allLessonEntries() {
  return mergeLessons(codeLessons, await db.select().from(lessonEdits));
}

export type Activity = {
  at: Date;
  kind: "login" | "completed" | "check";
  userId: string | null;
  name: string;
  lessonSlug?: string;
  correct?: boolean;
};

export async function getOverview() {
  await requireAdmin();
  const weekAgo = new Date(Date.now() - WEEK_MS);
  const student = eq(users.role, "student");

  const [[students], [active], [completions], [weekCompletions], entries, perLesson, logins, completed, checks] =
    await Promise.all([
      db.select({ n: count() }).from(users).where(student),
      db.select({ n: count() }).from(users).where(and(student, gt(users.lastLoginAt, weekAgo))),
      db.select({ n: count() }).from(lessonProgress).where(eq(lessonProgress.status, "completed")),
      db.select({ n: count() }).from(lessonProgress).where(gt(lessonProgress.completedAt, weekAgo)),
      allLessonEntries(),
      db
        .select({
          slug: lessonProgress.lessonSlug,
          started: count(),
          completed: sql<number>`count(*) filter (where ${lessonProgress.status} = 'completed')`.mapWith(Number),
        })
        .from(lessonProgress)
        .groupBy(lessonProgress.lessonSlug),
      db
        .select({ at: authAttempts.createdAt, userId: users.id, name: users.name })
        .from(authAttempts)
        .innerJoin(users, eq(users.login, authAttempts.login))
        .where(eq(authAttempts.ok, true))
        .orderBy(desc(authAttempts.createdAt))
        .limit(12),
      db
        .select({ at: lessonProgress.completedAt, userId: users.id, name: users.name, slug: lessonProgress.lessonSlug })
        .from(lessonProgress)
        .innerJoin(users, eq(users.id, lessonProgress.userId))
        .where(isNotNull(lessonProgress.completedAt))
        .orderBy(desc(lessonProgress.completedAt))
        .limit(12),
      db
        .select({ at: checkAttempts.createdAt, userId: users.id, name: users.name, slug: checkAttempts.lessonSlug, correct: checkAttempts.correct })
        .from(checkAttempts)
        .innerJoin(users, eq(users.id, checkAttempts.userId))
        .orderBy(desc(checkAttempts.createdAt))
        .limit(12),
    ]);

  const activity: Activity[] = [
    ...logins.map((r) => ({ at: r.at, kind: "login" as const, userId: r.userId, name: r.name })),
    ...completed.map((r) => ({ at: r.at!, kind: "completed" as const, userId: r.userId, name: r.name, lessonSlug: r.slug })),
    ...checks.map((r) => ({ at: r.at, kind: "check" as const, userId: r.userId, name: r.name, lessonSlug: r.slug, correct: r.correct })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 15);

  const stats = new Map(perLesson.map((r) => [r.slug, r]));
  return {
    students: students?.n ?? 0,
    activeThisWeek: active?.n ?? 0,
    completions: completions?.n ?? 0,
    completionsThisWeek: weekCompletions?.n ?? 0,
    lessons: entries.map((e) => ({
      slug: e.lesson.slug,
      title: e.lesson.title.uz,
      published: e.published,
      started: stats.get(e.lesson.slug)?.started ?? 0,
      completed: stats.get(e.lesson.slug)?.completed ?? 0,
    })),
    activity,
    titles: Object.fromEntries(entries.map((e) => [e.lesson.slug, e.lesson.title.uz])),
  };
}

export async function listGroups() {
  await requireAdmin();
  return db
    .select({ id: groups.id, name: groups.name, createdAt: groups.createdAt, members: count(users.id) })
    .from(groups)
    .leftJoin(users, and(eq(users.groupId, groups.id), eq(users.role, "student")))
    .groupBy(groups.id)
    .orderBy(groups.name);
}

export async function listStudents(groupId?: number) {
  await requireAdmin();
  const where = groupId ? and(eq(users.role, "student"), eq(users.groupId, groupId)) : eq(users.role, "student");
  const [rows, progress, attempts, entries] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        login: users.login,
        active: users.active,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
        groupId: users.groupId,
        groupName: groups.name,
      })
      .from(users)
      .leftJoin(groups, eq(groups.id, users.groupId))
      .where(where)
      .orderBy(users.name),
    db
      .select({
        userId: lessonProgress.userId,
        completed: sql<number>`count(*) filter (where ${lessonProgress.status} = 'completed')`.mapWith(Number),
      })
      .from(lessonProgress)
      .groupBy(lessonProgress.userId),
    db
      .select({
        userId: checkAttempts.userId,
        total: count(),
        correct: sql<number>`count(*) filter (where ${checkAttempts.correct})`.mapWith(Number),
      })
      .from(checkAttempts)
      .groupBy(checkAttempts.userId),
    allLessonEntries(),
  ]);
  const done = new Map(progress.map((p) => [p.userId, p.completed]));
  const answers = new Map(attempts.map((a) => [a.userId, a]));
  const lessonTotal = entries.filter((e) => e.published).length;
  return {
    lessonTotal,
    students: rows.map((r) => ({
      ...r,
      completed: done.get(r.id) ?? 0,
      answers: answers.get(r.id)?.total ?? 0,
      correct: answers.get(r.id)?.correct ?? 0,
    })),
  };
}

export async function getStudent(id: string) {
  await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      login: users.login,
      role: users.role,
      active: users.active,
      groupId: users.groupId,
      groupName: groups.name,
      createdAt: users.createdAt,
      lastLoginAt: users.lastLoginAt,
    })
    .from(users)
    .leftJoin(groups, eq(groups.id, users.groupId))
    .where(eq(users.id, id));
  if (!user || user.role !== "student") return null;

  const [progress, attempts, entries] = await Promise.all([
    db.select().from(lessonProgress).where(eq(lessonProgress.userId, id)),
    db
      .select({
        slug: checkAttempts.lessonSlug,
        checkIndex: checkAttempts.checkIndex,
        tries: count(),
        correct: sql<number>`count(*) filter (where ${checkAttempts.correct})`.mapWith(Number),
        firstCorrect: sql<boolean>`(array_agg(${checkAttempts.correct} order by ${checkAttempts.createdAt}))[1]`,
      })
      .from(checkAttempts)
      .where(eq(checkAttempts.userId, id))
      .groupBy(checkAttempts.lessonSlug, checkAttempts.checkIndex),
    allLessonEntries(),
  ]);

  const byLesson = new Map(progress.map((p) => [p.lessonSlug, p]));
  return {
    user,
    lessons: entries.map((e) => {
      const checks = e.lesson.blocks.filter((b) => b.kind === "check");
      return {
        slug: e.lesson.slug,
        title: e.lesson.title.uz,
        published: e.published,
        status: byLesson.get(e.lesson.slug)?.status ?? null,
        startedAt: byLesson.get(e.lesson.slug)?.startedAt ?? null,
        completedAt: byLesson.get(e.lesson.slug)?.completedAt ?? null,
        checks: checks.map((check, i) => {
          const a = attempts.find((x) => x.slug === e.lesson.slug && x.checkIndex === i);
          return {
            question: check.kind === "check" ? check.question.uz : "",
            tries: a?.tries ?? 0,
            solved: (a?.correct ?? 0) > 0,
            firstTry: a?.firstCorrect ?? false,
          };
        }),
      };
    }),
  };
}

export type AdminLessonEntry = LessonEntry & { updatedAt: Date | null };

export async function getLessonEntries(): Promise<AdminLessonEntry[]> {
  await requireAdmin();
  const edits = await db.select().from(lessonEdits);
  const updated = new Map(edits.map((e) => [e.slug, e.updatedAt]));
  return mergeLessons(codeLessons, edits).map((e) => ({ ...e, updatedAt: updated.get(e.lesson.slug) ?? null }));
}

/** One lesson for the editor, plus the code version if there is one. */
export async function getLessonEntry(slug: string) {
  await requireAdmin();
  const entries = await getLessonEntries();
  const entry = entries.find((e) => e.lesson.slug === slug);
  if (!entry) return null;
  const code = codeLessons.find((l) => l.slug === slug) ?? null;
  return { entry, code, codeHash: code ? codeHashOf(code) : null };
}
