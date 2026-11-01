import { test } from "node:test";
import assert from "node:assert/strict";
import { locales } from "@/shared/i18n/config";
import { earnedPoints } from "@/frontend/ctf/scoring";
import { LESSON_POINTS, RANKS, rankOf, rankProgress } from "@/frontend/rating/ranks";
import { buildStandings } from "@/frontend/rating/standings";

test("ranks are contiguous, ascending and fully translated", () => {
  assert.equal(RANKS[0].min, 0);
  RANKS.forEach((r, i) => {
    assert.equal(r.tier, i + 1);
    assert.equal(r.next, RANKS[i + 1]?.min ?? null);
    for (const l of locales) assert.ok(r.name[l], `rank ${r.tier} has no ${l} name`);
  });
});

test("rankOf picks the rank by threshold", () => {
  assert.equal(rankOf(0).tier, 1);
  assert.equal(rankOf(RANKS[1].min - 1).tier, 1);
  assert.equal(rankOf(RANKS[1].min).tier, 2);
  assert.equal(rankOf(1_000_000).tier, RANKS.length);
  assert.equal(rankProgress(1_000_000), 100);
  assert.equal(rankProgress(RANKS[1].min), 0);
});

const t = (n: number) => new Date(2026, 0, n);

test("standings add CTF and lesson points, ties go to the earlier finisher", () => {
  const rows = buildStandings({
    students: [
      { id: "a", name: "Ali", group: "G1" },
      { id: "b", name: "Bek", group: "G1" },
      { id: "c", name: "Cora", group: null },
      { id: "d", name: "Dina", group: null },
    ],
    solves: [
      { userId: "a", points: 100, hintsUsed: 0, at: t(5) },
      { userId: "b", points: 100, hintsUsed: 2, at: t(1) },
      { userId: "b", points: 50, hintsUsed: 0, at: t(2) },
    ],
    completions: [
      { userId: "b", at: t(3) },
      { userId: "c", at: t(1) },
      { userId: "c", at: t(2) },
    ],
    meId: "d",
  });

  // a and c both have 100; c got there on the 2nd, a on the 5th.
  assert.deepEqual(
    rows.map((r) => [r.id, r.points, r.rank]),
    [
      ["b", earnedPoints(100, 2) + 50 + LESSON_POINTS, 1],
      ["c", 2 * LESSON_POINTS, 2],
      ["a", 100, 3],
      ["d", 0, 4],
    ],
  );
  const b = rows[0];
  assert.equal(b.solved, 2);
  assert.equal(b.lessons, 1);
  assert.equal(b.ctfPoints, earnedPoints(100, 2) + 50);
});

test("students without points stay off the board unless it is the viewer", () => {
  const students = [{ id: "z", name: "Zed", group: null }];
  assert.equal(buildStandings({ students, solves: [], completions: [], meId: null }).length, 0);
  assert.equal(buildStandings({ students, solves: [], completions: [], meId: "z" })[0].me, true);
});

test("rows of unknown students are ignored", () => {
  const rows = buildStandings({
    students: [{ id: "a", name: "Ali", group: null }],
    solves: [{ userId: "ghost", points: 500, hintsUsed: 0, at: t(1) }],
    completions: [{ userId: "ghost", at: t(1) }],
    meId: null,
  });
  assert.equal(rows.length, 0);
});
