import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Slider, Text, useStyles } from "@stylesheet-ui/ui";

export default function SliderDemo() {
  const [volume, setVolume] = useState(40);
  const [stepped, setStepped] = useState(3);

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
    value: { color: t.colors.foreground, fontSize: t.typography.fontSize.sm },
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Continuous (0–100)</Text>
        <Slider value={volume} onValueChange={setVolume} min={0} max={100} />
        <Text style={styles.value}>value = {Math.round(volume)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Stepped (step=1, range 1–5)</Text>
        <Slider value={stepped} onValueChange={setStepped} min={1} max={5} step={1} />
        <Text style={styles.value}>value = {stepped}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Disabled</Text>
        <Slider value={60} onValueChange={() => {}} disabled />
      </View>
    </ScrollView>
  );
}
