import { ScrollView, Text, View } from "react-native";
import { Spinner, createStyles } from "@stylesheet-ui/ui";

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
  row: { flexDirection: "row", gap: t.spacing.xl, alignItems: "center" },
}));

export default function SpinnerDemo() {
  const styles = useStyles();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sizes</Text>
        <View style={styles.row}>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom color</Text>
        <View style={styles.row}>
          <Spinner color="#EF4444" />
          <Spinner color="#10B981" />
          <Spinner color="#F59E0B" />
        </View>
      </View>
    </ScrollView>
  );
}
