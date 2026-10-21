"use client";

import { useId, useState } from "react";
import { Eye, EyeOff, ShieldCheck, Timer } from "lucide-react";
import type { Locale, Localized } from "@/shared/i18n/config";
import { humanTime, passwordStrength, tenYears, type CharClass, type Strength, type TimeUnit } from "@/frontend/widgets/sim/crypto";
import { Rich } from "@/frontend/widgets/rich";

const text = {
  title: { uz: "Parol ustasi", kaa: "Parol sheberi", ru: "Мастер паролей", en: "Password master" },
  goal: {
    uz: "Maqsad: hujumchi **10 yilda ham** topa olmaydigan parol o‘ylab toping.",
    kaa: "Maqset: hújimshi **10 jılda da** taba almaytuǵın parol oylap tabıń.",
    ru: "Цель: придумайте пароль, который атакующий не подберёт **даже за 10 лет**.",
    en: "Goal: invent a password an attacker could not crack **even in 10 years**.",
  },
  warn: {
    uz: "Haqiqiy parolingizni yozmang! Yozganingiz hech qayerga yuborilmaydi va saqlanmaydi.",
    kaa: "Haqıyqıy parolıńızdı jazbań! Jazǵanıńız hesh qayaqqa jiberilmeydi hám saqlanbaydı.",
    ru: "Не вводите настоящий пароль! Ввод никуда не отправляется и не сохраняется.",
    en: "Never type a real password! Nothing you type is sent or stored.",
  },
  label: { uz: "Sinov paroli", kaa: "Sınaq parolı", ru: "Тестовый пароль", en: "Test password" },
  show: { uz: "Ko‘rsatish", kaa: "Kórsetiw", ru: "Показать", en: "Show" },
  hide: { uz: "Yashirish", kaa: "Jasırıw", ru: "Скрыть", en: "Hide" },
  try: { uz: "Sinab ko‘ring:", kaa: "Sınap kóriń:", ru: "Попробуйте:", en: "Try:" },
  empty: { uz: "Parol yozishni boshlang.", kaa: "Parol jazıwdı baslań.", ru: "Начните вводить пароль.", en: "Start typing a password." },
  crackIn: {
    uz: "Buzish uchun kerak bo‘ladigan vaqt",
    kaa: "Buzıw ushın kerek bolatuǵın waqıt",
    ru: "Время на взлом",
    en: "Time to crack",
  },
  speed: {
    uz: "Soniyasiga 10 milliard urinish tezligidagi hujum uchun.",
    kaa: "Sekundına 10 milliard urınıw tezligindegi hújim ushın.",
    ru: "Для атаки со скоростью 10 миллиардов попыток в секунду.",
    en: "For an attack at 10 billion guesses per second.",
  },
  length: { uz: "Uzunlik", kaa: "Uzınlıq", ru: "Длина", en: "Length" },
  bits: { uz: "Entropiya", kaa: "Entropiya", ru: "Энтропия", en: "Entropy" },
  done: {
    uz: "Zo‘r! Bu parolni buzishga 10 yildan ko‘p vaqt ketadi.",
    kaa: "Ájayıp! Bul paroldı buzıwǵa 10 jıldan kóp waqıt ketedi.",
    ru: "Отлично! На взлом такого пароля уйдёт больше 10 лет.",
    en: "Great! Cracking this would take more than 10 years.",
  },
  tip: {
    uz: "**Sir:** uzunlik murakkablikdan kuchliroq. 4–5 ta tasodifiy so‘z yoki 14+ aralash belgi ishlating, har sayt uchun alohida parol va iloji bo‘lsa ikki bosqichli tasdiqlash (2FA) yoqing.",
    kaa: "**Sır:** uzınlıq quramalılıqtan kúshlirek. 4–5 tosınnan sóz yamasa 14+ aralas belgi isletiń, hár sayt ushın bólek parol hám múmkin bolsa eki basqıshlı tastıyıqlaw (2FA) qosıń.",
    ru: "**Секрет:** длина сильнее сложности. Берите 4–5 случайных слов или 14+ смешанных символов, свой пароль для каждого сайта и, если можно, двухфакторную защиту (2FA).",
    en: "**The secret:** length beats complexity. Use 4–5 random words or 14+ mixed characters, a different password per site, and two-factor authentication (2FA) where you can.",
  },
} satisfies Record<string, Localized>;

const classLabels: Record<CharClass, string> = { lower: "a–z", upper: "A–Z", digit: "0–9", symbol: "!@#…" };

const weaknesses: Record<NonNullable<Strength["weakness"]>, Localized> = {
  common: {
    uz: "Bu parol sizib chiqqan parollar ro‘yxatining boshida turadi — hujumchi uni birinchi bo‘lib sinaydi. `a` o‘rniga `@`, `o` o‘rniga `0` kabi almashtirishlar ham yordam bermaydi.",
    kaa: "Bul parol sızıp shıqqan parollar diziminiń basında tur — hújimshi onı birinshi bolıp sınaydı. `a` ornına `@`, `o` ornına `0` sıyaqlı almastırıwlar da járdem bermeydi.",
    ru: "Этот пароль стоит в начале списков утёкших паролей — атакующий попробует его первым. Замены вроде `@` вместо `a` и `0` вместо `o` тоже не спасают.",
    en: "This one sits at the top of leaked-password lists — an attacker tries it first. Swaps like `@` for `a` or `0` for `o` don’t help either.",
  },
  repeat: {
    uz: "Bir xil belgilar takrorlanmoqda — bunday naqshlar tez topiladi.",
    kaa: "Birdey belgiler qaytalanbaqta — bunday naqıslar tez tabıladı.",
    ru: "Символы повторяются — такие шаблоны находят быстро.",
    en: "Characters repeat — patterns like this are found quickly.",
  },
  sequence: {
    uz: "Ichida `abcd`, `1234` yoki `qwer` kabi ketma-ketlik bor — buzish dasturlari ularni avval sinaydi.",
    kaa: "Ishinde `abcd`, `1234` yamasa `qwer` sıyaqlı izbe-izlik bar — buzıw baǵdarlamaları olardı aldın sınaydı.",
    ru: "Внутри есть последовательность вроде `abcd`, `1234` или `qwer` — программы-взломщики пробуют их первыми.",
    en: "It contains a run like `abcd`, `1234` or `qwer` — cracking tools try those first.",
  },
};

