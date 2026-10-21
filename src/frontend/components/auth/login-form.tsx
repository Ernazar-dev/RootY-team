"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LoaderCircle, TriangleAlert } from "lucide-react";
import { login, type LoginState } from "@/backend/auth/actions";
import type { Locale } from "@/shared/i18n/config";
import type { Messages } from "@/shared/i18n/messages/uz";

const field =
  "h-12 w-full rounded-xl border border-border-strong bg-bg px-4 text-base transition-colors outline-none placeholder:text-faint focus:border-accent focus:ring-4 focus:ring-accent/15";

export function LoginForm({ locale, t }: { locale: Locale; t: Messages["auth"] }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const [visible, setVisible] = useState(false);
  const next = useSearchParams().get("next") ?? "";

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="login" className="mb-2 block text-sm font-medium">
          {t.login}
        </label>
        <input
          id="login"
          name="login"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          defaultValue={state.login}
          aria-invalid={state.error === "invalid" || undefined}
          className={`${field} font-mono`}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium">
          {t.password}
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            required
            aria-invalid={state.error === "invalid" || undefined}
            className={`${field} pr-12`}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={t.show}
            aria-pressed={visible}
            className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted hover:text-text"
          >
            {visible ? <EyeOff aria-hidden className="size-4" /> : <Eye aria-hidden className="size-4" />}
          </button>
        </div>
      </div>

      {state.error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
          <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {t[state.error]}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-signal group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl font-semibold text-white shadow-[0_10px_40px_-10px_var(--glow)] transition-[filter] hover:brightness-110 disabled:opacity-70"
      >
        {pending ? (
          <>
            <LoaderCircle aria-hidden className="size-4 animate-spin" />
            {t.pending}
          </>
        ) : (
          <>
            {t.submit}
            <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}
