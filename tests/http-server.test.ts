import { test } from "node:test";
import assert from "node:assert/strict";
import { buildRequest, formatResponse, respond } from "@/frontend/widgets/sim/http-server";

test("public page is open to everyone", () => {
  assert.equal(respond("GET", "/", false).status, 200);
});

test("profile needs a session cookie", () => {
  const anonymous = respond("GET", "/profile", false);
  assert.equal(anonymous.status, 302);
  assert.ok(anonymous.headers.includes("Location: /login"));
  assert.equal(respond("GET", "/profile", true).status, 200);
});

test("admin checks the role, not just the cookie", () => {
  assert.equal(respond("GET", "/admin", false).status, 302);
  assert.equal(respond("GET", "/admin", true).status, 403);
});

test("logging in issues an HttpOnly session cookie", () => {
  const login = respond("POST", "/login", false);
  assert.equal(login.status, 302);
  assert.ok(login.setsCookie);
  assert.ok(login.headers.some((h) => h.startsWith("Set-Cookie:") && h.includes("HttpOnly")));
});

test("wrong methods and unknown files get the right status", () => {
  assert.equal(respond("POST", "/profile", true).status, 405);
  assert.equal(respond("GET", "/backup.zip", false).status, 404);
});

test("raw request and response text", () => {
  assert.equal(buildRequest("GET", "/", false), "GET / HTTP/1.1\nHost: shop.example");
  assert.ok(buildRequest("GET", "/", true).includes("Cookie: session="));
  assert.ok(formatResponse(respond("GET", "/", false)).startsWith("HTTP/1.1 200 OK"));
});
