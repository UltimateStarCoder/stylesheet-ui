import { ScrollView, View } from "react-native";
import { Badge, Text, createStyles } from "@stylesheet-ui/ui";

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
  row: { flexDirection: "row", gap: t.spacing.sm, flexWrap: "wrap" },
}));

export default function BadgeDemo() {
  const styles = useStyles();
  return (
    <ScrollView contentContainerStyle={styles.container} testID="screen-badge">
      <View style={styles.section}>
        <Text style={styles.label}>Variants</Text>
        <View style={styles.row}>
          <Badge testID="badge-primary">Primary</Badge>
          <Badge variant="secondary" testID="badge-secondary">Secondary</Badge>
          <Badge variant="success" testID="badge-success">Success</Badge>
          <Badge variant="warning" testID="badge-warning">Warning</Badge>
          <Badge variant="destructive" testID="badge-destructive">Destructive</Badge>
          <Badge variant="outline" testID="badge-outline">Outline</Badge>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Sizes</Text>
        <View style={styles.row}>
          <Badge size="sm" testID="badge-size-sm">Small</Badge>
          <Badge size="md" testID="badge-size-md">Medium</Badge>
        </View>
      </View>
    </ScrollView>
  );
}
