"use client";

import { useState } from "react";
import { Globe, Send, Server } from "lucide-react";
import type { Locale, Localized } from "@/shared/i18n/config";
import {
  buildRequest,
  formatResponse,
  paths,
  respond,
  type Method,
  type Outcome,
  type Path,
  type SimResponse,
} from "@/frontend/widgets/sim/http-server";

const text = {
  title: {
    uz: "So‘rov yuboruvchi",
    kaa: "Soraw jiberiwshi",
    ru: "Конструктор запроса",
    en: "Request builder",
  },
  method: { uz: "Metod", kaa: "Metod", ru: "Метод", en: "Method" },
  path: { uz: "Manzil", kaa: "Mánzil", ru: "Путь", en: "Path" },
  cookie: {
    uz: "Cookie yuborish (tizimga kirganman)",
    kaa: "Cookie jiberiw (sistemaǵa kirgenmen)",
    ru: "Отправить cookie (я вошёл в систему)",
    en: "Send cookie (I am logged in)",
  },
  send: { uz: "Yuborish", kaa: "Jiberiw", ru: "Отправить", en: "Send" },
  request: { uz: "So‘rov", kaa: "Soraw", ru: "Запрос", en: "Request" },
  response: { uz: "Javob", kaa: "Juwap", ru: "Ответ", en: "Response" },
  browser: { uz: "Brauzer", kaa: "Brauzer", ru: "Браузер", en: "Browser" },
  server: { uz: "Server", kaa: "Server", ru: "Сервер", en: "Server" },
  idle: {
    uz: "So‘rovni tanlang va «Yuborish»ni bosing.",
    kaa: "Sorawdı tańlap, «Jiberiw»di basıń.",
    ru: "Выберите запрос и нажмите «Отправить».",
    en: "Pick a request and press “Send”.",
  },
} satisfies Record<string, Localized>;

const notes: Record<Outcome, Localized> = {
  home: {
    uz: "Bosh sahifa hammaga ochiq — server 200 OK va HTML qaytardi.",
    kaa: "Bas bet hámmege ashıq — server 200 OK hám HTML qaytardı.",
    ru: "Главная открыта всем — сервер вернул 200 OK и HTML.",
    en: "The home page is public — the server returned 200 OK and HTML.",
  },
  loginForm: {
    uz: "GET /login — kirish formasini so‘radingiz. Endi POST bilan login va parol yuboring.",
    kaa: "GET /login — kiriw formasın soradıńız. Endi POST penen login hám parol jiberiń.",
    ru: "GET /login — вы запросили форму входа. Теперь отправьте логин и пароль через POST.",
    en: "GET /login asked for the sign-in form. Now send a username and password with POST.",
  },
  loggedIn: {
    uz: "Server parolni tekshirdi va `Set-Cookie` bilan sessiya berdi. Brauzer endi har so‘rovga shu cookie’ni qo‘shadi — belgi avtomatik yoqildi.",
    kaa: "Server paroldi tekserdi hám `Set-Cookie` penen sessiya berdi. Brauzer endi hár sorawǵa usı cookie’di qosadı — belgi avtomat qosıldı.",
    ru: "Сервер проверил пароль и выдал сессию через `Set-Cookie`. Теперь браузер добавляет этот cookie к каждому запросу — галочка включилась сама.",
    en: "The server checked the password and issued a session with `Set-Cookie`. The browser now adds that cookie to every request — the box was ticked for you.",
  },
  profile: {
    uz: "Cookie bor — server sizni tanidi va shaxsiy sahifani qaytardi.",
    kaa: "Cookie bar — server sizdi tanıdı hám jeke betti qaytardı.",
    ru: "Cookie есть — сервер узнал вас и вернул личную страницу.",
    en: "The cookie is there — the server recognised you and returned your profile.",
  },
  needLogin: {
    uz: "Cookie yo‘q — server kimligingizni bilmaydi va sizni 302 bilan /login ga yo‘naltirdi.",
    kaa: "Cookie joq — server kim ekenińizdi bilmeydi hám sizdi 302 penen /login ǵa baǵdarladı.",
    ru: "Cookie нет — сервер не знает, кто вы, и перенаправил на /login кодом 302.",
    en: "No cookie — the server doesn’t know who you are and redirected you to /login with a 302.",
  },
  forbidden: {
    uz: "Siz tizimdasiz, lekin admin emassiz. Server rolni tekshirdi va 403 qaytardi — to‘g‘ri himoya aynan shunday.",
    kaa: "Siz sistemadasız, biraq admin emessiz. Server roldi tekserdi hám 403 qaytardı — durıs qorǵaw dál usınday.",
    ru: "Вы вошли, но вы не админ. Сервер проверил роль и вернул 403 — так и выглядит правильная защита.",
    en: "You are logged in but not an admin. The server checked your role and returned 403 — that is what correct protection looks like.",
  },
  notFound: {
    uz: "Bunday fayl yo‘q — 404. Hujumchilar ko‘pincha `backup.zip` kabi unutilgan fayllarni qidiradi.",
    kaa: "Bunday fayl joq — 404. Hújimshiler kóbinese `backup.zip` sıyaqlı umıtılǵan fayllardı izleydi.",
    ru: "Такого файла нет — 404. Атакующие часто ищут забытые файлы вроде `backup.zip`.",
    en: "No such file — 404. Attackers often probe for forgotten files like `backup.zip`.",
  },
  methodNotAllowed: {
    uz: "Bu manzil faqat GET qabul qiladi — server 405 qaytardi va `Allow` sarlavhasida ruxsat etilgan metodni aytdi.",
    kaa: "Bul mánzil tek GET qabıl etedi — server 405 qaytardı hám `Allow` sarlawhasında ruxsat etilgen metodtı ayttı.",
    ru: "Этот путь принимает только GET — сервер вернул 405 и указал разрешённый метод в заголовке `Allow`.",
    en: "This path only accepts GET — the server returned 405 and named the allowed method in the `Allow` header.",
  },
};

