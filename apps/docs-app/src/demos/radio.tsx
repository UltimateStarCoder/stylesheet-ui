import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Radio, RadioGroup, Text, createStyles } from "@stylesheet-ui/ui";

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

export default function RadioDemo() {
  const styles = useStyles();
  const [plan, setPlan] = useState<string | null>("pro");
  const [size, setSize] = useState<string | null>("md");

  return (
    <ScrollView testID="screen-radio" contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Plan (value: {plan})</Text>
        <RadioGroup value={plan} onValueChange={setPlan}>
          <Radio testID="radio-plan-free" value="free" label="Free" />
          <Radio testID="radio-plan-pro" value="pro" label="Pro" />
          <Radio testID="radio-plan-team" value="team" label="Team" />
        </RadioGroup>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Sizes (value: {size})</Text>
        <RadioGroup value={size} onValueChange={setSize}>
          <Radio testID="radio-size-sm" value="sm" label="Small" size="sm" />
          <Radio testID="radio-size-md" value="md" label="Medium" size="md" />
          <Radio testID="radio-size-lg" value="lg" label="Large" size="lg" />
        </RadioGroup>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Disabled group</Text>
        <RadioGroup value="locked" onValueChange={() => {}} disabled>
          <Radio testID="radio-disabled-locked" value="locked" label="Selected but disabled" />
          <Radio testID="radio-disabled-other" value="other" label="Unavailable" />
        </RadioGroup>
      </View>
    </ScrollView>
  );
}
