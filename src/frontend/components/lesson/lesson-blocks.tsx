import { AlertTriangle, BookOpen, Bookmark, Check, Info, Lightbulb, Target, TerminalSquare } from "lucide-react";
import type { Locale } from "@/shared/i18n/config";
import type { Messages } from "@/shared/i18n/messages/uz";
import type { Block } from "@/frontend/lessons/types";
import { Inline, RichText } from "./rich-text";
import { SelfCheck } from "./self-check";
import { Widget } from "./widgets";

const callouts = {
  info: { icon: Info, box: "border-accent/40 bg-accent-soft", tint: "text-accent" },
  tip: { icon: Lightbulb, box: "border-success/40 bg-success-soft", tint: "text-success" },
  warn: { icon: AlertTriangle, box: "border-warning/40 bg-warning-soft", tint: "text-warning" },
};

export function LessonBlocks({ slug, blocks, locale, t }: { slug: string; blocks: Block[]; locale: Locale; t: Messages }) {
  // Position of each check among the lesson's checks (how answers are stored).
  const checkIndex = new Map(blocks.filter((b) => b.kind === "check").map((b, n) => [b, n]));
  return (
    <div className="space-y-6 text-[1.0625rem] leading-relaxed [&_p+p]:mt-4">
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "heading":
            return (
              <h2 key={i} id={block.id} className="scroll-mt-24 pt-6 text-2xl font-semibold tracking-tight">
                {block.text[locale]}
              </h2>
            );
          case "text":
            return (
              <div key={i}>
                <RichText text={block.text[locale]} />
              </div>
            );
          case "callout": {
            const { icon: Icon, box, tint } = callouts[block.tone];
            return (
              <aside key={i} className={`flex gap-3 rounded-2xl border p-4 sm:p-5 ${box}`}>
                <Icon aria-hidden className={`mt-1 size-5 shrink-0 ${tint}`} />
                <div>
                  <p className={`text-sm font-semibold ${tint}`}>{t.callout[block.tone]}</p>
                  <div className="mt-1">
                    <RichText text={block.text[locale]} />
                  </div>
                </div>
              </aside>
            );
          }
          case "code":
            return (
              <figure key={i}>
                <pre className="overflow-x-auto rounded-2xl border border-border bg-code p-4 font-mono text-sm leading-6">
                  <code>{typeof block.code === "string" ? block.code : block.code[locale]}</code>
                </pre>
                {block.caption && (
                  <figcaption className="mt-2 text-sm text-muted">
                    <Inline text={block.caption[locale]} />
                  </figcaption>
                )}
              </figure>
            );
          case "goals":
            return (
              <section key={i} className="rounded-2xl border border-accent/40 bg-accent-soft p-5 sm:p-6">
                <h2 className="flex items-center gap-2 font-semibold text-accent-text">
                  <Target aria-hidden className="size-5" /> {t.lesson.goals}
                </h2>
                <ul className="mt-3 space-y-2">
                  {block.items.map((item, n) => (
                    <li key={n} className="flex gap-2.5">
                      <Check aria-hidden className="mt-1 size-4 shrink-0 text-accent" />
                      <span>
                        <Inline text={item[locale]} />
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          case "terms":
            return (
              <section key={i} className="rounded-2xl border border-border p-5 sm:p-6">
                <h3 className="flex items-center gap-2 font-semibold">
                  <BookOpen aria-hidden className="size-5 text-accent" /> {t.lesson.terms}
                </h3>
                <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr]">
                  {block.items.map((item) => (
                    <div key={item.term} className="contents">
                      <dt className="font-mono text-sm font-semibold text-accent-text sm:pt-0.5">{item.term}</dt>
                      <dd className="text-muted">
                        <Inline text={item.text[locale]} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          case "steps":
            return (
              <section key={i}>
                <h3 className="flex items-center gap-2 font-semibold">
                  <TerminalSquare aria-hidden className="size-5 text-accent" /> {t.lesson.steps}
                </h3>
                <ol className="mt-4 space-y-6">
                  {block.items.map((step, n) => (
                    <li key={n} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
                      <span className="grid size-8 place-items-center rounded-full bg-accent font-mono text-sm font-semibold text-on-accent">
                        {n + 1}
                      </span>
                      <div className="min-w-0 space-y-2 pt-0.5">
                        <RichText text={step.text[locale]} />
                        {step.code && (
                          <pre className="overflow-x-auto rounded-xl border border-border bg-code px-4 py-3 font-mono text-sm">
                            <code>
                              {step.code.split("\n").map((line, k) => (
                                <span key={k} className="block">
                                  {(step.prompt ?? "$") && (
                                    <span aria-hidden className="text-accent select-none">{`${step.prompt ?? "$"} `}</span>
                                  )}
                                  {line}
                                </span>
                              ))}
                            </code>
                          </pre>
                        )}
                        {step.output && (
                          <div>
                            <p className="text-xs font-medium text-muted">{t.lesson.output}</p>
                            <pre className="mt-1 overflow-x-auto rounded-xl border border-dashed border-border px-4 py-3 font-mono text-sm text-muted">
                              {typeof step.output === "string" ? step.output : step.output[locale]}
                            </pre>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            );
          case "summary":
            return (
              <section key={i} className="rounded-2xl border border-success/40 bg-success-soft p-5 sm:p-6">
                <h3 className="flex items-center gap-2 font-semibold text-success">
                  <Bookmark aria-hidden className="size-5" /> {t.lesson.summary}
                </h3>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 marker:text-success">
                  {block.items.map((item, n) => (
                    <li key={n}>
                      <Inline text={item[locale]} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          case "widget":
            return <Widget key={i} id={block.widget} locale={locale} />;
          case "check":
            return (
              <SelfCheck
                key={i}
                slug={slug}
                checkIndex={checkIndex.get(block)!}
                question={block.question[locale]}
                options={block.options.map((option) => option[locale])}
                answer={block.answer}
                explain={block.explain[locale]}
                labels={t.lesson}
              />
            );
        }
      })}
    </div>
  );
}
