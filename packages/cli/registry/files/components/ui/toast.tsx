import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  SlideOutUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyles } from "../../utils/use-styles";

export type ToastVariant = "default" | "success" | "warning" | "destructive";

export type ToastItem = {
  id: string;
  title?: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
};

export type ToastInput =
  | string
  | {
      title?: string;
      description?: string;
      variant?: ToastVariant;
      duration?: number;
    };

type Listener = (event:
  | { type: "show"; item: ToastItem }
  | { type: "dismiss"; id: string }
) => void;

// Module-level event bus. Any code path can fire toast.show(...) and the
// mounted <Toaster /> picks it up via subscribe. No React Context required.
const listeners = new Set<Listener>();
let nextId = 1;

function normalize(input: ToastInput, fallbackVariant: ToastVariant = "default"): Omit<ToastItem, "id"> {
  if (typeof input === "string") {
    return { description: input, variant: fallbackVariant, duration: 3000 };
  }
  return {
    title: input.title,
    description: input.description,
    variant: input.variant ?? fallbackVariant,
    duration: input.duration ?? 3000,
  };
}

function emitShow(input: ToastInput, variant: ToastVariant): string {
  const item: ToastItem = { id: String(nextId++), ...normalize(input, variant) };
  listeners.forEach((l) => l({ type: "show", item }));
  return item.id;
}

export const toast = {
  show(input: ToastInput): string {
    return emitShow(input, typeof input === "string" ? "default" : input.variant ?? "default");
  },
  success(input: Omit<Exclude<ToastInput, string>, "variant"> | string): string {
    return emitShow(input, "success");
  },
  warning(input: Omit<Exclude<ToastInput, string>, "variant"> | string): string {
    return emitShow(input, "warning");
  },
  error(input: Omit<Exclude<ToastInput, string>, "variant"> | string): string {
    return emitShow(input, "destructive");
  },
  dismiss(id: string): void {
    listeners.forEach((l) => l({ type: "dismiss", id }));
  },
};

function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export type ToasterPosition = "top" | "bottom";
export type ToasterProps = {
  position?: ToasterPosition;
  // Max simultaneous toasts. Older ones evict.
  max?: number;
  style?: StyleProp<ViewStyle>;
};

const useStyles = createStyles((t) => ({
  // Container is absolutely positioned at top or bottom. Items stack with gap.
  container: {
    position: "absolute",
    left: t.spacing.lg,
    right: t.spacing.lg,
    gap: t.spacing.sm,
    pointerEvents: "box-none",
  },
  item: {
    borderRadius: t.radius.md,
    borderWidth: 1,
    backgroundColor: t.colors.surface,
    borderColor: t.colors.border,
    padding: t.spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: t.spacing.sm,
    ...t.shadows.md,
  },
  itemSuccess:     { borderColor: t.colors.success },
  itemWarning:     { borderColor: t.colors.warning },
  itemDestructive: { borderColor: t.colors.destructive },
  body: { flex: 1, gap: 2 },
  title: {
    fontSize: t.typography.fontSize.md,
    lineHeight: t.typography.lineHeight.md,
    color: t.colors.foreground,
    fontWeight: "600" as const,
  },
  description: {
    fontSize: t.typography.fontSize.sm,
    lineHeight: t.typography.lineHeight.sm,
    color: t.colors.foregroundMuted,
  },
  close: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: t.typography.fontSize.md,
    color: t.colors.foregroundMuted,
  },
}));

export function Toaster({ position = "top", max = 3, style }: ToasterProps) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const clearTimer = (id: string) => {
      const t = timers.current.get(id);
      if (t !== undefined) {
        clearTimeout(t);
        timers.current.delete(id);
      }
    };
    const removeItem = (id: string) => {
      clearTimer(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    };
    const off = subscribe((event) => {
      if (event.type === "show") {
        setItems((prev) => {
          const next = [...prev, event.item];
          // Items dropped by the max-cap need their pending timers cleared.
          if (next.length > max) {
            const dropped = next.slice(0, next.length - max);
            dropped.forEach((it) => clearTimer(it.id));
            return next.slice(next.length - max);
          }
          return next;
        });
        if (event.item.duration > 0) {
          const handle = setTimeout(() => removeItem(event.item.id), event.item.duration);
          timers.current.set(event.item.id, handle);
        }
      } else {
        removeItem(event.id);
      }
    });
    return () => {
      off();
      timers.current.forEach((t) => clearTimeout(t));
      timers.current.clear();
    };
  }, [max]);

  const dismiss = (id: string) => {
    const handle = timers.current.get(id);
    if (handle !== undefined) {
      clearTimeout(handle);
      timers.current.delete(id);
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const enter = position === "top" ? SlideInUp.duration(200) : SlideInDown.duration(200);
  const exit  = position === "top" ? SlideOutUp.duration(180) : SlideOutDown.duration(180);

  const containerPosition = position === "top"
    ? { top: insets.top + 8 }
    : { bottom: insets.bottom + 8 };

  return (
    <View style={[styles.container, containerPosition, style]} pointerEvents="box-none">
      {items.map((item) => (
        <Animated.View
          key={item.id}
          entering={enter.easing(Easing.out(Easing.cubic))}
          exiting={exit.easing(Easing.in(Easing.cubic))}
          style={[styles.item, variantStyle(item.variant, styles)]}
        >
          <View style={styles.body}>
            {!!item.title && <Text style={styles.title}>{item.title}</Text>}
            {!!item.description && <Text style={styles.description}>{item.description}</Text>}
          </View>
          <Pressable
            onPress={() => dismiss(item.id)}
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
            style={styles.close}
            hitSlop={8}
          >
            <Text style={styles.closeText}>×</Text>
          </Pressable>
        </Animated.View>
      ))}
    </View>
  );
}

function variantStyle(variant: ToastVariant, styles: ReturnType<typeof useStyles>) {
  switch (variant) {
    case "success":     return styles.itemSuccess;
    case "warning":     return styles.itemWarning;
    case "destructive": return styles.itemDestructive;
    default:            return undefined;
  }
}
