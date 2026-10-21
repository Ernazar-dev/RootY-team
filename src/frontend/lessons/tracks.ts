import type { Localized } from "@/shared/i18n/config";

// Learning tracks (yo‘nalishlar). /[locale]/learn lists them; each lesson
// names its track in `lesson.track`. A track with no published lessons
// is shown as "coming soon". Add a new track here; the slug is its URL
// (/[locale]/learn/<slug>), so never rename it once published.
export const trackSlugs = ["web-security", "frontend"] as const;
export type TrackSlug = (typeof trackSlugs)[number];

export interface Track {
  slug: TrackSlug;
  /** Position on the tracks page; lower comes first. */
  order: number;
  title: Localized;
  summary: Localized;
}

const all: Track[] = [
  {
    slug: "web-security",
    order: 1,
    title: {
      uz: "Veb-ilovalar xavfsizligi",
      kaa: "Veb-qosımshalar qáwipsizligi",
      ru: "Безопасность веб-приложений",
      en: "Web application security",
    },
    summary: {
      uz: "Veb-ilovalar qanday buziladi va qanday himoyalanadi: HTTP, autentifikatsiya, injeksiyalar va boshqa zaifliklar.",
      kaa: "Veb-qosımshalar qalay buzıladı hám qalay qorǵaladı: HTTP, autentifikaciya, injekciyalar hám basqa álsiz tárepler.",
      ru: "Как ломают и как защищают веб-приложения: HTTP, аутентификация, инъекции и другие уязвимости.",
      en: "How web applications get broken and how to defend them: HTTP, authentication, injections and other vulnerabilities.",
    },
  },
  {
    slug: "frontend",
    order: 2,
    title: {
      uz: "Frontend dasturlash",
      kaa: "Frontend baǵdarlamalaw",
      ru: "Frontend-разработка",
      en: "Frontend development",
    },
    summary: {
      uz: "HTML, CSS va JavaScript: brauzerda ishlaydigan interfeyslarni qurish.",
      kaa: "HTML, CSS hám JavaScript: brauzerde isleytuǵın interfeyslerdi dúziw.",
      ru: "HTML, CSS и JavaScript: как строить интерфейсы, которые работают в браузере.",
      en: "HTML, CSS and JavaScript: building interfaces that run in the browser.",
    },
  },
];

export const tracks = [...all].sort((a, b) => a.order - b.order);

/** Track for lessons that do not name one (older admin-panel edits). */
export const defaultTrack: TrackSlug = "web-security";

export function isTrack(value: unknown): value is TrackSlug {
  return trackSlugs.includes(value as TrackSlug);
}

export function getTrack(slug: string) {
  return tracks.find((track) => track.slug === slug);
}

/** Site path of a lesson, e.g. /uz/learn/web-security/http-basics. */
export function lessonPath(locale: string, lesson: { track: string; slug: string }) {
  return `/${locale}/learn/${lesson.track}/${lesson.slug}`;
}
