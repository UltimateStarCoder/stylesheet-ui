import { forwardRef, useState, type ReactNode } from "react";
import { Text, View, type ViewProps } from "react-native";
import { Button } from "./button";
import { Input } from "./input";
import { createStyles } from "../../utils/use-styles";

export type NewPasswordValues = { password: string };

export type NewPasswordFormProps = Omit<ViewProps, "children" | "style" | "onSubmit"> & {
  onSubmit: (values: NewPasswordValues) => void;
  loading?: boolean;
  error?: string;
  requireConfirm?: boolean;
  submitLabel?: string;
  footer?: ReactNode;
};

const useStyles = createStyles((t) => ({
  root: { gap: t.spacing.md },
  error: {
    color: t.colors.destructive,
    fontSize: t.typography.fontSize.sm,
    lineHeight: t.typography.lineHeight.sm,
  },
  footer: { marginTop: t.spacing.xs, alignItems: "center" },
}));

export const NewPasswordForm = forwardRef<View, NewPasswordFormProps>(function NewPasswordForm(
  {
    onSubmit,
    loading = false,
    error,
    requireConfirm = false,
    submitLabel = "Reset password",
    footer,
    ...rest
  },
  ref,
) {
  const styles = useStyles();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const mismatch = requireConfirm && confirm.length > 0 && password !== confirm;
  const canSubmit =
    password.length > 0 && !loading && (!requireConfirm || (confirm.length > 0 && !mismatch));

  return (
    <View ref={ref} style={styles.root} {...rest}>
      <Input
        label="New password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter a new password"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password-new"
        textContentType="newPassword"
        editable={!loading}
      />
      {requireConfirm && (
        <Input
          label="Confirm password"
          value={confirm}
          onChangeText={setConfirm}
          error={mismatch ? "Passwords don't match" : undefined}
          placeholder="Re-enter your password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password-new"
          textContentType="newPassword"
          editable={!loading}
        />
      )}

      {!!error && <Text style={styles.error}>{error}</Text>}

      <Button
        fullWidth
        loading={loading}
        disabled={!canSubmit}
        onPress={() => onSubmit({ password })}
      >
        {submitLabel}
      </Button>

      {!!footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );
});
