"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Database, Globe, Pause, Play, RotateCcw, Server, Waypoints } from "lucide-react";
import type { Locale, Localized } from "@/shared/i18n/config";
import { Rich } from "@/frontend/widgets/rich";

type Node = "browser" | "network" | "backend" | "database";

const text = {
  title: { uz: "Bitta so‘rovning sayohati", kaa: "Bir sorawdıń sayaxatı", ru: "Путешествие одного запроса", en: "The journey of one request" },
  intro: {
    uz: "Aziza «Profilim» tugmasini bosdi. Ma’lumot qayerga boradi, kim nimani tekshiradi va qayerda saqlanadi — qadam-baqadam kuzating.",
    kaa: "Aziza «Profilim» túymesin bastı. Maǵlıwmat qayaqqa baradı, kim neni tekseredi hám qay jerde saqlanadı — qádem-baqádem baqlań.",
    ru: "Азиза нажала «Мой профиль». Куда идут данные, кто что проверяет и где они хранятся — смотрите шаг за шагом.",
    en: "Aziza pressed “My profile”. Where does the data go, who checks what, and where is it stored? Follow it step by step.",
  },
  step: { uz: "Qadam", kaa: "Qádem", ru: "Шаг", en: "Step" },
  prev: { uz: "Oldingi", kaa: "Aldıńǵı", ru: "Назад", en: "Back" },
  next: { uz: "Keyingi", kaa: "Keyingi", ru: "Далее", en: "Next" },
  play: { uz: "Avtomatik", kaa: "Avtomat", ru: "Авто", en: "Auto-play" },
  pause: { uz: "To‘xtatish", kaa: "Toqtatıw", ru: "Пауза", en: "Pause" },
  restart: { uz: "Boshidan", kaa: "Basınan", ru: "Сначала", en: "Restart" },
  remember: {
    uz: "**Eslab qoling:** frontend ko‘rsatadi, backend qaror qiladi, ma’lumotlar bazasi saqlaydi. Hujumchi har bir o‘qni o‘zgartirib ko‘radi.",
    kaa: "**Yadta saqlań:** frontend kórsetedi, backend sheshim qabıl etedi, maǵlıwmatlar bazası saqlaydı. Hújimshi hár bir oqtı ózgertip kóredi.",
    ru: "**Запомните:** фронтенд показывает, бэкенд решает, база данных хранит. Атакующий пробует подменить каждую стрелку.",
    en: "**Remember:** the frontend shows, the backend decides, the database stores. An attacker tries to tamper with every arrow.",
  },
} satisfies Record<string, Localized>;

const nodes: { id: Node; icon: typeof Globe; name: Localized }[] = [
  { id: "browser", icon: Globe, name: { uz: "Brauzer", kaa: "Brauzer", ru: "Браузер", en: "Browser" } },
  { id: "network", icon: Waypoints, name: { uz: "Internet", kaa: "Internet", ru: "Интернет", en: "Internet" } },
  { id: "backend", icon: Server, name: { uz: "Backend", kaa: "Backend", ru: "Бэкенд", en: "Backend" } },
  { id: "database", icon: Database, name: { uz: "Baza", kaa: "Baza", ru: "База", en: "Database" } },
];

interface Step {
  at: Node;
  title: Localized;
  body: Localized;
  /** What the data looks like at this point. */
  data: string;
  /** Where an attacker would poke at this step. */
  attack: Localized;
}

