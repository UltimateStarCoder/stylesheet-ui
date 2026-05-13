import { StyleSheet } from "react-native";
import { useTheme } from "../theme/use-theme";
import type { Scheme } from "../theme/theme-provider";
import type { Theme } from "../theme/tokens";

// Builds a theme-aware StyleSheet once per scheme (light/dark) and caches it.
// Call at module scope: `const useStyles = createStyles((t) => ({...}))`.
// Then inside your component: `const styles = useStyles()`.
//
// Why this shape: the builder closure must run at module scope so it doesn't
// re-allocate every render. The returned hook reads the active theme via
// useTheme() and returns the cached StyleSheet for that scheme.
export function createStyles<T extends StyleSheet.NamedStyles<T>>(
  build: (theme: Theme) => T,
): () => T {
  const cache = new Map<Scheme, T>();

  return function useStyles(): T {
    const theme = useTheme();
    let entry = cache.get(theme.scheme);
    if (!entry) {
      entry = StyleSheet.create(build(theme));
      cache.set(theme.scheme, entry);
    }
    return entry;
  };
}
