import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme, type Theme } from "./tokens";

export type Scheme = "light" | "dark";
export type SchemeOverride = Scheme | "system";

export type ThemeContextValue = {
  // The currently-active theme tokens. Use via useTheme().
  theme: Theme;
  // The resolved scheme that's actually rendering.
  scheme: Scheme;
  // The user's stated override; "system" means follow OS.
  override: SchemeOverride;
  // Change the override. Useful for in-app Light/Dark/System toggles.
  setScheme: (override: SchemeOverride) => void;
};

export const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  scheme: "light",
  override: "system",
  setScheme: () => {},
});

export type ThemeProviderProps = {
  children: ReactNode;
  // Initial override at mount. Defaults to "system" — follow the OS.
  defaultScheme?: SchemeOverride;
  // Optional persistence hook. Receives every override change so consumers
  // can write it to AsyncStorage / MMKV / etc. without coupling the library
  // to a specific storage layer.
  onOverrideChange?: (override: SchemeOverride) => void;
};

export function ThemeProvider({
  children,
  defaultScheme = "system",
  onOverrideChange,
}: ThemeProviderProps) {
  const system = useColorScheme();
  const [override, setOverride] = useState<SchemeOverride>(defaultScheme);

  const setScheme = useCallback(
    (next: SchemeOverride) => {
      setOverride(next);
      onOverrideChange?.(next);
    },
    [onOverrideChange],
  );

  const scheme: Scheme =
    override === "system" ? (system === "dark" ? "dark" : "light") : override;

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: scheme === "dark" ? darkTheme : lightTheme,
      scheme,
      override,
      setScheme,
    }),
    [scheme, override, setScheme],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
