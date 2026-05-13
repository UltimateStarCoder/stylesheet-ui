import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  PanResponder,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useStyles } from "../../utils/cn";

export type SliderProps = {
  value: number;
  onValueChange: (next: number) => void;
  // Fires when the user finishes a drag (good for committing to state/network).
  onSlidingComplete?: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const THUMB_PX = 22;
const TRACK_HEIGHT = 4;

export const Slider = forwardRef<View, SliderProps>(function Slider(
  {
    value,
    onValueChange,
    onSlidingComplete,
    min = 0,
    max = 100,
    step,
    disabled,
    style,
  },
  ref,
) {
  const [width, setWidth] = useState(0);
  const trackRef = useRef<View>(null);
  // Latest props captured for the PanResponder closure; pan handlers are
  // created once on mount, so we use refs to read fresh state inside them.
  const propsRef = useRef({ value, onValueChange, onSlidingComplete, min, max, step, width, disabled });
  propsRef.current = { value, onValueChange, onSlidingComplete, min, max, step, width, disabled };

  const styles = useStyles((t) => ({
    root: {
      height: THUMB_PX,
      justifyContent: "center",
    },
    track: {
      height: TRACK_HEIGHT,
      borderRadius: TRACK_HEIGHT / 2,
      backgroundColor: t.colors.surfaceMuted,
      width: "100%",
    },
    fill: {
      position: "absolute",
      left: 0,
      height: TRACK_HEIGHT,
      borderRadius: TRACK_HEIGHT / 2,
      backgroundColor: t.colors.primary,
    },
    thumb: {
      position: "absolute",
      top: (THUMB_PX - THUMB_PX) / 2,
      width: THUMB_PX,
      height: THUMB_PX,
      borderRadius: THUMB_PX / 2,
      backgroundColor: t.colors.surface,
      borderWidth: 1,
      borderColor: t.colors.borderStrong,
      ...t.shadows.sm,
    },
    disabled: { opacity: 0.5 },
  }));

  const clampAndStep = useCallback((raw: number) => {
    const { min, max, step } = propsRef.current;
    let v = Math.min(Math.max(raw, min), max);
    if (step && step > 0) v = Math.round((v - min) / step) * step + min;
    return v;
  }, []);

  const pixelToValue = useCallback((px: number) => {
    const { min, max, width } = propsRef.current;
    if (width <= 0) return min;
    const ratio = Math.min(Math.max(px / width, 0), 1);
    return clampAndStep(min + ratio * (max - min));
  }, [clampAndStep]);

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !propsRef.current.disabled,
        onMoveShouldSetPanResponder: () => !propsRef.current.disabled,
        onPanResponderGrant: (e) => {
          const next = pixelToValue(e.nativeEvent.locationX);
          propsRef.current.onValueChange(next);
        },
        onPanResponderMove: (e) => {
          const next = pixelToValue(e.nativeEvent.locationX);
          propsRef.current.onValueChange(next);
        },
        onPanResponderRelease: (e) => {
          const next = pixelToValue(e.nativeEvent.locationX);
          propsRef.current.onSlidingComplete?.(next);
        },
      }),
    [pixelToValue],
  );

  const range = Math.max(max - min, 1);
  const ratio = Math.min(Math.max((value - min) / range, 0), 1);
  const fillWidth = width * ratio;
  const thumbLeft = fillWidth - THUMB_PX / 2;

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  return (
    <View
      ref={ref}
      onLayout={onLayout}
      style={[styles.root, disabled && styles.disabled, style]}
      accessibilityRole="adjustable"
      accessibilityValue={{ min, max, now: value }}
      {...responder.panHandlers}
    >
      <View ref={trackRef} style={styles.track} />
      <View style={[styles.fill, { width: fillWidth }]} />
      <View style={[styles.thumb, { left: Math.max(0, thumbLeft) }]} />
    </View>
  );
});
