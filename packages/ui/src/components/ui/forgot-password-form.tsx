import { forwardRef, useState, type ReactNode } from "react";
import { Text, View, type ViewProps } from "react-native";
import { Button } from "./button";
import { Input } from "./input";
import { createStyles } from "../../utils/use-styles";

export type ForgotPasswordValues = { emailAddress: string };

export type ForgotPasswordFormProps = Omit<ViewProps, "children" | "style" | "onSubmit"> & {
  onSubmit: (values: ForgotPasswordValues) => void;
  loading?: boolean;
  error?: string;
  emailError?: string;
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

export const ForgotPasswordForm = forwardRef<View, ForgotPasswordFormProps>(function ForgotPasswordForm(
  { onSubmit, loading = false, error, emailError, submitLabel = "Send reset code", footer, ...rest },
  ref,
) {
  const styles = useStyles();
  const [emailAddress, setEmailAddress] = useState("");
  const canSubmit = emailAddress.trim().length > 0 && !loading;

  return (
    <View ref={ref} style={styles.root} {...rest}>
      <Input
        label="Email"
        value={emailAddress}
        onChangeText={setEmailAddress}
        error={emailError}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        editable={!loading}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <Button
        fullWidth
        loading={loading}
        disabled={!canSubmit}
        onPress={() => onSubmit({ emailAddress: emailAddress.trim() })}
      >
        {submitLabel}
      </Button>

      {!!footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );
});
