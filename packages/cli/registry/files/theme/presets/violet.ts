const palette = {
  primary: {
    50:  "#F5F3FF",
    100: "#EDE9FE",
    200: "#DDD6FE",
    300: "#C4B5FD",
    400: "#A78BFA",
    500: "#8B5CF6",
    600: "#7C3AED",
    700: "#6D28D9",
    800: "#5B21B6",
    900: "#4C1D95",
    950: "#2E1065",
  },
  neutral: {
    50:  "#FAFAFA",
    100: "#F4F4F5",
    200: "#E4E4E7",
    300: "#D4D4D8",
    400: "#A1A1AA",
    500: "#71717A",
    600: "#52525B",
    700: "#3F3F46",
    800: "#27272A",
    900: "#18181B",
    950: "#09090B",
  },
  red:   { 400: "#F87171", 500: "#EF4444", 600: "#DC2626" },
  green: { 400: "#34D399", 500: "#10B981", 600: "#059669" },
  amber: { 400: "#FBBF24", 500: "#F59E0B", 600: "#D97706" },
} as const;

export type ColorTokens = {
  background: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  borderStrong: string;
  foreground: string;
  foregroundMuted: string;
  foregroundSubtle: string;
  primary: string;
  primaryForeground: string;
  primaryMuted: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  warning: string;
  ring: string;
  overlay: string;
};

export const lightColors: ColorTokens = {
  background:            palette.neutral[50],
  surface:               "#FFFFFF",
  surfaceMuted:          palette.neutral[100],
  border:                palette.neutral[200],
  borderStrong:          palette.neutral[300],
  foreground:            palette.neutral[900],
  foregroundMuted:       palette.neutral[500],
  foregroundSubtle:      palette.neutral[400],
  primary:               palette.primary[600],
  primaryForeground:     "#FFFFFF",
  primaryMuted:          palette.primary[100],
  destructive:           palette.red[500],
  destructiveForeground: "#FFFFFF",
  success:               palette.green[600],
  warning:               palette.amber[600],
  ring:                  palette.primary[600],
  overlay:               "rgba(9, 9, 11, 0.45)",
};

export const darkColors: ColorTokens = {
  background:            palette.neutral[950],
  surface:               palette.neutral[900],
  surfaceMuted:          palette.neutral[800],
  border:                palette.neutral[800],
  borderStrong:          palette.neutral[700],
  foreground:            palette.neutral[50],
  foregroundMuted:       palette.neutral[400],
  foregroundSubtle:      palette.neutral[500],
  primary:               palette.primary[400],
  primaryForeground:     palette.primary[950],
  primaryMuted:          palette.primary[900],
  destructive:           palette.red[400],
  destructiveForeground: palette.neutral[950],
  success:               palette.green[400],
  warning:               palette.amber[400],
  ring:                  palette.primary[400],
  overlay:               "rgba(0, 0, 0, 0.65)",
};

export { palette };
