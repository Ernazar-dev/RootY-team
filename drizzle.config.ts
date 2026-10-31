import { defineConfig } from "drizzle-kit";

// drizzle-kit does not read .env by itself.
try {
  process.loadEnvFile();
} catch {}

export default defineConfig({
  schema: "./src/backend/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Same as scripts/migrate.ts: Neon's direct endpoint when it is set.
  dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "" },
});
