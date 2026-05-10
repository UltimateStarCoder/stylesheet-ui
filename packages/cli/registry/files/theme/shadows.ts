import { Platform, type ViewStyle } from "react-native";

const ios = (opacity: number, radius: number, height: number): ViewStyle => ({
  shadowColor: "#000",
  shadowOpacity: opacity,
  shadowRadius: radius,
  shadowOffset: { width: 0, height },
});

export const shadows = {
  sm: Platform.select<ViewStyle>({
    ios:     ios(0.08, 2, 1),
    android: { elevation: 1 },
    default: ios(0.08, 2, 1),
  })!,
  md: Platform.select<ViewStyle>({
    ios:     ios(0.10, 6, 3),
    android: { elevation: 3 },
    default: ios(0.10, 6, 3),
  })!,
  lg: Platform.select<ViewStyle>({
    ios:     ios(0.14, 16, 8),
    android: { elevation: 8 },
    default: ios(0.14, 16, 8),
  })!,
} as const;

export type ShadowTokens = typeof shadows;
