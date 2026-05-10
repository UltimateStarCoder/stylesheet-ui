import { ScrollView, Text } from "react-native";
import { Link } from "expo-router";
import { Card, useStyles } from "@stylesheet-ui/ui";

const ENTRIES = [
  { name: "Button", href: "/components/button" as const, blurb: "Variants, sizes, loading, icons" },
  { name: "Input",  href: "/components/input"  as const, blurb: "Focus ring, error, icon" },
  { name: "Card",   href: "/components/card"   as const, blurb: "Surfaces, padding, pressable" },
];

export default function ComponentsIndex() {
  const styles = useStyles((t) => ({
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
