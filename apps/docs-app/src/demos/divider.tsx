import { ScrollView, View } from "react-native";
import { Card, Divider, ListItem, Text, createStyles } from "@stylesheet-ui/ui";

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
  vertRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: t.spacing.md,
    height: 24,
  },
  text: { color: t.colors.foreground, fontSize: t.typography.fontSize.sm },
}));

export default function DividerDemo() {
  const styles = useStyles();
  return (
    <ScrollView contentContainerStyle={styles.container} testID="screen-divider">
      <View style={styles.section}>
        <Text style={styles.label}>Default horizontal</Text>
        <Card padding="none">
          <ListItem title="First" subtitle="Above the divider" />
          <Divider testID="divider-default-1" />
          <ListItem title="Second" subtitle="Below the divider" />
          <Divider testID="divider-default-2" />
          <ListItem title="Third" subtitle="Standard 1px line" />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Inset (aligns under content)</Text>
        <Card padding="none">
          <ListItem title="Account" subtitle="The divider insets past the icon area" />
          <Divider inset="2xl" testID="divider-inset-1" />
          <ListItem title="Profile" subtitle="Inset = 2xl (32px)" />
          <Divider inset="2xl" testID="divider-inset-2" />
          <ListItem title="Privacy" subtitle="iOS-style settings divider" />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Vertical</Text>
        <View style={styles.vertRow}>
          <Text style={styles.text}>Left</Text>
          <Divider orientation="vertical" testID="divider-vertical-1" />
          <Text style={styles.text}>Middle</Text>
          <Divider orientation="vertical" testID="divider-vertical-2" />
          <Text style={styles.text}>Right</Text>
        </View>
      </View>
    </ScrollView>
  );
}
