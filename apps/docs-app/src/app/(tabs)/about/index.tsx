import { ScrollView, Text } from "react-native";
import { useStyles } from "@stylesheet-ui/ui";

export default function AboutScreen() {
  const styles = useStyles((t) => ({
    container: {
      padding: t.spacing.lg,
      gap: t.spacing.md,
      backgroundColor: t.colors.background,
      flexGrow: 1,
    },
    title: {
      fontSize: t.typography.fontSize["2xl"],
      lineHeight: t.typography.lineHeight["2xl"],
      fontWeight: "700",
      color: t.colors.foreground,
    },
    body: {
      fontSize: t.typography.fontSize.md,
      lineHeight: t.typography.lineHeight.md,
      color: t.colors.foregroundMuted,
    },
    sectionTitle: {
      marginTop: t.spacing.lg,
      fontSize: t.typography.fontSize.sm,
      fontWeight: "600",
      color: t.colors.foregroundMuted,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>stylesheet-ui</Text>
      <Text style={styles.body}>
        A React Native component system in the spirit of shadcn/ui: copy-paste
        components, owned source, no styling DSL. Plain {`StyleSheet`} only.
      </Text>

      <Text style={styles.sectionTitle}>Install</Text>
      <Text style={styles.body}>npx stylesheet-ui init</Text>
      <Text style={styles.body}>npx stylesheet-ui add button</Text>

      <Text style={styles.sectionTitle}>Philosophy</Text>
      <Text style={styles.body}>
        You own the component code. The CLI copies source into your project so
        you can shape it however the design needs.
      </Text>
    </ScrollView>
  );
}
