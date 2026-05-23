import { ScrollView, Text, View } from "react-native";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  createStyles,
} from "@stylesheet-ui/ui";

const useStyles = createStyles((t) => ({
  container: {
    padding: t.spacing.lg,
    gap: t.spacing.xl,
    backgroundColor: t.colors.background,
    flexGrow: 1,
  },
  section:      { gap: t.spacing.sm },
  sectionTitle: {
    fontSize: t.typography.fontSize.sm,
    fontWeight: "600",
    color: t.colors.foregroundMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  body: {
    fontSize: t.typography.fontSize.sm,
    lineHeight: t.typography.lineHeight.sm,
    color: t.colors.foregroundMuted,
  },
}));

export default function AccordionDemo() {
  const styles = useStyles();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Single</Text>
        <Accordion type="single" defaultValue="shipping">
          <AccordionItem value="shipping" first>
            <AccordionTrigger>Shipping</AccordionTrigger>
            <AccordionContent>
              <Text style={styles.body}>
                Orders ship within 1–2 business days. Carbon-neutral courier.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="returns">
            <AccordionTrigger>Returns</AccordionTrigger>
            <AccordionContent>
              <Text style={styles.body}>
                30-day money-back guarantee — no questions asked.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="warranty">
            <AccordionTrigger>Warranty</AccordionTrigger>
            <AccordionContent>
              <Text style={styles.body}>
                Two-year limited warranty against manufacturer defects.
              </Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Multiple</Text>
        <Accordion type="multiple" defaultValue={["a"]}>
          <AccordionItem value="a" first>
            <AccordionTrigger>Section A</AccordionTrigger>
            <AccordionContent>
              <Text style={styles.body}>Multiple panels can be open at once.</Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Section B</AccordionTrigger>
            <AccordionContent>
              <Text style={styles.body}>Try opening this without closing A.</Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </View>
    </ScrollView>
  );
}
