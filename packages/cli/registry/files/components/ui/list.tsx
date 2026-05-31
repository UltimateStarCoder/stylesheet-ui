import { Children, forwardRef, isValidElement, type ReactNode } from "react";
import {
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { Divider } from "./divider";
import type { SpacingKey } from "../../theme/spacing";
import { createStyles } from "../../utils/use-styles";

export type ListSurface = "default" | "muted" | "outline";

export type ListProps = Omit<ViewProps, "children" | "style"> & {
  children: ReactNode;
  surface?: ListSurface;
  divided?: boolean;
  inset?: SpacingKey;
  style?: StyleProp<ViewStyle>;
};

const useStyles = createStyles((t) => ({
  base: {
    borderRadius: t.radius.lg,
    overflow: "hidden",
    borderWidth: 1,
  },
  default: {
    backgroundColor: t.colors.surface,
    borderColor: t.colors.border,
    ...t.shadows.sm,
  },
  muted: {
    backgroundColor: t.colors.surfaceMuted,
    borderColor: t.colors.border,
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: t.colors.borderStrong,
  },
}));

export const List = forwardRef<View, ListProps>(function List(
  { children, surface = "default", divided = true, inset = "lg", style, ...rest },
  ref,
) {
  const styles = useStyles();
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <View ref={ref} style={[styles.base, styles[surface], style]} {...rest}>
      {items.map((child, i) => (
        <View key={child.key ?? i}>
          {child}
          {divided && i < items.length - 1 && <Divider inset={inset} />}
        </View>
      ))}
    </View>
  );
});
