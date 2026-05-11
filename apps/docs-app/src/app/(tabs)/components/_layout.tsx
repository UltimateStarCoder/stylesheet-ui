import { Stack } from "expo-router";
import { useTheme } from "@stylesheet-ui/ui";

export default function ComponentsLayout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTitleStyle: { color: theme.colors.foreground },
        headerTintColor: theme.colors.primary,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index"        options={{ title: "Components" }} />
      <Stack.Screen name="button"       options={{ title: "Button" }} />
      <Stack.Screen name="input"        options={{ title: "Input" }} />
      <Stack.Screen name="card"         options={{ title: "Card" }} />
      <Stack.Screen name="text"         options={{ title: "Text" }} />
      <Stack.Screen name="avatar"       options={{ title: "Avatar" }} />
      <Stack.Screen name="badge"        options={{ title: "Badge" }} />
      <Stack.Screen name="list-item"    options={{ title: "ListItem" }} />
      <Stack.Screen name="modal"        options={{ title: "Modal" }} />
      <Stack.Screen name="tabs"         options={{ title: "Tabs" }} />
      <Stack.Screen name="settings-row" options={{ title: "SettingsRow" }} />
    </Stack>
  );
}
