import type { Localized } from "@/shared/i18n/config";

// The overall rating: how points are earned and which rank they unlock.
// Shared by the server (backend/services/rating.ts) and the page, so the
// rule lives only here. CTF points come from frontend/ctf/scoring.ts.

/** Points for every lesson a student has marked as completed. */
export const LESSON_POINTS = 50;

export type Rank = {
  tier: number;
  name: Localized;
  /** First score of this rank. */
  min: number;
  /** First score of the next rank; null for the top one. */
  next: number | null;
  /** Badge accent, used for the rank name and the progress bar. */
  color: string;
};

// Thresholds sized for ~2450 CTF points + 12 lessons: the top rank needs
// most of the arena, not all of it.
export const RANKS: Rank[] = [
  {
    tier: 1,
    name: { uz: "Yangi boshlovchi", kaa: "Jańa baslawshı", ru: "Новичок", en: "Beginner" },
    min: 0,
    next: 100,
    color: "#c0743a",
  },
  {
    tier: 2,
    name: { uz: "Izlanuvchi", kaa: "Izleniwshi", ru: "Исследователь", en: "Explorer" },
    min: 100,
    next: 300,
    color: "#8a96a8",
  },
  {
    tier: 3,
    name: { uz: "Tahlilchi", kaa: "Analitik", ru: "Аналитик", en: "Analyst" },
    min: 300,
    next: 700,
    color: "#6366f1",
  },
  {
    tier: 4,
    name: { uz: "Mutaxassis", kaa: "Qániygeli", ru: "Специалист", en: "Specialist" },
    min: 700,
    next: 1200,
    color: "#d98f55",
  },
  {
    tier: 5,
    name: { uz: "Ekspert", kaa: "Ekspert", ru: "Эксперт", en: "Expert" },
    min: 1200,
    next: 2000,
    color: "#f59e0b",
  },
  {
    tier: 6,
    name: { uz: "Kiber usta", kaa: "Kiber sheber", ru: "Кибермастер", en: "Cyber Master" },
    min: 2000,
    next: null,
    color: "#eab308",
  },
];

export function rankOf(points: number): Rank {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (points >= RANKS[i].min) return RANKS[i];
  }
  return RANKS[0];
}

/** How far into the current rank, 0..100. */
export function rankProgress(points: number, rank: Rank = rankOf(points)) {
  if (rank.next === null) return 100;
  return Math.min(100, Math.max(0, Math.round(((points - rank.min) / (rank.next - rank.min)) * 100)));
}

/** "700–1199" or "2000+". */
export function rankRange(rank: Rank) {
  return rank.next === null ? `${rank.min}+` : `${rank.min}–${rank.next - 1}`;
}
