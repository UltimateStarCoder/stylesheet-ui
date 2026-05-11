import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Modal, Text, useStyles } from "@stylesheet-ui/ui";

export default function ModalDemo() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const styles = useStyles((t) => ({
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Confirmation</Text>
        <Button variant="destructive" onPress={() => setConfirmOpen(true)}>
          Delete account
        </Button>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Informational</Text>
        <Button variant="secondary" onPress={() => setInfoOpen(true)}>
          Show details
        </Button>
      </View>

      <Modal
        visible={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete account?"
        description="This will permanently remove your account and all associated data. This action can't be undone."
        footer={
          <>
            <Button variant="ghost" onPress={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onPress={() => setConfirmOpen(false)}>Delete</Button>
          </>
        }
      />

      <Modal
        visible={infoOpen}
        onClose={() => setInfoOpen(false)}
        title="What's new"
        description="Version 0.1 ships with the foundation component set."
      >
        <Text style={styles.bodyText}>
          Button, Input, Card, Text, Avatar, Badge, ListItem, Modal, Tabs, and SettingsRow.
        </Text>
      </Modal>
    </ScrollView>
  );
}
