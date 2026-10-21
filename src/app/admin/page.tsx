import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenCheck, CheckCircle2, CircleCheck, CircleX, LogIn, UserPlus, Users, Zap } from "lucide-react";
import { getOverview, type Activity } from "@/backend/services/admin";
import { PageHeader, Stat } from "@/frontend/admin/parts";
import { percent, timeAgo } from "@/frontend/admin/format";
import { ui } from "@/frontend/admin/ui";

export const metadata: Metadata = { title: "Umumiy ko‘rinish" };

function ActivityLine({ item, titles }: { item: Activity; titles: Record<string, string> }) {
  const lesson = item.lessonSlug ? (titles[item.lessonSlug] ?? item.lessonSlug) : "";
  const icon =
    item.kind === "login" ? (
      <LogIn aria-hidden className="size-4 text-accent-2" />
    ) : item.kind === "completed" ? (
      <CheckCircle2 aria-hidden className="size-4 text-success" />
    ) : item.correct ? (
      <CircleCheck aria-hidden className="size-4 text-success" />
    ) : (
      <CircleX aria-hidden className="size-4 text-danger" />
    );
  const text =
    item.kind === "login"
      ? "tizimga kirdi"
      : item.kind === "completed"
        ? `«${lesson}» darsini yakunladi`
        : `«${lesson}» savoliga ${item.correct ? "to‘g‘ri" : "noto‘g‘ri"} javob berdi`;
  return (
    <li className="flex gap-3 py-3">
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-surface-2">{icon}</span>
      <span className="min-w-0 flex-1 text-sm">
        {item.userId ? (
          <Link href={`/admin/students/${item.userId}`} className="font-medium hover:text-accent-text">
            {item.name}
          </Link>
        ) : (
          <span className="font-medium">{item.name}</span>
        )}{" "}
        <span className="text-muted">{text}</span>
        <span className="mt-0.5 block text-xs text-faint">{timeAgo(item.at)}</span>
      </span>
    </li>
  );
}

export default async function AdminHome() {
  const o = await getOverview();

  return (
    <>
      <PageHeader title="Umumiy ko‘rinish" lead="Saytda nima bo‘layotgani va o‘quvchilar qanday o‘qiyotgani." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Users} label="O‘quvchilar" value={o.students} />
        <Stat icon={Zap} label="Shu hafta faol" value={o.activeThisWeek} hint={`${percent(o.activeThisWeek, o.students)}% o‘quvchi`} />
        <Stat icon={BookOpenCheck} label="Yakunlangan darslar" value={o.completions} hint={`shu hafta: +${o.completionsThisWeek}`} />
        <Stat icon={CheckCircle2} label="Darslar" value={o.lessons.filter((l) => l.published).length} hint={`jami ${o.lessons.length}`} />
      </div>

      {o.students === 0 && (
        <div className="mt-6 flex flex-col items-start gap-4 rounded-card border border-dashed border-border-strong p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">Hali o‘quvchi yo‘q. Ularga login va parol oching — keyin natijalari shu yerda ko‘rinadi.</p>
          <Link href="/admin/students" className={`${ui.btn} ${ui.primary}`}>
            <UserPlus aria-hidden className="size-4" />
            O‘quvchi qo‘shish
          </Link>
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className={ui.card}>
          <div className={ui.cardHead}>
            <h2 className="font-semibold">Darslar bo‘yicha</h2>
            <Link href="/admin/lessons" className="text-sm text-muted hover:text-text">
              Barchasi
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className={ui.th}>Dars</th>
                  <th className={`${ui.th} text-right`}>Boshlagan</th>
                  <th className={`${ui.th} text-right`}>Yakunlagan</th>
                  <th className={ui.th}>Yakunlash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {o.lessons.map((l) => {
                  const p = percent(l.completed, o.students);
                  return (
                    <tr key={l.slug}>
                      <td className={ui.td}>
                        <Link href={`/admin/lessons/${l.slug}`} className="font-medium hover:text-accent-text">
                          {l.title}
                        </Link>
                        {!l.published && <span className="ml-2 text-xs text-warning">yashirin</span>}
                      </td>
                      <td className={`${ui.td} text-right font-mono`}>{l.started}</td>
                      <td className={`${ui.td} text-right font-mono`}>{l.completed}</td>
                      <td className={`${ui.td} w-40`}>
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                            <span className="bg-signal block h-full rounded-full" style={{ width: `${p}%` }} />
                          </span>
                          <span className="w-9 text-right font-mono text-xs text-muted">{p}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className={ui.card}>
          <div className={ui.cardHead}>
            <h2 className="font-semibold">So‘nggi faollik</h2>
          </div>
          {o.activity.length ? (
            <ul className="divide-y divide-border px-5">
              {o.activity.map((item, i) => (
                <ActivityLine key={i} item={item} titles={o.titles} />
              ))}
            </ul>
          ) : (
            <p className="px-5 py-8 text-sm text-muted">Hozircha faollik yo‘q.</p>
          )}
        </section>
      </div>
    </>
  );
}
