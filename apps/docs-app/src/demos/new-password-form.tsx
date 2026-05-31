import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { NewPasswordForm, createStyles } from "@stylesheet-ui/ui";

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

export default function NewPasswordFormDemo() {
  const styles = useStyles();
  const [loading, setLoading] = useState(false);
  const submit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} testID="screen-new-password-form">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With confirmation</Text>
        <NewPasswordForm testID="new-password-form-confirm" requireConfirm loading={loading} onSubmit={submit} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Single field</Text>
        <NewPasswordForm testID="new-password-form-single" onSubmit={() => {}} />
      </View>
    </ScrollView>
  );
}
