// The admin account defined in the environment (.env locally, the Vercel
// project settings in production). On every server start (on Vercel: every
// build) the account is created, or brought in line with the environment:
// still an admin, still active, and with the password from ADMIN_PASSWORD.
//
// Called from src/instrumentation.ts and scripts/sync-admin.ts, which run
// outside the React server layer, so this module avoids "server-only"
// imports and opens its own short-lived connection.
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sessions, users } from "@/backend/db/schema";
import { pgOptions } from "@/backend/db/options";
import { MIN_PASSWORD, hashPassword, isValidLogin, normalizeLogin, verifyPassword } from "./password";

export type AdminEnv =
  | { status: "unset" }
  | { status: "invalid"; reason: string }
  | { status: "ok"; login: string; password: string; name: string | null };

/** Reads ADMIN_LOGIN / ADMIN_PASSWORD / ADMIN_NAME. Pure, for tests. */
export function readAdminEnv(env: Record<string, string | undefined>): AdminEnv {
  const login = normalizeLogin(env.ADMIN_LOGIN ?? "");
  const password = env.ADMIN_PASSWORD ?? "";
  if (!login && !password) return { status: "unset" };
  if (!isValidLogin(login)) return { status: "invalid", reason: "ADMIN_LOGIN: 3–32 characters, latin letters, digits, . _ -" };
  if (password.length < MIN_PASSWORD) return { status: "invalid", reason: `ADMIN_PASSWORD: at least ${MIN_PASSWORD} characters` };
  return { status: "ok", login, password, name: env.ADMIN_NAME?.trim() || null };
}

export async function syncEnvAdmin() {
  const config = readAdminEnv(process.env);
  if (config.status === "unset") return;
  if (config.status === "invalid") {
    console.warn(`[admin] .env admin skipped — ${config.reason}`);
    return;
  }
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("[admin] .env admin skipped — DATABASE_URL is not set");
    return;
  }
  if (config.password.length < 12) console.warn("[admin] ADMIN_PASSWORD is short; 12+ characters is recommended");

  const sql = postgres(url, { ...pgOptions(url), max: 1 });
  try {
    const db = drizzle(sql);
    const [existing] = await db
      .select({ id: users.id, passwordHash: users.passwordHash, role: users.role, active: users.active })
      .from(users)
      .where(eq(users.login, config.login));

    if (!existing) {
      await db.insert(users).values({
        login: config.login,
        name: config.name ?? "Admin",
        passwordHash: await hashPassword(config.password),
        role: "admin",
      });
      console.log(`[admin] created admin "${config.login}" from .env`);
      return;
    }

    const samePassword = await verifyPassword(existing.passwordHash, config.password);
    const changes = {
      ...(existing.role !== "admin" || !existing.active ? { role: "admin" as const, active: true } : {}),
      ...(config.name ? { name: config.name } : {}),
      ...(samePassword ? {} : { passwordHash: await hashPassword(config.password) }),
    };
    if (Object.keys(changes).length) await db.update(users).set(changes).where(eq(users.id, existing.id));
    if (!samePassword) {
      // A new password signs the admin out everywhere.
      await db.delete(sessions).where(eq(sessions.userId, existing.id));
      console.log(`[admin] password for "${config.login}" updated from .env`);
    }
  } finally {
    await sql.end({ timeout: 5 });
  }
}