const units: Record<TimeUnit, Localized> = {
  instant: { uz: "bir zumda", kaa: "bir zamatta", ru: "мгновенно", en: "instantly" },
  seconds: { uz: "soniya", kaa: "sekund", ru: "сек.", en: "seconds" },
  minutes: { uz: "daqiqa", kaa: "minut", ru: "мин.", en: "minutes" },
  hours: { uz: "soat", kaa: "saat", ru: "ч.", en: "hours" },
  days: { uz: "kun", kaa: "kún", ru: "дн.", en: "days" },
  years: { uz: "yil", kaa: "jıl", ru: "лет", en: "years" },
  centuries: { uz: "asr", kaa: "ásir", ru: "веков", en: "centuries" },
  forever: { uz: "million yildan ko‘p", kaa: "million jıldan kóp", ru: "больше миллиона лет", en: "over a million years" },
};

const samples = ["parol123", "P@ssw0rd", "Tashkent2024!", "olma-bulut-ko‘k-tosh"];

function tone(seconds: number) {
  if (seconds >= tenYears) return { bar: "bg-success", text: "text-success" };
  if (seconds >= 86_400 * 30) return { bar: "bg-warning", text: "text-warning" };
  return { bar: "bg-danger", text: "text-danger" };
}

export function PasswordMeter({ locale }: { locale: Locale }) {
  const id = useId();
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(true);
  const s = passwordStrength(password);
  const time = humanTime(s.seconds);
  const colors = tone(s.seconds);

  return (
    <section aria-label={text.title[locale]} className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <ShieldCheck aria-hidden className="size-5 text-accent" />
          <h3 className="font-semibold">{text.title[locale]}</h3>
        </div>
        <p className="text-sm leading-relaxed">
          <Rich value={text.goal[locale]} />
        </p>
        <p className="rounded-lg bg-warning-soft px-3 py-2 text-sm text-warning">{text.warn[locale]}</p>

        <div>
          <label htmlFor={id} className="mb-1 block text-sm text-muted">
            {text.label[locale]}
          </label>
          <div className="flex gap-2">
            <input
              id={id}
              type={visible ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="h-11 min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 font-mono focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? text.hide[locale] : text.show[locale]}
              className="grid size-11 place-items-center rounded-lg border border-border text-muted hover:text-text"
            >
              {visible ? <EyeOff aria-hidden className="size-4" /> : <Eye aria-hidden className="size-4" />}
            </button>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted">{text.try[locale]}</span>
            {samples.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => setPassword(sample)}
                className="rounded-md border border-border px-2 py-0.5 font-mono text-xs hover:border-accent hover:text-accent"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-border bg-surface-2 p-5 sm:p-6" aria-live="polite">
        {password ? (
          <>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 text-sm text-muted">
                  <Timer aria-hidden className="size-4" /> {text.crackIn[locale]}
                </p>
                <p className={`text-2xl font-bold ${colors.text}`}>
                  {time.value ? `${time.value.toLocaleString("en").replace(/,/g, " ")} ` : ""}
                  {units[time.unit][locale]}
                </p>
              </div>
              <dl className="flex gap-4 text-sm">
                <div>
                  <dt className="text-muted">{text.length[locale]}</dt>
                  <dd className="font-mono font-semibold">{s.length}</dd>
                </div>
                <div>
                  <dt className="text-muted">{text.bits[locale]}</dt>
                  <dd className="font-mono font-semibold">{s.bits} bit</dd>
                </div>
              </dl>
            </div>
            {/* 100 bits fills the bar; the 10-year goal is about 71 bits at this speed. */}
            <div className="h-2 overflow-hidden rounded-full bg-border">
              <div
                className={`h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none ${colors.bar}`}
                style={{ width: `${Math.min(100, s.bits)}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(classLabels) as CharClass[]).map((c) => (
                <span
                  key={c}
                  className={`rounded-md px-2 py-0.5 font-mono text-xs ${
                    s.classes.includes(c) ? "bg-accent-soft text-accent-text" : "bg-surface text-faint line-through"
                  }`}
                >
                  {classLabels[c]}
                </span>
              ))}
            </div>
            {s.weakness && (
              <p className="text-sm leading-relaxed text-danger">
                <Rich value={weaknesses[s.weakness][locale]} />
              </p>
            )}
            {s.seconds >= tenYears && (
              <p className="rounded-lg bg-success-soft px-3 py-2 text-sm font-medium text-success">{text.done[locale]}</p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted">{text.empty[locale]}</p>
        )}
        <p className="text-xs text-muted">{text.speed[locale]}</p>
        <p className="text-sm leading-relaxed">
          <Rich value={text.tip[locale]} />
        </p>
      </div>
    </section>
  );
}
