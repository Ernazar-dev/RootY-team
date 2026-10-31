// Brute-force limits for sign-in. Pure; the login action does the counting.

export const WINDOW_MS = 15 * 60_000;
/** Failed attempts allowed per login within the window. */
export const LOGIN_LIMIT = 5;
/** Failed attempts allowed per IP within the window (a class may share one IP). */
export const IP_LIMIT = 40;

export function isLocked(loginFailures: number, ipFailures: number) {
  return loginFailures >= LOGIN_LIMIT || ipFailures >= IP_LIMIT;
}

/**
 * The client address behind a proxy. Vercel overwrites X-Forwarded-For with
 * the real address (other proxies append it), so the last entry is the one
 * a client cannot forge.
 */
export function clientIp(forwardedFor: string | null, realIp: string | null) {
  const last = forwardedFor?.split(",").at(-1)?.trim();
  return last || realIp?.trim() || "unknown";
}

/** Only same-site paths are allowed as a post-login destination. */
export function safeNext(next: unknown) {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return null;
  return next;
}

/** Where a fresh sign-in lands: admins stay in /admin, students outside it. */
export function landingPath(role: "student" | "admin", next: string | null, locale: string) {
  if (role === "admin") return next?.startsWith("/admin") ? next : "/admin";
  return next && !next.startsWith("/admin") ? next : `/${locale}/learn`;
}
