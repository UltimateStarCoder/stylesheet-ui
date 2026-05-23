import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Alert, createStyles } from "@stylesheet-ui/ui";

const useStyles = createStyles((t) => ({
  container: {
    padding: t.spacing.lg,
    gap: t.spacing.xl,
    backgroundColor: t.colors.background,
    flexGrow: 1,
  },
  section:      { gap: t.spacing.sm },
  sectionTitle: {
    fontSize: t.typography.fontSize.sm,
    fontWeight: "600",
    color: t.colors.foregroundMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  stack: { gap: t.spacing.md },
}));

export default function AlertDemo() {
  const styles = useStyles();
  const [closableOpen, setClosableOpen] = useState(true);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Variants</Text>
        <View style={styles.stack}>
          <Alert variant="info" title="Heads up" description="This is an informational message." />
          <Alert variant="success" title="Saved" description="Your changes are live." />
          <Alert variant="warning" title="Careful" description="This action affects all collaborators." />
          <Alert variant="destructive" title="Failed" description="Could not save changes. Try again." />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dismissible</Text>
        {closableOpen && (
          <Alert
            variant="info"
            title="Cookies are enabled"
            description="We use cookies for session and analytics."
            onClose={() => setClosableOpen(false)}
          />
        )}
      </View>
    </ScrollView>
  );
}
