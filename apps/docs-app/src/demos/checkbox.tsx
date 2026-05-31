import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Checkbox, Text, VStack, createStyles } from "@stylesheet-ui/ui";

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
}));

export default function CheckboxDemo() {
  const styles = useStyles();
  const [accepted, setAccepted] = useState(true);
  const [marketing, setMarketing] = useState(false);

  return (
    <ScrollView testID="screen-checkbox" contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Default</Text>
        <VStack gap="sm">
          <Checkbox testID="checkbox-accept-terms" checked={accepted} onCheckedChange={setAccepted} label="I accept the terms" />
          <Checkbox testID="checkbox-marketing" checked={marketing} onCheckedChange={setMarketing} label="Email me about new features" />
        </VStack>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Sizes</Text>
        <VStack gap="sm">
          <Checkbox testID="checkbox-size-sm" checked size="sm" label="Small" />
          <Checkbox testID="checkbox-size-md" checked size="md" label="Medium" />
          <Checkbox testID="checkbox-size-lg" checked size="lg" label="Large" />
        </VStack>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>States</Text>
        <VStack gap="sm">
          <Checkbox testID="checkbox-unchecked-disabled" checked={false} disabled label="Unchecked, disabled" />
          <Checkbox testID="checkbox-checked-disabled" checked disabled label="Checked, disabled" />
        </VStack>
      </View>
    </ScrollView>
  );
}
