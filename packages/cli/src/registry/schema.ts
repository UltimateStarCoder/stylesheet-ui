export type RegistryType = "theme" | "util" | "component";

export type RegistryFile = {
  from: string;
  to: string;
};

export type RegistryEntry = {
  name: string;
  type: RegistryType;
  registryDependencies?: string[];
  files: RegistryFile[];
};

export type StylesheetUiConfig = {
  aliases: {
    components: string;
    theme: string;
    utils: string;
  };
  paths: {
    components: string;
    theme: string;
    utils: string;
  };
};

export const TYPE_TO_PATH_KEY: Record<RegistryType, keyof StylesheetUiConfig["paths"]> = {
  theme: "theme",
  util: "utils",
  component: "components",
};
