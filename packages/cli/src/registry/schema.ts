export type RegistryType = "theme" | "util" | "component";

export type RegistryFile = {
  from: string;
  to: string;
};

export type RegistryEntry = {
  name: string;
  type: RegistryType;
  description?: string;
  /** Other entries that must be installed alongside this one. */
  registryDependencies?: string[];
  /**
   * npm packages the consumer must already have installed for this component
   * to run. Keyed by package name, valued by a semver range. `react` and
   * `react-native` are implicit and never need to be listed.
   */
  peerDependencies?: Record<string, string>;
  files: RegistryFile[];
};

export type StylesheetUiConfig = {
  // CLI version that wrote this config. Used to warn on drift when an older
  // config encounters a newer CLI.
  version?: string;
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
