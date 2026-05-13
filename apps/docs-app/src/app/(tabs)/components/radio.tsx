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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Plan (value: {plan})</Text>
        <RadioGroup value={plan} onValueChange={setPlan}>
          <Radio value="free" label="Free" />
          <Radio value="pro" label="Pro" />
          <Radio value="team" label="Team" />
        </RadioGroup>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Sizes (value: {size})</Text>
        <RadioGroup value={size} onValueChange={setSize}>
          <Radio value="sm" label="Small" size="sm" />
          <Radio value="md" label="Medium" size="md" />
          <Radio value="lg" label="Large" size="lg" />
        </RadioGroup>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Disabled group</Text>
        <RadioGroup value="locked" onValueChange={() => {}} disabled>
          <Radio value="locked" label="Selected but disabled" />
          <Radio value="other" label="Unavailable" />
        </RadioGroup>
      </View>
    </ScrollView>
  );
}