const steps: Step[] = [
  {
    at: "browser",
    title: { uz: "Brauzer so‘rov tayyorlaydi", kaa: "Brauzer soraw tayarlaydı", ru: "Браузер готовит запрос", en: "The browser builds a request" },
    body: {
      uz: "Tugma bosilishi bilan brauzer HTTP so‘rov yozadi va unga saqlangan sessiya cookie’sini qo‘shadi.",
      kaa: "Túyme basılıwı menen brauzer HTTP soraw jazadı hám oǵan saqlanǵan sessiya cookie’sin qosadı.",
      ru: "Как только нажата кнопка, браузер пишет HTTP-запрос и прикладывает сохранённый cookie сессии.",
      en: "As soon as the button is pressed, the browser writes an HTTP request and attaches the saved session cookie.",
    },
    data: "GET /api/profile HTTP/1.1\nHost: rooty.uz\nCookie: session=7f3a9c…",
    attack: {
      uz: "So‘rov foydalanuvchining kompyuterida tug‘iladi — demak, uni DevTools yoki Burp bilan istalgancha o‘zgartirish mumkin.",
      kaa: "Soraw paydalanıwshınıń kompyuterinde payda boladı — demek, onı DevTools yamasa Burp penen qálegenshe ózgertiw múmkin.",
      ru: "Запрос рождается на компьютере пользователя — значит, его можно как угодно изменить в DevTools или Burp.",
      en: "The request is born on the user’s computer — so it can be changed freely with DevTools or Burp.",
    },
  },
  {
    at: "network",
    title: { uz: "So‘rov internet bo‘ylab uchadi", kaa: "Soraw internet boylap ushadı", ru: "Запрос летит через интернет", en: "The request crosses the internet" },
    body: {
      uz: "DNS `rooty.uz` nomini IP manzilga aylantiradi. HTTPS (TLS) esa so‘rovni yo‘lda shifrlaydi — Wi-Fi’dagi begona odam faqat tushunarsiz baytlarni ko‘radi.",
      kaa: "DNS `rooty.uz` atın IP mánzilge aylandıradı. HTTPS (TLS) bolsa sorawdı jolda shifrlaydı — Wi-Fi’daǵı jat adam tek túsiniksiz baytlardı kóredi.",
      ru: "DNS превращает имя `rooty.uz` в IP-адрес. HTTPS (TLS) шифрует запрос в пути — посторонний в Wi-Fi видит лишь непонятные байты.",
      en: "DNS turns the name `rooty.uz` into an IP address. HTTPS (TLS) encrypts the request on the way — a stranger on the Wi-Fi sees only gibberish bytes.",
    },
    data: "rooty.uz → 185.74.6.21\n\n17 03 03 00 5a 9c e1 4b 02 7d\nf0 33 a8 c4 6e 11 b9 0d 5f 72 …",
    attack: {
      uz: "HTTPS bo‘lmasa, cookie ochiq matnda uchadi va uni o‘g‘irlash mumkin.",
      kaa: "HTTPS bolmasa, cookie ashıq tekstte ushadı hám onı urlaw múmkin.",
      ru: "Без HTTPS cookie летит открытым текстом, и его можно украсть.",
      en: "Without HTTPS the cookie travels in plain text and can be stolen.",
    },
  },
  {
    at: "backend",
    title: { uz: "Backend: «Bu kim?»", kaa: "Backend: «Bul kim?»", ru: "Бэкенд: «Кто это?»", en: "Backend: “Who is this?”" },
    body: {
      uz: "Server cookie’ni sessiyalar ro‘yxatidan qidiradi va foydalanuvchini aniqlaydi. Bu — **autentifikatsiya**.",
      kaa: "Server cookie’di sessiyalar diziminen izleydi hám paydalanıwshını anıqlaydı. Bul — **autentifikaciya**.",
      ru: "Сервер ищет cookie в списке сессий и узнаёт пользователя. Это — **аутентификация**.",
      en: "The server looks the cookie up in its session list and identifies the user. That is **authentication**.",
    },
    data: "session 7f3a9c… → user_id = 42 (aziza)\nrole = student",
    attack: {
      uz: "Cookie soxta yoki eskirgan bo‘lsa, server 401 qaytarishi kerak — aks holda begona odam kirib oladi.",
      kaa: "Cookie jalǵan yamasa eskirgen bolsa, server 401 qaytarıwı kerek — bolmasa jat adam kirip aladı.",
      ru: "Если cookie поддельный или просрочен, сервер должен вернуть 401 — иначе войдёт чужой.",
      en: "If the cookie is forged or expired, the server must return 401 — otherwise a stranger gets in.",
    },
  },
  {
    at: "backend",
    title: { uz: "Backend: «Unga ruxsat bormi?»", kaa: "Backend: «Oǵan ruxsat bar ma?»", ru: "Бэкенд: «А ему можно?»", en: "Backend: “Is this allowed?”" },
    body: {
      uz: "Aziza faqat **o‘z** profilini ko‘ra oladi. Server ID’ni URL’dan emas, sessiyadan oladi va so‘rov tuzadi. Bu — **avtorizatsiya**.",
      kaa: "Aziza tek **óz** profilin kóre aladı. Server ID’di URL’dan emes, sessiyadan aladı hám soraw dúzedi. Bul — **avtorizaciya**.",
      ru: "Азиза может видеть только **свой** профиль. Сервер берёт ID не из URL, а из сессии и строит запрос. Это — **авторизация**.",
      en: "Aziza may see only **her own** profile. The server takes the ID from the session, not the URL, and builds a query. That is **authorization**.",
    },
    data: "SELECT name, email\nFROM users\nWHERE id = $1      -- $1 = 42",
    attack: {
      uz: "ID URL’dan olinsa (`/api/profile?id=43`), Aziza boshqalarning profilini ko‘rib qoladi — bu IDOR zaifligi.",
      kaa: "ID URL’dan alınsa (`/api/profile?id=43`), Aziza basqalardıń profilin kórip qaladı — bul IDOR álsizligi.",
      ru: "Если брать ID из URL (`/api/profile?id=43`), Азиза увидит чужие профили — это уязвимость IDOR.",
      en: "If the ID came from the URL (`/api/profile?id=43`), Aziza could read other profiles — that is an IDOR bug.",
    },
  },
  {
    at: "database",
    title: { uz: "Ma’lumotlar bazasi javob beradi", kaa: "Maǵlıwmatlar bazası juwap beredi", ru: "База данных отвечает", en: "The database answers" },
    body: {
      uz: "Baza jadvaldan bitta qatorni topib qaytaradi. `$1` — parametr: foydalanuvchi kiritgan narsa hech qachon SQL kodiga aylanmaydi.",
      kaa: "Baza kesteden bir qatardı tawıp qaytaradı. `$1` — parametr: paydalanıwshı kirgizgen nárse hesh qashan SQL kodına aylanbaydı.",
      ru: "База находит в таблице одну строку и возвращает её. `$1` — параметр: ввод пользователя никогда не станет SQL-кодом.",
      en: "The database finds one row and returns it. `$1` is a parameter: user input never turns into SQL code.",
    },
    data: " id | name  | email\n----+-------+----------------\n 42 | Aziza | aziza@rooty.uz",
    attack: {
      uz: "Agar so‘rov matnni yopishtirib tuzilsa, `' OR 1=1 --` kabi kiritish butun jadvalni ochib beradi — SQL inyeksiya.",
      kaa: "Eger soraw tekstti jabıstırıp dúzilse, `' OR 1=1 --` sıyaqlı kiritiw pútkil kesteni ashıp beredi — SQL inyekciya.",
      ru: "Если запрос склеивать из строк, ввод вроде `' OR 1=1 --` откроет всю таблицу — это SQL-инъекция.",
      en: "If the query were glued together from strings, input like `' OR 1=1 --` would dump the whole table — SQL injection.",
    },
  },
  {
    at: "network",
    title: { uz: "Javob qaytib keladi", kaa: "Juwap qaytıp keledi", ru: "Ответ летит обратно", en: "The response flies back" },
    body: {
      uz: "Backend natijani JSON’ga o‘raydi va 200 OK bilan yuboradi. Faqat kerakli maydonlar — parol xeshi yoki ichki ID’lar emas.",
      kaa: "Backend nátiyjeni JSON’ǵa oraydı hám 200 OK penen jiberedi. Tek kerekli maydanlar — parol xeshi yamasa ishki ID’lar emes.",
      ru: "Бэкенд упаковывает результат в JSON и отправляет с 200 OK. Только нужные поля — не хеш пароля и не внутренние ID.",
      en: "The backend wraps the result in JSON and sends it with 200 OK. Only the fields needed — no password hash, no internal IDs.",
    },
    data: 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"name":"Aziza","email":"aziza@rooty.uz"}',
    attack: {
      uz: "Javobda ortiqcha maydon bo‘lsa (masalan `password_hash`), u ekranda ko‘rinmasa ham DevTools’da hammaga ochiq.",
      kaa: "Juwapta artıqsha maydan bolsa (mısalı `password_hash`), ol ekranda kórinbese de DevTools’ta hámmege ashıq.",
      ru: "Лишнее поле в ответе (например, `password_hash`) не видно на экране, но открыто всем в DevTools.",
      en: "An extra field in the response (say `password_hash`) is invisible on screen but open to anyone in DevTools.",
    },
  },
  {
    at: "browser",
    title: { uz: "Brauzer natijani ko‘rsatadi", kaa: "Brauzer nátiyjeni kórsetedi", ru: "Браузер показывает результат", en: "The browser shows the result" },
    body: {
      uz: "JavaScript JSON’ni o‘qiydi va sahifani chizadi. Ism **matn** sifatida qo‘yiladi, HTML sifatida emas.",
      kaa: "JavaScript JSON’dı oqıydı hám betti sızadı. At **tekst** retinde qoyıladı, HTML retinde emes.",
      ru: "JavaScript читает JSON и рисует страницу. Имя вставляется как **текст**, а не как HTML.",
      en: "JavaScript reads the JSON and draws the page. The name is inserted as **text**, not as HTML.",
    },
    data: "┌──────────────────────────┐\n│  Salom, Aziza!           │\n│  aziza@rooty.uz          │\n└──────────────────────────┘",
    attack: {
      uz: "Ism HTML sifatida qo‘yilsa, `<img onerror=…>` kabi «ism» boshqa odamning brauzerida kod ishga tushiradi — XSS.",
      kaa: "At HTML retinde qoyılsa, `<img onerror=…>` sıyaqlı «at» basqa adamnıń brauzerinde kod iske túsiredi — XSS.",
      ru: "Если вставить имя как HTML, «имя» вроде `<img onerror=…>` запустит код в чужом браузере — это XSS.",
      en: "If the name were inserted as HTML, a “name” like `<img onerror=…>` would run code in someone else’s browser — XSS.",
    },
  },
];

