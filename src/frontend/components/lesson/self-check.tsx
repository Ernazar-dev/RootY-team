"use client";

import { useId, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { recordCheck } from "@/backend/services/progress-actions";
import { Inline } from "./rich-text";

interface Props {
  /** Lesson and position of this check, so a signed-in answer is saved. */
  slug: string;
  checkIndex: number;
  question: string;
  options: string[];
  answer: number;
  explain: string;
  labels: { check: string; correct: string; wrong: string; retry: string; selfCheck: string };
}

/**
 * Practice question inside a lesson. Feedback is instant in the browser;
 * for signed-in students each answer is also saved (and re-graded) on the
 * server so the teacher sees it. Visitors' answers are ignored there.
 */
export function SelfCheck({ slug, checkIndex, question, options, answer, explain, labels }: Props) {
  const name = useId();
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const right = checked && picked === answer;

  return (
    <form
      className="rounded-2xl border border-border bg-surface p-5 sm:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (picked === null) return;
        setChecked(true);
        recordCheck(slug, checkIndex, picked).catch(() => {});
      }}
    >
      <fieldset className="space-y-4">
        <legend className="mb-4">
          <span className="block text-xs font-semibold tracking-wide text-accent uppercase">
            {labels.selfCheck}
          </span>
          <span className="mt-1 block font-semibold">
            <Inline text={question} />
          </span>
        </legend>
        {options.map((option, i) => (
          <label
            key={i}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 hover:bg-surface-2 has-checked:border-accent has-checked:bg-accent-soft"
          >
            <input
              type="radio"
              name={name}
              checked={picked === i}
              disabled={right}
              onChange={() => {
                setPicked(i);
                setChecked(false);
              }}
              className="mt-1 accent-(--accent)"
            />
            <span>
              <Inline text={option} />
            </span>
          </label>
        ))}
      </fieldset>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!right && (
          <button
            type="submit"
            disabled={picked === null}
            className="h-10 rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent hover:bg-accent-hover disabled:opacity-50"
          >
            {labels.check}
          </button>
        )}
        {right && (
          <button
            type="button"
            onClick={() => {
              setPicked(null);
              setChecked(false);
            }}
            className="h-10 rounded-lg border border-border px-4 text-sm font-medium hover:bg-surface-2"
          >
            {labels.retry}
          </button>
        )}
        <p role="status" className="text-sm font-medium">
          {checked &&
            (right ? (
              <span className="flex items-center gap-1.5 text-success">
                <CheckCircle2 aria-hidden className="size-4" /> {labels.correct}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-danger">
                <XCircle aria-hidden className="size-4" /> {labels.wrong}
              </span>
            ))}
        </p>
      </div>

      {right && (
        <p className="mt-4 rounded-xl bg-success-soft p-4 text-sm leading-relaxed">
          <Inline text={explain} />
        </p>
      )}
    </form>
  );
}
