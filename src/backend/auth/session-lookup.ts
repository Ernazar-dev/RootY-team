// Token → session lookup, shared by session.ts and src/proxy.ts. No
// "server-only" and no next/headers: the proxy runs outside the React
// server layer and hands the cookie value in itself.
import { createHash } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { db, schema } from "@/backend/db/client";

const { sessions, users } = schema;

// The cookie carries the token; the database only ever sees its hash.
export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export type SessionUser = {
  id: string;
  name: string;
  login: string;
  role: "student" | "admin";
  groupId: number | null;
};

export type Session = { id: string; expiresAt: Date; user: SessionUser };

/**
 * The session behind a cookie token, or null. Expired sessions and
 * deactivated users count as signed out.
 */
export async function findSession(token: string): Promise<Session | null> {
  const [row] = await db
    .select({
      id: sessions.id,
      expiresAt: sessions.expiresAt,
      userId: users.id,
      name: users.name,
      login: users.login,
      role: users.role,
      groupId: users.groupId,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.id, hashToken(token)), gt(sessions.expiresAt, new Date()), eq(users.active, true)))
    .limit(1);
  if (!row) return null;
  return {
    id: row.id,
    expiresAt: row.expiresAt,
    user: { id: row.userId, name: row.name, login: row.login, role: row.role, groupId: row.groupId },
  };
}
