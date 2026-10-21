// Creates an admin account, or resets an existing account's password and
// makes it an admin.
//
//   npm run admin:create -- <login> "<Full name>" [password]
//
// Without a password one is generated and printed once.
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from "../src/backend/db/schema";
import {
  MIN_PASSWORD,
  generatePassword,
  hashPassword,
  isValidLogin,
  normalizeLogin,
} from "../src/backend/auth/password";

try {
  process.loadEnvFile();
} catch {}

const [rawLogin, name, given] = process.argv.slice(2);
if (!rawLogin || !name) {
  console.error('Usage: npm run admin:create -- <login> "<Full name>" [password]');
  process.exit(1);
}
const login = normalizeLogin(rawLogin);
if (!isValidLogin(login)) {
  console.error("Login: 3–32 characters, latin letters, digits, . _ -");
  process.exit(1);
}
if (given && given.length < MIN_PASSWORD) {
  console.error(`Password must be at least ${MIN_PASSWORD} characters.`);
  process.exit(1);
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}
const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
const sql = postgres(url, { max: 1, ssl: local ? false : "require" });
const db = drizzle(sql);

const password = given ?? generatePassword();
const passwordHash = await hashPassword(password);

const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.login, login));
if (existing) {
  await db.update(users).set({ name, passwordHash, role: "admin", active: true }).where(eq(users.id, existing.id));
  console.log(`✓ ${login} is now an admin; password reset.`);
} else {
  await db.insert(users).values({ login, name, passwordHash, role: "admin" });
  console.log(`✓ Admin ${login} created.`);
}
if (!given) console.log(`  Password: ${password}   (shown once — save it)`);
await sql.end();
