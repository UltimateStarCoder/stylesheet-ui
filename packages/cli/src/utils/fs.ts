import fs from "fs-extra";
import path from "node:path";
import prompts from "prompts";
import pc from "picocolors";
import { logger } from "./logger";
import { unifiedDiff } from "./diff";

export type CopyOptions = {
  skipIfExists?: boolean;
  /**
   * `--yes`: skip prompts but only overwrite files matching the registry's
   * pristine content. Locally-modified files are preserved.
   */
  yes?: boolean;
  /** `--force`: overwrite unconditionally, including locally-modified files. */
  force?: boolean;
  transform?: (content: string) => string;
  /** Suppress per-file log output (used by the transitive-dep rollup). */
  silent?: boolean;
  /** Print intent without touching the filesystem. */
  dryRun?: boolean;
  /**
   * When the target exists, print a unified diff between current and proposed
   * content instead of writing. Implies a no-op — the diff is the output.
   */
  diff?: boolean;
};

// `preserved` / `would-preserve`: target exists with local edits and the user
// has not passed --force, so the existing file stays put.
export type CopyResult =
  | "added"
  | "skipped"
  | "preserved"
  | "overwritten"
  | "would-add"
  | "would-overwrite"
  | "would-skip"
  | "would-preserve"
  | "diffed";

// Copy a single registry file into the consumer's project.
//
// Overwrite policy, in order of precedence:
//   skipIfExists    never overwrites; used for transitive deps already on disk
//   --force         overwrites unconditionally
//   --yes           overwrites pristine files; preserves locally-edited files
//   (no flags)      prompts interactively
export async function copyFileSafely(
  from: string,
  to: string,
  options: CopyOptions = {},
): Promise<CopyResult> {
  const exists = await fs.pathExists(to);

  const readProposed = async (): Promise<string> => {
    const raw = await fs.readFile(from, "utf8");
    return options.transform ? options.transform(raw) : raw;
  };

  // --diff mode: print the diff (or note that the file would be new) and
  // return without writing. Diff implies a "preview" — same vibe as dry-run
  // but with content awareness for files that already exist.
  if (options.diff) {
    if (!exists) {
      if (!options.silent) logger.dim(`new file: ${to}`);
      return "would-add";
    }
    const current = await fs.readFile(to, "utf8");
    const proposed = await readProposed();
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
      if (options.force) {
        if (!options.silent) logger.dim(`would overwrite (forced): ${to}`);
        return "would-overwrite";
      }
      if (options.yes) {
        const modified = await hasLocalEdits(to, await readProposed());
        if (modified) {
          if (!options.silent) logger.dim(`would preserve (locally modified): ${to}`);
          return "would-preserve";
        }
        if (!options.silent) logger.dim(`would overwrite: ${to}`);
        return "would-overwrite";
      }
      if (!options.silent) logger.dim(`would prompt to overwrite: ${to}`);
      return "would-overwrite";
    }
    if (!options.silent) logger.dim(`would write: ${to}`);
    return "would-add";
  }

  await fs.ensureDir(path.dirname(to));

  if (exists) {
    if (options.skipIfExists) {
      if (!options.silent) logger.skipped(to);
      return "skipped";
    }

    if (!options.force) {
      // Both --yes and the interactive path branch on whether the file is
      // pristine vs. locally modified, so compute the proposed content once.
      const proposed = await readProposed();
      const modified = await hasLocalEdits(to, proposed);

      if (options.yes) {
        if (modified) {
          if (!options.silent) logger.warn(`preserved (locally modified): ${to} — re-run with --force to overwrite`);
          return "preserved";
        }
        await fs.writeFile(to, proposed, "utf8");
        if (!options.silent) logger.added(to + " (overwritten)");
        return "overwritten";
      }

      const message = modified
        ? `${to} exists with local edits. Overwrite?`
        : `${to} already exists. Overwrite?`;
      const { confirm } = await prompts({
        type: "confirm",
        name: "confirm",
        message,
        initial: false,
      });
      if (!confirm) {
        if (!options.silent) {
          if (modified) logger.skipped(to + " (preserved local edits)");
          else logger.skipped(to);
        }
        return modified ? "preserved" : "skipped";
      }
      await fs.writeFile(to, proposed, "utf8");
      if (!options.silent) logger.added(to + " (overwritten)");
      return "overwritten";
    }

    await writeWithOptionalTransform(from, to, options.transform);
    if (!options.silent) logger.added(to + " (overwritten)");
    return "overwritten";
  }

  await writeWithOptionalTransform(from, to, options.transform);
  if (!options.silent) logger.added(to);
  return "added";
}

// Detects drift between the on-disk file and what the registry would write.
// Any difference — user edits or version drift from an older registry — counts
// as a local edit, so `--yes` defaults to preserving the file.
async function hasLocalEdits(target: string, proposed: string): Promise<boolean> {
  const current = await fs.readFile(target, "utf8");
  return current !== proposed;
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
