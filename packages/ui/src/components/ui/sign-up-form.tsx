import { forwardRef, useState, type ReactNode } from "react";
import { Text, View, type ViewProps } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { createStyles } from "../../utils/use-styles";

export type SignUpValues = {
  emailAddress: string;
  password: string;
  // Each optional field is present only when its matching prop enables it.
  firstName?: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
  acceptedTerms?: boolean;
};

export type SignUpFormProps = Omit<ViewProps, "children" | "style" | "onSubmit"> & {
  onSubmit: (values: SignUpValues) => void;
  loading?: boolean;
  error?: string;
  emailError?: string;
  passwordError?: string;
  nameFields?: boolean;
  usernameField?: boolean;
  phoneField?: boolean;
  requireConfirm?: boolean;
  requireTerms?: boolean;
  // Easiest path: pass a URL and the link opens it in an in-app browser
  // (expo-web-browser). For full control, pass onTermsPress/onPrivacyPress
  // instead (in-app route, custom sheet, …) — a handler wins over its URL.
  termsUrl?: string;
  privacyUrl?: string;
  // Replaces the entire default label, so termsUrl/onTermsPress are then ignored.
  termsLabel?: ReactNode;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
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
  // Top-align the box with the (often multi-line) terms text instead of centering.
  termsCheckbox: { alignItems: "flex-start" },
  termsText: {
    flex: 1,
    fontSize: t.typography.fontSize.sm,
    lineHeight: t.typography.lineHeight.sm,
    color: t.colors.foregroundMuted,
  },
  termsLink: { color: t.colors.primary, fontWeight: "500" as const },
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
    usernameField = false,
    phoneField = false,
    requireConfirm = false,
    requireTerms = false,
    termsUrl,
    privacyUrl,
    termsLabel,
    onTermsPress,
    onPrivacyPress,
    submitLabel = "Create account",
    footer,
    ...rest
  },
  ref,
) {
  const styles = useStyles();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const mismatch = requireConfirm && confirm.length > 0 && password !== confirm;
  const namesOk = !nameFields || (firstName.trim().length > 0 && lastName.trim().length > 0);
  const usernameOk = !usernameField || username.trim().length > 0;
  const phoneOk = !phoneField || phoneNumber.trim().length > 0;
  const confirmOk = !requireConfirm || (confirm.length > 0 && !mismatch);
  const termsOk = !requireTerms || acceptedTerms;
  const canSubmit =
    emailAddress.trim().length > 0 &&
    password.length > 0 &&
    namesOk &&
    usernameOk &&
    phoneOk &&
    confirmOk &&
    termsOk &&
    !loading;

  const handleSubmit = () => {
    onSubmit({
      emailAddress: emailAddress.trim(),
      password,
      ...(nameFields && { firstName: firstName.trim(), lastName: lastName.trim() }),
      ...(usernameField && { username: username.trim() }),
      ...(phoneField && { phoneNumber: phoneNumber.trim() }),
      ...(requireTerms && { acceptedTerms }),
    });
  };

  const openTerms =
    onTermsPress ?? (termsUrl ? () => { WebBrowser.openBrowserAsync(termsUrl); } : undefined);
  const openPrivacy =
    onPrivacyPress ?? (privacyUrl ? () => { WebBrowser.openBrowserAsync(privacyUrl); } : undefined);

  const termsNode =
    termsLabel ?? (
      <Text style={styles.termsText}>
        I agree to the{" "}
        <Text style={styles.termsLink} onPress={openTerms} suppressHighlighting>
          Terms of Service
        </Text>
        {" and "}
        <Text style={styles.termsLink} onPress={openPrivacy} suppressHighlighting>
          Privacy Policy
        </Text>
      </Text>
    );

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

      {usernameField && (
        <Input
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="ada"
          autoCapitalize="none"
          autoComplete="username"
          textContentType="username"
          editable={!loading}
        />
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
      {phoneField && (
        <Input
          label="Phone"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="+1 555 000 1234"
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          editable={!loading}
        />
      )}
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

      {requireTerms && (
        <Checkbox
          checked={acceptedTerms}
          onCheckedChange={setAcceptedTerms}
          disabled={loading}
          label={termsNode}
          style={styles.termsCheckbox}
        />
      )}

      <Button fullWidth loading={loading} disabled={!canSubmit} onPress={handleSubmit}>
        {submitLabel}
      </Button>

      {!!footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );
});
