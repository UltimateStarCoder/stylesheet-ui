import { forwardRef } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import type { SpacingKey } from "../../theme/spacing";
import { useStyles } from "../../utils/cn";

export type DividerProps = {
  orientation?: "horizontal" | "vertical";
  // Horizontal margin to inset from one or both edges (e.g. for left-padded
  // list rows so the divider lines up with the content, not the icon).
  inset?: SpacingKey;
  thickness?: number;
  style?: StyleProp<ViewStyle>;
};

export const Divider = forwardRef<View, DividerProps>(function Divider(
  { orientation = "horizontal", inset = "none", thickness = 1, style },
  ref,
) {
  const styles = useStyles((t) => ({
    horizontal: {
      height: thickness,
      backgroundColor: t.colors.border,
      marginLeft: t.spacing[inset],
    },
    vertical: {
      width: thickness,
      backgroundColor: t.colors.border,
      alignSelf: "stretch",
    },
  }));
  return (
    <View
      ref={ref}
      accessibilityRole="none"
      style={[orientation === "horizontal" ? styles.horizontal : styles.vertical, style]}
    />
  );
});
