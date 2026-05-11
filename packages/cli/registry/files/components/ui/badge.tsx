import { forwardRef, type ReactNode } from "react";
import { Text, View, type StyleProp, type ViewStyle } from "react-native";
import { useStyles } from "../../utils/cn";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "destructive"
  | "outline";
export type BadgeSize = "sm" | "md";

export type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: StyleProp<ViewStyle>;
};

export const Badge = forwardRef<View, BadgeProps>(function Badge(
  { children, variant = "primary", size = "md", style },
  ref,
) {
  const styles = useStyles((t) => ({
    base: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      borderRadius: t.radius.full,
      borderWidth: 1,
      borderColor: "transparent",
    },
    sm: { paddingVertical: 2, paddingHorizontal: t.spacing.sm },
    md: { paddingVertical: t.spacing.xs, paddingHorizontal: t.spacing.md },

    primary:     { backgroundColor: t.colors.primaryMuted },
    secondary:   { backgroundColor: t.colors.surfaceMuted, borderColor: t.colors.border },
    success:     { backgroundColor: t.colors.success },
    warning:     { backgroundColor: t.colors.warning },
    destructive: { backgroundColor: t.colors.destructive },
    outline:     { backgroundColor: "transparent", borderColor: t.colors.borderStrong },

    labelBase:   { fontWeight: "600" as const },
    labelSm:     { fontSize: t.typography.fontSize.xs, lineHeight: t.typography.lineHeight.xs },
    labelMd:     { fontSize: t.typography.fontSize.sm, lineHeight: t.typography.lineHeight.sm },

    primaryLabel:     { color: t.colors.primary },
    secondaryLabel:   { color: t.colors.foreground },
    successLabel:     { color: t.colors.primaryForeground },
    warningLabel:     { color: t.colors.primaryForeground },
    destructiveLabel: { color: t.colors.destructiveForeground },
    outlineLabel:     { color: t.colors.foreground },
  }));

  return (
    <View
      ref={ref}
      style={[
        styles.base,
        size === "sm" ? styles.sm : styles.md,
        styles[variant],
        style,
      ]}
    >
      <Text
        style={[
          styles.labelBase,
          size === "sm" ? styles.labelSm : styles.labelMd,
          styles[`${variant}Label` as const],
        ]}
      >
        {children}
      </Text>
    </View>
  );
});
