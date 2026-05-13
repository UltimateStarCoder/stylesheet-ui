import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Input, createStyles } from "@stylesheet-ui/ui";

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
  iconText: { color: t.colors.foregroundMuted, fontSize: 16 },
}));

export default function InputDemo() {
  const styles = useStyles();
  const [value, setValue] = useState("");
  const [withError, setWithError] = useState("not-an-email");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Default</Text>
        <Input
          placeholder="Type something"
          value={value}
          onChangeText={setValue}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With left icon</Text>
        <Input
          placeholder="Search"
          leftIcon={<Text style={styles.iconText}>🔍</Text>}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With error</Text>
        <Input
          placeholder="Email"
          value={withError}
          onChangeText={setWithError}
          error="Enter a valid email address"
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Disabled</Text>
        <Input placeholder="Disabled" editable={false} value="Read-only" />
      </View>
    </ScrollView>
  );
}
