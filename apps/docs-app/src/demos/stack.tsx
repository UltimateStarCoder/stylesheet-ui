import { ScrollView, View } from "react-native";
import { Badge, HStack, Stack, Text, VStack, createStyles } from "@stylesheet-ui/ui";

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
  box: {
    backgroundColor: t.colors.surfaceMuted,
    borderRadius: t.radius.md,
    padding: t.spacing.md,
    borderWidth: 1,
    borderColor: t.colors.border,
  },
  boxText: { color: t.colors.foreground, fontSize: t.typography.fontSize.sm },
}));

export default function StackDemo() {
  const styles = useStyles();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>VStack (default)</Text>
        <VStack gap="sm">
          <View style={styles.box}><Text style={styles.boxText}>One</Text></View>
          <View style={styles.box}><Text style={styles.boxText}>Two</Text></View>
          <View style={styles.box}><Text style={styles.boxText}>Three</Text></View>
        </VStack>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>HStack with gap="md"</Text>
        <HStack gap="md">
          <Badge>One</Badge>
          <Badge variant="success">Two</Badge>
          <Badge variant="outline">Three</Badge>
        </HStack>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>HStack with wrap + justify="between"</Text>
        <Stack direction="row" gap="sm" wrap justify="between">
          <Badge>Wrap</Badge>
          <Badge variant="success">Across</Badge>
          <Badge variant="warning">Multiple</Badge>
          <Badge variant="destructive">Lines</Badge>
          <Badge variant="outline">As Needed</Badge>
        </Stack>
      </View>
    </ScrollView>
  );
}
