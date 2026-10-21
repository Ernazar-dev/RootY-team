// Database schema (Drizzle). Change it here, then `npm run db:generate`
// writes a migration into /drizzle and `npm run db:migrate` applies it.
// No "server-only" import: drizzle-kit and the scripts load this file in Node.
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["student", "admin"]);
export const progressEnum = pgEnum("progress_status", ["started", "completed"]);

const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

/** A class or cohort, e.g. "2026-bahor". */
export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: createdAt(),
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Lower-case sign-in name, e.g. "aziz.karimov". */
    login: text("login").notNull().unique(),
    name: text("name").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").notNull().default("student"),
    groupId: integer("group_id").references(() => groups.id, { onDelete: "set null" }),
    active: boolean("active").notNull().default(true),
    createdAt: createdAt(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  },
  (t) => [index("users_group_idx").on(t.groupId)],
);

/**
 * Server-side sessions. The cookie holds a random token; only its SHA-256
 * hash is stored, so a leaked table cannot be replayed as cookies.
 */
export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

/** One row per student per lesson. */
export const lessonProgress = pgTable(
  "lesson_progress",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonSlug: text("lesson_slug").notNull(),
    status: progressEnum("status").notNull().default("started"),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonSlug] }), index("progress_lesson_idx").on(t.lessonSlug)],
);

/** Every answer a student submits to an in-lesson self-check. */
export const checkAttempts = pgTable(
  "check_attempts",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonSlug: text("lesson_slug").notNull(),
    /** Position of the check among the lesson's check blocks. */
    checkIndex: integer("check_index").notNull(),
    picked: integer("picked").notNull(),
    correct: boolean("correct").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("attempts_user_lesson_idx").on(t.userId, t.lessonSlug)],
);

/**
 * Lessons edited or added in the admin panel. A row whose slug matches a
 * lesson in code overrides it; any other row is a lesson that exists only
 * here. `codeHash` remembers which code version an override was based on,
 * so the panel can warn when the code changed afterwards.
 */
export const lessonEdits = pgTable("lesson_edits", {
  slug: text("slug").primaryKey(),
  data: jsonb("data").notNull(),
  published: boolean("published").notNull().default(true),
  codeHash: text("code_hash"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
});

/** Sign-in attempts, for brute-force limits and the admin activity feed. */
export const authAttempts = pgTable(
  "auth_attempts",
  {
    id: serial("id").primaryKey(),
    login: text("login").notNull(),
    ip: text("ip").notNull(),
    ok: boolean("ok").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("auth_attempts_login_idx").on(t.login, t.createdAt), index("auth_attempts_ip_idx").on(t.ip, t.createdAt)],
);

/** One row per student per solved CTF challenge (and hints they opened). */
export const ctfSolves = pgTable(
  "ctf_solves",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    challengeId: text("challenge_id").notNull(),
    hintsUsed: integer("hints_used").notNull().default(0),
    solvedAt: timestamp("solved_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.challengeId] }), index("ctf_solves_challenge_idx").on(t.challengeId)],
);

export type User = typeof users.$inferSelect;
export type Group = typeof groups.$inferSelect;
