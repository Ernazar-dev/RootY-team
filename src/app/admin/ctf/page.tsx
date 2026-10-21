import type { Metadata } from "next";
import Link from "next/link";
import { Flag, Medal, Trophy, Users } from "lucide-react";
import { listGroups } from "@/backend/services/admin";
import { getCtfOverview } from "@/backend/services/ctf";
import { PageHeader, Stat } from "@/frontend/admin/parts";
import { percent, timeAgo } from "@/frontend/admin/format";
import { ui } from "@/frontend/admin/ui";

export const metadata: Metadata = { title: "CTF natijalari" };

const medal = ["text-warning", "text-muted", "text-accent-2"];

export default async function AdminCtfPage({ searchParams }: PageProps<"/admin/ctf">) {
  const { group } = await searchParams;
  const groupId = Number(group) > 0 ? Number(group) : undefined;
  const [groups, overview] = await Promise.all([listGroups(), getCtfOverview(groupId)]);
  const current = groups.find((g) => g.id === groupId);
  const players = overview.students.length;

  // Hardest first: fewest solves, then most hints used.
  const byDifficulty = [...overview.challenges].sort((a, b) => a.solves - b.solves || b.avgHints - a.avgHints);

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm transition-colors ${active ? "border-accent bg-accent-soft text-text" : "border-border text-muted hover:border-border-strong hover:text-text"}`;

  return (
    <>
      <PageHeader title="CTF natijalari" lead="Kim qancha ball to‘pladi va qaysi topshiriq qiyin bo‘lyapti. Ballar arenadagi qoida bilan hisoblanadi: har bir ochilgan ishora ballni kamaytiradi." />

      <nav aria-label="Guruh bo‘yicha filtr" className="mb-6 flex flex-wrap gap-2">
        <Link href="/admin/ctf" className={chip(!groupId)}>
          Hammasi
        </Link>
        {groups.map((g) => (
          <Link key={g.id} href={`/admin/ctf?group=${g.id}`} className={chip(g.id === groupId)}>
            {g.name}
          </Link>
        ))}
      </nav>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={Users} label="Ishtirokchilar" value={players} hint="kamida bitta flag topganlar" />
        <Stat icon={Flag} label="Topilgan flaglar" value={overview.solves} hint={`shu hafta: ${overview.solvesThisWeek}`} />
        <Stat icon={Trophy} label="Eng yuqori ball" value={overview.students[0]?.score ?? 0} hint={overview.students[0]?.name} />
      </div>

      <section className={`${ui.card} mt-8 overflow-hidden`}>
        <div className={ui.cardHead}>
          <h2 className="font-semibold">Reyting{current ? ` · ${current.name}` : ""}</h2>
          <span className="font-mono text-sm text-muted">{players}</span>
        </div>
        {players === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted">Hali hech kim flag topmagan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className={`${ui.th} w-16`}>#</th>
                  <th className={ui.th}>O‘quvchi</th>
                  <th className={ui.th}>Guruh</th>
                  <th className={`${ui.th} text-right`}>Yechilgan</th>
                  <th className={`${ui.th} text-right`}>Ishoralar</th>
                  <th className={`${ui.th} text-right`}>Ball</th>
                  <th className={ui.th}>Oxirgi flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {overview.students.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-surface-2/50">
                    <td className={`${ui.td} font-mono text-muted`}>
                      {s.rank <= 3 ? <Medal aria-label={`${s.rank}-o‘rin`} className={`size-4 ${medal[s.rank - 1]}`} /> : s.rank}
                    </td>
                    <td className={ui.td}>
                      <Link href={`/admin/students/${s.id}`} className="font-medium hover:text-accent-text">
                        {s.name}
                      </Link>
                      <span className="block font-mono text-xs text-muted">{s.login}</span>
                    </td>
                    <td className={ui.td}>{s.group ?? <span className="text-faint">—</span>}</td>
                    <td className={`${ui.td} text-right font-mono`}>
                      {s.solved}/{overview.challenges.length}
                    </td>
                    <td className={`${ui.td} text-right font-mono text-muted`}>{s.hints}</td>
                    <td className={`${ui.td} text-right font-mono font-semibold`}>{s.score}</td>
                    <td className={`${ui.td} text-muted`}>{timeAgo(s.lastSolvedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={`${ui.card} mt-8 overflow-hidden`}>
        <div className={ui.cardHead}>
          <h2 className="font-semibold">Topshiriqlar — eng qiyinidan</h2>
          <span className="font-mono text-sm text-muted">{overview.challenges.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className={ui.th}>Topshiriq</th>
                <th className={ui.th}>Yo‘nalish</th>
                <th className={`${ui.th} text-right`}>Ball</th>
                <th className={ui.th}>Yechganlar</th>
                <th className={`${ui.th} text-right`}>O‘rtacha ishora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {byDifficulty.map((c) => {
                const p = percent(c.solves, players);
                return (
                  <tr key={c.id} className="transition-colors hover:bg-surface-2/50">
                    <td className={ui.td}>
                      <span className="font-medium">{c.title}</span>
                      <span className="block font-mono text-xs text-faint">{c.id}</span>
                    </td>
                    <td className={`${ui.td} text-muted`}>{c.track}</td>
                    <td className={`${ui.td} text-right font-mono`}>{c.points}</td>
                    <td className={`${ui.td} w-56`}>
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                          <span className="bg-signal block h-full rounded-full" style={{ width: `${p}%` }} />
                        </span>
                        <span className="font-mono text-xs text-muted">
                          {c.solves}/{players}
                        </span>
                      </div>
                    </td>
                    <td className={`${ui.td} text-right font-mono text-muted`}>{c.solves > 0 ? c.avgHints.toFixed(1) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
