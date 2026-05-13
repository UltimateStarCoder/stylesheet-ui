import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
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
  type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../theme/use-theme";
import { createStyles } from "../../utils/use-styles";

export type SnapPoint = number | `${number}%`;

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  // Multiple snap points; the sheet rests at one of them. Most explicit.
  snapPoints?: SnapPoint[];
  // Single fixed height when snapPoints is omitted.
  height?: SnapPoint;
  // Index into snapPoints to open at. Defaults to 0 (smallest).
  initialSnap?: number;
  // Tap the backdrop to dismiss. Defaults to true.
  dismissOnBackdrop?: boolean;
  // Render the small drag-handle bar at the top. Defaults to true.
  showHandle?: boolean;
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
};

const SPRING_CONFIG = { damping: 26, stiffness: 240, mass: 1 } as const;
// If the user drags the sheet down by this fraction of its current height,
// release dismisses. Otherwise it springs back.
const DISMISS_THRESHOLD = 0.35;
// Velocity (px/s) past which a downward fling always dismisses.
const FLING_DISMISS_VELOCITY = 800;

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
    contentStyle,
  },
  ref,
) {
  const theme = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const [screenH, setScreenH] = useState(() => Dimensions.get("window").height);
  const [measuredContent, setMeasuredContent] = useState(0);
  // Render the RN <Modal> separately from the animated state so we can play
  // the close animation before unmounting.
  const [modalVisible, setModalVisible] = useState(visible);
  const [currentSnap, setCurrentSnap] = useState(initialSnap);

  // Resolve snap heights in pixels. Auto-fit (when neither snapPoints nor
  // height is set) uses the measured content height + bottom inset.
  const snapHeights = useMemo<number[]>(() => {
    if (snapPoints && snapPoints.length > 0) {
      return snapPoints.map((s) => resolveSnap(s, screenH));
    }
    if (height !== undefined) {
      return [resolveSnap(height, screenH)];
    }
    if (measuredContent > 0) {
      return [Math.min(measuredContent + insets.bottom, screenH * 0.9)];
    }
    return [];
  }, [snapPoints, height, screenH, measuredContent, insets.bottom]);

  // translateY is measured from the closed position. 0 = fully open at
  // current snap; positive = pushed down toward closed.
  const translateY = useSharedValue(0);
  const startY = useSharedValue(0);
  // The pixel height of the sheet at the current snap. Used to size the
  // animated container so it doesn't overflow when partial.
  const sheetHeight = snapHeights[currentSnap] ?? 0;

  const closeInternal = useCallback(() => {
    setModalVisible(false);
    onClose();
  }, [onClose]);

  // Drive open/close animation when `visible` changes.
  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      // Wait one frame so layout settles, then spring up.
      requestAnimationFrame(() => {
        translateY.value = sheetHeight;
        translateY.value = withSpring(0, SPRING_CONFIG);
      });
    } else if (modalVisible) {
      translateY.value = withTiming(sheetHeight, { duration: 200 }, (done) => {
        if (done) runOnJS(setModalVisible)(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, sheetHeight]);

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
          // Drag down (positive y) follows the finger; drag up clamps at 0.
          translateY.value = Math.max(0, startY.value + e.translationY);
        })
        .onEnd((e) => {
          const dragged = translateY.value;
          const shouldDismiss =
            dragged > sheetHeight * DISMISS_THRESHOLD ||
            e.velocityY > FLING_DISMISS_VELOCITY;
          if (shouldDismiss) {
            translateY.value = withTiming(sheetHeight, { duration: 180 }, (done) => {
              if (done) runOnJS(closeInternal)();
            });
          } else {
            translateY.value = withSpring(0, SPRING_CONFIG);
          }
        }),
    [sheetHeight, closeInternal, translateY, startY],
  );

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [0, sheetHeight || 1],
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
              sheetHeight > 0 && { height: sheetHeight },
              sheetAnimatedStyle,
            ]}
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
