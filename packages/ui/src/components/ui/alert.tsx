import { forwardRef, type ReactNode } from "react";
import {
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { createStyles } from "../../utils/use-styles";

export type AlertVariant = "info" | "success" | "warning" | "destructive";

export type AlertProps = {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  icon?: ReactNode;
  onClose?: () => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const useStyles = createStyles((t) => ({
  base: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: t.spacing.sm,
    padding: t.spacing.md,
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  info:        { borderColor: t.colors.primary },
  success:     { borderColor: t.colors.success },
  warning:     { borderColor: t.colors.warning },
  destructive: { borderColor: t.colors.destructive },

  iconBox: { paddingTop: 2 },
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

  close: { width: 24, height: 24, alignItems: "center", justifyContent: "center" },
  closeText: {
    fontSize: t.typography.fontSize.md,
    color: t.colors.foregroundMuted,
  },
}));

export const Alert = forwardRef<View, AlertProps>(function Alert(
  { variant = "info", title, description, icon, onClose, children, style },
  ref,
) {
  const styles = useStyles();
  const variantStyle = styles[variant];

  return (
    <View
      ref={ref}
      accessibilityRole="alert"
      style={[styles.base, variantStyle, style]}
    >
      {!!icon && <View style={styles.iconBox}>{icon}</View>}
      <View style={styles.body}>
        {!!title && <Text style={styles.title}>{title}</Text>}
        {!!description && <Text style={styles.description}>{description}</Text>}
        {children}
      </View>
      {!!onClose && (
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          hitSlop={8}
          style={styles.close}
        >
          <Text style={styles.closeText}>×</Text>
        </Pressable>
      )}
    </View>
  );
});
