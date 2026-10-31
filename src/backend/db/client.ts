// The connection itself, without "server-only": src/proxy.ts runs outside
// the React server layer and checks sessions through this module.
// Everything else imports "@/backend/db", which adds the server-only guard.
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { pgOptions } from "./options";

const url = process.env.DATABASE_URL;

/** False when DATABASE_URL is unset; the site then runs on code lessons only. */
export const hasDatabase = Boolean(url);

function connect() {
  if (!url) throw new Error("DATABASE_URL is not set. Copy .env.example to .env and fill it in.");
  return drizzle(postgres(url, { ...pgOptions(url), max: 5 }), { schema });
}

type Db = ReturnType<typeof connect>;

// One pool, opened on first use and reused across hot reloads in development.
const globalForDb = globalThis as unknown as { rootyDb?: Db };

function instance(): Db {
  globalForDb.rootyDb ??= connect();
  return globalForDb.rootyDb;
}

export const db = new Proxy({} as Db, {
  get(_, key) {
    const target = instance();
    const value = Reflect.get(target, key);
    return typeof value === "function" ? value.bind(target) : value;
  },
});

export { schema };
