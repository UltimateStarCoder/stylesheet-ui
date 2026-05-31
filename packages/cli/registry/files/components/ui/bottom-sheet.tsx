import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Dimensions,
  Modal as RNModal,
  Pressable,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyles } from "../../utils/use-styles";

export type SnapPoint = number | `${number}%`;

export type BottomSheetProps = Omit<ViewProps, "children" | "style"> & {
  visible: boolean;
  onClose: () => void;
  // Multiple snap points the user can drag between. Sorted ascending by the
  // component, so `initialSnap` always indexes into the sorted set
  // (0 = smallest, length-1 = largest).
  snapPoints?: SnapPoint[];
  // Single fixed height when snapPoints is omitted.
  height?: SnapPoint;
  // Index into the sorted snapPoints to open at. Defaults to 0 (smallest).
  initialSnap?: number;
  // Tap the backdrop to dismiss. Defaults to true.
  dismissOnBackdrop?: boolean;
  // Render the small drag-handle bar at the top. Defaults to true.
  showHandle?: boolean;
  children: ReactNode;
  /** Styles the animated sheet container (the bottom panel itself). */
  style?: StyleProp<ViewStyle>;
  /** Styles the inner content wrapper that holds `children`. */
  contentStyle?: StyleProp<ViewStyle>;
};

const SPRING_CONFIG = { damping: 26, stiffness: 240, mass: 1 } as const;
// If the user drags below the smallest snap by this fraction of that snap's
// height, release dismisses. Otherwise it snaps to the nearest snap point.
const DISMISS_THRESHOLD = 0.35;
// Velocity (px/s) past which a downward fling below the smallest snap dismisses.
const FLING_DISMISS_VELOCITY = 800;
// Multiplier used to project the resting position from current velocity. A
// short fling overshoots a little so the snap target reflects intent, not
// just where the finger happens to lift.
const VELOCITY_PROJECTION = 0.15;

function resolveSnap(value: SnapPoint, screenHeight: number): number {
  if (typeof value === "number") return value;
  const pct = parseFloat(value);
  return (screenHeight * pct) / 100;
}

const useStyles = createStyles((t) => ({
  // Static; the prop-driven translateY is applied via animated style.
  backdrop: {
    ...absoluteFill(),
    backgroundColor: "#000",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: t.colors.surface,
    borderTopLeftRadius: t.radius.xl,
    borderTopRightRadius: t.radius.xl,
    borderTopWidth: 1,
    borderColor: t.colors.border,
    ...t.shadows.lg,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: t.colors.borderStrong,
    marginTop: t.spacing.sm,
    marginBottom: t.spacing.xs,
  },
  content: { paddingHorizontal: t.spacing.lg, paddingBottom: t.spacing.lg },
}));

function absoluteFill(): ViewStyle {
  return { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 };
}

