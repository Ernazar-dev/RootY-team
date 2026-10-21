import type { Localized } from "@/shared/i18n/config";
import type { TrackSlug } from "./tracks";

export type Level = "beginner" | "intermediate" | "advanced";

/** Interactive components a lesson can embed; registered in components/lesson/widgets.tsx. */
export const widgetIds = [
  "http-exchange",
  "linux-terminal",
  "request-journey",
  "flag-hunt",
  "cipher-lab",
  "password-meter",
] as const;
export type WidgetId = (typeof widgetIds)[number];

/**
 * A lesson is a list of blocks. Text supports `inline code`, **bold** and *italic*;
 * a blank line starts a new paragraph. Raw HTML is never rendered.
 */
export type Block =
  | { kind: "heading"; id: string; text: Localized }
  | { kind: "text"; text: Localized }
  | { kind: "callout"; tone: "info" | "tip" | "warn"; text: Localized }
  /** `code` may be per-language so comments inside it can be translated. */
  | { kind: "code"; code: string | Localized; language?: string; caption?: Localized }
  /** "After this lesson you can…": the skills the lesson gives, at the top. */
  | { kind: "goals"; items: Localized[] }
  /** New words in plain language; `term` stays as written (usually English). */
  | { kind: "terms"; items: { term: string; text: Localized }[] }
  /** Do-it-yourself walkthrough: what to type, what you will see, what it means.
   *  `prompt` goes before each code line: `$` by default, "" for none (an HTTP request). */
  | { kind: "steps"; items: { text: Localized; code?: string; prompt?: string; output?: string | Localized }[] }
  /** "Remember": the few lines worth keeping, at the end. */
  | { kind: "summary"; items: Localized[] }
  | { kind: "widget"; widget: WidgetId }
  | {
      kind: "check";
      question: Localized;
      options: Localized[];
      /** Index into `options`. */
      answer: number;
      explain: Localized;
    };

export interface Lesson {
  /** Stable URL id: /[locale]/learn/<track>/<slug>. Unique across tracks; never rename once published. */
  slug: string;
  /** The track (yo‘nalish) the lesson belongs to; see tracks.ts. */
  track: TrackSlug;
  /** Position in the track; lower comes first. */
  order: number;
  level: Level;
  minutes: number;
  title: Localized;
  summary: Localized;
  blocks: Block[];
}
