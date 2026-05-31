import { forwardRef, type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  type ViewProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "./card";
import { createStyles } from "../../utils/use-styles";

export type AuthScreenProps = Omit<ViewProps, "children" | "style"> & {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  header?: ReactNode;
  footer?: ReactNode;
};

const useStyles = createStyles((t) => ({
  root: { flex: 1, backgroundColor: t.colors.background },
  scroll: { flexGrow: 1, justifyContent: "center", padding: t.spacing.lg },
  card: { gap: t.spacing.lg },
  header: { gap: t.spacing.xs, alignItems: "center" },
  brand: { marginBottom: t.spacing.sm, alignItems: "center" },
  title: {
    fontSize: t.typography.fontSize.xl,
    lineHeight: t.typography.lineHeight.xl,
    fontWeight: "700" as const,
    color: t.colors.foreground,
    textAlign: "center",
  },
  subtitle: {
    fontSize: t.typography.fontSize.sm,
    lineHeight: t.typography.lineHeight.sm,
    color: t.colors.foregroundMuted,
    textAlign: "center",
  },
  footer: { marginTop: t.spacing.lg, alignItems: "center" },
}));

export const AuthScreen = forwardRef<View, AuthScreenProps>(function AuthScreen(
  { children, title, subtitle, header, footer, ...rest },
  ref,
) {
  const styles = useStyles();
  const hasHeader = !!header || !!title || !!subtitle;

  return (
    <SafeAreaView ref={ref} style={styles.root} {...rest}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Card style={styles.card}>
            {hasHeader && (
              <View style={styles.header}>
                {!!header && <View style={styles.brand}>{header}</View>}
                {!!title && <Text style={styles.title}>{title}</Text>}
                {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
              </View>
            )}
            {children}
          </Card>
          {!!footer && <View style={styles.footer}>{footer}</View>}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});
