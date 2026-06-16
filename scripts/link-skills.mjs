// Make the installed skills track this repo via real symlinks, so edits and
// `git pull` go live without re-running `yarn skills:add`.
//
// The `skills` CLI installs by *copying* each skill into a shared agent store
// (~/.agents/skills/<name>) and symlinking every agent tool's dir
// (~/.claude/skills/<name>, etc.) to that store. The copy is the part that goes
// stale. This script replaces each store entry with a symlink into the repo, so
// the existing agent-dir symlinks resolve straight through to the source.
//
// `yarn skills:add` runs this automatically as its final step, so a fresh install ends up linked
// to the repo. Run `yarn skills:link` on its own to re-establish the symlinks at any time.

import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import {
  lstatSync,
  mkdirSync,
  readdirSync,
  readlinkSync,
  rmSync,
  symlinkSync,
} from "node:fs";

const REPO_SKILLS = resolve("agent-skills/skills");
const STORE = join(homedir(), ".agents", "skills");
const CLAUDE = join(homedir(), ".claude", "skills");

mkdirSync(STORE, { recursive: true });
mkdirSync(CLAUDE, { recursive: true });

// Point `linkPath` at `target` (absolute). Returns "ok" if already correct,
// "linked" if newly created, "relinked" if an existing copy/link was replaced.
function linkTo(target, linkPath) {
  const want = resolve(target);
  try {
    const stat = lstatSync(linkPath);
    if (
      stat.isSymbolicLink() &&
      resolve(dirname(linkPath), readlinkSync(linkPath)) === want
    ) {
      return "ok";
    }
    rmSync(linkPath, { recursive: true, force: true });
    symlinkSync(want, linkPath, "dir");
    return "relinked";
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
    symlinkSync(want, linkPath, "dir");
    return "linked";
  }
}

const counts = { ok: 0, linked: 0, relinked: 0, failed: 0 };

for (const entry of readdirSync(REPO_SKILLS, { withFileTypes: true })) {
  if (!entry.isDirectory()) {
    continue;
  }

  const name = entry.name;
  try {
    // Store entry -> repo source; agent dir -> store entry (created if missing).
    const store = linkTo(join(REPO_SKILLS, name), join(STORE, name));
    const claude = linkTo(join(STORE, name), join(CLAUDE, name));
    const status = [store, claude].includes("relinked")
      ? "relinked"
      : [store, claude].includes("linked")
        ? "linked"
        : "ok";
    counts[status]++;
    console.log(`${status.padEnd(8)} ${name}`);
  } catch (error) {
    counts.failed++;
    console.error(`failed   ${name}: ${error.message}`);
    if (error.code === "EPERM") {
      console.error(
        "  On Windows, enable Developer Mode or run elevated for symlink support.",
      );
    }
  }
}

console.log(
  `\n${counts.linked} linked, ${counts.relinked} relinked, ${counts.ok} already linked` +
    (counts.failed ? `, ${counts.failed} failed` : "") +
    ".",
);
console.log(`Skills now track ${REPO_SKILLS}.`);
console.log("Open a new session to load changes; `git pull` is enough thereafter.");
