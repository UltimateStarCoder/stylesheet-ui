import { useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  createStyles,
} from "@stylesheet-ui/ui";

const useStyles = createStyles((t) => ({
  container: {
    padding: t.spacing.lg,
    gap: t.spacing.xl,
    backgroundColor: t.colors.background,
    flexGrow: 1,
  },
  section: { gap: t.spacing.sm },
  label: {
    fontSize: t.typography.fontSize.sm,
    fontWeight: "600",
    color: t.colors.foregroundMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  panel: {
    padding: t.spacing.lg,
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  body: {
    fontSize: t.typography.fontSize.sm,
    lineHeight: t.typography.lineHeight.sm,
    color: t.colors.foreground,
  },
}));

export default function TabsDemo() {
  const styles = useStyles();
  const [value, setValue] = useState("preview");

  return (
    <ScrollView contentContainerStyle={styles.container} testID="screen-tabs">
      <View style={styles.section}>
        <Text style={styles.label}>Uncontrolled</Text>
        <Tabs defaultValue="account" testID="tabs-uncontrolled">
          <TabsList testID="tabs-list-uncontrolled">
            <TabsTrigger value="account" testID="tabs-trigger-account">Account</TabsTrigger>
            <TabsTrigger value="password" testID="tabs-trigger-password">Password</TabsTrigger>
            <TabsTrigger value="api" testID="tabs-trigger-api">API</TabsTrigger>
          </TabsList>
          <TabsContent value="account" testID="tabs-content-account">
            <View style={styles.panel}>
              <Text style={styles.body}>Manage your account settings and preferences.</Text>
            </View>
          </TabsContent>
          <TabsContent value="password" testID="tabs-content-password">
            <View style={styles.panel}>
              <Text style={styles.body}>Change your password and security options here.</Text>
            </View>
          </TabsContent>
          <TabsContent value="api" testID="tabs-content-api">
            <View style={styles.panel}>
              <Text style={styles.body}>Rotate API keys and configure rate limits.</Text>
            </View>
          </TabsContent>
        </Tabs>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Controlled (value: {value})</Text>
        <Tabs value={value} onValueChange={setValue} testID="tabs-controlled">
          <TabsList testID="tabs-list-controlled">
            <TabsTrigger value="preview" testID="tabs-trigger-preview">Preview</TabsTrigger>
            <TabsTrigger value="code" testID="tabs-trigger-code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" testID="tabs-content-preview">
            <View style={styles.panel}>
              <Text style={styles.body}>The rendered preview goes here.</Text>
            </View>
          </TabsContent>
          <TabsContent value="code" testID="tabs-content-code">
            <View style={styles.panel}>
              <Text style={styles.body}>{`<Button>Click me</Button>`}</Text>
            </View>
          </TabsContent>
        </Tabs>
      </View>
    </ScrollView>
  );
}
