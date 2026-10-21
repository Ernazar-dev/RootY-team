import { test } from "node:test";
import assert from "node:assert/strict";
import { HOME, createFs, prompt, resolve, run, type ShellState } from "@/frontend/widgets/sim/shell";

const start = (): ShellState => ({
  cwd: HOME,
  fs: createFs({ [`${HOME}/notes.txt`]: "hi\nthere", [`${HOME}/.flag.txt`]: "FLAG", "/etc/hostname": "rooty" }, ["/tmp"]),
});

test("resolves absolute, relative, ~ and .. paths", () => {
  assert.equal(resolve(HOME, ".."), "/home");
  assert.equal(resolve(HOME, "../../etc"), "/etc");
  assert.equal(resolve("/etc", "~"), HOME);
  assert.equal(resolve("/etc", "~/notes.txt"), `${HOME}/notes.txt`);
  assert.equal(resolve("/", ".."), "/");
  assert.equal(resolve(HOME, "/var//log/./"), "/var/log");
});

test("ls hides dot files unless -a is given", () => {
  const plain = run(start(), "ls");
  assert.deepEqual(plain.output, ["notes.txt"]);
  assert.equal(plain.path, HOME);
  assert.ok(run(start(), "ls -a").output[0].includes(".flag.txt"));
  assert.equal(run(start(), "ls -l").ok, false);
});

test("cd moves around and refuses files and missing folders", () => {
  const moved = run(start(), "cd /etc");
  assert.equal(moved.state.cwd, "/etc");
  assert.equal(run(moved.state, "cd").state.cwd, HOME);
  assert.equal(run(start(), "cd nowhere").ok, false);
  assert.equal(run(start(), "cd notes.txt").ok, false);
});

test("cat prints files and reports the path it read", () => {
  const read = run(start(), "cat notes.txt");
  assert.deepEqual(read.output, ["hi", "there"]);
  assert.equal(read.path, `${HOME}/notes.txt`);
  assert.equal(run(start(), "cat /tmp").ok, false);
  assert.equal(run(start(), "cat missing").ok, false);
});

test("mkdir and touch create entries without touching the old state", () => {
  const before = start();
  const made = run(before, "mkdir lab");
  assert.equal(made.path, `${HOME}/lab`);
  assert.equal(made.state.fs[`${HOME}/lab`]?.type, "dir");
  assert.equal(before.fs[`${HOME}/lab`], undefined);
  assert.equal(run(made.state, "mkdir lab").ok, false);
  assert.equal(run(start(), "mkdir no/such/parent").ok, false);
  assert.equal(run(start(), "touch notes.txt").ok, true);
});

test("prompt shortens the home folder to ~", () => {
  assert.equal(prompt(HOME), "student@rooty:~$");
  assert.equal(prompt(`${HOME}/lab`), "student@rooty:~/lab$");
  assert.equal(prompt("/etc"), "student@rooty:/etc$");
  assert.equal(run(start(), "nope").output[0], "nope: command not found");
});
