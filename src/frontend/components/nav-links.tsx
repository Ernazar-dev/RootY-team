"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string; exact?: boolean };

/** Main navigation; the current section gets the gradient underline. */
export function NavLinks({ links, className = "" }: { links: NavLink[]; className?: string }) {
  const pathname = usePathname();

  return (
    <ul className={`flex ${className}`}>
      {links.map(({ href, label, exact }) => {
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={`relative flex px-3 py-2 text-[0.9375rem] whitespace-nowrap transition-colors lg:px-4 ${
                active ? "text-text" : "text-text/70 hover:text-text"
              }`}
            >
              {label}
              {active && <span aria-hidden className="bg-signal absolute inset-x-3 -bottom-px h-0.5 rounded-full lg:inset-x-4" />}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
