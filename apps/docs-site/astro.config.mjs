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
          label: "Components",
          items: [
            "components/button",
            "components/input",
            "components/card",
            "components/text",
            "components/avatar",
            "components/badge",
            "components/list-item",
            "components/modal",
            "components/tabs",
            "components/settings-row",
          ],
        },
      ],
      customCss: ["./src/styles/custom.css"],
    }),
    mdx(),
  ],
});
