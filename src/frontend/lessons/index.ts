import type { Lesson } from "./types";
import cryptoBasics from "./crypto-basics";
import httpBasics from "./http-basics";
import linuxBasics from "./linux-basics";

// Add each new lesson here. Order on the site comes from `lesson.order`.
const all: Lesson[] = [linuxBasics, httpBasics, cryptoBasics];

export const lessons = [...all].sort((a, b) => a.order - b.order);

export function getLesson(slug: string) {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function getNeighbours(slug: string) {
  const i = lessons.findIndex((lesson) => lesson.slug === slug);
  return {
    previous: i > 0 ? lessons[i - 1] : undefined,
    next: i >= 0 && i < lessons.length - 1 ? lessons[i + 1] : undefined,
  };
}
