import type { Metadata } from "next";
import Link from "next/link";
import { Plus, TriangleAlert } from "lucide-react";
import { getLessonEntries } from "@/backend/services/admin";
import { PageHeader, sourceBadge } from "@/frontend/admin/parts";
import { formatDateTime } from "@/frontend/admin/format";
import { ui } from "@/frontend/admin/ui";
import { getTrack } from "@/frontend/lessons/tracks";

export const metadata: Metadata = { title: "Darslar" };

export default async function LessonsPage() {
  const entries = await getLessonEntries();
  return (
    <>
      <PageHeader
        title="Darslar"
        lead="Darslar asosan kodda yoziladi. Bu yerda ularni tuzatish (kod versiyasi ustidan yoziladi) yoki faqat paneldan yangi dars qo‘shish mumkin."
        actions={
          <Link href="/admin/lessons/new" className={`${ui.btn} ${ui.primary}`}>
            <Plus aria-hidden className="size-4" />
            Yangi dars
          </Link>
        }
      />

      <section className={`${ui.card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className={ui.th}>#</th>
                <th className={ui.th}>Dars</th>
                <th className={ui.th}>Yo‘nalish</th>
                <th className={ui.th}>Manba</th>
                <th className={ui.th}>Holat</th>
                <th className={ui.th}>O‘zgartirilgan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {entries.map((e) => (
                <tr key={e.lesson.slug} className="transition-colors hover:bg-surface-2/50">
                  <td className={`${ui.td} font-mono text-faint`}>{String(e.lesson.order).padStart(2, "0")}</td>
                  <td className={ui.td}>
                    <Link href={`/admin/lessons/${e.lesson.slug}`} className="font-medium hover:text-accent-text">
                      {e.lesson.title.uz}
                    </Link>
                    <span className="block font-mono text-xs text-muted">{e.lesson.slug}</span>
                    {e.codeChanged && (
                      <span className="mt-1 flex items-center gap-1 text-xs text-warning">
                        <TriangleAlert aria-hidden className="size-3.5" />
                        Kod tuzatishdan keyin o‘zgargan
                      </span>
                    )}
                    {e.invalid && (
                      <span className="mt-1 flex items-center gap-1 text-xs text-danger">
                        <TriangleAlert aria-hidden className="size-3.5" />
                        Saqlangan tuzatish yaroqsiz — kod versiyasi ko‘rsatilmoqda
                      </span>
                    )}
                  </td>
                  <td className={`${ui.td} text-muted`}>{getTrack(e.lesson.track)?.title.uz ?? e.lesson.track}</td>
                  <td className={ui.td}>
                    <span className={`${ui.badge} ${sourceBadge[e.source].className}`}>{sourceBadge[e.source].label}</span>
                  </td>
                  <td className={ui.td}>
                    {e.published ? (
                      <span className={`${ui.badge} border-success/30 text-success`}>Chop etilgan</span>
                    ) : (
                      <span className={`${ui.badge} border-warning/30 text-warning`}>Yashirin</span>
                    )}
                  </td>
                  <td className={`${ui.td} text-muted`}>{e.updatedAt ? formatDateTime(e.updatedAt) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
