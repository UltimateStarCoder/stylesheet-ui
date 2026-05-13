import { useContext } from "react";
import { ThemeContext, type Scheme, type SchemeOverride } from "./theme-provider";

export type UseThemeMode = {
  scheme: Scheme;
  override: SchemeOverride;
  setScheme: (override: SchemeOverride) => void;
  isDark: boolean;
};

// Hook for components that need to read or change the active scheme — e.g.
// a Light / Dark / System toggle. For styling, use useTheme() instead.
export function useThemeMode(): UseThemeMode {
  const ctx = useContext(ThemeContext);
  return {
    scheme: ctx.scheme,
    override: ctx.override,
    setScheme: ctx.setScheme,
    isDark: ctx.scheme === "dark",
  };
}
