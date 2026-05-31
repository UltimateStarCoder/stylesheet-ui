import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Modal, Text, createStyles } from "@stylesheet-ui/ui";

const useStyles = createStyles((t) => ({
  container: {
    padding: t.spacing.lg,
    gap: t.spacing.xl,
    backgroundColor: t.colors.background,
    flexGrow: 1,
  },
  section: { gap: t.spacing.sm },
  label: {
    fontSize: t.typography.fontSize.sm,
    fontWeight: "600",
    color: t.colors.foregroundMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bodyText: {
    fontSize: t.typography.fontSize.sm,
    lineHeight: t.typography.lineHeight.sm,
    color: t.colors.foregroundMuted,
  },
}));

export default function ModalDemo() {
  const styles = useStyles();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container} testID="screen-modal">
      <View style={styles.section}>
        <Text style={styles.label}>Confirmation</Text>
        <Button fullWidth variant="destructive" onPress={() => setConfirmOpen(true)} testID="modal-open-confirm">
          Delete account
        </Button>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Informational</Text>
        <Button fullWidth variant="secondary" onPress={() => setInfoOpen(true)} testID="modal-open-info">
          Show details
        </Button>
      </View>

      <Modal
        visible={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete account?"
        description="This will permanently remove your account and all associated data. This action can't be undone."
        testID="modal-confirm-panel"
        footer={
          <>
            <Button variant="ghost" onPress={() => setConfirmOpen(false)} testID="modal-confirm-cancel">Cancel</Button>
            <Button variant="destructive" onPress={() => setConfirmOpen(false)} testID="modal-confirm-delete">Delete</Button>
          </>
        }
      />

      <Modal
        visible={infoOpen}
        onClose={() => setInfoOpen(false)}
        title="What's new"
        description="Version 0.0.3 adds BottomSheet, Toast, createStyles, cn(), and CLI --dry-run/--diff."
        testID="modal-info-panel"
      >
        <Text style={styles.bodyText}>
          19 components, plain StyleSheet, you own the source.
        </Text>
      </Modal>
    </ScrollView>
  );
}
