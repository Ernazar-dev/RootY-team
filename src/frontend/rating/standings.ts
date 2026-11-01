import { earnedPoints } from "@/frontend/ctf/scoring";
import { LESSON_POINTS } from "./ranks";

// Turns raw rows into the overall standings. Pure, so it is unit-tested
// without a database; backend/services/rating.ts feeds it.

export type Standing = {
  id: string;
  rank: number;
  name: string;
  group: string | null;
  points: number;
  ctfPoints: number;
  /** CTF challenges solved. */
  solved: number;
  /** Lessons completed. */
  lessons: number;
  me: boolean;
};

export type StandingsInput = {
  students: { id: string; name: string; group: string | null }[];
  solves: { userId: string; points: number; hintsUsed: number; at: Date }[];
  completions: { userId: string; at: Date }[];
  meId: string | null;
};

/**
 * Students ordered by total points. Ties go to whoever got there first.
 * Students with no points yet are left out (their names stay private),
 * except the viewer, who always sees their own row.
 */
export function buildStandings({ students, solves, completions, meId }: StandingsInput): Standing[] {
  const rows = new Map(
    students.map((s) => [
      s.id,
      { ...s, points: 0, ctfPoints: 0, solved: 0, lessons: 0, me: s.id === meId, last: 0 },
    ]),
  );
  for (const s of solves) {
    const row = rows.get(s.userId);
    if (!row) continue;
    const pts = earnedPoints(s.points, s.hintsUsed);
    row.ctfPoints += pts;
    row.points += pts;
    row.solved += 1;
    row.last = Math.max(row.last, s.at.getTime());
  }
  for (const c of completions) {
    const row = rows.get(c.userId);
    if (!row) continue;
    row.points += LESSON_POINTS;
    row.lessons += 1;
    row.last = Math.max(row.last, c.at.getTime());
  }
  return [...rows.values()]
    .filter((r) => r.points > 0 || r.me)
    .sort((a, b) => b.points - a.points || a.last - b.last || a.name.localeCompare(b.name))
    .map((r, i) => ({
      id: r.id,
      rank: i + 1,
      name: r.name,
      group: r.group,
      points: r.points,
      ctfPoints: r.ctfPoints,
      solved: r.solved,
      lessons: r.lessons,
      me: r.me,
    }));
}
