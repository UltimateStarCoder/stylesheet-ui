import { forwardRef, useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  View,
  type DimensionValue,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { createStyles } from "../../utils/use-styles";

export type SkeletonProps = Omit<ViewProps, "children" | "style"> & {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

const useStyles = createStyles((t) => ({
  base: { backgroundColor: t.colors.surfaceMuted },
}));

const PULSE_DURATION = 900;

export const Skeleton = forwardRef<View, SkeletonProps>(function Skeleton(
  { width = "100%", height = 16, radius, style, ...rest },
  ref,
) {
  const styles = useStyles();
  // Opacity pulse loop. Core RN Animated is enough — no Reanimated peer dep.
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: PULSE_DURATION,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: PULSE_DURATION,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      ref={ref}
      accessibilityRole="none"
      accessible={false}
      style={[
        styles.base,
        { width, height, borderRadius: radius ?? 6, opacity },
        style,
      ]}
      {...rest}
    >
      <View />
    </Animated.View>
  );
});
