"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { themeStorageKey } from "./theme-script";

type Theme = "dark" | "light";

/** Switches dark ↔ light. Dark is the default; only "light" is stored. */
export function ThemeToggle({ labels }: { labels: Record<Theme, string> & { label: string } }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with the inline script after hydration
    if (document.documentElement.dataset.theme === "light") setTheme("light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "light") document.documentElement.dataset.theme = "light";
    else document.documentElement.removeAttribute("data-theme");
    try {
      if (next === "light") localStorage.setItem(themeStorageKey, "light");
      else localStorage.removeItem(themeStorageKey);
    } catch {}
  }

  const Icon = theme === "dark" ? Moon : Sun;
  return (
    <button
      type="button"
      onClick={toggle}
      title={`${labels.label}: ${labels[theme]}`}
      aria-label={`${labels.label}: ${labels[theme]}`}
      className="grid size-9 place-items-center rounded-lg border border-border text-muted transition-colors hover:border-border-strong hover:text-text"
    >
      <Icon aria-hidden className="size-4" />
    </button>
  );
}
