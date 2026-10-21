"use client";

// An inline <script> that runs during HTML parsing (before first paint) on the
// server, but doesn't trip React's "script tag while rendering" dev warning on
// the client. It must be a Client Component so the `typeof window` check runs
// in the browser too: SSR emits `text/javascript` (executes during parse),
// while the client render emits inert `text/plain`, and
// `suppressHydrationWarning` accepts the type mismatch.
// See node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
