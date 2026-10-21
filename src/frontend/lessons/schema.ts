// Runtime check for lessons that do not come from code (the admin panel's
// JSON editor, database rows). Mirrors types.ts; a test keeps them in step
// by running every code lesson through it.
import { z } from "zod";
import { locales } from "@/shared/i18n/config";
import { defaultTrack, trackSlugs } from "./tracks";
import { widgetIds, type Lesson } from "./types";

const text = z.string().trim().min(1);
const localized = z.object(Object.fromEntries(locales.map((l) => [l, text])) as Record<(typeof locales)[number], typeof text>);

const block = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("heading"), id: z.string().regex(/^[a-z0-9-]+$/), text: localized }),
  z.object({ kind: z.literal("text"), text: localized }),
  z.object({ kind: z.literal("callout"), tone: z.enum(["info", "tip", "warn"]), text: localized }),
  z.object({ kind: z.literal("code"), code: z.union([z.string().min(1), localized]), language: z.string().optional(), caption: localized.optional() }),
  z.object({ kind: z.literal("goals"), items: z.array(localized).min(1) }),
  z.object({ kind: z.literal("terms"), items: z.array(z.object({ term: text, text: localized })).min(1) }),
  z.object({
    kind: z.literal("steps"),
    items: z.array(z.object({ text: localized, code: z.string().optional(), prompt: z.string().optional(), output: z.union([z.string(), localized]).optional() })).min(1),
  }),
  z.object({ kind: z.literal("summary"), items: z.array(localized).min(1) }),
  z.object({ kind: z.literal("widget"), widget: z.enum(widgetIds) }),
  z.object({
    kind: z.literal("check"),
    question: localized,
    options: z.array(localized).min(2),
    answer: z.number().int().min(0),
    explain: localized,
  }),
]);

export const lessonSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug: kichik lotin harflari, raqamlar va chiziqcha"),
    // Edits saved before tracks existed have no track: they stay in the first one.
    track: z.enum(trackSlugs, { error: `track: ${trackSlugs.join(", ")} dan biri` }).default(defaultTrack),
    order: z.number().int().min(0),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    minutes: z.number().int().min(1).max(600),
    title: localized,
    summary: localized,
    blocks: z.array(block).min(1),
  })
  .superRefine((lesson, ctx) => {
    lesson.blocks.forEach((b, i) => {
      if (b.kind === "check" && b.answer >= b.options.length) {
        ctx.addIssue({ code: "custom", path: ["blocks", i, "answer"], message: "answer — mavjud variant indeksi bo‘lishi kerak" });
      }
    });
    const ids = lesson.blocks.flatMap((b) => (b.kind === "heading" ? [b.id] : []));
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({ code: "custom", path: ["blocks"], message: "heading id lar takrorlanmasligi kerak" });
    }
  });

export type ParseResult = { ok: true; lesson: Lesson } | { ok: false; errors: string[] };

/** Validates unknown input; errors are "path: message" lines for the editor. */
export function parseLesson(input: unknown): ParseResult {
  const result = lessonSchema.safeParse(input);
  if (result.success) return { ok: true, lesson: result.data as Lesson };
  return {
    ok: false,
    errors: result.error.issues.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`),
  };
}
