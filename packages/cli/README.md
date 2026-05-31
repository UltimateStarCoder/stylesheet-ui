# stylesheet-ui

Copy-paste React Native components for Expo, distributed as source you own.

Plain `StyleSheet.create`. No DSL. No lock-in.

Docs: <https://stylesheet-ui.dev>

## Install

In any Expo / React Native project:

```sh
npx stylesheet-ui init
```

This creates a `stylesheet-ui.json` config and copies the theme tokens into your project. You'll be prompted for a theme preset (see below).

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

## Theme presets

`init` prompts you to pick a preset that sets the primary accent color across every component:

| Preset   | Vibe                                |
| -------- | ----------------------------------- |
| `mono`   | Black / white accent (default)      |
| `blue`   | Standard product blue               |
| `green`  | Linear-style green                  |
| `violet` | Vibrant purple                      |
| `rose`   | Bold rose-red                       |

Skip the prompt with a flag:

```sh
npx stylesheet-ui init -y --preset blue
```

The preset is written into your project as `theme/colors.ts` — a plain file with `lightColors`, `darkColors`, and `palette` exports. Edit it freely; nothing upstream cares.

## Add components

```sh
npx stylesheet-ui add button
npx stylesheet-ui add input card avatar
```

Component source lands at `src/components/ui/<name>.tsx` and is yours to edit. If a file already exists, the CLI detects local edits and prompts before overwriting — use `--force` to overwrite anyway, or `--yes` to keep your version.

## What's included

Run `npx stylesheet-ui list` to see every entry in your terminal. Pass `--json` for machine-readable output (handy for tooling and AI agents).

**Layout:** Screen, Stack, Section, Divider.

**Display:** Text, Avatar, Badge, Card, List, ListItem, SettingsRow, Table, Skeleton, Spinner.

**Inputs:** Button, Input, Checkbox, Radio, Switch, Slider, Select.

**Feedback:** Alert, Progress, Toast, Tooltip.

**Overlays:** Modal, BottomSheet, AlertDialog, Menu, Accordion, Tabs.

**Auth:** AuthScreen, SignInForm, SignUpForm, OtpInput, SocialAuthButtons, SocialIcons, NewPasswordForm, UserCard — copy-paste authentication UI that works with any backend. The components own the UI/UX; you wire each `onSubmit` to your auth provider. See [Authentication](#authentication).

**Foundation:** colors (light + dark, 5 presets), spacing, radius, typography, shadows, `ThemeProvider`, `useTheme`, `useThemeMode`.

## Icons

Components like `Button`, `ListItem`, and `SettingsRow` accept `ReactNode` for their icon slots — they're icon-library-agnostic. We recommend [`lucide-react-native`](https://lucide.dev/guide/packages/lucide-react-native) for cross-platform parity, or [`expo-symbols`](https://docs.expo.dev/versions/latest/sdk/symbols/) if you want SF Symbols on iOS and Material Symbols on Android.

```sh
npx expo install lucide-react-native react-native-svg
```

```tsx
import { Bell } from "lucide-react-native";
import { SettingsRow } from "@/components/ui/settings-row";

<SettingsRow title="Notifications" icon={<Bell size={18} />} />
```

## Authentication

The auth components are plain StyleSheet — they own the UI and work with **any** backend (or your own API). Each form holds its field state and hands the values to `onSubmit`; you call your provider and feed `loading` / `error` back in.

```sh
npx stylesheet-ui add auth-screen sign-in-form sign-up-form otp-input social-auth-buttons new-password-form user-card
```

```tsx
import { useState } from "react";
import { SignInForm } from "@/components/ui/sign-in-form";

export default function SignInScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const onSubmit = async ({ emailAddress, password }) => {
    setLoading(true);
    setError(undefined);
    try {
      await signIn(emailAddress, password); // your auth provider
    } catch (e) {
      setError("Couldn't sign in.");
    } finally {
      setLoading(false);
    }
  };

  return <SignInForm onSubmit={onSubmit} loading={loading} error={error} />;
}
```

- **Sign up** — `SignUpForm` collects the account, then render `<OtpInput>` for the emailed verification code.
- **Social / SSO** — wire `SocialAuthButtons` `onSelect` to your provider's OAuth flow, using each provider's `key`.
- **Reset password** — request a code, verify with `<OtpInput>`, then `<NewPasswordForm>`.
- **Signed in** — pass the current user to `UserCard` and wire `onSignOut` to your provider's sign-out.

> The components carry **no** auth dependency — they're plain StyleSheet and work with any backend. The provider wiring lives entirely in your screens.

## Configuration

`stylesheet-ui.json` (created by `init`):

```json
{
  "version": "0.0.8",
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

To change paths or aliases, edit `stylesheet-ui.json` directly — the CLI re-reads it on every `add` and `update`. No need to re-run `init`.

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
npx stylesheet-ui init                  # set up stylesheet-ui.json + foundation
npx stylesheet-ui list                  # show every component (alias: ls)
npx stylesheet-ui add button            # add one or more components
npx stylesheet-ui update                # refresh every installed component (alias: up)
npx stylesheet-ui update button input   # refresh only the named components
```

Flags on `init`:

```sh
-y, --yes              # skip prompts, accept defaults
    --preset <name>    # mono | blue | green | violet | rose
```

Flags on `add` and `update`:

```sh
-y, --yes         # skip prompts; preserve files with local edits
-f, --force       # overwrite even files with local edits
-d, --dry-run     # preview what would change without writing
    --diff        # show a unified diff vs the registry version
-v, --verbose     # print one line per file copied
```

## Versioning

This package is pre-1.0. Breaking changes can ship in any `0.0.x` bump while the API stabilizes — pin a version (`stylesheet-ui@0.0.8`) if you need stability between upgrades. Once installed, components live in your repo as plain source, so a CLI version bump doesn't touch existing code unless you re-run `update`.

## Philosophy

The CLI copies real source into your project. Customize freely — no upstream "API" to break against. The library doesn't ship as a runtime dependency; only what you copy lives in your bundle.

## License

MIT
