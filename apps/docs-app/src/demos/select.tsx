import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Select, createStyles } from "@stylesheet-ui/ui";

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
  value: { color: t.colors.foregroundMuted, fontSize: t.typography.fontSize.sm },
}));

const PLAN_OPTIONS = [
  { value: "free", label: "Free", description: "For personal projects" },
  { value: "pro",  label: "Pro",  description: "For small teams" },
  { value: "team", label: "Team", description: "For growing organizations" },
  { value: "ent",  label: "Enterprise", description: "Coming soon", disabled: true },
];

const REGION_OPTIONS = [
  { value: "us-east", label: "US East (N. Virginia)" },
  { value: "us-west", label: "US West (Oregon)" },
  { value: "eu",      label: "Europe (Frankfurt)" },
  { value: "ap",      label: "Asia Pacific (Tokyo)" },
];

export default function SelectDemo() {
  const styles = useStyles();
  const [plan, setPlan] = useState("pro");
  const [region, setRegion] = useState<string | undefined>(undefined);

  return (
    <ScrollView contentContainerStyle={styles.container} testID="screen-select">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With descriptions</Text>
        <Select value={plan} onValueChange={setPlan} options={PLAN_OPTIONS} testID="select-plan" />
        <Text style={styles.value}>Selected: {plan}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With placeholder</Text>
        <Select
          value={region}
          onValueChange={setRegion}
          options={REGION_OPTIONS}
          placeholder="Choose a region…"
          testID="select-region"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Disabled</Text>
        <Select value="free" onValueChange={() => {}} options={PLAN_OPTIONS} disabled testID="select-disabled" />
      </View>
    </ScrollView>
  );
}
