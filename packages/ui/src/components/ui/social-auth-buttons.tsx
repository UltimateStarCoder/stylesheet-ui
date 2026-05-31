import { forwardRef, type ReactNode } from "react";
import { Text, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { Button } from "./button";
import { createStyles } from "../../utils/use-styles";

export type SocialProvider = {
  // Stable identifier passed back to `onSelect` — e.g. "oauth_google".
  key: string;
  label: string;
  icon?: ReactNode;
};

// Row of social / SSO provider buttons with an optional "or" divider. The
// consumer wires `onSelect` to their auth provider's OAuth/SSO flow, using the
// provider's `key` to choose which one to start.
export type SocialAuthButtonsProps = Omit<ViewProps, "children" | "style"> & {
  providers: SocialProvider[];
  onSelect: (key: string) => void;
  // Key of the provider currently authenticating, if any.
  loadingKey?: string | null;
  disabled?: boolean;
  // Divider caption (e.g. "or continue with"). Omit to hide the divider.
  dividerLabel?: string;
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
}));

export const SocialAuthButtons = forwardRef<View, SocialAuthButtonsProps>(function SocialAuthButtons(
  { providers, onSelect, loadingKey, disabled = false, dividerLabel, style, ...rest },
  ref,
) {
  const styles = useStyles();
  const busy = loadingKey != null;

  return (
    <View ref={ref} style={[styles.root, style]} {...rest}>
      {!!dividerLabel && (
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerLabel}>{dividerLabel}</Text>
          <View style={styles.line} />
        </View>
      )}
      {providers.map((p) => (
        <Button
          key={p.key}
          variant="secondary"
          fullWidth
          leftIcon={p.icon}
          loading={loadingKey === p.key}
          disabled={disabled || (busy && loadingKey !== p.key)}
          onPress={() => onSelect(p.key)}
        >
          {p.label}
        </Button>
      ))}
    </View>
  );
});
