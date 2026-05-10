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
      <Stack.Screen name="index"  options={{ title: "Components" }} />
      <Stack.Screen name="button" options={{ title: "Button" }} />
      <Stack.Screen name="input"  options={{ title: "Input" }} />
      <Stack.Screen name="card"   options={{ title: "Card" }} />
    </Stack>
  );
}
