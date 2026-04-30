import archiver from "archiver";
import { createWriteStream, mkdirSync, readdirSync, rmSync } from "node:fs";

const SRC = "agent-skills/skills";
const OUT = "dist/skills";

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

for (const entry of readdirSync(SRC, { withFileTypes: true })) {
  if (!entry.isDirectory()) {
    continue;
  }

  const name = entry.name;
  const zip = archiver("zip");

  zip.pipe(createWriteStream(`${OUT}/${name}.zip`));
  zip.directory(`${SRC}/${name}/`, name);

  await zip.finalize();
  console.log(`wrote ${OUT}/${name}.zip`);
}
