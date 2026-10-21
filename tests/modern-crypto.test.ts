import { test } from "node:test";
import assert from "node:assert/strict";
import {
  aesDecryptBlock,
  aesEncryptBlock,
  aesSbox,
  bitDifference,
  desBlock,
  diffieHellman,
  fromBlock,
  hex,
  hexToBytes,
  keyFromText,
  modInverse,
  modPow,
  rc4,
  rsaDecrypt,
  rsaEncrypt,
  rsaKeys,
  sha256,
  textToBytes,
  toBlock,
  xorBytes,
} from "@/frontend/widgets/sim/modern";

const h = (s: string) => hexToBytes(s)!;

test("XOR twice with the same key gives the text back", () => {
  const data = textToBytes("Salom");
  const key = textToBytes("KEY");
  assert.deepEqual(xorBytes(xorBytes(data, key), key), data);
  assert.equal(0b1011 ^ 0b0110, 0b1101);
  assert.equal(hexToBytes("zz"), null);
});

test("RC4 matches the classic test vectors", () => {
  assert.equal(hex(rc4(textToBytes("Plaintext"), textToBytes("Key")), ""), "bbf316e8d940af0ad3");
  assert.equal(hex(rc4(textToBytes("Attack at dawn"), textToBytes("Secret")), ""), "45a01f645fc35b383552544b9bf5");
});

test("DES matches the textbook vector and decrypts", () => {
  const key = h("133457799BBCDFF1");
  const out = desBlock(h("0123456789ABCDEF"), key);
  assert.equal(hex(out.output, ""), "85e813540f0ab405");
  assert.equal(out.rounds.length, 16);
  assert.equal(out.rounds[0].left.length, 8);
  assert.equal(hex(desBlock(out.output, key, true).output, ""), "0123456789abcdef");
});

test("AES-128 matches FIPS-197 and decrypts", () => {
  assert.equal(aesSbox[0x00], 0x63);
  assert.equal(aesSbox[0x53], 0xed);
  const key = h("000102030405060708090a0b0c0d0e0f");
  const { output, trace } = aesEncryptBlock(h("00112233445566778899aabbccddeeff"), key);
  assert.equal(hex(output, ""), "69c4e0d86a7b0430d8cdb78070b4c55a");
  // FIPS-197 C.1: state at the start of round 1.
  assert.equal(hex(trace[1].state, ""), "00102030405060708090a0b0c0d0e0f0");
  assert.equal(trace.filter((s) => s.stage === "mixColumns").length, 9);
  assert.equal(hex(aesDecryptBlock(output, key), ""), "00112233445566778899aabbccddeeff");
  const k = keyFromText("rooty");
  assert.equal(fromBlock(aesDecryptBlock(aesEncryptBlock(toBlock("Salom, dunyo!"), k).output, k)), "Salom, dunyo!");
});

test("RSA with small primes round-trips", () => {
  const keys = rsaKeys(5, 11)!;
  assert.deepEqual([keys.n, keys.phi, keys.e, keys.d], [55n, 40n, 3n, 27n]);
  assert.equal(rsaEncrypt(2n, keys), 8n);
  assert.equal(rsaDecrypt(8n, keys), 2n);
  const big = rsaKeys(61, 53, 17)!;
  assert.equal(big.d, 2753n);
  for (const m of [0n, 42n, 65n, 3232n]) assert.equal(rsaDecrypt(rsaEncrypt(m, big), big), m);
  assert.equal(rsaKeys(4, 11), null);
  assert.equal(modInverse(4n, 8n), null);
  assert.equal(modPow(4n, 13n, 497n), 445n);
});

test("Diffie–Hellman gives both sides the same secret", () => {
  const dh = diffieHellman(23, 5, 6, 15);
  assert.deepEqual([dh.A, dh.B, dh.sharedA, dh.sharedB], [8n, 19n, 2n, 2n]);
});

test("SHA-256 matches NIST and shows the avalanche effect", () => {
  assert.equal(sha256(textToBytes("abc")), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  assert.equal(sha256([]), "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  assert.equal(
    sha256(textToBytes("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq")),
    "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1",
  );
  const diff = bitDifference(sha256(textToBytes("salom")), sha256(textToBytes("Salom")));
  assert.ok(diff > 80 && diff < 176, `${diff}`);
});
