"use client";

import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Copy, KeyRound, LoaderCircle, Pencil, Trash2, UserPlus, X } from "lucide-react";
import {
  createGroup,
  createStudent,
  deleteGroup,
  renameGroup,
  resetStudentPassword,
  updateStudent,
  type ActionState,
} from "@/backend/services/admin-actions";
import { ui } from "./ui";

type GroupOption = { id: number; name: string };

function Spinner() {
  return <LoaderCircle aria-hidden className="size-4 animate-spin" />;
}

function ErrorText({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p role="alert" className="text-sm text-danger">
      {children}
    </p>
  );
}

/** A new password, shown once, with a copy button. */
export function PasswordReveal({ login, password }: { login?: string; password: string }) {
  const [copied, setCopied] = useState(false);
  const text = login ? `Login: ${login}\nParol: ${password}` : password;
  return (
    <div role="status" className="rounded-xl border border-success/30 bg-success-soft p-4 text-sm">
      <p className="font-medium text-success">Saqlab qo‘ying — parol boshqa ko‘rsatilmaydi.</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <code className="rounded-lg bg-bg px-3 py-2 font-mono text-[0.9375rem] whitespace-pre">{text}</code>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(text).then(() => setCopied(true))}
          className={`${ui.btn} ${ui.ghost} h-9`}
        >
          {copied ? <Check aria-hidden className="size-4 text-success" /> : <Copy aria-hidden className="size-4" />}
          {copied ? "Nusxalandi" : "Nusxalash"}
        </button>
      </div>
    </div>
  );
}

/**
 * Submit button for destructive actions: the first click arms it, the
 * second within a few seconds submits. No browser dialog needed.
 */
export function ConfirmSubmit({ children, confirm = "Ishonchingiz komilmi? Yana bosing", className = "" }: { children: ReactNode; confirm?: string; className?: string }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const id = window.setTimeout(() => setArmed(false), 4000);
    return () => window.clearTimeout(id);
  }, [armed]);
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!armed) {
          e.preventDefault();
          setArmed(true);
        }
      }}
      className={`${ui.btn} ${ui.danger} ${armed ? "bg-danger-soft" : ""} ${className}`}
    >
      <Trash2 aria-hidden className="size-4" />
      {armed ? confirm : children}
    </button>
  );
}

function GroupSelect({ groups, defaultValue }: { groups: GroupOption[]; defaultValue?: number | null }) {
  return (
    <select name="groupId" defaultValue={defaultValue ?? ""} className={ui.input}>
      <option value="">— Guruhsiz —</option>
      {groups.map((g) => (
        <option key={g.id} value={g.id}>
          {g.name}
        </option>
      ))}
    </select>
  );
}

export function CreateStudentForm({ groups, defaultGroup }: { groups: GroupOption[]; defaultGroup?: number }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(createStudent, {});
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) form.current?.reset();
  }, [state]);

  return (
    <form ref={form} action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <label htmlFor="s-name" className={ui.label}>
            Ism familiya
          </label>
          <input id="s-name" name="name" required placeholder="Aziz Karimov" className={ui.input} />
        </div>
        <div>
          <label htmlFor="s-login" className={ui.label}>
            Login
          </label>
          <input id="s-login" name="login" required placeholder="aziz.karimov" autoCapitalize="none" spellCheck={false} className={`${ui.input} font-mono`} />
        </div>
        <div>
          <label htmlFor="s-group" className={ui.label}>
            Guruh
          </label>
          <GroupSelect groups={groups} defaultValue={defaultGroup} />
        </div>
        <div>
          <label htmlFor="s-pass" className={ui.label}>
            Parol <span className="text-faint">(bo‘sh — avtomatik)</span>
          </label>
          <input id="s-pass" name="password" autoComplete="new-password" placeholder="avtomatik yaratiladi" className={`${ui.input} font-mono`} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className={`${ui.btn} ${ui.primary}`}>
          {pending ? <Spinner /> : <UserPlus aria-hidden className="size-4" />}
          O‘quvchi qo‘shish
        </button>
        <ErrorText>{state.error}</ErrorText>
      </div>
      {state.ok && state.password && <PasswordReveal login={state.login} password={state.password} />}
    </form>
  );
}

