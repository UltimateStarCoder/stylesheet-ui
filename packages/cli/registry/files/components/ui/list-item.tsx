import { forwardRef, type ReactNode } from "react";
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { createStyles } from "../../utils/use-styles";

export type ListItemProps = {
  title: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  onPress?: PressableProps["onPress"];
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const useStyles = createStyles((t) => ({
  base: {
    flexDirection: "row",
    alignItems: "center",
    gap: t.spacing.md,
    paddingVertical: t.spacing.md,
    paddingHorizontal: t.spacing.lg,
    backgroundColor: t.colors.surface,
  },
  pressed: { backgroundColor: t.colors.surfaceMuted },
  disabled: { opacity: 0.5 },
  body: { flex: 1, gap: 2 },
  title: {
    fontSize: t.typography.fontSize.md,
    lineHeight: t.typography.lineHeight.md,
    color: t.colors.foreground,
    fontWeight: "500" as const,
  },
  subtitle: {
    fontSize: t.typography.fontSize.sm,
    lineHeight: t.typography.lineHeight.sm,
    color: t.colors.foregroundMuted,
  },
}));

export const ListItem = forwardRef<View, ListItemProps>(function ListItem(
  { title, subtitle, left, right, onPress, disabled, style },
  ref,
) {
  const styles = useStyles();

  const content = (
    <>
      {left}
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
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
