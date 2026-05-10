import fs from "fs-extra";
import path from "node:path";
import prompts from "prompts";
import { logger } from "./logger";

export type CopyOptions = {
  skipIfExists?: boolean;
  overwrite?: boolean;
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
    await fs.copy(from, to, { overwrite: true });
    logger.added(to + " (overwritten)");
    return "overwritten";
  }

  await fs.copy(from, to);
  logger.added(to);
  return "added";
}
