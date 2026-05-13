import fs from "fs-extra";
import path from "node:path";
import prompts from "prompts";
import { logger } from "./logger";

export type CopyOptions = {
  skipIfExists?: boolean;
  overwrite?: boolean;
  transform?: (content: string) => string;
  // Suppress per-file log output. The caller usually wants this for
  // transitive-dep skips that get summarized in a rollup line.
  silent?: boolean;
};

// Copies a single file. Returns "added" | "skipped" | "overwritten".
export async function copyFileSafely(
  from: string,
  to: string,
  options: CopyOptions = {},
): Promise<"added" | "skipped" | "overwritten"> {
  await fs.ensureDir(path.dirname(to));
  const exists = await fs.pathExists(to);

  if (exists) {
    if (options.skipIfExists) {
      if (!options.silent) logger.skipped(to);
      return "skipped";
    }
    if (!options.overwrite) {
      const { confirm } = await prompts({
        type: "confirm",
        name: "confirm",
        message: `${to} already exists. Overwrite?`,
        initial: false,
      });
      if (!confirm) {
        if (!options.silent) logger.skipped(to);
        return "skipped";
      }
    }
    await writeWithOptionalTransform(from, to, options.transform);
    if (!options.silent) logger.added(to + " (overwritten)");
    return "overwritten";
  }

  await writeWithOptionalTransform(from, to, options.transform);
  if (!options.silent) logger.added(to);
  return "added";
}

async function writeWithOptionalTransform(
  from: string,
  to: string,
  transform?: (content: string) => string,
): Promise<void> {
  if (transform) {
    const content = await fs.readFile(from, "utf8");
    await fs.writeFile(to, transform(content), "utf8");
    return;
  }
  await fs.copy(from, to, { overwrite: true });
}
