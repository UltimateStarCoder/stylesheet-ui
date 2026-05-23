import { ScrollView, Text, View } from "react-native";
import { Button, Tooltip, createStyles } from "@stylesheet-ui/ui";

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
  hint: { color: t.colors.foregroundMuted, fontSize: t.typography.fontSize.sm },
  row: { flexDirection: "row", gap: t.spacing.sm, flexWrap: "wrap" },
}));

export default function TooltipDemo() {
  const styles = useStyles();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Long-press to open</Text>
        <Text style={styles.hint}>RN has no hover. Press and hold the buttons below.</Text>
        <View style={styles.row}>
          <Tooltip label="This permanently deletes the account">
            <Button variant="destructive">Delete</Button>
          </Tooltip>
          <Tooltip label="Saves and closes the editor">
            <Button>Save</Button>
          </Tooltip>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bottom placement</Text>
        <View style={styles.row}>
          <Tooltip placement="bottom" label="Drops the tooltip below the trigger">
            <Button variant="secondary">Bottom</Button>
          </Tooltip>
        </View>
      </View>
    </ScrollView>
  );
}
