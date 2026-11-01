import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Crown, Flag, GraduationCap, Lock, Medal, Trophy, Users } from "lucide-react";
import { isLocale, type Locale } from "@/shared/i18n/config";
import { format } from "@/shared/i18n/format";
import { getCurrentUser } from "@/backend/auth/dal";
import { getStandings } from "@/backend/services/rating";
import { RankBadge } from "@/frontend/rating/rank-badge";
import { RatingTable } from "@/frontend/rating/rating-table";
import { LESSON_POINTS, RANKS, rankOf, rankProgress, rankRange } from "@/frontend/rating/ranks";
import type { Standing } from "@/frontend/rating/standings";
import { text } from "@/frontend/rating/text";

export async function generateMetadata({ params }: PageProps<"/[locale]/rating">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: text.title[locale], description: text.lead[locale] } : {};
}

// The competition page: overall standings across CTF and lessons, with
// ranks unlocked by points. Scores come from backend/services/rating.ts.
export default async function RatingPage({ params }: PageProps<"/[locale]/rating">) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  return (
    <div className="mx-auto max-w-site px-4 pt-16 pb-16 sm:px-6 lg:px-10 sm:pt-24">
      <p className="stamp text-[0.6875rem] text-muted">{text.eyebrow[locale]}</p>
      <h1 className="stamp-xl mt-6">{text.title[locale]}</h1>
      <p className="mt-8 max-w-2xl text-lg leading-relaxed font-light text-muted">{text.lead[locale]}</p>
      {/* Standings depend on the visitor's session, so they stream in. */}
      <Suspense fallback={<div className="mt-10 min-h-[60svh]" aria-busy />}>
        <Board locale={locale} />
      </Suspense>
    </div>
  );
}

async function Board({ locale }: { locale: Locale }) {
  const user = await getCurrentUser();
  const rows = await getStandings(user?.id ?? null);
  const me = rows.find((r) => r.me) ?? null;
  const ranked = rows.filter((r) => r.points > 0);

  return (
    <div className="mt-10 space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        {me ? <MyRank me={me} locale={locale} /> : !user && <SignIn locale={locale} />}
        <Ladder locale={locale} points={me?.points} />
      </div>

      {ranked.length === 0 ? (
        <p className="rounded-card border border-border bg-surface/60 p-6 text-sm text-muted">{text.empty[locale]}</p>
      ) : (
        <>
          <Podium rows={ranked.slice(0, 3)} locale={locale} />
          <RatingTable rows={rows} locale={locale} />
          <Stats rows={ranked} locale={locale} />
        </>
      )}

      <How locale={locale} />
    </div>
  );
}

function Bar({ points }: { points: number }) {
  const rank = rankOf(points);
  const next = RANKS[rank.tier];
  return (
    <div className="h-2 overflow-hidden rounded-full bg-surface-2">
      <div
        className="h-full rounded-full"
        style={{
          width: `${rankProgress(points, rank)}%`,
          background: `linear-gradient(90deg, ${rank.color}, ${next?.color ?? rank.color})`,
        }}
      />
    </div>
  );
}

