"use client";

import { useEffect } from "react";

/**
 * Page-wide motion, driven by data attributes so server components stay
 * server components:
 *   data-reveal  fades/rises in once it scrolls into view (CSS in globals.css)
 *   data-spot    a violet glow follows the pointer across the element
 *   data-tilt    the element leans toward the pointer in 3D
 * Mounted once in the root layout; renders nothing.
 */
export function Effects() {
  useEffect(() => {
    const root = document.documentElement;
    const cleanups: (() => void)[] = [];

    if ("motion" in root.dataset) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            (entry.target as HTMLElement).dataset.shown = "";
            io.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
      );
      const scan = () =>
        document.querySelectorAll("[data-reveal]:not([data-shown])").forEach((el) => io.observe(el));
      scan();
      // Client navigations add new sections; pick them up as they appear.
      const mo = new MutationObserver(scan);
      mo.observe(document.body, { childList: true, subtree: true });
      cleanups.push(() => {
        io.disconnect();
        mo.disconnect();
      });
    }

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tilted: HTMLElement | null = null;

    function onMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      const target = event.target as Element | null;

      const spot = target?.closest<HTMLElement>("[data-spot]");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${event.clientX - r.left}px`);
        spot.style.setProperty("--my", `${event.clientY - r.top}px`);
      }

      if (reduced) return;
      const tilt = target?.closest<HTMLElement>("[data-tilt]") ?? null;
      if (tilted && tilted !== tilt) tilted.style.transform = "";
      tilted = tilt;
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const x = (event.clientX - r.left) / r.width - 0.5;
        const y = (event.clientY - r.top) / r.height - 0.5;
        tilt.style.transform = `perspective(1000px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`;
      }
    }

    document.addEventListener("pointermove", onMove, { passive: true });
    cleanups.push(() => document.removeEventListener("pointermove", onMove));
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
