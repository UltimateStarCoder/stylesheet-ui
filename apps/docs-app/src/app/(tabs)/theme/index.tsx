import { ScrollView, Text, View } from "react-native";
import { useTheme, useStyles, spacing, radius, typography } from "@stylesheet-ui/ui";

export default function ThemeScreen() {
  const theme = useTheme();
  const styles = useStyles((t) => ({
    container: {
      padding: t.spacing.lg,
      gap: t.spacing.xl,
      backgroundColor: t.colors.background,
      flexGrow: 1,
    },
    section:      { gap: t.spacing.sm },
    sectionTitle: {
      fontSize: t.typography.fontSize.sm,
      fontWeight: "600",
      color: t.colors.foregroundMuted,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    swatchRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: t.spacing.md,
      paddingVertical: t.spacing.xs,
    },
    swatchChip: {
      width: 32,
      height: 32,
      borderRadius: t.radius.sm,
      borderWidth: 1,
      borderColor: t.colors.border,
    },
    swatchLabel: {
      flex: 1,
      fontSize: t.typography.fontSize.sm,
      color: t.colors.foreground,
    },
    swatchValue: {
      fontSize: t.typography.fontSize.xs,
      color: t.colors.foregroundMuted,
    },
    rulerBar: {
      backgroundColor: t.colors.primary,
      height: 8,
      borderRadius: t.radius.full,
    },
    rulerLabel: {
      width: 56,
      color: t.colors.foreground,
      fontSize: t.typography.fontSize.sm,
    },
    rulerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: t.spacing.md,
    },
    radiusChip: {
      width: 56,
      height: 56,
      backgroundColor: t.colors.primaryMuted,
      borderWidth: 1,
      borderColor: t.colors.border,
    },
    typeSample: { color: t.colors.foreground },
    schemePill: {
      alignSelf: "flex-start",
      paddingHorizontal: t.spacing.md,
      paddingVertical: t.spacing.xs,
      borderRadius: t.radius.full,
      backgroundColor: t.colors.primaryMuted,
    },
    schemeText: {
      color: t.colors.primary,
      fontSize: t.typography.fontSize.xs,
      fontWeight: "600",
    },
  }));

  const colorEntries = Object.entries(theme.colors) as Array<[string, string]>;
  const spacingEntries = Object.entries(spacing) as Array<[string, number]>;
  const radiusEntries  = Object.entries(radius)  as Array<[string, number]>;
  const typeSizes      = Object.entries(typography.fontSize) as Array<[string, number]>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.schemePill}>
        <Text style={styles.schemeText}>{theme.scheme.toUpperCase()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Colors</Text>
        {colorEntries.map(([name, value]) => (
          <View key={name} style={styles.swatchRow}>
            <View style={[styles.swatchChip, { backgroundColor: value }]} />
            <Text style={styles.swatchLabel}>{name}</Text>
            <Text style={styles.swatchValue}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spacing</Text>
        {spacingEntries.map(([name, value]) => (
          <View key={name} style={styles.rulerRow}>
            <Text style={styles.rulerLabel}>{name}</Text>
            <View style={[styles.rulerBar, { width: Math.max(value, 2) }]} />
            <Text style={styles.swatchValue}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Radius</Text>
        <View style={{ flexDirection: "row", gap: theme.spacing.md, flexWrap: "wrap" }}>
          {radiusEntries.map(([name, value]) => (
            <View key={name} style={{ alignItems: "center", gap: theme.spacing.xs }}>
              <View style={[styles.radiusChip, { borderRadius: value }]} />
              <Text style={styles.swatchValue}>{name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Typography</Text>
        {typeSizes.map(([name, size]) => (
          <Text key={name} style={[styles.typeSample, { fontSize: size }]}>
            {name} — The quick brown fox
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}
