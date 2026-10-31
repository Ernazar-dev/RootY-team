import { test } from "node:test";
import assert from "node:assert/strict";
import { pgOptions } from "@/backend/db/options";

test("local Postgres: no TLS, prepared statements on", () => {
  const o = pgOptions("postgresql://postgres:pw@localhost:5432/rooty");
  assert.equal(o.ssl, false);
  assert.equal(o.prepare, true);
});

test("Neon direct endpoint: TLS required, prepared statements on", () => {
  const o = pgOptions("postgresql://u:pw@ep-cool-name-123456.eu-central-1.aws.neon.tech/rooty?sslmode=require");
  assert.equal(o.ssl, "require");
  assert.equal(o.prepare, true);
});

test("Neon pooled endpoint (PgBouncer): prepared statements off", () => {
  const o = pgOptions("postgresql://u:pw@ep-cool-name-123456-pooler.eu-central-1.aws.neon.tech/rooty?sslmode=require");
  assert.equal(o.ssl, "require");
  assert.equal(o.prepare, false);
});
