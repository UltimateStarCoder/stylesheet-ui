import path from "node:path";
import fs from "fs-extra";
import prompts from "prompts";
import pc from "picocolors";
import { logger } from "../utils/logger";
import { DEFAULT_CONFIG, getConfigPath, writeConfig } from "../utils/paths";
import type { StylesheetUiConfig } from "../registry/schema";
import { applyRegistryEntries } from "./add";
import { resolveInstallPlan } from "../registry";

export type InitOptions = { yes?: boolean };

export async function initCommand(opts: InitOptions = {}): Promise<void> {
  const cwd = process.cwd();
  const configPath = getConfigPath(cwd);

  if (await fs.pathExists(configPath)) {
    logger.warn(`${path.basename(configPath)} already exists at ${cwd}.`);
    if (!opts.yes) {
      const { proceed } = await prompts({
        type: "confirm",
        name: "proceed",
        message: "Re-run init and overwrite?",
        initial: false,
      });
      if (!proceed) {
        logger.dim("Aborted.");
        return;
      }
    }
  }

  let config: StylesheetUiConfig = DEFAULT_CONFIG;

  if (!opts.yes) {
    const answers = await prompts([
      {
        type: "text",
        name: "componentsPath",
        message: "Where should components live?",
        initial: DEFAULT_CONFIG.paths.components,
      },
      {
        type: "text",
        name: "themePath",
        message: "Where should theme tokens live?",
        initial: DEFAULT_CONFIG.paths.theme,
      },
      {
        type: "text",
        name: "utilsPath",
        message: "Where should utils live?",
        initial: DEFAULT_CONFIG.paths.utils,
      },
    ]);

    if (!answers.componentsPath || !answers.themePath || !answers.utilsPath) {
      logger.dim("Cancelled.");
      return;
    }

    config = {
      aliases: { ...DEFAULT_CONFIG.aliases },
      paths: {
        components: answers.componentsPath,
        theme:      answers.themePath,
        utils:      answers.utilsPath,
      },
    };
  }

  await writeConfig(config, cwd);
  logger.success(`Wrote ${path.basename(configPath)}.`);

  logger.step("Installing foundation (theme + utils)...");
  const plan = await resolveInstallPlan(["theme", "utils"]);
  await applyRegistryEntries(plan, config, cwd, { skipIfExists: true });

  console.log("");
  logger.success("stylesheet-ui is ready.");
  logger.dim("Next steps:");
  logger.dim(`  1. Wrap your app in <${pc.cyan("ThemeProvider")}> from ${pc.cyan(config.paths.theme)}.`);
  logger.dim(`  2. Run ${pc.cyan("npx stylesheet-ui list")} to see what's available.`);
  logger.dim(`  3. Run ${pc.cyan("npx stylesheet-ui add button")} to add your first component.`);
}
