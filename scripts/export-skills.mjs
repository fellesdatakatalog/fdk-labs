#!/usr/bin/env node
// Bundles each skill in agent-skills/skills/ into a ZIP that can be uploaded
// to claude.ai via Customize → Skills → +. Run via `yarn skills:export`.
import archiver from "archiver";
import { createWriteStream } from "node:fs";
import { mkdir, readdir, rm } from "node:fs/promises";
import { pipeline } from "node:stream/promises";

const SKILLS = "agent-skills/skills";
const OUT = "dist/skills";

// Wipe the output dir so renamed/removed skills don't leave stale zips behind.
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const names = (await readdir(SKILLS, { withFileTypes: true }))
  .filter((e) => e.isDirectory()).map((e) => e.name).sort();

for (const name of names) {
  const archive = archiver("zip", { zlib: { level: 9 } });
  // Second arg nests files under `{name}/` inside the ZIP — claude.ai requires
  // the folder name to match the skill's frontmatter `name`.
  archive.directory(`${SKILLS}/${name}`, name);
  archive.finalize();
  await pipeline(archive, createWriteStream(`${OUT}/${name}.zip`));
  console.log(`  exported  ${name}`);
}

console.log(`\n${names.length} skills exported → ${OUT}`);
