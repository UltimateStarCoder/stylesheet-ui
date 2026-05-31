import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SignInForm, createStyles } from "@stylesheet-ui/ui";

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

export default function SignInFormDemo() {
  const styles = useStyles();
  const [loading, setLoading] = useState(false);
  const submit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} testID="screen-sign-in-form">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Default</Text>
        <SignInForm
          testID="sign-in-form-default"
          loading={loading}
          onSubmit={submit}
          onForgotPassword={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Error state</Text>
        <SignInForm
          testID="sign-in-form-error"
          error="Invalid email or password."
          onSubmit={() => {}}
        />
      </View>
    </ScrollView>
  );
}
