import { forwardRef } from "react";
import {
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { createStyles } from "../../utils/use-styles";
import { Modal } from "./modal";

export type AlertDialogProps = Omit<ViewProps, "children" | "style"> & {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmTestID?: string;
  cancelTestID?: string;
  destructive?: boolean;
  style?: StyleProp<ViewStyle>;
};

const useStyles = createStyles((t) => ({
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: t.spacing.sm,
    marginTop: t.spacing.sm,
  },
  btn: {
    paddingVertical: t.spacing.sm,
    paddingHorizontal: t.spacing.lg,
    borderRadius: t.radius.md,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPressed: { opacity: 0.85 },
  cancel:           { backgroundColor: t.colors.surfaceMuted, borderWidth: 1, borderColor: t.colors.border },
  cancelLabel:      { color: t.colors.foreground, fontWeight: "600" },
  confirm:          { backgroundColor: t.colors.primary },
  confirmLabel:     { color: t.colors.primaryForeground, fontWeight: "600" },
  destructive:      { backgroundColor: t.colors.destructive },
  destructiveLabel: { color: t.colors.destructiveForeground, fontWeight: "600" },
  labelText: {
    fontSize: t.typography.fontSize.md,
    lineHeight: t.typography.lineHeight.md,
  },
}));

export const AlertDialog = forwardRef<View, AlertDialogProps>(function AlertDialog(
  {
    visible,
    onCancel,
    onConfirm,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    confirmTestID,
    cancelTestID,
    destructive = false,
    style,
    ...rest
  },
  ref,
) {
  const styles = useStyles();

  return (
    <Modal
      ref={ref}
      visible={visible}
      onClose={onCancel}
      title={title}
      description={description}
      accessibilityLabel={title}
      dismissOnBackdrop={false}
      contentStyle={style}
      {...rest}
    >
      <View style={styles.actions}>
        <Pressable
          testID={cancelTestID}
          onPress={onCancel}
          accessibilityRole="button"
          style={({ pressed }) => [styles.btn, styles.cancel, pressed && styles.btnPressed]}
        >
          <Text style={[styles.labelText, styles.cancelLabel]}>{cancelLabel}</Text>
        </Pressable>
        <Pressable
          testID={confirmTestID}
          onPress={onConfirm}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.btn,
            destructive ? styles.destructive : styles.confirm,
            pressed && styles.btnPressed,
          ]}
        >
          <Text
            style={[
              styles.labelText,
              destructive ? styles.destructiveLabel : styles.confirmLabel,
            ]}
          >
            {confirmLabel}
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
});
