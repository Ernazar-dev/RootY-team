import { Suspense, type CSSProperties } from "react";
import type { Metadata } from "next";
import { KeyRound, ShieldCheck } from "lucide-react";
import { isLocale } from "@/shared/i18n/config";
import { messagesFor } from "@/shared/i18n/server";
import { LoginForm } from "@/frontend/components/auth/login-form";

export async function generateMetadata({ params }: PageProps<"/[locale]/login">): Promise<Metadata> {
  const { locale } = await params;
  // Nothing to find here for search engines.
  return isLocale(locale) ? { title: messagesFor(locale).auth.title, robots: { index: false } } : {};
}

export default async function LoginPage({ params }: PageProps<"/[locale]/login">) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const t = messagesFor(locale);

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="bloom -top-40 right-0 size-[34rem] opacity-30" />
        <div className="bloom -bottom-40 -left-40 size-[28rem] opacity-20 [background:radial-gradient(circle,var(--accent-2),transparent_65%)]" />
        <div className="grain" />
      </div>

      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-site items-center gap-12 px-4 py-16 sm:px-6 lg:px-10 lg:grid-cols-[1fr_28rem]">
        <div className="rise">
          <p className="stamp flex items-center gap-2 text-[0.6875rem] text-muted">
            <ShieldCheck aria-hidden className="size-4 text-accent" />
            RootY Team
          </p>
          <h1 className="mt-6 text-[clamp(2.25rem,6vw,4rem)] leading-[1.02] font-extrabold tracking-tight uppercase">
            {t.auth.title}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{t.auth.lead}</p>
        </div>

        <div
          className="rise rounded-card border border-border-strong bg-surface/70 p-6 shadow-[0_30px_80px_-40px_var(--glow)] backdrop-blur sm:p-8"
          style={{ "--d": "150ms" } as CSSProperties}
        >
          <span className="bg-signal mb-6 grid size-12 place-items-center rounded-xl text-white">
            <KeyRound aria-hidden className="size-5" />
          </span>
          <Suspense>
            <LoginForm locale={locale} t={t.auth} />
          </Suspense>
          <p className="mt-6 border-t border-border pt-5 text-sm text-muted">{t.auth.noAccount}</p>
        </div>
      </div>
    </section>
  );
}
