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

Button, Input, Card, Text, Avatar, Badge, ListItem, Modal, Tabs, SettingsRow.

Tokens: colors (light + dark), spacing, radius, typography, shadows.

## Configuration

`stylesheet-ui.json` (created by `init`):

```json
{
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

`paths.*` is where files are written. `aliases.*` is what gets used in copied imports.

## Philosophy

The CLI copies real source into your project. Customize freely — no upstream "API" to break against. The library doesn't ship as a runtime dependency; only what you copy lives in your bundle.

## License

MIT
