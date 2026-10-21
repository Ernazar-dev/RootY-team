"use client";

import { useId, useState } from "react";
import { Flag, FileCode2, Lightbulb, Trophy, Wrench } from "lucide-react";
import type { Locale, Localized } from "@/shared/i18n/config";
import { fromBase64, fromHex, rot13 } from "@/frontend/widgets/sim/crypto";
import { Rich } from "@/frontend/widgets/rich";

// A small, offline CTF: read the evidence, decode what looks odd, submit
// the flag. Hints cost points; wrong guesses are free so students experiment.

const flag = "ROOTY{headers_are_public}";
const maxPoints = 100;
const hintCost = 10;

const evidence = {
  "response.http": [
    "HTTP/1.1 200 OK",
    "Server: nginx/1.18.0",
    "Content-Type: text/html; charset=utf-8",
    "Set-Cookie: session=a91f0c…; HttpOnly; Secure",
    "X-Debug-Token: Uk9PVFl7aGVhZGVyc19hcmVfcHVibGljfQ==",
    "Cache-Control: no-store",
  ],
  "login.html": [
    "<!DOCTYPE html>",
    '<html lang="uz">',
    "  <head><title>Rooty Shop — kirish</title></head>",
    "  <body>",
    "    <h1>Xush kelibsiz!</h1>",
    '    <form method="post" action="/login">',
    '      <input name="username">',
    '      <input name="password" type="password">',
    "      <button>Kirish</button>",
    "    </form>",
    "    <!-- ebbgl: purpx gur urnqref -->",
    "  </body>",
    "</html>",
  ],
} as const;
type FileName = keyof typeof evidence;

type Tool = "base64" | "rot13" | "hex";
const tools: Record<Tool, (s: string) => string | null> = { base64: fromBase64, rot13, hex: fromHex };

const text = {
  title: { uz: "Mini CTF: unutilgan iz", kaa: "Mini CTF: umıtılǵan iz", ru: "Мини-CTF: забытый след", en: "Mini CTF: the forgotten trace" },
  story: {
    uz: "«Rooty Shop» dasturchisi saytni shoshilib ishga tushirdi. Ekranda oddiy kirish sahifasi — lekin u **sahifani emas, manbani** o‘qiydiganlar uchun iz qoldirgan. Server javobi va HTML kodini tekshiring.",
    kaa: "«Rooty Shop» dasturshısı saytti asıǵıs iske tústirdi. Ekranda ápiwayı kiriw beti — biraq ol **betti emes, deregin** oqıytuǵınlar ushın iz qaldırǵan. Server juwabın hám HTML kodın tekseriń.",
    ru: "Разработчик «Rooty Shop» запустил сайт в спешке. На экране обычная страница входа — но он оставил след для тех, кто читает **не страницу, а исходник**. Изучите ответ сервера и HTML-код.",
    en: "The “Rooty Shop” developer launched the site in a hurry. The screen shows a plain sign-in page — but a trace was left for those who read **the source, not the page**. Inspect the server response and the HTML.",
  },
  task: {
    uz: "Vazifa: `ROOTY{...}` ko‘rinishidagi flagni toping.",
    kaa: "Wazıypa: `ROOTY{...}` kórinisindegi flagtı tabıń.",
    ru: "Задача: найдите флаг вида `ROOTY{...}`.",
    en: "Task: find the flag that looks like `ROOTY{...}`.",
  },
  points: { uz: "ball", kaa: "ball", ru: "очков", en: "points" },
  evidence: { uz: "Dalillar · faqat o‘qish", kaa: "Dálliller · tek oqıw", ru: "Улики · только чтение", en: "Evidence · read-only" },
  tools: { uz: "Dekoder asboblari", kaa: "Dekoder quralları", ru: "Инструменты декодера", en: "Decoder tools" },
  toolInput: { uz: "Kodlangan matn", kaa: "Kodlanǵan tekst", ru: "Закодированный текст", en: "Encoded text" },
  toolOutput: { uz: "Natija", kaa: "Nátiyje", ru: "Результат", en: "Output" },
  toolError: {
    uz: "Bu matn ushbu formatda emas — boshqa asbobni sinab ko‘ring.",
    kaa: "Bul tekst bul formatta emes — basqa qurallı sınap kóriń.",
    ru: "Текст не в этом формате — попробуйте другой инструмент.",
    en: "This text is not in that format — try another tool.",
  },
  hint: { uz: "Ishora", kaa: "Belgi", ru: "Подсказка", en: "Hint" },
  openHint: { uz: "Ishorani ochish", kaa: "Belgini ashıw", ru: "Открыть подсказку", en: "Reveal a hint" },
  hintRule: {
    uz: `Har bir ishora ${hintCost} ball ayiradi. Xato urinishlar bepul.`,
    kaa: `Hár bir belgi ${hintCost} ball kemitedi. Qáte urınıwlar biypul.`,
    ru: `Каждая подсказка стоит ${hintCost} очков. Ошибки бесплатны.`,
    en: `Each hint costs ${hintCost} points. Wrong guesses are free.`,
  },
  flag: { uz: "Flag", kaa: "Flag", ru: "Флаг", en: "Flag" },
  submit: { uz: "Yuborish", kaa: "Jiberiw", ru: "Отправить", en: "Submit" },
  wrong: {
    uz: "Bu flag emas. Format: `ROOTY{...}`, harflar registri muhim.",
    kaa: "Bul flag emes. Format: `ROOTY{...}`, háripler registri áhmiyetli.",
    ru: "Это не флаг. Формат: `ROOTY{...}`, регистр важен.",
    en: "Not the flag. Format: `ROOTY{...}`, case matters.",
  },
  solved: {
    uz: "Flag topildi! Dars: sarlavhalar va HTML izohlari **hammaga ochiq**. Base64 — shifr emas, oddiy kodlash: kalitsiz ochiladi. Sirni hech qachon brauzerga yubormang.",
    kaa: "Flag tabıldı! Sabaq: sarlawhalar hám HTML túsindirmeleri **hámmege ashıq**. Base64 — shifr emes, ápiwayı kodlaw: giltsiz ashıladı. Sırdı hesh qashan brauzerge jibermeń.",
    ru: "Флаг найден! Урок: заголовки и HTML-комментарии **видны всем**. Base64 — не шифр, а просто кодировка: открывается без ключа. Никогда не отправляйте секреты в браузер.",
    en: "Flag found! Lesson: headers and HTML comments are **public**. Base64 is not encryption, just an encoding — it opens without a key. Never send secrets to the browser.",
  },
  score: { uz: "Sizning natijangiz", kaa: "Sizdiń nátiyjeńiz", ru: "Ваш результат", en: "Your score" },
} satisfies Record<string, Localized>;

