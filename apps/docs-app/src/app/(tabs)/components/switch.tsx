import { useState } from "react";
import { ScrollView, View } from "react-native";
import { HStack, Switch, Text, useStyles, useThemeMode } from "@stylesheet-ui/ui";

export default function SwitchDemo() {
  const [on, setOn] = useState(true);
  const [off, setOff] = useState(false);
  const { override, setScheme, isDark } = useThemeMode();

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
    text: { color: t.colors.foreground, fontSize: t.typography.fontSize.sm },
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>States</Text>
        <HStack gap="lg" align="center">
          <Switch value={on} onValueChange={setOn} />
          <Text style={styles.text}>On (controlled)</Text>
        </HStack>
        <HStack gap="lg" align="center">
          <Switch value={off} onValueChange={setOff} />
          <Text style={styles.text}>Off (controlled)</Text>
        </HStack>
        <HStack gap="lg" align="center">
          <Switch value disabled />
          <Text style={styles.text}>Disabled</Text>
        </HStack>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>
          Theme override toggle (useThemeMode → setScheme)
        </Text>
        <HStack gap="lg" align="center">
          <Switch
            value={isDark}
            onValueChange={(v) => setScheme(v ? "dark" : "light")}
          />
          <Text style={styles.text}>
            override = {override} → scheme = {isDark ? "dark" : "light"}
          </Text>
        </HStack>
      </View>
    </ScrollView>
  );
}
