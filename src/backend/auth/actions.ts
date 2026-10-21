"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, count, eq, gt } from "drizzle-orm";
import { db, schema } from "@/backend/db";
import { defaultLocale, isLocale } from "@/shared/i18n/config";
import { burnVerifyTime, normalizeLogin, verifyPassword } from "./password";
import { WINDOW_MS, clientIp, isLocked, landingPath, safeNext } from "./rate-limit";
import { createSession, deleteSession } from "./session";

const { authAttempts, users } = schema;

export type LoginState = {
  error?: "invalid" | "tooMany" | "inactive" | "unavailable";
  /** Echoed back so the form keeps what was typed. */
  login?: string;
};

async function failures(column: typeof authAttempts.login | typeof authAttempts.ip, value: string) {
  const since = new Date(Date.now() - WINDOW_MS);
  const [row] = await db
    .select({ n: count() })
    .from(authAttempts)
    .where(and(eq(column, value), eq(authAttempts.ok, false), gt(authAttempts.createdAt, since)));
  return row?.n ?? 0;
}

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const rawLocale = formData.get("locale");
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const loginName = normalizeLogin(String(formData.get("login") ?? "")).slice(0, 64);
  const password = String(formData.get("password") ?? "").slice(0, 256);
  if (!loginName || !password) return { error: "invalid", login: loginName };

  const h = await headers();
  const ip = clientIp(h.get("x-forwarded-for"), h.get("x-real-ip"));

  let destination: string;
  try {
    if (isLocked(await failures(authAttempts.login, loginName), await failures(authAttempts.ip, ip))) {
      return { error: "tooMany", login: loginName };
    }

    const [user] = await db.select().from(users).where(eq(users.login, loginName)).limit(1);
    let ok = false;
    if (user) ok = await verifyPassword(user.passwordHash, password);
    else await burnVerifyTime(password);
    await db.insert(authAttempts).values({ login: loginName, ip, ok: ok && Boolean(user?.active) });

    if (!user || !ok) return { error: "invalid", login: loginName };
    // Only revealed after the right password, so it leaks nothing.
    if (!user.active) return { error: "inactive", login: loginName };

    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));
    await createSession(user.id);
    destination = landingPath(user.role, safeNext(formData.get("next")), locale);
  } catch (error) {
    console.error("[auth] login failed", error);
    return { error: "unavailable", login: loginName };
  }
  redirect(destination);
}

export async function logout(formData: FormData) {
  await deleteSession();
  redirect(safeNext(formData.get("redirectTo")) ?? `/${defaultLocale}`);
}
