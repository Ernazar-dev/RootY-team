import Link from "next/link";
import type { Locale } from "@/shared/i18n/config";
import type { Messages } from "@/shared/i18n/messages/uz";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";
import { NavLinks } from "./nav-links";
import { Logo } from "./logo";
import { UserMenu } from "./auth/user-menu";

export function SiteHeader({ locale, t }: { locale: Locale; t: Messages }) {
  const links = [
    { href: `/${locale}`, label: t.nav.home, exact: true },
    { href: `/${locale}/learn`, label: t.nav.learn },
    { href: `/${locale}/labs`, label: t.nav.labs },
    { href: `/${locale}/ctf`, label: t.nav.ctf },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-nav backdrop-blur-xl">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-4 focus:rounded-lg focus:bg-accent focus:px-3 focus:py-2 focus:text-on-accent"
      >
        {t.nav.skip}
      </a>
      {/* Logo left, links truly centred, settings right: equal 1fr side columns. */}
      <div className="mx-auto flex h-16 max-w-site items-center gap-6 px-4 sm:px-6 xl:grid xl:grid-cols-[1fr_auto_1fr] lg:px-10">
        <Link href={`/${locale}`} aria-label={t.nav.home} className="shrink-0 justify-self-start">
          <Logo />
        </Link>
        <nav aria-label={t.nav.menu} className="hidden xl:block">
          <NavLinks links={links} />
        </nav>
        <div className="ml-auto flex items-center gap-2 xl:ml-0 xl:justify-self-end">
          <LocaleSwitcher current={locale} label={t.language.label} />
          <ThemeToggle labels={{ ...t.theme }} />
          <UserMenu locale={locale} t={{ ...t.nav, signedInAs: t.auth.signedInAs }} />
        </div>
      </div>
      <nav aria-label={t.nav.menu} className="border-t border-border xl:hidden">
        <NavLinks links={links} className="mx-auto max-w-site overflow-x-auto px-1 [scrollbar-width:none] sm:px-3" />
      </nav>
    </header>
  );
}
