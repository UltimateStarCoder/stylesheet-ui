import { Fragment, type ReactNode } from "react";
import {
  Text,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { createStyles } from "../../utils/use-styles";

export type TableColumn<T> = {
  key: string;
  header: ReactNode;
  flex?: number;
  render?: (row: T, index: number) => ReactNode;
  // Applied to this column's header cell so it can be found in tests.
  testID?: string;
};

export type TableProps<T> = Omit<ViewProps, "children" | "style"> & {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor?: (row: T, index: number) => string;
  // Returns a testID for each body row so individual rows can be found in tests.
  rowTestID?: (row: T, index: number) => string;
  style?: StyleProp<ViewStyle>;
};

const useStyles = createStyles((t) => ({
  base: {
    borderRadius: t.radius.lg,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
    overflow: "hidden",
    ...t.shadows.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: t.spacing.md,
    paddingHorizontal: t.spacing.lg,
    gap: t.spacing.md,
  },
  header: { backgroundColor: t.colors.surfaceMuted },
  headerText: {
    fontSize: t.typography.fontSize.xs,
    lineHeight: t.typography.lineHeight.xs,
    fontWeight: "600" as const,
    color: t.colors.foregroundMuted,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  cellText: {
    fontSize: t.typography.fontSize.sm,
    lineHeight: t.typography.lineHeight.sm,
    color: t.colors.foreground,
  },
  divider: { height: 1, backgroundColor: t.colors.border },
}));

export function Table<T>({
  columns,
  data,
  keyExtractor,
  rowTestID,
  style,
  ...rest
}: TableProps<T>) {
  const styles = useStyles();

  return (
    <View style={[styles.base, style]} {...rest}>
      <View style={[styles.row, styles.header]}>
        {columns.map((col) => (
          <View key={col.key} testID={col.testID} style={{ flex: col.flex ?? 1 }}>
            {typeof col.header === "string" ? (
              <Text style={styles.headerText}>{col.header}</Text>
            ) : (
              col.header
            )}
          </View>
        ))}
      </View>
      {data.map((row, i) => (
        <Fragment key={keyExtractor ? keyExtractor(row, i) : i}>
          <View style={styles.divider} />
          <View style={styles.row} testID={rowTestID?.(row, i)}>
            {columns.map((col) => (
              <View key={col.key} style={{ flex: col.flex ?? 1 }}>
                {col.render ? (
                  col.render(row, i)
                ) : (
                  <Text style={styles.cellText}>
                    {String((row as Record<string, unknown>)[col.key] ?? "")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </Fragment>
      ))}
    </View>
  );
}