function statusTone(status: number) {
  if (status < 300) return "bg-success-soft text-success";
  if (status < 400) return "bg-accent-soft text-accent";
  return "bg-danger-soft text-danger";
}

function Code({ value }: { value: string }) {
  // Inline `code` in notes, rendered without the lesson text parser.
  return value.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") ? (
      <code key={i} className="rounded bg-code px-1 font-mono text-[0.9em]">
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  );
}

export function HttpExchange({ locale }: { locale: Locale }) {
  const [method, setMethod] = useState<Method>("GET");
  const [path, setPath] = useState<Path>("/profile");
  const [withCookie, setWithCookie] = useState(false);
  const [phase, setPhase] = useState<"idle" | "sending" | "done">("idle");
  const [response, setResponse] = useState<SimResponse | null>(null);

  function send() {
    const result = respond(method, path, withCookie);
    setPhase("sending");
    setResponse(null);
    window.setTimeout(() => {
      setResponse(result);
      setPhase("done");
      if (result.setsCookie) setWithCookie(true);
    }, 650);
  }

  return (
    <section
      aria-label={text.title[locale]}
      className="overflow-hidden rounded-2xl border border-border bg-surface"
    >
      <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="font-semibold">{text.title[locale]}</h3>
          <div role="group" aria-label={text.method[locale]} className="flex gap-2">
            {(["GET", "POST"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={method === m}
                onClick={() => setMethod(m)}
                className="h-9 rounded-lg border border-border px-3 font-mono text-sm aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-accent"
              >
                {m}
              </button>
            ))}
          </div>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">{text.path[locale]}</span>
            <select
              name="path"
              value={path}
              onChange={(event) => setPath(event.target.value as Path)}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 font-mono"
            >
              {paths.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="cookie"
              checked={withCookie}
              onChange={(event) => setWithCookie(event.target.checked)}
              className="size-4 accent-(--accent)"
            />
            {text.cookie[locale]}
          </label>
          <button
            type="button"
            onClick={send}
            disabled={phase === "sending"}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent hover:bg-accent-hover disabled:opacity-60"
          >
            <Send aria-hidden className="size-4" />
            {text.send[locale]}
          </button>
        </div>

        <div>
          <p className="mb-1 text-sm text-muted">{text.request[locale]}</p>
          <pre className="min-h-32 overflow-x-auto rounded-xl bg-code p-3 font-mono text-xs leading-5 sm:text-sm">
            {buildRequest(method, path, withCookie)}
          </pre>
        </div>
      </div>

      {/* Browser → server lane: the dot travels while the request is in flight. */}
      <div className="flex items-center gap-3 border-y border-border bg-surface-2 px-5 py-4 sm:px-6">
        <span className="flex items-center gap-2 text-sm font-medium">
          <Globe aria-hidden className="size-4 text-accent" /> {text.browser[locale]}
        </span>
        <span className="relative h-0.5 flex-1 rounded bg-border">
          <span
            aria-hidden
            className={`absolute -top-1 size-2.5 rounded-full bg-accent transition-[left] duration-600 ease-in-out motion-reduce:transition-none ${
              phase === "idle" ? "left-0 opacity-0" : phase === "sending" ? "left-[calc(100%-0.625rem)]" : "left-0"
            }`}
          />
        </span>
        <span className="flex items-center gap-2 text-sm font-medium">
          {text.server[locale]} <Server aria-hidden className="size-4 text-accent" />
        </span>
      </div>

      <div className="p-5 sm:p-6" aria-live="polite">
        {response ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">{text.response[locale]}</span>
              <span className={`rounded-md px-2 py-0.5 font-mono text-sm font-semibold ${statusTone(response.status)}`}>
                {response.status} {response.reason}
              </span>
            </div>
            <pre className="overflow-x-auto rounded-xl bg-code p-3 font-mono text-xs leading-5 sm:text-sm">
              {formatResponse(response)}
            </pre>
            <p className="text-sm leading-relaxed">
              <Code value={notes[response.outcome][locale]} />
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted">{phase === "sending" ? "…" : text.idle[locale]}</p>
        )}
      </div>
    </section>
  );
}
