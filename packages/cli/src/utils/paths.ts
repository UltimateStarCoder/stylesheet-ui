import fs from "fs-extra";
import path from "node:path";
import semver from "semver";
import pc from "picocolors";
import type { RegistryType, StylesheetUiConfig } from "../registry/schema";
import { TYPE_TO_PATH_KEY } from "../registry/schema";
import { logger } from "./logger";

const CONFIG_FILE = "stylesheet-ui.json";

// CLI version baked at build time. tsup inlines package.json; bumping this
// is automatic on every publish.
import pkg from "../../package.json";
export const CLI_VERSION = pkg.version;

export const DEFAULT_CONFIG: StylesheetUiConfig = {
  version: CLI_VERSION,
  aliases: {
    components: "@/components/ui",
    theme: "@/theme",
    utils: "@/utils",
  },
  paths: {
    components: "src/components/ui",
    theme: "src/theme",
    utils: "src/utils",
  },
};

export function getConfigPath(cwd: string = process.cwd()): string {
  return path.join(cwd, CONFIG_FILE);
}

export async function readConfig(cwd: string = process.cwd()): Promise<StylesheetUiConfig> {
  const configPath = getConfigPath(cwd);
  if (!(await fs.pathExists(configPath))) {
    throw new Error(
      `No ${CONFIG_FILE} found at ${cwd}. Run \`stylesheet-ui init\` first.`,
    );
  }
  const config = (await fs.readJson(configPath)) as StylesheetUiConfig;
  warnIfStale(config);
  return config;
}

export async function writeConfig(
  config: StylesheetUiConfig,
  cwd: string = process.cwd(),
): Promise<void> {
  // Always stamp the current CLI version on write — even if the caller
  // didn't set it — so future loads have something to compare against.
  const stamped: StylesheetUiConfig = { ...config, version: CLI_VERSION };
  await fs.writeJson(getConfigPath(cwd), stamped, { spaces: 2 });
}

export function destinationRoot(
  config: StylesheetUiConfig,
  type: RegistryType,
  cwd: string = process.cwd(),
): string {
  const key = TYPE_TO_PATH_KEY[type];
  return path.join(cwd, config.paths[key]);
}

function warnIfStale(config: StylesheetUiConfig): void {
  const configured = config.version;
  if (!configured) return;
  // Skip if the field exists but isn't a valid semver (forward-compat).
  if (!semver.valid(configured) || !semver.valid(CLI_VERSION)) return;
  if (semver.lt(configured, CLI_VERSION)) {
    logger.warn(
      `${pc.bold("stylesheet-ui")} v${CLI_VERSION} is newer than the v${configured} that initialized this project. Re-running \`init\` is safe; existing files are preserved.`,
    );
  }
}
