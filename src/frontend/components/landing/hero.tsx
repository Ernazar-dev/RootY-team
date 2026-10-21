import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Box, ChevronDown, Languages, UserCheck } from "lucide-react";
import type { Messages } from "@/shared/i18n/messages/uz";
import scene from "@/frontend/assets/hero-scene.webp";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

// Blurred rack lights on the left: [left %, top %, height rem, colour, speed s, delay ms]
const rack: [number, number, number, string, number, number][] = [
  [2, 12, 7, "var(--accent-2)", 4.5, 0],
  [5, 46, 4, "var(--accent)", 6, 900],
  [9, 22, 3, "#ec4899", 5.2, 400],
  [12, 62, 6, "var(--accent-2)", 7, 1800],
  [17, 8, 5, "var(--accent)", 5.6, 1200],
  [21, 74, 3, "var(--accent-2)", 4.8, 300],
];

/**
 * The first screen: a full-height photo scene (a defender at a SOC desk) with
 * the headline, two actions and three feature points on the left. Always
 * dark, whatever the site theme, because it sits on a night photo.
 */
export function Hero({ t, firstHref }: { t: Messages; firstHref: string }) {
  const h = t.home;
  const features = [
    { icon: Box, ...h.features.labs },
    { icon: UserCheck, ...h.features.teacher },
    { icon: Languages, ...h.features.langs },
  ];

  return (
    <section className="force-dark relative isolate overflow-hidden bg-bg text-text md:-mt-16">
      {/* ---- Scene ---- */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* Starts below the header (the section slides under it on md+) so
            the top panels of the scene stay visible; its left edge dissolves. */}
        <div className="absolute inset-y-0 right-0 w-full md:top-16 lg:w-[60%] lg:mask-[linear-gradient(to_right,transparent,#000_22%)]">
          <Image
            src={scene}
            alt=""
            fill
            priority
            placeholder="blur"
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover object-[70%_top] lg:object-top"
          />
        </div>
        {/* Fade the photo into the dark left column and the next section. */}
        <div className="absolute inset-0 bg-linear-to-r from-bg via-bg/85 to-bg/10 lg:from-bg/90 lg:via-bg/30 lg:to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-bg/90 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-b from-transparent to-bg" />
        <div className="bloom -top-48 -left-48 size-[36rem] opacity-25 [background:radial-gradient(circle,var(--accent-2),transparent_65%)]" />
        {rack.map(([left, top, height, color, speed, delay], i) => (
          <span
            key={i}
            className="rack-light"
            style={{ left: `${left}%`, top: `${top}%`, height: `${height}rem`, background: color, "--speed": `${speed}s`, ...d(delay) } as CSSProperties}
          />
        ))}
        <div className="grain" />
        <div className="scanline" />
      </div>

      {/* ---- Copy ---- */}
      <div className="mx-auto flex min-h-[100svh] w-full max-w-site items-center px-4 pt-10 pb-16 sm:px-6 lg:px-10 md:pt-28">
        <div className="max-w-[46rem]">
          <p className="rise text-sm font-light tracking-[0.08em] text-text/80 uppercase sm:text-lg" style={d(0)}>
            {h.kicker}
          </p>

          <h1 className="mt-4 text-[clamp(1.75rem,7.6vw,3.75rem)] leading-[1.02] font-extrabold tracking-[-0.01em] uppercase">
            <span className="rise block" style={d(120)}>
              {h.title1}
            </span>
            <span className="rise text-signal block" style={d(260)}>
              {h.title2}
            </span>
            <span className="rise block" style={d(400)}>
              {h.title3}
            </span>
          </h1>

          <p className="rise mt-6 max-w-xl text-base leading-relaxed text-text/85 sm:text-lg" style={d(560)}>
            {h.lead}
          </p>

          <div className="rise mt-9 flex flex-col gap-3 sm:flex-row" style={d(700)}>
            <Link
              href={firstHref}
              className="bg-signal group inline-flex h-14 items-center justify-center gap-3 rounded-xl px-9 font-semibold text-white shadow-[0_10px_40px_-8px_var(--glow)] transition-[filter,transform] hover:-translate-y-0.5 hover:brightness-110"
            >
              {h.start}
              <ArrowRight aria-hidden className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#method"
              className="group inline-flex h-14 items-center justify-center gap-3 rounded-xl border border-white/25 bg-white/5 px-7 font-medium backdrop-blur transition-colors hover:border-white/50 hover:bg-white/10"
            >
              <span className="grid size-7 place-items-center rounded-full border border-current">
                <ChevronDown aria-hidden className="size-4 transition-transform group-hover:translate-y-0.5" />
              </span>
              {h.how}
            </a>
          </div>

          <ul className="rise mt-12 grid gap-6 sm:grid-cols-3 sm:gap-8" style={d(840)}>
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-3">
                <Icon aria-hidden className="size-8 shrink-0 text-accent-2" strokeWidth={1.5} />
                <span>
                  <span className="block text-sm font-semibold">{title}</span>
                  <span className="mt-0.5 block text-sm text-muted">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
