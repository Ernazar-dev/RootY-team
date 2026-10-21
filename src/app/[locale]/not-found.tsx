import Link from "next/link";
import { getLocale, getMessages } from "@/shared/i18n/server";

export default async function NotFound() {
  const [locale, t] = await Promise.all([getLocale(), getMessages()]);
  return (
    <div className="relative isolate mx-auto max-w-xl overflow-hidden px-4 py-28 text-center">
      <div aria-hidden className="bloom top-0 left-1/2 -z-10 size-72 -translate-x-1/2 opacity-25" />
      <p className="font-mono text-[clamp(4rem,18vw,9rem)] leading-none font-light tracking-[-0.06em] text-faint">404</p>
      <p className="stamp mt-6 text-[0.6875rem] text-danger">HTTP/1.1 404 Not Found</p>
      <h1 className="display mt-6 text-4xl">{t.notFound.title}</h1>
      <p className="mt-3 text-muted">{t.notFound.text}</p>
      <Link
        href={`/${locale}`}
        className="mt-10 inline-flex h-12 items-center rounded-full bg-accent px-7 font-medium text-on-accent hover:bg-accent-hover"
      >
        {t.notFound.home}
      </Link>
    </div>
  );
}
