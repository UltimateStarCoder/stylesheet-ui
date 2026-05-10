import { createContext, useMemo, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme, type Theme } from "./tokens";

export const ThemeContext = createContext<Theme>(lightTheme);

export type ThemeProviderProps = {
  children: ReactNode;
  forceScheme?: "light" | "dark";
};

export function ThemeProvider({ children, forceScheme }: ThemeProviderProps) {
  const system = useColorScheme();
  const scheme = forceScheme ?? (system === "dark" ? "dark" : "light");
  const theme = useMemo(
    () => (scheme === "dark" ? darkTheme : lightTheme),
    [scheme],
  );
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