export function RequestJourney({ locale }: { locale: Locale }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const step = steps[index];
  const last = index === steps.length - 1;

  useEffect(() => {
    if (!playing || last) return;
    const timer = window.setTimeout(() => setIndex((i) => i + 1), 3500);
    return () => window.clearTimeout(timer);
  }, [playing, index, last]);

  function go(next: number) {
    setPlaying(false);
    setIndex(Math.min(steps.length - 1, Math.max(0, next)));
  }

  return (
    <section aria-label={text.title[locale]} className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="space-y-2 p-5 sm:p-6">
        <h3 className="font-semibold">{text.title[locale]}</h3>
        <p className="text-sm leading-relaxed text-muted">{text.intro[locale]}</p>
      </div>

      {/* The four stations; the one holding the data lights up. */}
      <ol className="flex items-center gap-1 border-y border-border bg-surface-2 px-4 py-4 sm:gap-2 sm:px-6">
        {nodes.map((node, i) => {
          const Icon = node.icon;
          const active = node.id === step.at;
          return (
            <li key={node.id} className="flex flex-1 items-center gap-1 last:flex-none sm:gap-2">
              <span
                aria-current={active ? "step" : undefined}
                className={`flex shrink-0 flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium transition-colors sm:px-3 ${
                  active ? "bg-accent-soft text-accent-text ring-1 ring-accent" : "text-muted"
                }`}
              >
                <Icon aria-hidden className="size-5" />
                {node.name[locale]}
              </span>
              {i < nodes.length - 1 && <span aria-hidden className="h-0.5 flex-1 rounded bg-border" />}
            </li>
          );
        })}
      </ol>

      <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2" aria-live="polite">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            {text.step[locale]} {index + 1} / {steps.length}
          </p>
          <h4 className="text-lg font-semibold">{step.title[locale]}</h4>
          <p className="text-sm leading-relaxed">
            <Rich value={step.body[locale]} />
          </p>
          <p className="rounded-lg border-l-2 border-danger bg-danger-soft px-3 py-2 text-sm leading-relaxed">
            <Rich value={step.attack[locale]} />
          </p>
        </div>
        <pre className="self-start overflow-x-auto rounded-xl bg-code p-3 font-mono text-xs leading-5 sm:text-sm">{step.data}</pre>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4 sm:px-6">
        <div className="flex gap-1.5" aria-hidden>
          {steps.map((_, i) => (
            <span key={i} className={`h-1.5 w-5 rounded-full sm:w-6 ${i <= index ? "bg-accent" : "bg-border"}`} />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm disabled:opacity-40"
          >
            <ChevronLeft aria-hidden className="size-4" /> {text.prev[locale]}
          </button>
          {last ? (
            <button type="button" onClick={() => go(0)} className="inline-flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm">
              <RotateCcw aria-hidden className="size-4" /> {text.restart[locale]}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm"
            >
              {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
              {playing ? text.pause[locale] : text.play[locale]}
            </button>
          )}
          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={last}
            className="inline-flex h-9 items-center gap-1 rounded-lg bg-accent px-3 text-sm font-semibold text-on-accent hover:bg-accent-hover disabled:opacity-40"
          >
            {text.next[locale]} <ChevronRight aria-hidden className="size-4" />
          </button>
        </div>
      </div>

      <p className="border-t border-border bg-surface-2 px-5 py-3 text-sm sm:px-6">
        <Rich value={text.remember[locale]} />
      </p>
    </section>
  );
}
