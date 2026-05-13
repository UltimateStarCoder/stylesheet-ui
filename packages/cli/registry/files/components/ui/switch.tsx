import { forwardRef } from "react";
import {
  Switch as RNSwitch,
  type SwitchProps as RNSwitchProps,
} from "react-native";
import { useTheme } from "../../theme/use-theme";

export type SwitchProps = Omit<RNSwitchProps, "trackColor" | "thumbColor" | "ios_backgroundColor">;

// Themed wrapper over RN's Switch. RN's switch is platform-native, so we
// just pin the colors to the theme tokens and forward everything else.
export const Switch = forwardRef<RNSwitch, SwitchProps>(function Switch(props, ref) {
  const theme = useTheme();
  return (
    <RNSwitch
      ref={ref}
      trackColor={{
        false: theme.colors.surfaceMuted,
        true:  theme.colors.primary,
      }}
      thumbColor="#FFFFFF"
      ios_backgroundColor={theme.colors.surfaceMuted}
      {...props}
    />
  );
});
