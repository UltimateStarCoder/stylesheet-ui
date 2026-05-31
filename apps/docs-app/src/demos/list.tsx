import { ScrollView, View } from "react-native";
import { ChevronRight, Inbox, Mail, Star } from "lucide-react-native";
import {
  Badge,
  List,
  ListItem,
  Text,
  createStyles,
  useTheme,
} from "@stylesheet-ui/ui";

const useStyles = createStyles((t) => ({
  container: {
    padding: t.spacing.lg,
    gap: t.spacing.xl,
    backgroundColor: t.colors.background,
    flexGrow: 1,
  },
  block: { gap: t.spacing.sm },
  label: {
    fontSize: t.typography.fontSize.sm,
    fontWeight: "600",
    color: t.colors.foregroundMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
}));

export default function ListDemo() {
  const theme = useTheme();
  const styles = useStyles();
  const chevron = <ChevronRight color={theme.colors.foregroundSubtle} size={18} />;

  return (
    <ScrollView contentContainerStyle={styles.container} testID="screen-list">
      <View style={styles.block}>
        <Text style={styles.label}>Default</Text>
        <List testID="list-default">
          <ListItem testID="list-item-inbox" title="Inbox" subtitle="4 unread" left={<Inbox color={theme.colors.primary} size={20} />} right={<Badge size="sm">4</Badge>} />
          <ListItem testID="list-item-starred" title="Starred" subtitle="2 items" left={<Star color={theme.colors.warning} size={20} />} />
          <ListItem testID="list-item-sent" title="Sent" subtitle="12 items" left={<Mail color={theme.colors.primary} size={20} />} />
        </List>
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Muted, pressable rows</Text>
        <List surface="muted" testID="list-muted">
          <ListItem testID="list-item-ada" title="Ada Lovelace" subtitle="ada@example.com" right={chevron} onPress={() => {}} />
          <ListItem testID="list-item-grace" title="Grace Hopper" subtitle="grace@example.com" right={chevron} onPress={() => {}} />
          <ListItem testID="list-item-margaret" title="Margaret Hamilton" subtitle="margaret@example.com" right={chevron} onPress={() => {}} />
        </List>
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Outline, no dividers</Text>
        <List surface="outline" divided={false} testID="list-outline">
          <ListItem testID="list-item-one" title="One" />
          <ListItem testID="list-item-two" title="Two" />
          <ListItem testID="list-item-three" title="Three" />
        </List>
      </View>
    </ScrollView>
  );
}
