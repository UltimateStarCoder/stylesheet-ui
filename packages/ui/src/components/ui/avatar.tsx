import { forwardRef, useState } from "react";
import {
  Image,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../../theme/use-theme";
import { createStyles } from "../../utils/use-styles";

export type AvatarSize = "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "square";

export type AvatarProps = {
  source?: ImageSourcePropType;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  style?: StyleProp<ViewStyle>;
};

const SIZE_PX: Record<AvatarSize, number> = {
  sm: 28,
  md: 36,
  lg: 48,
  xl: 64,
};

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

const useStyles = createStyles((t) => ({
  // Static styles only. Width/height/borderRadius/fontSize depend on the
  // `size` and `shape` props, so they're applied inline at the call site.
  base: {
    backgroundColor: t.colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  initials: {
    color: t.colors.primary,
    fontWeight: "600" as const,
  },
}));

export const Avatar = forwardRef<View, AvatarProps>(function Avatar(
  { source, name, size = "md", shape = "circle", style },
  ref,
) {
  const theme = useTheme();
  const styles = useStyles();
  const [errored, setErrored] = useState(false);
  const px = SIZE_PX[size];

  const borderRadius = shape === "circle" ? px / 2 : theme.radius.md;
  const fontSize =
    px <= 32 ? theme.typography.fontSize.xs
    : px <= 40 ? theme.typography.fontSize.sm
    : px <= 56 ? theme.typography.fontSize.lg
    : theme.typography.fontSize.xl;

  const showImage = !!source && !errored;

  return (
    <View
      ref={ref}
      style={[styles.base, { width: px, height: px, borderRadius }, style]}
    >
      {showImage ? (
        <Image source={source} style={styles.image} onError={() => setErrored(true)} />
      ) : (
        <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
      )}
    </View>
  );
});
