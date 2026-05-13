# stylesheet-ui

shadcn-style copy-paste components for Expo / React Native.

Plain `StyleSheet.create`. No DSL. No runtime. You own the source.

## Install

In any Expo / React Native project:

```sh
npx stylesheet-ui init
```

This creates a `stylesheet-ui.json` config and copies the theme tokens into your project.

Then wrap your app:

```tsx
import { ThemeProvider } from "@/theme";

export default function RootLayout() {
  return (
    <ThemeProvider>
      {/* your app */}
    </ThemeProvider>
  );
}
```

## Add components

```sh
npx stylesheet-ui add button
npx stylesheet-ui add input card avatar
```

Component source lands at `src/components/ui/<name>.tsx` and is yours to edit.

## What's included

Run `npx stylesheet-ui list` to see every component, grouped by type, in your terminal.

**Components:** Button, Input, Card, Text, Avatar, Badge, ListItem, Modal, Tabs, SettingsRow, Stack, Screen, Divider, Switch, Checkbox, Radio, Slider.

**Tokens:** colors (light + dark), spacing, radius, typography, shadows.

## Icons

Components like `Button`, `ListItem`, and `SettingsRow` accept `ReactNode` for their icon slots — they're icon-library-agnostic. We recommend [`lucide-react-native`](https://lucide.dev/guide/packages/lucide-react-native) for cross-platform parity, or [`expo-symbols`](https://docs.expo.dev/versions/latest/sdk/symbols/) if you want SF Symbols on iOS and an Android fallback.

```sh
npx expo install lucide-react-native react-native-svg
```

```tsx
import { Bell } from "lucide-react-native";
import { SettingsRow } from "@/components/ui/settings-row";

<SettingsRow title="Notifications" icon={<Bell size={18} />} />
```

## Configuration

`stylesheet-ui.json` (created by `init`):

```json
{
  "version": "0.0.2",
  "aliases": {
    "components": "@/components/ui",
    "theme": "@/theme",
    "utils": "@/utils"
  },
  "paths": {
    "components": "src/components/ui",
    "theme": "src/theme",
    "utils": "src/utils"
  }
}
```

`paths.*` is where files are written. `aliases.*` is what gets used in copied imports. `version` stamps which CLI initialized this project — running a newer CLI against an older config prints a one-line drift notice but doesn't block.

## Dark mode toggle

Two hooks ship with the theme:

- `useTheme()` — returns the active `Theme` tokens (use in styles).
- `useThemeMode()` — returns `{ scheme, override, setScheme, isDark }` (use in toggle UI).

```tsx
import { Switch } from "@/components/ui/switch";
import { useThemeMode } from "@/theme";

function ThemeToggle() {
  const { isDark, setScheme } = useThemeMode();
  return (
    <Switch
      value={isDark}
      onValueChange={(v) => setScheme(v ? "dark" : "light")}
    />
  );
}
```

`setScheme("system")` returns to following the OS. `<ThemeProvider defaultScheme="system">` is the default. Pass `onOverrideChange` to persist the user's choice to AsyncStorage / MMKV.

## CLI commands

```sh
npx stylesheet-ui init           # set up stylesheet-ui.json + foundation
npx stylesheet-ui list           # show every component (alias: ls)
npx stylesheet-ui add button     # add one or more components
npx stylesheet-ui add button -y  # skip overwrite prompts
npx stylesheet-ui add button -v  # print one line per file (default is summarized)
```

## Philosophy

The CLI copies real source into your project. Customize freely — no upstream "API" to break against. The library doesn't ship as a runtime dependency; only what you copy lives in your bundle.

## License

MIT
