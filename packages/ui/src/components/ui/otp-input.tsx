import { forwardRef, useEffect, useRef, useState } from "react";
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

// A single transparent TextInput overlays the rendered cells and owns the
// value and caret, so the cells stay display-only and a tap anywhere focuses
// the field.
export type OtpInputProps = Omit<ViewProps, "style"> & {
  value: string;
  onChange: (next: string) => void;
  length?: number;
  onComplete?: (code: string) => void;
  error?: string;
  autoFocus?: boolean;
  editable?: boolean;
  // When set, renders a "Resend code" action gated by a countdown.
  onResend?: () => void;
  resendSeconds?: number;
  style?: StyleProp<ViewStyle>;
};

const formatCountdown = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

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
  resend: { marginTop: t.spacing.md, alignItems: "center" },
  resendMuted: {
    color: t.colors.foregroundMuted,
    fontSize: t.typography.fontSize.sm,
    lineHeight: t.typography.lineHeight.sm,
  },
  resendLink: {
    color: t.colors.primary,
    fontWeight: "600",
    fontSize: t.typography.fontSize.sm,
  },
}));

export const OtpInput = forwardRef<TextInput, OtpInputProps>(function OtpInput(
  {
    value,
    onChange,
    length = 6,
    onComplete,
    error,
    autoFocus,
    editable = true,
    onResend,
    resendSeconds = 30,
    style,
    ...rest
  },
  ref,
) {
  const styles = useStyles();
  const inputRef = useRef<TextInput | null>(null);
  const [focused, setFocused] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(resendSeconds);

  // `counting` flips only when the cooldown starts or reaches zero, so the
  // interval is created once per cooldown rather than recreated each tick.
  const counting = !!onResend && secondsLeft > 0;
  useEffect(() => {
    if (!counting) return;
    const id = setInterval(() => setSecondsLeft((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [counting]);

  const handleChange = (text: string) => {
    const next = text.replace(/[^0-9]/g, "").slice(0, length);
    onChange(next);
    if (next.length === length) onComplete?.(next);
  };

  const handleResend = () => {
    onResend?.();
    setSecondsLeft(resendSeconds);
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

      {!!onResend && (
        <View style={styles.resend}>
          {secondsLeft > 0 ? (
            <Text style={styles.resendMuted}>Resend code in {formatCountdown(secondsLeft)}</Text>
          ) : (
            <Pressable onPress={handleResend} accessibilityRole="button">
              <Text style={styles.resendLink}>Resend code</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
});
