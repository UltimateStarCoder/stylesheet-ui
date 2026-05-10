import { Tabs } from "expo-router";
import { useTheme } from "@stylesheet-ui/ui";

export default function TabsLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTitleStyle: { color: theme.colors.foreground },
        sceneStyle: { backgroundColor: theme.colors.background },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.foregroundMuted,
      }}
    >
      <Tabs.Screen name="components" options={{ title: "Components", headerShown: false }} />
      <Tabs.Screen name="theme"      options={{ title: "Theme" }} />
      <Tabs.Screen name="about"      options={{ title: "About" }} />
    </Tabs>
  );
}
