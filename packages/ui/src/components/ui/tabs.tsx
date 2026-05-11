import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useStyles } from "../../utils/cn";

type TabsContextValue = {
  value: string;
  setValue: (next: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error(`<${component}> must be rendered inside <Tabs>.`);
  }
  return ctx;
}

export type TabsProps = {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (next: string) => void;
  style?: StyleProp<ViewStyle>;
};

export const Tabs = forwardRef<View, TabsProps>(function Tabs(
  { children, value, defaultValue, onValueChange, style },
  ref,
) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const ctx = useMemo<TabsContextValue>(
    () => ({
      value: current,
      setValue: (next) => {
        if (!isControlled) setInternal(next);
        onValueChange?.(next);
      },
    }),
    [current, isControlled, onValueChange],
  );

  const styles = useStyles((t) => ({
    root: { gap: t.spacing.md },
  }));

  return (
    <TabsContext.Provider value={ctx}>
      <View ref={ref} style={[styles.root, style]}>
        {children}
      </View>
    </TabsContext.Provider>
  );
});

export type TabsListProps = { children: ReactNode; style?: StyleProp<ViewStyle> };

export function TabsList({ children, style }: TabsListProps) {
  const styles = useStyles((t) => ({
    list: {
      flexDirection: "row",
      backgroundColor: t.colors.surfaceMuted,
      borderRadius: t.radius.md,
      padding: t.spacing.xs,
      gap: t.spacing.xs,
    },
  }));
  return <View style={[styles.list, style]}>{children}</View>;
}

export type TabsTriggerProps = {
  value: string;
  children: ReactNode;
  disabled?: boolean;
};

export function TabsTrigger({ value, children, disabled }: TabsTriggerProps) {
  const ctx = useTabs("TabsTrigger");
  const active = ctx.value === value;

  const styles = useStyles((t) => ({
    base: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: t.spacing.sm,
      paddingHorizontal: t.spacing.md,
      borderRadius: t.radius.sm,
    },
    active:   { backgroundColor: t.colors.surface, ...t.shadows.sm },
    disabled: { opacity: 0.5 },
    label: {
      fontSize: t.typography.fontSize.sm,
      lineHeight: t.typography.lineHeight.sm,
      fontWeight: "600" as const,
      color: t.colors.foregroundMuted,
    },
    labelActive: { color: t.colors.foreground },
  }));

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active, disabled }}
      disabled={disabled}
      onPress={() => ctx.setValue(value)}
      style={[styles.base, active && styles.active, disabled && styles.disabled]}
    >
      <Text style={[styles.label, active && styles.labelActive]}>{children}</Text>
    </Pressable>
  );
}

export type TabsContentProps = {
  value: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function TabsContent({ value, children, style }: TabsContentProps) {
  const ctx = useTabs("TabsContent");
  if (ctx.value !== value) return null;
  return <View style={style}>{children}</View>;
}
