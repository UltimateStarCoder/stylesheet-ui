import {
  createContext,
  forwardRef,
  useContext,
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

export type RadioSize = "sm" | "md" | "lg";

type RadioGroupContextValue = {
  value: string | null;
  onValueChange: (next: string) => void;
  disabled?: boolean;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroup(): RadioGroupContextValue {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error("<Radio> must be rendered inside <RadioGroup>.");
  }
  return ctx;
}

export type RadioGroupProps = {
  value: string | null;
  onValueChange: (next: string) => void;
  disabled?: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function RadioGroup({
  value,
  onValueChange,
  disabled,
  children,
  style,
}: RadioGroupProps) {
  const styles = useStyles((t) => ({
    group: { gap: t.spacing.sm },
  }));
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
      <View accessibilityRole="radiogroup" style={[styles.group, style]}>
        {children}
      </View>
    </RadioGroupContext.Provider>
  );
}

export type RadioProps = {
  value: string;
  label?: ReactNode;
  size?: RadioSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const SIZE_PX: Record<RadioSize, number> = { sm: 16, md: 20, lg: 24 };

export const Radio = forwardRef<View, RadioProps>(function Radio(
  { value, label, size = "md", disabled, style },
  ref,
) {
  const group = useRadioGroup();
  const px = SIZE_PX[size];
  const isChecked = group.value === value;
  const isDisabled = disabled || group.disabled;

  const styles = useStyles((t) => ({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: t.spacing.sm,
    },
    outer: {
      width: px,
      height: px,
      borderRadius: px / 2,
      borderWidth: 1.5,
      borderColor: t.colors.borderStrong,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: t.colors.surface,
    },
    outerChecked: { borderColor: t.colors.primary },
    inner: {
      width: px * 0.5,
      height: px * 0.5,
      borderRadius: px * 0.25,
      backgroundColor: t.colors.primary,
    },
    disabled: { opacity: 0.5 },
    label: {
      fontSize: t.typography.fontSize.md,
      lineHeight: t.typography.lineHeight.md,
      color: t.colors.foreground,
    },
  }));

  return (
    <Pressable
      ref={ref}
      onPress={() => group.onValueChange(value)}
      disabled={isDisabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: isChecked, disabled: isDisabled }}
      style={[styles.row, isDisabled && styles.disabled, style]}
    >
      <View style={[styles.outer, isChecked && styles.outerChecked]}>
        {isChecked && <View style={styles.inner} />}
      </View>
      {!!label &&
        (typeof label === "string" ? (
          <Text style={styles.label}>{label}</Text>
        ) : (
          label
        ))}
    </Pressable>
  );
});
