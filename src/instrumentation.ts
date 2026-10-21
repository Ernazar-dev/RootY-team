// Runs once when a Next.js server starts (`next dev`, `next start`), before
// it serves requests.
export async function register() {
  // Node.js only (the database driver), and not inside `next build`.
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NEXT_PHASE === "phase-production-build") return;
  const { syncEnvAdmin } = await import("./backend/auth/env-admin");
  try {
    await syncEnvAdmin();
  } catch (error) {
    // Never block the site from starting over this.
    console.error("[admin] could not sync the .env admin", error);
  }
}
