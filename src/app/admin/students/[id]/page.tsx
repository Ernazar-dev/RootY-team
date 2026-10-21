import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Circle, CircleDot } from "lucide-react";
import { getStudent, listGroups } from "@/backend/services/admin";
import { deleteStudent } from "@/backend/services/admin-actions";
import { ConfirmSubmit, ResetPasswordForm, StudentEditForm } from "@/frontend/admin/forms";
import { PageHeader } from "@/frontend/admin/parts";
import { formatDate, formatDateTime, percent, timeAgo } from "@/frontend/admin/format";
import { ui } from "@/frontend/admin/ui";

export const metadata: Metadata = { title: "O‘quvchi" };

export default async function StudentPage({ params }: PageProps<"/admin/students/[id]">) {
  const { id } = await params;
  const [data, groups] = await Promise.all([getStudent(id), listGroups()]);
  if (!data) notFound();
  const { user, lessons } = data;
  const published = lessons.filter((l) => l.published);
  const done = published.filter((l) => l.status === "completed").length;
  const checks = lessons.flatMap((l) => l.checks);
  const answered = checks.filter((c) => c.tries > 0);

  return (
    <>
      <Link href="/admin/students" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
        <ArrowLeft aria-hidden className="size-4" />
        O‘quvchilar
      </Link>
      <PageHeader
        title={user.name}
        lead={`${user.login} · ${user.groupName ?? "guruhsiz"} · qo‘shilgan ${formatDate(user.createdAt)} · oxirgi kirish: ${user.lastLoginAt ? timeAgo(user.lastLoginAt) : "hali kirmagan"}`}
        actions={!user.active && <span className={`${ui.badge} border-danger/30 text-danger`}>Hisob o‘chirilgan</span>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={`${ui.card} p-5`}>
          <p className="text-sm text-muted">Yakunlangan darslar</p>
          <p className="mt-2 font-mono text-3xl font-light">
            {done}
            <span className="text-lg text-faint">/{published.length}</span>
          </p>
        </div>
        <div className={`${ui.card} p-5`}>
          <p className="text-sm text-muted">Yechilgan savollar</p>
          <p className="mt-2 font-mono text-3xl font-light">
            {answered.filter((c) => c.solved).length}
            <span className="text-lg text-faint">/{checks.length}</span>
          </p>
        </div>
        <div className={`${ui.card} p-5`}>
          <p className="text-sm text-muted">Birinchi urinishda to‘g‘ri</p>
          <p className="mt-2 font-mono text-3xl font-light">{answered.length ? `${percent(answered.filter((c) => c.firstTry).length, answered.length)}%` : "—"}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className={ui.card}>
          <div className={ui.cardHead}>
            <h2 className="font-semibold">Darslar bo‘yicha natija</h2>
          </div>
          <ul className="divide-y divide-border">
            {lessons.map((l) => (
              <li key={l.slug} className="px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2.5 font-medium">
                    {l.status === "completed" ? (
                      <CheckCircle2 aria-label="yakunlangan" className="size-4 text-success" />
                    ) : l.status === "started" ? (
                      <CircleDot aria-label="boshlangan" className="size-4 text-warning" />
                    ) : (
                      <Circle aria-label="ochilmagan" className="size-4 text-faint" />
                    )}
                    {l.title}
                  </span>
                  <span className="text-xs text-muted">
                    {l.status === "completed"
                      ? `yakunladi: ${formatDateTime(l.completedAt)}`
                      : l.status === "started"
                        ? `boshladi: ${formatDateTime(l.startedAt)}`
                        : "ochmagan"}
                  </span>
                </div>
                {l.checks.length > 0 && (
                  <ul className="mt-3 space-y-1.5 pl-6.5">
                    {l.checks.map((c, i) => (
                      <li key={i} className="flex items-start justify-between gap-4 text-sm">
                        <span className="text-muted">{c.question}</span>
                        <span className={`shrink-0 font-mono text-xs ${!c.tries ? "text-faint" : c.solved ? "text-success" : "text-danger"}`}>
                          {!c.tries ? "javob yo‘q" : c.solved ? (c.firstTry ? "✓ 1-urinishda" : `✓ ${c.tries} urinishda`) : `✗ ${c.tries} urinish`}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-6">
          <section className={`${ui.card} p-5`}>
            <h2 className="mb-4 font-semibold">Ma’lumotlar</h2>
            <StudentEditForm student={user} groups={groups} />
          </section>
          <section className={`${ui.card} p-5`}>
            <h2 className="mb-4 font-semibold">Parol</h2>
            <ResetPasswordForm id={user.id} />
          </section>
          <section className={`${ui.card} border-danger/20 p-5`}>
            <h2 className="mb-2 font-semibold">O‘chirish</h2>
            <p className="mb-4 text-sm text-muted">Hisob va uning barcha natijalari butunlay o‘chiriladi. Vaqtincha to‘xtatish uchun «Hisob faol» belgisini oling.</p>
            <form action={deleteStudent}>
              <input type="hidden" name="id" value={user.id} />
              <ConfirmSubmit confirm="Ha, butunlay o‘chirish">O‘quvchini o‘chirish</ConfirmSubmit>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
