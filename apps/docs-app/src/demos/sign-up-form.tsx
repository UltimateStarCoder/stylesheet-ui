import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SignUpForm, createStyles } from "@stylesheet-ui/ui";

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

export default function SignUpFormDemo() {
  const styles = useStyles();
  const [loading, setLoading] = useState(false);
  const submit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} testID="screen-sign-up-form">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Email + password</Text>
        <SignUpForm testID="sign-up-form-default" loading={loading} onSubmit={submit} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Name + confirm password</Text>
        <SignUpForm testID="sign-up-form-full" nameFields requireConfirm onSubmit={() => {}} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Username, phone & terms</Text>
        <SignUpForm
          testID="sign-up-form-extras"
          usernameField
          phoneField
          requireTerms
          termsUrl="https://example.com/terms"
          privacyUrl="https://example.com/privacy"
          onSubmit={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Field error</Text>
        <SignUpForm
          testID="sign-up-form-error"
          emailError="That email is already taken."
          onSubmit={() => {}}
        />
      </View>
    </ScrollView>
  );
}
