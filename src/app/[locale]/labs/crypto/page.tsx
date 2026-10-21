import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { isLocale } from "@/shared/i18n/config";
import { getLab, labsIntro } from "@/frontend/labs/labs";
import { CipherRoom } from "@/frontend/labs/crypto/cipher-room";

const lab = getLab("crypto")!;

export async function generateMetadata({ params }: PageProps<"/[locale]/labs/crypto">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: lab.title[locale], description: lab.summary[locale] } : {};
}

export default async function CryptoLabPage({ params }: PageProps<"/[locale]/labs/crypto">) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;

  return (
    <div className="mx-auto max-w-site px-4 pt-10 sm:px-6 lg:px-10">
      <Link href={`/${locale}/labs`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
        <ArrowLeft aria-hidden className="size-4" /> {labsIntro.allLabs[locale]}
      </Link>
      <p className="stamp mt-12 text-[0.6875rem] text-muted">{labsIntro.eyebrow[locale]}</p>
      <h1 className="stamp-xl mt-6">{lab.title[locale]}</h1>
      <p className="mt-8 mb-10 max-w-2xl text-lg leading-relaxed font-light text-muted">{lab.summary[locale]}</p>
      <CipherRoom locale={locale} />
    </div>
  );
}
