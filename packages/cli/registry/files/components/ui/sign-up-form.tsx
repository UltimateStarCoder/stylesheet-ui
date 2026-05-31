import { forwardRef, useState, type ReactNode } from "react";
import { Text, View, type ViewProps } from "react-native";
import { Button } from "./button";
import { Input } from "./input";
import { createStyles } from "../../utils/use-styles";

export type SignUpValues = { emailAddress: string; password: string };

// Email + password sign-up UI. Hands values to `onSubmit`; the consumer
// creates the account with their auth provider, then typically renders an
// <OtpInput> next to collect the emailed verification code.
export type SignUpFormProps = Omit<ViewProps, "children" | "style" | "onSubmit"> & {
  onSubmit: (values: SignUpValues) => void;
  loading?: boolean;
  error?: string;
  emailError?: string;
  passwordError?: string;
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

export const SignUpForm = forwardRef<View, SignUpFormProps>(function SignUpForm(
  {
    onSubmit,
    loading = false,
    error,
    emailError,
    passwordError,
    submitLabel = "Create account",
    footer,
    ...rest
  },
  ref,
) {
  const styles = useStyles();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = emailAddress.trim().length > 0 && password.length > 0 && !loading;

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
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        error={passwordError}
        placeholder="Create a password"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password-new"
        textContentType="newPassword"
        editable={!loading}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <Button
        fullWidth
        loading={loading}
        disabled={!canSubmit}
        onPress={() => onSubmit({ emailAddress: emailAddress.trim(), password })}
      >
        {submitLabel}
      </Button>

      {!!footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );
});
