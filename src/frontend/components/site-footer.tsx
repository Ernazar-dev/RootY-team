import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { Locale } from "@/shared/i18n/config";
import type { Messages } from "@/shared/i18n/messages/uz";
import { Logo } from "./logo";
import { UtcClock } from "./landing/utc-clock";

const container = "mx-auto w-full max-w-site px-4 sm:px-6 lg:px-10";

export function SiteFooter({ locale, t }: { locale: Locale; t: Messages }) {
  const links = [
    [`/${locale}`, t.nav.home],
    [`/${locale}/learn`, t.nav.learn],
    [`/${locale}/labs`, t.nav.labs],
    [`/${locale}/ctf`, t.nav.ctf],
  ];

  return (
    <footer className="mt-32 border-t border-border">
      <div className={`${container} grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.4fr]`}>
        <div className="space-y-5 sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-muted">{t.footer.tagline}</p>
          <p className="stamp inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[0.625rem] text-muted">
            <span className="pulse-dot size-1.5 rounded-full bg-success" />
            {t.footer.status}
          </p>
        </div>

        <div>
          <h2 className="stamp text-[0.6875rem] text-faint">{t.footer.sections}</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {links.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-muted transition-colors hover:text-text">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="stamp text-[0.6875rem] text-faint">{t.footer.ethicsTitle}</h2>
          <p className="mt-5 flex max-w-sm gap-3 text-sm leading-relaxed text-muted">
            <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
            {t.footer.ethics}
          </p>
        </div>
      </div>

      {/* Outlined wordmark. SVG textLength stretches it to exactly the
          container width, so it never overflows or gets clipped. */}
      <div aria-hidden data-reveal className={container}>
        <svg viewBox="0 0 1000 190" className="block w-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="footer-mark" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--accent-2)" stopOpacity="0.55" />
              <stop offset="0.5" stopColor="var(--border-strong)" />
              <stop offset="1" stopColor="var(--accent)" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <text
            x="500"
            y="168"
            textAnchor="middle"
            textLength="990"
            lengthAdjust="spacingAndGlyphs"
            className="font-sans"
            fontSize="215"
            fontWeight="800"
            fill="none"
            stroke="url(#footer-mark)"
            strokeWidth="1.5"
          >
            ROOTY
          </text>
        </svg>
      </div>

      <div className="mt-8 border-t border-border">
        <div className={`${container} stamp flex flex-col gap-3 py-5 text-[0.625rem] text-muted sm:flex-row sm:items-center sm:justify-between`}>
          <span>© RootY Team</span>
          <span className="flex items-center gap-3">
            {t.footer.session} RT-0001
            <span aria-hidden className="h-px w-6 bg-border-strong" />
            <UtcClock />
          </span>
        </div>
      </div>
    </footer>
  );
}
