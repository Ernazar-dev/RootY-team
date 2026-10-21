import { connection, type NextRequest } from "next/server";
import { readSession, renewSession } from "@/backend/auth/session";
import { lessonStatus } from "@/backend/services/progress";

export type SessionInfo = {
  user: { name: string; role: "student" | "admin" } | null;
  /** Progress on ?lesson=<slug>, when asked and signed in. */
  lesson: "started" | "completed" | null;
};

// Public pages are static; the header and lesson page ask this endpoint who
// is signed in. It also slides the session forward on activity.
export async function GET(request: NextRequest) {
  // Per request, never prerendered: a build-time answer would be "nobody".
  await connection();
  let info: SessionInfo = { user: null, lesson: null };
  try {
    const session = await readSession();
    if (session) {
      await renewSession(session);
      const slug = request.nextUrl.searchParams.get("lesson");
      info = {
        user: { name: session.user.name, role: session.user.role },
        lesson: slug ? await lessonStatus(session.user.id, slug) : null,
      };
    }
  } catch (error) {
    console.error("[session] lookup failed", error);
  }
  return Response.json(info, { headers: { "Cache-Control": "private, no-store" } });
}
