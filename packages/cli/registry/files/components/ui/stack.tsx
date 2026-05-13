import { forwardRef, type ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import type { SpacingKey } from "../../theme/spacing";
import { useStyles } from "../../utils/cn";

export type StackDirection = "column" | "row" | "column-reverse" | "row-reverse";
export type StackAlign = "stretch" | "start" | "center" | "end" | "baseline";
export type StackJustify = "start" | "center" | "end" | "between" | "around" | "evenly";

export type StackProps = {
  children: ReactNode;
  direction?: StackDirection;
  gap?: SpacingKey;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  style?: StyleProp<ViewStyle>;
};

const ALIGN_MAP: Record<StackAlign, ViewStyle["alignItems"]> = {
  stretch: "stretch",
  start:   "flex-start",
  center:  "center",
  end:     "flex-end",
  baseline:"baseline",
};

const JUSTIFY_MAP: Record<StackJustify, ViewStyle["justifyContent"]> = {
  start:   "flex-start",
  center:  "center",
  end:     "flex-end",
  between: "space-between",
  around:  "space-around",
  evenly:  "space-evenly",
};

export const Stack = forwardRef<View, StackProps>(function Stack(
  { children, direction = "column", gap = "none", align, justify, wrap, style },
  ref,
) {
  const styles = useStyles((t) => ({
    base: {
      flexDirection: direction,
      gap: t.spacing[gap],
      ...(align && { alignItems: ALIGN_MAP[align] }),
      ...(justify && { justifyContent: JUSTIFY_MAP[justify] }),
      ...(wrap && { flexWrap: "wrap" as const }),
    },
  }));
  return (
    <View ref={ref} style={[styles.base, style]}>
      {children}
    </View>
  );
});

// Convenience aliases — HStack is horizontal, VStack is the default vertical.
export const HStack = forwardRef<View, Omit<StackProps, "direction">>(function HStack(
  props,
  ref,
) {
  return <Stack ref={ref} direction="row" {...props} />;
});

export const VStack = forwardRef<View, Omit<StackProps, "direction">>(function VStack(
  props,
  ref,
) {
  return <Stack ref={ref} direction="column" {...props} />;
});
