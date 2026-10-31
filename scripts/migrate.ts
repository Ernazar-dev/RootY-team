// Applies the SQL migrations in /drizzle. Safe to run on every deploy:
// already-applied migrations are skipped.
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { pgOptions } from "../src/backend/db/options";

try {
  process.loadEnvFile();
} catch {}

// Migrations prefer Neon's direct (unpooled) endpoint when it is set: schema
// changes are safer outside PgBouncer. The app itself uses DATABASE_URL.
const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const sql = postgres(url, { ...pgOptions(url), max: 1 });

await migrate(drizzle(sql), { migrationsFolder: "drizzle" });
await sql.end();
console.log("✓ Database is up to date");