const hints: Localized[] = [
  {
    uz: "HTML’dagi izoh g‘alati yozilgan. Har bir harf alifboda 13 qadam surilgan bo‘lsa-chi?",
    kaa: "HTML’degi túsindirme qızıq jazılǵan. Hár bir hárip álipbede 13 qádem jılısqan bolsa-she?",
    ru: "Комментарий в HTML написан странно. А если каждая буква сдвинута на 13 позиций?",
    en: "The HTML comment looks odd. What if every letter is shifted 13 places?",
  },
  {
    uz: "Izoh sizni server javobining sarlavhalariga yuboradi. Qaysi sarlavha standart emas?",
    kaa: "Túsindirme sizdi server juwabınıń sarlawhalarına jiberedi. Qaysı sarlawha standart emes?",
    ru: "Комментарий отправляет вас к заголовкам ответа. Какой из них нестандартный?",
    en: "The comment points you to the response headers. Which header is not a standard one?",
  },
  {
    uz: "`X-Debug-Token` qiymati `==` bilan tugaydi — bu Base64’ning tipik belgisi.",
    kaa: "`X-Debug-Token` mánisi `==` penen tamamlanadı — bul Base64’tiń tipik belgisi.",
    ru: "Значение `X-Debug-Token` заканчивается на `==` — типичный признак Base64.",
    en: "The `X-Debug-Token` value ends in `==` — a typical sign of Base64.",
  },
];

