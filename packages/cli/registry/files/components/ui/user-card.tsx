import { forwardRef } from "react";
import { Text, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { Avatar } from "./avatar";
import { Button } from "./button";
import { createStyles } from "../../utils/use-styles";

export type UserCardProps = Omit<ViewProps, "children" | "style"> & {
  name?: string;
  email?: string;
  imageUrl?: string;
  onSignOut: () => void;
  signOutLabel?: string;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

const useStyles = createStyles((t) => ({
  root: {
    flexDirection: "row",
    alignItems: "center",
    gap: t.spacing.md,
    padding: t.spacing.md,
    borderWidth: 1,
    borderColor: t.colors.border,
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
  },
  body: { flex: 1, gap: 2 },
  name: {
    fontSize: t.typography.fontSize.md,
    lineHeight: t.typography.lineHeight.md,
    fontWeight: "600" as const,
    color: t.colors.foreground,
  },
  email: {
    fontSize: t.typography.fontSize.sm,
    lineHeight: t.typography.lineHeight.sm,
    color: t.colors.foregroundMuted,
  },
}));

export const UserCard = forwardRef<View, UserCardProps>(function UserCard(
  { name, email, imageUrl, onSignOut, signOutLabel = "Sign out", loading = false, style, ...rest },
  ref,
) {
  const styles = useStyles();

  return (
    <View ref={ref} style={[styles.root, style]} {...rest}>
      <Avatar size="md" name={name} source={imageUrl ? { uri: imageUrl } : undefined} />
      <View style={styles.body}>
        {!!name && <Text style={styles.name} numberOfLines={1}>{name}</Text>}
        {!!email && <Text style={styles.email} numberOfLines={1}>{email}</Text>}
      </View>
      <Button variant="secondary" size="sm" loading={loading} onPress={onSignOut}>
        {signOutLabel}
      </Button>
    </View>
  );
});
