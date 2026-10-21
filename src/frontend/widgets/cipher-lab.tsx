"use client";

import { useId, useState } from "react";
import { Check, KeyRound, Lock, LockOpen, Zap } from "lucide-react";
import type { Locale, Localized } from "@/shared/i18n/config";
import { atbash, caesar, caesarAll, vigenere } from "@/frontend/widgets/sim/crypto";
import { Rich } from "@/frontend/widgets/rich";

type Cipher = "caesar" | "atbash" | "vigenere";

const text = {
  title: { uz: "Shifrlar xonasi", kaa: "Shifrler bólmesi", ru: "Комната шифров", en: "Cipher room" },
  encrypt: { uz: "Shifrlash", kaa: "Shifrlaw", ru: "Зашифровать", en: "Encrypt" },
  decrypt: { uz: "Ochish", kaa: "Ashıw", ru: "Расшифровать", en: "Decrypt" },
  message: { uz: "Xabar", kaa: "Xabar", ru: "Сообщение", en: "Message" },
  result: { uz: "Natija", kaa: "Nátiyje", ru: "Результат", en: "Result" },
  shift: { uz: "Siljish (kalit)", kaa: "Jılısıw (gilt)", ru: "Сдвиг (ключ)", en: "Shift (key)" },
  key: { uz: "Kalit so‘z", kaa: "Gilt sóz", ru: "Ключевое слово", en: "Key word" },
  brute: {
    uz: "Hujumchi kabi: barcha 25 kalitni sinash",
    kaa: "Hújimshi sıyaqlı: barlıq 25 giltti sınaw",
    ru: "Как атакующий: перебрать все 25 ключей",
    en: "Like an attacker: try all 25 keys",
  },
  bruteNote: {
    uz: "Sezar shifrida atigi 25 ta kalit bor — kompyuter ularning hammasini bir zumda sinab chiqadi. Ma’noli qatorni toping!",
    kaa: "Sezar shifrinde bar bolǵanı 25 gilt bar — kompyuter olardıń hámmesin bir zamatta sınap shıǵadı. Mánili qatardı tabıń!",
    ru: "У шифра Цезаря всего 25 ключей — компьютер переберёт их мгновенно. Найдите строку со смыслом!",
    en: "Caesar has only 25 keys — a computer tries them all in an instant. Spot the line that makes sense!",
  },
  challenge: { uz: "Topshiriq", kaa: "Tapsırma", ru: "Задание", en: "Challenge" },
  answer: { uz: "Javobingiz", kaa: "Juwabıńız", ru: "Ваш ответ", en: "Your answer" },
  check: { uz: "Tekshirish", kaa: "Tekseriw", ru: "Проверить", en: "Check" },
  right: { uz: "To‘g‘ri! Shifr ochildi.", kaa: "Durıs! Shifr ashıldı.", ru: "Верно! Шифр взломан.", en: "Correct! Cipher cracked." },
  wrong: {
    uz: "Hali emas. Yuqoridagi asbobdan foydalanib ko‘ring.",
    kaa: "Ele emes. Joqarıdaǵı quraldan paydalanıp kóriń.",
    ru: "Пока нет. Воспользуйтесь инструментом выше.",
    en: "Not yet. Try the tool above.",
  },
  solved: { uz: "yechildi", kaa: "sheshildi", ru: "решено", en: "solved" },
} satisfies Record<string, Localized>;

const ciphers: Record<Cipher, { name: Localized; about: Localized }> = {
  caesar: {
    name: { uz: "Sezar", kaa: "Sezar", ru: "Цезарь", en: "Caesar" },
    about: {
      uz: "Yuliy Sezar (mil. avv. ~50-yil) har bir harfni alifboda bir necha qadam oldinga surgan. `A` → `D`, `B` → `E`… Necha qadam — shu **kalit**.",
      kaa: "Yuliy Sezar (b.e.sh. ~50-jıl) hár bir háripti álipbede bir neshe qádem aldıǵa jılıstırǵan. `A` → `D`, `B` → `E`… Neshe qádem — sol **gilt**.",
      ru: "Юлий Цезарь (~50 г. до н. э.) сдвигал каждую букву на несколько позиций вперёд. `A` → `D`, `B` → `E`… На сколько — это и есть **ключ**.",
      en: "Julius Caesar (~50 BC) moved every letter a few places along the alphabet. `A` → `D`, `B` → `E`… How far is the **key**.",
    },
  },
  atbash: {
    name: { uz: "Atbash", kaa: "Atbash", ru: "Атбаш", en: "Atbash" },
    about: {
      uz: "Eng qadimgi shifrlardan biri (~2600 yil oldin): alifbo ko‘zgudagidek teskari aylanadi — `A` ↔ `Z`, `B` ↔ `Y`. Kalit yo‘q, shuning uchun qoidani bilgan har kim o‘qiy oladi.",
      kaa: "Eń áyyemgi shifrlerdiń biri (~2600 jıl aldın): álipbe aynadaǵıday keri aylanadı — `A` ↔ `Z`, `B` ↔ `Y`. Gilt joq, sonlıqtan qaǵıydanı bilgen hár kim oqıy aladı.",
      ru: "Один из древнейших шифров (~2600 лет назад): алфавит зеркально переворачивается — `A` ↔ `Z`, `B` ↔ `Y`. Ключа нет, поэтому прочитать может любой, кто знает правило.",
      en: "One of the oldest ciphers (~2,600 years ago): the alphabet is mirrored — `A` ↔ `Z`, `B` ↔ `Y`. There is no key, so anyone who knows the rule can read it.",
    },
  },
  vigenere: {
    name: { uz: "Vijener", kaa: "Vijener", ru: "Виженер", en: "Vigenère" },
    about: {
      uz: "1553-yil: kalit **so‘z** bo‘ladi va har bir harf kalitning navbatdagi harfiga qarab har xil siljiydi. 300 yil davomida «buzilmas shifr» deb atalgan.",
      kaa: "1553-jıl: gilt **sóz** boladı hám hár bir hárip gilttiń gezektegi háribine qarap hár qıylı jılısadı. 300 jıl dawamında «buzılmas shifr» dep atalǵan.",
      ru: "1553 год: ключ — это **слово**, и каждая буква сдвигается по-разному, по очередной букве ключа. 300 лет его называли «неразгадываемым шифром».",
      en: "1553: the key is a **word**, and each letter shifts differently by the next key letter. For 300 years it was called “the indecipherable cipher”.",
    },
  },
};

