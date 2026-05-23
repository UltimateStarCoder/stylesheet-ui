# stylesheet-ui

Copy-paste React Native components for Expo, distributed as source you own.

Plain `StyleSheet.create`. No DSL. No runtime. No lock-in.

```sh
npx stylesheet-ui init
npx stylesheet-ui add button
```

See the [CLI README](packages/cli/README.md) for usage details.

## What's included

28 components grouped by purpose:

- **Layout:** Screen, Stack (+ HStack / VStack), Divider
- **Display:** Text, Avatar, Badge, Card, ListItem, SettingsRow, Skeleton
- **Inputs:** Button, Input, Switch, Checkbox, Radio, Slider, Select
- **Feedback:** Spinner, Progress, Alert, Toast
- **Overlays:** Modal, AlertDialog, Tabs, Accordion, BottomSheet, Menu, Tooltip

Plus theme tokens (colors light + dark, spacing, radius, typography, shadows) and a `useThemeMode()` hook for in-app Light / Dark / System toggles.

Run `npx stylesheet-ui list` to see them in your terminal.

## Repository layout

This is a monorepo. The published package lives in `packages/cli`; everything else exists to develop, document, and showcase it.

| Path | Description |
| --- | --- |
| [packages/cli](packages/cli) | The `stylesheet-ui` CLI published to npm. Owns the component registry. |
| [packages/ui](packages/ui) | Source of truth for component code and theme tokens. Synced into the CLI registry at build time. |
| [apps/docs-app](apps/docs-app) | Expo Router showcase app that consumes `@stylesheet-ui/ui` directly. |
| [apps/docs-site](apps/docs-site) | Astro + Starlight documentation site. Embeds the exported docs-app web build. |

Component sources live in `packages/ui/src`. Running `npm run registry:sync` copies them into `packages/cli/registry/files` and validates that every hand-authored `<name>.json` manifest declares its imports correctly.

## Development

```sh
npm install            # install workspace deps
npm run dev            # start the Expo docs app
npm run cli:dev        # watch-build the CLI
npm run registry:sync  # sync ui/ -> cli/registry
npm run typecheck      # typecheck all workspaces
```

To preview a CLI change end-to-end:

```sh
npm run cli:build
node packages/cli/dist/index.js add button   # run against a test project
```

## Publishing

CI publishes automatically when you push a `v*.*.*` tag (see [.github/workflows/publish-cli.yml](.github/workflows/publish-cli.yml)):

```sh
# bump packages/cli/package.json version, commit, then:
git tag v0.0.4
git push origin v0.0.4
```

The workflow verifies the tag matches `package.json`, runs typecheck + registry sync + build, and publishes with npm provenance. Requires an `NPM_TOKEN` repo secret.

To publish manually instead:

```sh
npm publish --workspace stylesheet-ui
```

The `prepublishOnly` hook in `packages/cli` runs `sync` then `build`, so either path ships a fresh registry.

## License

MIT — see [packages/cli/LICENSE](packages/cli/LICENSE).
