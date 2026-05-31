import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SocialAuthButtons, createStyles } from "@stylesheet-ui/ui";

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
  glyph: { fontSize: 16, fontWeight: "700", color: t.colors.foreground },
}));

export default function SocialAuthButtonsDemo() {
  const styles = useStyles();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const select = (key: string) => {
    setLoadingKey(key);
    setTimeout(() => setLoadingKey(null), 1200);
  };

  const providers = [
    { key: "oauth_google", label: "Continue with Google", icon: <Text style={styles.glyph}>G</Text> },
    { key: "oauth_apple", label: "Continue with Apple", icon: <Text style={styles.glyph}></Text> },
    { key: "oauth_github", label: "Continue with GitHub", icon: <Text style={styles.glyph}></Text> },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} testID="screen-social-auth-buttons">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With divider</Text>
        <SocialAuthButtons
          testID="social-auth-buttons-divider"
          dividerLabel="or continue with"
          providers={providers}
          loadingKey={loadingKey}
          onSelect={select}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>No divider</Text>
        <SocialAuthButtons
          testID="social-auth-buttons-plain"
          providers={providers}
          loadingKey={loadingKey}
          onSelect={select}
        />
      </View>
    </ScrollView>
  );
}
