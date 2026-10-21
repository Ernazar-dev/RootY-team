"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { CheckCircle2, Circle, RotateCcw, Trophy } from "lucide-react";
import type { Locale, Localized } from "@/shared/i18n/config";
import { HOME, createFs, prompt, run, type ShellResult, type ShellState } from "@/frontend/widgets/sim/shell";

const text = {
  title: { uz: "Terminal: missiyalar", kaa: "Terminal: missiyalar", ru: "Терминал: миссии", en: "Terminal: missions" },
  hint: {
    uz: "Bu haqiqiy terminal emas — mashq maydoni. Xato qilishdan qo‘rqmang, hech narsa buzilmaydi. `help` — buyruqlar ro‘yxati.",
    kaa: "Bul haqıyqıy terminal emes — shınıǵıw maydanı. Qáte qılıwdan qorqpań, hesh nárse buzılmaydı. `help` — buyrıqlar dizimi.",
    ru: "Это не настоящий терминал, а тренажёр. Не бойтесь ошибаться — ничего не сломается. `help` — список команд.",
    en: "This is not a real terminal, it is a practice ground. Don’t be afraid of mistakes — nothing can break. `help` lists the commands.",
  },
  input: { uz: "Buyruq kiriting", kaa: "Buyrıq kiritiń", ru: "Введите команду", en: "Type a command" },
  reset: { uz: "Qaytadan", kaa: "Qaytadan", ru: "Заново", en: "Start over" },
  progress: { uz: "Bajarildi", kaa: "Orınlandı", ru: "Выполнено", en: "Done" },
  win: {
    uz: "Barcha missiyalar bajarildi! Siz Linux fayl tizimida mustaqil harakatlana olasiz.",
    kaa: "Barlıq missiyalar orınlandı! Siz Linux fayl sistemasında ǵárezsiz háreketlene alasız.",
    ru: "Все миссии выполнены! Вы уверенно ориентируетесь в файловой системе Linux.",
    en: "All missions complete! You can find your way around a Linux file system on your own.",
  },
} satisfies Record<string, Localized>;

type Mission = { label: Localized; done: (r: ShellResult) => boolean };

const missions: Mission[] = [
  {
    label: {
      uz: "Qayerda turganingizni bilib oling: `pwd`",
      kaa: "Qay jerde turǵanıńızdı bilip alıń: `pwd`",
      ru: "Узнайте, где вы находитесь: `pwd`",
      en: "Find out where you are: `pwd`",
    },
    done: (r) => r.ok && r.command === "pwd",
  },
  {
    label: {
      uz: "Uy papkangizda nima borligini ko‘ring: `ls`",
      kaa: "Úy papkańızda ne bar ekenin kóriń: `ls`",
      ru: "Посмотрите, что лежит в домашней папке: `ls`",
      en: "See what is in your home folder: `ls`",
    },
    done: (r) => r.ok && r.command === "ls" && r.path === HOME,
  },
  {
    label: {
      uz: "Eslatmani o‘qing: `cat notes.txt`",
      kaa: "Eskertpeni oqıń: `cat notes.txt`",
      ru: "Прочитайте записку: `cat notes.txt`",
      en: "Read the note: `cat notes.txt`",
    },
    done: (r) => r.ok && r.command === "cat" && r.path === `${HOME}/notes.txt`,
  },
  {
    label: {
      uz: "Uy papkangizda `lab` nomli papka yarating",
      kaa: "Úy papkańızda `lab` atlı papka jasań",
      ru: "Создайте в домашней папке папку `lab`",
      en: "Create a folder called `lab` in your home folder",
    },
    done: (r) => r.ok && r.command === "mkdir" && r.path === `${HOME}/lab`,
  },
  {
    label: {
      uz: "Yashirin faylni topib, o‘qing (maslahat eslatmada)",
      kaa: "Jasırın fayldı tawıp, oqıń (másláhát eskertpede)",
      ru: "Найдите и прочитайте скрытый файл (подсказка — в записке)",
      en: "Find and read the hidden file (the hint is in the note)",
    },
    done: (r) => r.ok && r.command === "cat" && r.path === `${HOME}/.flag.txt`,
  },
];

const notes: Localized = {
  uz: "Salom, tadqiqotchi!\nBu papkada yashirin fayl bor.\nLinux'da nomi nuqta bilan boshlanadigan fayllar oddiy `ls` da ko‘rinmaydi.\nUlarni ko‘rish uchun: ls -a",
  kaa: "Sálem, izertlewshi!\nBul papkada jasırın fayl bar.\nLinux'ta atı noqat penen baslanatuǵın fayllar ápiwayı `ls` ta kórinbeydi.\nOlardı kóriw ushın: ls -a",
  ru: "Привет, исследователь!\nВ этой папке есть скрытый файл.\nВ Linux файлы, имя которых начинается с точки, не видны в обычном `ls`.\nЧтобы их увидеть: ls -a",
  en: "Hello, explorer!\nThere is a hidden file in this folder.\nOn Linux, files whose names start with a dot don’t show up in a plain `ls`.\nTo see them: ls -a",
};

