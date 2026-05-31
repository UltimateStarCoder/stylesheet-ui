import { forwardRef, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { createStyles } from "../../utils/use-styles";

// Segmented verification-code input. A single hidden TextInput sits on top of
// the rendered cells and owns the real value/caret; tapping anywhere focuses
// it. Controlled via `value`/`onChange`; fires `onComplete` once `length`
// digits are entered. Used for both email-verification and password-reset.
export type OtpInputProps = Omit<ViewProps, "style"> & {
  value: string;
  onChange: (next: string) => void;
  length?: number;
  onComplete?: (code: string) => void;
  error?: string;
  autoFocus?: boolean;
  editable?: boolean;
  style?: StyleProp<ViewStyle>;
};

const useStyles = createStyles((t) => ({
  wrap: { position: "relative" },
  row: { flexDirection: "row", gap: t.spacing.sm },
  cell: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: t.colors.border,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  cellFilled: { borderColor: t.colors.borderStrong },
  cellActive: { borderColor: t.colors.ring },
  cellError: { borderColor: t.colors.destructive },
  // Invisible but focusable: it captures taps and the keyboard over the cells.
  hiddenInput: { opacity: 0 },
  digit: {
    fontSize: t.typography.fontSize.lg,
    lineHeight: t.typography.lineHeight.lg,
    fontWeight: "600" as const,
    color: t.colors.foreground,
  },
  error: {
    marginTop: t.spacing.xs,
    color: t.colors.destructive,
    fontSize: t.typography.fontSize.sm,
    lineHeight: t.typography.lineHeight.sm,
  },
}));

export const OtpInput = forwardRef<TextInput, OtpInputProps>(function OtpInput(
  { value, onChange, length = 6, onComplete, error, autoFocus, editable = true, style, ...rest },
  ref,
) {
  const styles = useStyles();
  const inputRef = useRef<TextInput | null>(null);
  const [focused, setFocused] = useState(false);

  const handleChange = (text: string) => {
    const next = text.replace(/[^0-9]/g, "").slice(0, length);
    onChange(next);
    if (next.length === length) onComplete?.(next);
  };

  const cells = Array.from({ length }, (_, i) => i);
  const activeIndex = Math.min(value.length, length - 1);

  return (
    <View style={style} {...rest}>
      <View style={styles.wrap}>
        <View style={styles.row}>
          {cells.map((i) => {
            const isActive = focused && editable && i === activeIndex;
            return (
              <View
                key={i}
                style={[
                  styles.cell,
                  i < value.length && styles.cellFilled,
                  isActive && styles.cellActive,
                  !!error && styles.cellError,
                ]}
              >
                <Text style={styles.digit}>{value[i] ?? ""}</Text>
              </View>
            );
          })}
        </View>
        {/* Transparent overlay owns the value, caret, and taps. */}
        <TextInput
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<TextInput | null>).current = node;
          }}
          value={value}
          onChangeText={handleChange}
          keyboardType="number-pad"
          maxLength={length}
          autoFocus={autoFocus}
          editable={editable}
          caretHidden
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          accessibilityLabel="Verification code"
          style={[StyleSheet.absoluteFill, styles.hiddenInput]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
});
