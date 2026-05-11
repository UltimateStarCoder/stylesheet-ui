import { forwardRef, type ReactNode } from "react";
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useStyles } from "../../utils/cn";

export type SettingsRowProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  right?: ReactNode;
  onPress?: PressableProps["onPress"];
  disabled?: boolean;
  destructive?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const SettingsRow = forwardRef<View, SettingsRowProps>(function SettingsRow(
  { title, description, icon, right, onPress, disabled, destructive, style },
  ref,
) {
  const styles = useStyles((t) => ({
    base: {
      flexDirection: "row",
      alignItems: "center",
      gap: t.spacing.md,
      paddingVertical: t.spacing.md,
      paddingHorizontal: t.spacing.lg,
      backgroundColor: t.colors.surface,
      minHeight: 56,
    },
    pressed: { backgroundColor: t.colors.surfaceMuted },
    disabled: { opacity: 0.5 },
    iconBox: {
      width: 28,
      height: 28,
      borderRadius: t.radius.sm,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: t.colors.surfaceMuted,
    },
    body: { flex: 1, gap: 2 },
    title: {
      fontSize: t.typography.fontSize.md,
      lineHeight: t.typography.lineHeight.md,
      color: t.colors.foreground,
      fontWeight: "500" as const,
    },
    titleDestructive: { color: t.colors.destructive },
    description: {
      fontSize: t.typography.fontSize.sm,
      lineHeight: t.typography.lineHeight.sm,
      color: t.colors.foregroundMuted,
    },
  }));

  const content = (
    <>
      {!!icon && <View style={styles.iconBox}>{icon}</View>}
      <View style={styles.body}>
        <Text style={[styles.title, destructive && styles.titleDestructive]}>{title}</Text>
        {!!description && <Text style={styles.description}>{description}</Text>}
      </View>
      {right}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.base,
          pressed && !disabled && styles.pressed,
          disabled && styles.disabled,
          style,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View ref={ref} style={[styles.base, disabled && styles.disabled, style]}>
      {content}
    </View>
  );
});
