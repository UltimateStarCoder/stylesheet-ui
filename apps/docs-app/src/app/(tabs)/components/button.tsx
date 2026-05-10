import { ScrollView, Text, View } from "react-native";
import { Button, useStyles } from "@stylesheet-ui/ui";

export default function ButtonDemo() {
  const styles = useStyles((t) => ({
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
    iconLight: { color: t.colors.primaryForeground, fontSize: 16 },
    iconDark:  { color: t.colors.foreground, fontSize: 16 },
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Variants</Text>
        <View style={styles.row}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sizes</Text>
        <View style={styles.row}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>States</Text>
        <View style={styles.row}>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button variant="destructive" loading>Loading</Button>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With icons</Text>
        <View style={styles.row}>
          <Button leftIcon={<Text style={styles.iconLight}>›</Text>}>Left icon</Button>
          <Button variant="secondary" rightIcon={<Text style={styles.iconDark}>→</Text>}>
            Right icon
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
