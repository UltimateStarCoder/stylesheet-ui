import { forwardRef, useState } from "react";
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { createStyles } from "../../utils/use-styles";
import { BottomSheet } from "./bottom-sheet";
import { ListItem } from "./list-item";

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type SelectProps = Omit<PressableProps, "children" | "style" | "onPress"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (next: string) => void;
  options: SelectOption[];
  placeholder?: string;
  title?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const useStyles = createStyles((t) => ({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: t.spacing.sm,
    paddingVertical: t.spacing.sm,
    paddingHorizontal: t.spacing.md,
    minHeight: 40,
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  triggerPressed: { backgroundColor: t.colors.surfaceMuted },
  disabled: { opacity: 0.5 },
  value: {
    fontSize: t.typography.fontSize.md,
    lineHeight: t.typography.lineHeight.md,
    color: t.colors.foreground,
    flex: 1,
  },
  placeholder: { color: t.colors.foregroundMuted },
  chevron: { color: t.colors.foregroundMuted, fontSize: t.typography.fontSize.md },

  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: t.colors.primary,
  },
}));

export const Select = forwardRef<View, SelectProps>(function Select(
  {
    value,
    defaultValue,
    onValueChange,
    options,
    placeholder = "Select…",
    title,
    disabled,
    style,
    ...rest
  },
  ref,
) {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState<string | undefined>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const currentOption = options.find((o) => o.value === current);

  const handleSelect = (next: string) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        ref={ref}
        onPress={() => setOpen(true)}
        disabled={disabled}
        accessibilityRole="combobox"
        accessibilityState={{ disabled, expanded: open }}
        accessibilityValue={{ text: currentOption?.label ?? placeholder }}
        style={({ pressed }) => [
          styles.trigger,
          pressed && !disabled && styles.triggerPressed,
          disabled && styles.disabled,
          style,
        ]}
        {...rest}
      >
        <Text
          numberOfLines={1}
          style={[styles.value, !currentOption && styles.placeholder]}
        >
          {currentOption?.label ?? placeholder}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        {options.map((opt) => (
          <ListItem
            key={opt.value}
            title={opt.label}
            subtitle={opt.description}
            disabled={opt.disabled}
            onPress={() => handleSelect(opt.value)}
            right={opt.value === current ? <View style={styles.selectedDot} /> : undefined}
          />
        ))}
      </BottomSheet>
    </>
  );
});
