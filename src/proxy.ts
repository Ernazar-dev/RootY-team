import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, localeCookie, negotiateLocale } from "@/shared/i18n/config";
import { findSession } from "@/backend/auth/session-lookup";

// Same name as SESSION_COOKIE in backend/auth/session.ts (not imported:
// that module is server-only and the proxy runs outside that layer).
const SESSION_COOKIE = "rooty_session";

/** Pages a signed-out visitor may open: the landing page and the login page. */
const isPublic = (rest: string) => rest === "" || rest === "/" || rest === "/login" || rest.startsWith("/login/");

// The site is closed: accounts are handed out from the admin panel, and a
// signed-out visitor sees only the landing page. Everything else redirects
// to the login page and comes back after signing in.
//
// The lesson pages are prerendered static output (ensureStatic), so they
// cannot read cookies themselves; this is where the session is checked,
// against the database, on every page request and client navigation.
// Admin pages and Server Actions still check again on their own.
async function signedIn(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    return (await findSession(token)) !== null;
  } catch (error) {
    // No database, or it is down: fail closed. The login page explains.
    console.error("[proxy] session check failed", error);
    return false;
  }
}

function toLogin(request: NextRequest, locale: string) {
  const { pathname, search } = request.nextUrl;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}/login`;
  url.search = `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

// Every page lives under a language prefix (/uz, /kaa, /ru, /en). A URL
// without one is redirected to the visitor's saved choice, else to the
// browser's Accept-Language, else to Uzbek. The admin panel is the
// exception: it has no language prefix.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    // The admin role itself is checked by requireAdmin() on every admin
    // page and action; here only "signed in at all".
    return (await signedIn(request)) ? NextResponse.next() : toLogin(request, defaultLocale);
  }

  const first = pathname.split("/")[1];
  if (isLocale(first)) {
    if (isPublic(pathname.slice(first.length + 1)) || (await signedIn(request))) return NextResponse.next();
    return toLogin(request, first);
  }

  const saved = request.cookies.get(localeCookie)?.value;
  const locale = isLocale(saved)
    ? saved
    : negotiateLocale(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip route handlers, framework internals and files with an extension.
  matcher: ["/((?!api/|_next/|.*\\..*).*)"],
};
