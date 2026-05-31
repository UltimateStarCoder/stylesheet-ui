import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { OtpInput, createStyles } from "@stylesheet-ui/ui";

const useStyles = createStyles((t) => ({
  container: { padding: t.spacing.lg, gap: t.spacing.xl, backgroundColor: t.colors.background, flexGrow: 1 },
  section: { gap: t.spacing.sm },
  sectionTitle: {
    fontSize: t.typography.fontSize.sm,
    fontWeight: "600",
    color: t.colors.foregroundMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  hint: { color: t.colors.foregroundMuted, fontSize: t.typography.fontSize.sm },
}));

export default function OtpInputDemo() {
  const styles = useStyles();
  const [code, setCode] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container} testID="screen-otp-input">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Six digits, with resend</Text>
        <OtpInput
          testID="otp-input-default"
          value={code}
          onChange={setCode}
          onResend={() => {}}
          resendSeconds={10}
        />
        <Text style={styles.hint}>Entered: {code || "—"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Error state</Text>
        <OtpInput testID="otp-input-error" value="123" onChange={() => {}} error="That code is incorrect." />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Four digits</Text>
        <OtpInput testID="otp-input-four" value="" onChange={() => {}} length={4} />
      </View>
    </ScrollView>
  );
}
