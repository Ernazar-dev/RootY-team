import { Suspense } from "react";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/shared/i18n/config";
import { messagesFor } from "@/shared/i18n/server";
import { CtfArena } from "@/frontend/ctf/ctf-arena";
import { listMySolves } from "@/backend/services/ctf-actions";
import { getLeaderboard } from "@/backend/services/ctf";
import { getCurrentUser } from "@/backend/auth/dal";

export async function generateMetadata({ params }: PageProps<"/[locale]/ctf">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: messagesFor(locale).nav.ctf } : {};
}

export default async function CtfPage({ params }: PageProps<"/[locale]/ctf">) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  // The arena depends on the visitor's cookies, so it streams in behind
  // Suspense; the rest of the shell is prerendered.
  return (
    <Suspense fallback={<div className="mx-auto min-h-[70svh] max-w-site" aria-busy />}>
      <Arena locale={locale} />
    </Suspense>
  );
}

async function Arena({ locale }: { locale: Locale }) {
  // Signed-in students get their saved solves; anonymous visitors get [].
  const [initial, user] = await Promise.all([listMySolves(), getCurrentUser()]);
  const board = await getLeaderboard(user?.id ?? null);
  return <CtfArena locale={locale} initial={initial} board={board} />;
}
