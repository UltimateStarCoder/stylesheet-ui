# stylesheet-ui

shadcn-style copy-paste components for Expo / React Native.

Plain `StyleSheet.create`. No DSL. No runtime. You own the source.

```sh
npx stylesheet-ui init
npx stylesheet-ui add button
```

See the [CLI README](packages/cli/README.md) for usage details.

## What's included

17 components grouped by purpose:

- **Layout:** Screen, Stack (+ HStack / VStack), Divider
- **Display:** Text, Avatar, Badge, Card, ListItem, SettingsRow
- **Inputs:** Button, Input, Switch, Checkbox, Radio, Slider
- **Overlays:** Modal, Tabs

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

Component sources live in `packages/ui/src`. Running `npm run registry:sync` copies them into `packages/cli/registry/files` and rebuilds each `<name>.json` manifest so the CLI ships the latest code.

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

The `prepublishOnly` hook in `packages/cli` runs `sync` then `build`, so publishing always ships a fresh registry:

```sh
npm publish --workspace stylesheet-ui
```

## License

MIT — see [packages/cli/LICENSE](packages/cli/LICENSE).
