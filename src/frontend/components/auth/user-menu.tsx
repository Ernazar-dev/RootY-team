"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { logout } from "@/backend/auth/actions";
import type { SessionInfo } from "@/app/api/session/route";
import type { Locale } from "@/shared/i18n/config";
import type { Messages } from "@/shared/i18n/messages/uz";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

/**
 * Header account area. Pages are static, so who is signed in is asked from
 * /api/session in the browser, again after every navigation (a sign-in or
 * sign-out changes it without a full reload).
 */
export function UserMenu({ locale, t }: { locale: Locale; t: Messages["nav"] & { signedInAs: string } }) {
  const pathname = usePathname();
  const [user, setUser] = useState<SessionInfo["user"] | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/session", { signal: controller.signal, cache: "no-store" })
      .then((r) => r.json() as Promise<SessionInfo>)
      .then((info) => setUser(info.user))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close the menu on navigation
    setOpen(false);
    return () => controller.abort();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => root.current?.contains(e.target as Node) || setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Unknown yet: hold the space so the header does not jump.
  if (user === undefined) return <span aria-hidden className="hidden h-10 w-24 sm:block" />;

  if (!user) {
    return (
      <>
        <Link
          href={`/${locale}/login?next=${encodeURIComponent(pathname)}`}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border-strong px-3 text-sm font-medium transition-colors hover:border-text sm:px-4"
        >
          <LogIn aria-hidden className="size-4 sm:hidden" />
          <span className="sr-only sm:not-sr-only">{t.login}</span>
        </Link>
        <Link
          href={`/${locale}/learn`}
          className="bg-signal group hidden h-10 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white shadow-[0_6px_24px_-8px_var(--glow)] transition-[filter] hover:brightness-110 lg:inline-flex"
        >
          {t.start}
          <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </>
    );
  }

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${t.signedInAs} ${user.name}`}
        className="bg-signal grid size-10 place-items-center rounded-full font-mono text-sm font-bold text-white ring-2 ring-transparent transition hover:ring-accent/40"
      >
        {initials(user.name)}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-border-strong bg-surface shadow-2xl">
          <div className="border-b border-border px-4 py-3">
            <p className="text-xs text-muted">{t.signedInAs}</p>
            <p className="mt-0.5 truncate font-medium">{user.name}</p>
          </div>
          {user.role === "admin" && (
            <Link role="menuitem" href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-surface-2">
              <LayoutDashboard aria-hidden className="size-4 text-accent" />
              {t.admin}
            </Link>
          )}
          <form action={logout}>
            <input type="hidden" name="redirectTo" value={`/${locale}`} />
            <button role="menuitem" type="submit" className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-surface-2">
              <LogOut aria-hidden className="size-4 text-muted" />
              {t.logout}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
