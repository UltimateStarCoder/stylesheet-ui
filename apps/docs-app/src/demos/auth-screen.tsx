import { useState } from "react";
import { Text } from "react-native";
import {
  AuthScreen,
  SignInForm,
  SignUpForm,
  ForgotPasswordForm,
  OtpInput,
  NewPasswordForm,
  SocialAuthButtons,
  GoogleIcon,
  AppleIcon,
  GitHubIcon,
  createStyles,
} from "@stylesheet-ui/ui";

type Step = "sign-in" | "sign-up" | "forgot" | "verify" | "reset";

const COPY: Record<Step, { title: string; subtitle: string }> = {
  "sign-in": { title: "Welcome back", subtitle: "Sign in to continue to your account" },
  "sign-up": { title: "Create your account", subtitle: "Sign up to get started" },
  forgot: { title: "Forgot password?", subtitle: "Enter your email and we'll send a reset code" },
  verify: { title: "Check your email", subtitle: "Enter the 6-digit code we sent you" },
  reset: { title: "Set a new password", subtitle: "Choose a new password for your account" },
};

const useStyles = createStyles((t) => ({
  footerText: { color: t.colors.foregroundMuted, fontSize: t.typography.fontSize.sm, textAlign: "center" },
  link: { color: t.colors.primary, fontWeight: "600", fontSize: t.typography.fontSize.sm },
}));

const PROVIDERS = [
  { key: "google", label: "Continue with Google", icon: <GoogleIcon /> },
  { key: "apple", label: "Continue with Apple", icon: <AppleIcon /> },
  { key: "github", label: "Continue with GitHub", icon: <GitHubIcon /> },
];

// AuthScreen is just the boxed, keyboard-aware shell. This demo walks the whole
// auth flow through that one box — sign-in, sign-up, and the reset chain
// (forgot -> verify code -> new password). Visual only; transitions fire on
// submit so you can click through it.
export default function AuthScreenDemo() {
  const styles = useStyles();
  const [step, setStep] = useState<Step>("sign-in");
  const [code, setCode] = useState("");

  const go = (next: Step) => {
    setCode("");
    setStep(next);
  };

  const copy = COPY[step];
  const showSocial = step === "sign-in" || step === "sign-up";

  const footer =
    step === "sign-in" ? (
      <Text style={styles.footerText}>
        Don&apos;t have an account? <Text style={styles.link} onPress={() => go("sign-up")}>Sign up</Text>
      </Text>
    ) : step === "sign-up" ? (
      <Text style={styles.footerText}>
        Already have an account? <Text style={styles.link} onPress={() => go("sign-in")}>Sign in</Text>
      </Text>
    ) : (
      <Text style={styles.link} onPress={() => go("sign-in")}>Back to sign in</Text>
    );

  return (
    <AuthScreen testID="screen-auth-screen" title={copy.title} subtitle={copy.subtitle} footer={footer}>
      {step === "sign-in" && (
        <SignInForm onSubmit={() => {}} onForgotPassword={() => go("forgot")} />
      )}
      {step === "sign-up" && <SignUpForm nameFields requireConfirm onSubmit={() => {}} />}
      {step === "forgot" && <ForgotPasswordForm onSubmit={() => go("verify")} />}
      {step === "verify" && (
        <OtpInput value={code} onChange={setCode} onComplete={() => go("reset")} autoFocus />
      )}
      {step === "reset" && (
        <NewPasswordForm requireConfirm submitLabel="Reset password" onSubmit={() => go("sign-in")} />
      )}
      {showSocial && (
        <SocialAuthButtons dividerLabel="or continue with" layout="row" providers={PROVIDERS} onSelect={() => {}} />
      )}
    </AuthScreen>
  );
}
