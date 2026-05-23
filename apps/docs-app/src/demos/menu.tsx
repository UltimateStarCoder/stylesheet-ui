import { ScrollView, Text, View } from "react-native";
import { Button, Menu, createStyles, toast } from "@stylesheet-ui/ui";

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

export default function MenuDemo() {
  const styles = useStyles();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bottom-start</Text>
        <View style={styles.row}>
          <Menu
            trigger={<Button variant="secondary">Actions</Button>}
            items={[
              { label: "Rename",    onPress: () => toast.show("Rename pressed") },
              { label: "Duplicate", onPress: () => toast.show("Duplicate pressed") },
              { label: "Archive",   onPress: () => toast.show("Archive pressed") },
              { label: "Delete",    onPress: () => toast.error("Delete pressed"), destructive: true },
            ]}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bottom-end (right aligned)</Text>
        <View style={[styles.row, { justifyContent: "flex-end" }]}>
          <Menu
            placement="bottom-end"
            trigger={<Button variant="ghost">⋯</Button>}
            items={[
              { label: "Share",   onPress: () => toast.show("Share pressed") },
              { label: "Export",  onPress: () => toast.show("Export pressed") },
              { label: "Disable", onPress: () => toast.show("Disable pressed"), disabled: true },
            ]}
          />
        </View>
      </View>
    </ScrollView>
  );
}
