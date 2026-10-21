"use client";

import { useActionState, useMemo, useState } from "react";
import { CheckCircle2, LoaderCircle, Save, TriangleAlert, WandSparkles } from "lucide-react";
import { createLesson, saveLesson, type ActionState } from "@/backend/services/admin-actions";
import { parseLesson } from "@/frontend/lessons/schema";
import { ui } from "./ui";

/**
 * JSON editor for one lesson. Checks the JSON and the lesson structure as
 * you type (the same check the server repeats on save).
 */
export function LessonEditor({
  mode,
  slug,
  initialJson,
  published,
}: {
  mode: "edit" | "create";
  slug?: string;
  initialJson: string;
  published: boolean;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(mode === "edit" ? saveLesson : createLesson, {});
  const [json, setJson] = useState(initialJson);
  const [dirty, setDirty] = useState(false);

  const check = useMemo(() => {
    try {
      const result = parseLesson(JSON.parse(json));
      return result.ok ? { ok: true as const, errors: [] } : { ok: false as const, errors: result.errors };
    } catch (error) {
      return { ok: false as const, errors: [`JSON xato: ${(error as Error).message}`] };
    }
  }, [json]);

  function prettify() {
    try {
      setJson(JSON.stringify(JSON.parse(json), null, 2));
    } catch {}
  }

  const serverErrors = !dirty ? (state.errors ?? []) : [];
  const errors = check.ok ? serverErrors : check.errors;

  return (
    <form
      action={(formData) => {
        setDirty(false);
        return action(formData);
      }}
      className="space-y-4"
    >
      {slug && <input type="hidden" name="slug" value={slug} />}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input type="checkbox" name="published" defaultChecked={published} className="size-4 accent-(--accent)" />
          Saytda ko‘rinadi (chop etilgan)
        </label>
        <div className="flex items-center gap-2">
          <button type="button" onClick={prettify} className={`${ui.btn} ${ui.ghost} h-9`}>
            <WandSparkles aria-hidden className="size-4" />
            Formatlash
          </button>
          <button type="submit" disabled={pending || !check.ok} className={`${ui.btn} ${ui.primary} h-9`}>
            {pending ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : <Save aria-hidden className="size-4" />}
            {mode === "edit" ? "Saqlash" : "Darsni yaratish"}
          </button>
        </div>
      </div>

      <textarea
        name="json"
        value={json}
        onChange={(e) => {
          setJson(e.target.value);
          setDirty(true);
        }}
        spellCheck={false}
        aria-label="Dars JSON"
        aria-invalid={!check.ok || undefined}
        className={`block min-h-[32rem] w-full resize-y rounded-xl border bg-code p-4 font-mono text-[0.8125rem] leading-6 outline-none focus:ring-4 focus:ring-accent/15 ${
          check.ok ? "border-border-strong focus:border-accent" : "border-danger/60"
        }`}
      />

      {errors.length > 0 ? (
        <div role="alert" className="rounded-xl border border-danger/30 bg-danger-soft p-4 text-sm text-danger">
          <p className="flex items-center gap-2 font-medium">
            <TriangleAlert aria-hidden className="size-4" />
            {errors.length} ta xato — tuzatilmaguncha saqlanmaydi
          </p>
          <ul className="mt-2 space-y-1 font-mono text-xs">
            {errors.slice(0, 12).map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      ) : state.ok && !dirty ? (
        <p role="status" className="flex items-center gap-2 text-sm text-success">
          <CheckCircle2 aria-hidden className="size-4" />
          Saqlandi — saytda yangilandi.
        </p>
      ) : (
        <p className="flex items-center gap-2 text-sm text-muted">
          <CheckCircle2 aria-hidden className="size-4 text-success" />
          Tuzilma to‘g‘ri.
        </p>
      )}
    </form>
  );
}
