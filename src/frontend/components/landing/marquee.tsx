import type { CSSProperties } from "react";

// Vulnerability classes the course works through. Technical names, so the
// same in every language.
const rows = [
  ["SQL Injection", "Cross-Site Scripting", "CSRF", "SSRF", "IDOR", "Path Traversal", "XXE"],
  ["Broken Authentication", "Session Fixation", "Clickjacking", "Open Redirect", "RCE", "CORS Misconfig", "JWT"],
];

/** Two bands of vulnerability names drifting in opposite directions. */
export function Marquee() {
  return (
    <div aria-hidden className="marquee-mask space-y-3 overflow-hidden border-y border-border py-6">
      {rows.map((row, i) => (
        <div
          key={i}
          className="marquee"
          data-reverse={i % 2 ? "" : undefined}
          style={{ "--speed": `${48 + i * 10}s` } as CSSProperties}
        >
          {/* Rendered twice so the -50% loop is seamless. */}
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {row.map((name) => (
                <span
                  key={name}
                  className={`stamp flex items-center gap-6 px-3 text-sm whitespace-nowrap sm:text-base ${i % 2 ? "text-faint" : "text-muted"}`}
                >
                  {name}
                  <span className="text-accent">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
