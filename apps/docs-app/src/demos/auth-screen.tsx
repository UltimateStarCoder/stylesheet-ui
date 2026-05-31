import { Text } from "react-native";
import { AuthScreen, SignInForm, SocialAuthButtons, createStyles, useTheme } from "@stylesheet-ui/ui";
import { GoogleIcon, AppleIcon, GitHubIcon } from "./social-icons";

const useStyles = createStyles((t) => ({
  footerText: { color: t.colors.foregroundMuted, fontSize: t.typography.fontSize.sm },
  link: { color: t.colors.primary, fontWeight: "600" },
}));

// Shows AuthScreen composing the other auth pieces into a realistic sign-in
// page. Visual only — onSubmit/onSelect are no-ops here; see the docs for the
// auth-provider wiring.
export default function AuthScreenDemo() {
  const styles = useStyles();
  const fg = useTheme().colors.foreground;

  const providers = [
    { key: "google", label: "Continue with Google", icon: <GoogleIcon color={fg} /> },
    { key: "apple", label: "Continue with Apple", icon: <AppleIcon color={fg} /> },
    { key: "github", label: "Continue with GitHub", icon: <GitHubIcon color={fg} /> },
  ];

  return (
    <AuthScreen
      testID="screen-auth-screen"
      title="Welcome back"
      subtitle="Sign in to continue to your account"
      footer={
        <Text style={styles.footerText}>
          Don&apos;t have an account? <Text style={styles.link}>Sign up</Text>
        </Text>
      }
    >
      <SignInForm onSubmit={() => {}} onForgotPassword={() => {}} />
      <SocialAuthButtons dividerLabel="or continue with" layout="row" providers={providers} onSelect={() => {}} />
    </AuthScreen>
  );
}
