"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Download, Flag, Lightbulb, ListOrdered, Lock, ShieldCheck, Sparkles, Star, Trophy } from "lucide-react";
import type { Locale, Localized } from "@/shared/i18n/config";
import { format } from "@/shared/i18n/format";
import { Rich } from "@/frontend/widgets/rich";
import { checkFlag, resetMySolves } from "@/backend/services/ctf-actions";
import { type Challenge, challengesOf, tracks } from "@/frontend/ctf/catalog";
import { earnedPoints, hintCostOf } from "@/frontend/ctf/scoring";
import { Leaderboard, type LeaderboardData } from "@/frontend/ctf/leaderboard";

// The CTF arena body: every track with its challenges. A challenge is solved
// interactively — read the brief, open hints one by one, submit a flag — and
// only once it is correct (or the solver chooses to give up) does the
// step-by-step solution unfold. Progress stays in this browser only.

const text = {
  eyebrow: { uz: "CTF ARENA", kaa: "CTF ARENA", ru: "CTF АРЕНА", en: "CTF ARENA" },
  lead: {
    uz: "Haqiqiy musobaqalardan olingan topshiriqlar. Har birida oldin o‘zingiz urinib ko‘ring — flagni toping. Keyin to‘liq yechim ochiladi: qanday topiladi va kalit bilan nima qilinadi.",
    kaa: "Haqıyqıy jarıslardan alınǵan tapsırmalar. Hár birinde aldın ózińiz urınıp kóriń — flagti tabıń. Soń tolıq sheshim ashıladı: qalay tabıladı hám gilt penen ne islenedi.",
    ru: "Задания с реальных соревнований. Сначала попробуйте сами — найдите флаг. Затем откроется полное решение: как найти и что делать с ключом.",
    en: "Challenges from real competitions. Try each one yourself first — find the flag. Then the full solution unfolds: how it is found and what to do with the key.",
  },
  solvedOf: { uz: "yechildi", kaa: "sheshildi", ru: "решено", en: "solved" },
  points: { uz: "ball", kaa: "ball", ru: "очк.", en: "pts" },
  files: { uz: "Yuklab olish", kaa: "Júklep alıw", ru: "Скачать", en: "Download" },
  evidence: { uz: "Dalil", kaa: "Dálil", ru: "Улики", en: "Evidence" },
  hints: { uz: "Ishoralar", kaa: "Belgiler", ru: "Подсказки", en: "Hints" },
  showHint: { uz: "Keyingi ishorani ochish", kaa: "Keyingi belgini ashıw", ru: "Открыть следующую подсказку", en: "Reveal next hint" },
  flag: { uz: "Flag", kaa: "Flag", ru: "Флаг", en: "Flag" },
  flagPlaceholder: { uz: "CTF{...} yoki ROOTY{...}", kaa: "CTF{...} yaki ROOTY{...}", ru: "CTF{...} или ROOTY{...}", en: "CTF{...} or ROOTY{...}" },
  submit: { uz: "Tekshirish", kaa: "Tekseriw", ru: "Проверить", en: "Check" },
  checking: { uz: "Tekshirilyapti…", kaa: "Tekserilmekte…", ru: "Проверяем…", en: "Checking…" },
  correct: { uz: "To‘g‘ri! Flag topildi.", kaa: "Durıs! Flag tabıldı.", ru: "Верно! Флаг найден.", en: "Correct! Flag found." },
  wrong: { uz: "Noto‘g‘ri — yana urinib ko‘ring.", kaa: "Qáte — jáne urınıp kóriń.", ru: "Неверно — попробуйте ещё.", en: "Not quite — try again." },
  tooFast: {
    uz: "Juda tez urinyapsiz — bir necha soniya kuting va qayta yuboring.",
    kaa: "Júdá tez urınıp atırsız — bir neshe sekund kútiń hám qayta jiberiń.",
    ru: "Слишком много попыток — подождите несколько секунд и отправьте снова.",
    en: "Too many tries — wait a few seconds and submit again.",
  },
  failed: {
    uz: "Server bilan bog‘lanib bo‘lmadi. Flag saqlanib qoldi — qayta yuboring.",
    kaa: "Server menen baylanısıw múmkin bolmadı. Flag saqlanıp qaldı — qayta jiberiń.",
    ru: "Не удалось связаться с сервером. Флаг сохранён — отправьте ещё раз.",
    en: "Could not reach the server. Your flag is still here — submit again.",
  },
  giveUp: { uz: "Yechimni ko‘rsatish", kaa: "Sheshimdi kórsetiw", ru: "Показать решение", en: "Show the solution" },
  solution: { uz: "Yechim — qadamma-qadam", kaa: "Sheshim — qádemme-qádem", ru: "Решение — по шагам", en: "Solution — step by step" },
  takeaway: { uz: "Xulosa", kaa: "Juwmaq", ru: "Вывод", en: "Takeaway" },
  solvedBadge: { uz: "Yechilgan", kaa: "Sheshilgen", ru: "Решено", en: "Solved" },
  revealedBadge: { uz: "Yechim ochilgan", kaa: "Sheshim ashılǵan", ru: "Решение открыто", en: "Solution shown" },
  score: { uz: "Ball", kaa: "Ball", ru: "Очки", en: "Score" },
  reset: { uz: "Progressni tozalash", kaa: "Progressti tazalaw", ru: "Сбросить прогресс", en: "Reset progress" },
  resetConfirm: {
    uz: "Butun progress o‘chiriladi. Davom etasizmi?",
    kaa: "Pútin progress óshiriledi. Dawam etesizbe?",
    ru: "Весь прогресс будет удалён. Продолжить?",
    en: "All progress will be erased. Continue?",
  },
  earned: { uz: "olindi", kaa: "alındı", ru: "получено", en: "earned" },
  hintCost: { uz: "har ishora −{n} ball", kaa: "hár belgi −{n} ball", ru: "каждая подсказка −{n} очк.", en: "each hint −{n} pts" },
  minusPts: { uz: "−{n} ball", kaa: "−{n} ball", ru: "−{n} очк.", en: "−{n} pts" },
  local: {
    uz: "Natijalar faqat shu brauzerda saqlanadi.",
    kaa: "Nátiyjeler tek usı brauzerde saqlanadı.",
    ru: "Прогресс хранится только в этом браузере.",
    en: "Progress is saved in this browser only.",
  },
  level: { uz: "Qiyinlik", kaa: "Qıyınlıq", ru: "Сложность", en: "Difficulty" },
} satisfies Record<string, Localized>;

