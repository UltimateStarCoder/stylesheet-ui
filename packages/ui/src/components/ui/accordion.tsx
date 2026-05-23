import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  Text,
  UIManager,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { createStyles } from "../../utils/use-styles";

// LayoutAnimation needs an explicit opt-in on Android.
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type AccordionType = "single" | "multiple";

type AccordionContextValue = {
  type: AccordionType;
  openValues: Set<string>;
  toggle: (value: string) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);
const ItemContext = createContext<{ value: string; isOpen: boolean } | null>(null);

function useAccordion(component: string): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error(`<${component}> must be rendered inside <Accordion>.`);
  return ctx;
}

function useItem(component: string) {
  const ctx = useContext(ItemContext);
  if (!ctx) throw new Error(`<${component}> must be rendered inside <AccordionItem>.`);
  return ctx;
}

const useRootStyles = createStyles((t) => ({
  root: {
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
    overflow: "hidden",
  },
}));

const useItemStyles = createStyles((t) => ({
  item: { borderTopWidth: 1, borderTopColor: t.colors.border },
  itemFirst: { borderTopWidth: 0 },
}));

const useTriggerStyles = createStyles((t) => ({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: t.spacing.sm,
    paddingVertical: t.spacing.md,
    paddingHorizontal: t.spacing.lg,
  },
  pressed:  { backgroundColor: t.colors.surfaceMuted },
  disabled: { opacity: 0.5 },
  label: {
    fontSize: t.typography.fontSize.md,
    lineHeight: t.typography.lineHeight.md,
    color: t.colors.foreground,
    fontWeight: "500" as const,
    flex: 1,
  },
  chevron: {
    fontSize: t.typography.fontSize.md,
    color: t.colors.foregroundMuted,
  },
}));

const useContentStyles = createStyles((t) => ({
  content: {
    paddingTop: 0,
    paddingBottom: t.spacing.md,
    paddingHorizontal: t.spacing.lg,
  },
}));

export type AccordionProps = {
  type?: AccordionType;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (next: string | string[]) => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function toSet(value: string | string[] | undefined): Set<string> {
  if (value === undefined) return new Set();
  return new Set(Array.isArray(value) ? value : [value]);
}

export function Accordion({
  type = "single",
  value,
  defaultValue,
  onValueChange,
  children,
  style,
}: AccordionProps) {
  const styles = useRootStyles();
  const [internal, setInternal] = useState<Set<string>>(() => toSet(defaultValue));
  const isControlled = value !== undefined;
  const openValues = isControlled ? toSet(value) : internal;

  const ctx = useMemo<AccordionContextValue>(
    () => ({
      type,
      openValues,
      toggle: (v) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const next = new Set(openValues);
        if (next.has(v)) {
          next.delete(v);
        } else {
          if (type === "single") next.clear();
          next.add(v);
        }
        if (!isControlled) setInternal(next);
        onValueChange?.(type === "single" ? (next.values().next().value ?? "") : Array.from(next));
      },
    }),
    [type, openValues, isControlled, onValueChange],
  );

  return (
    <AccordionContext value={ctx}>
      <View style={[styles.root, style]}>{children}</View>
    </AccordionContext>
  );
}

export type AccordionItemProps = {
  value: string;
  children: ReactNode;
  first?: boolean;
};

export function AccordionItem({ value, children, first }: AccordionItemProps) {
  const styles = useItemStyles();
  const ctx = useAccordion("AccordionItem");
  const isOpen = ctx.openValues.has(value);
  return (
    <ItemContext value={{ value, isOpen }}>
      <View style={[styles.item, first && styles.itemFirst]}>{children}</View>
    </ItemContext>
  );
}

export type AccordionTriggerProps = {
  children: ReactNode;
  disabled?: boolean;
};

export function AccordionTrigger({ children, disabled }: AccordionTriggerProps) {
  const styles = useTriggerStyles();
  const ctx = useAccordion("AccordionTrigger");
  const item = useItem("AccordionTrigger");

  return (
    <Pressable
      onPress={() => ctx.toggle(item.value)}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ expanded: item.isOpen, disabled }}
      style={({ pressed }) => [
        styles.base,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.label}>{children}</Text>
      <Text style={styles.chevron}>{item.isOpen ? "▴" : "▾"}</Text>
    </Pressable>
  );
}

export type AccordionContentProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AccordionContent({ children, style }: AccordionContentProps) {
  const styles = useContentStyles();
  const item = useItem("AccordionContent");
  if (!item.isOpen) return null;
  return <View style={[styles.content, style]}>{children}</View>;
}
