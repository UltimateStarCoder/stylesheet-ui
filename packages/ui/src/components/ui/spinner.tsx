import { forwardRef } from "react";
import {
  ActivityIndicator,
  View,
  type ActivityIndicatorProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../../theme/use-theme";

export type SpinnerSize = "sm" | "md" | "lg";

export type SpinnerProps = Omit<ActivityIndicatorProps, "size" | "color" | "style"> & {
  size?: SpinnerSize;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

const SIZE_PX: Record<SpinnerSize, number> = { sm: 16, md: 24, lg: 36 };

export const Spinner = forwardRef<View, SpinnerProps>(function Spinner(
  { size = "md", color, style, ...rest },
  ref,
) {
  const theme = useTheme();
  return (
    <ActivityIndicator
      ref={ref}
      size={SIZE_PX[size]}
      color={color ?? theme.colors.primary}
      style={style}
      {...rest}
    />
  );
});
