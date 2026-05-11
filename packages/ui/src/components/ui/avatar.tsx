import { forwardRef, useState } from "react";
import {
  Image,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useStyles } from "../../utils/cn";

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

export const Avatar = forwardRef<View, AvatarProps>(function Avatar(
  { source, name, size = "md", shape = "circle", style },
  ref,
) {
  const [errored, setErrored] = useState(false);
  const px = SIZE_PX[size];

  const styles = useStyles((t) => ({
    base: {
      width: px,
      height: px,
      borderRadius: shape === "circle" ? px / 2 : t.radius.md,
      backgroundColor: t.colors.primaryMuted,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    image: { width: "100%", height: "100%" },
    initials: {
      color: t.colors.primary,
      fontWeight: "600" as const,
      fontSize: px <= 32 ? t.typography.fontSize.xs
              : px <= 40 ? t.typography.fontSize.sm
              : px <= 56 ? t.typography.fontSize.lg
              : t.typography.fontSize.xl,
    },
  }));

  const showImage = !!source && !errored;

  return (
    <View ref={ref} style={[styles.base, style]}>
      {showImage ? (
        <Image source={source} style={styles.image} onError={() => setErrored(true)} />
      ) : (
        <Text style={styles.initials}>{getInitials(name)}</Text>
      )}
    </View>
  );
});
