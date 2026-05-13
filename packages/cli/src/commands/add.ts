import path from "node:path";
import { logger } from "../utils/logger";
import { copyFileSafely } from "../utils/fs";
import { destinationRoot, readConfig } from "../utils/paths";
import { rewriteImports, shouldRewrite } from "../utils/rewrite";
import { getRegistryFilesRoot, resolveInstallPlan } from "../registry";
import type { RegistryEntry, StylesheetUiConfig } from "../registry/schema";

export type AddOptions = { yes?: boolean; verbose?: boolean };

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

  await applyRegistryEntries(plan, config, cwd, {
    requested,
    overwrite: opts.yes,
    verbose: opts.verbose,
  });

  logger.success("Done.");
}

export type ApplyOptions = {
  requested?: Set<string>;
  overwrite?: boolean;
  skipIfExists?: boolean;
  // When false, transitive-dep skips are summarized as a single line instead
  // of listed per file. `verbose: true` reverts to per-file output. Default is
  // summarized.
  verbose?: boolean;
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
      // Everything else (explicit installs, conflicts, errors) prints normally.
      const isTransitiveDep = options.requested ? !isRequested : false;
      const silent = isTransitiveDep && !options.verbose;

      const result = await copyFileSafely(from, to, { ...fileOpts, transform, silent });
      if (isTransitiveDep) {
        if (result === "skipped") depSkipCount++;
        else if (result === "added") depAddCount++;
      }
    }
  }

  // Roll up the dep summary so the noisy 10-line "(already exists)" block
  // becomes a single line.
  if (!options.verbose) {
    if (depAddCount > 0) {
      logger.dim(`  ${depAddCount} dependency file${plural(depAddCount)} installed`);
    }
    if (depSkipCount > 0) {
      logger.dim(`  ${depSkipCount} dependency file${plural(depSkipCount)} already present`);
    }
  }
}

function plural(n: number): string {
  return n === 1 ? "" : "s";
}
