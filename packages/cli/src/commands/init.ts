import path from "node:path";
import fs from "fs-extra";
import prompts from "prompts";
import pc from "picocolors";
import { logger } from "../utils/logger";
import { DEFAULT_CONFIG, getConfigPath, writeConfig } from "../utils/paths";
import type { RegistryEntry, StylesheetUiConfig } from "../registry/schema";
import { applyRegistryEntries } from "./add";
import { resolveInstallPlan } from "../registry";

export const THEME_PRESETS = ["mono", "blue", "green", "violet", "rose"] as const;
export type ThemePreset = (typeof THEME_PRESETS)[number];
export const DEFAULT_PRESET: ThemePreset = "mono";

const PRESET_DESCRIPTIONS: Record<ThemePreset, string> = {
  mono:   "Black / white accent (default)",
  blue:   "Standard product blue",
  green:  "Linear-style green",
  violet: "Vibrant purple",
  rose:   "Bold rose-red",
};

export type InitOptions = { yes?: boolean; preset?: string };

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
  let preset: ThemePreset = resolvePresetFlag(opts.preset);

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
      {
        type: opts.preset ? null : "select",
        name: "preset",
        message: "Pick a theme:",
        initial: THEME_PRESETS.indexOf(preset),
        choices: THEME_PRESETS.map((name) => ({
          title: name,
          description: PRESET_DESCRIPTIONS[name],
          value: name,
        })),
      },
    ]);

    if (!answers.componentsPath || !answers.themePath || !answers.utilsPath) {
      logger.dim("Cancelled.");
      return;
    }

    if (!opts.preset) {
      if (!answers.preset) {
        logger.dim("Cancelled.");
        return;
      }
      preset = answers.preset as ThemePreset;
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

  logger.step(`Installing foundation (theme: ${pc.cyan(preset)} + utils)...`);
  const plan = await resolveInstallPlan(["theme", "utils"]);
  applyPresetToPlan(plan, preset);
  await applyRegistryEntries(plan, config, cwd, { skipIfExists: true });

  console.log("");
  logger.success("stylesheet-ui is ready.");
  logger.dim("Next steps:");
  logger.dim(`  1. Wrap your app in <${pc.cyan("ThemeProvider")}> from ${pc.cyan(config.paths.theme)}.`);
  logger.dim(`  2. Run ${pc.cyan("npx stylesheet-ui list")} to see what's available.`);
  logger.dim(`  3. Run ${pc.cyan("npx stylesheet-ui add button")} to add your first component.`);
}

function resolvePresetFlag(value: string | undefined): ThemePreset {
  if (!value) return DEFAULT_PRESET;
  if ((THEME_PRESETS as readonly string[]).includes(value)) {
    return value as ThemePreset;
  }
  throw new Error(
    `Unknown theme preset "${value}". Available: ${THEME_PRESETS.join(", ")}.`,
  );
}

// Swap the theme entry's colors.ts source to the chosen preset file. The
// manifest's `from` defaults to presets/mono.ts; only non-mono picks need a swap.
function applyPresetToPlan(plan: RegistryEntry[], preset: ThemePreset): void {
  if (preset === DEFAULT_PRESET) return;
  for (const entry of plan) {
    if (entry.type !== "theme") continue;
    for (const file of entry.files) {
      if (file.to === "colors.ts") {
        file.from = `theme/presets/${preset}.ts`;
      }
    }
  }
}
