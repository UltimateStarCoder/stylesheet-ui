import { cloneElement, isValidElement, useRef, useState, type ReactElement, type ReactNode } from "react";
import {
  Dimensions,
  Modal as RNModal,
  Pressable,
  Text,
  View,
  type ViewProps,
} from "react-native";
import { createStyles } from "../../utils/use-styles";

export type MenuItem = {
  label: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  testID?: string;
};

export type MenuPlacement = "bottom-start" | "bottom-end";

export type MenuProps = Omit<ViewProps, "children"> & {
  trigger: ReactElement;
  items: MenuItem[];
  placement?: MenuPlacement;
  // Optional minimum width. Omit to let the card size to its content.
  minWidth?: number;
};

const MENU_OFFSET = 4;
const EDGE_MARGIN = 8;

const useStyles = createStyles((t) => ({
  backdrop: { flex: 1 },
  card: {
    position: "absolute",
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.colors.border,
    paddingVertical: t.spacing.xs,
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
  },
  labelDestructive: { color: t.colors.destructive },
}));

type AnchorRect = { x: number; y: number; width: number; height: number };

export function Menu({ trigger, items, placement = "bottom-start", minWidth, style, ...rest }: MenuProps) {
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

  // Anchor the card by the edge nearest the trigger so it can size to its
  // content: bottom-start pins the left edge and grows right; bottom-end pins
  // the right edge and grows left. Neither needs the card's measured width.
  const position = anchor
    ? {
        top: anchor.y + anchor.height + MENU_OFFSET,
        ...(placement === "bottom-end"
          ? { right: Math.max(EDGE_MARGIN, screen.width - (anchor.x + anchor.width)) }
          : { left: Math.max(EDGE_MARGIN, anchor.x) }),
      }
    : { top: 0, left: 0 };

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
            style={[
              styles.card,
              position,
              { maxWidth: screen.width - EDGE_MARGIN * 2 },
              minWidth != null && { minWidth },
              style,
            ]}
            {...rest}
          >
            {items.map((item, idx) => (
              <Pressable
                key={`${item.label}-${idx}`}
                testID={item.testID}
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
