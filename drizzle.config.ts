import { defineConfig } from "drizzle-kit";

// drizzle-kit does not read .env by itself.
try {
  process.loadEnvFile();
} catch {}

export default defineConfig({
  schema: "./src/backend/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
