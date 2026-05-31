import { ScrollView, Text, View } from "react-native";
import { Button, createStyles } from "@stylesheet-ui/ui";

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
  iconLight: { color: t.colors.primaryForeground, fontSize: 16 },
  iconDark:  { color: t.colors.foreground, fontSize: 16 },
}));

export default function ButtonDemo() {
  const styles = useStyles();
  return (
    <ScrollView testID="screen-button" contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Variants</Text>
        <View style={styles.row}>
          <Button testID="button-variant-primary">Primary</Button>
          <Button testID="button-variant-secondary" variant="secondary">Secondary</Button>
          <Button testID="button-variant-ghost" variant="ghost">Ghost</Button>
          <Button testID="button-variant-destructive" variant="destructive">Destructive</Button>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sizes</Text>
        <View style={styles.row}>
          <Button testID="button-size-sm" size="sm">Small</Button>
          <Button testID="button-size-md" size="md">Medium</Button>
          <Button testID="button-size-lg" size="lg">Large</Button>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>States</Text>
        <View style={styles.row}>
          <Button testID="button-loading" loading>Loading</Button>
          <Button testID="button-disabled" disabled>Disabled</Button>
          <Button testID="button-destructive-loading" variant="destructive" loading>Loading</Button>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With icons</Text>
        <View style={styles.row}>
          <Button testID="button-left-icon" leftIcon={<Text style={styles.iconLight}>›</Text>}>Left icon</Button>
          <Button testID="button-right-icon" variant="secondary" rightIcon={<Text style={styles.iconDark}>→</Text>}>
            Right icon
          </Button>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Full width</Text>
        <Button testID="button-full-width" fullWidth>Stretches to parent</Button>
        <Button testID="button-full-width-secondary" fullWidth variant="secondary">Useful for primary CTAs</Button>
      </View>
    </ScrollView>
  );
}
