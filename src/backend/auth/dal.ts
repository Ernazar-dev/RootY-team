import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { readSession } from "./session";

// Data Access Layer: every server read of "who is this?" goes through here,
// and every admin read or action starts with requireAdmin().

/**
 * The signed-in user for this request, or null. Deduplicated per request.
 * Always rendered per request: session-dependent data (and the times it is
 * compared against) must never be prerendered into a shared shell.
 */
export const getCurrentUser = cache(async () => {
  await connection();
  return (await readSession())?.user ?? null;
});

/** Admins pass; visitors go to the login page; students get a 404. */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/uz/login?next=/admin");
  if (user.role !== "admin") notFound();
  return user;
}
