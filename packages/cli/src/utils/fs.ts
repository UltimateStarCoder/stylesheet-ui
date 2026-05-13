import fs from "fs-extra";
import path from "node:path";
import prompts from "prompts";
import pc from "picocolors";
import { logger } from "./logger";
import { unifiedDiff } from "./diff";

export type CopyOptions = {
  skipIfExists?: boolean;
  overwrite?: boolean;
  transform?: (content: string) => string;
  // Suppress per-file log output (used by transitive-dep rollup).
  silent?: boolean;
  // Print intent without writing anything. Logs:
  //   "would write: <path>" for new files
  //   "would overwrite: <path>" for existing files
  //   "would skip: <path>" when skipIfExists is set
  dryRun?: boolean;
  // When set + target exists, print a unified diff between current and
  // proposed content. Implies a no-op write (the diff IS the output).
  diff?: boolean;
};

export type CopyResult =
  | "added"
  | "skipped"
  | "overwritten"
  | "would-add"
  | "would-overwrite"
  | "would-skip"
  | "diffed";

// Copies a single file. Returns what happened (or what *would* happen in
// dry-run/diff mode). Honors the same prompt/skip semantics in normal mode.
export async function copyFileSafely(
  from: string,
  to: string,
  options: CopyOptions = {},
): Promise<CopyResult> {
  const exists = await fs.pathExists(to);

  // --diff mode: print the diff (or note that the file would be new) and
  // return without writing. Diff implies a "preview" — same vibe as dry-run
  // but with content awareness for files that already exist.
  if (options.diff) {
    if (!exists) {
      if (!options.silent) logger.dim(`new file: ${to}`);
      return "would-add";
    }
    const current = await fs.readFile(to, "utf8");
    const proposed = options.transform
      ? options.transform(await fs.readFile(from, "utf8"))
      : await fs.readFile(from, "utf8");
    if (current === proposed) {
      if (!options.silent) logger.dim(`unchanged: ${to}`);
      return "would-skip";
    }
    if (!options.silent) {
      console.log("");
      console.log(pc.bold(to));
      console.log(unifiedDiff(current, proposed));
    }
    return "diffed";
  }

  // --dry-run mode: log the intent without writing.
  if (options.dryRun) {
    if (exists) {
      if (options.skipIfExists) {
        if (!options.silent) logger.dim(`would skip: ${to}`);
        return "would-skip";
      }
      if (!options.silent) logger.dim(`would overwrite: ${to}`);
      return "would-overwrite";
    }
    if (!options.silent) logger.dim(`would write: ${to}`);
    return "would-add";
  }

  // Normal mode.
  await fs.ensureDir(path.dirname(to));

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
