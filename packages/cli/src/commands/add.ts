import path from "node:path";
import { logger } from "../utils/logger";
import { copyFileSafely, type CopyResult } from "../utils/fs";
import { destinationRoot, readConfig } from "../utils/paths";
import { rewriteImports, shouldRewrite } from "../utils/rewrite";
import { getRegistryFilesRoot, resolveInstallPlan } from "../registry";
import type { RegistryEntry, StylesheetUiConfig } from "../registry/schema";

export type AddOptions = {
  yes?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
  diff?: boolean;
};

export async function addCommand(
  components: string[],
  opts: AddOptions = {},
): Promise<void> {
  if (components.length === 0) {
    logger.error("Pass at least one component name. Try: stylesheet-ui add button");
    process.exitCode = 1;
    return;
  }

  const cwd = process.cwd();
  const config = await readConfig(cwd);

  const plan = await resolveInstallPlan(components);
  const requested = new Set(components);

  if (opts.diff) {
    logger.step(`Diffing ${components.join(", ")} against registry source...`);
  } else if (opts.dryRun) {
    logger.step(`Dry-run for ${components.join(", ")} (no files will be written):`);
  }

  await applyRegistryEntries(plan, config, cwd, {
    requested,
    overwrite: opts.yes,
    verbose: opts.verbose,
    dryRun: opts.dryRun,
    diff: opts.diff,
  });

  if (opts.dryRun) {
    logger.dim("Dry run complete. Re-run without --dry-run to write files.");
  } else if (opts.diff) {
    logger.dim("Diff complete. Re-run without --diff to write files.");
  } else {
    logger.success("Done.");
  }
}

export type ApplyOptions = {
  requested?: Set<string>;
  overwrite?: boolean;
  skipIfExists?: boolean;
  // When false (default), transitive-dep results are summarized as a single
  // rollup line instead of listed per file. `verbose: true` reverts to per-file.
  verbose?: boolean;
  // Pass-through to copyFileSafely.
  dryRun?: boolean;
  diff?: boolean;
};

export async function applyRegistryEntries(
  entries: RegistryEntry[],
  config: StylesheetUiConfig,
  cwd: string,
  options: ApplyOptions,
): Promise<void> {
  const filesRoot = getRegistryFilesRoot();
  let depSkipCount = 0;
  let depAddCount = 0;

  for (const entry of entries) {
    const isRequested = options.requested ? options.requested.has(entry.name) : true;

    // Pick file-level options for this entry.
    let fileOpts: { overwrite?: boolean; skipIfExists?: boolean };
    if (options.skipIfExists) {
      fileOpts = { skipIfExists: true };
    } else if (options.requested && !isRequested) {
      fileOpts = { skipIfExists: true };
    } else {
      fileOpts = { overwrite: options.overwrite };
    }

    const destRoot = destinationRoot(config, entry.type, cwd);
    for (const file of entry.files) {
      const from = path.join(filesRoot, file.from);
      const to = path.join(destRoot, file.to);
      const transform = shouldRewrite(file.to)
        ? (content: string) => rewriteImports(content, config.aliases)
        : undefined;

      // Suppress per-file logging for transitive-dep skips unless verbose.
      const isTransitiveDep = options.requested ? !isRequested : false;
      const silent = isTransitiveDep && !options.verbose;

      const result = await copyFileSafely(from, to, {
        ...fileOpts,
        transform,
        silent,
        dryRun: options.dryRun,
        diff: options.diff,
      });

      if (isTransitiveDep) {
        if (isSkipResult(result)) depSkipCount++;
        else if (isAddResult(result)) depAddCount++;
      }
    }
  }

  // Roll up the dep summary. Skipped in --diff mode (the diff IS the output).
  if (!options.verbose && !options.diff) {
    if (depAddCount > 0) {
      const verb = options.dryRun ? "would install" : "installed";
      logger.dim(`  ${depAddCount} dependency file${plural(depAddCount)} ${verb}`);
    }
    if (depSkipCount > 0) {
      const verb = options.dryRun ? "would skip" : "already present";
      logger.dim(`  ${depSkipCount} dependency file${plural(depSkipCount)} ${verb}`);
    }
  }
}

function isSkipResult(r: CopyResult): boolean {
  return r === "skipped" || r === "would-skip";
}

function isAddResult(r: CopyResult): boolean {
  return r === "added" || r === "would-add" || r === "overwritten" || r === "would-overwrite";
}

function plural(n: number): string {
  return n === 1 ? "" : "s";
}
