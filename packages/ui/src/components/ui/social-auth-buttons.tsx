import { forwardRef, type ReactNode } from "react";
import { Text, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { Button } from "./button";
import { createStyles } from "../../utils/use-styles";

export type SocialProvider = {
  // Stable identifier passed back to `onSelect` — e.g. "google".
  key: string;
  label: string;
  icon?: ReactNode;
};

export type SocialAuthLayout = "list" | "row";

// Social / SSO provider buttons with an optional "or" divider. The consumer
// wires `onSelect` to their auth provider's OAuth/SSO flow, using the
// provider's `key` to choose which one to start.
//
// `layout="list"` (default) stacks full-width labelled buttons.
// `layout="row"` lays out compact icon-only buttons on a single line; the
// label becomes each button's accessibility label.
export type SocialAuthButtonsProps = Omit<ViewProps, "children" | "style"> & {
  providers: SocialProvider[];
  onSelect: (key: string) => void;
  // Key of the provider currently authenticating, if any.
  loadingKey?: string | null;
  disabled?: boolean;
  // Divider caption (e.g. "or continue with"). Omit to hide the divider.
  dividerLabel?: string;
  layout?: SocialAuthLayout;
  style?: StyleProp<ViewStyle>;
};

const useStyles = createStyles((t) => ({
  root: { gap: t.spacing.sm },
  divider: { flexDirection: "row", alignItems: "center", gap: t.spacing.sm, marginVertical: t.spacing.xs },
  line: { flex: 1, height: 1, backgroundColor: t.colors.border },
  dividerLabel: {
    color: t.colors.foregroundMuted,
    fontSize: t.typography.fontSize.sm,
    lineHeight: t.typography.lineHeight.sm,
  },
  list: { gap: t.spacing.sm },
  row: { flexDirection: "row", gap: t.spacing.sm },
  rowItem: { flex: 1 },
  // Override Button's content gap so a lone icon (empty label) stays centered.
  iconOnly: { gap: 0 },
}));

export const SocialAuthButtons = forwardRef<View, SocialAuthButtonsProps>(function SocialAuthButtons(
  { providers, onSelect, loadingKey, disabled = false, dividerLabel, layout = "list", style, ...rest },
  ref,
) {
  const styles = useStyles();
  const busy = loadingKey != null;
  const isRow = layout === "row";

  return (
    <View ref={ref} style={[styles.root, style]} {...rest}>
      {!!dividerLabel && (
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerLabel}>{dividerLabel}</Text>
          <View style={styles.line} />
        </View>
      )}
      <View style={isRow ? styles.row : styles.list}>
        {providers.map((p) => {
          const loading = loadingKey === p.key;
          const isDisabled = disabled || (busy && !loading);
          if (isRow) {
            return (
              <View key={p.key} style={styles.rowItem}>
                <Button
                  variant="secondary"
                  fullWidth
                  leftIcon={p.icon}
                  style={styles.iconOnly}
                  accessibilityLabel={p.label}
                  loading={loading}
                  disabled={isDisabled}
                  onPress={() => onSelect(p.key)}
                >
                  {null}
                </Button>
              </View>
            );
          }
          return (
            <Button
              key={p.key}
              variant="secondary"
              fullWidth
              leftIcon={p.icon}
              loading={loading}
              disabled={isDisabled}
              onPress={() => onSelect(p.key)}
            >
              {p.label}
            </Button>
          );
        })}
      </View>
    </View>
  );
});
