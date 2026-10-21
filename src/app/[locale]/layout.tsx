import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, localeTags } from "@/shared/i18n/config";
import { messagesFor } from "@/shared/i18n/server";
import { site } from "@/shared/site";
import { SiteHeader } from "@/frontend/components/site-header";
import { SiteFooter } from "@/frontend/components/site-footer";
import { themeInitScript } from "@/frontend/components/theme-script";
import { InlineScript } from "@/frontend/components/inline-script";
import { Effects } from "@/frontend/components/effects";
import { fontVariables } from "@/frontend/fonts";
import "../globals.css";

export const viewport: Viewport = {
  themeColor: "#090909",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = messagesFor(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.title, template: `%s | ${site.name}` },
    description: t.meta.description,
    applicationName: site.name,
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = messagesFor(locale);

  return (
    <html
      lang={localeTags[locale]}
      className={fontVariables}
      // The theme script may set data-theme before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <InlineScript html={themeInitScript} />
      </head>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <SiteHeader locale={locale} t={t} />
        {/* clip, not hidden: decorative glows may bleed past the edge without
            adding horizontal scroll, and sticky positioning keeps working. */}
        <main id="main" className="flex-1 overflow-x-clip">
          {children}
        </main>
        <SiteFooter locale={locale} t={t} />
        <Effects />
      </body>
    </html>
  );
}
