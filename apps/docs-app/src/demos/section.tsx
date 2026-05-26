import { ScrollView } from "react-native";
import { Bell, ChevronRight, Lock, Moon, User } from "lucide-react-native";
import {
  List,
  Section,
  SettingsRow,
  Switch,
  createStyles,
  useTheme,
} from "@stylesheet-ui/ui";
import { useState } from "react";

const useStyles = createStyles((t) => ({
  container: {
    padding: t.spacing.lg,
    gap: t.spacing.xl,
    backgroundColor: t.colors.background,
    flexGrow: 1,
  },
}));

export default function SectionDemo() {
  const theme = useTheme();
  const styles = useStyles();
  const [dark, setDark] = useState(false);
  const [notify, setNotify] = useState(true);
  const chevron = <ChevronRight color={theme.colors.foregroundSubtle} size={18} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Section title="Account" description="Manage how others see you.">
        <List>
          <SettingsRow title="Profile" icon={<User color={theme.colors.foreground} size={18} />} right={chevron} onPress={() => {}} />
          <SettingsRow title="Privacy" icon={<Lock color={theme.colors.foreground} size={18} />} right={chevron} onPress={() => {}} />
        </List>
      </Section>

      <Section title="Preferences">
        <List>
          <SettingsRow title="Dark mode" icon={<Moon color={theme.colors.foreground} size={18} />} right={<Switch value={dark} onValueChange={setDark} />} />
          <SettingsRow title="Notifications" icon={<Bell color={theme.colors.foreground} size={18} />} right={<Switch value={notify} onValueChange={setNotify} />} />
        </List>
      </Section>

      <Section title="Danger zone" description="These actions can't be undone.">
        <List>
          <SettingsRow title="Delete account" destructive onPress={() => {}} />
        </List>
      </Section>
    </ScrollView>
  );
}
