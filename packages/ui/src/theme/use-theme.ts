import { useContext } from "react";
import { ThemeContext } from "./theme-provider";

export function useTheme() {
  return useContext(ThemeContext);
}
