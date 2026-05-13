import { forwardRef, type ReactNode } from "react";
import {
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { createStyles } from "../../utils/use-styles";

export type CardSurface = "default" | "muted" | "outline";
export type CardPadding = "none" | "sm" | "md" | "lg";

export type CardProps = {
  children: ReactNode;
  surface?: CardSurface;
  padding?: CardPadding;
  pressable?: boolean;
  onPress?: PressableProps["onPress"];
  style?: StyleProp<ViewStyle>;
};

const useStyles = createStyles((t) => ({
  base: {
    borderRadius: t.radius.lg,
    borderWidth: 1,
    borderColor: "transparent",
  },
  default: {
    backgroundColor: t.colors.surface,
    borderColor: t.colors.border,
    ...t.shadows.sm,
  },
  muted:   { backgroundColor: t.colors.surfaceMuted, borderColor: t.colors.border },
  outline: { backgroundColor: "transparent",         borderColor: t.colors.borderStrong },

  padNone: { padding: 0 },
  padSm:   { padding: t.spacing.md },
  padMd:   { padding: t.spacing.lg },
  padLg:   { padding: t.spacing.xl },

  pressed: { opacity: 0.85 },
}));

export const Card = forwardRef<View, CardProps>(function Card(
  {
    children,
    surface = "default",
    padding = "md",
    pressable = false,
    onPress,
    style,
  },
  ref,
) {
  const styles = useStyles();

  const surfaceStyle = styles[surface];
  const padStyle = {
    none: styles.padNone,
    sm:   styles.padSm,
    md:   styles.padMd,
    lg:   styles.padLg,
  }[padding];

  if (pressable) {
    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        style={({ pressed }) => [
          styles.base,
          surfaceStyle,
          padStyle,
          pressed && styles.pressed,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View ref={ref} style={[styles.base, surfaceStyle, padStyle, style]}>
      {children}
    </View>
  );
});
