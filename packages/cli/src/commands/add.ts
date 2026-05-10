import path from "node:path";
import { logger } from "../utils/logger";
import { copyFileSafely } from "../utils/fs";
import { destinationRoot, readConfig } from "../utils/paths";
import { getRegistryFilesRoot, resolveInstallPlan } from "../registry";
import type { RegistryEntry, StylesheetUiConfig } from "../registry/schema";

export type AddOptions = { yes?: boolean };

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
  logger.step(
    `Installing ${plan.map((e) => e.name).join(", ")}` +
      (plan.length > components.length ? " (incl. dependencies)" : ""),
  );

  // Only the names the user typed get overwrite-on-conflict behavior.
  // Transitive deps are skip-if-exists — adding `button` shouldn't rewrite
  // a theme the user has already customized.
  const requested = new Set(components);

  await applyRegistryEntries(plan, config, cwd, {
    requested,
    overwrite: opts.yes,
  });

  logger.success("Done.");
}

export type ApplyOptions = {
  // If provided, names in this set get overwrite/prompt; everyone else skips.
  // Omit to apply the same options to every entry (used by init).
  requested?: Set<string>;
  overwrite?: boolean;
  skipIfExists?: boolean;
};

export async function applyRegistryEntries(
  entries: RegistryEntry[],
  config: StylesheetUiConfig,
  cwd: string,
  options: ApplyOptions,
): Promise<void> {
  const filesRoot = getRegistryFilesRoot();

  for (const entry of entries) {
    let fileOpts: { overwrite?: boolean; skipIfExists?: boolean };
    if (options.skipIfExists) {
      fileOpts = { skipIfExists: true };
    } else if (options.requested && !options.requested.has(entry.name)) {
      fileOpts = { skipIfExists: true };
    } else {
      fileOpts = { overwrite: options.overwrite };
    }

    const destRoot = destinationRoot(config, entry.type, cwd);
    for (const file of entry.files) {
      const from = path.join(filesRoot, file.from);
      const to = path.join(destRoot, file.to);
      await copyFileSafely(from, to, fileOpts);
    }
  }
}
