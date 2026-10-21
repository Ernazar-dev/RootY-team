"use server";

// The only CTF endpoints the browser can reach. `checkFlag` takes a challenge
// id and a guessed flag and answers "right" or "wrong" — the flags themselves
// live in backend/ctf/flags.ts and never reach the client. For signed-in
// students the solve (and how many hints they opened) is saved so their score
// follows them across devices; anonymous visitors keep progress in the browser.
import { connection } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/backend/db";
import { readSession } from "@/backend/auth/session";
import { isCorrect } from "@/backend/ctf/flags";
import { getChallenge } from "@/frontend/ctf/catalog";

const { ctfSolves } = schema;

// A tiny in-memory sliding-window rate limit so the endpoint can't be hammered
// to brute-force flags. Keyed per session (or "anon"); resets on redeploy.
const WINDOW_MS = 10_000;
const MAX_IN_WINDOW = 30;
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear(); // crude memory cap
  return recent.length > MAX_IN_WINDOW;
}

export async function checkFlag(
  challengeId: string,
  guess: string,
  hintsUsed = 0,
): Promise<{ correct: boolean; rateLimited?: true }> {
  const challenge = typeof challengeId === "string" ? getChallenge(challengeId) : undefined;
  if (!challenge || typeof guess !== "string") return { correct: false };

  const session = await readSession();
  if (rateLimited(session?.user.id ?? "anon")) return { correct: false, rateLimited: true };

  // A small delay blunts rapid guessing even within the window.
  await new Promise((resolve) => setTimeout(resolve, 150));

  const correct = isCorrect(challengeId, guess);
  if (correct && session) {
    const clampedHints = Math.max(
      0,
      Math.min(Number.isFinite(hintsUsed) ? Math.floor(hintsUsed) : 0, challenge.hints.length),
    );
    // First solve wins: keep the original hint count if already solved.
    // Persistence is a best-effort enhancement: if the table isn't migrated
    // yet (or the DB hiccups), the answer is still correct — don't crash.
    try {
      await db
        .insert(ctfSolves)
        .values({ userId: session.user.id, challengeId, hintsUsed: clampedHints })
        .onConflictDoNothing();
    } catch (err) {
      console.warn("[ctf] could not save solve (is ctf_solves migrated?):", err);
    }
  }
  return { correct };
}

/** The signed-in student's solved challenges, to hydrate the arena on load. */
export async function listMySolves(): Promise<{ challengeId: string; hintsUsed: number }[]> {
  // Session + its time comparison must render per request, never prerendered.
  await connection();
  const session = await readSession();
  if (!session) return [];
  try {
    return await db
      .select({ challengeId: ctfSolves.challengeId, hintsUsed: ctfSolves.hintsUsed })
      .from(ctfSolves)
      .where(eq(ctfSolves.userId, session.user.id));
  } catch (err) {
    // Table missing (migration not run) or DB down: fall back to local-only
    // progress instead of breaking the whole CTF page.
    console.warn("[ctf] could not load solves (is ctf_solves migrated?):", err);
    return [];
  }
}

/** Clears the signed-in student's CTF progress (used by the Reset button). */
export async function resetMySolves(): Promise<{ ok: boolean }> {
  const session = await readSession();
  if (!session) return { ok: false };
  try {
    await db.delete(ctfSolves).where(eq(ctfSolves.userId, session.user.id));
    return { ok: true };
  } catch (err) {
    console.warn("[ctf] could not reset solves:", err);
    return { ok: false };
  }
}
