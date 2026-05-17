import { Card, Screen, Text, VStack, createStyles } from "@stylesheet-ui/ui";

const useStyles = createStyles((t) => ({
  label: {
    fontSize: t.typography.fontSize.sm,
    fontWeight: "600",
    color: t.colors.foregroundMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  body: {
    fontSize: t.typography.fontSize.sm,
    lineHeight: t.typography.lineHeight.sm,
    color: t.colors.foreground,
  },
  title: {
    fontSize: t.typography.fontSize.md,
    fontWeight: "600",
    color: t.colors.foreground,
  },
}));

export default function ScreenDemo() {
  const styles = useStyles();
  return (
    <Screen edges={null} padding={16}>
      <VStack gap="xl">
        <Text style={styles.label}>What you're looking at</Text>
        <Card>
          <Text style={styles.title}>Screen</Text>
          <Text style={styles.body}>
            This whole route is wrapped in {`<Screen padding={16}>`}. The Screen
            primitive applies SafeAreaView, ScrollView, and your theme background
            in one call — every screen will repeat this otherwise.
          </Text>
        </Card>
        <Card surface="muted">
          <Text style={styles.body}>
            {`<Screen edges={["top"]}>`} for stack-pushed routes (header
            covers top inset on iOS), {`<Screen edges={null}>`} when a
            parent like a Tabs layout handles insets for you, and
            {` <Screen scroll={false}>`} when you want a fixed-height layout.
          </Text>
        </Card>
        <Card surface="outline">
          <Text style={styles.body}>
            Inside Screen you can compose with {`<Stack>`}, {`<VStack>`},
            {` <HStack>`}, or pass any children. Background and padding
            are theme-aware.
          </Text>
        </Card>
      </VStack>
    </Screen>
  );
}
