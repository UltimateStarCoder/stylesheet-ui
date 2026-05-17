import { Stack } from "expo-router";
import { useTheme } from "@stylesheet-ui/ui";

export default function EmbedLayout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  );
}
