export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 28,
    "2xl": 32,
    "3xl": 36,
    "4xl": 40,
  },
  fontWeight: {
    regular:  "400",
    medium:   "500",
    semibold: "600",
    bold:     "700",
  },
} as const;

export type TypographyTokens = typeof typography;
