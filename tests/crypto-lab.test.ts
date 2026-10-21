import { test } from "node:test";
import assert from "node:assert/strict";
import { locales } from "@/shared/i18n/config";
import { caesar, crackCaesar, pigpen } from "@/frontend/widgets/sim/crypto";
import { enigma } from "@/frontend/widgets/sim/enigma";
import { cipherIds, ciphers, isRightAnswer } from "@/frontend/labs/crypto/ciphers";
import { labs, labsIntro } from "@/frontend/labs/labs";

// Walks a value and yields every Localized record with its path.
function* localizedValues(value: unknown, path: string): Generator<[string, Record<string, unknown>]> {
  if (Array.isArray(value)) {
    for (const [i, item] of value.entries()) yield* localizedValues(item, `${path}[${i}]`);
  } else if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if ("uz" in record) yield [path, record];
    else for (const [key, item] of Object.entries(record)) yield* localizedValues(item, `${path}.${key}`);
  }
}

test("every lab and cipher text exists in all four languages", () => {
  for (const [path, value] of [...localizedValues(ciphers, "ciphers"), ...localizedValues(labs, "labs"), ...localizedValues(labsIntro, "intro")]) {
    for (const locale of locales) {
      assert.ok(typeof value[locale] === "string" && (value[locale] as string).trim(), `${path} is missing "${locale}"`);
    }
  }
});

test("all sixteen ciphers are present, unique and in timeline order", () => {
  assert.deepEqual(
    ciphers.map((c) => c.id),
    [...cipherIds],
  );
  assert.equal(new Set(labs.map((lab) => lab.slug)).size, labs.length);
  assert.ok(labs.find((lab) => lab.slug === "crypto")?.open);
});

test("every exercise accepts its own answer and rejects an empty one", () => {
  for (const cipher of ciphers) {
    assert.ok(cipher.exercises.length >= 3, `${cipher.id}: needs at least 3 exercises`);
    for (const [i, ex] of cipher.exercises.entries()) {
      const where = `${cipher.id}[${i}]`;
      assert.ok(isRightAnswer(ex, ex.answer), `${where}: answer does not pass its own check`);
      assert.ok(!isRightAnswer(ex, ""), `${where}: empty answer passes`);
      if (ex.format === "choice") {
        assert.ok(ex.options && Number(ex.answer) < ex.options.length, `${where}: answer is not an option`);
      } else if (ex.format === "letters" || ex.format === "morse") {
        assert.ok(ex.given, `${where}: nothing to work from`);
      }
      if (ex.glyphs) assert.ok([...ex.given!].every((ch) => pigpen(ch)), `${where}: not drawable`);
    }
  }
});

test("answers forgive case, spaces and dash style", () => {
  const morse = ciphers.find((c) => c.id === "morse")!.exercises.find((e) => e.format === "morse")!;
  assert.ok(isRightAnswer(morse, morse.answer.replace(/-/g, "–").replace(/\./g, "·")));
  const caesarEx = ciphers.find((c) => c.id === "caesar")!.exercises[1];
  assert.ok(isRightAnswer(caesarEx, "  xavfsiz lik "));
  assert.ok(!isRightAnswer(caesarEx, "XAVFSIZ"));
});

test("frequency exercises really break with al-Kindi’s method", () => {
  const [uz, en] = ciphers.find((c) => c.id === "frequency")!.exercises;
  assert.equal(String(crackCaesar(uz.given!, "uz")), uz.answer);
  assert.equal(String(crackCaesar(en.given!, "en")), en.answer);
  // And the bench’s default text cracks too.
  assert.equal(crackCaesar(caesar("Bugun kechqurun soat yettida eski bog‘ yonida uchrashamiz. Hech kimga aytma va xatni o‘qib bo‘lgach yoqib yubor.", 6), "uz"), 6);
});

test("every cipher has steps and a weak spot", () => {
  for (const c of ciphers) {
    assert.ok(c.steps.length >= 3, `${c.id}: needs steps`);
    assert.ok(c.weakness.uz, `${c.id}: needs a weak spot`);
  }
  assert.equal(ciphers.filter((c) => c.era === "manual").length, 8);
  assert.equal(ciphers.filter((c) => c.era === "machine").length, 8);
});

test("the enigma decrypt exercise undoes itself from its key", () => {
  const ex = ciphers.find((c) => c.id === "enigma")!.exercises[0];
  assert.equal(enigma(ex.given!, ex.key!), ex.answer);
});
