export const locales = ["uz", "kaa", "ru", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "uz";
export const localeCookie = "rooty-locale";

export const localeNames: Record<Locale, string> = {
  uz: "O‘zbekcha",
  kaa: "Qaraqalpaqsha",
  ru: "Русский",
  en: "English",
};

export const localeShort: Record<Locale, string> = {
  uz: "UZ",
  kaa: "QQ",
  ru: "RU",
  en: "EN",
};

// BCP 47 tags for <html lang> and Intl formatting.
export const localeTags: Record<Locale, string> = {
  uz: "uz-Latn",
  kaa: "kaa-Latn",
  ru: "ru",
  en: "en",
};

/** A value written once per language, e.g. a lesson title. */
export type Localized<T = string> = Record<Locale, T>;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** Picks the visitor's language from an Accept-Language header. */
export function negotiateLocale(header: string | null | undefined): Locale {
  if (!header) return defaultLocale;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}

/** Replaces the locale segment of a pathname: /uz/learn -> /ru/learn. */
export function switchLocalePath(pathname: string, next: Locale): string {
  const parts = pathname.split("/");
  if (isLocale(parts[1])) parts[1] = next;
  else parts.splice(1, 0, next);
  return parts.join("/") || `/${next}`;
}
