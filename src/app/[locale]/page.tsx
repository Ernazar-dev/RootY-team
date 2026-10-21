import type { CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ClipboardCheck,
  FlaskConical,
  ListChecks,
  Lock,
  MousePointerClick,
} from "lucide-react";
import { isLocale } from "@/shared/i18n/config";
import { messagesFor } from "@/shared/i18n/server";
import { getLessons } from "@/backend/lessons/catalog";
import { lessonPath } from "@/frontend/lessons/tracks";
import { LessonCard } from "@/frontend/components/lesson-card";
import { Hero } from "@/frontend/components/landing/hero";
import { Marquee } from "@/frontend/components/landing/marquee";
import { TerminalReplay, type TerminalLine } from "@/frontend/components/landing/terminal-replay";

const steps = [
  { key: "theory", icon: BookOpen },
  { key: "interactive", icon: MousePointerClick },
  { key: "lab", icon: FlaskConical },
  { key: "test", icon: ListChecks },
  { key: "task", icon: ClipboardCheck },
] as const;

/** Stagger delay for .rise / [data-reveal]. */
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const container = "mx-auto w-full max-w-site px-4 sm:px-6 lg:px-10";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const t = messagesFor(locale);
  const h = t.home;
  const lessons = await getLessons();
  const first = lessons[0];
  const firstHref = first ? lessonPath(locale, first) : `/${locale}/learn`;

  const labLines: TerminalLine[] = [
    { kind: "cmd", text: "rooty lab start sql-injection" },
    { kind: "info", text: h.lab.ready },
    { kind: "cmd", text: "curl \"lab.rooty.local/search?q=' OR '1'='1\"" },
    { kind: "warn", text: h.lab.vuln },
    { kind: "info", text: h.lab.fix },
    { kind: "cmd", text: "rooty lab verify" },
    { kind: "ok", text: h.lab.ok },
  ];

  return (
    <>
      <Hero t={t} firstHref={firstHref} />

      <Marquee />

      {/* ---------- Method ---------- */}
      <section id="method" className={`${container} scroll-mt-24 pt-28 sm:pt-36`}>
        <h2 data-reveal className="stamp-xl">
          {h.methodStamp}
        </h2>
        <div data-reveal className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-end" style={d(120)}>
          <p className="display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight">{h.methodTitle}</p>
          <p className="max-w-lg text-lg leading-relaxed font-light text-muted lg:justify-self-end">{h.methodLead}</p>
        </div>

        <div data-reveal className="relative mt-16">
          <div aria-hidden className="draw-x absolute top-5 right-0 left-0 hidden h-px bg-linear-to-r from-accent via-border-strong to-border lg:block" />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map(({ key, icon: Icon }, i) => (
              <li key={key} data-reveal className="flex flex-col" style={d(150 + i * 90)}>
                <span className="relative grid size-10 place-items-center rounded-full border border-border-strong bg-bg text-accent">
                  <Icon aria-hidden className="size-4" />
                </span>
                <div
                  data-spot
                  className="mt-6 flex-1 overflow-hidden rounded-card border border-border bg-surface/60 p-6 transition-colors hover:border-border-strong"
                >
                  <span aria-hidden className="pointer-events-none absolute -top-3 right-3 font-mono text-7xl font-light text-faint/25">
                    0{i + 1}
                  </span>
                  <h3 className="stamp text-xs text-text">{h.steps[key].title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{h.steps[key].text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Lab ---------- */}
      <section className={`${container} pt-28 sm:pt-36`}>
        <h2 data-reveal className="stamp-xl">
          {h.lab.stamp}
        </h2>
        <div className="mt-12 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div data-reveal style={d(100)}>
            <p className="display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02]">
              {h.lab.title1}
              <br />
              <span className="font-sans font-light not-italic">{h.lab.title2}</span>
            </p>
            <p className="mt-6 max-w-lg text-lg leading-relaxed font-light text-muted">{h.lab.lead}</p>
            <ul className="mt-8 max-w-lg divide-y divide-border border-y border-border">
              {[h.lab.p1, h.lab.p2, h.lab.p3].map((point, i) => (
                <li key={point} className="flex gap-5 py-4 text-sm">
                  <span className="font-mono text-faint">0{i + 1}</span>
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href={firstHref}
              className="group mt-8 inline-flex items-center gap-2 font-medium text-accent-text hover:text-text"
            >
              {h.lab.cta}
              <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div data-reveal className="relative" style={d(250)}>
            <div aria-hidden className="bloom -inset-10 opacity-25" />
            <div className="relative overflow-hidden rounded-card border border-border-strong bg-surface">
              <div className="flex items-center gap-2 border-b border-border px-5 py-3">
                <span className="size-2.5 rounded-full bg-faint/60" />
                <span className="size-2.5 rounded-full bg-faint/60" />
                <span className="size-2.5 rounded-full bg-faint/60" />
                <span className="ml-3 truncate font-mono text-xs text-muted">student@rooty: ~/lab</span>
                <span className="stamp ml-auto flex items-center gap-2 text-[0.625rem] text-success">
                  <span className="pulse-dot size-1.5 rounded-full bg-success" />
                  sandbox
                </span>
              </div>
              <TerminalReplay lines={labLines} className="min-h-[15rem] p-5 sm:p-6" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Lessons ---------- */}
      <section className={`${container} pt-28 sm:pt-36`}>
        <h2 data-reveal className="stamp-xl">
          {h.lessonsStamp}
        </h2>
        <div data-reveal className="mt-10 flex flex-wrap items-end justify-between gap-4" style={d(100)}>
          <p className="display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight">{h.latestTitle}</p>
          <Link href={`/${locale}/learn`} className="group inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-text">
            {h.allLessons}
            <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lessons.slice(0, 3).map((lesson, i) => (
            <li key={lesson.slug} data-reveal style={d(150 + i * 90)}>
              <LessonCard lesson={lesson} locale={locale} t={t} />
            </li>
          ))}
          {lessons.length < 3 && (
            <li data-reveal style={d(150 + lessons.length * 90)}>
              <div className="flex h-full min-h-56 flex-col justify-between rounded-card border border-dashed border-border-strong p-6">
                <Lock aria-hidden className="size-5 text-faint" />
                <div>
                  <p className="font-medium">{h.soonTitle}</p>
                  <p className="mt-1 text-sm text-muted">{h.soonText}</p>
                </div>
              </div>
            </li>
          )}
        </ul>
      </section>

      {/* ---------- CTA: the page's one violet bloom ---------- */}
      <section className={`${container} pt-28 sm:pt-36`}>
        <div data-reveal className="relative isolate overflow-hidden rounded-card bg-accent px-6 py-16 text-on-accent sm:px-14 sm:py-24">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top_right,#000,transparent_70%)]"
          />
          <div aria-hidden className="absolute -top-32 -right-32 -z-10 size-96 rounded-full bg-white/30 blur-3xl" />
          <p className="stamp text-[0.6875rem] opacity-70">RootY Team / {t.nav.start}</p>
          <h2 className="display mt-6 text-[clamp(2.5rem,7vw,5.75rem)] leading-[0.95]">
            {h.cta.title1}
            <br />
            <span className="font-sans font-light tracking-[-0.04em] not-italic">{h.cta.title2}</span>
          </h2>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href={firstHref}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-on-accent px-7 font-medium text-accent transition-transform hover:scale-[1.03]"
            >
              {h.cta.button}
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="max-w-sm text-sm opacity-80">{h.cta.text}</p>
          </div>
        </div>
      </section>
    </>
  );
}
