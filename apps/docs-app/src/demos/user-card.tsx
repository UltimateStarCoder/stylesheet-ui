import { ScrollView, Text, View } from "react-native";
import { UserCard, createStyles } from "@stylesheet-ui/ui";

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
}));

export default function UserCardDemo() {
  const styles = useStyles();

  return (
    <ScrollView contentContainerStyle={styles.container} testID="screen-user-card">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With photo</Text>
        <UserCard
          testID="user-card-photo"
          name="Ada Lovelace"
          email="ada@example.com"
          imageUrl="https://i.pravatar.cc/96?img=5"
          onSignOut={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Initials fallback</Text>
        <UserCard
          testID="user-card-initials"
          name="Grace Hopper"
          email="grace@example.com"
          onSignOut={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Signing out</Text>
        <UserCard
          testID="user-card-loading"
          name="Margaret Hamilton"
          email="margaret@example.com"
          loading
          onSignOut={() => {}}
        />
      </View>
    </ScrollView>
  );
}
