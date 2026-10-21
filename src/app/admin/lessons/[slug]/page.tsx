import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, TriangleAlert } from "lucide-react";
import { getLessonEntry } from "@/backend/services/admin";
import { lessonPath } from "@/frontend/lessons/tracks";
import { resetLesson } from "@/backend/services/admin-actions";
import { ConfirmSubmit } from "@/frontend/admin/forms";
import { LessonEditor } from "@/frontend/admin/lesson-editor";
import { PageHeader, sourceBadge } from "@/frontend/admin/parts";
import { formatDateTime } from "@/frontend/admin/format";
import { ui } from "@/frontend/admin/ui";

export const metadata: Metadata = { title: "Darsni tahrirlash" };

export default async function LessonEditPage({ params }: PageProps<"/admin/lessons/[slug]">) {
  const { slug } = await params;
  const data = await getLessonEntry(slug);
  if (!data) notFound();
  const { entry, code } = data;
  const badge = sourceBadge[entry.source];

  return (
    <>
      <Link href="/admin/lessons" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
        <ArrowLeft aria-hidden className="size-4" />
        Darslar
      </Link>
      <PageHeader
        title={entry.lesson.title.uz}
        lead={`/${entry.lesson.slug}${entry.updatedAt ? ` · panelda o‘zgartirilgan: ${formatDateTime(entry.updatedAt)}` : ""}`}
        actions={
          <>
            <span className={`${ui.badge} ${badge.className} h-10 px-3`}>{badge.label}</span>
            <a href={lessonPath("uz", entry.lesson)} target="_blank" rel="noreferrer" className={`${ui.btn} ${ui.ghost}`}>
              Saytda ko‘rish
              <ArrowUpRight aria-hidden className="size-4" />
            </a>
          </>
        }
      />

      {entry.codeChanged && (
        <p className="mb-6 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning-soft p-4 text-sm text-warning">
          <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          Bu dars kodda tuzatishingizdan keyin o‘zgargan. Saytda hozir sizning tuzatishingiz ko‘rinyapti. Koddagi yangi versiyani olish uchun «Kod versiyasiga qaytarish»ni bosing.
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section className={`${ui.card} p-5`}>
          <LessonEditor mode="edit" slug={entry.lesson.slug} initialJson={JSON.stringify(entry.lesson, null, 2)} published={entry.published} />
        </section>

        <aside className="space-y-6">
          <section className={`${ui.card} p-5 text-sm`}>
            <h2 className="mb-3 font-semibold">Qanday ishlaydi</h2>
            <ul className="list-disc space-y-2 pl-4 text-muted">
              <li>Saqlangan tuzatish koddagi versiya ustidan yoziladi va saytda darhol ko‘rinadi.</li>
              <li>
                Matnlar 4 tilda: <code className="font-mono text-text">uz, kaa, ru, en</code> — birortasi bo‘sh qolsa saqlanmaydi.
              </li>
              <li>
                <code className="font-mono text-text">slug</code> o‘zgartirilmaydi — havolalar buzilmasligi uchun.
              </li>
              <li>«Saytda ko‘rinadi» belgisini olsangiz, dars yashiriladi, lekin o‘chmaydi.</li>
            </ul>
          </section>

          {entry.source !== "code" && (
            <section className={`${ui.card} p-5 text-sm`}>
              <h2 className="mb-2 font-semibold">{entry.source === "override" ? "Kod versiyasiga qaytarish" : "Darsni o‘chirish"}</h2>
              <p className="mb-4 text-muted">
                {entry.source === "override"
                  ? "Paneldagi tuzatish o‘chiriladi va saytda yana koddagi versiya ko‘rinadi."
                  : "Bu dars faqat panelda bor — o‘chirilsa butunlay yo‘qoladi."}
              </p>
              <form action={resetLesson}>
                <input type="hidden" name="slug" value={entry.lesson.slug} />
                <ConfirmSubmit confirm={entry.source === "override" ? "Ha, qaytarish" : "Ha, o‘chirish"}>
                  {entry.source === "override" ? "Kod versiyasiga qaytarish" : "Darsni o‘chirish"}
                </ConfirmSubmit>
              </form>
            </section>
          )}

          {code && entry.source === "override" && (
            <details className={`${ui.card} p-5 text-sm`}>
              <summary className="cursor-pointer font-semibold">Koddagi versiya</summary>
              <pre className="mt-3 max-h-96 overflow-auto rounded-lg bg-code p-3 font-mono text-xs leading-5">{JSON.stringify(code, null, 2)}</pre>
            </details>
          )}
        </aside>
      </div>
    </>
  );
}
