import { ScrollView, Text, View } from "react-native";
import { Card, createStyles } from "@stylesheet-ui/ui";

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
  cardTitle: {
    fontSize: t.typography.fontSize.md,
    fontWeight: "600",
    color: t.colors.foreground,
  },
  cardBody: {
    marginTop: t.spacing.xs,
    color: t.colors.foregroundMuted,
    fontSize: t.typography.fontSize.sm,
  },
}));

export default function CardDemo() {
  const styles = useStyles();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Surfaces</Text>
        <Card>
          <Text style={styles.cardTitle}>Default</Text>
          <Text style={styles.cardBody}>Surface background with a subtle shadow.</Text>
        </Card>
        <Card surface="muted">
          <Text style={styles.cardTitle}>Muted</Text>
          <Text style={styles.cardBody}>Tinted background, no shadow.</Text>
        </Card>
        <Card surface="outline">
          <Text style={styles.cardTitle}>Outline</Text>
          <Text style={styles.cardBody}>Transparent background, strong border.</Text>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Padding</Text>
        <Card padding="sm">
          <Text style={styles.cardTitle}>Small padding</Text>
        </Card>
        <Card padding="md">
          <Text style={styles.cardTitle}>Medium padding</Text>
        </Card>
        <Card padding="lg">
          <Text style={styles.cardTitle}>Large padding</Text>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pressable</Text>
        <Card pressable onPress={() => {}}>
          <Text style={styles.cardTitle}>Tap me</Text>
          <Text style={styles.cardBody}>Opacity dims on press.</Text>
        </Card>
      </View>
    </ScrollView>
  );
}
