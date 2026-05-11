import { useState } from "react";
import { ScrollView, Switch, View } from "react-native";
import {
  Bell,
  ChevronRight,
  Globe,
  LogOut,
  Moon,
  Shield,
} from "lucide-react-native";
import { Card, SettingsRow, Text, useStyles, useTheme } from "@stylesheet-ui/ui";

export default function SettingsRowDemo() {
  const theme = useTheme();
  const [push, setPush] = useState(true);
  const [dark, setDark] = useState(false);

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
    sep:   { height: 1, backgroundColor: t.colors.border, marginLeft: 60 },
    chev:  { },
    valueText: { color: t.colors.foregroundMuted, fontSize: t.typography.fontSize.sm },
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Notifications</Text>
        <Card padding="none">
          <SettingsRow
            title="Push notifications"
            description="Get notified about activity on your account"
            icon={<Bell color={theme.colors.primary} size={18} />}
            right={<Switch value={push} onValueChange={setPush} />}
          />
          <View style={styles.sep} />
          <SettingsRow
            title="Dark mode"
            description="Override the system theme"
            icon={<Moon color={theme.colors.primary} size={18} />}
            right={<Switch value={dark} onValueChange={setDark} />}
          />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Account</Text>
        <Card padding="none">
          <SettingsRow
            title="Language"
            icon={<Globe color={theme.colors.primary} size={18} />}
            right={
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text style={styles.valueText}>English</Text>
                <ChevronRight color={theme.colors.foregroundSubtle} size={18} />
              </View>
            }
            onPress={() => {}}
          />
          <View style={styles.sep} />
          <SettingsRow
            title="Privacy & security"
            icon={<Shield color={theme.colors.primary} size={18} />}
            right={<ChevronRight color={theme.colors.foregroundSubtle} size={18} />}
            onPress={() => {}}
          />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Danger zone</Text>
        <Card padding="none">
          <SettingsRow
            title="Sign out"
            icon={<LogOut color={theme.colors.destructive} size={18} />}
            destructive
            onPress={() => {}}
          />
        </Card>
      </View>
    </ScrollView>
  );
}
