import { forwardRef, useState, type ReactNode } from "react";
import { Text, View, type ViewProps } from "react-native";
import { Button } from "./button";
import { Input } from "./input";
import { createStyles } from "../../utils/use-styles";

export type SignUpValues = {
  emailAddress: string;
  password: string;
  // Present only when `nameFields` is enabled.
  firstName?: string;
  lastName?: string;
};

// Account-creation UI. Hands values to `onSubmit`; the consumer creates the
// account with their auth provider, then typically renders an <OtpInput> next
// to collect the emailed verification code.
//
// `nameFields` adds First/Last name inputs (included in the submitted values).
// `requireConfirm` adds a confirm-password field with match validation.
export type SignUpFormProps = Omit<ViewProps, "children" | "style" | "onSubmit"> & {
  onSubmit: (values: SignUpValues) => void;
  loading?: boolean;
  error?: string;
  emailError?: string;
  passwordError?: string;
  nameFields?: boolean;
  requireConfirm?: boolean;
  submitLabel?: string;
  footer?: ReactNode;
};

const useStyles = createStyles((t) => ({
  root: { gap: t.spacing.md },
  nameRow: { flexDirection: "row", gap: t.spacing.sm },
  nameField: { flex: 1 },
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
    nameFields = false,
    requireConfirm = false,
    submitLabel = "Create account",
    footer,
    ...rest
  },
  ref,
) {
  const styles = useStyles();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const mismatch = requireConfirm && confirm.length > 0 && password !== confirm;
  const namesOk = !nameFields || (firstName.trim().length > 0 && lastName.trim().length > 0);
  const confirmOk = !requireConfirm || (confirm.length > 0 && !mismatch);
  const canSubmit =
    emailAddress.trim().length > 0 && password.length > 0 && namesOk && confirmOk && !loading;

  const handleSubmit = () => {
    onSubmit({
      emailAddress: emailAddress.trim(),
      password,
      ...(nameFields && { firstName: firstName.trim(), lastName: lastName.trim() }),
    });
  };

  return (
    <View ref={ref} style={styles.root} {...rest}>
      {nameFields && (
        <View style={styles.nameRow}>
          <Input
            containerStyle={styles.nameField}
            label="First name"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Ada"
            autoCapitalize="words"
            autoComplete="name-given"
            textContentType="givenName"
            editable={!loading}
          />
          <Input
            containerStyle={styles.nameField}
            label="Last name"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Lovelace"
            autoCapitalize="words"
            autoComplete="name-family"
            textContentType="familyName"
            editable={!loading}
          />
        </View>
      )}

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

      <Button fullWidth loading={loading} disabled={!canSubmit} onPress={handleSubmit}>
        {submitLabel}
      </Button>

      {!!footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );
});
