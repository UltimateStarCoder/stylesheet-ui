import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://stylesheet-ui.dev",
  integrations: [
    starlight({
      title: "stylesheet-ui",
      description:
        "shadcn-style copy-paste components for Expo / React Native. Plain StyleSheet, no DSL.",
      social: {
        github: "https://github.com/UltimateStarCoder/stylesheet-ui",
      },
      sidebar: [
        { label: "Getting started", slug: "getting-started" },
        { label: "Theme", slug: "theme" },
        {
          label: "Layout",
          items: [
            "components/screen",
            "components/stack",
            "components/divider",
          ],
        },
        {
          label: "Display",
          items: [
            "components/text",
            "components/avatar",
            "components/badge",
            "components/card",
            "components/list-item",
            "components/settings-row",
          ],
        },
        {
          label: "Inputs",
          items: [
            "components/button",
            "components/input",
            "components/switch",
            "components/checkbox",
            "components/radio",
            "components/slider",
          ],
        },
        {
          label: "Overlays",
          items: [
            "components/modal",
            "components/tabs",
            "components/bottom-sheet",
            "components/toast",
          ],
        },
      ],
      customCss: ["./src/styles/custom.css"],
    }),
    mdx(),
  ],
});
