// Creates or updates the admin account from ADMIN_LOGIN / ADMIN_PASSWORD /
// ADMIN_NAME. Runs at build time on Vercel, where there is no long-lived
// server start for src/instrumentation.ts to hook into.
import { syncEnvAdmin } from "../src/backend/auth/env-admin";

try {
  process.loadEnvFile();
} catch {}

await syncEnvAdmin();
