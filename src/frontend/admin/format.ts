// Dates in the admin panel (Uzbek, Tashkent time).

const zone = "Asia/Tashkent";
const dateTime = new Intl.DateTimeFormat("uz-Latn", { timeZone: zone, day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const dateOnly = new Intl.DateTimeFormat("uz-Latn", { timeZone: zone, day: "numeric", month: "short", year: "numeric" });
const relative = new Intl.RelativeTimeFormat("uz-Latn", { numeric: "auto" });

export function formatDateTime(date: Date | null | undefined) {
  return date ? dateTime.format(date) : "—";
}

export function formatDate(date: Date | null | undefined) {
  return date ? dateOnly.format(date) : "—";
}

/** "5 daqiqa oldin", "kecha"…; older than a week falls back to the date. */
export function timeAgo(date: Date | null | undefined, now = Date.now()) {
  if (!date) return "—";
  const seconds = Math.round((date.getTime() - now) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 60) return relative.format(seconds, "second");
  if (abs < 3600) return relative.format(Math.round(seconds / 60), "minute");
  if (abs < 86_400) return relative.format(Math.round(seconds / 3600), "hour");
  if (abs < 7 * 86_400) return relative.format(Math.round(seconds / 86_400), "day");
  return formatDate(date);
}

export function percent(part: number, whole: number) {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}
