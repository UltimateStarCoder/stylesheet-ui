import { forwardRef } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "../../theme/use-theme";
import type { SpacingKey } from "../../theme/spacing";

export type DividerProps = {
  orientation?: "horizontal" | "vertical";
  // Horizontal margin to inset from one or both edges (e.g. for left-padded
  // list rows so the divider lines up with the content, not the icon).
  inset?: SpacingKey;
  thickness?: number;
  style?: StyleProp<ViewStyle>;
};

// Divider style values are all prop-derived (thickness, inset, orientation),
// so the layout is built inline. Only the border color comes from the theme.
export const Divider = forwardRef<View, DividerProps>(function Divider(
  { orientation = "horizontal", inset = "none", thickness = 1, style },
  ref,
) {
  const theme = useTheme();
  const layout: ViewStyle =
    orientation === "horizontal"
      ? {
          height: thickness,
          backgroundColor: theme.colors.border,
          marginLeft: theme.spacing[inset],
        }
      : {
          width: thickness,
          backgroundColor: theme.colors.border,
          alignSelf: "stretch",
        };
  return <View ref={ref} accessibilityRole="none" style={[layout, style]} />;
});
