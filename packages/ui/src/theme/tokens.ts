import { darkColors, lightColors } from "./colors";
import { radius } from "./radius";
import { shadows } from "./shadows";
import { spacing } from "./spacing";
import { typography } from "./typography";

export type Theme = {
  scheme: "light" | "dark";
  colors: typeof lightColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  shadows: typeof shadows;
};

export const lightTheme: Theme = {
  scheme: "light",
  colors: lightColors,
  spacing,
  radius,
  typography,
  shadows,
};

export const darkTheme: Theme = {
  scheme: "dark",
  colors: darkColors,
  spacing,
  radius,
  typography,
  shadows,
};

export const themes = { light: lightTheme, dark: darkTheme } as const;
