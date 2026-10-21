import "server-only";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/backend/db";
import { requireAdmin } from "@/backend/auth/dal";
import { challenges, getChallenge, getTrack } from "@/frontend/ctf/catalog";
import { earnedPoints } from "@/frontend/ctf/scoring";
import type { LeaderboardData, LeaderboardRow } from "@/frontend/ctf/leaderboard";

const { ctfSolves, groups, users } = schema;

const TOP = 10;
const WEEK_MS = 7 * 86_400_000;

type SolveRow = {
  userId: string;
  challengeId: string;
  hintsUsed: number;
  solvedAt: Date;
  name: string;
  login: string;
  group: string | null;
};

/** Every student's solve, newest data straight from the table. */
async function studentSolves(groupId?: number): Promise<SolveRow[]> {
  const student = eq(users.role, "student");
  return db
    .select({
      userId: ctfSolves.userId,
      challengeId: ctfSolves.challengeId,
      hintsUsed: ctfSolves.hintsUsed,
      solvedAt: ctfSolves.solvedAt,
      name: users.name,
      login: users.login,
      group: groups.name,
    })
    .from(ctfSolves)
    .innerJoin(users, eq(users.id, ctfSolves.userId))
    .leftJoin(groups, eq(groups.id, users.groupId))
    .where(groupId ? and(student, eq(users.groupId, groupId)) : student);
}

export type RankedStudent = LeaderboardRow & { login: string; hints: number; lastSolvedAt: Date };

/**
 * Students ordered by score, scored with the same rule as the arena. Ties go
 * to whoever reached the score first. Solves of challenges no longer in the
 * catalog do not count.
 */
function rank(rows: SolveRow[], meId: string | null): RankedStudent[] {
  const byUser = new Map<string, Omit<RankedStudent, "rank">>();
  for (const r of rows) {
    const challenge = getChallenge(r.challengeId);
    if (!challenge) continue;
    const entry = byUser.get(r.userId) ?? {
      id: r.userId,
      name: r.name,
      login: r.login,
      group: r.group,
      score: 0,
      solved: 0,
      hints: 0,
      lastSolvedAt: r.solvedAt,
      me: r.userId === meId,
    };
    entry.score += earnedPoints(challenge.points, r.hintsUsed);
    entry.solved += 1;
    entry.hints += r.hintsUsed;
    if (r.solvedAt > entry.lastSolvedAt) entry.lastSolvedAt = r.solvedAt;
    byUser.set(r.userId, entry);
  }
  return [...byUser.values()]
    .sort((a, b) => b.score - a.score || a.lastSolvedAt.getTime() - b.lastSolvedAt.getTime())
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
}

/** The public leaderboard: the top ten, plus the viewer's own row if lower. */
export async function getLeaderboard(meId: string | null): Promise<LeaderboardData> {
  let rows;
  try {
    rows = await studentSolves();
  } catch (err) {
    // Table missing (migration not run) or DB down: no board rather than no page.
    console.warn("[ctf] could not load leaderboard:", err);
    return { top: [], me: null, players: 0 };
  }
  // Only what the board shows goes to the browser: no logins, no timestamps.
  const ranked = rank(rows, meId).map(({ id, rank, name, group, score, solved, me }) => ({ id, rank, name, group, score, solved, me }));
  const mine = ranked.find((row) => row.me);
  return { top: ranked.slice(0, TOP), me: mine && mine.rank > TOP ? mine : null, players: ranked.length };
}

/** Admin: every participant, and how each challenge fared. */
export async function getCtfOverview(groupId?: number) {
  await requireAdmin();
  const rows = await studentSolves(groupId);
  const weekAgo = Date.now() - WEEK_MS;

  const perChallenge = new Map<string, { solves: number; hints: number }>();
  for (const r of rows) {
    const stat = perChallenge.get(r.challengeId) ?? { solves: 0, hints: 0 };
    stat.solves += 1;
    stat.hints += r.hintsUsed;
    perChallenge.set(r.challengeId, stat);
  }

  const students = rank(rows, null);
  return {
    students,
    solves: rows.filter((r) => getChallenge(r.challengeId)).length,
    solvesThisWeek: rows.filter((r) => getChallenge(r.challengeId) && r.solvedAt.getTime() > weekAgo).length,
    challenges: challenges.map((c) => {
      const stat = perChallenge.get(c.id);
      return {
        id: c.id,
        title: c.title.uz,
        track: getTrack(c.track)?.title.uz ?? c.track,
        points: c.points,
        difficulty: c.difficulty,
        solves: stat?.solves ?? 0,
        avgHints: stat && stat.solves > 0 ? stat.hints / stat.solves : 0,
      };
    }),
  };
}
