import { test } from "node:test";
import assert from "node:assert/strict";
import { lessons } from "@/frontend/lessons";
import { parseLesson } from "@/frontend/lessons/schema";
import { codeHashOf, mergeLessons, publishedLessons } from "@/backend/lessons/merge";

const base = lessons[0]!;
const copy = (patch: object) => ({ ...structuredClone(base), ...patch });

test("every code lesson passes the admin-panel schema", () => {
  for (const lesson of lessons) {
    const result = parseLesson(JSON.parse(JSON.stringify(lesson)));
    assert.ok(result.ok, `${lesson.slug}: ${result.ok ? "" : result.errors.join("; ")}`);
  }
});

test("the schema rejects broken lessons with readable paths", () => {
  const missingLanguage = copy({ title: { uz: "X", kaa: "X", ru: "X" } });
  const r1 = parseLesson(missingLanguage);
  assert.ok(!r1.ok && r1.errors.some((e) => e.startsWith("title.en")));

  const badAnswer = copy({
    blocks: [{ kind: "check", question: base.title, options: [base.title, base.title], answer: 5, explain: base.title }],
  });
  const r2 = parseLesson(badAnswer);
  assert.ok(!r2.ok && r2.errors.some((e) => e.includes("answer")));

  const unknownWidget = copy({ blocks: [{ kind: "widget", widget: "nope" }] });
  assert.ok(!parseLesson(unknownWidget).ok);
});

test("without edits, code lessons are served as they are", () => {
  const entries = mergeLessons(lessons, []);
  assert.deepEqual(publishedLessons(entries), lessons);
  assert.ok(entries.every((e) => e.source === "code"));
});

test("an admin edit overrides the code lesson with the same slug", () => {
  const edited = copy({ minutes: 42 });
  const [entry] = mergeLessons([base], [{ slug: base.slug, data: edited, published: true, codeHash: codeHashOf(base) }]);
  assert.equal(entry!.source, "override");
  assert.equal(entry!.lesson.minutes, 42);
  assert.equal(entry!.codeChanged, false);
});

test("a stale override is flagged when the code changed after it", () => {
  const [entry] = mergeLessons([base], [{ slug: base.slug, data: copy({ minutes: 42 }), published: true, codeHash: "old-hash" }]);
  assert.equal(entry!.codeChanged, true);
});

test("an invalid stored edit is ignored and the code version stays live", () => {
  const [entry] = mergeLessons([base], [{ slug: base.slug, data: { slug: base.slug }, published: true, codeHash: null }]);
  assert.equal(entry!.source, "code");
  assert.equal(entry!.invalid, true);
  assert.equal(entry!.lesson, base);
});

test("admin-only lessons are added, hidden ones are left out, order is kept", () => {
  const extra = copy({ slug: "sql-injection", order: 0 });
  const hidden = copy({ slug: "draft", order: 5 });
  const entries = mergeLessons([base], [
    { slug: "sql-injection", data: extra, published: true, codeHash: null },
    { slug: "draft", data: hidden, published: false, codeHash: null },
  ]);
  assert.deepEqual(entries.map((e) => [e.lesson.slug, e.source]), [
    ["sql-injection", "admin"],
    [base.slug, "code"],
    ["draft", "admin"],
  ]);
  assert.deepEqual(publishedLessons(entries).map((l) => l.slug), ["sql-injection", base.slug]);
});
