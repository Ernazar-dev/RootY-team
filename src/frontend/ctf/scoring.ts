// CTF scoring, shared by the arena (browser) and the leaderboard (server) so
// both always agree. A solved challenge is worth its points, minus a penalty
// for every hint opened, never below a floor. Revealing the full solution
// (give-up) earns nothing.

const HINT_PENALTY = 0.15; // fraction of the challenge's points per hint
const SCORE_FLOOR = 0.3; // never drop a solved challenge below this fraction

export function hintCostOf(points: number) {
  return Math.round(points * HINT_PENALTY);
}

export function earnedPoints(points: number, hintsUsed: number) {
  const floor = Math.round(points * SCORE_FLOOR);
  return Math.max(floor, points - hintsUsed * hintCostOf(points));
}
