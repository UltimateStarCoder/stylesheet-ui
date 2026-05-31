import { ScrollView, View } from "react-native";
import { Button, Text, VStack, createStyles, toast } from "@stylesheet-ui/ui";

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
  body: {
    color: t.colors.foregroundMuted,
    fontSize: t.typography.fontSize.sm,
  },
}));

export default function ToastDemo() {
  const styles = useStyles();
  return (
    <ScrollView contentContainerStyle={styles.container} testID="screen-toast">
      <View style={styles.section}>
        <Text style={styles.label}>Variants</Text>
        <VStack gap="sm">
          <Button
            fullWidth
            onPress={() => toast.show({ description: "Saved to drafts", testID: "toast-item-default" })}
            testID="toast-show-default"
          >
            Default toast
          </Button>
          <Button
            fullWidth
            variant="secondary"
            onPress={() => toast.success({ description: "Payment confirmed", testID: "toast-item-success" })}
            testID="toast-show-success"
          >
            Success toast
          </Button>
          <Button
            fullWidth
            variant="secondary"
            onPress={() =>
              toast.warning({ title: "Slow connection", description: "We'll keep trying.", testID: "toast-item-warning" })
            }
            testID="toast-show-warning"
          >
            Warning toast
          </Button>
          <Button
            fullWidth
            variant="destructive"
            onPress={() =>
              toast.error({
                title: "Couldn't sync",
                description: "Check your network and try again.",
                testID: "toast-item-error",
              })
            }
            testID="toast-show-error"
          >
            Destructive toast
          </Button>
        </VStack>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Rapid-fire (queue stacking)</Text>
        <Button
          fullWidth
          variant="secondary"
          onPress={() => {
            toast.show("First");
            setTimeout(() => toast.success("Second"), 150);
            setTimeout(() => toast.warning("Third"), 300);
            setTimeout(() => toast.error("Fourth (older evicts)"), 450);
          }}
          testID="toast-show-rapid-fire"
        >
          Fire four in a row
        </Button>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Imperative API</Text>
        <Text style={styles.body}>
          {`import { toast } from "@/components/ui/toast";\ntoast.show("Saved");`}
        </Text>
      </View>
    </ScrollView>
  );
}
