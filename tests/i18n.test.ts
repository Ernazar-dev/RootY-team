import { test } from "node:test";
import assert from "node:assert/strict";
import { negotiateLocale, switchLocalePath } from "@/shared/i18n/config";
import { format } from "@/shared/i18n/format";
import uz from "@/shared/i18n/messages/uz";
import kaa from "@/shared/i18n/messages/kaa";
import ru from "@/shared/i18n/messages/ru";
import en from "@/shared/i18n/messages/en";

test("negotiates the visitor's language", () => {
  assert.equal(negotiateLocale("ru-RU,ru;q=0.9,en;q=0.8"), "ru");
  assert.equal(negotiateLocale("en-US,en;q=0.9"), "en");
  assert.equal(negotiateLocale("de-DE,en;q=0.5"), "en");
  assert.equal(negotiateLocale("kaa"), "kaa");
  assert.equal(negotiateLocale("fr-FR"), "uz");
  assert.equal(negotiateLocale(null), "uz");
});

test("switches the language segment of a path", () => {
  assert.equal(switchLocalePath("/uz/learn/http-basics", "ru"), "/ru/learn/http-basics");
  assert.equal(switchLocalePath("/en", "kaa"), "/kaa");
  assert.equal(switchLocalePath("/learn", "en"), "/en/learn");
});

test("fills placeholders", () => {
  assert.equal(format("{n} min", { n: 5 }), "5 min");
  assert.equal(format("{missing}", {}), "{missing}");
});

function flatten(value: unknown, prefix = ""): Record<string, unknown> {
  if (!value || typeof value !== "object") return { [prefix]: value };
  return Object.assign(
    {},
    ...Object.entries(value).map(([key, item]) => flatten(item, prefix ? `${prefix}.${key}` : key)),
  );
}

test("every dictionary has the same non-empty keys as Uzbek", () => {
  const source = flatten(uz);
  for (const [name, dictionary] of Object.entries({ kaa, ru, en })) {
    const flat = flatten(dictionary);
    assert.deepEqual(Object.keys(flat).sort(), Object.keys(source).sort(), name);
    for (const [key, text] of Object.entries(flat)) {
      assert.ok(typeof text === "string" && text.trim(), `${name}.${key} is empty`);
    }
  }
});
