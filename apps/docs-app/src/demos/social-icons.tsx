import { ScrollView, Text, View } from "react-native";
import {
  GoogleIcon,
  AppleIcon,
  GitHubIcon,
  MicrosoftIcon,
  FacebookIcon,
  XIcon,
  DiscordIcon,
  GitLabIcon,
  LinkedInIcon,
  SlackIcon,
  TwitchIcon,
  createStyles,
} from "@stylesheet-ui/ui";

const ICONS = [
  { name: "Google", Icon: GoogleIcon },
  { name: "Apple", Icon: AppleIcon },
  { name: "GitHub", Icon: GitHubIcon },
  { name: "Microsoft", Icon: MicrosoftIcon },
  { name: "Facebook", Icon: FacebookIcon },
  { name: "X", Icon: XIcon },
  { name: "Discord", Icon: DiscordIcon },
  { name: "GitLab", Icon: GitLabIcon },
  { name: "LinkedIn", Icon: LinkedInIcon },
  { name: "Slack", Icon: SlackIcon },
  { name: "Twitch", Icon: TwitchIcon },
];

const useStyles = createStyles((t) => ({
  container: { padding: t.spacing.lg, gap: t.spacing.lg, backgroundColor: t.colors.background, flexGrow: 1 },
  intro: { color: t.colors.foregroundMuted, fontSize: t.typography.fontSize.sm, lineHeight: t.typography.lineHeight.sm },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: t.spacing.md },
  cell: {
    width: 92,
    alignItems: "center",
    gap: t.spacing.sm,
    paddingVertical: t.spacing.md,
    borderWidth: 1,
    borderColor: t.colors.border,
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
  },
  label: { fontSize: t.typography.fontSize.sm, color: t.colors.foregroundMuted },
}));

export default function SocialIconsDemo() {
  const styles = useStyles();
  return (
    <ScrollView contentContainerStyle={styles.container} testID="screen-social-icons">
      <Text style={styles.intro}>
        Monochrome brand marks, themed to your foreground color. Pass `color` and `size` to customize, or drop them into
        a SocialAuthButtons provider&apos;s `icon`.
      </Text>
      <View style={styles.grid}>
        {ICONS.map(({ name, Icon }) => (
          <View key={name} style={styles.cell} testID={`social-icon-${name.toLowerCase()}`}>
            <Icon size={28} />
            <Text style={styles.label}>{name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
