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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Variants</Text>
        <View style={styles.row}>
          <Badge>Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Sizes</Text>
        <View style={styles.row}>
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
        </View>
      </View>
    </ScrollView>
  );
}
