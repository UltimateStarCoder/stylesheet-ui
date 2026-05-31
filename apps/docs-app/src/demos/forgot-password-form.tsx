import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { ForgotPasswordForm, createStyles } from "@stylesheet-ui/ui";

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
  link: { color: t.colors.primary, fontWeight: "600", fontSize: t.typography.fontSize.sm },
}));

export default function ForgotPasswordFormDemo() {
  const styles = useStyles();
  const [loading, setLoading] = useState(false);
  const submit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} testID="screen-forgot-password-form">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Request a reset code</Text>
        <ForgotPasswordForm
          testID="forgot-password-form-default"
          loading={loading}
          onSubmit={submit}
          footer={<Text style={styles.link}>Back to sign in</Text>}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Error state</Text>
        <ForgotPasswordForm
          testID="forgot-password-form-error"
          error="We couldn't find an account for that email."
          onSubmit={() => {}}
        />
      </View>
    </ScrollView>
  );
}
