import { cloneElement, isValidElement, useRef, useState, type ReactElement } from "react";
import {
  Dimensions,
  Modal as RNModal,
  Pressable,
  Text,
  View,
  type ViewProps,
} from "react-native";
import { createStyles } from "../../utils/use-styles";

export type TooltipPlacement = "top" | "bottom";

export type TooltipProps = Omit<ViewProps, "children"> & {
  // Any pressable element. We attach ref + onLongPress to it.
  children: ReactElement;
  label: string;
  placement?: TooltipPlacement;
  // Auto-dismiss after N ms. Defaults to 2000. Set 0 to keep open until tap-outside.
  duration?: number;
};

const TOOLTIP_OFFSET = 6;
const TOOLTIP_MAX_WIDTH = 240;

const useStyles = createStyles((t) => ({
  backdrop: { flex: 1 },
  bubble: {
    position: "absolute",
    maxWidth: TOOLTIP_MAX_WIDTH,
    paddingVertical: t.spacing.xs,
    paddingHorizontal: t.spacing.sm,
    backgroundColor: t.colors.foreground,
    borderRadius: t.radius.sm,
    ...t.shadows.md,
  },
  label: {
    color: t.colors.background,
    fontSize: t.typography.fontSize.sm,
    lineHeight: t.typography.lineHeight.sm,
  },
}));

type AnchorRect = { x: number; y: number; width: number; height: number };

export function Tooltip({ children, label, placement = "top", duration = 2000, style, ...rest }: TooltipProps) {
  const styles = useStyles();
  const anchorRef = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = () => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
      if (duration > 0) {
        if (dismissTimer.current) clearTimeout(dismissTimer.current);
        dismissTimer.current = setTimeout(() => setOpen(false), duration);
      }
    });
  };

  const closeTooltip = () => {
    if (dismissTimer.current) {
      clearTimeout(dismissTimer.current);
      dismissTimer.current = null;
    }
    setOpen(false);
  };

  // Long-press is the RN-idiomatic trigger (no hover). We pair with
  // accessibilityHint so screen readers still get the info on tap-and-hold.
  const triggerEl = isValidElement(children)
    ? cloneElement(
        children as ReactElement<{
          ref?: unknown;
          onLongPress?: () => void;
          accessibilityHint?: string;
        }>,
        {
          ref: anchorRef,
          onLongPress: showTooltip,
          accessibilityHint: label,
        },
      )
    : children;

  const screen = Dimensions.get("window");
  // Estimate bubble width for centering; falls back to anchor width if shorter.
  const estimatedWidth = Math.min(TOOLTIP_MAX_WIDTH, Math.max(label.length * 7 + 24, anchor?.width ?? 80));
  const centerX = anchor ? anchor.x + anchor.width / 2 - estimatedWidth / 2 : 0;
  const left = Math.max(8, Math.min(screen.width - estimatedWidth - 8, centerX));
  const top = anchor
    ? placement === "top"
      ? anchor.y - TOOLTIP_OFFSET - 28
      : anchor.y + anchor.height + TOOLTIP_OFFSET
    : 0;

  return (
    <>
      {triggerEl}
      <RNModal visible={open} transparent animationType="fade" onRequestClose={closeTooltip}>
        <Pressable style={styles.backdrop} onPress={closeTooltip} accessibilityLabel="Dismiss tooltip" />
        {!!anchor && (
          <View accessibilityRole="text" style={[styles.bubble, { left, top }, style]} {...rest}>
            <Text style={styles.label}>{label}</Text>
          </View>
        )}
      </RNModal>
    </>
  );
}
