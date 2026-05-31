import { useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Bell,
  ChevronRight,
  Globe,
  LogOut,
  Moon,
  Shield,
} from "lucide-react-native";
import { Card, SettingsRow, Switch, Text, createStyles, useTheme } from "@stylesheet-ui/ui";

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
  sep:   { height: 1, backgroundColor: t.colors.border, marginLeft: 60 },
  valueText: { color: t.colors.foregroundMuted, fontSize: t.typography.fontSize.sm },
}));

export default function SettingsRowDemo() {
  const theme = useTheme();
  const styles = useStyles();
  const [push, setPush] = useState(true);
  const [dark, setDark] = useState(false);

  return (
    <ScrollView testID="screen-settings-row" contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Notifications</Text>
        <Card padding="none">
          <SettingsRow
            testID="settings-row-push"
            title="Push notifications"
            description="Get notified about activity on your account"
            icon={<Bell color={theme.colors.primary} size={18} />}
            right={<Switch testID="settings-row-push-switch" value={push} onValueChange={setPush} />}
          />
          <View style={styles.sep} />
          <SettingsRow
            testID="settings-row-dark"
            title="Dark mode"
            description="Override the system theme"
            icon={<Moon color={theme.colors.primary} size={18} />}
            right={<Switch testID="settings-row-dark-switch" value={dark} onValueChange={setDark} />}
          />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Account</Text>
        <Card padding="none">
          <SettingsRow
            testID="settings-row-language"
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
            testID="settings-row-privacy"
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
            testID="settings-row-sign-out"
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
