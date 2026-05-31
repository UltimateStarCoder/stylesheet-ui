import { forwardRef, useState, type ReactNode } from "react";
import { Pressable, Text, View, type ViewProps } from "react-native";
import { Button } from "./button";
import { Input } from "./input";
import { createStyles } from "../../utils/use-styles";

export type SignInValues = { emailAddress: string; password: string };

// Email + password sign-in UI. Holds its own field state and hands the values
// to `onSubmit`; the consumer performs the actual sign-in against their auth
// provider and feeds `loading` / `error` back in.
export type SignInFormProps = Omit<ViewProps, "children" | "style" | "onSubmit"> & {
  onSubmit: (values: SignInValues) => void;
  loading?: boolean;
  // Top-level error (e.g. "Couldn't sign in"). Field-level hints can be passed
  // through `emailError` / `passwordError`.
  error?: string;
  emailError?: string;
  passwordError?: string;
  onForgotPassword?: () => void;
  submitLabel?: string;
  // Rendered under the submit button — e.g. a "Sign up" link.
  footer?: ReactNode;
};

const useStyles = createStyles((t) => ({
  root: { gap: t.spacing.md },
  forgot: { alignSelf: "flex-end" },
  forgotText: {
    color: t.colors.primary,
    fontSize: t.typography.fontSize.sm,
    lineHeight: t.typography.lineHeight.sm,
    fontWeight: "500" as const,
  },
  error: {
    color: t.colors.destructive,
    fontSize: t.typography.fontSize.sm,
    lineHeight: t.typography.lineHeight.sm,
  },
  footer: { marginTop: t.spacing.xs, alignItems: "center" },
}));

export const SignInForm = forwardRef<View, SignInFormProps>(function SignInForm(
  {
    onSubmit,
    loading = false,
    error,
    emailError,
    passwordError,
    onForgotPassword,
    submitLabel = "Sign in",
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
        placeholder="Enter your password"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
        textContentType="password"
        editable={!loading}
      />

      {!!onForgotPassword && (
        <Pressable style={styles.forgot} onPress={onForgotPassword} disabled={loading}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>
      )}

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
