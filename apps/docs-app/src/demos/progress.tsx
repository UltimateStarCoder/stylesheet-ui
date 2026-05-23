import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Progress, createStyles } from "@stylesheet-ui/ui";

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
  value: { color: t.colors.foreground, fontSize: t.typography.fontSize.sm },
  stack: { gap: t.spacing.md },
}));

export default function ProgressDemo() {
  const styles = useStyles();
  const [value, setValue] = useState(20);

  useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : v + 10));
    }, 600);
    return () => clearInterval(id);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Determinate</Text>
        <Text style={styles.value}>{value}%</Text>
        <Progress value={value} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sizes</Text>
        <View style={styles.stack}>
          <Progress value={40} height={4} />
          <Progress value={60} height={8} />
          <Progress value={80} height={12} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Indeterminate</Text>
        <Progress indeterminate />
      </View>
    </ScrollView>
  );
}
