import { useState } from "react";
import { ScrollView, View } from "react-native";
import {
  BottomSheet,
  Button,
  Card,
  ListItem,
  Text,
  VStack,
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
  sheetTitle: {
    fontSize: t.typography.fontSize.lg,
    fontWeight: "600",
    color: t.colors.foreground,
    marginBottom: t.spacing.sm,
  },
  sheetBody: {
    color: t.colors.foregroundMuted,
    fontSize: t.typography.fontSize.sm,
    lineHeight: t.typography.lineHeight.sm,
  },
}));

export default function BottomSheetDemo() {
  const styles = useStyles();
  const [autoOpen, setAutoOpen] = useState(false);
  const [fixedOpen, setFixedOpen] = useState(false);
  const [snapOpen, setSnapOpen] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Auto-fit to content (default)</Text>
        <Button onPress={() => setAutoOpen(true)}>Open auto-fit sheet</Button>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Fixed height (60%)</Text>
        <Button variant="secondary" onPress={() => setFixedOpen(true)}>
          Open fixed-height sheet
        </Button>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Snap points (30% / 60% / 90%)</Text>
        <Button variant="secondary" onPress={() => setSnapOpen(true)}>
          Open snap-point sheet
        </Button>
      </View>

      <BottomSheet visible={autoOpen} onClose={() => setAutoOpen(false)}>
        <VStack gap="md">
          <Text style={styles.sheetTitle}>Confirm action</Text>
          <Text style={styles.sheetBody}>
            The sheet measures its children with onLayout and snaps to that
            height. Drag down to dismiss, or use the buttons.
          </Text>
          <Button variant="destructive" onPress={() => setAutoOpen(false)}>
            Confirm
          </Button>
          <Button variant="ghost" onPress={() => setAutoOpen(false)}>
            Cancel
          </Button>
        </VStack>
      </BottomSheet>

      <BottomSheet
        visible={fixedOpen}
        onClose={() => setFixedOpen(false)}
        height="60%"
      >
        <Text style={styles.sheetTitle}>Fixed 60% height</Text>
        <Text style={styles.sheetBody}>
          When you pass {`height="60%"`}, the sheet ignores content height and
          sits at exactly that fraction of the screen. Useful when you want a
          consistent feel for similar sheets.
        </Text>
      </BottomSheet>

      <BottomSheet
        visible={snapOpen}
        onClose={() => setSnapOpen(false)}
        snapPoints={["30%", "60%", "90%"]}
        initialSnap={0}
      >
        <VStack gap="md">
          <Text style={styles.sheetTitle}>Snap points</Text>
          <Card padding="none">
            <ListItem title="Item one" subtitle="Drag the sheet up to see more" />
            <ListItem title="Item two" />
            <ListItem title="Item three" />
            <ListItem title="Item four" />
            <ListItem title="Item five" />
            <ListItem title="Item six" />
          </Card>
        </VStack>
      </BottomSheet>
    </ScrollView>
  );
}
