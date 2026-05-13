import { forwardRef, type ReactNode } from "react";
import {
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../../theme/use-theme";
import { useStyles } from "../../utils/cn";

export type CheckboxSize = "sm" | "md" | "lg";

export type CheckboxProps = {
  checked: boolean;
  onCheckedChange?: (next: boolean) => void;
  label?: ReactNode;
  size?: CheckboxSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const SIZE_PX: Record<CheckboxSize, number> = { sm: 16, md: 20, lg: 24 };

export const Checkbox = forwardRef<View, CheckboxProps>(function Checkbox(
  { checked, onCheckedChange, label, size = "md", disabled, style },
  ref,
) {
  const theme = useTheme();
  const px = SIZE_PX[size];

  const styles = useStyles((t) => ({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: t.spacing.sm,
    },
    box: {
      width: px,
      height: px,
      borderRadius: t.radius.sm,
      borderWidth: 1.5,
      borderColor: t.colors.borderStrong,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: t.colors.surface,
    },
    boxChecked: {
      backgroundColor: t.colors.primary,
      borderColor: t.colors.primary,
    },
    disabled: { opacity: 0.5 },
    label: {
      fontSize: t.typography.fontSize.md,
      lineHeight: t.typography.lineHeight.md,
      color: t.colors.foreground,
    },
  }));

  // The check mark is a CSS-style rotated rectangle — keeps the component
  // SVG-free, so it has no extra deps. Tweak the strokeWidth via borderWidth.
  const checkSize = px * 0.55;
  const checkStyle: ViewStyle = {
    width: checkSize * 0.55,
    height: checkSize,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: theme.colors.primaryForeground,
    transform: [{ rotate: "45deg" }, { translateY: -checkSize * 0.08 }],
  };

  return (
    <Pressable
      ref={ref}
      onPress={() => onCheckedChange?.(!checked)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      style={[styles.row, disabled && styles.disabled, style]}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <View style={checkStyle} />}
      </View>
      {!!label &&
        (typeof label === "string" ? (
          <Text style={styles.label}>{label}</Text>
        ) : (
          label
        ))}
    </Pressable>
  );
});
