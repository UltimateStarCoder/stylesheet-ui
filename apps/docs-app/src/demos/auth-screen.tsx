import { Text } from "react-native";
import {
  AuthScreen,
  SignInForm,
  SocialAuthButtons,
  GoogleIcon,
  AppleIcon,
  GitHubIcon,
  createStyles,
} from "@stylesheet-ui/ui";

const useStyles = createStyles((t) => ({
  footerText: { color: t.colors.foregroundMuted, fontSize: t.typography.fontSize.sm },
  link: { color: t.colors.primary, fontWeight: "600" },
}));

// Shows AuthScreen composing the other auth pieces into a realistic sign-in
// page. Visual only — onSubmit/onSelect are no-ops here; see the docs for the
// auth-provider wiring.
const PROVIDERS = [
  { key: "google", label: "Continue with Google", icon: <GoogleIcon /> },
  { key: "apple", label: "Continue with Apple", icon: <AppleIcon /> },
  { key: "github", label: "Continue with GitHub", icon: <GitHubIcon /> },
];

export default function AuthScreenDemo() {
  const styles = useStyles();

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
      <SocialAuthButtons dividerLabel="or continue with" layout="row" providers={PROVIDERS} onSelect={() => {}} />
    </AuthScreen>
  );
}
