import { test } from "node:test";
import assert from "node:assert/strict";
import {
  generatePassword,
  hashPassword,
  isValidLogin,
  normalizeLogin,
  verifyPassword,
} from "@/backend/auth/password";
import { IP_LIMIT, LOGIN_LIMIT, clientIp, isLocked, landingPath, safeNext } from "@/backend/auth/rate-limit";
import { readAdminEnv } from "@/backend/auth/env-admin";

test("the .env admin is read, normalised and validated", () => {
  assert.deepEqual(readAdminEnv({}), { status: "unset" });
  assert.deepEqual(readAdminEnv({ ADMIN_LOGIN: "", ADMIN_PASSWORD: "" }), { status: "unset" });
  assert.deepEqual(readAdminEnv({ ADMIN_LOGIN: " Teacher ", ADMIN_PASSWORD: "long-enough-pass", ADMIN_NAME: " Ustoz " }), {
    status: "ok",
    login: "teacher",
    password: "long-enough-pass",
    name: "Ustoz",
  });
  assert.equal(readAdminEnv({ ADMIN_LOGIN: "teacher", ADMIN_PASSWORD: "short" }).status, "invalid");
  assert.equal(readAdminEnv({ ADMIN_LOGIN: "bad login", ADMIN_PASSWORD: "long-enough-pass" }).status, "invalid");
  assert.equal(readAdminEnv({ ADMIN_PASSWORD: "long-enough-pass" }).status, "invalid");
  // An unset name keeps whatever name the account already has.
  const noName = readAdminEnv({ ADMIN_LOGIN: "teacher", ADMIN_PASSWORD: "long-enough-pass" });
  assert.ok(noName.status === "ok" && noName.name === null);
});

test("passwords hash with argon2id and verify only the right one", async () => {
  const hash = await hashPassword("correct horse");
  assert.match(hash, /^\$argon2id\$/);
  assert.equal(await verifyPassword(hash, "correct horse"), true);
  assert.equal(await verifyPassword(hash, "wrong horse"), false);
  assert.equal(await verifyPassword("not-a-hash", "x"), false);
});

test("generated passwords are readable and unique", () => {
  const seen = new Set<string>();
  for (let i = 0; i < 200; i++) {
    const p = generatePassword();
    assert.match(p, /^[a-zA-Z2-9]{4}-[a-zA-Z2-9]{4}-[a-zA-Z2-9]{4}$/);
    assert.doesNotMatch(p, /[01OIl]/);
    seen.add(p);
  }
  assert.equal(seen.size, 200);
});

test("logins are case-insensitive and restricted to safe characters", () => {
  assert.equal(normalizeLogin("  Aziz.Karimov "), "aziz.karimov");
  assert.ok(isValidLogin("aziz.karimov"));
  assert.ok(isValidLogin("a_b-9"));
  assert.ok(!isValidLogin("ab"));
  assert.ok(!isValidLogin("aziz karimov"));
  assert.ok(!isValidLogin("азиз"));
  assert.ok(!isValidLogin("x".repeat(33)));
});

test("sign-in locks after too many failures per login or per IP", () => {
  assert.equal(isLocked(LOGIN_LIMIT - 1, 0), false);
  assert.equal(isLocked(LOGIN_LIMIT, 0), true);
  assert.equal(isLocked(0, IP_LIMIT), true);
});

test("the client IP is the proxy-appended one, not a forged first entry", () => {
  assert.equal(clientIp("6.6.6.6, 203.0.113.7", null), "203.0.113.7");
  assert.equal(clientIp(null, "198.51.100.2"), "198.51.100.2");
  assert.equal(clientIp(null, null), "unknown");
});

test("post-login redirects stay on this site", () => {
  assert.equal(safeNext("/uz/learn"), "/uz/learn");
  assert.equal(safeNext("//evil.example"), null);
  assert.equal(safeNext("https://evil.example"), null);
  assert.equal(safeNext("/\\evil.example"), null);
  assert.equal(safeNext(null), null);
});

test("admins land in the panel, students outside it", () => {
  assert.equal(landingPath("admin", null, "uz"), "/admin");
  assert.equal(landingPath("admin", "/admin/students", "uz"), "/admin/students");
  assert.equal(landingPath("admin", "/uz/learn", "uz"), "/admin");
  assert.equal(landingPath("student", null, "ru"), "/ru/learn");
  assert.equal(landingPath("student", "/ru/learn/http-basics", "ru"), "/ru/learn/http-basics");
  assert.equal(landingPath("student", "/admin", "uz"), "/uz/learn");
});
