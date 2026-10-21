import "server-only";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db, schema } from "@/backend/db";
import { findSession, hashToken, type Session } from "./session-lookup";

export type { Session, SessionUser } from "./session-lookup";

const { sessions } = schema;

export const SESSION_COOKIE = "rooty_session";
const DAY = 86_400_000;
const LIFETIME = 14 * DAY;
/** Sessions with less than this left are extended on the next visit. */
const RENEW_BELOW = 7 * DAY;

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires,
  };
}

/** Starts a session and sets the cookie. Server Actions only. */
export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + LIFETIME);
  await db.insert(sessions).values({ id: hashToken(token), userId, expiresAt });
  (await cookies()).set(SESSION_COOKIE, token, cookieOptions(expiresAt));
}

/**
 * The session behind the request's cookie, or null. Expired sessions and
 * deactivated users count as signed out. Read-only, so safe anywhere on
 * the server.
 */
export async function readSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? findSession(token) : null;
}

/** Slides an active session forward. Route Handlers and Server Actions only. */
export async function renewSession(session: Session) {
  if (session.expiresAt.getTime() - Date.now() > RENEW_BELOW) return;
  const expiresAt = new Date(Date.now() + LIFETIME);
  await db.update(sessions).set({ expiresAt }).where(eq(sessions.id, session.id));
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) store.set(SESSION_COOKIE, token, cookieOptions(expiresAt));
}

/** Signs the current browser out. Server Actions only. */
export async function deleteSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
  store.delete(SESSION_COOKIE);
}

/** Signs a user out everywhere, e.g. after a password reset. */
export async function deleteUserSessions(userId: string) {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}
