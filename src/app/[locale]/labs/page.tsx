import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { isLocale } from "@/shared/i18n/config";
import { messagesFor } from "@/shared/i18n/server";
import { labs, labsIntro } from "@/frontend/labs/labs";

export async function generateMetadata({ params }: PageProps<"/[locale]/labs">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: messagesFor(locale).nav.labs, description: labsIntro.lead[locale] } : {};
}

export default async function LabsPage({ params }: PageProps<"/[locale]/labs">) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const t = messagesFor(locale);

  return (
    <div className="mx-auto max-w-site px-4 pt-16 sm:px-6 lg:px-10 sm:pt-24">
      <p className="stamp text-[0.6875rem] text-muted">{labsIntro.eyebrow[locale]}</p>
      <h1 className="stamp-xl mt-6">{t.nav.labs}</h1>
      <p className="mt-8 max-w-2xl text-lg leading-relaxed font-light text-muted">{labsIntro.lead[locale]}</p>

      <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {labs.map((lab) => {
          const body = (
            <>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-faint">{String(lab.order).padStart(2, "0")}</span>
                <span
                  className={`stamp rounded-full border px-2.5 py-1 text-[0.625rem] ${lab.open ? "border-accent text-accent" : "border-border text-muted"}`}
                >
                  {lab.open ? labsIntro.open[locale] : labsIntro.soon[locale]}
                </span>
              </div>
              <h2 className="mt-10 text-2xl leading-snug font-medium tracking-tight">{lab.title[locale]}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{lab.summary[locale]}</p>
              {lab.topics.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {lab.topics.map((topic) => (
                    <li key={topic.en} className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-muted">
                      {topic[locale]}
                    </li>
                  ))}
                </ul>
              )}
              {lab.open && (
                <div className="mt-auto flex justify-end pt-8 text-muted">
                  <span className="grid size-8 place-items-center rounded-full border border-border transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
                    <ArrowUpRight aria-hidden className="size-4" />
                  </span>
                </div>
              )}
            </>
          );
          const box = "flex h-full min-h-64 flex-col overflow-hidden rounded-card border p-6";
          return (
            <li key={lab.slug}>
              {lab.open ? (
                <Link
                  href={`/${locale}/labs/${lab.slug}`}
                  data-spot
                  className={`group ${box} border-border bg-surface/60 transition-colors hover:border-border-strong`}
                >
                  {body}
                </Link>
              ) : (
                <div className={`${box} border-dashed border-border bg-surface/30 opacity-70`}>{body}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
