import { ScrollView, Text, View } from "react-native";
import { Skeleton, createStyles } from "@stylesheet-ui/ui";

const useStyles = createStyles((t) => ({
  container: {
    padding: t.spacing.lg,
    gap: t.spacing.xl,
    backgroundColor: t.colors.background,
    flexGrow: 1,
  },
  section:      { gap: t.spacing.md },
  sectionTitle: {
    fontSize: t.typography.fontSize.sm,
    fontWeight: "600",
    color: t.colors.foregroundMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: "row",
    gap: t.spacing.md,
    padding: t.spacing.md,
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  cardBody: { flex: 1, gap: t.spacing.sm, justifyContent: "center" },
}));

export default function SkeletonDemo() {
  const styles = useStyles();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shapes</Text>
        <Skeleton width="100%" height={16} />
        <Skeleton width="80%" height={16} />
        <Skeleton width="60%" height={16} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Card placeholder</Text>
        <View style={styles.card}>
          <Skeleton width={48} height={48} radius={24} />
          <View style={styles.cardBody}>
            <Skeleton width="60%" height={14} />
            <Skeleton width="90%" height={12} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Image placeholder</Text>
        <Skeleton width="100%" height={180} radius={12} />
      </View>
    </ScrollView>
  );
}
