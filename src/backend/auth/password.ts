// Password and login helpers. No "server-only" import so the CLI scripts
// can use them too; nothing here touches the request.
import { randomInt } from "node:crypto";
import { hash, verify } from "@node-rs/argon2";

// argon2id with the library defaults (19 MiB, 2 passes), the OWASP baseline.
export function hashPassword(password: string) {
  return hash(password);
}

export async function verifyPassword(passwordHash: string, password: string) {
  try {
    return await verify(passwordHash, password);
  } catch {
    return false;
  }
}

let dummy: Promise<string> | undefined;
/**
 * Verifies against a throwaway hash when the login does not exist, so a
 * wrong login and a wrong password take the same time to answer.
 */
export async function burnVerifyTime(password: string) {
  dummy ??= hash("rooty-timing-dummy");
  await verifyPassword(await dummy, password);
}

// No 0/O, 1/l/I: passwords are read aloud and copied from paper.
const alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** A readable random password, e.g. "kT4m-9wQx-Hb2p". */
export function generatePassword() {
  const pick = () => alphabet[randomInt(alphabet.length)];
  return [0, 1, 2].map(() => Array.from({ length: 4 }, pick).join("")).join("-");
}

export const MIN_PASSWORD = 8;

/** Logins are case-insensitive: stored and compared in lower case. */
export function normalizeLogin(login: string) {
  return login.trim().toLowerCase();
}

/** 3–32 chars: latin letters, digits, dot, dash, underscore. */
export function isValidLogin(login: string) {
  return /^[a-z0-9._-]{3,32}$/.test(login);
}
