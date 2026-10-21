"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Flag, LayoutDashboard, Users, UsersRound } from "lucide-react";

const items = [
  { href: "/admin", label: "Umumiy ko‘rinish", icon: LayoutDashboard, exact: true },
  { href: "/admin/students", label: "O‘quvchilar", icon: Users },
  { href: "/admin/groups", label: "Guruhlar", icon: UsersRound },
  { href: "/admin/lessons", label: "Darslar", icon: BookOpen },
  { href: "/admin/ctf", label: "CTF natijalari", icon: Flag },
];

/** The menu without a highlighted item: the Suspense fallback while the path is unknown. */
export function AdminNavList({ pathname }: { pathname?: string }) {
  return (
    <nav aria-label="Admin menyu" className="px-3 py-2">
      <ul className="flex gap-1 overflow-x-auto [scrollbar-width:none] lg:flex-col">
        {items.map(({ href, label, icon: Icon, exact }) => {
          const active = pathname !== undefined && (exact ? pathname === href : pathname.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm whitespace-nowrap transition-colors ${
                  active ? "bg-accent-soft font-medium text-text" : "text-muted hover:bg-surface-2 hover:text-text"
                }`}
              >
                <Icon aria-hidden className={`size-4 ${active ? "text-accent" : ""}`} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** The menu with the current section highlighted. Render inside <Suspense>. */
export function AdminNav() {
  return <AdminNavList pathname={usePathname()} />;
}
