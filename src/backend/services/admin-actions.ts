"use server";

// Admin mutations. Every export here is a public endpoint, so each one
// starts with requireAdmin() and validates its input itself.
import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/backend/db";
import { requireAdmin } from "@/backend/auth/dal";
import { deleteUserSessions } from "@/backend/auth/session";
import { MIN_PASSWORD, generatePassword, hashPassword, isValidLogin, normalizeLogin } from "@/backend/auth/password";
import { LESSONS_TAG } from "@/backend/lessons/catalog";
import { codeHashOf } from "@/backend/lessons/merge";
import { lessons as codeLessons } from "@/frontend/lessons";
import { parseLesson } from "@/frontend/lessons/schema";

const { groups, lessonEdits, users } = schema;

export type ActionState = {
  ok?: boolean;
  error?: string;
  /** Validation messages, one per line (lesson editor). */
  errors?: string[];
  /** A password to show the admin once. */
  password?: string;
  login?: string;
};

const uuid = z.string().uuid();
const groupId = z.preprocess((v) => (v === "" || v == null ? null : Number(v)), z.number().int().positive().nullable());

function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "23505";
}

// ---------- Students ----------

const studentInput = z.object({
  name: z.string().trim().min(2, "Ism kamida 2 harf").max(80),
  login: z.string().transform(normalizeLogin).refine(isValidLogin, "Login: 3–32 belgi — lotin harflari, raqamlar, . _ -"),
  groupId,
  password: z
    .string()
    .trim()
    .transform((v) => v || undefined)
    .pipe(z.string().min(MIN_PASSWORD, `Parol kamida ${MIN_PASSWORD} belgi`).optional()),
});

export async function createStudent(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const input = studentInput.safeParse(Object.fromEntries(formData));
  if (!input.success) return { error: input.error.issues[0]?.message };
  const password = input.data.password ?? generatePassword();
  try {
    await db.insert(users).values({
      name: input.data.name,
      login: input.data.login,
      groupId: input.data.groupId,
      passwordHash: await hashPassword(password),
      role: "student",
    });
  } catch (error) {
    if (isUniqueViolation(error)) return { error: `«${input.data.login}» logini band` };
    throw error;
  }
  refresh();
  return { ok: true, login: input.data.login, password };
}

export async function updateStudent(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const input = z
    .object({ id: uuid, name: studentInput.shape.name, groupId, active: z.preprocess((v) => v === "on", z.boolean()) })
    .safeParse(Object.fromEntries(formData));
  if (!input.success) return { error: input.error.issues[0]?.message };
  const { id, ...values } = input.data;
  await db.update(users).set(values).where(and(eq(users.id, id), eq(users.role, "student")));
  // A deactivated student is signed out at once.
  if (!values.active) await deleteUserSessions(id);
  refresh();
  return { ok: true };
}

export async function resetStudentPassword(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = uuid.safeParse(formData.get("id"));
  if (!id.success) return { error: "Noto‘g‘ri so‘rov" };
  const password = generatePassword();
  const updated = await db
    .update(users)
    .set({ passwordHash: await hashPassword(password) })
    .where(and(eq(users.id, id.data), eq(users.role, "student")))
    .returning({ login: users.login });
  if (!updated[0]) return { error: "O‘quvchi topilmadi" };
  await deleteUserSessions(id.data);
  return { ok: true, password, login: updated[0].login };
}

export async function deleteStudent(formData: FormData) {
  await requireAdmin();
  const id = uuid.safeParse(formData.get("id"));
  if (id.success) await db.delete(users).where(and(eq(users.id, id.data), eq(users.role, "student")));
  redirect("/admin/students");
}

// ---------- Groups ----------

const groupName = z.string().trim().min(1, "Guruh nomini yozing").max(60);

export async function createGroup(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const name = groupName.safeParse(formData.get("name"));
  if (!name.success) return { error: name.error.issues[0]?.message };
  try {
    await db.insert(groups).values({ name: name.data });
  } catch (error) {
    if (isUniqueViolation(error)) return { error: "Bunday guruh bor" };
    throw error;
  }
  refresh();
  return { ok: true };
}

export async function renameGroup(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const input = z.object({ id: z.coerce.number().int().positive(), name: groupName }).safeParse(Object.fromEntries(formData));
  if (!input.success) return { error: input.error.issues[0]?.message };
  try {
    await db.update(groups).set({ name: input.data.name }).where(eq(groups.id, input.data.id));
  } catch (error) {
    if (isUniqueViolation(error)) return { error: "Bunday guruh bor" };
    throw error;
  }
  refresh();
  return { ok: true };
}

/** Students of a deleted group stay, just without a group. */
export async function deleteGroup(formData: FormData) {
  await requireAdmin();
  const id = z.coerce.number().int().positive().safeParse(formData.get("id"));
  if (id.success) await db.delete(groups).where(eq(groups.id, id.data));
  refresh();
}

// ---------- Lessons ----------

function readJson(raw: FormDataEntryValue | null): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(String(raw ?? "")) };
  } catch (error) {
    return { ok: false, error: `JSON xato: ${(error as Error).message}` };
  }
}

/** Saves an edit of an existing lesson (code or admin-only). The slug is fixed. */
export async function saveLesson(_: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  const json = readJson(formData.get("json"));
  if (!json.ok) return { errors: [json.error] };
  const parsed = parseLesson(json.value);
  if (!parsed.ok) return { errors: parsed.errors };
  if (parsed.lesson.slug !== slug) return { errors: [`slug o‘zgartirilmaydi: «${slug}» bo‘lib qolishi kerak (havolalar buzilmasin)`] };

  const code = codeLessons.find((l) => l.slug === slug);
  const [existing] = await db.select({ slug: lessonEdits.slug }).from(lessonEdits).where(eq(lessonEdits.slug, slug));
  if (!code && !existing) return { errors: ["Dars topilmadi"] };

  const published = formData.get("published") === "on";
  const values = {
    data: parsed.lesson,
    published,
    codeHash: code ? codeHashOf(code) : null,
    updatedAt: new Date(),
    updatedBy: admin.id,
  };
  await db.insert(lessonEdits).values({ slug, ...values }).onConflictDoUpdate({ target: lessonEdits.slug, set: values });
  updateTag(LESSONS_TAG);
  return { ok: true };
}

/** Adds a lesson that exists only in the admin panel. */
export async function createLesson(_: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const json = readJson(formData.get("json"));
  if (!json.ok) return { errors: [json.error] };
  const parsed = parseLesson(json.value);
  if (!parsed.ok) return { errors: parsed.errors };
  const { slug } = parsed.lesson;
  if (codeLessons.some((l) => l.slug === slug)) return { errors: [`«${slug}» kodda bor — uni ro‘yxatdan tahrirlang`] };
  try {
    await db.insert(lessonEdits).values({ slug, data: parsed.lesson, published: formData.get("published") === "on", updatedBy: admin.id });
  } catch (error) {
    if (isUniqueViolation(error)) return { errors: [`«${slug}» slug band`] };
    throw error;
  }
  updateTag(LESSONS_TAG);
  redirect(`/admin/lessons/${slug}`);
}

/** Drops the admin edit: a code lesson goes back to its code version, an admin-only lesson is deleted. */
export async function resetLesson(formData: FormData) {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  await db.delete(lessonEdits).where(eq(lessonEdits.slug, slug));
  updateTag(LESSONS_TAG);
  redirect(codeLessons.some((l) => l.slug === slug) ? `/admin/lessons/${slug}` : "/admin/lessons");
}
