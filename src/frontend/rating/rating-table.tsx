"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Locale } from "@/shared/i18n/config";
import { RankBadge } from "./rank-badge";
import { RANKS, rankOf } from "./ranks";
import type { Standing } from "./standings";
import { text } from "./text";

const medal = ["text-warning", "text-muted", "text-accent-2"];

const field =
  "h-9 rounded-lg border border-border bg-surface px-3 text-sm text-text outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30";

/** The full standings with name, rank and group filters. */
export function RatingTable({ rows, locale }: { rows: Standing[]; locale: Locale }) {
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState(0);
  const [group, setGroup] = useState("");

  const groups = useMemo(() => [...new Set(rows.map((r) => r.group).filter((g): g is string => !!g))].sort(), [rows]);
  const needle = query.trim().toLowerCase();
  const shown = rows.filter(
    (r) =>
      (!needle || r.name.toLowerCase().includes(needle)) &&
      (!tier || rankOf(r.points).tier === tier) &&
      (!group || r.group === group),
  );

  return (
    <section aria-labelledby="rating-table" className="rounded-card border border-border bg-surface/60">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4 sm:px-5">
        <h2 id="rating-table" className="font-semibold">
          {text.table[locale]}
        </h2>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <label className="relative w-full sm:w-52">
            <span className="sr-only">{text.search[locale]}</span>
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={text.search[locale]}
              className={`${field} w-full pl-9`}
            />
          </label>
          <label className="min-w-0 flex-1 sm:flex-none">
            <span className="sr-only">{text.allRanks[locale]}</span>
            <select value={tier} onChange={(e) => setTier(Number(e.target.value))} className={`${field} w-full sm:w-44`}>
              <option value={0}>{text.allRanks[locale]}</option>
              {RANKS.map((r) => (
                <option key={r.tier} value={r.tier}>
                  {r.name[locale]}
                </option>
              ))}
            </select>
          </label>
          {groups.length > 1 && (
            <label className="min-w-0 flex-1 sm:flex-none">
              <span className="sr-only">{text.allGroups[locale]}</span>
              <select value={group} onChange={(e) => setGroup(e.target.value)} className={`${field} w-full sm:w-40`}>
                <option value="">{text.allGroups[locale]}</option>
                {groups.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="p-5 text-sm text-muted">{text.nobody[locale]}</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="stamp text-left text-[0.625rem] text-faint">
              <th scope="col" className="w-12 px-3 py-2 text-center font-normal sm:px-5">
                #
              </th>
              <th scope="col" className="px-3 py-2 font-normal">
                {text.colStudent[locale]}
              </th>
              <th scope="col" className="hidden px-3 py-2 text-right font-normal sm:table-cell">
                {text.colCtf[locale]}
              </th>
              <th scope="col" className="hidden px-3 py-2 text-right font-normal sm:table-cell">
                {text.colLessons[locale]}
              </th>
              <th scope="col" className="px-3 py-2 text-right font-normal sm:px-5">
                {text.colPoints[locale]}
              </th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => {
              const rank = rankOf(r.points);
              return (
                <tr key={r.id} className={`border-t border-border ${r.me ? "bg-accent-soft/40" : ""}`}>
                  <td className="px-3 py-2.5 text-center font-mono text-faint sm:px-5">
                    <span className={r.rank <= 3 ? `font-semibold ${medal[r.rank - 1]}` : ""}>{r.rank}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <RankBadge tier={rank.tier} locale={locale} size={30} />
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {r.name}
                          {r.me && <span className="ml-2 text-xs font-normal text-accent-text">({text.you[locale]})</span>}
                        </p>
                        <p className="truncate text-xs">
                          <span style={{ color: rank.color }}>{rank.name[locale]}</span>
                          {r.group && <span className="text-faint"> · {r.group}</span>}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-3 py-2.5 text-right font-mono text-muted sm:table-cell">
                    {r.ctfPoints} <span className="text-xs text-faint">({r.solved})</span>
                  </td>
                  <td className="hidden px-3 py-2.5 text-right font-mono text-muted sm:table-cell">{r.lessons}</td>
                  <td className="px-3 py-2.5 text-right font-mono font-semibold sm:px-5">{r.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
