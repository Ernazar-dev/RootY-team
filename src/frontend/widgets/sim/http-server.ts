// A tiny pretend web shop used by the HTTP lesson widget. Pure and
// deterministic: no network, no real cookies.

export type Method = "GET" | "POST";
export const paths = ["/", "/login", "/profile", "/admin", "/backup.zip"] as const;
export type Path = (typeof paths)[number];
export const sessionCookie = "session=7f3a9c";

export type Outcome =
  | "home"
  | "loginForm"
  | "loggedIn"
  | "profile"
  | "needLogin"
  | "forbidden"
  | "notFound"
  | "methodNotAllowed";

export interface SimResponse {
  status: number;
  reason: string;
  headers: string[];
  body: string;
  outcome: Outcome;
  /** True when the response hands the browser a session cookie. */
  setsCookie: boolean;
}

const reasons: Record<number, string> = {
  200: "OK",
  302: "Found",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
};

function reply(
  status: number,
  outcome: Outcome,
  body: string,
  headers: string[] = [],
  setsCookie = false,
): SimResponse {
  return { status, reason: reasons[status], headers, body, outcome, setsCookie };
}

export function buildRequest(method: Method, path: Path, withCookie: boolean) {
  const lines = [`${method} ${path} HTTP/1.1`, "Host: shop.example"];
  if (withCookie) lines.push(`Cookie: ${sessionCookie}`);
  if (method === "POST") {
    lines.push("Content-Type: application/x-www-form-urlencoded", "", "user=aziz&password=••••••");
  }
  return lines.join("\n");
}

export function respond(method: Method, path: Path, withCookie: boolean): SimResponse {
  const html = ["Content-Type: text/html"];
  switch (path) {
    case "/":
      return method === "GET"
        ? reply(200, "home", "<h1>Shop</h1>", html)
        : reply(405, "methodNotAllowed", "", ["Allow: GET"]);
    case "/login":
      return method === "GET"
        ? reply(200, "loginForm", '<form method="post">…</form>', html)
        : reply(
            302,
            "loggedIn",
            "",
            ["Location: /profile", `Set-Cookie: ${sessionCookie}; HttpOnly; Secure`],
            true,
          );
    case "/profile":
      if (method !== "GET") return reply(405, "methodNotAllowed", "", ["Allow: GET"]);
      return withCookie
        ? reply(200, "profile", "<h1>Salom, Aziz</h1>", html)
        : reply(302, "needLogin", "", ["Location: /login"]);
    case "/admin":
      // The server checks the role on every request, whatever the page shows.
      return withCookie
        ? reply(403, "forbidden", "<h1>403</h1>", html)
        : reply(302, "needLogin", "", ["Location: /login"]);
    default:
      return reply(404, "notFound", "<h1>404</h1>", html);
  }
}

export function formatResponse(response: SimResponse) {
  const head = [`HTTP/1.1 ${response.status} ${response.reason}`, ...response.headers];
  return response.body ? `${head.join("\n")}\n\n${response.body}` : head.join("\n");
}
