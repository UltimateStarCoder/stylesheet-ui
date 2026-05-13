import { useContext } from "react";
import { ThemeContext } from "./theme-provider";

// Returns the active Theme tokens. This is the hook used in styles.
// For mode control (Light / Dark / System toggles), use useThemeMode().
export function useTheme() {
  return useContext(ThemeContext).theme;
}
