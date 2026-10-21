// A tiny pretend Linux shell for the file-system lesson. Pure and
// deterministic: an in-memory tree, no real files, nothing leaves the page.

export type Node = { type: "dir" } | { type: "file"; content: string };
/** Absolute path → node. "/" is always a directory. */
export type Fs = Record<string, Node>;

export const HOME = "/home/student";
export const USER = "student";

export interface ShellState {
  fs: Fs;
  cwd: string;
}

export interface ShellResult {
  state: ShellState;
  /** Lines to print; empty for silent commands like `cd`. */
  output: string[];
  ok: boolean;
  /** The command name and the absolute path it acted on, for lesson missions. */
  command: string;
  path?: string;
  /** `clear` asks the screen to wipe its history. */
  clear?: boolean;
}

/** Builds a file system from file contents; parent folders are created too. */
export function createFs(files: Record<string, string>, dirs: string[] = []): Fs {
  const fs: Fs = { "/": { type: "dir" } };
  const addDirs = (path: string) => {
    const parts = path.split("/").filter(Boolean);
    for (let i = 1; i <= parts.length; i++) fs[`/${parts.slice(0, i).join("/")}`] = { type: "dir" };
  };
  for (const dir of dirs) addDirs(dir);
  for (const [path, content] of Object.entries(files)) {
    addDirs(parent(path));
    fs[path] = { type: "file", content };
  }
  return fs;
}

function parent(path: string) {
  const i = path.lastIndexOf("/");
  return i <= 0 ? "/" : path.slice(0, i);
}

function baseName(path: string) {
  return path.slice(path.lastIndexOf("/") + 1);
}

/** Resolves `~`, `.`, `..`, absolute and relative paths against cwd. */
export function resolve(cwd: string, input: string) {
  let raw = input;
  if (raw === "~" || raw.startsWith("~/")) raw = HOME + raw.slice(1);
  const parts = (raw.startsWith("/") ? raw : `${cwd}/${raw}`).split("/");
  const stack: string[] = [];
  for (const part of parts) {
    if (!part || part === ".") continue;
    if (part === "..") stack.pop();
    else stack.push(part);
  }
  return `/${stack.join("/")}`;
}

function children(fs: Fs, dir: string) {
  const prefix = dir === "/" ? "/" : `${dir}/`;
  return Object.keys(fs)
    .filter((p) => p !== dir && p.startsWith(prefix) && !p.slice(prefix.length).includes("/"))
    .map((p) => ({ name: baseName(p), dir: fs[p].type === "dir" }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** The prompt shown before each command, e.g. student@rooty:~/lab$ */
export function prompt(cwd: string) {
  const shown = cwd === HOME ? "~" : cwd.startsWith(`${HOME}/`) ? `~${cwd.slice(HOME.length)}` : cwd;
  return `${USER}@rooty:${shown}$`;
}

const NAME = /^[A-Za-z0-9._-]+$/;

export function run(state: ShellState, line: string): ShellResult {
  const [command = "", ...args] = line.trim().split(/\s+/).filter(Boolean);
  const flags = args.filter((a) => a.startsWith("-"));
  const operands = args.filter((a) => !a.startsWith("-"));
  const done = (output: string[], ok = true, path?: string, next = state): ShellResult => ({
    state: next,
    output,
    ok,
    command,
    path,
  });
  const { fs, cwd } = state;

  switch (command) {
    case "":
      return done([]);
    case "help":
      return done(["pwd  ls [-a] [dir]  cd [dir]  cat <file>  mkdir <dir>  touch <file>  whoami  echo <text>  clear"]);
    case "pwd":
      return done([cwd], true, cwd);
    case "whoami":
      return done([USER]);
    case "echo":
      return done([operands.join(" ")]);
    case "clear":
      return { ...done([]), clear: true };
    case "ls": {
      const unknown = flags.find((f) => f !== "-a");
      if (unknown) return done([`ls: invalid option -- '${unknown.slice(1)}'`], false);
      const target = resolve(cwd, operands[0] ?? ".");
      const node = fs[target];
      if (!node) return done([`ls: cannot access '${operands[0]}': No such file or directory`], false);
      if (node.type === "file") return done([baseName(target)], true, target);
      const all = flags.includes("-a");
      const names = children(fs, target)
        .filter((c) => all || !c.name.startsWith("."))
        .map((c) => (c.dir ? `${c.name}/` : c.name));
      return done([(all ? ["./", "../", ...names] : names).join("  ")].filter(Boolean), true, target);
    }
    case "cd": {
      const target = resolve(cwd, operands[0] ?? "~");
      const node = fs[target];
      if (!node) return done([`cd: no such file or directory: ${operands[0]}`], false);
      if (node.type !== "dir") return done([`cd: not a directory: ${operands[0]}`], false);
      return done([], true, target, { fs, cwd: target });
    }
    case "cat": {
      if (!operands[0]) return done(["cat: missing file operand"], false);
      const target = resolve(cwd, operands[0]);
      const node = fs[target];
      if (!node) return done([`cat: ${operands[0]}: No such file or directory`], false);
      if (node.type === "dir") return done([`cat: ${operands[0]}: Is a directory`], false);
      return done(node.content.split("\n"), true, target);
    }
    case "mkdir":
    case "touch": {
      if (!operands[0]) return done([`${command}: missing operand`], false);
      const target = resolve(cwd, operands[0]);
      if (!NAME.test(baseName(target))) return done([`${command}: invalid name '${operands[0]}'`], false);
      if (fs[parent(target)]?.type !== "dir") {
        return done([`${command}: cannot create '${operands[0]}': No such file or directory`], false);
      }
      if (fs[target]) {
        // touch on an existing file is fine; mkdir on anything existing is not.
        if (command === "touch" && fs[target].type === "file") return done([], true, target);
        return done([`${command}: cannot create '${operands[0]}': File exists`], false);
      }
      const node: Node = command === "mkdir" ? { type: "dir" } : { type: "file", content: "" };
      return done([], true, target, { fs: { ...fs, [target]: node }, cwd });
    }
    default:
      return done([`${command}: command not found`], false);
  }
}
