// postgres.js settings for a connection string, shared by the app, the
// migration script and the .env admin sync. No "server-only": scripts load it.
import type { Options } from "postgres";

export function pgOptions(url: string): Options<Record<string, never>> {
  // A local server has no TLS; Neon and other hosted databases require it.
  const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
  // Neon's pooled endpoint (host contains "-pooler") is PgBouncer in
  // transaction mode, which cannot keep prepared statements between queries.
  const pooled = /-pooler\./.test(url);
  return { ssl: local ? false : "require", prepare: !pooled, onnotice: () => {} };
}