export const BottomSheet = forwardRef<View, BottomSheetProps>(function BottomSheet(
  {
    visible,
    onClose,
    snapPoints,
    height,
    initialSnap = 0,
    dismissOnBackdrop = true,
    showHandle = true,
    children,
    style,
    contentStyle,
    ...rest
  },
  ref,
) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const [screenH, setScreenH] = useState(() => Dimensions.get("window").height);
  const [measuredContent, setMeasuredContent] = useState(0);
  // Render the RN <Modal> separately from the animated state so we can play
  // the close animation before unmounting.
  const [modalVisible, setModalVisible] = useState(visible);
  const [currentSnap, setCurrentSnap] = useState(initialSnap);
  // Read inside the open/close effect without putting currentSnap in deps —
  // we don't want snap-change re-renders to re-trigger the open animation.
  const currentSnapRef = useRef(currentSnap);
  currentSnapRef.current = currentSnap;

  // Snap heights in ASCENDING order (smallest first). Sorting means the user
  // can pass snap points in any order and `initialSnap` indexes consistently.
  const snapHeights = useMemo<number[]>(() => {
    if (snapPoints && snapPoints.length > 0) {
      return snapPoints.map((s) => resolveSnap(s, screenH)).sort((a, b) => a - b);
    }
    if (height !== undefined) {
      return [resolveSnap(height, screenH)];
    }
    if (measuredContent > 0) {
      return [Math.min(measuredContent + insets.bottom, screenH * 0.9)];
    }
    return [];
  }, [snapPoints, height, screenH, measuredContent, insets.bottom]);

  // The sheet container is rendered at the LARGEST snap height. Smaller snaps
  // are reached by pushing the sheet down via translateY so only that portion
  // peeks above the screen edge. This way one container can host every snap.
  const sheetMaxHeight = snapHeights[snapHeights.length - 1] ?? 0;
  // restingPositions[i] is the translateY value where the sheet rests at
  // snap i. Index 0 = smallest snap (largest translateY, most pushed down);
  // last index = largest snap (translateY = 0, fully extended).
  const restingPositions = useMemo<number[]>(
    () => snapHeights.map((h) => sheetMaxHeight - h),
    [snapHeights, sheetMaxHeight],
  );

  // translateY is measured from the fully-extended position. 0 = at largest
  // snap; positive = pushed down toward closed; sheetMaxHeight = off-screen.
  const translateY = useSharedValue(0);
  const startY = useSharedValue(0);

  const closeInternal = useCallback(() => {
    setModalVisible(false);
    onClose();
  }, [onClose]);

  // Drive open/close animation when `visible` changes.
  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      // Wait one frame so layout settles, then spring up to the current snap.
      requestAnimationFrame(() => {
        const target = restingPositions[currentSnapRef.current] ?? 0;
        translateY.value = sheetMaxHeight;
        translateY.value = withSpring(target, SPRING_CONFIG);
      });
    } else if (modalVisible) {
      translateY.value = withTiming(sheetMaxHeight, { duration: 200 }, (done) => {
        if (done) scheduleOnRN(setModalVisible, false);
      });
    }
  }, [visible, sheetMaxHeight, modalVisible, translateY, restingPositions]);

  const onLayoutContent = (e: LayoutChangeEvent) => {
    setMeasuredContent(e.nativeEvent.layout.height);
  };

  const onLayoutModal = () => {
    setScreenH(Dimensions.get("window").height);
  };

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          startY.value = translateY.value;
        })
        .onUpdate((e) => {
          // Clamp between fully open (0) and fully closed (sheetMaxHeight).
          // Allowing the full range lets the user drag UP to a larger snap or
          // DOWN past the smallest snap to dismiss.
          translateY.value = Math.max(
            0,
            Math.min(sheetMaxHeight, startY.value + e.translationY),
          );
        })
        .onEnd((e) => {
          const projected = translateY.value + e.velocityY * VELOCITY_PROJECTION;
          const smallestSnapHeight = snapHeights[0] ?? 0;
          const smallestRestingY = restingPositions[0] ?? 0;

          // Dismiss when projected position is below the smallest snap by
          // more than threshold, or a fast downward fling below it.
          const dragPastSmallest = projected - smallestRestingY;
          const shouldDismiss =
            dragPastSmallest > smallestSnapHeight * DISMISS_THRESHOLD ||
            (e.velocityY > FLING_DISMISS_VELOCITY && dragPastSmallest > 0);

          if (shouldDismiss) {
            translateY.value = withTiming(sheetMaxHeight, { duration: 180 }, (done) => {
              if (done) scheduleOnRN(closeInternal);
            });
            return;
          }

          // Snap to the resting position nearest the projected end-of-fling.
          let nearestIdx = 0;
          let nearestDist = Infinity;
          for (let i = 0; i < restingPositions.length; i++) {
            const d = Math.abs(projected - restingPositions[i]);
            if (d < nearestDist) {
              nearestDist = d;
              nearestIdx = i;
            }
          }
          scheduleOnRN(setCurrentSnap, nearestIdx);
          translateY.value = withSpring(restingPositions[nearestIdx], SPRING_CONFIG);
        }),
    [sheetMaxHeight, snapHeights, restingPositions, closeInternal, translateY, startY],
  );

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [0, sheetMaxHeight || 1],
      [0.45, 0],
      "clamp",
    ),
  }));

  // RN Modal still owns visibility / hardware back button.
  return (
    <RNModal
      visible={modalVisible}
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
      onShow={onLayoutModal}
    >
      <View ref={ref} style={absoluteFill()}>
        <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
          <Pressable
            style={absoluteFill()}
            onPress={dismissOnBackdrop ? onClose : undefined}
            accessibilityRole="button"
            accessibilityLabel="Close"
          />
        </Animated.View>

        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.sheet,
              sheetMaxHeight > 0 && { height: sheetMaxHeight },
              sheetAnimatedStyle,
              style,
            ]}
            {...rest}
          >
            {showHandle && <View style={styles.handle} accessibilityRole="none" />}
            <View
              style={[styles.content, contentStyle]}
              onLayout={onLayoutContent}
            >
              {children}
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </RNModal>
  );
});
