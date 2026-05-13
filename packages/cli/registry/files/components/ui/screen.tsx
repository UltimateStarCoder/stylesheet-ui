import { forwardRef, type ReactNode } from "react";
import {
  ScrollView,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { useTheme } from "../../theme/use-theme";

export type ScreenProps = {
  children: ReactNode;
  // Defaults to scrollable since most screens have more content than fits.
  // Set to false to render a fixed-height View instead.
  scroll?: boolean;
  // Safe-area edges to inset. Defaults to ["top"] which is right for screens
  // pushed onto a Stack (header handles top, tab bar handles bottom).
  // Set to null to skip SafeAreaView entirely.
  edges?: readonly Edge[] | null;
  // Theme background color token. Defaults to t.colors.background.
  background?: "background" | "surface" | "surfaceMuted";
  // Inset all four sides with this spacing. Common screen padding.
  padding?: number;
  contentStyle?: StyleProp<ViewStyle>;
  scrollProps?: Omit<ScrollViewProps, "children" | "contentContainerStyle">;
};

// Screen's styles are mostly prop-derived (which theme color, whether to
// scroll, padding). The static parts aren't worth a separate createStyles
// hook — inline composition is clearer here.
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
  const bg = theme.colors[background];
  const rootStyle: ViewStyle = { flex: 1, backgroundColor: bg };
  const bodyStyle: ViewStyle = {
    flex: scroll ? undefined : 1,
    flexGrow: scroll ? 1 : undefined,
    backgroundColor: bg,
    ...(padding !== undefined && { padding }),
  };

  const inner = scroll ? (
    <ScrollView
      ref={ref as unknown as React.Ref<ScrollView>}
      contentContainerStyle={[bodyStyle, contentStyle]}
      keyboardShouldPersistTaps="handled"
      {...scrollProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View ref={ref} style={[bodyStyle, contentStyle]}>
      {children}
    </View>
  );

  if (edges) {
    return (
      <SafeAreaView style={rootStyle} edges={edges}>
        {inner}
      </SafeAreaView>
    );
  }
  return <View style={rootStyle}>{inner}</View>;
});
