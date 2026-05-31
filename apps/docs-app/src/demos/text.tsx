import { ScrollView, View } from "react-native";
import { Text, createStyles } from "@stylesheet-ui/ui";

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
}));

export default function TextDemo() {
  const styles = useStyles();
  return (
    <ScrollView testID="screen-text" contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Sizes</Text>
        <Text testID="text-size-xs" size="xs">xs — the quick brown fox</Text>
        <Text testID="text-size-sm" size="sm">sm — the quick brown fox</Text>
        <Text testID="text-size-md" size="md">md — the quick brown fox</Text>
        <Text testID="text-size-lg" size="lg">lg — the quick brown fox</Text>
        <Text testID="text-size-xl" size="xl">xl — the quick brown fox</Text>
        <Text testID="text-size-2xl" size="2xl">2xl — the quick brown fox</Text>
        <Text testID="text-size-3xl" size="3xl">3xl — the quick brown</Text>
        <Text testID="text-size-4xl" size="4xl">4xl — quick brown</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Weights</Text>
        <Text testID="text-weight-regular" weight="regular">Regular weight</Text>
        <Text testID="text-weight-medium" weight="medium">Medium weight</Text>
        <Text testID="text-weight-semibold" weight="semibold">Semibold weight</Text>
        <Text testID="text-weight-bold" weight="bold">Bold weight</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Intents</Text>
        <Text testID="text-intent-default" intent="default">Default — primary foreground</Text>
        <Text testID="text-intent-muted" intent="muted">Muted — secondary</Text>
        <Text testID="text-intent-subtle" intent="subtle">Subtle — tertiary</Text>
        <Text testID="text-intent-primary" intent="primary">Primary — brand</Text>
        <Text testID="text-intent-destructive" intent="destructive">Destructive — error</Text>
        <Text testID="text-intent-success" intent="success">Success</Text>
        <Text testID="text-intent-warning" intent="warning">Warning</Text>
      </View>
    </ScrollView>
  );
}
