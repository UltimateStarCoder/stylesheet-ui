import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { AlertDialog, Button, createStyles } from "@stylesheet-ui/ui";

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
  row: { flexDirection: "row", gap: t.spacing.sm, flexWrap: "wrap" },
}));

export default function AlertDialogDemo() {
  const styles = useStyles();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [destructiveOpen, setDestructiveOpen] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container} testID="screen-alert-dialog">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Confirm</Text>
        <View style={styles.row}>
          <Button variant="secondary" onPress={() => setConfirmOpen(true)} testID="alert-dialog-confirm-trigger">
            Open confirm
          </Button>
        </View>
        <AlertDialog
          visible={confirmOpen}
          title="Publish post?"
          description="Your post will be visible to everyone in your organization."
          confirmLabel="Publish"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => setConfirmOpen(false)}
          testID="alert-dialog-confirm-panel"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Destructive</Text>
        <View style={styles.row}>
          <Button variant="destructive" onPress={() => setDestructiveOpen(true)} testID="alert-dialog-destructive-trigger">
            Delete account
          </Button>
        </View>
        <AlertDialog
          visible={destructiveOpen}
          title="Delete account?"
          description="This action cannot be undone. All projects, settings, and history will be permanently removed."
          confirmLabel="Delete"
          destructive
          onCancel={() => setDestructiveOpen(false)}
          onConfirm={() => setDestructiveOpen(false)}
          testID="alert-dialog-destructive-panel"
        />
      </View>
    </ScrollView>
  );
}
