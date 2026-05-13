import { ScrollView, View } from "react-native";
import { Card, Divider, ListItem, Text, useStyles } from "@stylesheet-ui/ui";

export default function DividerDemo() {
  const styles = useStyles((t) => ({
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
    vertRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: t.spacing.md,
      height: 24,
    },
    text: { color: t.colors.foreground, fontSize: t.typography.fontSize.sm },
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Default horizontal</Text>
        <Card padding="none">
          <ListItem title="First" subtitle="Above the divider" />
          <Divider />
          <ListItem title="Second" subtitle="Below the divider" />
          <Divider />
          <ListItem title="Third" subtitle="Standard 1px line" />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Inset (aligns under content)</Text>
        <Card padding="none">
          <ListItem title="Account" subtitle="The divider insets past the icon area" />
          <Divider inset="2xl" />
          <ListItem title="Profile" subtitle="Inset = 2xl (32px)" />
          <Divider inset="2xl" />
          <ListItem title="Privacy" subtitle="iOS-style settings divider" />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Vertical</Text>
        <View style={styles.vertRow}>
          <Text style={styles.text}>Left</Text>
          <Divider orientation="vertical" />
          <Text style={styles.text}>Middle</Text>
          <Divider orientation="vertical" />
          <Text style={styles.text}>Right</Text>
        </View>
      </View>
    </ScrollView>
  );
}
