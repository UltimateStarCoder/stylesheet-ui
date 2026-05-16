import { forwardRef } from "react";
import {
  Text as RNText,
  type StyleProp,
  type TextProps as RNTextProps,
  type TextStyle,
} from "react-native";
import { createStyles } from "../../utils/use-styles";

export type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
export type TextWeight = "regular" | "medium" | "semibold" | "bold";
export type TextIntent =
  | "default"
  | "muted"
  | "subtle"
  | "primary"
  | "destructive"
  | "success"
  | "warning";

export type TextProps = Omit<RNTextProps, "style"> & {
  size?: TextSize;
  weight?: TextWeight;
  intent?: TextIntent;
  style?: StyleProp<TextStyle>;
};

const useStyles = createStyles((t) => ({
  base: { color: t.colors.foreground },
  xs:   { fontSize: t.typography.fontSize.xs,   lineHeight: t.typography.lineHeight.xs },
  sm:   { fontSize: t.typography.fontSize.sm,   lineHeight: t.typography.lineHeight.sm },
  md:   { fontSize: t.typography.fontSize.md,   lineHeight: t.typography.lineHeight.md },
  lg:   { fontSize: t.typography.fontSize.lg,   lineHeight: t.typography.lineHeight.lg },
  xl:   { fontSize: t.typography.fontSize.xl,   lineHeight: t.typography.lineHeight.xl },
  "2xl":{ fontSize: t.typography.fontSize["2xl"], lineHeight: t.typography.lineHeight["2xl"] },
  "3xl":{ fontSize: t.typography.fontSize["3xl"], lineHeight: t.typography.lineHeight["3xl"] },
  "4xl":{ fontSize: t.typography.fontSize["4xl"], lineHeight: t.typography.lineHeight["4xl"] },

  regular:  { fontWeight: "400" as const },
  medium:   { fontWeight: "500" as const },
  semibold: { fontWeight: "600" as const },
  bold:     { fontWeight: "700" as const },

  default:     { color: t.colors.foreground },
  muted:       { color: t.colors.foregroundMuted },
  subtle:      { color: t.colors.foregroundSubtle },
  primary:     { color: t.colors.primary },
  destructive: { color: t.colors.destructive },
  success:     { color: t.colors.success },
  warning:     { color: t.colors.warning },
}));

export const Text = forwardRef<RNText, TextProps>(function Text(
  { size = "md", weight = "regular", intent = "default", style, ...rest },
  ref,
) {
  const styles = useStyles();

  return (
    <RNText
      ref={ref}
      style={[styles.base, styles[size], styles[weight], styles[intent], style]}
      {...rest}
    />
  );
});
