import fs from "fs-extra";
import path from "node:path";
import type { RegistryType, StylesheetUiConfig } from "../registry/schema";
import { TYPE_TO_PATH_KEY } from "../registry/schema";

const CONFIG_FILE = "stylesheet-ui.json";

export const DEFAULT_CONFIG: StylesheetUiConfig = {
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
  return (await fs.readJson(configPath)) as StylesheetUiConfig;
}

export async function writeConfig(
  config: StylesheetUiConfig,
  cwd: string = process.cwd(),
): Promise<void> {
  await fs.writeJson(getConfigPath(cwd), config, { spaces: 2 });
}

export function destinationRoot(
  config: StylesheetUiConfig,
  type: RegistryType,
  cwd: string = process.cwd(),
): string {
  const key = TYPE_TO_PATH_KEY[type];
  return path.join(cwd, config.paths[key]);
}
