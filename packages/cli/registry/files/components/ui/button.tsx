import { forwardRef, type ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../../theme/use-theme";
import { useStyles } from "../../utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<PressableProps, "children" | "style"> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const Button = forwardRef<View, ButtonProps>(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    style,
    ...rest
  },
  ref,
) {
  const theme = useTheme();
  const styles = useStyles((t) => ({
    base: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: t.spacing.sm,
      borderRadius: t.radius.md,
      borderWidth: 1,
      borderColor: "transparent",
    },
    sizeSm: { paddingVertical: t.spacing.xs, paddingHorizontal: t.spacing.md, minHeight: 32 },
    sizeMd: { paddingVertical: t.spacing.sm, paddingHorizontal: t.spacing.lg, minHeight: 40 },
    sizeLg: { paddingVertical: t.spacing.md, paddingHorizontal: t.spacing.xl, minHeight: 48 },

    primary:            { backgroundColor: t.colors.primary },
    primaryPressed:     { backgroundColor: t.colors.primary, opacity: 0.85 },
    secondary:          { backgroundColor: t.colors.surfaceMuted, borderColor: t.colors.border },
    secondaryPressed:   { backgroundColor: t.colors.border },
    ghost:              { backgroundColor: "transparent" },
    ghostPressed:       { backgroundColor: t.colors.surfaceMuted },
    destructive:        { backgroundColor: t.colors.destructive },
    destructivePressed: { backgroundColor: t.colors.destructive, opacity: 0.85 },

    disabled: { opacity: 0.5 },

    labelBase: { fontWeight: "600" as const },
    labelSm:   { fontSize: t.typography.fontSize.sm, lineHeight: t.typography.lineHeight.sm },
    labelMd:   { fontSize: t.typography.fontSize.md, lineHeight: t.typography.lineHeight.md },
    labelLg:   { fontSize: t.typography.fontSize.lg, lineHeight: t.typography.lineHeight.lg },

    primaryLabel:     { color: t.colors.primaryForeground },
    secondaryLabel:   { color: t.colors.foreground },
    ghostLabel:       { color: t.colors.foreground },
    destructiveLabel: { color: t.colors.destructiveForeground },
  }));

  const sizeStyle      = { sm: styles.sizeSm, md: styles.sizeMd, lg: styles.sizeLg }[size];
  const labelSizeStyle = { sm: styles.labelSm, md: styles.labelMd, lg: styles.labelLg }[size];
  const variantStyle        = styles[variant];
  const variantPressedStyle = styles[`${variant}Pressed` as const];
  const labelVariantStyle   = styles[`${variant}Label` as const];

  const isInactive = disabled || loading;
  const useLightSpinner = variant === "primary" || variant === "destructive";

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{ disabled: isInactive, busy: loading }}
      disabled={isInactive}
      style={({ pressed }) => [
        styles.base,
        sizeStyle,
        variantStyle,
        pressed && !isInactive && variantPressedStyle,
        isInactive && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={useLightSpinner ? theme.colors.primaryForeground : theme.colors.foreground}
        />
      ) : (
        <>
          {leftIcon}
          <Text style={[styles.labelBase, labelSizeStyle, labelVariantStyle]}>
            {children}
          </Text>
          {rightIcon}
        </>
      )}
    </Pressable>
  );
});
