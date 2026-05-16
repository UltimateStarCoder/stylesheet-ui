import path from "node:path";
import fs from "fs-extra";
import { logger } from "../utils/logger";
import { copyFileSafely, type CopyResult } from "../utils/fs";
import { destinationRoot, readConfig } from "../utils/paths";
import { rewriteImports, shouldRewrite } from "../utils/rewrite";
import { getRegistryFilesRoot, resolveInstallPlan } from "../registry";
import type { RegistryEntry, StylesheetUiConfig } from "../registry/schema";

export type AddOptions = {
  yes?: boolean;
  force?: boolean;
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

  if (!opts.dryRun && !opts.diff) {
    await warnMissingPeers(plan, cwd);
  }

  if (opts.diff) {
    logger.step(`Diffing ${components.join(", ")} against registry source...`);
  } else if (opts.dryRun) {
    logger.step(`Dry-run for ${components.join(", ")} (no files will be written):`);
  }

  await applyRegistryEntries(plan, config, cwd, {
    requested,
    yes: opts.yes,
    force: opts.force,
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
  /** Names the user typed on the CLI; everything else is a transitive dep. */
  requested?: Set<string>;
  /** Skip prompts; preserve files with local edits. */
  yes?: boolean;
  /** Overwrite even files with local edits. */
  force?: boolean;
  skipIfExists?: boolean;
  /**
   * Default `false` rolls transitive-dep file results into a single summary
   * line. `true` emits per-file logs.
   */
  verbose?: boolean;
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

    // Transitive deps that already exist always keep their on-disk version;
    // only entries the user explicitly named are eligible for overwrite.
    let fileOpts: { yes?: boolean; force?: boolean; skipIfExists?: boolean };
    if (options.skipIfExists || (options.requested && !isRequested)) {
      fileOpts = { skipIfExists: true };
    } else {
      fileOpts = { yes: options.yes, force: options.force };
    }

    const destRoot = destinationRoot(config, entry.type, cwd);
    for (const file of entry.files) {
      const from = path.join(filesRoot, file.from);
      const to = path.join(destRoot, file.to);
      const transform = shouldRewrite(file.to)
        ? (content: string) => rewriteImports(content, config.aliases)
        : undefined;

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

  // The diff output already shows every changed line, so the rollup is noise.
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

// Reads the consumer's package.json and warns about any npm peers the install
// plan declares that are not already installed. Non-fatal — the user may have
// a non-standard setup, and we would rather warn than block.
async function warnMissingPeers(plan: RegistryEntry[], cwd: string): Promise<void> {
  const pkgPath = path.join(cwd, "package.json");
  if (!(await fs.pathExists(pkgPath))) return;

  let installed: Record<string, string>;
  try {
    const pkg = await fs.readJson(pkgPath);
    installed = {
      ...(pkg.dependencies ?? {}),
      ...(pkg.devDependencies ?? {}),
      ...(pkg.peerDependencies ?? {}),
    };
  } catch {
    return;
  }

  const missing = new Map<string, { range: string; neededBy: string[] }>();
  for (const entry of plan) {
    const peers = entry.peerDependencies;
    if (!peers) continue;
    for (const [name, range] of Object.entries(peers)) {
      if (installed[name]) continue;
      const slot = missing.get(name);
      if (slot) slot.neededBy.push(entry.name);
      else missing.set(name, { range, neededBy: [entry.name] });
    }
  }

  if (missing.size === 0) return;

  logger.warn("Missing peer dependencies:");
  for (const [name, { range, neededBy }] of missing) {
    logger.dim(`  ${name}@${range}  (needed by ${neededBy.join(", ")})`);
  }
  logger.dim("Install them before running your app.");
}
