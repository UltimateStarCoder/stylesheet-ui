import { forwardRef, type ReactNode } from "react";
import {
  Modal as RNModal,
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { createStyles } from "../../utils/use-styles";

export type ModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  dismissOnBackdrop?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

const useStyles = createStyles((t) => ({
  backdrop: {
    flex: 1,
    backgroundColor: t.colors.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: t.spacing.lg,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.lg,
    borderWidth: 1,
    borderColor: t.colors.border,
    padding: t.spacing.lg,
    gap: t.spacing.md,
    ...t.shadows.lg,
  },
  header:      { gap: t.spacing.xs },
  title: {
    fontSize: t.typography.fontSize.lg,
    lineHeight: t.typography.lineHeight.lg,
    color: t.colors.foreground,
    fontWeight: "600" as const,
  },
  description: {
    fontSize: t.typography.fontSize.sm,
    lineHeight: t.typography.lineHeight.sm,
    color: t.colors.foregroundMuted,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: t.spacing.sm,
    marginTop: t.spacing.sm,
  },
}));

export const Modal = forwardRef<View, ModalProps>(function Modal(
  {
    visible,
    onClose,
    title,
    description,
    children,
    footer,
    dismissOnBackdrop = true,
    contentStyle,
  },
  ref,
) {
  const styles = useStyles();

  return (
    <RNModal
      visible={visible}
      onRequestClose={onClose}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <Pressable
        style={styles.backdrop}
        onPress={dismissOnBackdrop ? onClose : undefined}
        accessibilityRole="button"
        accessibilityLabel="Close"
      >
        <Pressable
          ref={ref}
          style={[styles.card, contentStyle]}
          onPress={(e) => e.stopPropagation()}
        >
          {(title || description) && (
            <View style={styles.header}>
              {!!title && <Text style={styles.title}>{title}</Text>}
              {!!description && <Text style={styles.description}>{description}</Text>}
            </View>
          )}
          {children}
          {!!footer && <View style={styles.footer}>{footer}</View>}
        </Pressable>
      </Pressable>
    </RNModal>
  );
});
