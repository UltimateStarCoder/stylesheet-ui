import { ScrollView, Text } from "react-native";
import { Link } from "expo-router";
import { Card, createStyles } from "@stylesheet-ui/ui";

const ENTRIES = [
  { name: "Button",       href: "/components/button"        as const, blurb: "Variants, sizes, loading, icons" },
  { name: "Input",        href: "/components/input"         as const, blurb: "Focus ring, error, icon" },
  { name: "Card",         href: "/components/card"          as const, blurb: "Surfaces, padding, pressable" },
  { name: "Text",         href: "/components/text"          as const, blurb: "Sizes, weights, intents" },
  { name: "Avatar",       href: "/components/avatar"        as const, blurb: "Image or initials fallback" },
  { name: "Badge",        href: "/components/badge"         as const, blurb: "Variants and sizes" },
  { name: "ListItem",     href: "/components/list-item"     as const, blurb: "Title, subtitle, leading/trailing slots" },
  { name: "Modal",        href: "/components/modal"         as const, blurb: "Centered dialog with backdrop" },
  { name: "Tabs",         href: "/components/tabs"          as const, blurb: "Composable segmented control" },
  { name: "SettingsRow",  href: "/components/settings-row"  as const, blurb: "Icon + title + right element" },
  { name: "Stack",        href: "/components/stack"         as const, blurb: "Layout primitive with theme gap" },
  { name: "Screen",       href: "/components/screen"        as const, blurb: "SafeArea + scroll + theme bg" },
  { name: "Divider",      href: "/components/divider"       as const, blurb: "Theme-colored line, optional inset" },
  { name: "Switch",       href: "/components/switch"        as const, blurb: "Themed native switch" },
  { name: "Checkbox",     href: "/components/checkbox"      as const, blurb: "Sizes + label, no SVG dep" },
  { name: "Radio",        href: "/components/radio"         as const, blurb: "RadioGroup + Radio with values" },
  { name: "Slider",       href: "/components/slider"        as const, blurb: "PanResponder, min/max/step" },
  { name: "BottomSheet",  href: "/components/bottom-sheet"  as const, blurb: "Drag-to-dismiss sheet, auto-fit / fixed / snap" },
  { name: "Toast",        href: "/components/toast"         as const, blurb: "Imperative toast.show() singleton" },
];

const useStyles = createStyles((t) => ({
  container: {
    padding: t.spacing.lg,
    gap: t.spacing.md,
    backgroundColor: t.colors.background,
    flexGrow: 1,
  },
  title: {
    fontSize: t.typography.fontSize.md,
    fontWeight: "600",
    color: t.colors.foreground,
  },
  blurb: {
    marginTop: t.spacing.xs,
    color: t.colors.foregroundMuted,
    fontSize: t.typography.fontSize.sm,
  },
}));

export default function ComponentsIndex() {
  const styles = useStyles();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {ENTRIES.map((e) => (
        <Link key={e.href} href={e.href} asChild>
          <Card pressable>
            <Text style={styles.title}>{e.name}</Text>
            <Text style={styles.blurb}>{e.blurb}</Text>
          </Card>
        </Link>
      ))}
    </ScrollView>
  );
}
