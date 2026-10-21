"use client";

import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import {
  localeCookie,
  localeNames,
  locales,
  switchLocalePath,
  type Locale,
} from "@/shared/i18n/config";

export function LocaleSwitcher({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname();

  function change(next: Locale) {
    document.cookie = `${localeCookie}=${next}; path=/; max-age=31536000; samesite=lax`;
    // A full load, not router.push: the locale is the root layout, and a client
    // re-render of <html> would drop the data-theme set by the inline script.
    window.location.assign(switchLocalePath(pathname, next));
  }

  return (
    <label className="relative flex items-center">
      <span className="sr-only">{label}</span>
      <Languages aria-hidden className="pointer-events-none absolute left-2.5 size-4 text-muted" />
      <select
        name="locale"
        value={current}
        onChange={(event) => change(event.target.value as Locale)}
        className="h-9 cursor-pointer appearance-none rounded-lg border border-border bg-bg pr-3 pl-8 text-sm text-muted transition-colors hover:border-border-strong hover:text-text"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale} lang={locale}>
            {localeNames[locale]}
          </option>
        ))}
      </select>
    </label>
  );
}