function MyRank({ me, locale }: { me: Standing; locale: Locale }) {
  const rank = rankOf(me.points);
  const next = rank.next === null ? null : RANKS[rank.tier];
  return (
    <section
      aria-labelledby="my-rank"
      className="rounded-card border bg-surface/60 p-5 sm:p-6"
      style={{ borderColor: `${rank.color}55`, backgroundImage: `linear-gradient(135deg, transparent 55%, ${rank.color}1a)` }}
    >
      <div className="flex flex-wrap items-center gap-5">
        <RankBadge tier={rank.tier} locale={locale} size={96} />
        <div className="min-w-56 flex-1 space-y-2">
          <p id="my-rank" className="stamp text-[0.625rem] text-faint">
            {text.myRank[locale]} · {rank.tier}/{RANKS.length}
          </p>
          <p className="text-2xl leading-tight font-bold" style={{ color: rank.color }}>
            {rank.name[locale]}
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-success-soft px-2.5 py-1 font-mono font-semibold text-success">
              {me.points} {text.points[locale]}
            </span>
            {me.points > 0 && (
              <span className="rounded-full bg-accent-soft px-2.5 py-1 font-mono text-accent-text">
                {format(text.place[locale], { n: me.rank })}
              </span>
            )}
          </div>
          <Bar points={me.points} />
          {next ? (
            <div className="flex items-center justify-between gap-2 text-sm text-muted">
              <span>{format(text.nextRank[locale], { rank: next.name[locale], n: next.min - me.points })}</span>
              <RankBadge tier={next.tier} locale={locale} size={26} locked />
            </div>
          ) : (
            <p className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: rank.color }}>
              <Crown aria-hidden className="size-4" /> {text.topRank[locale]}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function SignIn({ locale }: { locale: Locale }) {
  return (
    <section className="flex flex-col items-start justify-center gap-4 rounded-card border border-border bg-surface/60 p-6">
      <RankBadge tier={1} locale={locale} size={64} locked />
      <p className="text-muted">{text.signIn[locale]}</p>
      <Link
        href={`/${locale}/login?next=/${locale}/rating`}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:bg-accent-hover"
      >
        {text.signInCta[locale]}
      </Link>
    </section>
  );
}

function Ladder({ locale, points }: { locale: Locale; points?: number }) {
  const current = points === undefined ? null : rankOf(points).tier;
  return (
    <section aria-labelledby="rank-ladder" className="rounded-card border border-border bg-surface/60 p-5">
      <h2 id="rank-ladder" className="font-semibold">
        {text.ladder[locale]}
      </h2>
      <ol className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6">
        {RANKS.map((r) => {
          const reached = current !== null && r.tier <= current;
          const isCurrent = r.tier === current;
          const locked = current !== null && !reached;
          return (
            <li
              key={r.tier}
              aria-current={isCurrent ? "step" : undefined}
              className={`relative flex flex-col items-center gap-1.5 rounded-xl border px-1.5 py-3 text-center ${
                isCurrent ? "" : "border-border"
              }`}
              style={isCurrent ? { borderColor: r.color, background: `${r.color}14`, boxShadow: `0 0 0 3px ${r.color}22` } : undefined}
            >
              <RankBadge tier={r.tier} locale={locale} size={44} locked={locked} />
              {locked && <Lock aria-hidden className="absolute top-2 right-2 size-3 text-faint" />}
              {reached && !isCurrent && <CheckCircle2 aria-hidden className="absolute top-2 right-2 size-3.5 text-success" />}
              <span className={`text-xs leading-tight font-semibold ${locked ? "text-faint" : ""}`}>{r.name[locale]}</span>
              <span className="font-mono text-[0.6875rem] text-faint">{rankRange(r)}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

const podium = [
  { ring: "border-warning/50 bg-warning-soft/60", icon: "text-warning" },
  { ring: "border-border-strong bg-surface-2/60", icon: "text-muted" },
  { ring: "border-accent-2/40 bg-surface/60", icon: "text-accent-2" },
];

function Podium({ rows, locale }: { rows: Standing[]; locale: Locale }) {
  return (
    <ol className="grid grid-cols-3 gap-2 sm:gap-4">
      {rows.map((r) => {
        const rank = rankOf(r.points);
        const style = podium[r.rank - 1];
        return (
          <li
            key={r.id}
            className={`flex min-w-0 flex-col items-center gap-1.5 rounded-card border px-2 py-4 text-center sm:gap-2 sm:p-6 ${style.ring} ${
              r.rank === 1 ? "sm:-translate-y-2" : ""
            }`}
          >
            {r.rank === 1 ? (
              <Crown aria-label="#1" className={`size-5 ${style.icon}`} />
            ) : (
              <Trophy aria-label={`#${r.rank}`} className={`size-5 ${style.icon}`} />
            )}
            <RankBadge tier={rank.tier} locale={locale} size={r.rank === 1 ? 64 : 52} />
            <p className="w-full truncate text-sm font-semibold sm:text-base">
              {r.name}
              {r.me && <span className="ml-1 text-xs font-normal text-accent-text">({text.you[locale]})</span>}
            </p>
            <p className="text-xs font-medium" style={{ color: rank.color }}>
              {rank.name[locale]}
            </p>
            <p className="font-mono text-base font-bold sm:text-lg">
              {r.points} <span className="text-xs font-normal text-muted">{text.points[locale]}</span>
            </p>
            {r.group && <p className="hidden w-full truncate text-xs text-faint sm:block">{r.group}</p>}
          </li>
        );
      })}
    </ol>
  );
}

function Stats({ rows, locale }: { rows: Standing[]; locale: Locale }) {
  const total = rows.reduce((s, r) => s + r.points, 0);
  const stats = [
    { label: text.statPlayers[locale], value: rows.length, Icon: Users },
    { label: text.statMax[locale], value: rows[0]?.points ?? 0, Icon: Trophy },
    { label: text.statAvg[locale], value: rows.length ? Math.round(total / rows.length) : 0, Icon: Medal },
    { label: text.statTasks[locale], value: rows.reduce((s, r) => s + r.solved + r.lessons, 0), Icon: CheckCircle2 },
  ];
  return (
    <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map(({ label, value, Icon }) => (
        <div key={label} className="rounded-card border border-border bg-surface/60 p-4">
          <dt className="flex items-center gap-2 text-xs text-muted">
            <Icon aria-hidden className="size-4 text-accent" /> {label}
          </dt>
          <dd className="mt-2 font-mono text-2xl font-bold">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function How({ locale }: { locale: Locale }) {
  return (
    <section aria-labelledby="how-points" className="rounded-card border border-border bg-surface/60 p-5">
      <h2 id="how-points" className="font-semibold">
        {text.howTitle[locale]}
      </h2>
      <ul className="mt-3 space-y-2 text-sm text-muted">
        <li className="flex gap-2">
          <Flag aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" /> {text.howCtf[locale]}
        </li>
        <li className="flex gap-2">
          <GraduationCap aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />{" "}
          {format(text.howLesson[locale], { n: LESSON_POINTS })}
        </li>
      </ul>
      <p className="mt-3 text-xs text-faint">{text.howFair[locale]}</p>
    </section>
  );
}
