import { Suspense, type ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { ArrowUpRight, LoaderCircle, LogOut } from "lucide-react";
import { getCurrentUser } from "@/backend/auth/dal";
import { logout } from "@/backend/auth/actions";
import { AdminNav, AdminNavList } from "@/frontend/admin/admin-nav";
import { Logo } from "@/frontend/components/logo";
import { themeInitScript } from "@/frontend/components/theme-script";
import { fontVariables } from "@/frontend/fonts";
import "../globals.css";

// The admin panel is its own root layout: no language prefix, no site
// header, Uzbek only. Every page and action checks the admin role itself.

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin | RootY Team" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#090909" };

async function Account() {
  const user = await getCurrentUser();
  if (!user) return null;
  return (
    <div className="flex items-center gap-3">
      <span className="bg-signal grid size-9 shrink-0 place-items-center rounded-full font-mono text-xs font-bold text-white">
        {user.name.slice(0, 1).toUpperCase()}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{user.name}</span>
        <span className="block truncate font-mono text-xs text-muted">{user.login}</span>
      </span>
      <form action={logout}>
        <input type="hidden" name="redirectTo" value="/uz/login" />
        <button type="submit" aria-label="Chiqish" title="Chiqish" className="grid size-9 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-text">
          <LogOut aria-hidden className="size-4" />
        </button>
      </form>
    </div>
  );
}

function Loading() {
  return (
    <p className="flex items-center gap-2 text-sm text-muted">
      <LoaderCircle aria-hidden className="size-4 animate-spin" />
      Yuklanmoqda…
    </p>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz-Latn" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh font-sans antialiased lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="flex flex-col border-b border-border bg-surface/40 lg:sticky lg:top-0 lg:h-dvh lg:border-r lg:border-b-0">
          <div className="flex h-16 items-center justify-between gap-3 px-5">
            <Link href="/admin" aria-label="Admin bosh sahifa">
              <Logo compact />
            </Link>
            <span className="stamp rounded-full border border-accent/40 px-2 py-0.5 text-[0.5625rem] text-accent-text">Admin</span>
          </div>
          <Suspense fallback={<AdminNavList />}>
            <AdminNav />
          </Suspense>
          <div className="mt-auto hidden space-y-4 border-t border-border p-4 lg:block">
            <Link href="/uz" className="flex items-center gap-2 text-sm text-muted hover:text-text">
              <ArrowUpRight aria-hidden className="size-4" />
              Saytni ochish
            </Link>
            <Suspense>
              <Account />
            </Suspense>
          </div>
        </aside>
        <main className="min-w-0 px-4 py-8 sm:px-8 lg:py-10">
          <div className="mx-auto max-w-6xl">
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
        </main>
      </body>
    </html>
  );
}
