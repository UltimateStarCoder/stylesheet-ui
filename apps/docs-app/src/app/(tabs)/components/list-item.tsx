import { ScrollView, View } from "react-native";
import { ChevronRight, Inbox, Star } from "lucide-react-native";
import {
  Avatar,
  Badge,
  Card,
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
  section: { gap: t.spacing.sm },
  label: {
    fontSize: t.typography.fontSize.sm,
    fontWeight: "600",
    color: t.colors.foregroundMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  group: { borderRadius: t.radius.lg, overflow: "hidden", borderWidth: 1, borderColor: t.colors.border },
  sep:   { height: 1, backgroundColor: t.colors.border, marginLeft: t.spacing.lg },
}));

export default function ListItemDemo() {
  const theme = useTheme();
  const styles = useStyles();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Default</Text>
        <Card padding="none">
          <ListItem title="Inbox" subtitle="4 unread messages" left={<Inbox color={theme.colors.primary} size={20} />} right={<Badge size="sm">4</Badge>} />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Pressable group</Text>
        <View style={styles.group}>
          <ListItem
            title="Ada Lovelace"
            subtitle="ada@example.com"
            left={<Avatar size="md" name="Ada Lovelace" />}
            right={<ChevronRight color={theme.colors.foregroundSubtle} size={18} />}
            onPress={() => {}}
          />
          <View style={styles.sep} />
          <ListItem
            title="Grace Hopper"
            subtitle="grace@example.com"
            left={<Avatar size="md" name="Grace Hopper" />}
            right={<ChevronRight color={theme.colors.foregroundSubtle} size={18} />}
            onPress={() => {}}
          />
          <View style={styles.sep} />
          <ListItem
            title="Margaret Hamilton"
            subtitle="margaret@example.com"
            left={<Avatar size="md" name="Margaret Hamilton" />}
            right={<ChevronRight color={theme.colors.foregroundSubtle} size={18} />}
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>States</Text>
        <Card padding="none">
          <ListItem
            title="Starred"
            subtitle="Disabled state"
            left={<Star color={theme.colors.foregroundSubtle} size={20} />}
            disabled
          />
        </Card>
      </View>
    </ScrollView>
  );
}