export function StudentEditForm({
  student,
  groups,
}: {
  student: { id: string; name: string; groupId: number | null; active: boolean };
  groups: GroupOption[];
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateStudent, {});
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={student.id} />
      <div>
        <label htmlFor="e-name" className={ui.label}>
          Ism familiya
        </label>
        <input id="e-name" name="name" defaultValue={student.name} required className={ui.input} />
      </div>
      <div>
        <label className={ui.label}>Guruh</label>
        <GroupSelect groups={groups} defaultValue={student.groupId} />
      </div>
      <label className="flex cursor-pointer items-center gap-3 text-sm">
        <input type="checkbox" name="active" defaultChecked={student.active} className="size-4 accent-(--accent)" />
        Hisob faol (o‘chirilsa — kira olmaydi va darhol tizimdan chiqariladi)
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className={`${ui.btn} ${ui.primary}`}>
          {pending && <Spinner />}
          Saqlash
        </button>
        {state.ok && !pending && <span className="text-sm text-success">Saqlandi</span>}
        <ErrorText>{state.error}</ErrorText>
      </div>
    </form>
  );
}

export function ResetPasswordForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(resetStudentPassword, {});
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <p className="text-sm text-muted">Yangi parol yaratiladi va o‘quvchi barcha qurilmalarda tizimdan chiqariladi.</p>
      <button type="submit" disabled={pending} className={`${ui.btn} ${ui.ghost}`}>
        {pending ? <Spinner /> : <KeyRound aria-hidden className="size-4" />}
        Parolni tiklash
      </button>
      <ErrorText>{state.error}</ErrorText>
      {state.ok && state.password && <PasswordReveal login={state.login} password={state.password} />}
    </form>
  );
}

export function CreateGroupForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(createGroup, {});
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) form.current?.reset();
  }, [state]);
  return (
    <form ref={form} action={action} className="flex flex-wrap items-end gap-3">
      <div className="min-w-60 flex-1">
        <label htmlFor="g-name" className={ui.label}>
          Yangi guruh
        </label>
        <input id="g-name" name="name" required placeholder="Masalan: 2026-bahor" className={ui.input} />
      </div>
      <button type="submit" disabled={pending} className={`${ui.btn} ${ui.primary}`}>
        {pending && <Spinner />}
        Qo‘shish
      </button>
      <div className="basis-full">
        <ErrorText>{state.error}</ErrorText>
      </div>
    </form>
  );
}

export function GroupRename({ id, name }: { id: number; name: string }) {
  const [editing, setEditing] = useState(false);
  const [state, action, pending] = useActionState<ActionState, FormData>(renameGroup, {});
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close the editor once saved
    if (state.ok) setEditing(false);
  }, [state]);

  if (!editing) {
    return (
      <span className="flex items-center gap-2">
        <span className="font-medium">{name}</span>
        <button type="button" onClick={() => setEditing(true)} aria-label={`«${name}» nomini o‘zgartirish`} className="grid size-7 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-text">
          <Pencil aria-hidden className="size-3.5" />
        </button>
      </span>
    );
  }
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <input name="name" defaultValue={name} autoFocus required aria-label="Guruh nomi" className={`${ui.input} h-9 w-56`} />
      <button type="submit" disabled={pending} aria-label="Saqlash" className={`${ui.btn} ${ui.primary} h-9 px-3`}>
        {pending ? <Spinner /> : <Check aria-hidden className="size-4" />}
      </button>
      <button type="button" onClick={() => setEditing(false)} aria-label="Bekor qilish" className={`${ui.btn} ${ui.ghost} h-9 px-3`}>
        <X aria-hidden className="size-4" />
      </button>
      <ErrorText>{state.error}</ErrorText>
    </form>
  );
}

export function GroupDelete({ id }: { id: number }) {
  return (
    <form action={deleteGroup}>
      <input type="hidden" name="id" value={id} />
      <ConfirmSubmit confirm="Ha, o‘chirish" className="h-9">
        O‘chirish
      </ConfirmSubmit>
    </form>
  );
}
