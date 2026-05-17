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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Variants</Text>
        <VStack gap="sm">
          <Button onPress={() => toast.show("Saved to drafts")}>
            Default toast
          </Button>
          <Button
            variant="secondary"
            onPress={() => toast.success("Payment confirmed")}
          >
            Success toast
          </Button>
          <Button
            variant="secondary"
            onPress={() =>
              toast.warning({ title: "Slow connection", description: "We'll keep trying." })
            }
          >
            Warning toast
          </Button>
          <Button
            variant="destructive"
            onPress={() =>
              toast.error({
                title: "Couldn't sync",
                description: "Check your network and try again.",
              })
            }
          >
            Destructive toast
          </Button>
        </VStack>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Rapid-fire (queue stacking)</Text>
        <Button
          variant="secondary"
          onPress={() => {
            toast.show("First");
            setTimeout(() => toast.success("Second"), 150);
            setTimeout(() => toast.warning("Third"), 300);
            setTimeout(() => toast.error("Fourth (older evicts)"), 450);
          }}
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