const flag: Localized = {
  uz: "FLAG{linux_explorer}\nTopdingiz! Yashirin fayl — bu himoya emas: uni istalgan foydalanuvchi ko‘ra oladi.",
  kaa: "FLAG{linux_explorer}\nTaptıńız! Jasırın fayl — bul qorǵaw emes: onı qálegen paydalanıwshı kóre aladı.",
  ru: "FLAG{linux_explorer}\nНашли! Скрытый файл — это не защита: его может увидеть любой пользователь.",
  en: "FLAG{linux_explorer}\nFound it! A hidden file is not protection: any user can see it.",
};

function initialState(locale: Locale): ShellState {
  return {
    cwd: HOME,
    fs: createFs(
      {
        [`${HOME}/notes.txt`]: notes[locale],
        [`${HOME}/.flag.txt`]: flag[locale],
        [`${HOME}/projects/todo.txt`]: "1. pwd\n2. ls\n3. cd\n4. cat\n5. mkdir",
        "/etc/hostname": "rooty",
        "/etc/os-release": 'NAME="Kali GNU/Linux"\nVERSION="2026.3"',
        "/var/log/auth.log": "Oct 16 09:12:01 rooty sshd: Accepted password for student",
      },
      ["/tmp", "/root", "/bin", "/usr/bin"],
    ),
  };
}

type Entry = { prompt: string; input: string; output: string[]; ok: boolean };

function Inline({ value }: { value: string }) {
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

export function LinuxTerminal({ locale }: { locale: Locale }) {
  const start = useMemo(() => initialState(locale), [locale]);
  const [state, setState] = useState(start);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [line, setLine] = useState("");
  const [done, setDone] = useState<boolean[]>(() => missions.map(() => false));
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const screen = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = screen.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const result = run(state, line);
    setState(result.state);
    setEntries((list) =>
      result.clear ? [] : [...list, { prompt: prompt(state.cwd), input: line, output: result.output, ok: result.ok }],
    );
    setDone((list) => list.map((value, i) => value || missions[i].done(result)));
    if (line.trim()) setHistory((list) => [...list, line]);
    setCursor(-1);
    setLine("");
  }

  // Arrow keys walk back through earlier commands, like a real shell.
  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    if (!history.length) return;
    const next = event.key === "ArrowUp" ? (cursor < 0 ? history.length - 1 : Math.max(0, cursor - 1)) : cursor + 1;
    if (next >= history.length || next < 0) {
      setCursor(-1);
      setLine("");
    } else {
      setCursor(next);
      setLine(history[next]);
    }
  }

  function reset() {
    setState(start);
    setEntries([]);
    setDone(missions.map(() => false));
    setHistory([]);
    setCursor(-1);
    setLine("");
  }

  const count = done.filter(Boolean).length;
  const won = count === missions.length;

  return (
    <section aria-label={text.title[locale]} className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
        <h3 className="font-semibold">{text.title[locale]}</h3>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted hover:border-border-strong hover:text-text"
        >
          <RotateCcw aria-hidden className="size-3.5" />
          {text.reset[locale]}
        </button>
      </div>

      <div className="grid md:grid-cols-[minmax(0,1fr)_16rem]">
        {/* Clicking anywhere on the screen puts the cursor in the input. */}
        <div onClick={() => input.current?.focus()} className="flex min-h-80 flex-col bg-code font-mono text-[0.8125rem] leading-6">
          <div ref={screen} className="max-h-96 flex-1 overflow-y-auto px-4 pt-4" aria-live="polite">
            <p className="text-muted">
              <Inline value={text.hint[locale]} />
            </p>
            {entries.map((entry, i) => (
              <div key={i} className="mt-1">
                <p className="break-all">
                  <span className="text-success">{entry.prompt}</span> {entry.input}
                </p>
                {entry.output.map((out, j) => (
                  <p key={j} className={`break-all whitespace-pre-wrap ${entry.ok ? "" : "text-danger"}`}>
                    {out}
                  </p>
                ))}
              </div>
            ))}
          </div>
          <form onSubmit={submit} className="flex items-center gap-2 px-4 pt-1 pb-4">
            <label htmlFor="linux-terminal-input" className="shrink-0 text-success">
              {prompt(state.cwd)}
            </label>
            <input
              ref={input}
              id="linux-terminal-input"
              value={line}
              onChange={(event) => setLine(event.target.value)}
              onKeyDown={onKeyDown}
              aria-label={text.input[locale]}
              placeholder={entries.length ? "" : text.input[locale]}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-faint"
            />
          </form>
        </div>

        <div className="border-t border-border p-5 md:border-t-0 md:border-l">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">{text.progress[locale]}</span>
            <span className="font-mono font-semibold">
              {count}/{missions.length}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${(count / missions.length) * 100}%` }} />
          </div>
          <ol className="mt-4 space-y-3 text-sm">
            {missions.map((mission, i) => (
              <li key={i} className={`flex gap-2 ${done[i] ? "text-muted line-through decoration-faint" : ""}`}>
                {done[i] ? (
                  <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
                ) : (
                  <Circle aria-hidden className="mt-0.5 size-4 shrink-0 text-faint" />
                )}
                <span>
                  <Inline value={mission.label[locale]} />
                </span>
              </li>
            ))}
          </ol>
          {won && (
            <p role="status" className="mt-5 flex gap-2 rounded-xl border border-success/30 bg-success-soft p-3 text-sm text-success">
              <Trophy aria-hidden className="mt-0.5 size-4 shrink-0" />
              {text.win[locale]}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
