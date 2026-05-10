import fs from "fs-extra";
import path from "node:path";

// Copies packages/ui/src/{theme,components,utils} into
// packages/cli/registry/files/{theme,components,utils} so the CLI ships a
// snapshot of the library source. Run before `npm run build`.

const CLI_ROOT = path.resolve(__dirname, "..");
const UI_SRC = path.resolve(CLI_ROOT, "..", "ui", "src");
const FILES_ROOT = path.join(CLI_ROOT, "registry", "files");

const SECTIONS = ["theme", "components", "utils"] as const;

async function main() {
  for (const section of SECTIONS) {
    const from = path.join(UI_SRC, section);
    const to = path.join(FILES_ROOT, section);
    if (!(await fs.pathExists(from))) {
      throw new Error(`Source dir not found: ${from}`);
    }
    await fs.emptyDir(to);
    await fs.copy(from, to);
    console.log(`✓ synced ${section}`);
  }
  console.log("Registry sync complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
