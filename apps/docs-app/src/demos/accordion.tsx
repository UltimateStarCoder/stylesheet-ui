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
    <ScrollView contentContainerStyle={styles.container} testID="screen-accordion">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Single</Text>
        <Accordion type="single" defaultValue="shipping" testID="accordion-single">
          <AccordionItem value="shipping" first testID="accordion-item-shipping">
            <AccordionTrigger testID="accordion-trigger-shipping">Shipping</AccordionTrigger>
            <AccordionContent testID="accordion-content-shipping">
              <Text style={styles.body}>
                Orders ship within 1–2 business days. Carbon-neutral courier.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="returns" testID="accordion-item-returns">
            <AccordionTrigger testID="accordion-trigger-returns">Returns</AccordionTrigger>
            <AccordionContent testID="accordion-content-returns">
              <Text style={styles.body}>
                30-day money-back guarantee — no questions asked.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="warranty" testID="accordion-item-warranty">
            <AccordionTrigger testID="accordion-trigger-warranty">Warranty</AccordionTrigger>
            <AccordionContent testID="accordion-content-warranty">
              <Text style={styles.body}>
                Two-year limited warranty against manufacturer defects.
              </Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Multiple</Text>
        <Accordion type="multiple" defaultValue={["a"]} testID="accordion-multiple">
          <AccordionItem value="a" first testID="accordion-item-a">
            <AccordionTrigger testID="accordion-trigger-a">Section A</AccordionTrigger>
            <AccordionContent testID="accordion-content-a">
              <Text style={styles.body}>Multiple panels can be open at once.</Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b" testID="accordion-item-b">
            <AccordionTrigger testID="accordion-trigger-b">Section B</AccordionTrigger>
            <AccordionContent testID="accordion-content-b">
              <Text style={styles.body}>Try opening this without closing A.</Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </View>
    </ScrollView>
  );
}
