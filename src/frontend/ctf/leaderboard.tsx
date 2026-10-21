import { Medal, Trophy } from "lucide-react";
import type { Locale, Localized } from "@/shared/i18n/config";
import { format } from "@/shared/i18n/format";

// The CTF leaderboard panel. The rows are computed on the server
// (backend/services/ctf.ts) from saved solves, so editing browser storage
// cannot move anyone up the table.

export type LeaderboardRow = {
  id: string;
  rank: number;
  name: string;
  group: string | null;
  score: number;
  solved: number;
  me: boolean;
};

export type LeaderboardData = { top: LeaderboardRow[]; me: LeaderboardRow | null; players: number };

const text = {
  title: { uz: "Reyting", kaa: "Reyting", ru: "Рейтинг", en: "Leaderboard" },
  players: { uz: "{n} ishtirokchi", kaa: "{n} qatnasıwshı", ru: "участников: {n}", en: "{n} players" },
  empty: {
    uz: "Hali hech kim flag topmagan. Birinchi bo‘ling!",
    kaa: "Ele hesh kim flag tappadı. Birinshi bolıń!",
    ru: "Пока никто не нашёл флаг. Будьте первым!",
    en: "Nobody has found a flag yet. Be the first!",
  },
  you: { uz: "siz", kaa: "siz", ru: "вы", en: "you" },
  solved: { uz: "{n} ta yechim", kaa: "{n} sheshim", ru: "решено: {n}", en: "{n} solved" },
  points: { uz: "ball", kaa: "ball", ru: "очк.", en: "pts" },
  server: {
    uz: "Reytingga faqat tizimga kirgan o‘quvchilarning serverda saqlangan yechimlari kiradi.",
    kaa: "Reytingke tek sistemaǵa kirgen oqıwshılardıń serverde saqlanǵan sheshimleri kiredi.",
    ru: "В рейтинг попадают только решения учеников, сохранённые на сервере.",
    en: "Only signed-in students’ solves saved on the server count towards the board.",
  },
} satisfies Record<string, Localized>;

const medal = ["text-warning", "text-muted", "text-accent-2"];

function Row({ row, locale }: { row: LeaderboardRow; locale: Locale }) {
  return (
    <li
      className={`flex items-center gap-3 rounded-lg px-3 py-2 ${row.me ? "border border-accent bg-accent-soft/40" : "border border-transparent"}`}
    >
      <span className="w-7 shrink-0 text-center font-mono text-sm text-faint">
        {row.rank <= 3 ? <Medal aria-label={`#${row.rank}`} className={`mx-auto size-4 ${medal[row.rank - 1]}`} /> : row.rank}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">
          {row.name}
          {row.me && <span className="ml-2 text-xs font-normal text-accent-text">({text.you[locale]})</span>}
        </span>
        <span className="block truncate text-xs text-faint">
          {row.group ? `${row.group} · ` : ""}
          {format(text.solved[locale], { n: row.solved })}
        </span>
      </span>
      <span className="shrink-0 font-mono text-sm">
        {row.score} <span className="text-xs text-muted">{text.points[locale]}</span>
      </span>
    </li>
  );
}

export function Leaderboard({ data, locale }: { data: LeaderboardData; locale: Locale }) {
  return (
    <section aria-labelledby="ctf-board" className="rounded-card border border-border bg-surface/60 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="ctf-board" className="flex items-center gap-2 font-semibold">
          <Trophy aria-hidden className="size-4 text-accent" /> {text.title[locale]}
        </h2>
        {data.players > 0 && <span className="text-xs text-muted">{format(text.players[locale], { n: data.players })}</span>}
      </div>

      {data.top.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{text.empty[locale]}</p>
      ) : (
        <ol className="mt-3 space-y-1">
          {data.top.map((row) => (
            <Row key={row.id} row={row} locale={locale} />
          ))}
          {data.me && (
            <>
              <li aria-hidden className="px-3 text-center text-faint">
                ⋯
              </li>
              <Row row={data.me} locale={locale} />
            </>
          )}
        </ol>
      )}
      <p className="mt-3 text-xs text-faint">{text.server[locale]}</p>
    </section>
  );
}
