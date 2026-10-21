import { test } from "node:test";
import assert from "node:assert/strict";
import {
  atbash,
  caesar,
  caesarAll,
  crackCaesar,
  fromBase64,
  fromHex,
  humanTime,
  letterCounts,
  mix,
  morseDecode,
  morseEncode,
  normalizeMorse,
  passwordStrength,
  pigpen,
  polybiusCell,
  polybiusDecrypt,
  polybiusEncrypt,
  rot13,
  scytaleDecrypt,
  scytaleEncrypt,
  tenYears,
  vigenere,
} from "@/frontend/widgets/sim/crypto";
import { enigma, parsePositions, pressKey, showPositions, stepRotors } from "@/frontend/widgets/sim/enigma";

test("caesar shifts letters, keeps case and leaves the rest alone", () => {
  assert.equal(caesar("Hello, o‘g‘il 42!", 3), "Khoor, r‘j‘lo 42!");
  assert.equal(caesar(caesar("Salom XYZ", 7), -7), "Salom XYZ");
  assert.equal(caesar("xyz", 29), "abc");
});

test("caesarAll lists all 25 keys and one of them is the answer", () => {
  const all = caesarAll("KHOOR");
  assert.equal(all.length, 25);
  assert.equal(all.find((row) => row.shift === 3)?.text, "HELLO");
});

test("atbash is its own inverse", () => {
  assert.equal(atbash("SALOM"), "HZOLN");
  assert.equal(atbash(atbash("Rooty Team")), "Rooty Team");
});

test("vigenere round-trips and skips non-letters without using the key", () => {
  assert.equal(vigenere("ATTACK AT DAWN", "LEMON"), "LXFOPV EF RNHR");
  assert.equal(vigenere("LXFOPV EF RNHR", "lemon", true), "ATTACK AT DAWN");
  assert.equal(vigenere("abc", "123"), "abc");
});

test("rot13, base64 and hex decoders", () => {
  assert.equal(rot13("ebbgl: purpx gur urnqref"), "rooty: check the headers");
  assert.equal(fromBase64("Uk9PVFl7aGVhZGVyc19hcmVfcHVibGljfQ=="), "ROOTY{headers_are_public}");
  assert.equal(fromBase64("not base64!"), null);
  assert.equal(fromBase64(""), null);
  assert.equal(fromHex("48 69 0x21"), "Hi!");
  assert.equal(fromHex("4"), null);
  assert.equal(fromHex("zz"), null);
});

test("scytale winds and unwinds the strip", () => {
  assert.equal(scytaleEncrypt("HELP ME NOW", 3), "HPNEMOLEW");
  assert.equal(scytaleDecrypt("HPNEMOLEW", 3), "HELPMENOW");
  assert.equal(scytaleEncrypt("ABCDE", 2), "ADBECX");
  assert.equal(scytaleDecrypt(scytaleEncrypt("SPARTA", 4), 4).slice(0, 6), "SPARTA");
});

test("polybius maps letters to row-column pairs, J shares with I", () => {
  assert.equal(polybiusEncrypt("Hi!"), "23 24");
  assert.equal(polybiusEncrypt("J"), "24");
  assert.equal(polybiusDecrypt("23 15 31 31 34"), "HELLO");
  assert.equal(polybiusCell("1"), null);
});

test("morse encodes words and decodes any dash style", () => {
  assert.equal(morseEncode("SOS hi"), "... --- ... / .... ..");
  assert.equal(morseDecode("··· ––– ···"), "SOS");
  assert.equal(morseDecode("... --- ... / .... .."), "SOS HI");
  assert.equal(normalizeMorse(" .-   -... /-.-. "), ".- -... / -.-.");
});

test("frequency analysis cracks a long enough Caesar text", () => {
  const plain = "Kiberxavfsizlik bu tizimlar, tarmoqlar va ma’lumotlarni hujumlardan himoya qilish san’atidir";
  assert.equal(crackCaesar(caesar(plain, 7), "uz"), 7);
  const english = "Security is not a product but a process and every system has a weakest link";
  assert.equal(crackCaesar(caesar(english, 11), "en"), 11);
  assert.equal(letterCounts("aAb!")[0], 2);
});

test("pigpen glyphs follow the grid and X layout", () => {
  assert.deepEqual(pigpen("A"), { shape: "grid", walls: [false, true, true, false], opens: "up", dot: false });
  assert.equal(pigpen("E")?.walls.every(Boolean), true);
  assert.equal(pigpen("J")?.dot, true);
  assert.deepEqual([pigpen("S")?.opens, pigpen("V")?.opens, pigpen("Z")?.dot], ["up", "down", true]);
  assert.equal(pigpen("1"), null);
});

test("enigma matches the historical test vector and is its own inverse", () => {
  assert.equal(enigma("AAAAA", "AAA"), "BDZGO");
  assert.equal(enigma(enigma("ROOTY TEAM", "KEY"), "KEY"), "ROOTY TEAM");
  // No letter ever encrypts to itself — the flaw that helped break Enigma.
  assert.ok(![...enigma("A".repeat(200), "XYZ")].includes("A"));
  // Double step: ADV -> AEW -> BFX.
  assert.equal(showPositions(stepRotors(parsePositions("ADV"))), "AEW");
  assert.equal(showPositions(stepRotors(parsePositions("AEW"))), "BFX");
  assert.equal(pressKey("A", parsePositions("AAA")).path.length, 7);
});

test("paint mixing does not depend on the order of the parts", () => {
  const a: [number, number, number] = [250, 200, 40];
  const b: [number, number, number] = [30, 90, 200];
  const c: [number, number, number] = [200, 30, 60];
  assert.deepEqual(mix(a, b, c), mix(c, a, b));
  assert.deepEqual(mix(a, a), a);
});

test("common and leetspeak passwords fall instantly", () => {
  for (const p of ["parol123", "P@ssw0rd", "qwerty", "aaaaaaaa"]) {
    assert.equal(humanTime(passwordStrength(p).seconds).unit, "instant", p);
  }
  assert.equal(passwordStrength("P@ssw0rd").weakness, "common");
  assert.equal(passwordStrength("zzzzzzzzzzzz").weakness, "repeat");
  assert.equal(passwordStrength("myabcdkey").weakness, "sequence");
});

test("long passphrases beat the ten-year goal, short mixes do not", () => {
  assert.ok(passwordStrength("olma-bulut-kok-tosh").seconds > tenYears);
  assert.ok(passwordStrength("Xy7!q").seconds < tenYears);
  assert.deepEqual(passwordStrength("aB3$").classes, ["lower", "upper", "digit", "symbol"]);
  assert.equal(passwordStrength("").bits, 0);
});

test("humanTime picks a readable unit", () => {
  assert.deepEqual(humanTime(0.2), { unit: "instant", value: 0 });
  assert.deepEqual(humanTime(90), { unit: "minutes", value: 2 });
  assert.deepEqual(humanTime(3 * 86_400), { unit: "days", value: 3 });
  assert.equal(humanTime(1e20).unit, "forever");
});