// ── Local progress (this browser only) ─────────────────────────────────────
// One key per signed-in student (plus one for visitors): on a shared lab
// computer, one student's solves must not show up as another's.
const storageKeyFor = (userId: string | null) => (userId ? `rooty-ctf:${userId}` : "rooty-ctf");
type State = { solved: string[]; revealed: string[]; hints: Record<string, number> };
const empty: State = { solved: [], revealed: [], hints: {} };

const blank = JSON.stringify(empty);
// Fallback when storage is blocked, per key.
const memory = new Map<string, string>();
const listeners = new Set<() => void>();

function readRaw(key: string) {
  try {
    return localStorage.getItem(key) ?? memory.get(key) ?? blank;
  } catch {
    return memory.get(key) ?? blank;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function save(key: string, next: State) {
  const raw = JSON.stringify(next);
  memory.set(key, raw);
  try {
    localStorage.setItem(key, raw);
  } catch {
    // Storage blocked: `memory` holds it for this visit.
  }
  listeners.forEach((listener) => listener());
}

function parse(raw: string): State {
  try {
    const value = JSON.parse(raw);
    return {
      solved: Array.isArray(value?.solved) ? value.solved.filter((x: unknown) => typeof x === "string") : [],
      revealed: Array.isArray(value?.revealed) ? value.revealed.filter((x: unknown) => typeof x === "string") : [],
      hints: value?.hints && typeof value.hints === "object" ? value.hints : {},
    };
  } catch {
    return empty;
  }
}

function useProgress(key: string) {
  const raw = useSyncExternalStore(subscribe, () => readRaw(key), () => blank);
  const state = useMemo(() => parse(raw), [raw]);
  return {
    state,
    markSolved(id: string) {
      const s = parse(readRaw(key));
      save(key, { ...s, solved: s.solved.includes(id) ? s.solved : [...s.solved, id] });
    },
    markRevealed(id: string) {
      const s = parse(readRaw(key));
      save(key, { ...s, revealed: s.revealed.includes(id) ? s.revealed : [...s.revealed, id] });
    },
    markHints(id: string, n: number) {
      const s = parse(readRaw(key));
      save(key, { ...s, hints: { ...s.hints, [id]: Math.max(s.hints[id] ?? 0, n) } });
    },
    reset() {
      save(key, empty);
    },
    /** Merge server-saved solves into local state (union; max hints). */
    hydrate(rows: { challengeId: string; hintsUsed: number }[]) {
      if (rows.length === 0) return;
      const s = parse(readRaw(key));
      const solved = new Set(s.solved);
      const hintsMap = { ...s.hints };
      for (const r of rows) {
        solved.add(r.challengeId);
        hintsMap[r.challengeId] = Math.max(hintsMap[r.challengeId] ?? 0, r.hintsUsed);
      }
      save(key, { solved: [...solved], revealed: s.revealed, hints: hintsMap });
    },
  };
}

// ── UI ──────────────────────────────────────────────────────────────────────
export function CtfArena({
  locale,
  initial = [],
  board,
  userId = null,
}: {
  locale: Locale;
  /** The signed-in user, to keep each student's local progress apart. */
  userId?: string | null;
  initial?: { challengeId: string; hintsUsed: number }[];
  board: LeaderboardData;
}) {
  const { state, markSolved, markRevealed, markHints, reset, hydrate } = useProgress(storageKeyFor(userId));
  const router = useRouter();

  // Merge the signed-in student's server-saved solves in once on mount.
  const initialKey = useMemo(() => initial.map((r) => `${r.challengeId}:${r.hintsUsed}`).join(","), [initial]);
  useEffect(() => {
    hydrate(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialKey]);

  const solvedSet = new Set(state.solved);
  const totalSolved = state.solved.length;
  const total = tracks.reduce((n, t) => n + challengesOf(t.id).length, 0);
  const maxPoints = tracks.reduce((sum, t) => sum + challengesOf(t.id).reduce((s, c) => s + c.points, 0), 0);
  const score = tracks.reduce(
    (sum, t) =>
      sum +
      challengesOf(t.id).reduce((s, c) => s + (solvedSet.has(c.id) ? earnedPoints(c.points, state.hints[c.id] ?? 0) : 0), 0),
    0,
  );

  function onReset() {
    if (typeof window !== "undefined" && window.confirm(text.resetConfirm[locale])) {
      reset();
      // Clear the server copy too (no-op for anonymous), then redraw the board.
      void resetMySolves()
        .catch(() => {})
        .then(() => router.refresh());
    }
  }

  return (
    <div className="mx-auto max-w-site px-4 pt-16 sm:px-6 lg:px-10 sm:pt-24">
      <p className="stamp text-[0.6875rem] text-muted">{text.eyebrow[locale]}</p>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="stamp-xl">CTF</h1>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent bg-accent-soft/30 px-3 py-1.5 text-sm text-accent">
            <Trophy aria-hidden className="size-4" />
            <span className="font-mono">{score}</span>
            <span className="text-muted">/ {maxPoints} {text.score[locale]}</span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-sm text-muted">
            <span className="font-mono text-text">{totalSolved}</span> / {total} {text.solvedOf[locale]}
          </span>
        </div>
      </div>
      <p className="mt-8 max-w-2xl text-lg leading-relaxed font-light text-muted">{text.lead[locale]}</p>
      <div className="mt-2 flex items-center gap-3">
        <p className="text-xs text-faint">{text.local[locale]}</p>
        {totalSolved + state.revealed.length > 0 && (
          <button type="button" onClick={onReset} className="text-xs text-faint underline hover:text-muted">
            {text.reset[locale]}
          </button>
        )}
      </div>

      <div className="mt-10">
        <Leaderboard data={board} locale={locale} />
      </div>

      <div className="mt-12 space-y-16">
        {tracks.map((track) => {
          const list = challengesOf(track.id);
          if (list.length === 0) return null;
          const trackSolved = list.filter((c) => solvedSet.has(c.id)).length;
          const pct = Math.round((trackSolved / list.length) * 100);
          return (
            <section key={track.id}>
              <div className="flex flex-wrap items-end justify-between gap-2">
                <h2 className="text-2xl font-medium tracking-tight">{track.title[locale]}</h2>
                <span className="font-mono text-xs text-muted">
                  {trackSolved}/{list.length}
                </span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2" aria-hidden>
                <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{track.intro[locale]}</p>
              <ol className="mt-6 space-y-3">
                {list.map((challenge) => (
                  <li key={challenge.id}>
                    <ChallengeCard
                      challenge={challenge}
                      locale={locale}
                      solved={solvedSet.has(challenge.id)}
                      revealed={state.revealed.includes(challenge.id)}
                      hintsUsed={state.hints[challenge.id] ?? 0}
                      onSolved={() => {
                        markSolved(challenge.id);
                        router.refresh(); // the saved solve moves the leaderboard
                      }}
                      onReveal={() => markRevealed(challenge.id)}
                      onHints={(n) => markHints(challenge.id, n)}
                    />
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Difficulty({ level, locale }: { level: number; locale: Locale }) {
  return (
    <span className="inline-flex items-center gap-0.5" title={text.level[locale]} aria-label={`${text.level[locale]}: ${level}/3`}>
      {[1, 2, 3].map((i) => (
        <Star key={i} aria-hidden className={`size-3.5 ${i <= level ? "fill-accent text-accent" : "text-border"}`} />
      ))}
    </span>
  );
}

function ChallengeCard({
  challenge,
  locale,
  solved,
  revealed,
  hintsUsed,
  onSolved,
  onReveal,
  onHints,
}: {
  challenge: Challenge;
  locale: Locale;
  solved: boolean;
  revealed: boolean;
  hintsUsed: number;
  onSolved: () => void;
  onReveal: () => void;
  onHints: (n: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hintsShown, setHintsShown] = useState(hintsUsed);
  const [guess, setGuess] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "wrong" | "tooFast" | "failed">("idle");

  const showSolution = (solved || revealed) && !!challenge.solution?.length;
  const cost = hintCostOf(challenge.points);

  function revealHint() {
    const n = hintsShown + 1;
    setHintsShown(n);
    onHints(n);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!guess.trim()) return;
    setStatus("checking");
    try {
      const { correct, rateLimited } = await checkFlag(challenge.id, guess, hintsShown);
      if (correct) {
        setStatus("idle");
        onSolved();
      } else {
        setStatus(rateLimited ? "tooFast" : "wrong");
      }
    } catch {
      // Network or server error: keep the guess and let them resend.
      setStatus("failed");
    }
  }

  return (
    <div className={`overflow-hidden rounded-card border ${solved ? "border-accent/50 bg-accent-soft/20" : "border-border bg-surface/40"}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-4 text-left sm:px-5"
      >
        <span className="font-mono text-sm text-faint">{String(challenge.order).padStart(2, "0")}</span>
        <span className={`grid size-7 shrink-0 place-items-center rounded-full border ${solved ? "border-accent bg-accent text-on-accent" : "border-border text-muted"}`}>
          {solved ? <Check aria-hidden className="size-4" /> : <Flag aria-hidden className="size-3.5" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium tracking-tight">{challenge.title[locale]}</span>
        </span>
        <span className="hidden shrink-0 sm:block">
          <Difficulty level={challenge.difficulty} locale={locale} />
        </span>
        <span className="shrink-0 font-mono text-xs text-muted">
          {solved ? `${earnedPoints(challenge.points, hintsUsed)}/${challenge.points}` : challenge.points} {text.points[locale]}
        </span>
        {solved ? (
          <span className="hidden shrink-0 items-center gap-1 rounded-full border border-accent px-2 py-0.5 text-[0.625rem] text-accent sm:inline-flex">
            <ShieldCheck aria-hidden className="size-3" /> {text.solvedBadge[locale]}
          </span>
        ) : revealed ? (
          <span className="hidden shrink-0 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[0.625rem] text-muted sm:inline-flex">
            <Lock aria-hidden className="size-3" /> {text.revealedBadge[locale]}
          </span>
        ) : null}
        <ChevronDown aria-hidden className={`size-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-border px-4 py-5 sm:px-5">
          <p className="max-w-2xl leading-relaxed text-muted">
            <Rich value={challenge.brief[locale]} />
          </p>

          {/* Downloadable files */}
          {challenge.files && challenge.files.length > 0 && (
            <div className="mt-6">
              <p className="stamp text-[0.625rem] text-faint">{text.files[locale]}</p>
              <ul className="mt-2 space-y-2">
                {challenge.files.map((file) => (
                  <li key={file.href}>
                    <a
                      href={file.href}
                      download
                      className="group inline-flex items-center gap-2.5 rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm transition-colors hover:border-accent"
                    >
                      <Download aria-hidden className="size-4 text-accent" />
                      <span className="font-mono text-text">{file.name}</span>
                      {file.size && <span className="text-xs text-faint">{file.size}</span>}
                    </a>
                    {file.note && <p className="mt-1 text-xs text-muted">{file.note[locale]}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Evidence */}
          {challenge.evidence.length > 0 && (
            <div className="mt-6 space-y-4">
              <p className="stamp text-[0.625rem] text-faint">{text.evidence[locale]}</p>
              {challenge.evidence.map((file) => (
                <figure key={file.name} className="overflow-hidden rounded-lg border border-border bg-code">
                  <figcaption className="border-b border-border px-3 py-1.5 font-mono text-xs text-muted">{file.name}</figcaption>
                  <div className="overflow-x-auto">
                    <ol className="min-w-full py-2 font-mono text-xs leading-relaxed">
                      {file.lines.map((line, i) => (
                        <li key={i} className="flex gap-3 px-3">
                          <span className="select-none text-faint">{String(i + 1).padStart(2, "0")}</span>
                          <span className="whitespace-pre text-text">{line}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </figure>
              ))}
            </div>
          )}

          {/* Hints */}
          {challenge.hints.length > 0 && (
            <div className="mt-6">
              <p className="stamp text-[0.625rem] text-faint">{text.hints[locale]}</p>
              <ul className="mt-2 space-y-2">
                {challenge.hints.slice(0, hintsShown).map((hint, i) => (
                  <li key={i} className="flex gap-2 rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm text-muted">
                    <Lightbulb aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                    <span>
                      <Rich value={hint[locale]} />
                    </span>
                  </li>
                ))}
              </ul>
              {hintsShown < challenge.hints.length && (
                <button
                  type="button"
                  onClick={revealHint}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
                >
                  <Lightbulb aria-hidden className="size-4" /> {text.showHint[locale]} ({hintsShown}/{challenge.hints.length})
                  {!solved && <span className="text-faint">· {format(text.hintCost[locale], { n: cost })}</span>}
                </button>
              )}
            </div>
          )}

          {/* Flag input */}
          {!solved && (
            <form onSubmit={onSubmit} className="mt-6 flex flex-wrap items-center gap-2">
              <label className="sr-only" htmlFor={`flag-${challenge.id}`}>
                {text.flag[locale]}
              </label>
              <input
                id={`flag-${challenge.id}`}
                value={guess}
                onChange={(e) => {
                  setGuess(e.target.value);
                  if (status !== "checking") setStatus("idle");
                }}
                placeholder={text.flagPlaceholder[locale]}
                aria-invalid={status === "wrong" || undefined}
                aria-describedby={status !== "idle" && status !== "checking" ? `flag-msg-${challenge.id}` : undefined}
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm text-text outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={status === "checking"}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                <Flag aria-hidden className="size-4" />
                {status === "checking" ? text.checking[locale] : text.submit[locale]}
              </button>
            </form>
          )}
          {(status === "wrong" || status === "tooFast" || status === "failed") && !solved && (
            <p id={`flag-msg-${challenge.id}`} role="alert" className="mt-2 text-sm text-danger">
              {text[status][locale]}
            </p>
          )}
          {solved && (
            <p className="mt-6 inline-flex items-center gap-2 rounded-lg border border-accent bg-accent-soft/30 px-3 py-2 text-sm text-accent">
              <Check aria-hidden className="size-4" /> {text.correct[locale]}
            </p>
          )}

          {/* Give up / reveal */}
          {!solved && !revealed && challenge.solution?.length ? (
            <button
              type="button"
              onClick={onReveal}
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-text"
            >
              <Sparkles aria-hidden className="size-4" /> {text.giveUp[locale]}
            </button>
          ) : null}

          {/* Solution + takeaway */}
          {showSolution && (
            <div className="mt-6 rounded-lg border border-border bg-surface/60 p-4 sm:p-5">
              <p className="stamp flex items-center gap-1.5 text-[0.625rem] text-accent">
                <ListOrdered aria-hidden className="size-3.5" /> {text.solution[locale]}
              </p>
              <ol className="mt-3 space-y-3">
                {challenge.solution!.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full border border-accent font-mono text-xs text-accent">{i + 1}</span>
                    <span>
                      <Rich value={step[locale]} />
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {showSolution && (
            <div className="mt-4 rounded-lg border border-dashed border-border px-4 py-3">
              <p className="stamp text-[0.625rem] text-faint">{text.takeaway[locale]}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                <Rich value={challenge.takeaway[locale]} />
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
