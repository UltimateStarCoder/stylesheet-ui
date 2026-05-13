import { forwardRef, type ReactNode } from "react";
import {
  ScrollView,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
  type Edge,
} from "react-native-safe-area-context";
import { useTheme } from "../../theme/use-theme";
import { useStyles } from "../../utils/cn";

export type ScreenProps = {
  children: ReactNode;
  // Defaults to scrollable since most screens have more content than fits.
  // Set to false to render a fixed-height View instead.
  scroll?: boolean;
  // Safe-area edges to inset. Defaults to ["top"] which is right for screens
  // pushed onto a Stack (header handles top, tab bar handles bottom).
  // Set to undefined to skip SafeAreaView entirely.
  edges?: readonly Edge[] | null;
  // Theme background color override. Defaults to t.colors.background.
  background?: "background" | "surface" | "surfaceMuted";
  // Inset all four sides with this spacing. Common screen padding.
  padding?: number;
  contentStyle?: StyleProp<ViewStyle>;
  scrollProps?: Omit<ScrollViewProps, "children" | "contentContainerStyle">;
};

export const Screen = forwardRef<View, ScreenProps>(function Screen(
  {
    children,
    scroll = true,
    edges = ["top"],
    background = "background",
    padding,
    contentStyle,
    scrollProps,
  },
  ref,
) {
  const theme = useTheme();
  const styles = useStyles((t) => ({
    root: { flex: 1, backgroundColor: t.colors[background] },
    body: {
      flex: scroll ? undefined : 1,
      flexGrow: scroll ? 1 : undefined,
      backgroundColor: t.colors[background],
      ...(padding !== undefined && { padding }),
    },
  }));

  const inner = scroll ? (
    <ScrollView
      ref={ref as unknown as React.Ref<ScrollView>}
      contentContainerStyle={[styles.body, contentStyle]}
      keyboardShouldPersistTaps="handled"
      {...scrollProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View ref={ref} style={[styles.body, contentStyle]}>
      {children}
    </View>
  );

  if (edges) {
    return (
      <SafeAreaView style={styles.root} edges={edges}>
        {inner}
      </SafeAreaView>
    );
  }
  return <View style={styles.root}>{inner}</View>;
});
