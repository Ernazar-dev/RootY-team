import "server-only";
import { cache } from "react";
import { locale as localeParam } from "next/root-params";
import { defaultLocale, isLocale, type Locale } from "./config";
import uz, { type Messages } from "./messages/uz";
import kaa from "./messages/kaa";
import ru from "./messages/ru";
import en from "./messages/en";

const dictionaries: Record<Locale, Messages> = { uz, kaa, ru, en };

/** The `[locale]` root segment of the current request. */
export const getLocale = cache(async (): Promise<Locale> => {
  const value = await localeParam();
  return isLocale(value) ? value : defaultLocale;
});

export async function getMessages() {
  return dictionaries[await getLocale()];
}

export function messagesFor(locale: Locale) {
  return dictionaries[locale];
}