export function FlagHunt({ locale }: { locale: Locale }) {
  const ids = { tool: useId(), flag: useId() };
  const [file, setFile] = useState<FileName>("response.http");
  const [tool, setTool] = useState<Tool>("rot13");
  const [input, setInput] = useState("");
  const [hintsOpen, setHintsOpen] = useState(0);
  const [guess, setGuess] = useState("");
  const [status, setStatus] = useState<"idle" | "wrong" | "solved">("idle");

  const points = maxPoints - hintsOpen * hintCost;
  const output = input.trim() ? tools[tool](input.trim()) : "";

  return (
    <section aria-label={text.title[locale]} className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap items-start justify-between gap-4 p-5 sm:p-6">
        <div className="max-w-prose space-y-2">
          <h3 className="flex items-center gap-2 font-semibold">
            <Flag aria-hidden className="size-5 text-accent" /> {text.title[locale]}
          </h3>
          <p className="text-sm leading-relaxed">
            <Rich value={text.story[locale]} />
          </p>
          <p className="text-sm font-medium">
            <Rich value={text.task[locale]} />
          </p>
        </div>
        <p className="rounded-xl bg-accent-soft px-4 py-2 text-center">
          <span className="block font-mono text-2xl font-bold text-accent-text">{points}</span>
          <span className="text-xs text-muted">
            / {maxPoints} {text.points[locale]}
          </span>
        </p>
      </div>

      <div className="border-t border-border">
        <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 sm:px-6">
          <FileCode2 aria-hidden className="size-4 text-muted" />
          <div role="tablist" aria-label={text.evidence[locale]} className="flex">
            {(Object.keys(evidence) as FileName[]).map((name) => (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={file === name}
                onClick={() => setFile(name)}
                className="border-b-2 border-transparent px-3 py-2.5 font-mono text-xs text-muted aria-selected:border-accent aria-selected:text-text sm:text-sm"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
        <pre className="overflow-x-auto bg-code p-4 font-mono text-xs leading-6 sm:px-6 sm:text-sm">
          {evidence[file].map((line, i) => (
            <span key={i} className="block">
              <span aria-hidden className="mr-4 inline-block w-5 select-none text-right text-faint">
                {i + 1}
              </span>
              {line}
            </span>
          ))}
        </pre>
      </div>

      <div className="grid gap-6 border-t border-border p-5 sm:p-6 md:grid-cols-2">
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-semibold">
            <Wrench aria-hidden className="size-4 text-accent" /> {text.tools[locale]}
          </h4>
          <div role="group" aria-label={text.tools[locale]} className="flex gap-2">
            {(Object.keys(tools) as Tool[]).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tool === t}
                onClick={() => setTool(t)}
                className="h-8 rounded-lg border border-border px-3 font-mono text-xs uppercase aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-accent"
              >
                {t}
              </button>
            ))}
          </div>
          <label htmlFor={ids.tool} className="block text-sm">
            <span className="mb-1 block text-muted">{text.toolInput[locale]}</span>
            <input
              id={ids.tool}
              value={input}
              onChange={(event) => setInput(event.target.value.slice(0, 500))}
              autoComplete="off"
              spellCheck={false}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 font-mono text-sm focus:border-accent focus:outline-none"
            />
          </label>
          <div className="text-sm">
            <span className="mb-1 block text-muted">{text.toolOutput[locale]}</span>
            <output aria-live="polite" className="block min-h-10 break-all rounded-lg bg-code px-3 py-2 font-mono">
              {output === null ? <span className="text-danger">{text.toolError[locale]}</span> : output}
            </output>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-semibold">
            <Lightbulb aria-hidden className="size-4 text-warning" /> {text.hint[locale]} {hintsOpen}/{hints.length}
          </h4>
          <p className="text-xs text-muted">{text.hintRule[locale]}</p>
          <ol className="space-y-2">
            {hints.slice(0, hintsOpen).map((hint, i) => (
              <li key={i} className="rounded-lg bg-warning-soft px-3 py-2 text-sm">
                <Rich value={hint[locale]} />
              </li>
            ))}
          </ol>
          {hintsOpen < hints.length && status !== "solved" && (
            <button
              type="button"
              onClick={() => setHintsOpen((n) => n + 1)}
              className="h-9 rounded-lg border border-border px-3 text-sm hover:border-warning hover:text-warning"
            >
              {text.openHint[locale]} · −{hintCost}
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-surface-2 p-5 sm:p-6">
        {status === "solved" ? (
          <div className="space-y-2" aria-live="polite">
            <p className="flex items-center gap-2 font-semibold text-success">
              <Trophy aria-hidden className="size-5" /> {text.score[locale]}: {points} / {maxPoints}
            </p>
            <p className="text-sm leading-relaxed">
              <Rich value={text.solved[locale]} />
            </p>
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setStatus(guess.trim() === flag ? "solved" : "wrong");
            }}
            className="space-y-2"
          >
            <label htmlFor={ids.flag} className="block text-sm font-medium">
              {text.flag[locale]}
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                id={ids.flag}
                value={guess}
                onChange={(event) => {
                  setGuess(event.target.value);
                  setStatus("idle");
                }}
                placeholder="ROOTY{...}"
                autoComplete="off"
                spellCheck={false}
                className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 font-mono focus:border-accent focus:outline-none"
              />
              <button type="submit" className="h-10 rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent hover:bg-accent-hover">
                {text.submit[locale]}
              </button>
            </div>
            <p aria-live="polite" className="min-h-5 text-sm text-danger">
              {status === "wrong" && <Rich value={text.wrong[locale]} />}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
