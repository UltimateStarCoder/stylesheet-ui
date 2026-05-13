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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Sizes</Text>
        <Text size="xs">xs — the quick brown fox</Text>
        <Text size="sm">sm — the quick brown fox</Text>
        <Text size="md">md — the quick brown fox</Text>
        <Text size="lg">lg — the quick brown fox</Text>
        <Text size="xl">xl — the quick brown fox</Text>
        <Text size="2xl">2xl — the quick brown fox</Text>
        <Text size="3xl">3xl — the quick brown</Text>
        <Text size="4xl">4xl — quick brown</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Weights</Text>
        <Text weight="regular">Regular weight</Text>
        <Text weight="medium">Medium weight</Text>
        <Text weight="semibold">Semibold weight</Text>
        <Text weight="bold">Bold weight</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Intents</Text>
        <Text intent="default">Default — primary foreground</Text>
        <Text intent="muted">Muted — secondary</Text>
        <Text intent="subtle">Subtle — tertiary</Text>
        <Text intent="primary">Primary — brand</Text>
        <Text intent="destructive">Destructive — error</Text>
        <Text intent="success">Success</Text>
        <Text intent="warning">Warning</Text>
      </View>
    </ScrollView>
  );
}
