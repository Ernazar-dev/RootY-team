"use client";

import { useEffect, useRef, useState } from "react";

export type TerminalLine = { kind: "cmd" | "info" | "warn" | "ok" | "out"; text: string };

const prefix: Record<TerminalLine["kind"], string> = {
  cmd: "$ ",
  info: "[*] ",
  warn: "[!] ",
  ok: "[✓] ",
  out: "",
};

const tone: Record<TerminalLine["kind"], string> = {
  cmd: "text-text",
  info: "text-muted",
  warn: "text-warning",
  ok: "text-success",
  out: "text-accent-text",
};

/**
 * Replays a terminal session: commands are typed character by character,
 * output lines appear at once, then the session loops. Starts only while on
 * screen. Screen readers and reduced-motion visitors get the full transcript.
 */
export function TerminalReplay({ lines, className = "" }: { lines: TerminalLine[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [row, setRow] = useState(lines.length);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer = 0;
    let running = false;
    let r = 0;
    let c = 0;

    function restart() {
      r = 0;
      c = 0;
      setRow(0);
      setChars(0);
    }

    function tick() {
      const line = lines[r];
      if (!line) {
        // Hold the finished screen, then start over.
        timer = window.setTimeout(() => {
          restart();
          tick();
        }, 3200);
        return;
      }
      if (line.kind === "cmd" && c < line.text.length) {
        c += 1;
        setChars(c);
        timer = window.setTimeout(tick, 28 + Math.random() * 40);
        return;
      }
      r += 1;
      c = 0;
      setRow(r);
      setChars(0);
      timer = window.setTimeout(tick, line.kind === "cmd" ? 380 : 520);
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        restart();
        timer = window.setTimeout(tick, 400);
      } else if (!entry.isIntersecting && running) {
        running = false;
        window.clearTimeout(timer);
        setRow(lines.length);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [lines]);

  const cursor = <span className="blink ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-accent" />;

  return (
    <div ref={ref} className={`font-mono text-xs leading-6 sm:text-[0.8125rem] ${className}`}>
      <ol className="sr-only">
        {lines.map((line, i) => (
          <li key={i}>
            {prefix[line.kind]}
            {line.text}
          </li>
        ))}
      </ol>
      <div aria-hidden>
        {lines.map((line, i) => {
          if (i > row) return null;
          const typing = i === row;
          if (typing && line.kind !== "cmd") return null;
          return (
            <div key={i} className={`whitespace-pre-wrap [overflow-wrap:anywhere] ${tone[line.kind]}`}>
              <span className={line.kind === "cmd" ? "text-accent" : ""}>{prefix[line.kind]}</span>
              {typing ? line.text.slice(0, chars) : line.text}
              {typing && cursor}
            </div>
          );
        })}
        {row >= lines.length && (
          <div className="text-accent">
            ${cursor}
          </div>
        )}
      </div>
    </div>
  );
}
