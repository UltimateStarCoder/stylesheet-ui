import { ScrollView, View } from "react-native";
import { Avatar, Text, useStyles } from "@stylesheet-ui/ui";

const REMOTE = { uri: "https://i.pravatar.cc/200?u=stylesheet-ui" };

export default function AvatarDemo() {
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
    row: { flexDirection: "row", alignItems: "center", gap: t.spacing.md, flexWrap: "wrap" },
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Sizes (with image)</Text>
        <View style={styles.row}>
          <Avatar size="sm" source={REMOTE} name="Sample User" />
          <Avatar size="md" source={REMOTE} name="Sample User" />
          <Avatar size="lg" source={REMOTE} name="Sample User" />
          <Avatar size="xl" source={REMOTE} name="Sample User" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Initials fallback</Text>
        <View style={styles.row}>
          <Avatar size="sm" name="Ada Lovelace" />
          <Avatar size="md" name="Grace Hopper" />
          <Avatar size="lg" name="Margaret Hamilton" />
          <Avatar size="xl" name="Katherine Johnson" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Shapes</Text>
        <View style={styles.row}>
          <Avatar size="lg" name="Round Shape" shape="circle" />
          <Avatar size="lg" name="Sharp Shape" shape="square" />
        </View>
      </View>
    </ScrollView>
  );
}