const challenges: Record<Cipher, { prompt: Localized; answer: string }> = {
  caesar: {
    prompt: {
      uz: "Kalit noma’lum. Shifrni oching: `XFQTR IZSDT`",
      kaa: "Gilt belgisiz. Shifrdi ashıń: `XFQTR IZSDT`",
      ru: "Ключ неизвестен. Расшифруйте: `XFQTR IZSDT`",
      en: "The key is unknown. Decrypt: `XFQTR IZSDT`",
    },
    answer: "SALOM DUNYO",
  },
  atbash: {
    prompt: {
      uz: "Ko‘zgudan o‘qing: `ILLGB GVZN`",
      kaa: "Aynadan oqıń: `ILLGB GVZN`",
      ru: "Прочитайте в зеркале: `ILLGB GVZN`",
      en: "Read it in the mirror: `ILLGB GVZN`",
    },
    answer: "ROOTY TEAM",
  },
  vigenere: {
    prompt: {
      uz: "Kalit so‘z — `KEY`. Shifrni oching: `REAUIP`",
      kaa: "Gilt sóz — `KEY`. Shifrdi ashıń: `REAUIP`",
      ru: "Ключевое слово — `KEY`. Расшифруйте: `REAUIP`",
      en: "The key word is `KEY`. Decrypt: `REAUIP`",
    },
    answer: "HACKER",
  },
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const normalize = (s: string) => s.toUpperCase().replace(/\s+/g, " ").trim();

export function CipherLab({ locale }: { locale: Locale }) {
  const ids = { message: useId(), shift: useId(), key: useId(), answer: useId() };
  const [cipher, setCipher] = useState<Cipher>("caesar");
  const [decrypting, setDecrypting] = useState(false);
  const [message, setMessage] = useState("Salom, Rooty!");
  const [shift, setShift] = useState(3);
  const [key, setKey] = useState("ROOTY");
  const [showBrute, setShowBrute] = useState(false);
  const [answer, setAnswer] = useState("");
  const [verdict, setVerdict] = useState<"right" | "wrong" | null>(null);
  const [solved, setSolved] = useState<Cipher[]>([]);

  const result =
    cipher === "caesar"
      ? caesar(message, decrypting ? -shift : shift)
      : cipher === "atbash"
        ? atbash(message)
        : vigenere(message, key, decrypting);
  const mapped = alphabet.map((ch) => (cipher === "atbash" ? atbash(ch) : caesar(ch, shift)));
  const challenge = challenges[cipher];

  function pick(next: Cipher) {
    setCipher(next);
    setShowBrute(false);
    setAnswer("");
    setVerdict(null);
  }

  function checkAnswer() {
    const ok = normalize(answer) === challenge.answer;
    setVerdict(ok ? "right" : "wrong");
    if (ok && !solved.includes(cipher)) setSolved([...solved, cipher]);
  }

  return (
    <section aria-label={text.title[locale]} className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4 sm:px-6">
        <h3 className="flex items-center gap-2 font-semibold">
          <KeyRound aria-hidden className="size-5 text-accent" /> {text.title[locale]}
        </h3>
        <div role="tablist" aria-label={text.title[locale]} className="flex gap-1 rounded-lg bg-surface-2 p-1">
          {(Object.keys(ciphers) as Cipher[]).map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={cipher === c}
              onClick={() => pick(c)}
              className="inline-flex h-8 items-center gap-1 rounded-md px-3 text-sm text-muted aria-selected:bg-surface aria-selected:font-semibold aria-selected:text-text aria-selected:shadow-sm"
            >
              {ciphers[c].name[locale]}
              {solved.includes(c) && <Check aria-label={text.solved[locale]} className="size-3.5 text-success" />}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <p className="text-sm leading-relaxed text-muted">
          <Rich value={ciphers[cipher].about[locale]} />
        </p>

        {/* The substitution table: each top letter becomes the one under it. */}
        {cipher !== "vigenere" && (
          <div className="overflow-x-auto" aria-hidden>
            <div className="grid min-w-[39rem] grid-cols-[repeat(26,minmax(0,1fr))] gap-y-1 font-mono text-xs">
              {alphabet.map((ch) => (
                <span key={ch} className="grid h-7 place-items-center rounded-t bg-surface-2">
                  {ch}
                </span>
              ))}
              {mapped.map((ch, i) => (
                <span key={i} className="grid h-7 place-items-center rounded-b bg-accent-soft font-semibold text-accent-text">
                  {ch}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-end gap-4">
          {cipher !== "atbash" && (
            <div role="group" aria-label={`${text.encrypt[locale]} / ${text.decrypt[locale]}`} className="flex gap-2">
              {[false, true].map((d) => (
                <button
                  key={String(d)}
                  type="button"
                  aria-pressed={decrypting === d}
                  onClick={() => setDecrypting(d)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-accent"
                >
                  {d ? <LockOpen aria-hidden className="size-4" /> : <Lock aria-hidden className="size-4" />}
                  {d ? text.decrypt[locale] : text.encrypt[locale]}
                </button>
              ))}
            </div>
          )}
          {cipher === "caesar" && (
            <label htmlFor={ids.shift} className="flex min-w-48 flex-1 flex-col gap-1 text-sm">
              <span className="text-muted">
                {text.shift[locale]}: <span className="font-mono font-semibold text-text">{shift}</span>
              </span>
              <input
                id={ids.shift}
                type="range"
                min={1}
                max={25}
                value={shift}
                onChange={(event) => setShift(Number(event.target.value))}
                className="accent-(--accent)"
              />
            </label>
          )}
          {cipher === "vigenere" && (
            <label htmlFor={ids.key} className="flex flex-col gap-1 text-sm">
              <span className="text-muted">{text.key[locale]}</span>
              <input
                id={ids.key}
                value={key}
                onChange={(event) => setKey(event.target.value.replace(/[^A-Za-z]/g, "").slice(0, 16))}
                autoComplete="off"
                spellCheck={false}
                className="h-9 w-40 rounded-lg border border-border bg-surface px-3 font-mono uppercase focus:border-accent focus:outline-none"
              />
            </label>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label htmlFor={ids.message} className="block text-sm">
            <span className="mb-1 block text-muted">{text.message[locale]}</span>
            <textarea
              id={ids.message}
              value={message}
              onChange={(event) => setMessage(event.target.value.slice(0, 280))}
              rows={3}
              spellCheck={false}
              className="w-full resize-none rounded-xl border border-border bg-surface p-3 font-mono text-sm focus:border-accent focus:outline-none"
            />
          </label>
          <div className="text-sm">
            <span className="mb-1 block text-muted">{text.result[locale]}</span>
            <output aria-live="polite" className="block min-h-[5.25rem] break-words rounded-xl bg-code p-3 font-mono text-sm">
              {result}
            </output>
          </div>
        </div>

        {cipher === "caesar" && (
          <div>
            <button
              type="button"
              aria-expanded={showBrute}
              onClick={() => setShowBrute((v) => !v)}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm hover:border-accent hover:text-accent"
            >
              <Zap aria-hidden className="size-4" /> {text.brute[locale]}
            </button>
            {showBrute && (
              <div className="mt-3 space-y-2">
                <p className="text-sm text-muted">{text.bruteNote[locale]}</p>
                <ol className="max-h-56 overflow-y-auto rounded-xl bg-code p-3 font-mono text-xs leading-6 sm:text-sm">
                  {caesarAll(message).map((row) => (
                    <li key={row.shift} className="flex gap-3">
                      <span className="w-6 shrink-0 text-right text-faint">{row.shift}</span>
                      <span className="break-all">{row.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          checkAnswer();
        }}
        className="space-y-3 border-t border-border bg-surface-2 p-5 sm:p-6"
      >
        <p className="text-sm">
          <span className="mr-2 rounded-md bg-accent-soft px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-accent-text">
            {text.challenge[locale]}
          </span>
          <Rich value={challenge.prompt[locale]} />
        </p>
        <div className="flex flex-wrap gap-2">
          <label htmlFor={ids.answer} className="sr-only">
            {text.answer[locale]}
          </label>
          <input
            id={ids.answer}
            value={answer}
            onChange={(event) => {
              setAnswer(event.target.value);
              setVerdict(null);
            }}
            placeholder={text.answer[locale]}
            autoComplete="off"
            spellCheck={false}
            className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 font-mono uppercase focus:border-accent focus:outline-none"
          />
          <button type="submit" className="h-10 rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent hover:bg-accent-hover">
            {text.check[locale]}
          </button>
        </div>
        <p aria-live="polite" className="min-h-5 text-sm">
          {verdict === "right" && <span className="font-medium text-success">{text.right[locale]}</span>}
          {verdict === "wrong" && <span className="text-danger">{text.wrong[locale]}</span>}
        </p>
      </form>
    </section>
  );
}
