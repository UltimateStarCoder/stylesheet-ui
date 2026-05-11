import fs from "fs-extra";
import path from "node:path";
import prompts from "prompts";
import { logger } from "./logger";

export type CopyOptions = {
  skipIfExists?: boolean;
  overwrite?: boolean;
  transform?: (content: string) => string;
};

// Copies a single file. Returns "added" | "skipped" | "overwritten".
// If `transform` is provided, reads source as UTF-8, transforms, writes string.
// Otherwise streams via fs.copy (safe for binary).
export async function copyFileSafely(
  from: string,
  to: string,
  options: CopyOptions = {},
): Promise<"added" | "skipped" | "overwritten"> {
  await fs.ensureDir(path.dirname(to));
  const exists = await fs.pathExists(to);

  if (exists) {
    if (options.skipIfExists) {
      logger.skipped(to);
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
        logger.skipped(to);
        return "skipped";
      }
    }
    await writeWithOptionalTransform(from, to, options.transform);
    logger.added(to + " (overwritten)");
    return "overwritten";
  }

  await writeWithOptionalTransform(from, to, options.transform);
  logger.added(to);
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
