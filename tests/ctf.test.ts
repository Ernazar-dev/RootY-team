import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { challenges, tracks, trackIds } from "@/frontend/ctf/catalog";

// flags.ts is `import "server-only"`, so it can't be imported into a plain
// Node test. We read it as text and pull out the keys of the `flags` map
// instead — enough to prove every challenge has an answer wired up.
const flagsSrc = readFileSync("src/backend/ctf/flags.ts", "utf8");
// String flags: "id": "FLAG{...}". Geo challenges: "id": { lat, lon, radiusKm }.
const flagKeys = new Set([
  ...[...flagsSrc.matchAll(/"([a-z0-9-]+)":\s*"[^"]+"/g)].map((m) => m[1]),
  ...[...flagsSrc.matchAll(/"([a-z0-9-]+)":\s*\{/g)].map((m) => m[1]),
]);
const flagValues = [...flagsSrc.matchAll(/"[a-z0-9-]+":\s*"([^"]+)"/g)].map((m) => m[1]);

test("every challenge has a flag in flags.ts", () => {
  for (const c of challenges) {
    assert.ok(flagKeys.has(c.id), `challenge "${c.id}" has no flag in flags.ts`);
  }
});

test("challenge ids are unique", () => {
  const ids = challenges.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length, "duplicate challenge id");
});

test("every challenge sits in a known track with a unique order", () => {
  for (const id of trackIds) {
    const inTrack = challenges.filter((c) => c.track === id).map((c) => c.order);
    assert.equal(new Set(inTrack).size, inTrack.length, `duplicate order in track "${id}"`);
  }
  for (const c of challenges) {
    assert.ok((trackIds as readonly string[]).includes(c.track), `challenge "${c.id}" has unknown track`);
  }
});

test("every track in the catalog is a known track id", () => {
  for (const t of tracks) assert.ok((trackIds as readonly string[]).includes(t.id));
});

test("flags look like flags (prefix{...})", () => {
  for (const v of flagValues) {
    assert.match(v, /^[A-Za-z0-9]+\{.+\}$/, `flag "${v}" is not in prefix{...} form`);
  }
});

test("challenges have all four locales in title and brief", () => {
  for (const c of challenges) {
    for (const loc of ["uz", "kaa", "ru", "en"] as const) {
      assert.ok(c.title[loc]?.length, `challenge "${c.id}" missing ${loc} title`);
      assert.ok(c.brief[loc]?.length, `challenge "${c.id}" missing ${loc} brief`);
    }
  }
});

test("scoring: hints cost points but never below the floor", async () => {
  const { earnedPoints, hintCostOf } = await import("@/frontend/ctf/scoring");
  assert.equal(earnedPoints(100, 0), 100);
  assert.equal(hintCostOf(100), 15);
  assert.equal(earnedPoints(100, 2), 70);
  assert.equal(earnedPoints(100, 10), 30); // floor: 30% of the points
  for (const c of challenges) {
    assert.ok(earnedPoints(c.points, c.hints.length) > 0, `"${c.id}" with every hint must still earn something`);
  }
});
