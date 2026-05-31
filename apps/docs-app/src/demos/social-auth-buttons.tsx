import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import {
  SocialAuthButtons,
  GoogleIcon,
  AppleIcon,
  GitHubIcon,
  createStyles,
} from "@stylesheet-ui/ui";

const useStyles = createStyles((t) => ({
  container: { padding: t.spacing.lg, gap: t.spacing.xl, backgroundColor: t.colors.background, flexGrow: 1 },
  section: { gap: t.spacing.sm },
  sectionTitle: {
    fontSize: t.typography.fontSize.sm,
    fontWeight: "600",
    color: t.colors.foregroundMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
}));

const PROVIDERS = [
  { key: "google", label: "Continue with Google", icon: <GoogleIcon /> },
  { key: "apple", label: "Continue with Apple", icon: <AppleIcon /> },
  { key: "github", label: "Continue with GitHub", icon: <GitHubIcon /> },
];

export default function SocialAuthButtonsDemo() {
  const styles = useStyles();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const select = (key: string) => {
    setLoadingKey(key);
    setTimeout(() => setLoadingKey(null), 1200);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} testID="screen-social-auth-buttons">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With divider</Text>
        <SocialAuthButtons
          testID="social-auth-buttons-divider"
          dividerLabel="or continue with"
          providers={PROVIDERS}
          loadingKey={loadingKey}
          onSelect={select}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>No divider</Text>
        <SocialAuthButtons
          testID="social-auth-buttons-plain"
          providers={PROVIDERS}
          loadingKey={loadingKey}
          onSelect={select}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Row (icon-only)</Text>
        <SocialAuthButtons
          testID="social-auth-buttons-row"
          layout="row"
          dividerLabel="or continue with"
          providers={PROVIDERS}
          loadingKey={loadingKey}
          onSelect={select}
        />
      </View>
    </ScrollView>
  );
}
