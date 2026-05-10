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

  await applyRegistryEntries(plan, config, cwd, { overwrite: opts.yes });

  logger.success("Done.");
}

export type ApplyOptions = {
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
    const destRoot = destinationRoot(config, entry.type, cwd);
    for (const file of entry.files) {
      const from = path.join(filesRoot, file.from);
      const to = path.join(destRoot, file.to);
      await copyFileSafely(from, to, options);
    }
  }
}
