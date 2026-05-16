import fs from "fs-extra";
import path from "node:path";
import { logger } from "../utils/logger";
import { destinationRoot, readConfig } from "../utils/paths";
import { listAllEntries, resolveInstallPlan } from "../registry";
import { applyRegistryEntries } from "./add";
import type { RegistryEntry, StylesheetUiConfig } from "../registry/schema";

export type UpdateOptions = {
  yes?: boolean;
  force?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
  diff?: boolean;
};

/**
 * Re-runs the install for components the user has already added.
 *
 * With no arguments, refreshes every component whose files are present on
 * disk. With arguments, refreshes only the named components. Overwrite
 * semantics match `add`: `--yes` preserves locally-edited files, `--force`
 * clobbers them.
 */
export async function updateCommand(
  components: string[],
  opts: UpdateOptions = {},
): Promise<void> {
  if (opts.diff && opts.dryRun) {
    throw new Error("--diff and --dry-run are mutually exclusive. Pick one.");
  }

  const cwd = process.cwd();
  const config = await readConfig(cwd);

  const targets =
    components.length > 0
      ? components
      : await detectInstalledComponents(config, cwd);

  if (targets.length === 0) {
    logger.warn("No installed components detected. Run `stylesheet-ui add <name>` first.");
    return;
  }

  logger.step(`Updating ${targets.join(", ")}...`);

  const plan = await resolveInstallPlan(targets);
  const requested = new Set(targets);

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

// Scans the registry, returning entry names whose first file already exists at
// its configured destination — i.e., the user has added them previously.
async function detectInstalledComponents(
  config: StylesheetUiConfig,
  cwd: string,
): Promise<string[]> {
  const all = await listAllEntries();
  const installed: string[] = [];
  for (const entry of all) {
    if (await isInstalled(entry, config, cwd)) {
      installed.push(entry.name);
    }
  }
  return installed;
}

async function isInstalled(
  entry: RegistryEntry,
  config: StylesheetUiConfig,
  cwd: string,
): Promise<boolean> {
  const destRoot = destinationRoot(config, entry.type, cwd);
  for (const file of entry.files) {
    if (await fs.pathExists(path.join(destRoot, file.to))) return true;
  }
  return false;
}
