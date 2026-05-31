import { forwardRef, type ReactNode } from "react";
import {
  Text,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { createStyles } from "../../utils/use-styles";

export type SectionProps = Omit<ViewProps, "children" | "style"> & {
  children: ReactNode;
  title?: string;
  description?: string;
  style?: StyleProp<ViewStyle>;
};

const useStyles = createStyles((t) => ({
  base: { gap: t.spacing.sm },
  title: {
    fontSize: t.typography.fontSize.sm,
    lineHeight: t.typography.lineHeight.sm,
    fontWeight: "600" as const,
    color: t.colors.foregroundMuted,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    paddingHorizontal: t.spacing.xs,
  },
  description: {
    fontSize: t.typography.fontSize.sm,
    lineHeight: t.typography.lineHeight.sm,
    color: t.colors.foregroundMuted,
    paddingHorizontal: t.spacing.xs,
  },
}));

export const Section = forwardRef<View, SectionProps>(function Section(
  { children, title, description, style, ...rest },
  ref,
) {
  const styles = useStyles();
  return (
    <View ref={ref} style={[styles.base, style]} {...rest}>
      {!!title && <Text style={styles.title}>{title}</Text>}
      {children}
      {!!description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
});
