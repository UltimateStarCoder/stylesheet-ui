import { forwardRef, useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { createStyles } from "../../utils/use-styles";

export type ProgressProps = {
  // 0–100. Ignored when `indeterminate` is true.
  value?: number;
  indeterminate?: boolean;
  // Height of the track in px. Defaults to 8.
  height?: number;
  style?: StyleProp<ViewStyle>;
};

const useStyles = createStyles((t) => ({
  track: {
    width: "100%",
    backgroundColor: t.colors.surfaceMuted,
    borderRadius: t.radius.full,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: t.colors.primary,
    borderRadius: t.radius.full,
  },
}));

const ANIMATION_DURATION = 200;
const INDETERMINATE_DURATION = 1200;

export const Progress = forwardRef<View, ProgressProps>(function Progress(
  { value = 0, indeterminate = false, height = 8, style },
  ref,
) {
  const styles = useStyles();
  const clamped = Math.max(0, Math.min(100, value));

  // Drives the determinate fill width as a 0..1 fraction. Animated by useEffect.
  const progress = useRef(new Animated.Value(clamped / 100)).current;
  // Drives the indeterminate sliding stripe position as a 0..1 fraction of track width.
  const stripe = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (indeterminate) return;
    Animated.timing(progress, {
      toValue: clamped / 100,
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [clamped, indeterminate, progress]);

  useEffect(() => {
    if (!indeterminate) return;
    const loop = Animated.loop(
      Animated.timing(stripe, {
        toValue: 1,
        duration: INDETERMINATE_DURATION,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [indeterminate, stripe]);

  const fillStyle = indeterminate
    ? {
        width: "30%" as const,
        transform: [
          {
            translateX: stripe.interpolate({
              inputRange: [0, 1],
              // Slide from off-screen left to off-screen right relative to a 100%-wide track.
              outputRange: ["-100%", "350%"],
            }),
          },
        ],
      }
    : {
        width: progress.interpolate({
          inputRange: [0, 1],
          outputRange: ["0%", "100%"],
        }),
      };

  return (
    <View
      ref={ref}
      accessibilityRole="progressbar"
      accessibilityValue={indeterminate ? undefined : { now: clamped, min: 0, max: 100 }}
      style={[styles.track, { height }, style]}
    >
      <Animated.View style={[styles.fill, fillStyle]} />
    </View>
  );
});
