// Applies the SQL migrations in /drizzle. Safe to run on every deploy:
// already-applied migrations are skipped.
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

try {
  process.loadEnvFile();
} catch {}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
const sql = postgres(url, { max: 1, ssl: local ? false : "require", onnotice: () => {} });

await migrate(drizzle(sql), { migrationsFolder: "drizzle" });
await sql.end();
console.log("✓ Database is up to date");
