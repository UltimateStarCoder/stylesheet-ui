import { cloneElement, isValidElement, useRef, useState, type ReactElement, type ReactNode } from "react";
import {
  Dimensions,
  Modal as RNModal,
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { createStyles } from "../../utils/use-styles";

export type MenuItem = {
  label: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
};

export type MenuPlacement = "bottom-start" | "bottom-end";

export type MenuProps = {
  trigger: ReactElement;
  items: MenuItem[];
  placement?: MenuPlacement;
  minWidth?: number;
  style?: StyleProp<ViewStyle>;
};

const MENU_OFFSET = 4;

const useStyles = createStyles((t) => ({
  backdrop: { flex: 1 },
  card: {
    position: "absolute",
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.colors.border,
    paddingVertical: t.spacing.xs,
    minWidth: 180,
    ...t.shadows.lg,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: t.spacing.sm,
    paddingVertical: t.spacing.sm,
    paddingHorizontal: t.spacing.md,
  },
  itemPressed: { backgroundColor: t.colors.surfaceMuted },
  itemDisabled: { opacity: 0.5 },
  label: {
    fontSize: t.typography.fontSize.md,
    lineHeight: t.typography.lineHeight.md,
    color: t.colors.foreground,
    flex: 1,
  },
  labelDestructive: { color: t.colors.destructive },
}));

type AnchorRect = { x: number; y: number; width: number; height: number };

export function Menu({ trigger, items, placement = "bottom-start", minWidth, style }: MenuProps) {
  const styles = useStyles();
  const anchorRef = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);

  const openMenu = () => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
    });
  };

  // Inject our onPress + ref onto the consumer-provided trigger so they keep
  // styling control. The trigger element must accept ref + onPress (any
  // Pressable does).
  const triggerEl = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<{ ref?: unknown; onPress?: () => void }>, {
        ref: anchorRef,
        onPress: openMenu,
      })
    : trigger;

  const screen = Dimensions.get("window");
  const cardMinWidth = minWidth ?? 180;

  // Position the card under the anchor. For bottom-end placement, align the
  // card's right edge to the anchor's right edge so it doesn't overflow.
  const left = anchor
    ? placement === "bottom-end"
      ? Math.max(8, Math.min(screen.width - cardMinWidth - 8, anchor.x + anchor.width - cardMinWidth))
      : Math.max(8, Math.min(screen.width - cardMinWidth - 8, anchor.x))
    : 0;
  const top = anchor ? anchor.y + anchor.height + MENU_OFFSET : 0;

  return (
    <>
      {triggerEl}
      <RNModal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          style={styles.backdrop}
          onPress={() => setOpen(false)}
          accessibilityLabel="Close menu"
        />
        {!!anchor && (
          <View
            accessibilityRole="menu"
            style={[styles.card, { left, top, minWidth: cardMinWidth }, style]}
          >
            {items.map((item, idx) => (
              <Pressable
                key={`${item.label}-${idx}`}
                disabled={item.disabled}
                onPress={() => {
                  setOpen(false);
                  item.onPress();
                }}
                accessibilityRole="menuitem"
                accessibilityState={{ disabled: item.disabled }}
                style={({ pressed }) => [
                  styles.item,
                  pressed && !item.disabled && styles.itemPressed,
                  item.disabled && styles.itemDisabled,
                ]}
              >
                {item.icon}
                <Text style={[styles.label, item.destructive && styles.labelDestructive]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </RNModal>
    </>
  );
}
