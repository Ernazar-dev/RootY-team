import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/backend/auth/dal";
import { LessonEditor } from "@/frontend/admin/lesson-editor";
import { PageHeader } from "@/frontend/admin/parts";
import { ui } from "@/frontend/admin/ui";

export const metadata: Metadata = { title: "Yangi dars" };

const t = (uz: string) => ({ uz, kaa: uz, ru: uz, en: uz });

// A minimal valid lesson to start from; every language is pre-filled with
// the Uzbek text so it validates, and gets translated afterwards.
const template = {
  slug: "yangi-dars",
  track: "web-security",
  order: 99,
  level: "beginner",
  minutes: 10,
  title: t("Yangi dars"),
  summary: t("Dars haqida bir-ikki gap."),
  blocks: [
    { kind: "heading", id: "tushuncha", text: t("Tushuncha") },
    { kind: "text", text: t("Matn. `kod` va **qalin** yozish mumkin.\n\nBo‘sh qator — yangi paragraf.") },
    { kind: "callout", tone: "tip", text: t("Maslahat matni.") },
    {
      kind: "check",
      question: t("Savol?"),
      options: [t("Birinchi variant"), t("Ikkinchi variant")],
      answer: 1,
      explain: t("Nega aynan shu javob to‘g‘ri."),
    },
  ],
};

export default async function NewLessonPage() {
  await requireAdmin();
  return (
    <>
      <Link href="/admin/lessons" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
        <ArrowLeft aria-hidden className="size-4" />
        Darslar
      </Link>
      <PageHeader
        title="Yangi dars"
        lead="Shablonni o‘zgartiring: slug (manzil), track (yo‘nalish: web-security yoki frontend), tartib raqami, matnlar 4 tilda va bloklar. Kodda yozilgan darslar bilan bir xil tuzilma."
      />
      <section className={`${ui.card} p-5`}>
        <LessonEditor mode="create" initialJson={JSON.stringify(template, null, 2)} published={false} />
      </section>
    </>
  );
}
