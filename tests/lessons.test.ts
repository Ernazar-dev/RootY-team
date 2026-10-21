import { test } from "node:test";
import assert from "node:assert/strict";
import { locales } from "@/shared/i18n/config";
import { lessons } from "@/frontend/lessons";
import { parseLesson } from "@/frontend/lessons/schema";
import { defaultTrack, isTrack, tracks } from "@/frontend/lessons/tracks";

// Walks a lesson and yields every Localized value with its path.
function* localizedValues(value: unknown, path: string): Generator<[string, Record<string, unknown>]> {
  if (Array.isArray(value)) {
    for (const [i, item] of value.entries()) yield* localizedValues(item, `${path}[${i}]`);
  } else if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if ("uz" in record) yield [path, record];
    else for (const [key, item] of Object.entries(record)) yield* localizedValues(item, `${path}.${key}`);
  }
}

test("lesson slugs are unique and URL-safe", () => {
  const slugs = lessons.map((lesson) => lesson.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
});

test("every lesson text exists in all four languages", () => {
  for (const lesson of lessons) {
    for (const [path, value] of localizedValues(lesson, lesson.slug)) {
      for (const locale of locales) {
        const text = value[locale];
        assert.ok(typeof text === "string" && text.trim(), `${path} is missing "${locale}"`);
      }
    }
  }
});

test("self-checks point at a real option and headings have unique ids", () => {
  for (const lesson of lessons) {
    const ids = new Set<string>();
    for (const block of lesson.blocks) {
      if (block.kind === "check") {
        assert.ok(block.answer >= 0 && block.answer < block.options.length, lesson.slug);
      }
      if (block.kind === "heading") {
        assert.ok(!ids.has(block.id), `${lesson.slug}: duplicate heading id ${block.id}`);
        ids.add(block.id);
      }
    }
  }
});

test("tracks are unique, translated, and every lesson names one", () => {
  const slugs = tracks.map((track) => track.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const track of tracks) {
    for (const locale of locales) {
      assert.ok(track.title[locale]?.trim(), `${track.slug}: title missing "${locale}"`);
      assert.ok(track.summary[locale]?.trim(), `${track.slug}: summary missing "${locale}"`);
    }
  }
  for (const lesson of lessons) assert.ok(isTrack(lesson.track), `${lesson.slug}: unknown track "${lesson.track}"`);
});

test("lesson data without a track falls into the default one", () => {
  const { track, ...withoutTrack } = lessons[0];
  assert.ok(track);
  const parsed = parseLesson(withoutTrack);
  assert.ok(parsed.ok);
  assert.equal(parsed.lesson.track, defaultTrack);
  assert.equal(parseLesson({ ...withoutTrack, track: "nope" }).ok, false);
});
