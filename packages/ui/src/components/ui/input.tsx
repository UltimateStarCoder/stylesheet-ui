import { forwardRef, useState, type ReactNode } from "react";
import {
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../../theme/use-theme";
import { useStyles } from "../../utils/cn";

export type InputProps = Omit<TextInputProps, "style"> & {
  error?: string;
  leftIcon?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { error, leftIcon, containerStyle, onFocus, onBlur, editable = true, ...rest },
  ref,
) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const styles = useStyles((t) => ({
    wrap: {
      flexDirection: "row",
      alignItems: "center",
      gap: t.spacing.sm,
      borderWidth: 1,
      borderColor: t.colors.border,
      borderRadius: t.radius.md,
      backgroundColor: t.colors.surface,
      paddingHorizontal: t.spacing.md,
      minHeight: 44,
    },
    wrapFocused:  { borderColor: t.colors.ring },
    wrapError:    { borderColor: t.colors.destructive },
    wrapDisabled: { backgroundColor: t.colors.surfaceMuted, opacity: 0.6 },
    input: {
      flex: 1,
      fontSize: t.typography.fontSize.md,
      lineHeight: t.typography.lineHeight.md,
      color: t.colors.foreground,
      paddingVertical: t.spacing.sm,
    },
    error: {
      marginTop: t.spacing.xs,
      color: t.colors.destructive,
      fontSize: t.typography.fontSize.sm,
      lineHeight: t.typography.lineHeight.sm,
    },
  }));

  return (
    <View style={containerStyle}>
      <View
        style={[
          styles.wrap,
          focused && styles.wrapFocused,
          !!error && styles.wrapError,
          !editable && styles.wrapDisabled,
        ]}
      >
        {leftIcon}
        <TextInput
          ref={ref}
          editable={editable}
          placeholderTextColor={theme.colors.foregroundSubtle}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={styles.input}
          {...rest}
        />
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
});
