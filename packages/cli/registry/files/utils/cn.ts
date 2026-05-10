import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "../theme/use-theme";
import type { Theme } from "../theme/tokens";

export function useStyles<T extends StyleSheet.NamedStyles<T>>(
  build: (theme: Theme) => T,
): T {
  const theme = useTheme();
  return useMemo(() => StyleSheet.create(build(theme)), [theme, build]);
}
