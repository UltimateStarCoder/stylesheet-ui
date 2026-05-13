import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Checkbox, Text, VStack, useStyles } from "@stylesheet-ui/ui";

export default function CheckboxDemo() {
  const [accepted, setAccepted] = useState(true);
  const [marketing, setMarketing] = useState(false);

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
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Default</Text>
        <VStack gap="sm">
          <Checkbox checked={accepted} onCheckedChange={setAccepted} label="I accept the terms" />
          <Checkbox checked={marketing} onCheckedChange={setMarketing} label="Email me about new features" />
        </VStack>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Sizes</Text>
        <VStack gap="sm">
          <Checkbox checked size="sm" label="Small" />
          <Checkbox checked size="md" label="Medium" />
          <Checkbox checked size="lg" label="Large" />
        </VStack>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>States</Text>
        <VStack gap="sm">
          <Checkbox checked={false} disabled label="Unchecked, disabled" />
          <Checkbox checked disabled label="Checked, disabled" />
        </VStack>
      </View>
    </ScrollView>
  );
}
